import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Car } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/festivals', label: 'Festivals' },
  { to: '/national-parks', label: 'National Parks' },
  { to: '/day-trips', label: 'Day Trips' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setScrolled(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <Car />
            <span>QuickRide</span>
          </Link>

          {/* Desktop links */}
          <div className="navbar-links">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`navbar-link${pathname === to ? ' active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="navbar-cta-wrapper">
            <Link to="/booking" className="navbar-cta">Reserve My Ride</Link>
          </div>

          {/* Mobile burger */}
          <button
            className="navbar-burger"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="navbar-mobile">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`navbar-mobile-link${pathname === to ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/booking"
            onClick={() => setOpen(false)}
            className="navbar-mobile-cta"
          >
            Reserve My Ride
          </Link>
        </div>
      )}
    </nav>
  )
}
