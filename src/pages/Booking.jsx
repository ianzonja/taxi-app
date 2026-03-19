import { useState } from 'react'
import { Head } from 'vite-react-ssg'
import { MapPin, Navigation, Car, Zap, Crown, ChevronRight, Clock, DollarSign, CheckCircle, CreditCard, ArrowLeft } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Only initialise Stripe client-side (not during SSG pre-render)
const stripePromise = typeof window !== 'undefined'
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null

const rideTypes = [
  {
    id: 'economy',
    icon: Car,
    name: 'Economy',
    desc: 'Affordable everyday rides',
    eta: '3-5 min',
    price: '$10',
    priceRange: '$8–12',
    seats: '4 seats',
  },
  {
    id: 'comfort',
    icon: Zap,
    name: 'Comfort',
    desc: 'Newer cars, extra legroom',
    eta: '4-7 min',
    price: '$16',
    priceRange: '$14–18',
    seats: '4 seats',
  },
  {
    id: 'premium',
    icon: Crown,
    name: 'Premium',
    desc: 'Luxury vehicles, top-rated drivers',
    eta: '5-10 min',
    price: '$26',
    priceRange: '$22–30',
    seats: '4 seats',
  },
]

function PaymentForm({ pickup, dropoff, selectedRide, date, time, onSuccess, onBack }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const ride = rideTypes.find(r => r.id === selectedRide)

  const handlePay = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {},
        redirect: 'if_required',
      })

      if (stripeError) {
        setError(stripeError.message)
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        const res = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pickup, dropoff, rideType: selectedRide, date, time,
            paymentIntentId: paymentIntent.id,
          }),
        })

        if (!res.ok) {
          const { error: msg } = await res.json()
          throw new Error(msg || 'Booking failed')
        }

        const { bookingId } = await res.json()
        onSuccess(bookingId)
      } else {
        setError('Payment did not complete. Please try again.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handlePay} className="booking-form">
      <div className="booking-card">
        <h3 className="booking-card-title">Trip Summary</h3>
        <div className="booking-confirm-summary">
          <div className="booking-confirm-row">
            <span className="booking-confirm-row-label">From</span>
            <span className="booking-confirm-row-value">{pickup}</span>
          </div>
          <div className="booking-confirm-row">
            <span className="booking-confirm-row-label">To</span>
            <span className="booking-confirm-row-value">{dropoff}</span>
          </div>
          <div className="booking-confirm-row">
            <span className="booking-confirm-row-label">Ride</span>
            <span className="booking-confirm-row-value">{ride?.name}</span>
          </div>
          {date && (
            <div className="booking-confirm-row">
              <span className="booking-confirm-row-label">Scheduled</span>
              <span className="booking-confirm-row-value">{date} {time}</span>
            </div>
          )}
          <div className="booking-confirm-row">
            <span className="booking-confirm-row-label">Total</span>
            <span className="booking-confirm-row-value-blue">{ride?.price}</span>
          </div>
        </div>
      </div>

      <div className="booking-card">
        <h3 className="booking-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CreditCard style={{ width: 18, height: 18 }} />
          Payment Details
        </h3>
        <div style={{ paddingTop: 8 }}>
          <PaymentElement />
        </div>
      </div>

      {error && <p className="booking-error">{error}</p>}

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="button"
          onClick={onBack}
          className="btn btn-secondary"
          style={{ flex: 1 }}
          disabled={loading}
        >
          <ArrowLeft style={{ width: 16, height: 16, display: 'inline', marginRight: 4 }} />
          Back
        </button>
        <button
          type="submit"
          className="booking-submit"
          style={{ flex: 2 }}
          disabled={loading || !stripe || !elements}
        >
          {loading ? 'Processing…' : <><span>Pay {ride?.price}</span> <ChevronRight /></>}
        </button>
      </div>
    </form>
  )
}

export default function Booking() {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [selectedRide, setSelectedRide] = useState('economy')
  const [step, setStep] = useState('form') // 'form' | 'payment' | 'confirmed'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bookingId, setBookingId] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)

  const handleProceedToPayment = async (e) => {
    e.preventDefault()
    if (!pickup || !dropoff) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideType: selectedRide }),
      })
      if (!res.ok) {
        const { error: msg } = await res.json()
        throw new Error(msg || 'Failed to initialize payment')
      }
      const { clientSecret: secret } = await res.json()
      setClientSecret(secret)
      setStep('payment')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep('form')
    setPickup('')
    setDropoff('')
    setDate('')
    setTime('')
    setBookingId(null)
    setClientSecret(null)
    setError(null)
  }

  if (step === 'confirmed') {
    const ride = rideTypes.find(r => r.id === selectedRide)
    return (
      <div className="booking-confirmation">
        <div className="booking-confirmation-inner">
          <div className="booking-confirm-icon-wrapper">
            <CheckCircle className="booking-confirm-icon" />
          </div>
          <h2 className="booking-confirm-title">Ride Confirmed!</h2>
          <p className="booking-confirm-text">
            Your <strong>{ride?.name}</strong> ride from <strong>{pickup}</strong> to <strong>{dropoff}</strong> has been booked.
          </p>
          {bookingId && (
            <p className="booking-confirm-id">Booking ID: <strong>{bookingId}</strong></p>
          )}
          <div className="booking-confirm-summary">
            <div className="booking-confirm-row">
              <span className="booking-confirm-row-label">ETA</span>
              <span className="booking-confirm-row-value">{ride?.eta}</span>
            </div>
            <div className="booking-confirm-row">
              <span className="booking-confirm-row-label">Amount Paid</span>
              <span className="booking-confirm-row-value-blue">{ride?.price}</span>
            </div>
            {date && (
              <div className="booking-confirm-row">
                <span className="booking-confirm-row-label">Scheduled</span>
                <span className="booking-confirm-row-value">{date} {time}</span>
              </div>
            )}
          </div>
          <button onClick={handleReset} className="btn btn-primary">
            Book Another Ride
          </button>
        </div>
      </div>
    )
  }

  if (step === 'payment' && clientSecret) {
    return (
      <div className="booking-page">
        <Head>
          <title>Payment — QuickRide</title>
        </Head>
        <div className="booking-container">
          <div className="booking-header">
            <h1 className="booking-title">Secure Checkout</h1>
            <p className="booking-subtitle">Complete your payment to confirm your ride.</p>
          </div>
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
            <PaymentForm
              pickup={pickup}
              dropoff={dropoff}
              selectedRide={selectedRide}
              date={date}
              time={time}
              onSuccess={(id) => { setBookingId(id); setStep('confirmed') }}
              onBack={() => setStep('form')}
            />
          </Elements>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-page">
      <Head>
        <title>Book a Ride — QuickRide</title>
        <meta name="description" content="Book your ride with QuickRide in seconds. Choose Economy, Comfort, or Premium — available 24/7 in 30+ cities with live driver tracking." />
        <meta property="og:title" content="Book a Ride — QuickRide" />
        <meta property="og:description" content="Book your ride in seconds. Economy, Comfort, or Premium — available 24/7 in 30+ cities." />
        <meta property="og:type" content="website" />
      </Head>
      <div className="booking-container">
        <div className="booking-header">
          <h1 className="booking-title">Book a Ride</h1>
          <p className="booking-subtitle">Fast, safe pickup in minutes. Where are you headed?</p>
        </div>

        <form onSubmit={handleProceedToPayment} className="booking-form">
          {/* Locations */}
          <div className="booking-card">
            <h3 className="booking-card-title">Locations</h3>
            <div className="booking-input-wrapper">
              <MapPin className="booking-input-icon booking-input-icon-lg booking-input-icon-blue5" />
              <input
                type="text"
                placeholder="Pickup location"
                value={pickup}
                onChange={e => setPickup(e.target.value)}
                required
                className="booking-input"
              />
            </div>
            <div className="booking-input-wrapper">
              <Navigation className="booking-input-icon booking-input-icon-lg booking-input-icon-blue6" />
              <input
                type="text"
                placeholder="Drop-off location"
                value={dropoff}
                onChange={e => setDropoff(e.target.value)}
                required
                className="booking-input"
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="booking-card">
            <h3 className="booking-card-title">Schedule (Optional)</h3>
            <div className="booking-schedule-grid">
              <div className="booking-input-wrapper">
                <Clock className="booking-input-icon booking-input-icon-sm booking-input-icon-gray" />
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="booking-input-date"
                />
              </div>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="booking-input-plain"
              />
            </div>
          </div>

          {/* Ride type */}
          <div className="booking-card">
            <h3 className="booking-card-title">Choose Ride Type</h3>
            <div className="ride-options">
              {rideTypes.map(({ id, icon: Icon, name, desc, eta, price, priceRange, seats }) => (
                <label
                  key={id}
                  className={`ride-option${selectedRide === id ? ' selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="rideType"
                    value={id}
                    checked={selectedRide === id}
                    onChange={() => setSelectedRide(id)}
                  />
                  <div className={`ride-icon-wrapper${selectedRide === id ? ' selected' : ''}`}>
                    <Icon className={`ride-icon${selectedRide === id ? ' selected' : ''}`} />
                  </div>
                  <div className="ride-info">
                    <div className="ride-info-header">
                      <p className="ride-name">{name}</p>
                      <p className="ride-price">{price}</p>
                    </div>
                    <p className="ride-desc">{desc}</p>
                    <div className="ride-meta">
                      <span>{seats}</span>
                      <span>•</span>
                      <span>{eta}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Fare estimate */}
          <div className="fare-estimate">
            <div className="fare-label">
              <DollarSign className="fare-label-icon" />
              <span>Estimated fare</span>
            </div>
            <span className="fare-value">
              {rideTypes.find(r => r.id === selectedRide)?.priceRange}
            </span>
          </div>

          {error && <p className="booking-error">{error}</p>}

          <button type="submit" className="booking-submit" disabled={loading}>
            {loading ? 'Preparing payment…' : <><span>Continue to Payment</span> <ChevronRight /></>}
          </button>
        </form>
      </div>
    </div>
  )
}
