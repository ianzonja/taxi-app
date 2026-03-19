import { useState } from 'react'
import { Head } from 'vite-react-ssg'
import { MapPin, Navigation, Car, Zap, Crown, ChevronRight, Clock, DollarSign, CheckCircle } from 'lucide-react'

const rideTypes = [
  {
    id: 'economy',
    icon: Car,
    name: 'Economy',
    desc: 'Affordable everyday rides',
    eta: '3-5 min',
    price: '$8–12',
    seats: '4 seats',
  },
  {
    id: 'comfort',
    icon: Zap,
    name: 'Comfort',
    desc: 'Newer cars, extra legroom',
    eta: '4-7 min',
    price: '$14–18',
    seats: '4 seats',
  },
  {
    id: 'premium',
    icon: Crown,
    name: 'Premium',
    desc: 'Luxury vehicles, top-rated drivers',
    eta: '5-10 min',
    price: '$22–30',
    seats: '4 seats',
  },
]

export default function Booking() {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [selectedRide, setSelectedRide] = useState('economy')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bookingId, setBookingId] = useState(null)

  const handleBook = async (e) => {
    e.preventDefault()
    if (!pickup || !dropoff) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickup, dropoff, rideType: selectedRide, date, time }),
      })
      if (!res.ok) {
        const { error: msg } = await res.json()
        throw new Error(msg || 'Booking failed')
      }
      const { bookingId: id } = await res.json()
      setBookingId(id)
      setConfirmed(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (confirmed) {
    return (
      <div className="booking-confirmation">
        <div className="booking-confirmation-inner">
          <div className="booking-confirm-icon-wrapper">
            <CheckCircle className="booking-confirm-icon" />
          </div>
          <h2 className="booking-confirm-title">Ride Confirmed!</h2>
          <p className="booking-confirm-text">
            Your <strong>{rideTypes.find(r => r.id === selectedRide)?.name}</strong> ride
            from <strong>{pickup}</strong> to <strong>{dropoff}</strong> has been booked.
          </p>
          {bookingId && (
            <p className="booking-confirm-id">Booking ID: <strong>{bookingId}</strong></p>
          )}
          <div className="booking-confirm-summary">
            <div className="booking-confirm-row">
              <span className="booking-confirm-row-label">ETA</span>
              <span className="booking-confirm-row-value">{rideTypes.find(r => r.id === selectedRide)?.eta}</span>
            </div>
            <div className="booking-confirm-row">
              <span className="booking-confirm-row-label">Estimated Fare</span>
              <span className="booking-confirm-row-value-blue">{rideTypes.find(r => r.id === selectedRide)?.price}</span>
            </div>
            {date && (
              <div className="booking-confirm-row">
                <span className="booking-confirm-row-label">Scheduled</span>
                <span className="booking-confirm-row-value">{date} {time}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => { setConfirmed(false); setPickup(''); setDropoff(''); setDate(''); setTime(''); setBookingId(null) }}
            className="btn btn-primary"
          >
            Book Another Ride
          </button>
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
        {/* Header */}
        <div className="booking-header">
          <h1 className="booking-title">Book a Ride</h1>
          <p className="booking-subtitle">Fast, safe pickup in minutes. Where are you headed?</p>
        </div>

        <form onSubmit={handleBook} className="booking-form">
          {/* Location card */}
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

          {/* Schedule (optional) */}
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
              {rideTypes.map(({ id, icon: Icon, name, desc, eta, price, seats }) => (
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
              {rideTypes.find(r => r.id === selectedRide)?.price}
            </span>
          </div>

          {error && (
            <p className="booking-error">{error}</p>
          )}
          <button type="submit" className="booking-submit" disabled={loading}>
            {loading ? 'Booking…' : <><span>Confirm Booking</span> <ChevronRight /></>}
          </button>
        </form>
      </div>
    </div>
  )
}
