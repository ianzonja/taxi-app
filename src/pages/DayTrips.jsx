import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import {
  MapPin, Clock, Car, ArrowRight, Check, Star,
  ExternalLink, Anchor, Zap, Utensils, Eye, Wind,
  Mountain, Waves, ChevronDown, ChevronUp,
} from 'lucide-react'

// ─── ACTIVITY DATA ────────────────────────────────────────────────────────────
const activities = [
  // ── NATURE & HISTORY ──
  {
    id: 'nin',
    category: 'Nature & History',
    name: 'Nin — Lagoon Town & Ancient Royalty',
    distance: '~18 km from Zadar',
    drive: '~20 min drive',
    tag: 'Relaxing · Historic',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
    intro: 'Step into one of Croatia\'s oldest royal towns. Nin is a magical island-town encircled by a warm shallow lagoon, sandy beaches, and centuries of untouched history — a short, perfect escape from Zadar.',
    highlights: [
      'Smallest cathedral in the world — St. Nicholas Church',
      'Golden sandy beaches unlike the rest of the Dalmatian coast',
      'Ancient salt fields — still harvested by hand today',
      'Warm, shallow lagoon waters ideal for families and relaxation',
      'Over a thousand years of Croatian royal heritage',
    ],
    duration: 'Half day',
    rec: 'Perfect for: couples, families, history lovers, first-time visitors.',
    cta: 'Plan Your Day Trip',
    extLink: 'https://www.nin.hr',
    extLabel: 'Official Nin Tourism',
  },
  {
    id: 'pag',
    category: 'Nature & History',
    name: 'Pag Island — Moon Landscape & Famous Cheese',
    distance: '~90 km from Zadar',
    drive: '~1h drive',
    tag: 'Culture · Food · Scenery',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85',
    intro: 'Step onto an island that feels like another planet. Pag\'s dramatic, moon-like landscape—shaped by fierce winds and salt—creates one of the most unique settings in Croatia. Pair that with world-famous cheese and centuries-old traditions, and you have an unforgettable escape from Zadar.',
    highlights: [
      'Taste the legendary Paški sir — one of Croatia\'s most awarded cheeses',
      'Explore the surreal lunar landscape shaped by the powerful bura wind',
      'Discover UNESCO-protected lace-making traditions in Pag town',
      'Walk through historic streets filled with Dalmatian character',
      'Enjoy panoramic coastal views unlike anywhere else in Croatia',
    ],
    duration: 'Full day',
    rec: 'Perfect for: food lovers, photographers, and travelers looking for something truly different.',
    cta: 'Book My Transfer',
    extLink: 'https://www.visit-croatia.hr/en/destinations/dalmatia-north/island-pag',
    extLabel: 'Official Guide',
  },

  // ── ADVENTURE ──
  {
    id: 'bungee',
    category: 'Adrenaline & Adventure',
    name: 'Maslenica Bungee Jump',
    distance: '~60 km from Zadar',
    drive: '~50 min drive',
    tag: 'Extreme · Unique',
    image: 'https://images.unsplash.com/photo-1510870647555-a6a7e3d8e3b9?auto=format&fit=crop&w=1600&q=85',
    intro: 'Feel your heart race as you leap from the iconic Maslenica bridge, suspended above a stunning Adriatic canyon. This is not just a jump—it\'s one of Croatia\'s most unforgettable adrenaline experiences.',
    highlights: [
      'Jump from a spectacular bridge above the Adriatic sea canyon',
      'One of the most scenic bungee locations in Europe',
      'Professional instructors and top-tier safety standards',
      'Incredible photo and video opportunities',
      'A true bucket-list experience near Zadar',
    ],
    duration: '2–3 hours',
    rec: 'Perfect for: thrill seekers, adrenaline lovers, and unforgettable memories.',
    cta: 'Reserve My Spot',
    extLink: 'https://zzuum.com/adrenaline-activities/zadar-bungee-jump/',
    extLabel: 'View Experience',
  },
  {
    id: 'skydiving',
    category: 'Adrenaline & Adventure',
    name: 'Skydiving Over Zadar',
    distance: 'Zadar area',
    drive: '~15 min from Zadar',
    tag: 'Once in a Lifetime',
    image: 'https://images.unsplash.com/photo-1601024445121-e5b82f020549?auto=format&fit=crop&w=1600&q=85',
    intro: 'Take your adventure to new heights—literally. Freefall from 4,000 meters above Zadar and witness a breathtaking panorama of islands, coastline, and crystal-clear Adriatic waters.',
    highlights: [
      'Tandem jump with certified professional instructors',
      'Unmatched aerial views of the Zadar archipelago',
      'No experience required — full briefing included',
      'Optional video and photo packages to capture your jump',
      'Once-in-a-lifetime perspective of Croatia\'s coastline',
    ],
    duration: 'Best seller',
    rec: 'Perfect for: first-timers, adventure couples, and bucket-list travelers.',
    cta: 'Check Availability',
    extLink: 'https://skydiveadria.com/',
    extLabel: 'View Experience',
  },
  {
    id: 'quad',
    category: 'Adrenaline & Adventure',
    name: 'Quad Safari — Off-Road Adventure',
    distance: 'Zadar surroundings',
    drive: 'Pickup from Zadar',
    tag: 'Off-Road · Fun',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=85',
    intro: 'Escape the roads and dive into raw Dalmatian nature. Ride through dusty trails, pine forests, and hidden viewpoints on a thrilling quad safari just outside Zadar.',
    highlights: [
      'Off-road routes through untouched Croatian countryside',
      'No experience needed — beginner-friendly tours available',
      'Discover hidden viewpoints and local landscapes',
      'Small group experience for a more personal adventure',
      'All safety equipment included',
    ],
    duration: '2–3 hours',
    rec: 'Perfect for: active travelers, groups, and outdoor adventure lovers.',
    cta: 'Reserve My Spot',
    extLink: 'https://www.quad-zadar.hr/',
    extLabel: 'View Experience',
  },
  {
    id: 'jetski',
    category: 'Adrenaline & Adventure',
    name: 'Jet Ski — Ride the Adriatic',
    distance: 'Zadar marina',
    drive: 'Right from Zadar',
    tag: 'Sea · Speed · Fun',
    image: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?auto=format&fit=crop&w=1600&q=85',
    intro: 'Feel the freedom of the open sea as you ride across the Adriatic. Fast, fun, and refreshing—this is one of the best ways to experience Zadar\'s coastline in a short time.',
    highlights: [
      'High-speed ride along the stunning Zadar coastline',
      'Perfect short activity for cruise visitors',
      'Guided options available — no license needed',
      'Swim stops in crystal-clear water',
      'Incredible views of islands and old town from the sea',
    ],
    duration: '1–2 hours',
    rec: 'Perfect for: quick adventures, couples, and sea lovers.',
    cta: 'Check Availability',
    extLink: 'https://www.checkyeti.com/en/water-sports/croatia/zadar/jet-ski-banana-boat-wakeboard',
    extLabel: 'View Experience',
  },

  // ── UNIQUE EXPERIENCES ──
  {
    id: 'horseback',
    category: 'Unique Experiences',
    name: 'Horseback Riding — Coastal Trails',
    distance: 'Zadar surroundings',
    drive: '~15–30 min from Zadar',
    tag: 'Romantic · Peaceful',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1600&q=85',
    intro: 'Slow down and reconnect with nature on a peaceful horseback ride through coastal trails, open fields, and pine forests—with the Adriatic shimmering in the distance.',
    highlights: [
      'Guided rides through scenic coastal and countryside paths',
      'Suitable for beginners and experienced riders',
      'Small groups for a calm and personal experience',
      'Stunning views of nature and the sea',
      'Optional sunset rides for a magical atmosphere',
    ],
    duration: '2–3 hours',
    rec: 'Perfect for: couples, nature lovers, and relaxed explorers.',
    cta: 'Reserve My Spot',
    extLink: 'https://www.riva-rafting-centar.hr/activities/horse-riding?lang=en',
    extLabel: 'View Experience',
  },
  {
    id: 'boat',
    category: 'Unique Experiences',
    name: 'Half-Day Boat Tours & Island Hopping',
    distance: 'Zadar harbour',
    drive: 'Departs from Zadar',
    tag: 'Islands · Swimming · Sun',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
    intro: 'Set sail into the Zadar archipelago and discover hidden bays, turquoise waters, and untouched islands. In just a few hours, you\'ll experience the true beauty of the Adriatic.',
    highlights: [
      'Visit multiple islands and hidden swimming spots',
      'Crystal-clear water perfect for swimming and snorkeling',
      'Relaxed pace — ideal for half-day exploration',
      'Local guides and authentic experience',
      'Perfect balance of adventure and relaxation',
    ],
    duration: 'Best seller',
    rec: 'Perfect for: cruise visitors, families, and first-time explorers.',
    cta: 'Reserve Your Spot',
    extLink: 'https://zadarboat.tours/group-ugljan-half/?gad_source=1&gad_campaignid=23646025873&gbraid=0AAAAA9Uxps6PnzD1kukpNVUgOO9jk6QgB&gclid=CjwKCAjw-J3OBhBuEiwAwqZ_h4Yzsg-UKn8g7RQfFV1C_0fdIeGKdIJqs_KwYol965hTuOahUsUnpRoCvn0QAvD_BwE',
    extLabel: 'Explore More',
  },

  // ── FOOD & CULTURE ──
  {
    id: 'wine',
    category: 'Food & Culture',
    name: 'Dalmatian Wine Tasting',
    distance: 'Zadar region vineyards',
    drive: '~30–60 min from Zadar',
    tag: 'Wine · Culture · Relaxing',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=85',
    intro: 'Discover the rich flavors of Dalmatia through its wines. Visit a local winery, meet passionate producers, and taste authentic varieties shaped by sun, stone, and sea.',
    highlights: [
      'Taste unique Croatian wines like Plavac Mali and Maraština',
      'Visit boutique wineries with local character',
      'Learn about centuries-old winemaking traditions',
      'Enjoy vineyard views overlooking the Adriatic',
      'Take home exclusive bottles as souvenirs',
    ],
    duration: 'Half day',
    rec: 'Perfect for: wine lovers, couples, and cultural explorers.',
    cta: 'Book This Experience',
    extLink: 'https://degarra.com/vinery-visit-info/',
    extLabel: 'Explore More',
  },
  {
    id: 'oliveoil',
    category: 'Food & Culture',
    name: 'Olive Oil Tasting — Traditional Farms',
    distance: 'Zadar hinterland',
    drive: '~20–40 min from Zadar',
    tag: 'Authentic · Cultural',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1600&q=85',
    intro: 'Experience the true taste of Dalmatia through its finest olive oils. Walk among ancient groves and taste freshly pressed oil straight from the source.',
    highlights: [
      'Visit traditional family-run olive farms',
      'Taste premium extra virgin olive oils',
      'Learn how olive oil is produced and evaluated',
      'Walk through centuries-old olive groves',
      'Authentic, local, and non-touristy experience',
    ],
    duration: '2–3 hours',
    rec: 'Perfect for: foodies, culture lovers, and authentic travel seekers.',
    cta: 'Book This Experience',
    extLink: 'https://www.opgdusevic.hr/',
    extLabel: 'Explore More',
  },
  {
    id: 'food',
    category: 'Food & Culture',
    name: 'Dalmatian Food Experience',
    distance: 'Zadar & surroundings',
    drive: 'In or near Zadar',
    tag: 'Seafood · Tradition · Flavour',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85',
    intro: 'Dalmatian cuisine is a love letter written in olive oil, fresh fish, and slow-cooked meat. Join a local food tour and eat your way through dishes that have barely changed in 500 years.',
    highlights: [
      'Fresh grilled fish and seafood from the morning catch',
      'Peka — slow-cooked lamb or octopus under the bell',
      'Pašticada — Zadar\'s iconic slow-braised beef stew',
      'Local cheese, prosciutto, and handpicked figs',
      'Finish with rozata — Croatia\'s answer to crème brûlée',
    ],
    duration: 'Best seller',
    rec: 'Perfect for: food lovers, curious travellers, cultural immersion seekers.',
    cta: 'Book This Experience',
    extLink: null,
  },

  // ── SCENIC & RELAXATION ──
  {
    id: 'viewpoints',
    category: 'Scenic & Relaxation',
    name: 'Velebit & Coastal Viewpoints',
    distance: 'Varying — 30–90 min from Zadar',
    drive: 'Scenic mountain drive',
    tag: 'Views · Photography · Nature',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
    intro: 'Escape to the mountains and witness some of the most breathtaking views in Croatia. High above the coast, Velebit reveals a dramatic panorama of islands, sea, and untouched wilderness.',
    highlights: [
      'Panoramic views over the Adriatic and Zadar islands',
      'Off-road journey through rugged mountain landscapes',
      'Hidden viewpoints few tourists ever reach',
      'Perfect for photography and nature lovers',
      'Fresh air, silence, and raw natural beauty',
    ],
    duration: 'Half day',
    rec: 'Perfect for: photographers, explorers, and nature enthusiasts.',
    cta: 'Plan Your Day Trip',
    extLink: 'https://www.manawa.com/en-GB/activity/croatia/zadar/4x4-jeep-tours/jeep-tour-in-the-velebit-mountains-near-zadar/23298',
    extLabel: 'View Experience',
  },
  {
    id: 'sunset',
    category: 'Scenic & Relaxation',
    name: 'Zadar Sunset — Sea Organ & Golden Hour',
    distance: 'Zadar old town',
    drive: 'In Zadar',
    tag: 'Romantic · Iconic · Unmissable',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=85',
    intro: 'Alfred Hitchcock called it the most beautiful sunset in the world. Standing at the Sea Organ as the sun melts into the Adriatic, music rising from the steps, islands silhouetted in gold — this is a moment that never leaves you.',
    highlights: [
      'Sea Organ — waves playing music through stone steps',
      'Greeting to the Sun — the solar-powered light installation',
      'Unobstructed view over open sea towards the islands',
      'Golden hour reflections unlike anything else in Croatia',
      'Arrive early to find the perfect spot on the promenade',
    ],
    duration: 'Best seller',
    rec: 'Perfect for: couples, first-time visitors, anyone who loves beauty.',
    cta: 'Plan Your Day Trip',
    extLink: null,
  },
]

const activityRatings = {
  'nin':        { stars: 4.9, count: 142 },
  'pag':        { stars: 4.8, count: 98  },
  'bungee':     { stars: 4.9, count: 67  },
  'skydiving':  { stars: 5.0, count: 53  },
  'quad':       { stars: 4.7, count: 81  },
  'jetski':     { stars: 4.8, count: 119 },
  'horseback':  { stars: 4.8, count: 44  },
  'boat':       { stars: 4.9, count: 203 },
  'wine':       { stars: 4.8, count: 77  },
  'oliveoil':   { stars: 4.9, count: 38  },
  'food':       { stars: 4.9, count: 156 },
  'viewpoints': { stars: 4.7, count: 61  },
  'sunset':     { stars: 5.0, count: 284 },
}

const categories = ['Nature & History', 'Adrenaline & Adventure', 'Unique Experiences', 'Food & Culture', 'Scenic & Relaxation']

const categoryIcons = {
  'Nature & History':       Mountain,
  'Adrenaline & Adventure': Zap,
  'Unique Experiences':     Anchor,
  'Food & Culture':         Utensils,
  'Scenic & Relaxation':    Eye,
}

const infoBar = [
  { icon: Clock,  text: 'Most trips under 1 hour from Zadar' },
  { icon: Car,    text: 'Private transfers available' },
  { icon: Star,   text: 'Popular with cruise visitors' },
  { icon: Waves,  text: 'Book early during peak season' },
]

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function DayTrips() {
  const [scrollY, setScrollY]           = useState(0)
  const [openFaq, setOpenFaq]           = useState(null)
  const [expandedCards, setExpandedCards] = useState(new Set())
  const heroRef                         = useRef(null)

  const toggleCard = id => setExpandedCards(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  // Parallax + scroll tracking
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fade-in on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('dt-visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.dt-fade').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="dt-page">
      <Head>
        <title>Best Day Trips from Zadar — Cruise Visitors & Tourists | QuickRide</title>
        <meta name="description" content="Explore the best day trips from Zadar — Nin, Pag, bungee jumping, skydiving, boat tours, wine tasting and more. Perfect for cruise visitors with limited time. Private transfers available." />
        <meta property="og:title" content="Best Day Trips from Zadar — Experiences for Every Traveller" />
        <meta property="og:description" content="From ancient history to adrenaline adventures — discover the best day trips from Zadar with private transfers and local expertise." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <style>{`
          .dt-midcta {
            background: linear-gradient(135deg, var(--dt-navy) 0%, #1a4f7a 100%);
            padding: 2.5rem 0;
          }
          .dt-midcta-inner {
            max-width: 80rem;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1.5rem;
            flex-wrap: wrap;
          }
          .dt-midcta-text p { margin: 0; }
          .dt-midcta-text p:first-child {
            font-size: 1.05rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 0.2rem;
          }
          .dt-midcta-text p:last-child {
            font-size: 0.82rem;
            color: rgba(255,255,255,0.6);
          }
          .dt-midcta-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--dt-orange);
            color: #fff;
            font-size: 0.9rem;
            font-weight: 600;
            padding: 0.75rem 1.75rem;
            border-radius: 999px;
            text-decoration: none;
            white-space: nowrap;
            box-shadow: 0 4px 16px rgba(230, 126, 34, 0.42);
            transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
            flex-shrink: 0;
          }
          .dt-midcta-btn:hover {
            background: var(--dt-orange-light);
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(230, 126, 34, 0.55);
          }
          @media (max-width: 640px) {
            .dt-midcta-inner { flex-direction: column; align-items: flex-start; }
            .dt-midcta-btn { width: 100%; justify-content: center; }
          }

          /* ── Cruise Visitor Banner ── */
          .dt-cruise-banner {
            background: linear-gradient(135deg, #0f4c81 0%, #1a6fad 100%);
            padding: 1.25rem 0;
          }
          .dt-cruise-inner {
            max-width: 80rem;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1.5rem;
            flex-wrap: wrap;
          }
          .dt-cruise-text {
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
          }
          .dt-cruise-eyebrow {
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.6);
          }
          .dt-cruise-title {
            font-size: 1rem;
            font-weight: 700;
            color: #fff;
          }
          .dt-cruise-sub {
            font-size: 0.82rem;
            color: rgba(255,255,255,0.7);
            margin: 0;
          }
          .dt-cruise-cta {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            background: #fff;
            color: #0f4c81;
            font-size: 0.85rem;
            font-weight: 700;
            padding: 0.6rem 1.4rem;
            border-radius: 999px;
            text-decoration: none;
            white-space: nowrap;
            flex-shrink: 0;
            transition: background 0.2s, transform 0.15s;
          }
          .dt-cruise-cta:hover {
            background: #e0f0ff;
            transform: translateY(-1px);
          }
          @media (max-width: 640px) {
            .dt-cruise-inner { flex-direction: column; align-items: flex-start; }
            .dt-cruise-cta { width: 100%; justify-content: center; }
          }

          /* ── Duration Badge on Card Image ── */
          .dt-card-duration-badge {
            position: absolute;
            top: 0.6rem;
            right: 0.6rem;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            color: #fff;
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.02em;
            padding: 0.22rem 0.55rem;
            border-radius: 999px;
            display: flex;
            align-items: center;
            gap: 3px;
            line-height: 1;
          }
          .dt-card-duration-badge--hot {
            background: var(--dt-orange);
            box-shadow: 0 2px 8px rgba(230,126,34,0.45);
          }
        `}</style>
      </Head>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="dt-hero" ref={heroRef} id="top">
        <div
          className="dt-hero-parallax"
          style={{ transform: `translateY(${scrollY * 0.35}px)` }}
        >
          <img
            className="dt-hero-img"
            src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1920&q=85"
            alt="Zadar coastline and islands"
          />
        </div>
        <div className="dt-hero-overlay" />
        <div className="dt-hero-content">
          <span className="dt-hero-badge">Zadar · Day Trips · Private Transfers</span>
          <h1 className="dt-hero-title">
            Best Day Trips<br />
            <em>from Zadar</em>
          </h1>
          <p className="dt-hero-sub">
            Explore more in just a few hours — perfect for cruise visitors
          </p>
          <div className="dt-hero-ctas">
            <button className="dt-hero-cta dt-hero-cta--main" onClick={() => scrollTo('activities')}>
              Explore Experiences <ArrowRight size={20} />
            </button>
            <Link to="/booking" className="dt-hero-cta dt-hero-cta--outline">
              Book Your Ride
            </Link>
          </div>
          <p className="dt-hero-trust">
            <Check size={14} /> Trusted by travelers visiting Zadar
          </p>
        </div>
        <div className="dt-hero-scroll-hint">
          <span>Scroll to explore</span>
          <div className="dt-scroll-line" />
        </div>
      </section>

      {/* ── QUICK INFO BAR ──────────────────────────────────────────────── */}
      <div className="dt-infobar">
        <div className="dt-infobar-inner">
          {infoBar.map(({ icon: Icon, text }, i) => (
            <div key={i} className="dt-infobar-item">
              <Icon size={16} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CRUISE VISITORS BANNER ──────────────────────────────────────── */}
      <div className="dt-cruise-banner">
        <div className="dt-cruise-inner">
          <div className="dt-cruise-text">
            <span className="dt-cruise-eyebrow">Cruise ship in port?</span>
            <strong className="dt-cruise-title">Perfect for Cruise Visitors</strong>
            <p className="dt-cruise-sub">Short, flexible experiences designed to fit your schedule — back at the port on time, every time.</p>
          </div>
          <Link to="/booking" className="dt-cruise-cta">
            Book Your Ride <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* ── SECTION NAV ─────────────────────────────────────────────────── */}
      <nav className="dt-section-nav">
        <div className="dt-section-nav-inner">
          {[
            { id: 'nature',      label: 'Nature & History' },
            { id: 'adventure',   label: 'Adventure' },
            { id: 'experiences', label: 'Experiences' },
            { id: 'food',        label: 'Food & Culture' },
            { id: 'scenic',      label: 'Scenic' },
          ].map(({ id, label }) => (
            <button key={id} className="dt-snav-link" onClick={() => scrollTo(id)}>
              {label}
            </button>
          ))}
          <Link to="/booking" className="dt-snav-cta">
            Reserve Your Spot
          </Link>
        </div>
      </nav>

      {/* ── INTRO ───────────────────────────────────────────────────────── */}
      <section className="dt-intro" id="activities">
        <div className="dt-container">
          <div className="dt-section-header dt-fade">
            <span className="dt-label">13 Experiences</span>
            <h2 className="dt-section-title">Make the Most of Your Time</h2>
            <p className="dt-section-sub">
              Whether you have a few hours from your cruise ship or a full day to explore — Zadar is
              the perfect base. History, adventure, food, nature — it's all within reach.
            </p>
          </div>
          <div className="dt-category-pills dt-fade">
            {categories.map(cat => {
              const Icon = categoryIcons[cat]
              return (
                <button
                  key={cat}
                  className="dt-category-pill"
                  onClick={() => scrollTo(cat.toLowerCase().split(' ')[0])}
                >
                  <Icon size={15} />
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── ACTIVITY SECTIONS ────────────────────────────────────────────── */}
      {categories.flatMap((cat, catIndex) => {
        const catActivities = activities.filter(a => a.category === cat)
        const CatIcon = categoryIcons[cat]
        const catId = cat.toLowerCase().split(' ')[0] === 'nature' ? 'nature'
          : cat.toLowerCase().split(' ')[0] === 'adrenaline' ? 'adventure'
          : cat.toLowerCase().split(' ')[0] === 'unique' ? 'experiences'
          : cat.toLowerCase().split(' ')[0] === 'food' ? 'food'
          : 'scenic'

        const section = (
          <section key={cat} className="dt-category-section" id={catId}>
            {/* Category header */}
            <div className="dt-container">
              <div className="dt-category-header dt-fade">
                <div>
                  <span className="dt-label">{cat}</span>
                  <h2 className="dt-category-title">
                    {cat === 'Nature & History'       && 'Ancient Towns & Untouched Landscapes'}
                    {cat === 'Adrenaline & Adventure' && 'Push Your Limits'}
                    {cat === 'Unique Experiences'     && 'Something You\'ll Never Forget'}
                    {cat === 'Food & Culture'         && 'Taste the Real Dalmatia'}
                    {cat === 'Scenic & Relaxation'    && 'Views That Stay With You Forever'}
                  </h2>
                </div>
              </div>
            </div>

            {/* Activity cards — 3-col grid */}
            <div className="dt-cards-grid">
              {catActivities.map((act, i) => {
                const rating  = activityRatings[act.id]
                const expanded = expandedCards.has(act.id)
                const extraCount = act.highlights.length - 3
                return (
                  <article
                    key={act.id}
                    className="dt-card dt-fade"
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    {/* ── Image ── */}
                    <div
                      className="dt-card-img"
                      style={{ backgroundImage: `url(${act.image})` }}
                    >
                      <div className="dt-card-img-overlay" />
                      {act.duration && (
                        <span className={`dt-card-duration-badge${act.duration === 'Best seller' ? ' dt-card-duration-badge--hot' : ''}`}>
                          {act.duration !== 'Best seller' && <Clock size={10} />}
                          {act.duration}
                        </span>
                      )}
                      <div className="dt-card-img-badges">
                        <span className="dt-card-badge-tag">{act.tag}</span>
                        <span className="dt-card-badge-dist">
                          <MapPin size={11} />{act.distance}
                        </span>
                      </div>
                    </div>

                    {/* ── Body ── */}
                    <div className="dt-card-body">
                      {/* Category + rating */}
                      <div className="dt-card-top-row">
                        <span className="dt-card-cat">{act.category}</span>
                        {rating && (
                          <div className="dt-card-rating">
                            <Star size={11} className="dt-star" fill="currentColor" />
                            <span className="dt-rating-val">{rating.stars}</span>
                            <span className="dt-rating-ct">({rating.count})</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="dt-card-title">{act.name}</h3>

                      {/* Quick meta */}
                      <div className="dt-card-meta">
                        <span><Clock size={12} />{act.drive}</span>
                        <span><Car size={12} />Private transfer</span>
                      </div>

                      {/* Short description */}
                      <p className="dt-card-desc">{act.intro}</p>

                      {/* Highlights — first 3 always visible */}
                      <ul className="dt-card-hl">
                        {act.highlights.slice(0, 3).map((h, j) => (
                          <li key={j}><Check size={12} />{h}</li>
                        ))}
                        {expanded && act.highlights.slice(3).map((h, j) => (
                          <li key={`x${j}`}><Check size={12} />{h}</li>
                        ))}
                      </ul>
                      {extraCount > 0 && (
                        <button
                          className="dt-card-expand"
                          onClick={() => toggleCard(act.id)}
                        >
                          {expanded
                            ? <><ChevronUp size={12} />Show less</>
                            : <><ChevronDown size={12} />+{extraCount} more</>}
                        </button>
                      )}

                      {/* Pushes CTAs to bottom */}
                      <div className="dt-card-spacer" />

                      {/* Perfect for */}
                      <p className="dt-card-rec">{act.rec}</p>

                      {/* CTAs */}
                      <div className="dt-card-actions">
                        <Link
                          to={`/booking?trip=${encodeURIComponent(act.name)}`}
                          className="dt-card-btn"
                        >
                          {act.cta} <ArrowRight size={14} />
                        </Link>
                        {act.extLink ? (
                          <a
                            href={act.extLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dt-card-ext"
                          >
                            {act.extLabel} <ExternalLink size={11} />
                          </a>
                        ) : (
                          <Link
                            to={`/booking?trip=${encodeURIComponent(act.name)}`}
                            className="dt-card-ext"
                          >
                            Book Transfer <Car size={11} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )

        if (catIndex === 4) {
          return [section, (
            <div key="dt-midcta" className="dt-midcta">
              <div className="dt-midcta-inner">
                <div className="dt-midcta-text">
                  <p>Ready to book your adventure?</p>
                  <p>Fixed prices · Local drivers · Flexible timing for cruise schedules</p>
                </div>
                <Link to="/booking" className="dt-midcta-btn">
                  Check Availability <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )]
        }
        return [section]
      })}

      {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
      <section className="dt-trust-section">
        <div className="dt-container">
          <div className="dt-trust-grid dt-fade">
            {[
              { icon: Car,   title: 'Local Drivers',         desc: 'Born and raised in Zadar — they know every corner.' },
              { icon: Clock, title: 'On-Time Pickup',        desc: 'We\'re always there when we say we\'ll be there.' },
              { icon: Check, title: 'No Hidden Costs',       desc: 'The price you see is the price you pay.' },
              { icon: Star,  title: 'Cruise-Friendly Times', desc: 'Flexible timing to fit your port schedule.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="dt-trust-card">
                <div className="dt-trust-icon"><Icon size={22} /></div>
                <h3 className="dt-trust-title">{title}</h3>
                <p className="dt-trust-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOMO QUOTE ────────────────────────────────────────────────────── */}
      <section className="dt-mood">
        <div
          className="dt-mood-bg"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=85)`,
            transform: `translateY(${(scrollY - 3000) * 0.12}px)`,
          }}
        />
        <div className="dt-mood-overlay" />
        <div className="dt-mood-content dt-fade">
          <div className="dt-mood-quote-mark">"</div>
          <blockquote className="dt-mood-quote">
            Limited time in port?<br />Make it the best day of your trip.
          </blockquote>
          <p className="dt-mood-sub">Popular with cruise visitors — book early during peak season.</p>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="dt-finale" id="book">
        <div
          className="dt-finale-bg"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85)`,
          }}
        />
        <div className="dt-finale-overlay" />
        <div className="dt-container dt-finale-content dt-fade">
          <span className="dt-label dt-label--light">Ready to Explore?</span>
          <h2 className="dt-finale-title">Make the Most of Your Time in Zadar</h2>
          <p className="dt-finale-sub">
            Don't leave Zadar without seeing what's beyond the harbour. Our local drivers
            will get you there — comfortably, on time, every time.
          </p>
          <div className="dt-finale-actions">
            <Link to="/booking" className="dt-finale-btn dt-finale-btn--main">
              Book Your Ride <ArrowRight size={20} />
            </Link>
            <Link to="/booking" className="dt-finale-btn dt-finale-btn--outline">
              Check Availability
            </Link>
          </div>
          <div className="dt-finale-trust">
            <span><Check size={14} /> Local drivers</span>
            <span><Check size={14} /> On-time pickup</span>
            <span><Check size={14} /> Private transfers</span>
            <span><Check size={14} /> Flexible timing</span>
          </div>
        </div>
      </section>
    </div>
  )
}
