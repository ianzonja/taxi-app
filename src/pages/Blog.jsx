import { useState, useMemo, useEffect } from 'react'
import { Head } from 'vite-react-ssg'
import { Clock, User, ChevronRight, Tag, X, MapPin, Utensils } from 'lucide-react'

/* ─── Helpers ─────────────────────────────────────────── */
function StarRating({ rating }) {
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span className="star-rating" aria-label={`${rating} out of 5`}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
      <span className="star-number">{rating}/5</span>
    </span>
  )
}

function RestaurantCard({ name, description, rating, priceRange, specialty }) {
  return (
    <div className="restaurant-card">
      <div className="restaurant-card-header">
        <div>
          <h4 className="restaurant-name">{name}</h4>
          <p className="restaurant-specialty">{specialty}</p>
        </div>
        <span className="restaurant-price">{priceRange}</span>
      </div>
      <p className="restaurant-desc">{description}</p>
      <StarRating rating={rating} />
    </div>
  )
}

function DishItem({ name, description }) {
  return (
    <div className="dish-item">
      <h4 className="dish-name">{name}</h4>
      <p className="dish-desc">{description}</p>
    </div>
  )
}

function PlaceItem({ name, icon, description, tip }) {
  return (
    <div className="place-item">
      <div className="place-item-icon">{icon}</div>
      <div>
        <h4 className="place-name">{name}</h4>
        <p className="place-desc">{description}</p>
        {tip && <p className="place-tip">💡 {tip}</p>}
      </div>
    </div>
  )
}

function TipBox({ children }) {
  return <div className="blog-tip-box">{children}</div>
}

/* ─── Post data ────────────────────────────────────────── */
const posts = [
  {
    id: 7,
    category: 'Local Guide',
    title: 'Best and Must-Try Local Food in Zadar',
    excerpt:
      "Zadar's food scene is a love letter to the Adriatic — fresh catch at dawn, slow-cooked peka, and a cherry liqueur that's been perfecting itself since the 16th century. Here's where to eat and what to order.",
    author: 'Ana Perić',
    date: 'March 20, 2026',
    readTime: '8 min read',
    badgeClass: 'badge-amber',
    imgClass: 'card-img-amber',
    emoji: '🍽️',
    featured: true,
    content: (
      <>
        <p className="blog-post-lead">
          Zadar's food scene is a love letter to the Adriatic. The city has been feeding sailors,
          merchants, and travellers for over two thousand years — and somewhere along the way it
          refined a cuisine that is honest, seasonal, and quietly extraordinary.
        </p>

        <h2 className="blog-post-h2">Zadar's Culinary Soul</h2>
        <p className="blog-post-p">
          Dalmatian cooking is built on three pillars: exceptional olive oil, the freshest
          possible seafood, and patience. You won't find rushed meals here. Lunch stretches into
          the afternoon, wine appears without asking, and the waiter genuinely wants to know if
          you liked the fish.
        </p>
        <p className="blog-post-p">
          The region's geography does most of the work. The Zadar archipelago shelters the sea
          from rough waves, creating ideal conditions for shellfish and small fish to thrive.
          The hinterland supplies lamb, game, aromatic herbs, and Pag cheese — one of Europe's
          most distinctive sheep's milk cheeses, shaped by salt winds and wild island flora.
        </p>

        <h2 className="blog-post-h2">Traditional Dishes You Must Try</h2>

        <DishItem
          name="Peka — The Crown Jewel of Dalmatia"
          description="Lamb, veal, or octopus slow-cooked under a heavy iron bell (peka) buried in glowing embers for 2–3 hours. The result is impossibly tender meat or seafood saturated with olive oil, garlic, rosemary, and the smoky sweetness of the fire. Almost every konoba offers it — but you must order 24 hours in advance. It is worth planning your day around."
        />
        <DishItem
          name="Fresh Adriatic Fish"
          description="Sea bass (brancin), sea bream (orada), and dentex (zubatac) are the holy trinity of Dalmatian grilling. The preparation is almost insultingly simple — olive oil, salt, a squeeze of lemon — but the fish on your plate may have been swimming that morning. Do not season it before trying it plain. You'll understand immediately."
        />
        <DishItem
          name="Buzara"
          description="Mussels, clams, or scampi tumbled into a pan with white wine, garlic, olive oil, parsley, and breadcrumbs, then simmered until the shells open and the sauce reduces to something golden. Order a basket of crusty bread to mop up every drop."
        />
        <DishItem
          name="Paški Sir (Pag Cheese)"
          description="A PDO-protected sheep's milk cheese from the nearby island of Pag, where sheep graze on aromatic herbs and grass seasoned by Adriatic salt spray. The result is a sharp, nutty, slightly crumbly cheese unlike anything from a supermarket shelf. Order it as a starter with prosciutto, olives, and a glass of Pošip white wine."
        />
        <DishItem
          name="Maraschino Liqueur"
          description="Zadar's most famous export, produced here since the 16th century from Marasca cherries grown in the surrounding hills. Crystal-clear, distinctly floral, and nothing like the neon-red version you may know from cocktail cherries. Try it straight over ice, in a Zadar Sour (with lemon juice and egg white), or poured over vanilla ice cream."
        />
        <DishItem
          name="Soparnik"
          description="A flatbread pie from the Dalmatian hinterland, filled with Swiss chard, spring onions, garlic, parsley, and olive oil, then baked directly on stone. It looks humble; it tastes like someone's grandmother made it with love on a Sunday. Not on every menu — ask if they have it."
        />

        <h2 className="blog-post-h2">Where to Eat</h2>
        <p className="blog-post-p">
          Zadar's old town is compact but rich with good restaurants. These are the ones worth
          choosing for.
        </p>

        <RestaurantCard
          name="Restaurant Foša"
          description="Set right at the old city gate, with a terrace overlooking the ancient harbour walls, Foša manages to feel special without trying too hard. The fish is always beautifully fresh, the black risotto is a deep, briny masterpiece, and the setting at sunset is difficult to beat."
          rating={4.8}
          priceRange="€€€"
          specialty="Fresh grilled fish · Seafood risotto"
        />
        <RestaurantCard
          name="Pet Bunara (Five Wells)"
          description="Named after the historic square it overlooks, Pet Bunara blends modern Croatian cooking with traditional technique. The black risotto (crni rižoto) — made with cuttlefish ink, freshly caught cuttlefish, and white wine — has developed an almost cult following among regular visitors to Zadar."
          rating={4.7}
          priceRange="€€€"
          specialty="Black risotto · Fish carpaccio"
        />
        <RestaurantCard
          name="Konoba Stomorica"
          description="Tucked into a narrow alley in the heart of the old town, this small family-run konoba is where locals eat when they want real Dalmatian cooking. The menu changes with what came off the boats that morning. The house wine comes in a ceramic jug. Book ahead for peka."
          rating={4.6}
          priceRange="€€"
          specialty="Peka (24h advance order) · House wine"
        />
        <RestaurantCard
          name="Bruschetta Restaurant"
          description="A lively, unpretentious bistro that's excellent value for lunch. Freshly made pastas, generous bruschetta loaded with local toppings, and daily catch specials chalked on a board. Popular with locals on their lunch break — which is always a good sign."
          rating={4.3}
          priceRange="€"
          specialty="Pasta · Bruschetta · Daily catch"
        />
        <RestaurantCard
          name="Dva Ribara (Two Fishermen)"
          description="No frills, no nonsense. A fish restaurant that has been feeding Zadar locals for decades, with prices that reflect the fact that most of its clientele aren't tourists. The grilled fish plate — whatever the day's catch is — comes with boiled potatoes, blitva (Swiss chard), and olive oil. Perfect."
          rating={4.4}
          priceRange="€€"
          specialty="Grilled catch of the day · Brodetto (fish stew)"
        />

        <TipBox>
          <strong>Practical tip:</strong> Dalmatian restaurants often run out of their best dishes
          by early evening. Aim to eat dinner between 7 and 8 PM for the widest selection.
          If you want peka, call ahead the morning of your visit — or the previous evening.
        </TipBox>

        <h2 className="blog-post-h2">Food Market & Picnic Picks</h2>
        <p className="blog-post-p">
          Start your morning at the <strong>Zadar Green Market</strong> (Zeleni trg), open daily
          from 7 AM. Local farmers sell seasonal vegetables, fresh figs, wild herbs, and honey.
          The nearby fish market (Ribarnica) sells directly off the boats from 6 AM — arrive early
          for the best selection. Pick up a wedge of Paški sir, some pršut, and a loaf of
          homemade bread for an impromptu waterfront picnic along the Riva promenade.
        </p>
      </>
    ),
  },
  {
    id: 8,
    category: 'Local Guide',
    title: 'Must-See Places Around Zadar',
    excerpt:
      "A city where a Roman forum sits beside a 9th-century church, where the sea plays music through stone pipes, and where a 15-minute ferry ride lands you on an island that feels like another century.",
    author: 'Luka Babić',
    date: 'March 18, 2026',
    readTime: '10 min read',
    badgeClass: 'badge-teal',
    imgClass: 'card-img-teal',
    emoji: '🏛️',
    featured: true,
    content: (
      <>
        <p className="blog-post-lead">
          Alfred Hitchcock called Zadar's sunset the most beautiful in the world. That might be
          an exaggeration — or it might not. The light here does something strange and golden as
          it falls across the Adriatic. But the sunset is only the beginning.
        </p>

        <h2 className="blog-post-h2">In the City</h2>

        <PlaceItem
          icon="🎵"
          name="The Sea Organ (Morske Orgulje)"
          description="Cut into the marble steps of Zadar's waterfront promenade, 35 pipes of different lengths channel the push and pull of the sea through resonating chambers and out through openings in the stone. The result is a continuous, never-repeating chord — part music, part weather report, entirely hypnotic. The pipes were designed by architect Nikola Bašić and installed in 2005. Sit on the steps, close your eyes, and listen. Locals come here every evening, not as a tourist ritual but simply because it is a pleasant place to be."
          tip="Visit twice — once in the calm of morning, and once when the bora wind is up and the sea is restless. The music changes completely."
        />
        <PlaceItem
          icon="☀️"
          name="Greeting to the Sun (Pozdrav Suncu)"
          description="Just beside the Sea Organ, a 22-metre circle of 300 glass panels embedded in the stone pavement absorbs solar energy all day and releases it after dark as a shifting, multicolour light show that mirrors the sky above. Also designed by Nikola Bašić, it opened in 2008. In summer, the whole square transforms into an open-air light installation after sunset — children run across it, couples sit on the edge, and everyone takes too many photographs."
        />
        <PlaceItem
          icon="🏛️"
          name="The Roman Forum"
          description="The largest Roman forum on the eastern Adriatic coast, built between the 1st century BC and the 3rd century AD. A single column still stands — locals call it the Column of Shame, where wrongdoers were once chained publicly. The 9th-century Church of St. Donatus rises directly from the forum's ancient stones, built (with characteristic Dalmatian pragmatism) using Roman columns and architectural fragments as building material. The church no longer holds services but hosts classical music concerts in summer, with extraordinary acoustics."
          tip="The Forum is free to walk through at any hour. The Archaeological Museum beside it houses finds from the site and is worth an hour."
        />
        <PlaceItem
          icon="🧱"
          name="Old Town Walls & Land Gate"
          description="Zadar's medieval walls were built by the Venetians in the 16th century as a response to the Ottoman threat — and they worked. Walk the full circuit of the old town peninsula along the walls for views over both the sea and the islands. The Land Gate (Kopnena vrata), built in 1543, still bears the winged lion of St. Mark, the symbol of Venice. At night, it's lit dramatically against the dark sky."
        />

        <h2 className="blog-post-h2">Day Trips from Zadar</h2>
        <p className="blog-post-p">
          Zadar's location makes it an exceptional base. Within a two-hour radius you'll find
          national parks, ancient towns, and islands that see a fraction of the visitors that
          Dubrovnik and Split attract.
        </p>

        <PlaceItem
          icon="⛵"
          name="Island of Ugljan — 15 Minutes by Ferry"
          description="Take the regular ferry from Zadar's harbour to the island of Ugljan and you'll arrive in a world of olive groves, fishing villages, and almost no tourists. Rent a bike in the village of Ugljan and cycle south to the village of Kukljica, stopping at quiet coves along the way. The views back across the channel to Zadar's old town are some of the best in the region."
          tip="The ferry runs every 1–2 hours and takes foot passengers and bikes. No reservation needed."
        />
        <PlaceItem
          icon="🏺"
          name="Nin — Croatia's Oldest Royal Town (45 min drive)"
          description="Nin is a tiny island town — the entire old town fits inside a single oval — connected to the mainland by two small stone bridges. It was the seat of early Croatian kings in the 9th and 10th centuries, and its 9th-century Church of the Holy Cross is considered the smallest cathedral in the world. The surrounding salt flats have been harvested since Roman times and are still active. The shallow lagoon (Nin Lagoon) is one of the few places in Croatia where you can stand in the sea for 200 metres and still only be knee-deep."
          tip="The salt flats surrounding Nin are also a flamingo habitat — worth visiting in spring."
        />
        <PlaceItem
          icon="🏝️"
          name="Telašćica Nature Park (Dugi Otok Island)"
          description="A deep, sheltered bay on the island of Dugi Otok (Long Island), connected to a saltwater lake whose temperature stays several degrees warmer than the sea. The cliffs on the southern side of the park drop 160 metres straight into the Adriatic — one of the most dramatic coastal landscapes in the Mediterranean. Access is by boat; day trips depart from Zadar harbour every morning in summer."
          tip="The saltwater lake (Mir Lake) is used for mud treatments — bring old swimwear."
        />
        <PlaceItem
          icon="🌊"
          name="Kornati National Park"
          description="An archipelago of 89 islands, islets, and reefs — the densest concentration of islands in the Mediterranean. Kornati is a moonscape of white limestone, low scrub, and the most extraordinarily clear water you may ever swim in. Day trip boats depart from Zadar and Biograd, typically stopping at 3–4 islands, with a long lunch at a park konoba (the lamb and fish are exceptional). If you sail, this is among the finest cruising grounds in the Adriatic."
        />
        <PlaceItem
          icon="💦"
          name="Krka National Park (1.5h drive)"
          description="Seven waterfalls cascade down the Krka River canyon, the most famous being Skradinski Buk — a 45-metre travertine amphitheatre where the water falls through curtains of moss into a series of pools. Swimming directly beneath the falls was banned in 2020 to protect the ecosystem, but the boardwalk trails give you extraordinary close-up views. Combine with a boat trip upstream to the medieval Franciscan monastery on the island of Visovac."
          tip="Arrive before 9 AM in summer to beat tour groups. The park is significantly quieter in September and October."
        />
        <PlaceItem
          icon="⛰️"
          name="Paklenica National Park (1h drive)"
          description="Two limestone gorges cut into the southern face of the Velebit mountain range — Velika Paklenica (Big Paklenica) and Mala Paklenica (Little Paklenica). The main gorge trail follows a river through 400-metre cliffs to a mountain hut at 850m altitude. A less-known feature: a Cold War-era Yugoslav military bunker tunnelled 3.5km into the mountain, now open for tours."
          tip="The gorge offers some of the best rock climbing in Croatia — over 400 bolted routes for all levels."
        />

        <TipBox>
          <strong>Getting around:</strong> Zadar's taxi service is reliable for airport transfers
          and reaching trailheads for Paklenica and Nin. For island day trips, use the organised
          boat tours that depart from the harbour — they include lunch and a guide.
        </TipBox>

        <h2 className="blog-post-h2">A Word from the Locals</h2>
        <p className="blog-post-p">
          Ask any Zadranin (Zadar native) what they love most about their city and they'll
          pause before answering. Not because they don't know, but because they're deciding
          which thing to mention first — the fact that you can swim in the sea at 7 AM, be
          eating fried squid for breakfast by 8, and standing in a 2,000-year-old forum by 9.
        </p>
        <p className="blog-post-p">
          "People always think you have to go to Dubrovnik or Split," says Marija, who runs
          a small apartment in the old town. "But Zadar still feels real. There are people
          who actually live here. Kids playing football in the square at 10 PM. Old men
          playing cards outside the bar. Come in September — the tourists leave, the sea
          is still warm, and the whole city is ours again."
        </p>
      </>
    ),
  },
  {
    id: 1,
    category: 'Safety',
    title: '10 Tips to Stay Safe When Taking a Taxi',
    excerpt:
      "Whether you're a first-time rider or a daily commuter, these safety tips will help you travel with confidence and peace of mind.",
    author: 'Sarah Mitchell',
    date: 'March 12, 2026',
    readTime: '5 min read',
    badgeClass: 'badge-blue',
    imgClass: 'card-img-blue',
    emoji: '🛡️',
    featured: false,
    content: null,
  },
  {
    id: 2,
    category: 'Travel',
    title: 'The Best Airport Transfer Tips for Stress-Free Travel',
    excerpt:
      "Airport runs don't have to be stressful. Here's how to plan the perfect transfer and never miss a flight again.",
    author: 'James Carter',
    date: 'March 8, 2026',
    readTime: '4 min read',
    badgeClass: 'badge-indigo',
    imgClass: 'card-img-indigo',
    emoji: '✈️',
    featured: false,
    content: null,
  },
  {
    id: 3,
    category: 'Lifestyle',
    title: 'How Ride-Sharing is Changing Urban Commuting',
    excerpt:
      'Cities are getting smarter. Discover how modern taxi and ride-share platforms are reshaping the way we move through our cities.',
    author: 'Emily Ross',
    date: 'March 3, 2026',
    readTime: '6 min read',
    badgeClass: 'badge-violet',
    imgClass: 'card-img-violet',
    emoji: '🏙️',
    featured: false,
    content: null,
  },
  {
    id: 4,
    category: 'Drivers',
    title: 'A Day in the Life of a QuickRide Driver',
    excerpt:
      "We spent a day with Marcus, one of our top-rated drivers, to understand what makes a great ride experience from the driver's perspective.",
    author: 'Tom Nguyen',
    date: 'Feb 27, 2026',
    readTime: '7 min read',
    badgeClass: 'badge-sky',
    imgClass: 'card-img-sky',
    emoji: '🧑‍✈️',
    featured: false,
    content: null,
  },
  {
    id: 5,
    category: 'Tips',
    title: 'How to Save Money on Every Ride You Take',
    excerpt:
      "Surge pricing, promo codes, and scheduling tricks — here's your complete guide to getting the most value out of QuickRide.",
    author: 'Sarah Mitchell',
    date: 'Feb 20, 2026',
    readTime: '4 min read',
    badgeClass: 'badge-emerald',
    imgClass: 'card-img-emerald',
    emoji: '💰',
    featured: false,
    content: null,
  },
  {
    id: 6,
    category: 'Technology',
    title: 'How AI Is Making Taxi Dispatching Smarter',
    excerpt:
      "Behind every fast pickup is a smart algorithm. We break down how machine learning is optimizing driver dispatch and route planning.",
    author: 'James Carter',
    date: 'Feb 14, 2026',
    readTime: '8 min read',
    badgeClass: 'badge-orange',
    imgClass: 'card-img-orange',
    emoji: '🤖',
    featured: false,
    content: null,
  },
]

const CATEGORIES = ['All', 'Local Guide', 'Safety', 'Travel', 'Lifestyle', 'Drivers', 'Tips', 'Technology']

/* ─── Post Modal ────────────────────────────────────────── */
function PostModal({ post, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <div className="blog-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="blog-modal" onClick={(e) => e.stopPropagation()}>
        <div className="blog-modal-header">
          <div>
            <span className={`blog-card-category ${post.badgeClass}`}>{post.category}</span>
            <h2 className="blog-modal-title">{post.title}</h2>
            <div className="blog-modal-meta">
              <span className="blog-modal-meta-item"><User size={14} />{post.author}</span>
              <span className="blog-modal-meta-item"><Clock size={14} />{post.readTime}</span>
              <span className="blog-modal-meta-item">{post.date}</span>
            </div>
          </div>
          <button className="blog-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="blog-modal-body">
          {post.content ?? (
            <p className="blog-post-p">Full article coming soon.</p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Featured Card ─────────────────────────────────────── */
function FeaturedCard({ post, onOpen }) {
  return (
    <article className={`blog-featured-card blog-featured-card--${post.id}`}>
      <div className={`blog-featured-visual ${post.imgClass}`}>
        <span className="blog-featured-emoji">{post.emoji}</span>
        <span className="blog-featured-label">Local Guide</span>
      </div>
      <div className="blog-featured-body">
        <span className={`blog-card-category ${post.badgeClass}`}>{post.category}</span>
        <h3 className="blog-featured-title">{post.title}</h3>
        <p className="blog-featured-excerpt">{post.excerpt}</p>
        <div className="blog-featured-footer">
          <div className="blog-card-meta">
            <span className="blog-card-meta-item"><User size={12} />{post.author}</span>
            <span className="blog-card-meta-item"><Clock size={12} />{post.readTime}</span>
          </div>
          <button className="blog-card-read-more" onClick={() => onOpen(post)}>
            Read <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </article>
  )
}

/* ─── Regular Card ──────────────────────────────────────── */
function BlogCard({ post, onOpen }) {
  return (
    <article className="blog-card" onClick={() => post.content && onOpen(post)}>
      <div className={`blog-card-image ${post.imgClass}`}>{post.emoji}</div>
      <div className="blog-card-body">
        <span className={`blog-card-category ${post.badgeClass}`}>{post.category}</span>
        <h3 className="blog-card-title">{post.title}</h3>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <div className="blog-card-footer">
          <div className="blog-card-meta">
            <span className="blog-card-meta-item"><User size={12} />{post.author}</span>
            <span className="blog-card-meta-item"><Clock size={12} />{post.readTime}</span>
          </div>
          {post.content && (
            <button className="blog-card-read-more" onClick={(e) => { e.stopPropagation(); onOpen(post) }}>
              Read <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

/* ─── Blog Page ─────────────────────────────────────────── */
export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedPost, setSelectedPost]     = useState(null)

  const featuredPosts = useMemo(() => posts.filter((p) => p.featured), [])
  const gridPosts     = useMemo(() => {
    const base = posts.filter((p) => !p.featured)
    if (activeCategory === 'All') return base
    return base.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  const showFeatured = activeCategory === 'All' || activeCategory === 'Local Guide'

  return (
    <div className="blog-page">
      <Head>
        <title>Blog — QuickRide</title>
        <meta name="description" content="Travel guides, local food recommendations, Zadar attractions, and ride-sharing tips from the QuickRide team." />
        <meta property="og:title" content="Blog — QuickRide" />
        <meta property="og:description" content="Local guides, travel tips, and stories about Zadar and beyond." />
        <meta property="og:type" content="website" />
      </Head>

      {/* Hero */}
      <div className="blog-hero">
        <div className="container">
          <span className="badge badge-blue blog-hero-badge">
            <Tag size={12} /> QuickRide Blog
          </span>
          <h1 className="blog-hero-title">Stories &amp; Local Guides</h1>
          <p className="blog-hero-subtitle">
            Discover Zadar's best food, hidden gems, and travel tips — curated by locals and travellers alike.
          </p>
        </div>
      </div>

      <div className="container blog-container">

        {/* Category filter */}
        <div className="blog-filter">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`blog-filter-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured local guides */}
        {showFeatured && (
          <section className="blog-featured-section">
            <h2 className="blog-section-label">
              <MapPin size={16} /> Local Guides
            </h2>
            <div className="blog-featured-grid">
              {featuredPosts.map((post) => (
                <FeaturedCard key={post.id} post={post} onOpen={setSelectedPost} />
              ))}
            </div>
          </section>
        )}

        {/* Regular posts grid */}
        {gridPosts.length > 0 && (
          <section>
            {showFeatured && (
              <h2 className="blog-section-label">
                <Utensils size={16} /> Latest Articles
              </h2>
            )}
            <div className="blog-grid">
              {gridPosts.map((post) => (
                <BlogCard key={post.id} post={post} onOpen={setSelectedPost} />
              ))}
            </div>
          </section>
        )}

        {gridPosts.length === 0 && !showFeatured && (
          <p className="blog-empty">No articles in this category yet.</p>
        )}
      </div>

      {/* Post modal */}
      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  )
}
