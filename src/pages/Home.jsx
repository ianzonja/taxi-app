import { Link } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import {
  Star, ChevronRight, Quote,
  Plane, Clock, Car, MapPin,
  Dog, Baby, Package, Shield, Anchor,
  ArrowRight, Music, Compass, Users, Check,
} from 'lucide-react'

/* ─── Data ─────────────────────────────────────────────────── */

const benefits = [
  {
    icon: Dog,
    title: 'Pet Friendly',
    desc: 'Bring your beloved companions along — our drivers warmly welcome four-legged passengers.',
  },
  {
    icon: Baby,
    title: 'Baby Friendly',
    desc: 'Child safety seats available on request for a safe, comfortable journey with your little ones.',
  },
  {
    icon: Package,
    title: 'Extra Luggage',
    desc: 'Spacious vehicles with generous boot space for large bags, surfboards, and sports equipment.',
  },
]

const services = [
  {
    icon: Car,
    title: 'Private Transfers',
    desc: 'Door-to-door private rides with no shared passengers, no detours — just you and Croatia\'s stunning scenery.',
  },
  {
    icon: Plane,
    title: 'Airport Pickups',
    desc: 'Meet & greet service at Split, Dubrovnik and Zadar airports. We track your flight so you never wait.',
  },
  {
    icon: MapPin,
    title: 'Coastal Routes',
    desc: 'Scenic rides along the entire Dalmatian coast — from Split to Dubrovnik, Hvar, Brač and everywhere between.',
  },
  {
    icon: Clock,
    title: '24 / 7 Availability',
    desc: 'Early morning flight? Late-night arrival? We operate around the clock, every day of the year.',
  },
]

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Tourist from London',
    rating: 5,
    text: 'Absolutely perfect transfer from Split to Dubrovnik! The driver was professional, the car spotless, and the coastal views were breathtaking.',
  },
  {
    name: 'James R.',
    role: 'Business Traveler',
    rating: 5,
    text: 'Used them for airport pickups twice this summer. Always punctual, very professional. Makes business travel along the coast completely stress-free.',
  },
  {
    name: 'Emily L.',
    role: 'Family Vacationer',
    rating: 5,
    text: 'Traveled with two kids and all our luggage. The baby seat was ready, the driver was patient and kind. Could not have asked for more!',
  },
]

const stats = [
  { value: '8+',   label: 'Years on the Coast' },
  { value: '12K+', label: 'Happy Travelers' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '100+', label: 'Routes Covered' },
]

const scenicImages = [
  {
    src: 'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=800&q=80',
    alt: 'Split Old Town viewed from the sea',
    caption: 'Split — Jewel of the Adriatic',
  },
  {
    src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    alt: 'Scenic coastal road through Croatia',
    caption: 'Drive through breathtaking coastal roads',
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    alt: 'Crystal-clear Adriatic waters',
    caption: 'Crystal-clear Adriatic waters',
  },
  {
    src: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    alt: 'Sailing boat on the Dalmatian sea',
    caption: 'Reach every island and hidden cove',
  },
]

/* New conversion-focused data */
const experiences = [
  {
    icon: Plane,
    title: 'Airport Transfers',
    desc: 'Fast, reliable rides from Zadar Airport to anywhere on the coast.',
    link: '/booking',
    cta: 'Book Now',
    color: '#2e86c1',
  },
  {
    icon: Music,
    title: 'Festival Transfers',
    desc: 'Stress-free transport to Croatia\'s biggest festivals — Sonus, Defected, Ultra & more.',
    link: '/festivals',
    cta: 'Explore',
    color: '#8b5cf6',
  },
  {
    icon: Compass,
    title: 'Day Trips from Zadar',
    desc: 'Discover hidden gems, food, and adventures — all in one day.',
    link: '/day-trips',
    cta: 'Explore',
    color: '#e67e22',
  },
]

const quickRoutes = [
  { from: 'Zadar Airport', to: 'Old Town Zadar', time: '~15 min' },
  { from: 'Zadar',         to: 'Pag Island',    time: '~1h drive' },
  { from: 'Zadar',         to: 'Nin',           time: '~20 min' },
  { from: 'Zadar',         to: 'Tisno (Festivals)', time: '~45 min' },
]

const trustItems = [
  { icon: Users,  text: 'Local drivers' },
  { icon: Shield, text: 'Fixed prices' },
  { icon: Check,  text: 'Free cancellation' },
  { icon: Clock,  text: 'Fast response' },
]

/* ─── Component ──────────────────────────────────────────────── */

export default function Home() {
  return (
    <div>
      <Head>
        <title>QuickRide — Private Transfers & Day Trips from Zadar, Croatia</title>
        <meta name="description" content="Airport pickups, festival rides, and curated local day trips from Zadar. Fixed prices, local drivers, free cancellation. Book your transfer in minutes." />
        <meta property="og:title" content="QuickRide — Private Transfers & Day Trips from Zadar, Croatia" />
        <meta property="og:description" content="Airport pickups, festival rides, and curated local experiences — all with fixed prices and local drivers." />
        <meta property="og:type" content="website" />
        <style>{`
          /* ── Experience Cards ── */
          .hm-exp-section {
            background: #fff;
            padding: 4.5rem 0 3.5rem;
          }
          .hm-exp-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.25rem;
            margin-top: 2.5rem;
          }
          @media (min-width: 640px)  { .hm-exp-grid { grid-template-columns: repeat(3, 1fr); } }

          .hm-exp-card {
            background: #fafaf9;
            border: 1px solid rgba(10,37,64,0.08);
            border-radius: 1.25rem;
            padding: 2rem 1.75rem;
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
            transition: transform 0.25s ease, box-shadow 0.25s ease;
            text-decoration: none;
            color: inherit;
          }
          .hm-exp-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 36px rgba(10,37,64,0.1);
          }
          .hm-exp-icon-wrap {
            width: 3rem;
            height: 3rem;
            border-radius: 0.875rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .hm-exp-icon-wrap svg { width: 1.4rem; height: 1.4rem; color: #fff; }
          .hm-exp-title {
            font-size: 1.05rem;
            font-weight: 700;
            color: #0a2540;
            margin: 0;
          }
          .hm-exp-desc {
            font-size: 0.875rem;
            color: #5a6a7a;
            line-height: 1.65;
            margin: 0;
            flex: 1;
          }
          .hm-exp-cta {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            font-size: 0.82rem;
            font-weight: 700;
            color: #0a2540;
            margin-top: 0.25rem;
          }
          .hm-exp-cta svg { width: 14px; height: 14px; }

          /* ── Quick Routes ── */
          .hm-routes-section {
            background: #f5f4f2;
            padding: 4rem 0;
          }
          .hm-routes-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            margin-top: 2rem;
          }
          @media (min-width: 480px) { .hm-routes-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (min-width: 900px) { .hm-routes-grid { grid-template-columns: repeat(4, 1fr); } }

          .hm-route-card {
            background: #fff;
            border: 1px solid rgba(10,37,64,0.08);
            border-radius: 1rem;
            padding: 1.25rem 1.35rem;
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .hm-route-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 28px rgba(10,37,64,0.1);
          }
          .hm-route-from {
            font-size: 0.72rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #8a9aaa;
          }
          .hm-route-arrow {
            font-size: 0.75rem;
            color: #e67e22;
            font-weight: 700;
            margin: 0.1rem 0;
          }
          .hm-route-to {
            font-size: 0.95rem;
            font-weight: 700;
            color: #0a2540;
          }
          .hm-route-time {
            font-size: 0.75rem;
            color: #7a8a9a;
            display: flex;
            align-items: center;
            gap: 0.3rem;
            margin-top: 0.25rem;
          }
          .hm-route-time svg { width: 12px; height: 12px; color: #e67e22; }
          .hm-route-btn {
            margin-top: 0.75rem;
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
            font-size: 0.78rem;
            font-weight: 700;
            color: #fff;
            background: #0a2540;
            padding: 0.45rem 1rem;
            border-radius: 999px;
            align-self: flex-start;
            transition: background 0.2s;
          }
          .hm-route-card:hover .hm-route-btn { background: #e67e22; }

          /* ── Cruise Section ── */
          .hm-cruise-section {
            background: linear-gradient(135deg, #0a2540 0%, #1a4f7a 100%);
            padding: 4.5rem 0;
          }
          .hm-cruise-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2.5rem;
            flex-wrap: wrap;
          }
          .hm-cruise-badge {
            display: inline-block;
            background: rgba(230,126,34,0.2);
            border: 1px solid rgba(230,126,34,0.4);
            color: #f8c685;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            padding: 0.3rem 0.9rem;
            border-radius: 999px;
            margin-bottom: 0.85rem;
          }
          .hm-cruise-title {
            font-size: clamp(1.6rem, 3vw, 2.25rem);
            font-weight: 900;
            color: #fff;
            margin: 0 0 0.85rem;
            line-height: 1.2;
          }
          .hm-cruise-text {
            font-size: 1rem;
            color: rgba(255,255,255,0.72);
            line-height: 1.7;
            margin: 0;
            max-width: 36rem;
          }
          .hm-cruise-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: #e67e22;
            color: #fff;
            font-size: 1rem;
            font-weight: 700;
            padding: 0.9rem 2rem;
            border-radius: 999px;
            text-decoration: none;
            white-space: nowrap;
            flex-shrink: 0;
            box-shadow: 0 6px 24px rgba(230,126,34,0.45);
            transition: background 0.2s, transform 0.15s;
          }
          .hm-cruise-btn:hover { background: #f39c12; transform: translateY(-2px); }

          /* ── Trust Strip ── */
          .hm-trust-strip {
            background: #0a2540;
            padding: 1.1rem 0;
          }
          .hm-trust-inner {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 0;
          }
          .hm-trust-item {
            display: flex;
            align-items: center;
            gap: 0.45rem;
            color: rgba(255,255,255,0.8);
            font-size: 0.82rem;
            font-weight: 500;
            padding: 0.5rem 1.5rem;
            border-right: 1px solid rgba(255,255,255,0.1);
            white-space: nowrap;
          }
          .hm-trust-item:last-child { border-right: none; }
          .hm-trust-item svg { color: #e67e22; width: 15px; height: 15px; flex-shrink: 0; }
          @media (max-width: 600px) {
            .hm-trust-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); width: 100%; justify-content: center; }
            .hm-trust-item:last-child { border-bottom: none; }
            .hm-cruise-inner { flex-direction: column; align-items: flex-start; }
          }
        `}</style>
      </Head>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hero-coastal" aria-label="Hero">
        <img
          src="https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=1920&q=80"
          alt="Dubrovnik and the Dalmatian coastline"
          className="hero-coastal-bg"
        />
        <div className="hero-coastal-overlay" aria-hidden="true" />

        <div className="container">
          <div className="hero-coastal-content">
            <span className="hero-coastal-badge">
              <Star className="hero-coastal-badge-icon" aria-hidden="true" />
              Rated 4.9 by 12,000+ Travelers
            </span>

            <h1 className="hero-coastal-title">
              Private Transfers &amp; Day Trips<br />
              <span className="hero-coastal-title-accent">from Zadar</span>
            </h1>

            <p className="hero-coastal-subtitle">
              Airport pickups, festival rides, and curated local experiences — all with fixed prices and local drivers.
            </p>

            <div className="hero-coastal-actions">
              <Link to="/booking" className="btn btn-coastal-primary">
                Book Your Ride <ChevronRight aria-hidden="true" />
              </Link>
              <Link to="/day-trips" className="btn btn-coastal-ghost">
                Explore Day Trips
              </Link>
            </div>

            <div className="hero-coastal-trust">
              <div className="hero-coastal-trust-item">
                <Shield className="hero-coastal-trust-icon" aria-hidden="true" />
                <span>Licensed &amp; Insured</span>
              </div>
              <div className="hero-coastal-trust-item">
                <Clock className="hero-coastal-trust-icon" aria-hidden="true" />
                <span>24 / 7 Service</span>
              </div>
              <div className="hero-coastal-trust-item">
                <Anchor className="hero-coastal-trust-icon" aria-hidden="true" />
                <span>8+ Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────── */}
      <div className="hm-trust-strip" aria-label="Trust signals">
        <div className="container">
          <div className="hm-trust-inner">
            {trustItems.map(({ icon: Icon, text }) => (
              <div key={text} className="hm-trust-item">
                <Icon aria-hidden="true" /> {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="coastal-stats" aria-label="Key statistics">
        <div className="container">
          <div className="coastal-stats-grid">
            {stats.map(({ value, label }) => (
              <div key={label} className="coastal-stat-item">
                <p className="coastal-stat-value">{value}</p>
                <p className="coastal-stat-label">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHOOSE YOUR EXPERIENCE ────────────────────────────── */}
      <section className="hm-exp-section" aria-label="Choose your experience">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Choose Your Experience</h2>
            <p className="section-subtitle">
              From airport pickups to festival rides and curated day trips — we cover every journey in Zadar.
            </p>
          </div>
          <div className="hm-exp-grid">
            {experiences.map(({ icon: Icon, title, desc, link, cta, color }) => (
              <Link key={title} to={link} className="hm-exp-card">
                <div className="hm-exp-icon-wrap" style={{ background: color }} aria-hidden="true">
                  <Icon />
                </div>
                <h3 className="hm-exp-title">{title}</h3>
                <p className="hm-exp-desc">{desc}</p>
                <span className="hm-exp-cta">
                  {cta} <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR ROUTES ────────────────────────────────────── */}
      <section className="hm-routes-section" aria-label="Popular routes">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Routes</h2>
            <p className="section-subtitle">The most-booked transfers from Zadar — fixed price, no surprises.</p>
          </div>
          <div className="hm-routes-grid">
            {quickRoutes.map(({ from, to, time }) => (
              <Link
                key={to}
                to={`/booking?pickup=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`}
                className="hm-route-card"
              >
                <span className="hm-route-from">{from}</span>
                <span className="hm-route-arrow">→</span>
                <span className="hm-route-to">{to}</span>
                <span className="hm-route-time">
                  <Clock aria-hidden="true" /> {time}
                </span>
                <span className="hm-route-btn">
                  Book Now <ArrowRight size={12} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CRUISE VISITORS ───────────────────────────────────── */}
      <section className="hm-cruise-section" aria-label="Cruise visitors">
        <div className="container">
          <div className="hm-cruise-inner">
            <div>
              <span className="hm-cruise-badge">Cruise Visitors</span>
              <h2 className="hm-cruise-title">In Zadar for a Few Hours?</h2>
              <p className="hm-cruise-text">
                Make the most of your time with quick, curated trips designed for cruise travelers.
                Short, flexible experiences that fit your port schedule — with a local driver waiting when you arrive.
              </p>
            </div>
            <Link to="/day-trips" className="hm-cruise-btn">
              See Day Trips <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────── */}
      <section className="benefits-section" aria-label="Our benefits">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">We Thought of Everything</h2>
            <p className="section-subtitle">Your comfort is our priority — for every passenger, every journey.</p>
          </div>
          <div className="benefits-grid">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <article key={title} className="benefit-card">
                <div className="benefit-icon-wrapper" aria-hidden="true">
                  <Icon className="benefit-icon" />
                </div>
                <h3 className="benefit-title">{title}</h3>
                <p className="benefit-desc">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCENIC SHOWCASE ──────────────────────────────────── */}
      <section className="scenic-section" aria-label="Dalmatian Coast showcase">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Travel in Comfort Along Croatia's Most Beautiful Routes</h2>
            <p className="section-subtitle">
              From the ancient walls of Dubrovnik to the lavender fields of Hvar — we know every road.
            </p>
          </div>
          <div className="scenic-grid">
            {scenicImages.map(({ src, alt, caption }) => (
              <div key={alt} className="scenic-card">
                <img src={src} alt={alt} className="scenic-card-img" loading="lazy" />
                <div className="scenic-card-caption" aria-hidden="true">{caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────── */}
      <section className="services-section" aria-label="Our services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What We Offer</h2>
            <p className="section-subtitle">Premium transportation tailored for the Dalmatian coast.</p>
          </div>
          <div className="services-grid">
            {services.map(({ icon: Icon, title, desc }) => (
              <article key={title} className="service-card">
                <div className="service-icon-wrapper" aria-hidden="true">
                  <Icon className="service-icon" />
                </div>
                <div>
                  <h3 className="service-title">{title}</h3>
                  <p className="service-desc">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="testimonials-section coastal-testimonials" aria-label="Traveler reviews">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Travelers Say</h2>
            <p className="section-subtitle">Real experiences from people who explored the Dalmatian coast with us.</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map(({ name, role, rating, text }) => (
              <article key={name} className="testimonial-card">
                <Quote className="testimonial-quote-icon" aria-hidden="true" />
                <p className="testimonial-text">{text}</p>
                <div className="testimonial-footer">
                  <div>
                    <p className="testimonial-name">{name}</p>
                    <p className="testimonial-role">{role}</p>
                  </div>
                  <div className="testimonial-stars" aria-label={`${rating} out of 5 stars`}>
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="testimonial-star" aria-hidden="true" />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="coastal-cta-section" aria-label="Book your journey">
        <img
          src="https://images.unsplash.com/photo-1504681869696-d977211a5f4c?auto=format&fit=crop&w=1920&q=80"
          alt="Scenic coastal road at golden hour"
          className="coastal-cta-bg"
          loading="lazy"
        />
        <div className="coastal-cta-overlay" aria-hidden="true" />
        <div className="coastal-cta-content">
          <h2 className="coastal-cta-title">Plan Your Coastal Journey Today</h2>
          <p className="coastal-cta-subtitle">
            Let us take the wheel while you take in the view. Book your private transfer in minutes.
          </p>
          <Link to="/booking" className="btn btn-coastal-primary">
            Book Your Ride <ChevronRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
