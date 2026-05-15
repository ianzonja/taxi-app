import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import nodemailer from 'nodemailer'

const router = Router()

const limiter = rateLimit({ windowMs: 60_000, max: 5, standardHeaders: true })

async function sendContactEmail({ name, email, message }) {
  const to = process.env.CONTACT_EMAIL || 'mateospace93@gmail.com'

  if (!process.env.SMTP_HOST) {
    console.log('\n── [contact email] Would send ────────────────────')
    console.log(`To:      ${to}`)
    console.log(`From:    ${name} <${email}>`)
    console.log(`Message: ${message}`)
    console.log('──────────────────────────────────────────────────\n')
    return
  }

  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from:    `"QuickRide Contact" <${process.env.SMTP_USER}>`,
    to,
    replyTo: `"${name}" <${email}>`,
    subject: `New Contact Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
        <h2 style="color:#0f2b3d">New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <hr style="margin:16px 0">
        <p style="white-space:pre-wrap">${message}</p>
      </div>
    `,
  })
}

router.post('/', limiter, async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' })
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRe.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    await sendContactEmail({ name, email, message })
    console.log('[contact] Message from', email)
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[contact] Email failed:', err.message)
    res.status(500).json({ error: 'Failed to send message. Please try again.' })
  }
})

export default router
