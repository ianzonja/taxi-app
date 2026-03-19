import { Link } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import {
  Star, ChevronRight, Quote,
  Plane, Clock, Car, MapPin,
  Dog, Baby, Package, Shield, Anchor,
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

/* Four iconic Dalmatian-coast images from Unsplash CDN */
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

/* ─── Component ──────────────────────────────────────────────── */

export default function Home() {
  return (
    <div>
      <Head>
        <title>QuickRide — Private Transfers Along Croatia's Stunning Coastline</title>
        <meta name="description" content="Premium private transfers along the Dalmatian coast. Pet friendly, baby friendly, extra luggage options. Airport pickups in Split, Dubrovnik and Zadar." />
        <meta property="og:title" content="QuickRide — Private Transfers Along Croatia's Stunning Coastline" />
        <meta property="og:description" content="Premium private transfers along the Dalmatian coast. Book your coastal journey today." />
        <meta property="og:type" content="website" />
      </Head>

      {/* ── HERO ─────────────────────────────────────────────── */}
      {/*
        Full-viewport hero with a real Adriatic coastline photo.
        An <img> is used as the background so SSG can lazy-resolve it
        and screen readers get a meaningful alt attribute.
        The overlay gradient keeps white text readable at all viewport sizes.
      */}
      <section className="hero-coastal" aria-label="Hero">
        <img
          src="https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=1920&q=80"
          alt="Dubrovnik and the Dalmatian coastline"
          className="hero-coastal-bg"
        />
        <div className="hero-coastal-overlay" aria-hidden="true" />

        <div className="container">
          <div className="hero-coastal-content">
            {/* Small trust badge */}
            <span className="hero-coastal-badge">
              <Star className="hero-coastal-badge-icon" aria-hidden="true" />
              Rated 4.9 by 12,000+ Travelers
            </span>

            <h1 className="hero-coastal-title">
              Private Transfers Along<br />
              <span className="hero-coastal-title-accent">Croatia's Stunning Coastline</span>
            </h1>

            <p className="hero-coastal-subtitle">
              Relax in comfort as we drive you through the most beautiful scenery in the Mediterranean.
              Pet friendly · Baby friendly · Extra luggage options.
            </p>

            <div className="hero-coastal-actions">
              <Link to="/booking" className="btn btn-coastal-primary">
                Book a Ride <ChevronRight aria-hidden="true" />
              </Link>
              <Link to="/about" className="btn btn-coastal-ghost">
                Learn More
              </Link>
            </div>

            {/* Three quick trust indicators below the CTA */}
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

      {/* ── STATS BAR ────────────────────────────────────────── */}
      {/* Dark navy strip — creates contrast between the hero and benefits */}
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

      {/* ── BENEFITS ─────────────────────────────────────────── */}
      {/*
        Sand-toned section so it feels warm and distinct from the white body.
        Three equal cards — stacked on mobile, three columns on desktop.
      */}
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
      {/*
        Four-image grid celebrating the Dalmatian coastline.
        Hover reveals a subtle scale and caption fade-in.
        Images lazy-load since they are below the fold.
      */}
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
      {/* Light gray background to separate from white scenic section */}
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
      {/* Reuses existing testimonial CSS classes for consistency */}
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

      {/* ── CTA ──────────────────────────────────────────────── */}
      {/*
        Second full-width image section — a scenic coastal road at golden hour.
        Same image-overlay pattern as the hero for visual consistency.
      */}
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
            Book a Ride <ChevronRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
