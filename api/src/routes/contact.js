import { Router } from 'express'
import rateLimit from 'express-rate-limit'

const router = Router()

const limiter = rateLimit({ windowMs: 60_000, max: 5, standardHeaders: true })

router.post('/', limiter, (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' })
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRe.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  console.log('[contact]', { name, email, message: message.slice(0, 80) })

  // TODO: send email via SMTP / store in database

  res.status(200).json({ ok: true })
})

export default router
