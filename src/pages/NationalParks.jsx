import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import {
  MapPin, Clock, Car, ChevronDown, ChevronUp,
  Mail, MessageCircle, ArrowRight, Check, Star, Leaf
} from 'lucide-react'

// ─── PARK DATA ───────────────────────────────────────────────────────────────
const parks = [
  {
    id: 'paklenica',
    name: 'Paklenica National Park',
    distance: '~50 km from Zadar',
    drive: '~45 min drive',
    bestTime: 'Spring & Autumn',
    difficulty: 'Moderate',
    diffColor: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=85',
    description: `Escape into the wild just 45 minutes from Zadar. Paklenica is a breathtaking limestone canyon carved deep into the Velebit mountains — Croatia's longest mountain range. Whether you're a seasoned rock climber tackling hundreds of sport routes, or a casual hiker following canyon trails through ancient forest, Paklenica will leave you speechless. Eagles circle above, the sound of rushing water fills the gorge, and around every corner the landscape grows more dramatic. This is raw, untouched Croatia at its finest — and it's right on your doorstep.`,
  },
  {
    id: 'kornati',
    name: 'Kornati National Park',
    distance: '~85 km from Zadar',
    drive: 'by boat from Murter or Šibenik',
    bestTime: 'Summer',
    difficulty: 'Easy',
    diffColor: '#22c55e',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1600&q=85',
    description: `Step aboard and sail into another world. Kornati is an extraordinary archipelago of over 140 wild, rocky islands scattered across the crystal-clear Adriatic — a place so surreal that George Bernard Shaw once said the gods used their leftover pieces of creation to make it. Accessible only by boat, Kornati rewards the adventurous with hidden coves, dramatic sea cliffs, dolphins swimming alongside your vessel, and a silence you'll never forget. Snorkel in turquoise waters, dine on fresh fish at a tiny island konoba, and watch the sun melt into the sea. Pure magic.`,
  },
  {
    id: 'krka',
    name: 'Krka National Park',
    distance: '~100 km from Zadar',
    drive: '~1h 15min drive',
    bestTime: 'Spring & Early Summer',
    difficulty: 'Easy',
    diffColor: '#22c55e',
    image: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&w=1600&q=85',
    description: `Where the water dances. Krka National Park is one of nature's great spectacles — a series of stunning cascading waterfalls tumbling through a lush river canyon, with crystal-clear pools glimmering in shades of turquoise and emerald. Stroll along wooden boardwalks right above the rushing water, hop on a boat to explore the wider park, and lose yourself in a landscape that feels almost too beautiful to be real. Just over an hour from Zadar, Krka is the perfect escape for families, couples, and anyone who believes that nature is the best artist.`,
  },
  {
    id: 'velebit',
    name: 'Northern Velebit National Park',
    distance: '~120 km from Zadar',
    drive: '~1.5h drive',
    bestTime: 'Summer',
    difficulty: 'Challenging',
    diffColor: '#ef4444',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
    description: `High above the Adriatic, a hidden world awaits. Northern Velebit is Croatia's best-kept secret — a vast alpine wilderness of ancient forest, dramatic karst peaks, rare flora, and sweeping panoramic views stretching all the way to the islands below. Far fewer crowds than Plitvice, but equally breathtaking. Hike the legendary Premužić Trail, explore the extraordinary Hajdučki kukovi rock formations, and breathe some of the cleanest air in Europe. This is a park for those who want to truly get away — and be rewarded for it.`,
  },
  {
    id: 'plitvice',
    name: 'Plitvice Lakes National Park',
    distance: '~130 km from Zadar',
    drive: '~1.5–2h drive',
    bestTime: 'Autumn & Spring',
    difficulty: 'Easy',
    diffColor: '#22c55e',
    image: 'https://images.unsplash.com/photo-1564760290292-23272d77c5b2?auto=format&fit=crop&w=1600&q=85',
    description: `Croatia's crown jewel, and one of the most beautiful places on Earth. Plitvice Lakes is a UNESCO World Heritage Site unlike anything you've ever seen — 16 terraced lakes in every shade of blue and green, connected by thundering waterfalls and winding wooden walkways that seem to float above the water. Whether you visit in the golden colours of autumn, the lush greens of summer, or the icy magic of winter, Plitvice delivers an experience that stays with you forever. This isn't just a national park — it's a masterpiece of nature.`,
  },
]

const steps = [
  { num: '01', icon: Leaf, title: 'Choose Your Park', desc: 'Browse our 5 stunning national parks and pick the one that calls to you.' },
  { num: '02', icon: Star, title: 'Pick Your Package', desc: 'Select Basic, Standard, or Premium — all include transport from Zadar.' },
  { num: '03', icon: Check, title: 'Book & Confirm', desc: 'Book in minutes. We confirm within 2 hours with everything you need.' },
  { num: '04', icon: Car, title: 'We Pick You Up', desc: 'Relax — we arrive at your door in Zadar and handle the rest.' },
]

const packages = [
  {
    tier: 'Basic',
    price: '€35',
    color: '#1a4f7a',
    popular: false,
    features: [
      'Shared transport from Zadar',
      'Park entry ticket included',
      'Pickup & drop-off in Zadar',
      'Flexible departure times',
    ],
  },
  {
    tier: 'Standard',
    price: '€55',
    color: '#E67E22',
    popular: true,
    features: [
      'Shared transport from Zadar',
      'Park entry ticket included',
      'Local expert guide',
      'Pickup & drop-off in Zadar',
      'Priority booking',
    ],
  },
  {
    tier: 'Premium',
    price: '€89',
    color: '#0a2540',
    popular: false,
    limited: true,
    features: [
      'Private transport from Zadar',
      'Park entry ticket included',
      'Expert guide (private)',
      'Lunch at local restaurant',
      'Pickup & drop-off in Zadar',
      'Flexible itinerary',
    ],
  },
]

const faqs = [
  { q: 'Is transport from Zadar included?', a: 'Yes — all our packages include comfortable door-to-door transport from your accommodation in Zadar. We pick you up and drop you back, so you can relax and enjoy every moment of the journey.' },
  { q: 'Are the trips suitable for children?', a: 'Absolutely. Parks like Krka and Plitvice are very family-friendly with easy walking routes and boardwalks. Paklenica and Northern Velebit are better suited for older children and teens. We can recommend the best park for your family.' },
  { q: 'What should I bring with me?', a: "Comfortable walking shoes, sunscreen, water, and a camera — the views will demand it. For mountain parks, a light jacket is recommended even in summer. We'll send you a full packing list after booking." },
  { q: 'How do I make a booking?', a: "Simply hit any 'Book Now' button, choose your park and package, and fill in your details. You'll receive a confirmation within 2 hours with all the information you need." },
  { q: 'Can I cancel or reschedule my trip?', a: "Yes — free cancellation up to 48 hours before your trip. Reschedules can be made up to 24 hours in advance, subject to availability. We're always happy to accommodate changes." },
  { q: 'Are the trips available year-round?', a: 'Most parks are accessible all year, though spring and autumn offer the most spectacular conditions. Some routes at Northern Velebit may be closed in winter due to snow. Contact us and we\'ll advise on the best time for your chosen park.' },
]

const galleryPhotos = [
  { src: 'https://images.unsplash.com/photo-1564760290292-23272d77c5b2?auto=format&fit=crop&w=600&q=80', alt: 'Plitvice Lakes' },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80', alt: 'Mountain canyon' },
  { src: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&w=600&q=80', alt: 'Waterfalls' },
  { src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=80', alt: 'Adriatic islands' },
  { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', alt: 'Mountain peaks' },
  { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80', alt: 'Forest landscape' },
  { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80', alt: 'Forest path' },
  { src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80', alt: 'Alpine lake' },
  { src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80', alt: 'Mountain reflection' },
]

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function NationalParks() {
  const [openFaq, setOpenFaq] = useState(null)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)

  // Parallax + scroll tracking
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Intersection Observer — fade-in on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('np-visible') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.np-fade').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const handleEmailSubmit = e => {
    e.preventDefault()
    setEmailSent(true)
    setEmail('')
  }

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="np-page">
      <Head>
        <title>National Parks of Croatia — Guided Day Trips from Zadar | QuickRide</title>
        <meta name="description" content="Discover Croatia's 5 most breathtaking national parks on guided day trips from Zadar. Plitvice, Krka, Paklenica, Kornati & Northern Velebit — all-inclusive packages with private transport." />
        <meta property="og:title" content="National Parks of Croatia — Guided Day Trips from Zadar" />
        <meta property="og:description" content="Plitvice, Krka, Paklenica, Kornati & Northern Velebit. Premium guided day trips from Zadar — transport included." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="np-hero" ref={heroRef} id="top">
        <div
          className="np-hero-parallax"
          style={{ transform: `translateY(${scrollY * 0.35}px)` }}
        >
          <video
            className="np-hero-video"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1564760290292-23272d77c5b2?auto=format&fit=crop&w=1920&q=85"
          >
            <source src="https://videos.pexels.com/video-files/3015485/3015485-hd_1280_720_25fps.mp4" type="video/mp4" />
            <source src="https://videos.pexels.com/video-files/1409899/1409899-hd_1280_720_25fps.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="np-hero-overlay" />
        <div className="np-hero-content">
          <span className="np-hero-badge">5 Parks · Guided Day Trips · From Zadar</span>
          <h1 className="np-hero-title">
            Discover Croatia's Most<br />
            <em>Breathtaking National Parks</em>
          </h1>
          <p className="np-hero-sub">
            Guided Day Trips from Zadar
          </p>
          <button
            className="np-hero-cta"
            onClick={() => scrollTo('packages')}
          >
            Book Your Trip <ArrowRight size={20} />
          </button>
        </div>
        <div className="np-hero-scroll-hint">
          <span>Scroll to explore</span>
          <div className="np-scroll-line" />
        </div>
      </section>

      {/* ── STICKY SECTION NAV ───────────────────────────────────────────── */}
      <nav className="np-section-nav">
        <div className="np-section-nav-inner">
          {[
            { id: 'parks', label: 'Parks' },
            { id: 'how-it-works', label: 'How It Works' },
            { id: 'packages', label: 'Packages' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'faq', label: 'FAQ' },
          ].map(({ id, label }) => (
            <button key={id} className="np-snav-link" onClick={() => scrollTo(id)}>
              {label}
            </button>
          ))}
          <button className="np-snav-cta" onClick={() => scrollTo('packages')}>
            Book Now
          </button>
        </div>
      </nav>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="np-how" id="how-it-works">
        <div className="np-container">
          <div className="np-section-header np-fade">
            <span className="np-label">Simple & Hassle-Free</span>
            <h2 className="np-section-title">How It Works</h2>
            <p className="np-section-sub">From browsing to boarding — we make it effortless.</p>
          </div>
          <div className="np-steps">
            {steps.map(({ num, icon: Icon, title, desc }, i) => (
              <div key={num} className="np-step np-fade" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="np-step-num">{num}</div>
                <div className="np-step-icon-wrap">
                  <Icon size={28} />
                </div>
                <h3 className="np-step-title">{title}</h3>
                <p className="np-step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARKS ────────────────────────────────────────────────────────── */}
      <section className="np-parks-section" id="parks">
        <div className="np-container">
          <div className="np-section-header np-fade">
            <span className="np-label">5 National Parks</span>
            <h2 className="np-section-title">Choose Your Adventure</h2>
            <p className="np-section-sub">Every park tells a different story. Which one is calling you?</p>
          </div>
        </div>

        <div className="np-parks-list">
          {parks.map((park, i) => (
            <article
              key={park.id}
              className={`np-park-card np-fade ${i % 2 === 1 ? 'np-park-card--reverse' : ''}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div
                className="np-park-photo"
                style={{ backgroundImage: `url(${park.image})` }}
              >
                <div className="np-park-photo-overlay" />
                <div className="np-park-photo-label">
                  <MapPin size={14} />
                  <span>{park.distance}</span>
                </div>
              </div>

              <div className="np-park-info">
                <h2 className="np-park-name">{park.name}</h2>
                <div className="np-park-meta">
                  <span className="np-park-meta-item">
                    <Clock size={14} />
                    {park.drive}
                  </span>
                  <span className="np-park-meta-item">
                    <Leaf size={14} />
                    Best: {park.bestTime}
                  </span>
                  <span className="np-park-difficulty" style={{ color: park.diffColor }}>
                    ● {park.difficulty}
                  </span>
                </div>
                <p className="np-park-desc">{park.description}</p>
                <Link
                  to={`/booking?park=${encodeURIComponent(park.name)}`}
                  className="np-park-btn"
                >
                  Book This Trip <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── MOOD QUOTE ───────────────────────────────────────────────────── */}
      <section className="np-mood">
        <div
          className="np-mood-bg"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1920&q=85)`,
            transform: `translateY(${(scrollY - 2000) * 0.15}px)`,
          }}
        />
        <div className="np-mood-overlay" />
        <div className="np-mood-content np-fade">
          <div className="np-mood-quote-mark">"</div>
          <blockquote className="np-mood-quote">
            Some places stay with you forever.<br />Croatia is one of them.
          </blockquote>
        </div>
      </section>

      {/* ── MAP ──────────────────────────────────────────────────────────── */}
      <section className="np-map-section" id="map">
        <div className="np-container">
          <div className="np-section-header np-fade">
            <span className="np-label">All Within Reach</span>
            <h2 className="np-section-title">Zadar — Your Gateway</h2>
            <p className="np-section-sub">Every park is a scenic drive or boat ride away. We handle the journey.</p>
          </div>

          <div className="np-map-layout np-fade">
            <div className="np-map-embed-wrap">
              <iframe
                className="np-map-iframe"
                src="https://www.google.com/maps/embed?pb=!1m40!1m12!1m3!1d600000!2d15.8!3d44.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2shr!4v1620000000000!5m2!1sen!2shr"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="National Parks near Zadar map"
              />
            </div>

            <div className="np-map-parks">
              {parks.map(park => (
                <div key={park.id} className="np-map-park-item">
                  <div className="np-map-pin">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="np-map-park-name">{park.name}</div>
                    <div className="np-map-park-dist">
                      {park.distance} · {park.drive}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────────────────── */}
      <section className="np-gallery-section" id="gallery">
        <div className="np-container">
          <div className="np-section-header np-fade">
            <span className="np-label">See It For Yourself</span>
            <h2 className="np-section-title">What Awaits You</h2>
            <p className="np-section-sub">These views are real — and they're waiting for you.</p>
          </div>
        </div>
        <div className="np-gallery-grid np-fade">
          {galleryPhotos.map((photo, i) => (
            <div
              key={i}
              className="np-gallery-item"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              <div className="np-gallery-hover" />
            </div>
          ))}
        </div>
      </section>

      {/* ── PACKAGES ─────────────────────────────────────────────────────── */}
      <section className="np-packages-section" id="packages">
        <div className="np-container">
          <div className="np-section-header np-fade">
            <span className="np-label">Tour Packages</span>
            <h2 className="np-section-title">Choose Your Experience</h2>
            <p className="np-section-sub">All packages include transport from Zadar and park entry. Pick your level of adventure.</p>
          </div>

          <div className="np-packages-grid">
            {packages.map((pkg, i) => (
              <div
                key={pkg.tier}
                className={`np-package-card np-fade ${pkg.popular ? 'np-package-card--popular' : ''}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {pkg.popular && (
                  <div className="np-package-badge">Most Popular</div>
                )}
                <div className="np-package-tier">{pkg.tier}</div>
                <div className="np-package-price">
                  <span className="np-package-from">From</span>
                  <span className="np-package-amount">{pkg.price}</span>
                  <span className="np-package-per">per person</span>
                </div>
                <ul className="np-package-features">
                  {pkg.features.map(f => (
                    <li key={f}>
                      <Check size={15} />
                      {f}
                    </li>
                  ))}
                </ul>
                {pkg.limited && (
                  <p className="np-package-limited">
                    ⚡ Limited Spots — Only 8 Seats Per Trip
                  </p>
                )}
                <Link
                  to={`/booking?package=${encodeURIComponent(pkg.tier)}`}
                  className={`np-package-btn ${pkg.popular ? 'np-package-btn--popular' : ''}`}
                >
                  Book Now <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="np-faq-section" id="faq">
        <div className="np-container">
          <div className="np-section-header np-fade">
            <span className="np-label">Got Questions?</span>
            <h2 className="np-section-title">Frequently Asked</h2>
          </div>

          <div className="np-faq-list np-fade">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`np-faq-item${openFaq === i ? ' np-faq-item--open' : ''}`}
              >
                <button
                  className="np-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openFaq === i && (
                  <div className="np-faq-a">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMAIL CAPTURE ─────────────────────────────────────────────────── */}
      <section className="np-email-section">
        <div className="np-container">
          <div className="np-email-inner np-fade">
            <div className="np-email-text">
              <h2 className="np-email-title">Get Exclusive Early-Bird Deals</h2>
              <p className="np-email-sub">Be the first to hear about special offers and new trips.</p>
            </div>
            {emailSent ? (
              <div className="np-email-success">
                <Check size={20} /> You're on the list! We'll be in touch.
              </div>
            ) : (
              <form className="np-email-form" onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  className="np-email-input"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="np-email-btn">
                  Subscribe <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── BOOK / CONTACT ───────────────────────────────────────────────── */}
      <section className="np-book-section" id="book">
        <div
          className="np-book-bg"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=85)` }}
        />
        <div className="np-book-overlay" />
        <div className="np-container np-book-content np-fade">
          <span className="np-label np-label--light">Ready to Explore?</span>
          <h2 className="np-book-title">Book Your Adventure</h2>
          <p className="np-book-sub">
            Get in touch and we'll plan the perfect day trip for you.
          </p>
          <div className="np-book-actions">
            <a
              href="https://wa.me/385000000000"
              className="np-book-btn np-book-btn--whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={20} />
              WhatsApp Us
            </a>
            <a
              href="mailto:info@quickride.hr"
              className="np-book-btn np-book-btn--email"
            >
              <Mail size={20} />
              Send an Email
            </a>
            <Link to="/booking" className="np-book-btn np-book-btn--main">
              Book Online <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
