/**
 * payment.js
 *
 * Stripe integration:
 *
 *   GET  /payment/session/:sessionId  — fetch Checkout Session details for the success page
 *   POST /payment/webhook             — handle Stripe events (registered in server.js)
 *
 * Webhook events handled:
 *   checkout.session.completed  → mark booking as paid, send confirmation email to customer
 */

import { Router } from 'express'
import Stripe from 'stripe'
import rateLimit from 'express-rate-limit'
import { sendEmail }              from '../lib/mailer.js'
import { getBooking, setBooking } from '../lib/store.js'

const router  = Router()
const limiter = rateLimit({ windowMs: 60_000, max: 30, standardHeaders: true })

/* ─── helpers ────────────────────────────────────────────────── */

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

function stripeConfigured() {
  const key = process.env.STRIPE_SECRET_KEY
  return key && !key.includes('YOUR_')
}

/* ─── Email template ─────────────────────────────────────────── */

function paymentConfirmationTemplate({ bookingId, pickup, destination, date, time,
  passengers, priceFormatted, companyName }) {
  const subject = 'Payment Confirmed — Your Transfer is Booked!'

  const text = `Hello,

Your payment has been received and your transfer is confirmed.

BOOKING CONFIRMATION
────────────────────
Booking ID:   ${bookingId}
Pickup:       ${pickup}
Destination:  ${destination}
Date:         ${date}
Time:         ${time}
Passengers:   ${passengers}
Amount Paid:  ${priceFormatted}

We look forward to seeing you!

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
  .badge{display:inline-block;background:#dcfce7;color:#166534;font-size:12px;
         font-weight:700;padding:4px 12px;border-radius:9999px;margin-top:10px}
  .body{padding:28px 32px}
  .icon{font-size:48px;text-align:center;margin-bottom:16px}
  .intro{font-size:15px;color:#475569;line-height:1.6;margin-bottom:20px;text-align:center}
  .label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
         color:#94a3b8;margin:20px 0 10px}
  .row{display:flex;justify-content:space-between;align-items:baseline;
       padding:9px 0;border-bottom:1px solid #f1f5f9;font-size:14px;gap:12px}
  .row:last-child{border-bottom:none}
  .lbl{color:#64748b;flex-shrink:0}.val{font-weight:600;text-align:right;word-break:break-word}
  .price-row .val{font-size:18px;color:#166534}
  .ftr{background:#f8fafc;padding:16px 32px;text-align:center;font-size:11px;color:#94a3b8}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <h1>${companyName}</h1>
    <span class="badge">✓ Payment Confirmed</span>
  </div>
  <div class="body">
    <div class="icon">🎉</div>
    <p class="intro">Your payment was successful and your transfer is fully confirmed. We'll be there!</p>
    <p class="label">Booking Details</p>
    <div class="row"><span class="lbl">Booking ID</span><span class="val">${bookingId}</span></div>
    <div class="row"><span class="lbl">Pickup</span><span class="val">${pickup}</span></div>
    <div class="row"><span class="lbl">Destination</span><span class="val">${destination}</span></div>
    <div class="row"><span class="lbl">Date</span><span class="val">${date}</span></div>
    <div class="row"><span class="lbl">Time</span><span class="val">${time}</span></div>
    <div class="row"><span class="lbl">Passengers</span><span class="val">${passengers}</span></div>
    <div class="row price-row"><span class="lbl">Amount Paid</span><span class="val">${priceFormatted}</span></div>
  </div>
  <div class="ftr">${companyName} · Private Transfers Along the Dalmatian Coast</div>
</div>
</body>
</html>`

  return { subject, text, html }
}

/* ═══════════════════════════════════════════════════════════════
   ROUTES
   ═══════════════════════════════════════════════════════════════ */

/**
 * GET /payment/session/:sessionId
 *
 * Called by the frontend PaymentSuccess page after Stripe redirects the
 * customer back with ?session_id=cs_xxx.  Returns the booking summary so
 * the page can display a confirmation without exposing internal data.
 */
router.get('/session/:sessionId', limiter, async (req, res) => {
  if (!stripeConfigured()) {
    // Stripe not set up yet — the success page handles this gracefully
    return res.status(503).json({ error: 'Payment provider not configured' })
  }

  try {
    const stripe  = getStripe()
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId)
    const bookingId = session.metadata?.bookingId

    if (!bookingId) {
      return res.status(400).json({ error: 'No bookingId in session metadata' })
    }

    const booking = getBooking(bookingId)
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    // Return only what the UI needs
    res.json({
      bookingId:      booking.bookingId,
      pickup:         booking.pickup,
      destination:    booking.destination,
      date:           booking.date,
      time:           booking.time,
      passengers:     booking.passengers,
      priceFormatted: booking.priceFormatted,
      status:         booking.status,
      paymentStatus:  session.payment_status,
    })
  } catch (err) {
    console.error('[payment/session]', err.message)
    res.status(500).json({ error: 'Could not retrieve session' })
  }
})

/* ═══════════════════════════════════════════════════════════════
   WEBHOOK
   ═══════════════════════════════════════════════════════════════ */

/**
 * POST /payment/webhook
 *
 * Registered in server.js with express.raw() BEFORE express.json(),
 * so req.body is the raw Buffer that Stripe needs for signature verification.
 *
 * Handles:
 *   checkout.session.completed  → mark booking paid, email customer
 */
export function webhookHandler(req, res) {
  if (!stripeConfigured()) {
    console.warn('[webhook] Stripe not configured — ignoring webhook')
    return res.json({ received: true })
  }

  const sig    = req.headers['stripe-signature']
  const stripe = getStripe()

  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }

  // Handle events asynchronously but respond immediately so Stripe doesn't retry
  handleEvent(event).catch(err => console.error('[webhook] Handler error:', err.message))

  res.json({ received: true })
}

async function handleEvent(event) {
  if (event.type === 'checkout.session.completed') {
    const session   = event.data.object
    const bookingId = session.metadata?.bookingId

    if (!bookingId) {
      console.warn('[webhook] checkout.session.completed has no bookingId in metadata')
      return
    }

    const booking = getBooking(bookingId)
    if (!booking) {
      console.warn('[webhook] Booking not found for id:', bookingId)
      return
    }

    // Mark as paid
    booking.status  = 'paid'
    booking.paidAt  = new Date().toISOString()
    booking.stripeSessionId = session.id
    setBooking(bookingId, booking)
    console.log('[webhook] Booking marked as paid:', bookingId)

    // Send confirmation email to customer
    const companyName = process.env.COMPANY_NAME || 'QuickRide Croatia'
    try {
      const emailContent = paymentConfirmationTemplate({
        ...booking,
        priceFormatted: booking.priceFormatted ?? `€${(session.amount_total / 100).toFixed(2)}`,
        companyName,
      })
      await sendEmail({ to: booking.customerEmail, ...emailContent })
      console.log('[webhook] Payment confirmation email sent to', booking.customerEmail)
    } catch (err) {
      console.error('[webhook] Confirmation email failed:', err.message)
    }
  }
}

export default router
