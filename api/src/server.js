import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bookingRouter from './routes/booking.js'
import contactRouter from './routes/contact.js'

const app = express()
const PORT = process.env.PORT || 3001
const ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:4173'

app.use(express.json())
app.use(cors({ origin: ORIGIN }))

app.use('/booking', bookingRouter)
app.use('/contact', contactRouter)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => console.log(`QuickRide API running on :${PORT}`))
