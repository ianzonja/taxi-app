/**
 * mailer.js
 *
 * Shared email-sending helper used by booking-request and payment routes.
 *
 * Required env vars (set in api/.env):
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
 *
 * If SMTP_HOST is not set (development), emails are logged to console instead.
 */

export async function sendEmail({ to, subject, text, html }) {
  if (!process.env.SMTP_HOST) {
    console.log('\n── [email] Would send ─────────────────────────────')
    console.log(`To:      ${to}`)
    console.log(`Subject: ${subject}`)
    console.log('Text:\n' + text)
    console.log('─────────────────────────────────────────────────\n')
    return
  }

  const nodemailer = (await import('nodemailer')).default

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
    from:    process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  })
}
