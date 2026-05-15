/**
 * booking-request.js
 *
 * Handles the manual-approval transfer booking flow:
 *
 *   POST /booking-request                      — create pending request, email driver
 *   GET  /booking-request/:id/approve?token=…  — approve (browser link in driver email)
 *   POST /booking-request/:id/approve?token=…  — approve (programmatic)
 *   POST /booking-request/:id/reject?token=…   — reject
 *   GET  /booking-request/:id?token=…          — view booking details
 *
 * On approval the handler:
 *   1. Calculates price (€5/km via pricing.js)
 *   2. Creates a Stripe Checkout Session
 *   3. Emails the customer the real Stripe payment URL
 *
 * Security: approval is gated by an HMAC-SHA256 token derived from the
 * bookingId and a server-side secret (APPROVAL_TOKEN_SECRET env var).
 * The token is burned on first use to prevent replay attacks.
 */

import { Router }   from 'express'
import { createHmac, randomBytes } from 'crypto'
import rateLimit    from 'express-rate-limit'
import Stripe       from 'stripe'
import { sendEmail }             from '../lib/mailer.js'
import { getBooking, setBooking } from '../lib/store.js'
import { calculatePriceCents, formatEuro } from '../lib/pricing.js'

const router = Router()

/* ── Rate limiting ───────────────────────────────────────────── */
const submitLimiter = rateLimit({ windowMs: 60_000, max: 10, standardHeaders: true })

/* ── Token helpers ───────────────────────────────────────────── */

function makeApprovalToken(bookingId) {
  const secret = process.env.APPROVAL_TOKEN_SECRET || 'dev-secret-CHANGE-IN-PRODUCTION'
  return createHmac('sha256', secret).update(bookingId).digest('hex')
}

function verifyApprovalToken(bookingId, candidateToken) {
  if (!candidateToken) return false
  const expected = makeApprovalToken(bookingId)
  if (expected.length !== candidateToken.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ candidateToken.charCodeAt(i)
  }
  return diff === 0
}

/* ── ID generator ────────────────────────────────────────────── */
function newBookingId() {
  return `QR-${Date.now()}-${randomBytes(3).toString('hex').toUpperCase()}`
}

/* ═══════════════════════════════════════════════════════════════
   EMAIL TEMPLATES
   ═══════════════════════════════════════════════════════════════ */

function driverEmailTemplate({ bookingId, pickup, destination, date, time,
  passengers, extras, customerEmail, submittedAt, approvalLink, distanceKm }) {
  const { luggage, babySeat, petCage, bikes } = extras
  const yn = v => v ? 'Yes' : 'No'
  const distanceStr = distanceKm ? `${distanceKm.toFixed(1)} km` : 'Unknown'

  const subject = `New Booking Request – ${pickup} to ${destination} on ${date}`

  const text = `Hello,

A new booking request has been submitted.

BOOKING DETAILS
───────────────
Booking ID:    ${bookingId}
Pickup:        ${pickup}
Destination:   ${destination}
Date:          ${date}
Time:          ${time}
Passengers:    ${passengers}
Distance:      ${distanceStr}

EXTRAS
──────
Extra luggage:  ${yn(luggage)}
Baby seat:      ${yn(babySeat)}
Pet cage:       ${yn(petCage)}
Bike transport: ${yn(bikes)}

CUSTOMER
────────
Email: ${customerEmail}

Submitted: ${new Date(submittedAt).toUTCString()}

──────────────────────────────────────────
Please review and approve if available:
${approvalLink}
──────────────────────────────────────────

Regards,
QuickRide Booking System`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
       background:#f1f5f9;padding:24px 12px;color:#1e293b}
  .wrap{max-width:560px;margin:0 auto;background:#fff;border-radius:16px;
        overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
  .hdr{background:linear-gradient(135deg,#0f2b3d,#1e5f8e);padding:28px 32px}
  .hdr h1{color:#fff;font-size:20px;font-weight:700}
  .hdr p{color:#93c5fd;font-size:13px;margin-top:6px}
  .body{padding:28px 32px}
  .label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
         color:#94a3b8;margin:20px 0 10px}
  .label:first-child{margin-top:0}
  .row{display:flex;justify-content:space-between;align-items:baseline;
       padding:9px 0;border-bottom:1px solid #f1f5f9;font-size:14px;gap:12px}
  .row:last-child{border-bottom:none}
  .lbl{color:#64748b;flex-shrink:0}.val{font-weight:600;text-align:right;word-break:break-word}
  .extras{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px}
  .tag{padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;text-align:center}
  .yes{background:#dcfce7;color:#166534}.no{background:#f1f5f9;color:#64748b}
  .approve{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;
           padding:24px;margin:24px 0;text-align:center}
  .approve p{color:#15803d;font-size:14px;margin-bottom:16px}
  .btn{display:inline-block;background:#16a34a;color:#fff;text-decoration:none;
       padding:13px 28px;border-radius:9999px;font-weight:700;font-size:15px}
  .ftr{background:#f8fafc;padding:16px 32px;text-align:center;font-size:11px;color:#94a3b8}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <h1>New Booking Request</h1>
    <p>ID: ${bookingId} · ${new Date(submittedAt).toUTCString()}</p>
  </div>
  <div class="body">
    <p class="label">Booking Details</p>
    <div class="row"><span class="lbl">Pickup</span><span class="val">${pickup}</span></div>
    <div class="row"><span class="lbl">Destination</span><span class="val">${destination}</span></div>
    <div class="row"><span class="lbl">Date</span><span class="val">${date}</span></div>
    <div class="row"><span class="lbl">Time</span><span class="val">${time}</span></div>
    <div class="row"><span class="lbl">Passengers</span><span class="val">${passengers}</span></div>
    <div class="row"><span class="lbl">Distance</span><span class="val">${distanceStr}</span></div>

    <p class="label">Extras</p>
    <div class="extras">
      <span class="tag ${luggage  ? 'yes' : 'no'}">📦 Extra Luggage: ${yn(luggage)}</span>
      <span class="tag ${babySeat ? 'yes' : 'no'}">👶 Baby Seat: ${yn(babySeat)}</span>
      <span class="tag ${petCage  ? 'yes' : 'no'}">🐾 Pet Cage: ${yn(petCage)}</span>
      <span class="tag ${bikes    ? 'yes' : 'no'}">🚲 Bikes: ${yn(bikes)}</span>
    </div>

    <p class="label">Customer</p>
    <div class="row"><span class="lbl">Email</span><span class="val">${customerEmail}</span></div>

    <div class="approve">
      <p>Review this transfer request and approve if you are available.</p>
      <a href="${approvalLink}" class="btn">✓ Approve This Booking</a>
    </div>
  </div>
  <div class="ftr">QuickRide Booking System · Automated message</div>
</div>
</body>
</html>`

  return { subject, text, html }
}

function customerApprovalEmailTemplate({ bookingId, pickup, destination, date, time,
  passengers, extras, paymentLink, companyName, priceFormatted }) {
  const { luggage, babySeat, petCage, bikes } = extras
  const yn = v => v ? 'Yes' : 'No'

  const subject = 'Your Transfer Request Has Been Approved — QuickRide'

  const text = `Hello,

Your transfer request has been approved.

TRIP SUMMARY
────────────
Pickup:        ${pickup}
Destination:   ${destination}
Date:          ${date}
Time:          ${time}
Passengers:    ${passengers}
Total Price:   ${priceFormatted}

SELECTED EXTRAS
───────────────
Extra luggage:  ${yn(luggage)}
Baby seat:      ${yn(babySeat)}
Pet cage:       ${yn(petCage)}
Bike transport: ${yn(bikes)}

To confirm your booking, please complete payment using the link below:

${paymentLink}

If you have any questions, please reply to this email.

Thank you,
${companyName}`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
       background:#f1f5f9;padding:24px 12px;color:#1e293b}
  .wrap{max-width:560px;margin:0 auto;background:#fff;border-radius:16px;
        overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
  .hdr{background:linear-gradient(135deg,#0f2b3d,#1e5f8e);padding:28px 32px}
  .hdr h1{color:#fff;font-size:20px;font-weight:700}
  .hdr p{color:#93c5fd;font-size:13px;margin-top:6px}
  .badge{display:inline-block;background:#dcfce7;color:#166534;font-size:12px;
         font-weight:700;padding:4px 12px;border-radius:9999px;margin-top:10px}
  .body{padding:28px 32px}
  .intro{font-size:15px;color:#475569;line-height:1.6;margin-bottom:20px}
  .label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
         color:#94a3b8;margin:20px 0 10px}
  .label:first-child{margin-top:0}
  .row{display:flex;justify-content:space-between;align-items:baseline;
       padding:9px 0;border-bottom:1px solid #f1f5f9;font-size:14px;gap:12px}
  .row:last-child{border-bottom:none}
  .lbl{color:#64748b;flex-shrink:0}.val{font-weight:600;text-align:right;word-break:break-word}
  .price-row .val{font-size:18px;color:#1e40af}
  .extras{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px}
  .tag{padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;text-align:center}
  .yes{background:#dcfce7;color:#166534}.no{background:#f1f5f9;color:#64748b}
  .pay-box{background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;
           padding:24px;margin:24px 0;text-align:center}
  .pay-box h2{color:#1e40af;font-size:17px;margin-bottom:8px}
  .pay-box p{color:#3b82f6;font-size:14px;margin-bottom:18px}
  .btn{display:inline-block;background:#2563eb;color:#fff;text-decoration:none;
       padding:14px 32px;border-radius:9999px;font-weight:700;font-size:15px}
  .note{text-align:center;font-size:12px;color:#94a3b8;margin-top:16px}
  .ftr{background:#f8fafc;padding:16px 32px;text-align:center;font-size:11px;color:#94a3b8}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <h1>${companyName}</h1>
    <p>Your Private Transfer</p>
    <span class="badge">✓ Approved</span>
  </div>
  <div class="body">
    <p class="intro">Great news — your transfer request has been approved. Please complete your payment to confirm the booking.</p>

    <p class="label">Trip Summary</p>
    <div class="row"><span class="lbl">Pickup</span><span class="val">${pickup}</span></div>
    <div class="row"><span class="lbl">Destination</span><span class="val">${destination}</span></div>
    <div class="row"><span class="lbl">Date</span><span class="val">${date}</span></div>
    <div class="row"><span class="lbl">Time</span><span class="val">${time}</span></div>
    <div class="row"><span class="lbl">Passengers</span><span class="val">${passengers}</span></div>
    <div class="row price-row"><span class="lbl">Total Price</span><span class="val">${priceFormatted}</span></div>

    <p class="label">Selected Extras</p>
    <div class="extras">
      <span class="tag ${luggage  ? 'yes' : 'no'}">📦 Extra Luggage: ${yn(luggage)}</span>
      <span class="tag ${babySeat ? 'yes' : 'no'}">👶 Baby Seat: ${yn(babySeat)}</span>
      <span class="tag ${petCage  ? 'yes' : 'no'}">🐾 Pet Cage: ${yn(petCage)}</span>
      <span class="tag ${bikes    ? 'yes' : 'no'}">🚲 Bikes: ${yn(bikes)}</span>
    </div>

    <div class="pay-box">
      <h2>Complete Your Payment</h2>
      <p>Click below to pay securely and confirm your transfer.</p>
      <a href="${paymentLink}" class="btn">Pay ${priceFormatted} &amp; Confirm Booking</a>
    </div>

    <p class="note">Booking ID: ${bookingId}<br>Questions? Reply to this email and we'll be happy to help.</p>
  </div>
  <div class="ftr">${companyName} · Private Transfers Along the Dalmatian Coast</div>
</div>
</body>
</html>`

  return { subject, text, html }
}

/* ═══════════════════════════════════════════════════════════════
   STRIPE CHECKOUT SESSION
   ═══════════════════════════════════════════════════════════════ */

/**
 * Create a Stripe Checkout Session for the approved booking.
 * Returns the session URL the customer will use to pay.
 *
 * If STRIPE_SECRET_KEY is not configured, returns null so the caller
 * can fall back gracefully until keys are available.
 */
async function createCheckoutSession(booking, priceCents, frontendUrl) {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key || key.includes('YOUR_')) {
    console.warn('[stripe] STRIPE_SECRET_KEY not configured — skipping checkout session creation')
    return null
  }

  const stripe = new Stripe(key)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency:     'eur',
          unit_amount:  priceCents,
          product_data: {
            name:        `Private Transfer — ${booking.pickup} → ${booking.destination}`,
            description: `${booking.date} at ${booking.time} · ${booking.passengers} passenger(s)`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: booking.bookingId,
    },
    customer_email: booking.customerEmail,
    // Stripe replaces {CHECKOUT_SESSION_ID} in the URL automatically
    success_url: `${frontendUrl}/payment-success?booking=${booking.bookingId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${frontendUrl}/booking`,
  })

  return session.url
}

/* ═══════════════════════════════════════════════════════════════
   ROUTES
   ═══════════════════════════════════════════════════════════════ */

/* ── POST /booking-request ────────────────────────────────────── */
router.post('/', submitLimiter, async (req, res) => {
  const { pickup, destination, date, time, passengers, extras, email, distanceKm } = req.body

  if (!pickup || !destination || !date || !time || !email) {
    return res.status(400).json({ error: 'pickup, destination, date, time and email are required' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }
  const pax = parseInt(passengers, 10) || 1
  if (pax < 1 || pax > 8) {
    return res.status(400).json({ error: 'Passengers must be between 1 and 8' })
  }

  const parsedDistanceKm = distanceKm ? parseFloat(distanceKm) : null

  const bookingId     = newBookingId()
  const approvalToken = makeApprovalToken(bookingId)
  const submittedAt   = new Date().toISOString()

  const safeExtras = {
    luggage:  Boolean(extras?.luggage),
    babySeat: Boolean(extras?.babySeat),
    petCage:  Boolean(extras?.petCage),
    bikes:    Boolean(extras?.bikes),
  }

  const booking = {
    bookingId,
    pickup:         String(pickup).trim(),
    destination:    String(destination).trim(),
    date:           String(date),
    time:           String(time),
    passengers:     pax,
    extras:         safeExtras,
    customerEmail:  String(email).trim().toLowerCase(),
    distanceKm:     parsedDistanceKm,
    submittedAt,
    status:         'pending', // pending | approved | rejected | paid
    _approvalToken: approvalToken,
    _tokenUsed:     false,
  }

  setBooking(bookingId, booking)

  const baseUrl      = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3001}`
  const approvalLink = `${baseUrl}/booking-request/${bookingId}/approve?token=${approvalToken}`

  const driverEmailAddress = process.env.DRIVER_EMAIL || 'mateospace93@gmail.com'
  try {
    const emailContent = driverEmailTemplate({ ...booking, approvalLink })
    await sendEmail({ to: driverEmailAddress, ...emailContent })
    console.log('[booking-request] Driver email sent')
  } catch (err) {
    console.error('[booking-request] Driver email failed:', err.message)
  }

  console.log('[booking-request] Created', bookingId, {
    pickup: booking.pickup,
    destination: booking.destination,
    distanceKm: parsedDistanceKm,
    email: booking.customerEmail,
  })

  res.status(201).json({ bookingId, status: 'pending' })
})

/* ── Shared approval handler (GET + POST) ─────────────────────── */
async function handleApprove(req, res) {
  const { id }    = req.params
  const { token } = req.query

  const booking = getBooking(id)
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' })
  }
  if (!verifyApprovalToken(id, token)) {
    return res.status(403).json({ error: 'Invalid or missing approval token' })
  }
  if (booking._tokenUsed) {
    return res.status(409).json({ error: 'This approval link has already been used' })
  }
  if (booking.status === 'approved') {
    return res.status(409).json({ error: 'Booking is already approved' })
  }
  if (booking.status === 'rejected') {
    return res.status(409).json({ error: 'Booking was rejected and cannot be approved' })
  }

  // ── 1. Calculate price ─────────────────────────────────────────
  const priceCents    = calculatePriceCents(booking.distanceKm ?? 0)
  const priceFormatted = formatEuro(priceCents)

  // ── 2. Create Stripe Checkout Session ──────────────────────────
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
  let paymentLink

  try {
    const sessionUrl = await createCheckoutSession(booking, priceCents, frontendUrl)
    if (sessionUrl) {
      paymentLink = sessionUrl
      console.log('[booking-request] Stripe Checkout Session created for', id)
    } else {
      // Stripe not configured yet — use fallback URL so the rest of the flow still works
      paymentLink = `${frontendUrl}/payment-success?booking=${id}&demo=1`
      console.warn('[booking-request] Using fallback payment link (Stripe not configured)')
    }
  } catch (err) {
    console.error('[booking-request] Stripe session creation failed:', err.message)
    paymentLink = `${frontendUrl}/payment-success?booking=${id}&demo=1`
  }

  // ── 3. Update booking and burn token ───────────────────────────
  booking.status        = 'approved'
  booking.approvedAt    = new Date().toISOString()
  booking._tokenUsed    = true
  booking.priceCents    = priceCents
  booking.priceFormatted = priceFormatted
  booking.paymentLink   = paymentLink
  setBooking(id, booking)

  // ── 4. Email customer with payment link ────────────────────────
  const companyName = process.env.COMPANY_NAME || 'QuickRide Croatia'
  try {
    const emailContent = customerApprovalEmailTemplate({
      ...booking, paymentLink, companyName, priceFormatted,
    })
    await sendEmail({ to: booking.customerEmail, ...emailContent })
    console.log('[booking-request] Approval email sent to', booking.customerEmail)
  } catch (err) {
    console.error('[booking-request] Customer email failed:', err.message)
  }

  console.log('[booking-request] Approved', id, { price: priceFormatted })

  // ── 5. Respond ─────────────────────────────────────────────────
  if (req.method === 'GET') {
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Booking Approved — QuickRide</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
       background:#f0fdf4;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
  .card{background:#fff;border-radius:20px;padding:48px 40px;max-width:480px;
        text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.1)}
  .icon{font-size:56px;margin-bottom:20px}
  h1{color:#166534;font-size:24px;font-weight:800;margin-bottom:12px}
  p{color:#374151;font-size:15px;line-height:1.6;margin-bottom:8px}
  .id{margin-top:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;
      padding:8px 16px;font-size:13px;color:#15803d;font-weight:600}
  .price{margin-top:12px;font-size:22px;font-weight:800;color:#1e40af}
</style>
</head>
<body>
<div class="card">
  <div class="icon">✅</div>
  <h1>Booking Approved!</h1>
  <p>The customer will receive their payment link by email shortly.</p>
  <div class="price">${priceFormatted}</div>
  <div class="id">Booking ID: ${id}</div>
</div>
</body>
</html>`)
  }

  res.json({ bookingId: id, status: 'approved', priceCents, priceFormatted })
}

router.get( '/:id/approve', handleApprove)
router.post('/:id/approve', handleApprove)

/* ── POST /booking-request/:id/reject ─────────────────────────── */
router.post('/:id/reject', async (req, res) => {
  const { id }    = req.params
  const { token } = req.query

  const booking = getBooking(id)
  if (!booking) return res.status(404).json({ error: 'Booking not found' })
  if (!verifyApprovalToken(id, token)) return res.status(403).json({ error: 'Invalid token' })
  if (booking._tokenUsed) return res.status(409).json({ error: 'Token already used' })
  if (booking.status !== 'pending') {
    return res.status(409).json({ error: `Booking is already ${booking.status}` })
  }

  booking.status     = 'rejected'
  booking.rejectedAt = new Date().toISOString()
  booking._tokenUsed = true
  setBooking(id, booking)

  console.log('[booking-request] Rejected', id)
  res.json({ bookingId: id, status: 'rejected' })
})

/* ── GET /booking-request/:id ─────────────────────────────────── */
router.get('/:id', (req, res) => {
  const { id }    = req.params
  const { token } = req.query

  const booking = getBooking(id)
  if (!booking) return res.status(404).json({ error: 'Booking not found' })

  if (token && verifyApprovalToken(id, token)) {
    const { _approvalToken, _tokenUsed, ...safe } = booking
    return res.json(safe)
  }

  res.json({ bookingId: id, status: booking.status })
})

export default router
