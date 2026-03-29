import { useEffect, useState } from 'react'
import { Head } from 'vite-react-ssg'
import { CheckCircle, MapPin, Navigation, Calendar, Clock, Users, Loader2, AlertCircle } from 'lucide-react'

/**
 * PaymentSuccess page
 *
 * Stripe redirects the customer here after a successful payment:
 *   /payment-success?booking=QR-xxx&session_id=cs_xxx
 *
 * If session_id is present we fetch the booking summary from the API.
 * If session_id is absent (Stripe not configured / demo mode) we show a
 * generic confirmation using just the booking ID from the URL.
 */
export default function PaymentSuccess() {
  const params    = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const bookingId = params.get('booking')
  const sessionId = params.get('session_id')
  const isDemo    = params.get('demo') === '1'

  const [state,   setState]   = useState('loading') // loading | ok | error
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    if (!bookingId) {
      setState('error')
      return
    }

    // No session_id means Stripe isn't configured yet (demo fallback)
    if (!sessionId || isDemo) {
      setState('ok')
      return
    }

    fetch(`/api/payment/session/${sessionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setBooking(data)
        setState('ok')
      })
      .catch(() => {
        // Even if the API call fails, still show a success screen —
        // the payment went through on Stripe's side.
        setState('ok')
      })
  }, [bookingId, sessionId])

  /* ── Loading ──────────────────────────────────────────────── */
  if (state === 'loading') {
    return (
      <div className="ps-page">
        <Head><title>Confirming Payment — QuickRide Croatia</title></Head>
        <div className="ps-card">
          <Loader2 className="ps-spinner spinning" aria-hidden="true" />
          <p className="ps-loading-text">Confirming your payment…</p>
        </div>
      </div>
    )
  }

  /* ── Error (no booking ID at all) ─────────────────────────── */
  if (state === 'error') {
    return (
      <div className="ps-page">
        <Head><title>Something Went Wrong — QuickRide Croatia</title></Head>
        <div className="ps-card ps-card--error">
          <AlertCircle className="ps-error-icon" aria-hidden="true" />
          <h1 className="ps-title ps-title--error">Something went wrong</h1>
          <p className="ps-body">
            We couldn't find your booking. If you completed a payment please contact us
            and we'll sort it out right away.
          </p>
        </div>
      </div>
    )
  }

  /* ── Success ──────────────────────────────────────────────── */
  const rows = booking
    ? [
        ['Booking ID',  booking.bookingId],
        ['From',        booking.pickup],
        ['To',          booking.destination],
        ['Date',        booking.date],
        ['Time',        booking.time],
        ['Passengers',  booking.passengers],
        ['Amount Paid', booking.priceFormatted],
      ]
    : [['Booking ID', bookingId]]

  return (
    <div className="ps-page">
      <Head><title>Payment Confirmed — QuickRide Croatia</title></Head>

      <div className="ps-card">
        {/* Icon */}
        <div className="ps-icon-ring" aria-hidden="true">
          <CheckCircle className="ps-check-icon" />
        </div>

        <h1 className="ps-title">Payment Confirmed!</h1>
        <p className="ps-body">
          Your transfer is fully booked. We'll be there to pick you up — a confirmation
          has been sent to your email.
        </p>

        {/* Summary table */}
        <div className="ps-summary">
          {rows.map(([label, val]) => (
            <div key={label} className="ps-row">
              <span className="ps-row-label">{label}</span>
              <span className="ps-row-val">{val}</span>
            </div>
          ))}
        </div>

        <p className="ps-footer-note">
          Questions? Reply to the confirmation email and we'll be happy to help.
        </p>

        <a href="/" className="ps-home-btn">Back to Home</a>
      </div>

      <style>{`
        .ps-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }
        .ps-card {
          background: #fff;
          border-radius: 20px;
          padding: 48px 40px;
          max-width: 480px;
          width: 100%;
          text-align: center;
          box-shadow: 0 8px 40px rgba(0,0,0,.10);
        }
        .ps-card--error { border-top: 4px solid #ef4444; }
        .ps-icon-ring {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: #dcfce7;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
        }
        .ps-check-icon { width: 40px; height: 40px; color: #16a34a; }
        .ps-error-icon { width: 48px; height: 48px; color: #ef4444; margin-bottom: 16px; }
        .ps-spinner    { width: 40px; height: 40px; color: #2563eb; margin-bottom: 16px; }
        .ps-loading-text { color: #64748b; font-size: 15px; }
        .ps-title {
          font-size: 26px; font-weight: 800; color: #166534; margin-bottom: 12px;
        }
        .ps-title--error { color: #b91c1c; }
        .ps-body {
          font-size: 15px; color: #475569; line-height: 1.65; margin-bottom: 28px;
        }
        .ps-summary {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 24px;
          text-align: left;
        }
        .ps-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 11px 16px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
          gap: 12px;
        }
        .ps-row:last-child { border-bottom: none; }
        .ps-row-label { color: #64748b; flex-shrink: 0; }
        .ps-row-val   { font-weight: 600; word-break: break-word; text-align: right; }
        .ps-footer-note {
          font-size: 13px; color: #94a3b8; margin-bottom: 24px;
        }
        .ps-home-btn {
          display: inline-block;
          background: #1e40af;
          color: #fff;
          text-decoration: none;
          padding: 13px 32px;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 15px;
          transition: background 0.2s;
        }
        .ps-home-btn:hover { background: #1d4ed8; }
        @media (max-width: 520px) {
          .ps-card { padding: 36px 24px; }
        }
      `}</style>
    </div>
  )
}
