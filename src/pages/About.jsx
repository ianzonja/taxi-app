import { useState } from 'react'
import { Head } from 'vite-react-ssg'
import { Users, Target, Heart, Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react'

const team = [
  { name: 'Alex Johnson', role: 'CEO & Co-founder', emoji: '👨‍💼' },
  { name: 'Maria Garcia', role: 'Head of Operations', emoji: '👩‍💼' },
  { name: 'David Park', role: 'Lead Engineer', emoji: '👨‍💻' },
  { name: 'Lisa Chen', role: 'Head of Design', emoji: '👩‍🎨' },
]

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To make transportation accessible, affordable, and stress-free for everyone — from daily commuters to airport travelers.' },
  { icon: Heart, title: 'Our Values', desc: 'Safety, reliability, and respect are at the core of everything we do. Every rider and driver matters to us.' },
  { icon: Users, title: 'Our Community', desc: "We're more than a taxi company — we're a growing community of riders and drivers building better cities together." },
]

const faqs = [
  { q: 'How do I book a ride?', a: 'Simply visit our Booking page, enter your pickup and drop-off location, choose your ride type, and confirm. Your driver will arrive within minutes.' },
  { q: 'Is QuickRide available 24/7?', a: 'Yes! QuickRide operates around the clock, every day of the year — including holidays.' },
  { q: 'How are fares calculated?', a: "Fares are based on distance, ride type, and demand. You'll always see a fare estimate before you confirm your booking." },
  { q: 'Can I schedule a ride in advance?', a: 'Absolutely. Use the Schedule option on the Booking page to set a date and time up to 7 days in advance.' },
  { q: 'How do I become a QuickRide driver?', a: "Contact us via the form below or email drivers@quickride.com. We'll walk you through the verification and onboarding process." },
]

export default function About() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const { error: msg } = await res.json()
        throw new Error(msg || 'Failed to send message')
      }
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="about-page">
      <Head>
        <title>About Us — QuickRide</title>
        <meta name="description" content="Learn about QuickRide's mission to make transportation accessible for everyone. Meet our team and discover how we're changing urban mobility." />
        <meta property="og:title" content="About Us — QuickRide" />
        <meta property="og:description" content="QuickRide's mission: safe, accessible, affordable rides for everyone across 30+ cities." />
        <meta property="og:type" content="website" />
      </Head>
      {/* Hero */}
      <section className="about-hero">
        <div className="container-sm">
          <span className="about-hero-badge">Our Story</span>
          <h1 className="about-hero-title">Built for Riders, By Riders</h1>
          <p className="about-hero-text">
            QuickRide was founded in 2020 with a simple idea: getting a reliable taxi shouldn't be a frustrating experience.
            Today we serve 50,000+ riders across 30+ cities — and we're just getting started.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="container">
          <div className="values-grid">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="value-card">
                <div className="value-icon-wrapper">
                  <Icon className="value-icon" />
                </div>
                <h3 className="value-title">{title}</h3>
                <p className="value-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Meet the Team</h2>
            <p className="section-subtitle">The people driving QuickRide forward.</p>
          </div>
          <div className="team-grid">
            {team.map(({ name, role, emoji }) => (
              <div key={name} className="team-card">
                <div className="team-avatar">{emoji}</div>
                <p className="team-name">{name}</p>
                <p className="team-role">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container-sm">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {q}
                  <span className={`faq-icon${openFaq === i ? ' open' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="faq-answer">{a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Info */}
            <div className="contact-info">
              <div>
                <h2 className="contact-info-title">Get in Touch</h2>
                <p className="contact-info-text">Have a question or want to partner with us? We'd love to hear from you.</p>
              </div>
              <div className="contact-items">
                {[
                  { icon: Phone, label: 'Phone', value: '+1 (800) 123-4567' },
                  { icon: Mail, label: 'Email', value: 'hello@quickride.com' },
                  { icon: MapPin, label: 'Address', value: '123 Main Street, New York, NY 10001' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="contact-item">
                    <div className="contact-item-icon-wrapper">
                      <Icon className="contact-item-icon" />
                    </div>
                    <div>
                      <p className="contact-item-label">{label}</p>
                      <p className="contact-item-value">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-card">
              {sent ? (
                <div className="contact-form-sent">
                  <CheckCircle className="contact-form-sent-icon" />
                  <h3 className="contact-form-sent-title">Message Sent!</h3>
                  <p className="contact-form-sent-text">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}
                    className="contact-form-sent-btn"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <h3 className="contact-form-title">Send a Message</h3>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    className="contact-form-input"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    className="contact-form-input"
                  />
                  <textarea
                    placeholder="Your message..."
                    rows={4}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                    className="contact-form-textarea"
                  />
                  {error && (
                    <p className="contact-form-error">{error}</p>
                  )}
                  <button type="submit" className="contact-form-submit" disabled={loading}>
                    {loading ? 'Sending…' : <><span>Send Message</span> <Send /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
