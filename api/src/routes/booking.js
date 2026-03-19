import { Router } from 'express'
import rateLimit from 'express-rate-limit'

const router = Router()

const limiter = rateLimit({ windowMs: 60_000, max: 10, standardHeaders: true })

router.post('/', limiter, (req, res) => {
  const { pickup, dropoff, rideType, date, time } = req.body

  if (!pickup || !dropoff || !rideType) {
    return res.status(400).json({ error: 'pickup, dropoff and rideType are required' })
  }

  const validTypes = ['economy', 'comfort', 'premium']
  if (!validTypes.includes(rideType)) {
    return res.status(400).json({ error: 'Invalid rideType' })
  }

  const bookingId = `QR-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

  console.log('[booking]', { bookingId, pickup, dropoff, rideType, date, time })

  // TODO: persist to database

  res.status(201).json({ bookingId })
})

export default router
