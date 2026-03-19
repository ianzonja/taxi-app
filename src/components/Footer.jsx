import { Link } from 'react-router-dom'
import { Car, Facebook, Twitter, Instagram, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-brand-title">
              <Car className="footer-brand-icon" />
              <span>QuickRide</span>
            </div>
            <p className="footer-brand-desc">
              Your trusted ride partner. Fast, safe, and affordable taxi service available 24/7.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link"><Facebook /></a>
              <a href="#" className="footer-social-link"><Twitter /></a>
              <a href="#" className="footer-social-link"><Instagram /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              {[['/', 'Home'], ['/booking', 'Book a Ride'], ['/blog', 'Blog'], ['/about', 'About Us']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="footer-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-services">
              {['City Rides', 'Airport Transfer', 'Outstation Trips', 'Corporate Travel', 'Hourly Hire'].map(s => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <MapPin className="footer-contact-icon" />
                <span className="footer-contact-text">123 Main Street, New York, NY 10001</span>
              </li>
              <li className="footer-contact-item-center">
                <Phone className="footer-contact-icon-inline" />
                <span className="footer-contact-text">+1 (800) 123-4567</span>
              </li>
              <li className="footer-contact-item-center">
                <Mail className="footer-contact-icon-inline" />
                <span className="footer-contact-text">hello@quickride.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} QuickRide. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
