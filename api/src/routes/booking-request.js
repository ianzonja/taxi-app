/**
 * booking-request.js
 *
 * Handles the manual-approval transfer booking flow:
 *
 *   POST /booking-request            — create pending request, email driver
 *   GET  /booking-request/:id/approve?token=… — approve (browser link in email)
 *   POST /booking-request/:id/approve?token=… — approve (programmatic)
 *   POST /booking-request/:id/reject?token=…  — reject
 *   GET  /booking-request/:id?token=…         — view booking details
 *
 * Security: approval is gated by an HMAC-SHA256 token derived from the
 * bookingId and a server-side secret (APPROVAL_TOKEN_SECRET env var).
 * A one-time token burned on first use prevents replay.
 */

import { Router } from 'express'
import { createHmac, randomBytes } from 'crypto'
import rateLimit from 'express-rate-limit'

const router = Router()

/* ── Rate limiting ───────────────────────────────────────────── */
const submitLimiter = rateLimit({ windowMs: 60_000, max: 10, standardHeaders: true })

/* ── In-memory store ─────────────────────────────────────────── */
// TODO: replace with a real database (PostgreSQL, SQLite, etc.) in production.
// The Map is keyed by bookingId and holds the full booking object.
const bookingStore = new Map()

/* ── Token helpers ───────────────────────────────────────────── */

/**
 * Generate a deterministic HMAC-SHA256 approval token.
 * The token is derived from the bookingId + a server secret so it cannot be
 * forged without knowing the secret, and it is unique per booking.
 */
function makeApprovalToken(bookingId) {
  const secret = process.env.APPROVAL_TOKEN_SECRET || 'dev-secret-CHANGE-IN-PRODUCTION'
  return createHmac('sha256', secret).update(bookingId).digest('hex')
}

/** Constant-time comparison prevents timing attacks. */
function verifyApprovalToken(bookingId, candidateToken) {
  if (!candidateToken) return false
  const expected = makeApprovalToken(bookingId)
  if (expected.length !== candidateToken.length) return false
  // Simple character comparison is fine here because hex strings are fixed length
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

/**
 * Email sent to the driver / company when a new request is submitted.
 * Contains all booking details + a one-click approval link.
 */
function driverEmailTemplate({ bookingId, pickup, destination, date, time,
  passengers, extras, customerEmail, submittedAt, approvalLink }) {
  const { luggage, babySeat, petCage, bikes } = extras
  const yn = v => v ? 'Yes' : 'No'

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

/**
 * Email sent to the customer after the driver approves the request.
 * Contains a summary and a payment link.
 */
function customerApprovalEmailTemplate({ bookingId, pickup, destination, date, time,
  passengers, extras, paymentLink, companyName }) {
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
      <a href="${paymentLink}" class="btn">Pay &amp; Confirm Booking</a>
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
   EMAIL SENDER
   ═══════════════════════════════════════════════════════════════ */

/**
 * Send an email via nodemailer.
 *
 * If SMTP_HOST is not configured (development), the email is logged to the
 * console so the flow can be tested without a real mail server.
 *
 * Required env vars (set in api/.env):
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM
 */
async function sendEmail({ to, subject, text, html }) {
  if (!process.env.SMTP_HOST) {
    // Development fallback — print to console instead of sending
    console.log('\n── [email] Would send ─────────────────────────────')
    console.log(`To:      ${to}`)
    console.log(`Subject: ${subject}`)
    console.log('Text:\n' + text)
    console.log('─────────────────────────────────────────────────\n')
    return
  }

  // Dynamic import keeps nodemailer out of the module scope during testing
  // or when the dependency isn't installed, making the startup error clearer.
  const nodemailer = (await import('nodemailer')).default

  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT   || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from:    process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  })
}

/* ═══════════════════════════════════════════════════════════════
   ROUTES
   ═══════════════════════════════════════════════════════════════ */

/* ── POST /booking-request ────────────────────────────────────── */
router.post('/', submitLimiter, async (req, res) => {
  const { pickup, destination, date, time, passengers, extras, email } = req.body

  // Validate required fields
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
    submittedAt,
    status:         'pending', // pending | approved | rejected
    // approvalToken is stored server-side; never exposed in API responses
    _approvalToken: approvalToken,
    // tokenUsed prevents replay after approval
    _tokenUsed:     false,
  }

  bookingStore.set(bookingId, booking)

  // Build the approval URL
  const baseUrl      = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3001}`
  const approvalLink = `${baseUrl}/booking-request/${bookingId}/approve?token=${approvalToken}`

  // Send notification to driver
  const driverEmailAddress = process.env.DRIVER_EMAIL || 'mateospace93@gmail.com'
  console.log('[email] Attempting to send to:', driverEmailAddress)
  console.log('[email] SMTP config — host:', process.env.SMTP_HOST, 'port:', process.env.SMTP_PORT, 'user:', process.env.SMTP_USER)
  try {
    const emailContent = driverEmailTemplate({ ...booking, approvalLink })
    await sendEmail({ to: driverEmailAddress, ...emailContent })
    console.log('[email] Sent successfully')
  } catch (err) {
    console.error('[email] FAILED:', err.message)
    console.error('[email] Full error:', err)
  }

  console.log('[booking-request] Created', bookingId, { pickup: booking.pickup, destination: booking.destination, email: booking.customerEmail })

  res.status(201).json({ bookingId, status: 'pending' })
})

/* ── Shared approval handler (GET + POST) ─────────────────────── */
async function handleApprove(req, res) {
  const { id }    = req.params
  const { token } = req.query

  const booking = bookingStore.get(id)
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

  // Approve and burn the token
  booking.status     = 'approved'
  booking.approvedAt = new Date().toISOString()
  booking._tokenUsed = true
  bookingStore.set(id, booking)

  // Build payment link
  // Replace PAYMENT_LINK_BASE with your real payment provider URL in production.
  const paymentLink = process.env.PAYMENT_LINK_BASE
    ? `${process.env.PAYMENT_LINK_BASE}?booking=${id}`
    : `https://pay.quickride.com?booking=${id}` // TODO: replace with real payment link

  const companyName = process.env.COMPANY_NAME || 'QuickRide Croatia'

  // Send approval + payment email to customer
  try {
    const emailContent = customerApprovalEmailTemplate({ ...booking, paymentLink, companyName })
    await sendEmail({ to: booking.customerEmail, ...emailContent })
    console.log('[booking-request] Approval email sent to', booking.customerEmail)
  } catch (err) {
    console.error('[booking-request] Customer email failed:', err.message)
  }

  console.log('[booking-request] Approved', id)

  // If accessed via browser link (GET), return a friendly HTML confirmation page
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
  .card{background:#fff;border-radius:20px;padding:48px 40px;max-width:440px;
        text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.1)}
  .icon{font-size:56px;margin-bottom:20px}
  h1{color:#166534;font-size:24px;font-weight:800;margin-bottom:12px}
  p{color:#374151;font-size:15px;line-height:1.6}
  .id{margin-top:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;
      padding:8px 16px;font-size:13px;color:#15803d;font-weight:600}
</style>
</head>
<body>
<div class="card">
  <div class="icon">✅</div>
  <h1>Booking Approved!</h1>
  <p>The booking has been approved and the customer will receive their invoice email shortly.</p>
  <div class="id">Booking ID: ${id}</div>
</div>
</body>
</html>`)
  }

  res.json({ bookingId: id, status: 'approved' })
}

router.get( '/:id/approve', handleApprove)
router.post('/:id/approve', handleApprove)

/* ── POST /booking-request/:id/reject ─────────────────────────── */
router.post('/:id/reject', async (req, res) => {
  const { id }    = req.params
  const { token } = req.query

  const booking = bookingStore.get(id)
  if (!booking) return res.status(404).json({ error: 'Booking not found' })
  if (!verifyApprovalToken(id, token)) return res.status(403).json({ error: 'Invalid token' })
  if (booking._tokenUsed) return res.status(409).json({ error: 'Token already used' })
  if (booking.status !== 'pending') {
    return res.status(409).json({ error: `Booking is already ${booking.status}` })
  }

  booking.status     = 'rejected'
  booking.rejectedAt = new Date().toISOString()
  booking._tokenUsed = true
  bookingStore.set(id, booking)

  console.log('[booking-request] Rejected', id)
  res.json({ bookingId: id, status: 'rejected' })
})

/* ── GET /booking-request/:id ─────────────────────────────────── */
// Returns status publicly; returns full details only if valid token provided.
router.get('/:id', (req, res) => {
  const { id }    = req.params
  const { token } = req.query

  const booking = bookingStore.get(id)
  if (!booking) return res.status(404).json({ error: 'Booking not found' })

  if (token && verifyApprovalToken(id, token)) {
    // Full view for admin (strip internal fields)
    const { _approvalToken, _tokenUsed, ...safe } = booking
    return res.json(safe)
  }

  // Public: status only
  res.json({ bookingId: id, status: booking.status })
})

export default router
