import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import {
  MapPin, Calendar, ExternalLink, Car, Music,
  Clock, Shield, Users, Star, ChevronDown, ChevronUp,
  ArrowRight, Check, Zap, Award,
} from 'lucide-react'

// ─── EXISTING DATA (unchanged) ───────────────────────────────────────────────

const genreClass = {
  'EDM':              'fv-tag-blue',
  'Techno / House':   'fv-tag-indigo',
  'Techno':           'fv-tag-indigo',
  'House / Dance':    'fv-tag-violet',
  'House / Disco':    'fv-tag-violet',
  'House':            'fv-tag-violet',
  'Hard Dance':       'fv-tag-pink',
  'Hard Techno':      'fv-tag-pink',
  'Drum & Bass':      'fv-tag-sky',
  'Bass / Dub / D&B': 'fv-tag-sky',
  'Electronic':       'fv-tag-teal',
  'Hip-Hop / R&B':    'fv-tag-orange',
  'Reggae / Dub':     'fv-tag-green',
  'Psytrance':        'fv-tag-purple',
  'Cultural':         'fv-tag-emerald',
  'Opera / Theatre':  'fv-tag-emerald',
  'Various':          'fv-tag-gray',
}

const transferInfo = {
  zrce:      { from: 'Zadar Airport', time: '~1h 15min' },
  tisno:     { from: 'Zadar Airport', time: '~45 min' },
  split:     { from: 'Split Airport', time: '~20 min' },
  dubrovnik: { from: 'Dubrovnik Airport', time: '~25 min' },
  ugljan:    { from: 'Zadar + ferry', time: '~30 min' },
  rab:       { from: 'Zadar Airport', time: '~1h 30min' },
  inland:    { from: 'Zadar Airport', time: '~1h 30min' },
  petrcane:  { from: 'Zadar Airport', time: '~15 min' },
}

const festivals = [
  // ── JUNE ──
  {
    month: 'june',
    emoji: '🌿',
    name: 'Flows Festival',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
    location: 'Ugljan Island',
    address: 'Ugljan, Croatia',
    dates: '10–14 Jun',
    genre: 'Electronic',
    venue: 'ugljan',
    description: 'An intimate open-air festival on Ugljan Island, just a short ferry ride from Zadar. Flows blends electronic music with a laid-back island atmosphere — perfect for those who want festival vibes without the mega-crowd.',
    website: 'https://flowsfestival.com',
  },
  {
    month: 'june',
    emoji: '🏝️',
    name: 'Hideout Festival',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    location: 'Zrće Beach, Pag Island',
    address: 'Zrće, Novalja, Croatia',
    dates: '30 Jun – 3 Jul',
    genre: 'House / Dance',
    venue: 'zrce',
    description: "Hideout is the UK's favourite export to Croatia. Five days of non-stop house and dance music across Zrće Beach's iconic open-air clubs — Aquarius, Papaya, and Kalypso. One of the most beloved Croatia festival institutions.",
    website: 'https://hideoutfestival.com',
  },
  // ── JULY ──
  {
    month: 'july',
    emoji: '🏥',
    name: 'Hospitality on the Beach',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    location: 'Tisno (The Garden)',
    address: 'The Garden Resort Tisno, Stjepana Radića, Tisno, Croatia',
    dates: '1–6 Jul',
    genre: 'Drum & Bass',
    venue: 'tisno',
    description: "Hospital Records' legendary drum & bass beach festival returns to The Garden in Tisno. A must for D&B fans — open-air stages, waterfront sunsets, and the finest liquid and neuro D&B from the world's top labels.",
    website: 'https://tickets.hospitalityonthebeach.com/',
  },
  {
    month: 'july',
    emoji: '💥',
    name: 'Dropzone Festival',
    image: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=800&q=80',
    location: 'Zrće Beach, Pag Island',
    address: 'Zrće, Novalja, Croatia',
    dates: '4–9 Jul',
    genre: 'Hard Dance',
    venue: 'zrce',
    description: "Dropzone brings the hardest sounds in dance music to the sunniest beach in Europe. Hard dance, hard trance, and hardcore blasted across Zrće's beach clubs for six days and nights.",
    website: 'https://dropzonefest.com/',
  },
  {
    month: 'july',
    emoji: '🪩',
    name: 'Love International',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80',
    location: 'Tisno (The Garden)',
    address: 'The Garden Resort Tisno, Stjepana Radića, Tisno, Croatia',
    dates: '8–14 Jul',
    genre: 'House / Disco',
    venue: 'tisno',
    description: "A boutique 7-day festival at The Garden, Tisno. Love International is curated around the finest house, disco, and leftfield electronic music with a handpicked lineup that consistently delivers surprise and quality over spectacle.",
    website: 'https://loveinternationalfestival.com',
  },
  {
    month: 'july',
    emoji: '🍊',
    name: 'Fresh Island Festival',
    image: '/images/festivals/fresh-island.jpg',
    location: 'Zrće Beach, Pag Island',
    address: 'Zrće, Novalja, Croatia',
    dates: '9–12 Jul',
    genre: 'Hip-Hop / R&B',
    venue: 'zrce',
    description: "Europe's biggest hip-hop beach festival. A$AP Rocky, 50 Cent, Waka Flocka, and Skepta have all graced the stage. Fresh Island delivers US and UK rap, R&B, and grime on the Adriatic — a one-of-a-kind experience.",
    website: 'https://fresh-island.org/programme/',
  },
  {
    month: 'july',
    emoji: '🎧',
    name: 'Ultra Europe',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
    location: 'Split (Poljud Stadium)',
    address: 'Poljud Stadium, Split, Croatia',
    dates: '10–12 Jul',
    genre: 'EDM',
    venue: 'split',
    description: "One of the world's biggest EDM festivals. Ultra Europe descends on Split's Poljud Stadium with massive headliners — David Guetta, Martin Garrix, Tiësto — and follows up with a 3-day Resistance Regata boat party on the Adriatic.",
    website: 'https://ultraeurope.com',
  },
  {
    month: 'july',
    emoji: '⚙️',
    name: 'Verknipt Croatia',
    image: '/images/festivals/verknip-croatia.jpg',
    location: 'Zrće Beach, Pag Island',
    address: 'Zrće, Novalja, Croatia',
    dates: '12–16 Jul',
    genre: 'Hard Techno',
    venue: 'zrce',
    description: "The Dutch hard techno brand Verknipt brings their pounding sound to Zrće Beach. If you're into fast, industrial, and relentless techno, this is your festival — set against one of the most beautiful coastlines in Europe.",
    website: 'https://verkniptcroatia.org/',
  },
  {
    month: 'july',
    emoji: '🔊',
    name: 'Terminal V Croatia',
    image: '/images/festivals/terminal-v-croatia.jpg',
    location: 'Tisno (The Garden)',
    address: 'The Garden Resort Tisno, Stjepana Radića, Tisno, Croatia',
    dates: '16–20 Jul',
    genre: 'Techno',
    venue: 'tisno',
    description: "Edinburgh's Terminal V brings their acclaimed techno festival to The Garden in Tisno. Expect a meticulously curated dark and deep techno lineup in one of Croatia's most beautiful festival settings.",
    website: 'https://terminalv.co.uk/croatia/',
  },
  {
    month: 'july',
    emoji: '🎸',
    name: 'Seasplash Festival',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
    location: 'Split — Trstenik Beach',
    address: 'Trstenik Beach, Split, Croatia',
    dates: '17–20 Jul',
    genre: 'Reggae / Dub',
    venue: 'split',
    description: "Croatia's longest-running reggae and dub festival, now in its third decade. Seasplash brings artists from Jamaica, the UK, and Europe to an open-air beach in Split for conscious vibes and serious sound system culture.",
    website: 'https://seasplash.eu',
  },
  {
    month: 'july',
    emoji: '🇦🇹',
    name: 'Austria Goes Zrće',
    image: '/images/festivals/austria-goes-zrce.jpg',
    location: 'Zrće Beach, Pag Island',
    address: 'Zrće, Novalja, Croatia',
    dates: '18–25 Jul',
    genre: 'Various',
    venue: 'zrce',
    description: "Austria Goes Zrće is an annual gathering that draws thousands of Austrian festival-goers to the legendary Zrće Beach. A week of sun, sea, and music across all genres — a massive summer celebration on the Adriatic.",
    website: 'https://austriagoeszrce.com',
  },
  {
    month: 'july',
    emoji: '🌀',
    name: 'Outlook Origins',
    image: '/images/festivals/outlook-origins.jpg',
    location: 'Tisno (The Garden)',
    address: 'The Garden Resort Tisno, Stjepana Radića, Tisno, Croatia',
    dates: '23–27 Jul',
    genre: 'Bass / Dub / D&B',
    venue: 'tisno',
    description: "The boutique offshoot of the legendary Outlook Festival, focused on the roots of bass culture — dub, reggae, jungle, and drum & bass. Intimate, expertly curated, and set on the waterfront at The Garden in Tisno.",
    website: 'https://www.outlookorigins.com/',
  },
  {
    month: 'july',
    emoji: '💚',
    name: 'Defected Croatia',
    image: 'https://images.unsplash.com/photo-1656401747905-a7fde47b3237?w=800&auto=format&fit=crop&q=60',
    location: 'Tisno (The Garden)',
    address: 'The Garden Resort Tisno, Stjepana Radića, Tisno, Croatia',
    dates: '29 Jul – 2 Aug',
    genre: 'House',
    venue: 'tisno',
    description: "The world's most iconic house music label brings its flagship Croatia event to The Garden, Tisno. Defected Croatia is a 5-day house music paradise — sunrise sets, waterfront stages, and the definitive house music experience in Europe.",
    website: 'https://defected.com/croatia',
  },
  // ── AUGUST ──
  {
    month: 'august',
    emoji: '🎵',
    name: 'Sea Sound Festival',
    image: '/images/festivals/sea-sound.jpg',
    location: 'Petrcane, near Zadar',
    address: 'Petrcane, Zadar County, Croatia',
    dates: 'Aug',
    genre: 'Electronic',
    venue: 'petrcane',
    description: "Sea Sound Festival brings an intimate electronic music experience to the stunning beach at Petrcane, just north of Zadar. A curated lineup of house, techno, and leftfield sounds against the crystal-clear Adriatic — a hidden gem of the Croatian festival calendar.",
    website: 'https://www.seasoundfestival.com/en/home/',
  },
  {
    month: 'august',
    emoji: '🇩🇪',
    name: 'Germany Goes Zrće',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80',
    location: 'Zrće Beach, Pag Island',
    address: 'Zrće, Novalja, Croatia',
    dates: '1–8 Aug',
    genre: 'Various',
    venue: 'zrce',
    description: "Germany Goes Zrće is one of the longest-running national gatherings on Pag Island, drawing a huge German-speaking crowd for a full week of music, sun, and sea across all the Zrće beach clubs.",
    website: 'https://germanygoeszrce.de',
  },
  {
    month: 'august',
    emoji: '🌌',
    name: 'Mo:Dem Festival',
    image: '/images/festivals/mo-dem.jpg',
    location: 'Primišlje (inland Croatia)',
    address: 'Donje Primišlje, Karlovac County, Croatia',
    dates: '3–9 Aug',
    genre: 'Psytrance',
    venue: 'inland',
    description: "Mo:Dem is a transformative psychedelic trance festival deep in the Croatian countryside. Set in a forest near Primišlje, it's a full immersive experience — art installations, multiple stages, and a community-driven atmosphere unlike any beach festival.",
    website: 'https://modemfestival.com',
  },
  {
    month: 'august',
    emoji: '⚖️',
    name: 'Balance Croatia',
    image: '/images/festivals/balance-croatia.jpg',
    location: 'Tisno (The Garden)',
    address: 'The Garden Resort Tisno, Stjepana Radića, Tisno, Croatia',
    dates: '6–10 Aug',
    genre: 'Electronic',
    venue: 'tisno',
    description: "Balance Croatia brings the acclaimed Balance Music brand to The Garden in Tisno. Deep, melodic, and progressive electronic music in a stunning waterfront setting — a favourite among fans of quality underground sounds.",
    website: 'https://balancemusic.com.au/?v=7885444af42e',
  },
  {
    month: 'august',
    emoji: '🔩',
    name: 'Barrakud Festival',
    image: '/images/festivals/barrakud.jpg',
    location: 'Zrće Beach, Pag Island',
    address: 'Zrće, Novalja, Croatia',
    dates: '9–13 Aug',
    genre: 'Techno',
    venue: 'zrce',
    description: "Barrakud is a raw and energetic techno festival on Zrće Beach. Five days of underground techno from Europe's finest selectors, set against the sun-bleached limestone of Pag Island — industrial beats meets Adriatic sunsets.",
    website: 'https://barrakud.com',
  },
  {
    month: 'august',
    emoji: '🌊',
    name: 'Sonus Festival',
    image: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=800&q=80',
    location: 'Zrće Beach, Pag Island',
    address: 'Zrće, Novalja, Croatia',
    dates: '16–20 Aug',
    genre: 'Techno / House',
    venue: 'zrce',
    description: "Croatia's premier techno and house festival. Open-air stages right on the Adriatic, a non-stop 5-day party, and a lineup that consistently features the biggest names — Adam Beyer, Nina Kraviz, Amelie Lens. A bucket-list festival.",
    website: 'https://www.sonuscroatia.com/',
  },
  {
    month: 'august',
    emoji: '🌀',
    name: 'Dekmantel Selectors',
    image: '/images/festivals/dekmantel-selectors.jpg',
    location: 'Tisno (The Garden)',
    address: 'The Garden Resort Tisno, Stjepana Radića, Tisno, Croatia',
    dates: '20–24 Aug',
    genre: 'Electronic',
    venue: 'tisno',
    description: "Amsterdam's legendary Dekmantel takes over The Garden in Tisno for its Croatian edition. Expect the same depth and quality that has made Dekmantel one of the world's most respected electronic music brands — intimate, curated, unforgettable.",
    website: 'https://dekmantelfestival.com/',
  },
  {
    month: 'august',
    emoji: '🏔️',
    name: 'Summer Peak',
    image: '/images/festivals/summer-peak.jpg',
    location: 'Zrće Beach, Pag Island',
    address: 'Zrće, Novalja, Croatia',
    dates: '22–27 Aug',
    genre: 'Various',
    venue: 'zrce',
    description: "Summer Peak closes out the Zrće season with a bang — six days of mixed genres, big names, and the last great Adriatic party before summer ends. The perfect festival to cap off a Croatia summer trip.",
    website: 'https://summerpeak.eu/',
  },
  {
    month: 'august',
    emoji: '🌐',
    name: 'Dimensions Festival',
    image: '/images/festivals/dimensions.jpg',
    location: 'Tisno (The Garden)',
    address: 'The Garden Resort Tisno, Stjepana Radića, Tisno, Croatia',
    dates: '28 Aug – 1 Sep',
    genre: 'Electronic',
    venue: 'tisno',
    description: "Dimensions is one of Europe's most critically acclaimed underground electronic festivals. Five days at The Garden, Tisno — spanning techno, house, experimental, jazz, and bass — with 150+ artists. The perfect close to the Adriatic festival season.",
    website: 'https://dimensionsfestival.com',
  },
]

const MONTH_ORDER = ['june', 'july', 'august']
const MONTH_LABELS = { june: 'June', july: 'July', august: 'August / September' }
const MONTH_EMOJIS = { june: '🌤️', july: '🔥', august: '🌊' }

// ─── NEW DATA ─────────────────────────────────────────────────────────────────

const packages = [
  {
    tier: 'Shared Transfer',
    price: '€15',
    desc: 'Best value',
    popular: false,
    features: [
      'Shared minivan from airport',
      'Festival drop-off & return',
      'Luggage included',
      'Fixed price — no surprises',
    ],
  },
  {
    tier: 'Private Transfer',
    price: '€45',
    desc: 'Most Popular',
    popular: true,
    features: [
      'Private car or minivan',
      'Door-to-door service',
      'Any time, any schedule',
      'Flight tracking included',
      'Free cancellation 48h',
    ],
  },
  {
    tier: 'VIP Group',
    price: '€120',
    desc: 'Groups of 6+',
    popular: false,
    features: [
      'Luxury minibus for your group',
      'Dedicated driver all weekend',
      'Multiple drop-off points',
      'Priority booking guarantee',
      'Complimentary refreshments',
    ],
  },
]

const reasons = [
  { icon: Clock,   title: 'Always On Time',    desc: 'We track your flight. We are there before you land.' },
  { icon: MapPin,  title: 'Local Drivers',      desc: 'Born in Dalmatia. We know every shortcut to every venue.' },
  { icon: Shield,  title: 'Fixed Pricing',      desc: 'Price agreed at booking. No surge, no surprises ever.' },
  { icon: Car,     title: 'Modern Vehicles',    desc: 'Air-conditioned, clean, and comfortable for every journey.' },
  { icon: Check,   title: 'Free Cancellation',  desc: 'Cancel up to 48 hours before, completely free of charge.' },
  { icon: Users,   title: 'All Group Sizes',    desc: 'Solo traveller to group of 20+. We have the right vehicle.' },
]

const testimonials = [
  {
    name: 'Jake R.',
    from: 'London',
    text: 'Booked a transfer to Sonus — driver was waiting at midnight, ice-cold water in the car. Worth every penny. Will be using QuickRide every year.',
    festival: 'Sonus Festival',
  },
  {
    name: 'Sophie M.',
    from: 'Amsterdam',
    text: 'Our group of 8 needed a minivan to Zrće and QuickRide sorted it in 20 minutes. Smooth, affordable, no stress. The driver even waited when we ran late.',
    festival: 'Defected Croatia',
  },
  {
    name: 'Carlos D.',
    from: 'Barcelona',
    text: 'Landed at Zadar Airport at 2am, my driver was there with a sign. Got to Tisno in 45 min exactly as promised. Couldn\'t have asked for better.',
    festival: 'Love International',
  },
]

const galleryPhotos = [
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=600&q=80',
]

const faqs = [
  { q: 'How do I book a festival transfer?', a: 'Hit "Book Transfer" on any festival card or any booking button on this page. Fill in your pickup details and we confirm within 2 hours with everything you need.' },
  { q: 'Can I cancel or change my booking?', a: 'Free cancellation up to 48 hours before your pickup. Changes can be made up to 24 hours in advance, subject to availability. No penalty, no stress.' },
  { q: 'Do you offer group discounts?', a: 'Yes — groups of 6 or more receive automatic discounts. For large groups (10+), contact us directly and we\'ll build a custom package for your crew.' },
  { q: 'What if my flight is delayed?', a: 'We track all incoming flights in real time. If you\'re delayed, your driver waits at no extra charge. We\'ve got you covered.' },
  { q: 'Which airports do you serve?', a: 'We operate transfers from Zadar, Split, and Dubrovnik airports to every major festival venue in Dalmatia — Zrće Beach, Tisno, Split city, and beyond.' },
]

const fomoItems = [
  { icon: Zap,    text: 'Limited availability during peak festival weeks' },
  { icon: Clock,  text: 'Most popular routes sell out early — book ahead' },
  { icon: Shield, text: 'Free cancellation on all bookings' },
]

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Festivals() {
  const [openFaq, setOpenFaq]       = useState(null)
  const [activeMonth, setActiveMonth] = useState('all')
  const [scrollY, setScrollY]       = useState(0)
  const [expandedCards, setExpandedCards] = useState(new Set())

  const toggleCard = name => setExpandedCards(prev => {
    const next = new Set(prev)
    next.has(name) ? next.delete(name) : next.add(name)
    return next
  })

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('fv-visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fv-fade').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const scrollTo = id =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const grouped = MONTH_ORDER.reduce((acc, m) => {
    const list = festivals.filter(f => f.month === m)
    if (list.length) acc[m] = list
    return acc
  }, {})

  const visibleMonths = activeMonth === 'all'
    ? MONTH_ORDER
    : [activeMonth]

  return (
    <div className="fv-page">
      <Head>
        <title>Festival Transfers in Dalmatia, Croatia 2026 — QuickRide</title>
        <meta name="description" content="22 festivals across Dalmatia — Ultra Europe, Sonus, Hideout, Defected, Dekmantel & more. Book your festival transfer from Zadar, Split or Dubrovnik airport." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <style>{`
          .fv-card-desc--unclamped {
            display: block;
            -webkit-line-clamp: unset;
            overflow: visible;
          }
          .fv-desc-wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            flex: 1;
          }
          .fv-desc-body {
            position: relative;
            width: 100%;
            max-height: 4.35em;
            overflow: hidden;
            transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                        opacity 0.35s ease;
          }
          .fv-desc-body--expanded {
            max-height: 400px;
          }
          .fv-desc-fade {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 2em;
            background: linear-gradient(to bottom, transparent, #fff);
            pointer-events: none;
            transition: opacity 0.3s ease;
          }
          .fv-desc-toggle {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            margin-top: 5px;
            padding: 2px 0;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.02em;
            color: #f97316;
            opacity: 0.85;
            transition: opacity 0.2s, color 0.2s;
            line-height: 1;
          }
          .fv-desc-toggle:hover {
            opacity: 1;
            color: #ea6c0a;
          }
          .fv-desc-cta {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            margin-top: 10px;
            padding: 5px 13px;
            background: rgba(249, 115, 22, 0.08);
            border: 1px solid rgba(249, 115, 22, 0.25);
            border-radius: 20px;
            font-size: 0.73rem;
            font-weight: 600;
            color: #f97316;
            text-decoration: none;
            transition: background 0.2s, border-color 0.2s, transform 0.15s;
            animation: fv-cta-in 0.25s ease both;
          }
          .fv-desc-cta:hover {
            background: rgba(249, 115, 22, 0.15);
            border-color: rgba(249, 115, 22, 0.45);
            transform: translateX(2px);
          }
          @keyframes fv-cta-in {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </Head>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="fv-hero" id="top">
        <div
          className="fv-hero-parallax"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <video
            className="fv-hero-video"
            autoPlay muted loop playsInline
            poster="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1920&q=85"
          >
            <source src="https://videos.pexels.com/video-files/1652366/1652366-hd_1280_720_25fps.mp4" type="video/mp4" />
            <source src="https://videos.pexels.com/video-files/1477904/1477904-hd_1280_720_25fps.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="fv-hero-overlay" />

        <div className="fv-hero-content">
          <span className="fv-hero-badge">
            <Music size={13} /> 22 Festivals · Summer 2026 · Dalmatia, Croatia
          </span>
          <h1 className="fv-hero-title">
            Your Summer of Music<br />
            <em>Starts Here</em>
          </h1>
          <p className="fv-hero-sub">
            The best festivals in Europe — and we'll get you there safely, on time, every time.
          </p>
          <button className="fv-hero-cta" onClick={() => scrollTo('festivals')}>
            Browse Festivals <ArrowRight size={20} />
          </button>

          <div className="fv-hero-trust">
            {[
              { icon: Shield, text: 'Safe & insured' },
              { icon: Clock,  text: 'Always on time' },
              { icon: MapPin, text: 'Local drivers' },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="fv-trust-badge">
                <Icon size={13} /> {text}
              </span>
            ))}
          </div>
        </div>

        <div className="fv-hero-stats">
          <div className="fv-stat"><span className="fv-stat-num">22</span><span className="fv-stat-label">Festivals</span></div>
          <div className="fv-stat-sep" />
          <div className="fv-stat"><span className="fv-stat-num">3</span><span className="fv-stat-label">Months</span></div>
          <div className="fv-stat-sep" />
          <div className="fv-stat"><span className="fv-stat-num">6</span><span className="fv-stat-label">Venues</span></div>
          <div className="fv-stat-sep" />
          <div className="fv-stat"><span className="fv-stat-num">3</span><span className="fv-stat-label">Airports</span></div>
        </div>
      </section>

      {/* ── FOMO BAR ───────────────────────────────────────────────────────── */}
      <div className="fv-fomo">
        {fomoItems.map(({ icon: Icon, text }) => (
          <div key={text} className="fv-fomo-item">
            <Icon size={15} />
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* ── STICKY SECTION NAV ─────────────────────────────────────────────── */}
      <nav className="fv-section-nav">
        <div className="fv-section-nav-inner">
          {[
            { id: 'festivals', label: 'Festivals' },
            { id: 'packages',  label: 'Packages' },
            { id: 'why-us',    label: 'Why Us' },
            { id: 'faq',       label: 'FAQ' },
          ].map(({ id, label }) => (
            <button key={id} className="fv-snav-link" onClick={() => scrollTo(id)}>
              {label}
            </button>
          ))}
          <Link to="/booking" className="fv-snav-cta">Book Now</Link>
        </div>
      </nav>

      {/* ── FESTIVAL CARDS ─────────────────────────────────────────────────── */}
      <section className="fv-festivals-section" id="festivals">
        <div className="fv-container">
          <div className="fv-section-header fv-fade">
            <span className="fv-label">Summer 2026</span>
            <h2 className="fv-section-title">22 Festivals Across Dalmatia</h2>
            <p className="fv-section-sub">From world-famous EDM on Pag Island to underground techno in Tisno — find your festival.</p>
          </div>

          {/* Month filter */}
          <div className="fv-month-filter fv-fade">
            {[
              { id: 'all', label: 'All Festivals', count: festivals.length },
              { id: 'june',   label: 'June',   count: grouped.june?.length || 0 },
              { id: 'july',   label: 'July',   count: grouped.july?.length || 0, peak: true },
              { id: 'august', label: 'August', count: grouped.august?.length || 0 },
            ].map(({ id, label, count, peak }) => (
              <button
                key={id}
                className={`fv-month-tab ${activeMonth === id ? 'fv-month-tab--active' : ''}`}
                onClick={() => setActiveMonth(id)}
              >
                {label}
                <span className="fv-month-tab-count">{count}</span>
                {peak && <span className="fv-peak-badge">Peak</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Month groups */}
        {visibleMonths.filter(m => grouped[m]).map(month => (
          <div key={month} className="fv-month-group">
            <div className="fv-container">
              <div className="fv-month-heading fv-fade">
                <h3 className="fv-month-title">{MONTH_LABELS[month]}</h3>
                {month === 'july' && (
                  <span className="fv-peak-ribbon">Peak Season</span>
                )}
                <span className="fv-month-count">{grouped[month].length} festival{grouped[month].length !== 1 ? 's' : ''}</span>
              </div>

              <div className="fv-card-grid">
                {grouped[month].map(f => {
                  const transfer = transferInfo[f.venue]
                  const tagClass = genreClass[f.genre] || 'fv-tag-gray'
                  return (
                    <article key={f.name} className="fv-card fv-fade">
                      {/* Image */}
                      <div
                        className="fv-card-img"
                        style={{ backgroundImage: `url(${f.image})` }}
                      >
                        <div className="fv-card-img-overlay" />
                        <div className="fv-card-img-top">
                          <span className={`fv-tag ${tagClass}`}>{f.genre}</span>
                        </div>
                        <div className="fv-card-img-bottom">
                          <h3 className="fv-card-name">{f.name}</h3>
                          <div className="fv-card-location">
                            <MapPin size={12} /> {f.location}
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="fv-card-body">
                        <div className="fv-card-meta">
                          <span className="fv-card-meta-item">
                            <Calendar size={12} /> {f.dates}
                          </span>
                          {transfer && (
                            <span className="fv-card-meta-item fv-card-meta-transfer">
                              <Car size={12} /> {transfer.from} · {transfer.time}
                            </span>
                          )}
                        </div>

                        {(() => {
                          const isExpanded = expandedCards.has(f.name)
                          return (
                            <div className="fv-desc-wrapper">
                              <div className={`fv-desc-body${isExpanded ? ' fv-desc-body--expanded' : ''}`}>
                                <p className="fv-card-desc fv-card-desc--unclamped">{f.description}</p>
                                {!isExpanded && <div className="fv-desc-fade" />}
                              </div>
                              <button
                                className="fv-desc-toggle"
                                onClick={() => toggleCard(f.name)}
                                aria-expanded={isExpanded}
                              >
                                {isExpanded
                                  ? <><ChevronUp size={13} /> Show less</>
                                  : <><ChevronDown size={13} /> Show more</>}
                              </button>
                              {isExpanded && (
                                <Link
                                  to={`/booking?festival=${encodeURIComponent(f.name)}&destination=${encodeURIComponent(f.address)}`}
                                  className="fv-desc-cta"
                                >
                                  Book transfer <ArrowRight size={12} />
                                </Link>
                              )}
                            </div>
                          )
                        })()}

                        <div className="fv-card-actions">
                          <a
                            href={f.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fv-card-site"
                          >
                            Official site <ExternalLink size={11} />
                          </a>
                          <Link
                            to={`/booking?festival=${encodeURIComponent(f.name)}&destination=${encodeURIComponent(f.address)}`}
                            className="fv-card-book"
                          >
                            Book Festival Ride <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── MID-PAGE CTA ───────────────────────────────────────────────────── */}
      <div className="fv-mid-cta fv-fade">
        <div className="fv-container">
          <div className="fv-mid-cta-inner">
            <div>
              <p className="fv-mid-cta-urgency">
                <Zap size={16} /> Secure your ride before prices increase
              </p>
              <p className="fv-mid-cta-sub">High demand for peak festival dates — don't leave it too late.</p>
            </div>
            <Link to="/booking" className="fv-mid-cta-btn">
              Book Your Transfer <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── PACKAGES ───────────────────────────────────────────────────────── */}
      <section className="fv-packages-section" id="packages">
        <div className="fv-container">
          <div className="fv-section-header fv-fade">
            <span className="fv-label">Transfer Packages</span>
            <h2 className="fv-section-title">Choose Your Ride</h2>
            <p className="fv-section-sub">All packages include pickup from your airport and drop-off at the festival venue. Fixed price, always.</p>
          </div>

          <div className="fv-pkg-grid">
            {packages.map((pkg, i) => (
              <div
                key={pkg.tier}
                className={`fv-pkg-card fv-fade ${pkg.popular ? 'fv-pkg-card--popular' : ''}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {pkg.popular && <div className="fv-pkg-badge">Most Popular</div>}
                <div className="fv-pkg-tier">{pkg.tier}</div>
                <div className="fv-pkg-price">
                  <span className="fv-pkg-from">From</span>
                  <span className="fv-pkg-amount">{pkg.price}</span>
                  <span className="fv-pkg-per">per person</span>
                </div>
                <ul className="fv-pkg-features">
                  {pkg.features.map(f => (
                    <li key={f}><Check size={14} />{f}</li>
                  ))}
                </ul>
                <p className="fv-pkg-urgency">
                  <Zap size={13} /> Only a few slots left for peak dates
                </p>
                <Link
                  to={`/booking?package=${encodeURIComponent(pkg.tier)}`}
                  className={`fv-pkg-btn ${pkg.popular ? 'fv-pkg-btn--popular' : ''}`}
                >
                  Book Now <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ──────────────────────────────────────────────────── */}
      <section className="fv-why-section" id="why-us">
        <div className="fv-container">
          <div className="fv-section-header fv-fade">
            <span className="fv-label">Why QuickRide</span>
            <h2 className="fv-section-title">The Festival Ride You Can Trust</h2>
            <p className="fv-section-sub">We've been getting festival-goers to their destinations since the beginning. Here's what makes us different.</p>
          </div>

          <div className="fv-why-grid">
            {reasons.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="fv-why-card fv-fade"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="fv-why-icon"><Icon size={24} /></div>
                <h3 className="fv-why-title">{title}</h3>
                <p className="fv-why-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section className="fv-testimonials-section">
        <div className="fv-container">
          <div className="fv-section-header fv-fade">
            <span className="fv-label">Real Travelers</span>
            <h2 className="fv-section-title">What Festival-Goers Say</h2>
          </div>

          <div className="fv-testimonials-grid">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="fv-testimonial fv-fade"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="fv-testimonial-stars">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p className="fv-testimonial-text">"{t.text}"</p>
                <div className="fv-testimonial-author">
                  <div className="fv-testimonial-avatar">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="fv-testimonial-name">{t.name}</div>
                    <div className="fv-testimonial-meta">{t.from} · {t.festival}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ────────────────────────────────────────────────────────── */}
      <section className="fv-gallery-section">
        <div className="fv-container">
          <div className="fv-section-header fv-fade">
            <span className="fv-label">The Vibe</span>
            <h2 className="fv-section-title">Feel the Energy</h2>
          </div>
        </div>
        <div className="fv-gallery-grid fv-fade">
          {galleryPhotos.map((src, i) => (
            <div key={i} className="fv-gallery-item">
              <img src={src} alt={`Festival ${i + 1}`} loading="lazy" />
              <div className="fv-gallery-hover" />
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="fv-faq-section" id="faq">
        <div className="fv-container">
          <div className="fv-section-header fv-fade">
            <span className="fv-label">Got Questions?</span>
            <h2 className="fv-section-title">Frequently Asked</h2>
          </div>

          <div className="fv-faq-list fv-fade">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`fv-faq-item${openFaq === i ? ' fv-faq-item--open' : ''}`}
              >
                <button
                  className="fv-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === i && (
                  <div className="fv-faq-a">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="fv-finale">
        <div
          className="fv-finale-bg"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1920&q=85)`,
            transform: `translateY(${(scrollY - 4000) * 0.12}px)`,
          }}
        />
        <div className="fv-finale-overlay" />
        <div className="fv-container fv-finale-content fv-fade">
          <Award size={40} className="fv-finale-icon" />
          <h2 className="fv-finale-title">
            Don't Miss Your Festival.<br />
            <em>We'll Handle the Ride.</em>
          </h2>
          <p className="fv-finale-sub">
            Fixed prices. Local drivers. Always on time. Book your transfer in 2 minutes.
          </p>
          <Link to="/booking" className="fv-finale-cta">
            Book Your Festival Transfer <ArrowRight size={20} />
          </Link>
          <p className="fv-finale-note">Free cancellation · No hidden fees · Confirmed in 2 hours</p>
        </div>
      </section>
    </div>
  )
}
