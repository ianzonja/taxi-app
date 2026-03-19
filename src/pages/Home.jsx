import { Link } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import {
  MapPin, Star, Shield, Clock, Zap, Users, Car, ChevronRight, Quote
} from 'lucide-react'

const features = [
  { icon: Zap, title: 'Instant Booking', desc: 'Book a ride in seconds with our streamlined app — no waiting, no hassle.' },
  { icon: Shield, title: 'Safe & Verified', desc: 'Every driver is background-checked and rated by thousands of riders.' },
  { icon: Clock, title: '24/7 Available', desc: "Need a ride at 3am? We're always here — day, night, and everything between." },
  { icon: MapPin, title: 'Live Tracking', desc: 'Track your driver in real time and share your trip with loved ones.' },
]

const steps = [
  { num: '01', title: 'Set Your Destination', desc: 'Enter your pickup and drop-off location.' },
  { num: '02', title: 'Choose Your Ride', desc: 'Pick from Economy, Comfort, or Premium.' },
  { num: '03', title: 'Confirm & Relax', desc: 'Your driver arrives in minutes. Sit back and enjoy.' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'Daily Commuter', rating: 5, text: 'QuickRide has completely changed my morning commute. Always on time, clean cars, and friendly drivers!' },
  { name: 'James R.', role: 'Business Traveler', rating: 5, text: 'I use QuickRide for all my airport transfers. The Premium tier is worth every penny — professional and punctual.' },
  { name: 'Emily L.', role: 'Weekend Explorer', rating: 5, text: "Best taxi app I've used. The live tracking feature gives me so much peace of mind when traveling alone." },
]

const stats = [
  { value: '50K+', label: 'Happy Riders' },
  { value: '1,200+', label: 'Verified Drivers' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '30+', label: 'Cities Covered' },
]

const avatarColors = ['hero-avatar-blue', 'hero-avatar-indigo', 'hero-avatar-sky', 'hero-avatar-violet']

export default function Home() {
  return (
    <div>
      <Head>
        <title>QuickRide — Fast, Safe &amp; Affordable Rides</title>
        <meta name="description" content="Book a ride in seconds with QuickRide. Fast, safe, and affordable rides available 24/7 in 30+ cities. Instant booking, live tracking, and verified drivers." />
        <meta property="og:title" content="QuickRide — Fast, Safe & Affordable Rides" />
        <meta property="og:description" content="Book a ride in seconds with QuickRide. Fast, safe, and affordable rides available 24/7 in 30+ cities." />
        <meta property="og:type" content="website" />
      </Head>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="badge badge-blue">
                <Zap className="hero-badge-icon" /> Available in 30+ cities
              </span>
              <h1 className="hero-title">
                Your Ride,<br />
                <span className="hero-title-accent">Your Rules.</span>
              </h1>
              <p className="hero-subtitle">
                Fast, safe, and affordable rides at your fingertips. Book in seconds and arrive in comfort — any time, anywhere.
              </p>
              <div className="hero-actions">
                <Link to="/booking" className="btn btn-primary">
                  Book a Ride <ChevronRight />
                </Link>
                <Link to="/about" className="btn btn-secondary">
                  Learn More
                </Link>
              </div>
              <div className="hero-social-proof">
                <div className="hero-avatars">
                  {avatarColors.map((c, i) => (
                    <div key={i} className={`hero-avatar ${c}`}>
                      <Users />
                    </div>
                  ))}
                </div>
                <p className="hero-proof-text">
                  <span className="hero-proof-count">50,000+</span> happy riders this month
                </p>
              </div>
            </div>

            {/* Hero visual */}
            <div className="hero-visual">
              <div className="hero-visual-card">
                <Car />
              </div>
              {/* Floating cards */}
              <div className="hero-float-card hero-float-card-bottom">
                <div className="hero-float-icon-wrapper hero-float-icon-wrapper-green">
                  <MapPin className="hero-float-icon-green" />
                </div>
                <div>
                  <p className="hero-float-label">Driver nearby</p>
                  <p className="hero-float-value">2 min away</p>
                </div>
              </div>
              <div className="hero-float-card hero-float-card-top">
                <div className="hero-float-icon-wrapper hero-float-icon-wrapper-yellow">
                  <Star className="hero-float-icon-yellow" />
                </div>
                <div>
                  <p className="hero-float-label">Top rated</p>
                  <p className="hero-float-value">4.9 / 5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="stats-value">{value}</p>
                <p className="stats-label">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose QuickRide?</h2>
            <p className="section-subtitle">We go the extra mile so you don't have to. Here's what makes us different.</p>
          </div>
          <div className="features-grid">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feature-card">
                <div className="feature-icon-wrapper">
                  <Icon className="feature-icon" />
                </div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to your perfect ride.</p>
          </div>
          <div className="how-grid">
            {steps.map(({ num, title, desc }, i) => (
              <div key={num} className="how-step">
                {i < steps.length - 1 && <div className="how-connector" />}
                <div className="how-step-num">{num}</div>
                <h3 className="how-step-title">{title}</h3>
                <p className="how-step-desc">{desc}</p>
              </div>
            ))}
          </div>
          <div className="how-cta">
            <Link to="/booking" className="btn btn-primary">
              Book Your Ride Now <ChevronRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Riders Say</h2>
            <p className="section-subtitle">Real experiences from real people.</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map(({ name, role, rating, text }) => (
              <div key={name} className="testimonial-card">
                <Quote className="testimonial-quote-icon" />
                <p className="testimonial-text">{text}</p>
                <div className="testimonial-footer">
                  <div>
                    <p className="testimonial-name">{name}</p>
                    <p className="testimonial-role">{role}</p>
                  </div>
                  <div className="testimonial-stars">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="testimonial-star" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <h2 className="cta-title">Ready for Your Next Ride?</h2>
        <p className="cta-subtitle">Join over 50,000 riders who trust QuickRide every day. Download the app or book online.</p>
        <Link to="/booking" className="btn btn-white">
          Get Started <ChevronRight />
        </Link>
      </section>
    </div>
  )
}
