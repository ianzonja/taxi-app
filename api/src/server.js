import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bookingRouter from './routes/booking.js'
import contactRouter from './routes/contact.js'
import paymentRouter, { webhookHandler } from './routes/payment.js'

const app = express()
const PORT = process.env.PORT || 3001
const ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:4173'

// Stripe webhook needs raw body — must be registered BEFORE express.json()
app.post('/payment/webhook', express.raw({ type: 'application/json' }), webhookHandler)

app.use(express.json())
app.use(cors({ origin: ORIGIN }))

app.use('/booking', bookingRouter)
app.use('/contact', contactRouter)
app.use('/payment', paymentRouter)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => console.log(`QuickRide API running on :${PORT}`))
