import { Router } from 'express'
import Stripe from 'stripe'
import rateLimit from 'express-rate-limit'

const router = Router()

// Fare amounts in cents (USD)
const FARE_AMOUNTS = {
  economy: 1000,  // $10.00
  comfort: 1600,  // $16.00
  premium: 2600,  // $26.00
}

const limiter = rateLimit({ windowMs: 60_000, max: 20, standardHeaders: true })

router.post('/create-intent', limiter, async (req, res) => {
  const { rideType } = req.body

  const validTypes = ['economy', 'comfort', 'premium']
  if (!validTypes.includes(rideType)) {
    return res.status(400).json({ error: 'Invalid rideType' })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: FARE_AMOUNTS[rideType],
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { rideType },
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('[payment/create-intent]', err.message)
    res.status(500).json({ error: 'Failed to create payment intent' })
  }
})

export function webhookHandler(req, res) {
  const sig = req.headers['stripe-signature']
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[webhook] signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    console.log('[webhook] payment_intent.succeeded:', paymentIntent.id)
    // TODO: update booking status in database
  }

  res.json({ received: true })
}

export default router
