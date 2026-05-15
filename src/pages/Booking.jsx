import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import emailjs from '@emailjs/browser'
import {
  MapPin, Navigation, Calendar, Clock, Users,
  Package, Baby, Dog, Bike, Mail,
  ChevronRight, CheckCircle, AlertCircle,
  Loader2, Info, ClipboardList, Search,
  UserCheck, CreditCard, Shield, Star, Zap, PhoneCall,
} from 'lucide-react'
import PlaceAutocomplete  from '../components/PlaceAutocomplete'
import BookingMap         from '../components/BookingMap'
import DatePickerField    from '../components/DatePickerField'
import TimePickerField    from '../components/TimePickerField'
import { fetchRoute }     from '../services/routing'

/* ─── Process steps ──────────────────────────────────────────── */
const processSteps = [
  { num: '01', icon: ClipboardList, title: 'Enter Trip Details',     desc: 'Fill in your route, date, and any special requirements.' },
  { num: '02', icon: Search,        title: 'We Review Your Request', desc: 'Our team checks your details and driver availability.' },
  { num: '03', icon: UserCheck,     title: 'Driver Confirms',        desc: 'Your assigned driver personally confirms the booking.' },
  { num: '04', icon: CreditCard,    title: 'Invoice Sent to You',    desc: 'Only after approval do you receive a secure payment link.' },
]

/* ─── Extras ─────────────────────────────────────────────────── */
const EXTRAS = [
  { key: 'luggage',  icon: Package, label: 'Extra Luggage' },
  { key: 'babySeat', icon: Baby,    label: 'Baby Seat'     },
  { key: 'petCage',  icon: Dog,     label: 'Pet Cage'      },
  { key: 'bikes',    icon: Bike,    label: 'Bike Transport' },
]

/* ─── Trust points ───────────────────────────────────────────── */
const trustPoints = [
  { icon: Shield,    text: 'No payment upfront — invoice after confirmation' },
  { icon: Star,      text: 'Rated 5★ by travellers from 40+ countries' },
  { icon: Zap,       text: 'Instant route & price estimate as you type' },
  { icon: PhoneCall, text: 'Personal driver assigned to your transfer' },
]

/* ══════════════════════════════════════════════════════════════
   BOOKING PAGE
   ══════════════════════════════════════════════════════════════ */
export default function Booking() {

  const [searchParams] = useSearchParams()
  const festivalDest    = searchParams.get('destination') || ''

  useEffect(() => { window.scrollTo(0, 0) }, [])

  /* ── Form state ──────────────────────────────────────────── */
  const [pickup,      setPickup]      = useState('')
  const [destination, setDestination] = useState(festivalDest)
  const [date,        setDate]        = useState('')
  const [time,        setTime]        = useState('')
  const [passengers,  setPassengers]  = useState(1)
  const [extras, setExtras] = useState({ luggage: false, babySeat: false, petCage: false, bikes: false })
  const [email,       setEmail]       = useState('')
  const [errors,      setErrors]      = useState({})

  /* ── Flow state ──────────────────────────────────────────── */
  const [step,        setStep]        = useState('form')
  const [bookingId,   setBookingId]   = useState(null)
  const [submitError, setSubmitError] = useState(null)

  /* ── Location + map state ────────────────────────────────── */
  const [pickupPlace,  setPickupPlace]  = useState(null)
  const [destPlace,    setDestPlace]    = useState(null)
  const [routeCoords,  setRouteCoords]  = useState(null)
  const [routeInfo,    setRouteInfo]    = useState(null)
  const [distanceKm,   setDistanceKm]   = useState(null)
  const [routeLoading, setRouteLoading] = useState(false)
  const [routeError,   setRouteError]   = useState(null)

  /* ── Route fetch ─────────────────────────────────────────── */
  useEffect(() => {
    if (!pickupPlace || !destPlace) {
      setRouteCoords(null); setRouteInfo(null)
      setDistanceKm(null);  setRouteError(null)
      return
    }
    const ctrl = new AbortController()
    setRouteLoading(true); setRouteError(null)
    fetchRoute(pickupPlace, destPlace, ctrl.signal)
      .then(result => {
        setRouteCoords(result.coordinates)
        setRouteInfo({ distance: result.distanceLabel, duration: result.durationLabel })
        setDistanceKm(result.distanceMeters / 1000)
        setRouteLoading(false)
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setRouteError('Could not calculate route. Please verify your locations.')
          setRouteCoords(null); setDistanceKm(null); setRouteLoading(false)
        }
      })
    return () => ctrl.abort()
  }, [pickupPlace, destPlace])

  /* ── Helpers ─────────────────────────────────────────────── */
  const toggleExtra = key => setExtras(prev => ({ ...prev, [key]: !prev[key] }))

  const validate = () => {
    const e = {}
    if (!pickup.trim())      e.pickup      = 'Pickup location is required'
    if (!destination.trim()) e.destination = 'Destination is required'
    if (!date)               e.date        = 'Please select a date'
    if (!time)               e.time        = 'Please select a time'
    if (!email.trim())       e.email       = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSubmitError(null)
    setStep('submitting')

    const extrasList = Object.entries(extras)
      .filter(([, v]) => v)
      .map(([k]) => ({ luggage: 'Extra Luggage', babySeat: 'Baby Seat', petCage: 'Pet Cage', bikes: 'Bike Transport' }[k]))
      .join(', ') || 'None'

    const bookingRef = `QR-${Date.now().toString(36).toUpperCase()}`

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          booking_ref:    bookingRef,
          pickup,
          destination,
          date,
          time,
          passengers:     String(passengers),
          extras:         extrasList,
          customer_email: email,
          distance:       distanceKm ? `${distanceKm.toFixed(1)} km` : 'Not calculated',
          reply_to:       email,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      setBookingId(bookingRef)
      setStep('success')
    } catch (err) {
      setStep('form')
      setSubmitError(err?.text || err?.message || 'Something went wrong. Please try again or contact us directly.')
    }
  }

  const handleReset = () => {
    setPickup(''); setDestination(''); setDate(''); setTime('')
    setPassengers(1); setEmail('')
    setExtras({ luggage: false, babySeat: false, petCage: false, bikes: false })
    setErrors({}); setBookingId(null); setSubmitError(null)
    setPickupPlace(null); setDestPlace(null)
    setRouteCoords(null); setRouteInfo(null); setDistanceKm(null); setRouteError(null)
    setStep('form')
  }


  /* ═══════════════════════════════════════════════════════════
     SUCCESS STATE
     ═══════════════════════════════════════════════════════════ */
  if (step === 'success') {
    return (
      <div className="booking-page">
        <Head><title>Request Submitted — QuickRide Croatia</title></Head>
        <div className="bk-success-wrap">
          <div className="bk-success-card">
            <div className="bk-success-icon-ring">
              <CheckCircle className="bk-success-icon" aria-hidden="true" />
            </div>
            <h1 className="bk-success-title">Request Submitted!</h1>
            <p className="bk-success-body">
              Your transfer request has been received. We will review it shortly and confirm availability.
            </p>
            <div className="bk-success-summary">
              {[
                ['From',        pickup],
                ['To',          destination],
                ['Date & Time', `${date} at ${time}`],
                ['Passengers',  passengers],
                ['Booking ID',  bookingId],
              ].map(([label, val]) => (
                <div key={label} className="bk-success-row">
                  <span className="bk-success-row-label">{label}</span>
                  <span className="bk-success-row-val">{val}</span>
                </div>
              ))}
            </div>
            <div className="bk-success-notice">
              <Info className="bk-success-notice-icon" aria-hidden="true" />
              <p>
                <strong>No payment has been taken.</strong> Once we approve your transfer,
                you will receive an invoice and a secure payment link at{' '}
                <strong>{email}</strong>.
              </p>
            </div>
            <button onClick={handleReset} className="bk-submit-btn" style={{ marginTop: '1.75rem' }}>
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════════════════
     MAIN BOOKING FORM
     ═══════════════════════════════════════════════════════════ */
  return (
    <div className="booking-page">
      <Head>
        <title>Book a Transfer — QuickRide Croatia</title>
        <meta name="description" content="Request a premium private transfer along the Dalmatian coast. Pet friendly, baby seat, airport pickups in Split, Dubrovnik and Zadar." />
        <meta property="og:title"       content="Book a Transfer — QuickRide Croatia" />
        <meta property="og:description" content="Request a premium private transfer along the Dalmatian coast. No payment upfront." />
        <meta property="og:type"        content="website" />
      </Head>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="bk-hero bk-hero--short">
        <div className="bk-hero-overlay" aria-hidden="true" />
        <div className="container bk-hero-content">
          <span className="bk-hero-kicker">Private Transfers · Dalmatian Coast</span>
          <h1 className="bk-hero-title">Book Your Ride in Zadar</h1>
          <p className="bk-hero-subtitle">
            Airport pickups, festival transfers, and coastal day trips — door to door, no stress.
          </p>
        </div>
      </header>

      {/* ── Unified booking card — floats over hero/white boundary ── */}
      <main className="bk-main bk-main--elevated" id="bk-form">
        <div className="container">
          <form id="booking-form" onSubmit={handleSubmit} className="bk-unified-card" noValidate>

            {/* ── Row 1: Pickup + Destination ──────────────────── */}
            <div className="bk-card-route">

              <div className="bk-field">
                <label htmlFor="pickup" className="bk-label">
                  <MapPin className="bk-label-icon" aria-hidden="true" />
                  Pickup Location
                </label>
                <PlaceAutocomplete
                  id="pickup"
                  value={pickup}
                  onChange={text => { setPickup(text); if (pickupPlace) setPickupPlace(null) }}
                  onSelect={place => {
                    if (place) {
                      setPickupPlace(place); setPickup(place.label)
                      setErrors(prev => ({ ...prev, pickup: undefined }))
                    }
                  }}
                  placeholder="e.g. Split Airport (SPU)"
                  hasError={!!errors.pickup}
                  aria-describedby={errors.pickup ? 'err-pickup' : undefined}
                />
                {errors.pickup && <p id="err-pickup" className="bk-field-err" role="alert">{errors.pickup}</p>}
              </div>


              <div className="bk-field">
                <label htmlFor="destination" className="bk-label">
                  <Navigation className="bk-label-icon" aria-hidden="true" />
                  Destination
                </label>
                <PlaceAutocomplete
                  id="destination"
                  value={destination}
                  onChange={text => { setDestination(text); if (destPlace) setDestPlace(null) }}
                  onSelect={place => {
                    if (place) {
                      setDestPlace(place); setDestination(place.label)
                      setErrors(prev => ({ ...prev, destination: undefined }))
                    }
                  }}
                  placeholder="e.g. Dubrovnik Old Town"
                  hasError={!!errors.destination}
                  aria-describedby={errors.destination ? 'err-dest' : undefined}
                />
                {errors.destination && <p id="err-dest" className="bk-field-err" role="alert">{errors.destination}</p>}
              </div>

            </div>{/* /bk-card-route */}

            <hr className="bk-card-divider" />

            {/* ── Rows 2-5: 2-column body (map starts here) ────── */}
            <div className="bk-card-body">

              {/* ── Left column ─────────────────────────────── */}
              <div className="bk-card-left">

                {/* Row 2: Date + Time + Passengers */}
                <div className="bk-card-datetime">
                  <div className="bk-field bk-field--date">
                    <label htmlFor="date" className="bk-label">
                      <Calendar className="bk-label-icon" aria-hidden="true" />Date
                    </label>
                    <DatePickerField
                      id="date"
                      value={date}
                      onChange={val => { setDate(val); setErrors(prev => ({ ...prev, date: undefined })) }}
                      hasError={!!errors.date}
                      placeholder="Select date"
                    />
                    {errors.date && <p id="err-date" className="bk-field-err" role="alert">{errors.date}</p>}
                  </div>
                  <div className="bk-field bk-field--time">
                    <label htmlFor="time" className="bk-label">
                      <Clock className="bk-label-icon" aria-hidden="true" />Time
                    </label>
                    <TimePickerField
                      id="time"
                      value={time}
                      onChange={val => { setTime(val); setErrors(prev => ({ ...prev, time: undefined })) }}
                      hasError={!!errors.time}
                      placeholder="Select time"
                    />
                    {errors.time && <p id="err-time" className="bk-field-err" role="alert">{errors.time}</p>}
                  </div>
                  <div className="bk-field bk-field--pax">
                    <label className="bk-label" id="pax-label">
                      <Users className="bk-label-icon" aria-hidden="true" />Passengers
                    </label>
                    <div className="bk-pax-ctrl" aria-labelledby="pax-label">
                      <button type="button" className="bk-pax-btn"
                        onClick={() => setPassengers(p => Math.max(1, p - 1))}
                        aria-label="Decrease passengers" disabled={passengers <= 1}>−</button>
                      <span className="bk-pax-val" aria-live="polite">{passengers}</span>
                      <button type="button" className="bk-pax-btn"
                        onClick={() => setPassengers(p => Math.min(8, p + 1))}
                        aria-label="Increase passengers" disabled={passengers >= 8}>+</button>
                    </div>
                  </div>
                </div>

                {/* Row 3: Extras */}
                <div className="bk-card-section">
                  <p className="bk-card-section-label">
                    <Package className="bk-label-icon" aria-hidden="true" />
                    Extras
                    <span className="bk-label-hint">· any special requirements?</span>
                  </p>
                  <div className="bk-extras-chips" role="group" aria-label="Extras">
                    {EXTRAS.map(({ key, icon: Icon, label }) => (
                      <button
                        key={key} type="button"
                        className={`bk-extra-chip${extras[key] ? ' bk-extra-chip--on' : ''}`}
                        aria-pressed={extras[key]}
                        onClick={() => toggleExtra(key)}
                      >
                        <Icon aria-hidden="true" />
                        <span>{label}</span>
                        {extras[key] && <CheckCircle className="bk-chip-check" aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 4: Email */}
                <div className="bk-card-section">
                  <div className="bk-field">
                    <label htmlFor="email" className="bk-label">
                      <Mail className="bk-label-icon" aria-hidden="true" />Email Address
                    </label>
                    <input
                      id="email" type="email" value={email} autoComplete="email"
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className={`bk-input${errors.email ? ' bk-input--err' : ''}`}
                      aria-describedby={errors.email ? 'err-email' : undefined}
                    />
                    {errors.email && <p id="err-email" className="bk-field-err" role="alert">{errors.email}</p>}
                  </div>
                </div>

              </div>{/* /bk-card-left */}

              {/* ── Right column: Map ────────────────────────── */}
              <div className="bk-card-right">

                {/* Map panel */}
                <div className="bk-map-panel">
                  <div className="bk-map-wrap bk-map-wrap--card">
                    <BookingMap
                      pickupPlace={pickupPlace}
                      destPlace={destPlace}
                      routeCoords={routeCoords}
                    />
                    {routeLoading && (
                      <div className="bk-map-loading" aria-live="polite">
                        <Loader2 className="spinning" aria-hidden="true" />
                        <span>Calculating route…</span>
                      </div>
                    )}
                    {routeError && !routeLoading && (
                      <div className="bk-map-route-err" role="alert">
                        <AlertCircle aria-hidden="true" />
                        <span>{routeError}</span>
                      </div>
                    )}
                  </div>

                  {routeInfo && !routeLoading ? (
                    <div className="bk-side-stats" aria-label="Route summary">
                      <div className="bk-side-stat">
                        <span className="bk-side-stat-label">Distance</span>
                        <span className="bk-side-stat-val">{routeInfo.distance}</span>
                      </div>
                      <div className="bk-side-stat-sep" aria-hidden="true" />
                      <div className="bk-side-stat">
                        <span className="bk-side-stat-label">Est. Drive</span>
                        <span className="bk-side-stat-val">{routeInfo.duration}</span>
                      </div>
                      {distanceKm && (
                        <>
                          <div className="bk-side-stat-sep" aria-hidden="true" />
                          <div className="bk-side-stat">
                            <span className="bk-side-stat-label">Est. Price</span>
                            <span className="bk-side-stat-val bk-side-stat-price">
                              €{Math.round(distanceKm * 1.4)}–€{Math.round(distanceKm * 1.9)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="bk-side-map-prompt">
                      Enter pickup and destination to see your route and price estimate.
                    </p>
                  )}
                </div>

              </div>{/* /bk-card-right */}

              {/* ── Submit + trust (desktop only) ───────────────────── */}
              <div className="bk-card-submit">
                {submitError && (
                  <div className="bk-submit-error" role="alert">
                    <AlertCircle aria-hidden="true" />
                    <span>{submitError}</span>
                  </div>
                )}
                <button type="submit" className="bk-submit-btn bk-submit-btn--inline" disabled={step === 'submitting'}>
                  {step === 'submitting' ? (
                    <><Loader2 className="spinning" aria-hidden="true" />Submitting…</>
                  ) : (
                    <>Reserve My Ride <ChevronRight aria-hidden="true" /></>
                  )}
                </button>
                {/* Trust items: visible only on desktop, mobile uses bk-trust-below outside */}
                <div className="bk-trust-grid bk-trust-grid--inline" aria-label="Why choose us">
                  {trustPoints.map(({ icon: Icon, text }) => (
                    <div key={text} className="bk-side-trust-item">
                      <Icon className="bk-side-trust-icon" aria-hidden="true" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>{/* /bk-card-body */}

          </form>
        </div>
      </main>

      {/* ── Sticky mobile CTA bar ────────────────────────────── */}
      <div className="bk-mobile-cta" aria-hidden={step === 'submitting'}>
        {submitError && (
          <div className="bk-submit-error" role="alert" style={{ width: '100%', maxWidth: '28rem', marginBottom: '0.25rem' }}>
            <AlertCircle aria-hidden="true" />
            <span>{submitError}</span>
          </div>
        )}
        <button
          type="submit"
          form="booking-form"
          className="bk-mobile-cta-btn"
          disabled={step === 'submitting'}
        >
          {step === 'submitting' ? (
            <><Loader2 className="spinning" aria-hidden="true" />Submitting…</>
          ) : (
            <>Reserve My Ride <ChevronRight aria-hidden="true" /></>
          )}
        </button>
        <p className="bk-mobile-cta-note">No payment upfront · Confirmed by your driver</p>
      </div>

      {/* ── Trust points — below card, 2×2 grid ──────────────── */}
      <div className="bk-trust-below">
        <div className="container">
          <div className="bk-trust-grid" aria-label="Why choose us">
            {trustPoints.map(({ icon: Icon, text }) => (
              <div key={text} className="bk-side-trust-item">
                <Icon className="bk-side-trust-icon" aria-hidden="true" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works — below the booking card ────────────── */}
      <section className="bk-process-section" aria-label="Booking process">
        <div className="container">
          <h2 className="bk-process-heading">How It Works</h2>
          <div className="bk-process-steps">
            {processSteps.map(({ num, icon: Icon, title, desc }, i) => (
              <div key={num} className="bk-process-step">
                <div className="bk-process-icon-wrap" aria-hidden="true">
                  <Icon className="bk-process-icon" />
                  <span className="bk-process-num">{num}</span>
                </div>
                <div className="bk-process-text">
                  <h3 className="bk-process-title">{title}</h3>
                  <p  className="bk-process-desc">{desc}</p>
                </div>
                {i < processSteps.length - 1 && (
                  <ChevronRight className="bk-process-arrow" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
