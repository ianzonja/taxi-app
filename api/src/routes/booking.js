import { Router } from 'express'
import Stripe from 'stripe'
import rateLimit from 'express-rate-limit'

const router = Router()

const limiter = rateLimit({ windowMs: 60_000, max: 10, standardHeaders: true })

router.post('/', limiter, async (req, res) => {
  const { pickup, dropoff, rideType, date, time, paymentIntentId } = req.body

  if (!pickup || !dropoff || !rideType) {
    return res.status(400).json({ error: 'pickup, dropoff and rideType are required' })
  }

  const validTypes = ['economy', 'comfort', 'premium']
  if (!validTypes.includes(rideType)) {
    return res.status(400).json({ error: 'Invalid rideType' })
  }

  if (!paymentIntentId) {
    return res.status(402).json({ error: 'Payment required' })
  }

  // Verify the payment actually succeeded with Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (paymentIntent.status !== 'succeeded') {
      return res.status(402).json({ error: 'Payment not completed' })
    }
  } catch (err) {
    console.error('[booking] payment verification failed:', err.message)
    return res.status(400).json({ error: 'Invalid payment' })
  }

  const bookingId = `QR-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

  console.log('[booking]', { bookingId, pickup, dropoff, rideType, date, time, paymentIntentId })

  // TODO: persist to database

  res.status(201).json({ bookingId })
})

export default router
