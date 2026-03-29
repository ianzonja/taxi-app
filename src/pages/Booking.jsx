import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import {
  MapPin, Navigation, Calendar, Clock, Users,
  Package, Baby, Dog, Bike, Mail,
  ChevronRight, CheckCircle, AlertCircle,
  Loader2, Info, ClipboardList, Search,
  UserCheck, CreditCard, Shield, Star, Zap, PhoneCall,
} from 'lucide-react'
import PlaceAutocomplete from '../components/PlaceAutocomplete'
import BookingMap        from '../components/BookingMap'
import { fetchRoute }    from '../services/routing'

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
  const festivalName    = searchParams.get('festival') || ''
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
    setStep('submitting'); setSubmitError(null)
    try {
      const res = await fetch('/api/booking-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickup, destination, date, time, passengers, extras, email, distanceKm }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to submit request')
      setBookingId(data.bookingId)
      setStep('success')
    } catch (err) {
      setSubmitError(err.message); setStep('form')
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

  const today = typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : ''

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
      <header className="bk-hero">
        <div className="bk-hero-overlay" aria-hidden="true" />
        <div className="container bk-hero-content">
          <span className="bk-hero-kicker">Private Transfers · Dalmatian Coast</span>
          <h1 className="bk-hero-title">Book Your Ride in Zadar</h1>
          <p className="bk-hero-subtitle">
            Airport pickups, festival transfers, and coastal day trips — door to door, no stress.
          </p>
          {festivalName && (
            <p className="bk-hero-festival-note">
              Transferring to <strong>{festivalName}</strong> — destination pre-filled below.
            </p>
          )}
          <a href="#bk-form" className="bk-hero-cta">
            Check Availability <ChevronRight aria-hidden="true" />
          </a>
          <p className="bk-hero-fomo">
            Festival dates fill up quickly — book early to secure your driver.
          </p>
        </div>
      </header>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="bk-process-section" aria-label="Booking process">
        <div className="container">
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

      {/* ── Main form ─────────────────────────────────────────── */}
      <main className="bk-main" id="bk-form">
        <div className="container">
          <form onSubmit={handleSubmit} className="bk-form" noValidate>

            {/* ── Two-column layout ──────────────────────────── */}
            <div className="bk-layout">

              {/* ── Left: form fields ─────────────────────── */}
              <div className="bk-layout-fields">

                {/* Section A: Route ─────────────────────── */}
                <section className="bk-section" aria-labelledby="sec-route">
                  <div className="bk-section-hd">
                    <div className="bk-section-icon-ring" aria-hidden="true">
                      <MapPin className="bk-section-icon" />
                    </div>
                    <div>
                      <h2 className="bk-section-title" id="sec-route">Your Route</h2>
                      <p  className="bk-section-sub">Where are you traveling from and to?</p>
                    </div>
                  </div>

                  <div className="bk-route-stack">
                    {/* Pickup */}
                    <div className="bk-field">
                      <label htmlFor="pickup" className="bk-label">
                        <MapPin className="bk-label-icon" aria-hidden="true" />
                        Pickup Location
                        <span className="bk-label-hint">· type and select from the list</span>
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

                    {/* Connector */}
                    <div className="bk-route-connector" aria-hidden="true">
                      <div className="bk-route-line" />
                      <Navigation className="bk-route-nav-icon" />
                      <div className="bk-route-line" />
                    </div>

                    {/* Destination */}
                    <div className="bk-field">
                      <label htmlFor="destination" className="bk-label">
                        <Navigation className="bk-label-icon" aria-hidden="true" />
                        Destination
                        <span className="bk-label-hint">· type and select from the list</span>
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
                  </div>
                </section>

                {/* Section B: Trip Details ───────────────── */}
                <section className="bk-section" aria-labelledby="sec-trip">
                  <div className="bk-section-hd">
                    <div className="bk-section-icon-ring" aria-hidden="true">
                      <Calendar className="bk-section-icon" />
                    </div>
                    <div>
                      <h2 className="bk-section-title" id="sec-trip">Trip Details</h2>
                      <p  className="bk-section-sub">When are you traveling and how many passengers?</p>
                    </div>
                  </div>
                  <div className="bk-fields-row">
                    <div className="bk-field">
                      <label htmlFor="date" className="bk-label">
                        <Calendar className="bk-label-icon" aria-hidden="true" />Date
                      </label>
                      <input
                        id="date" type="date" value={date} min={today}
                        onChange={e => setDate(e.target.value)}
                        className={`bk-input${errors.date ? ' bk-input--err' : ''}`}
                        aria-describedby={errors.date ? 'err-date' : undefined}
                      />
                      {errors.date && <p id="err-date" className="bk-field-err" role="alert">{errors.date}</p>}
                    </div>
                    <div className="bk-field">
                      <label htmlFor="time" className="bk-label">
                        <Clock className="bk-label-icon" aria-hidden="true" />Time
                      </label>
                      <input
                        id="time" type="time" value={time}
                        onChange={e => setTime(e.target.value)}
                        className={`bk-input${errors.time ? ' bk-input--err' : ''}`}
                        aria-describedby={errors.time ? 'err-time' : undefined}
                      />
                      {errors.time && <p id="err-time" className="bk-field-err" role="alert">{errors.time}</p>}
                    </div>
                    <div className="bk-field">
                      <label className="bk-label" id="pax-label">
                        <Users className="bk-label-icon" aria-hidden="true" />Passengers
                      </label>
                      <div className="bk-pax-ctrl" aria-labelledby="pax-label">
                        <button type="button" className="bk-pax-btn"
                          onClick={() => setPassengers(p => Math.max(1, p - 1))}
                          aria-label="Decrease" disabled={passengers <= 1}>−</button>
                        <span className="bk-pax-val" aria-live="polite">{passengers}</span>
                        <button type="button" className="bk-pax-btn"
                          onClick={() => setPassengers(p => Math.min(8, p + 1))}
                          aria-label="Increase" disabled={passengers >= 8}>+</button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section C: Extras ─────────────────────── */}
                <section className="bk-section" aria-labelledby="sec-extras">
                  <div className="bk-section-hd">
                    <div className="bk-section-icon-ring" aria-hidden="true">
                      <Package className="bk-section-icon" />
                    </div>
                    <div>
                      <h2 className="bk-section-title" id="sec-extras">Extras</h2>
                      <p  className="bk-section-sub">Any special requirements for your transfer?</p>
                    </div>
                  </div>
                  <div className="bk-extras-chips" role="group" aria-labelledby="sec-extras">
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
                </section>

                {/* Section D: Contact ────────────────────── */}
                <section className="bk-section" aria-labelledby="sec-contact">
                  <div className="bk-section-hd">
                    <div className="bk-section-icon-ring" aria-hidden="true">
                      <Mail className="bk-section-icon" />
                    </div>
                    <div>
                      <h2 className="bk-section-title" id="sec-contact">Your Contact</h2>
                      <p  className="bk-section-sub">We'll send your confirmation and invoice here.</p>
                    </div>
                  </div>
                  <div className="bk-field bk-field--narrow">
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
                </section>

              </div>{/* /bk-layout-fields */}

              {/* ── Right: sticky map + trust ──────────── */}
              <aside className="bk-layout-map">

                {/* Map card */}
                <div className="bk-side-card">
                  <div className="bk-map-wrap bk-map-wrap--side">
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

                  {/* Route stats below map */}
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

                {/* Trust points */}
                <div className="bk-side-trust" aria-label="Why choose us">
                  {trustPoints.map(({ icon: Icon, text }) => (
                    <div key={text} className="bk-side-trust-item">
                      <Icon className="bk-side-trust-icon" aria-hidden="true" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

              </aside>

            </div>{/* /bk-layout */}

            {/* ── Submit panel — full width ──────────────── */}
            <div className="bk-submit-panel">
              <div className="bk-submit-notice">
                <Info className="bk-submit-notice-icon" aria-hidden="true" />
                <div>
                  <strong>This is a reservation request — no payment is taken now.</strong>
                  <p>
                    After we review and approve your transfer, you will receive an invoice
                    and a secure payment link at the email address above.
                  </p>
                </div>
              </div>
              {submitError && (
                <div className="bk-submit-err" role="alert">
                  <AlertCircle aria-hidden="true" /><span>{submitError}</span>
                </div>
              )}
              <p className="bk-submit-fomo">
                Festival dates fill up quickly — book early to secure your spot.
              </p>
              <button type="submit" className="bk-submit-btn" disabled={step === 'submitting'}>
                {step === 'submitting' ? (
                  <><Loader2 className="spinning" aria-hidden="true" />Submitting Request…</>
                ) : (
                  <>Reserve My Ride <ChevronRight aria-hidden="true" /></>
                )}
              </button>
              <p className="bk-submit-nopay">
                No payment required now — we confirm your ride first.
              </p>
              <p className="bk-submit-footer">
                By submitting you agree to our terms. Your information is handled securely and never shared.
              </p>
            </div>

          </form>
        </div>
      </main>
    </div>
  )
}
