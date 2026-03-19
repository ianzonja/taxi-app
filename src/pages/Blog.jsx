import { Head } from 'vite-react-ssg'
import { Clock, User, ChevronRight, Tag } from 'lucide-react'

const posts = [
  {
    id: 1,
    category: 'Safety',
    title: '10 Tips to Stay Safe When Taking a Taxi',
    excerpt: "Whether you're a first-time rider or a daily commuter, these safety tips will help you travel with confidence and peace of mind.",
    author: 'Sarah Mitchell',
    date: 'March 12, 2026',
    readTime: '5 min read',
    badgeClass: 'badge-blue',
    imgClass: 'card-img-blue',
  },
  {
    id: 2,
    category: 'Travel',
    title: 'The Best Airport Transfer Tips for Stress-Free Travel',
    excerpt: "Airport runs don't have to be stressful. Here's how to plan the perfect transfer and never miss a flight again.",
    author: 'James Carter',
    date: 'March 8, 2026',
    readTime: '4 min read',
    badgeClass: 'badge-indigo',
    imgClass: 'card-img-indigo',
  },
  {
    id: 3,
    category: 'Lifestyle',
    title: 'How Ride-Sharing is Changing Urban Commuting',
    excerpt: 'Cities are getting smarter. Discover how modern taxi and ride-share platforms are reshaping the way we move through our cities.',
    author: 'Emily Ross',
    date: 'March 3, 2026',
    readTime: '6 min read',
    badgeClass: 'badge-violet',
    imgClass: 'card-img-violet',
  },
  {
    id: 4,
    category: 'Drivers',
    title: 'A Day in the Life of a QuickRide Driver',
    excerpt: "We spent a day with Marcus, one of our top-rated drivers, to understand what makes a great ride experience from the driver's perspective.",
    author: 'Tom Nguyen',
    date: 'Feb 27, 2026',
    readTime: '7 min read',
    badgeClass: 'badge-sky',
    imgClass: 'card-img-sky',
  },
  {
    id: 5,
    category: 'Tips',
    title: 'How to Save Money on Every Ride You Take',
    excerpt: "Surge pricing, promo codes, and scheduling tricks — here's your complete guide to getting the most value out of QuickRide.",
    author: 'Sarah Mitchell',
    date: 'Feb 20, 2026',
    readTime: '4 min read',
    badgeClass: 'badge-emerald',
    imgClass: 'card-img-emerald',
  },
  {
    id: 6,
    category: 'Technology',
    title: 'How AI Is Making Taxi Dispatching Smarter',
    excerpt: "Behind every fast pickup is a smart algorithm. We break down how machine learning is optimizing driver dispatch and route planning.",
    author: 'James Carter',
    date: 'Feb 14, 2026',
    readTime: '8 min read',
    badgeClass: 'badge-orange',
    imgClass: 'card-img-orange',
  },
]

export default function Blog() {
  return (
    <div className="blog-page">
      <Head>
        <title>Blog — QuickRide</title>
        <meta name="description" content="Read the latest tips, guides, and news about ride-sharing, urban commuting, and safe travel from the QuickRide team." />
        <meta property="og:title" content="Blog — QuickRide" />
        <meta property="og:description" content="Tips, guides, and news about ride-sharing, urban commuting, and safe travel." />
        <meta property="og:type" content="website" />
      </Head>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>
            <Tag className="blog-badge-icon" /> QuickRide Blog
          </span>
          <h1 className="blog-title">Stories &amp; Insights</h1>
          <p className="blog-subtitle">
            Tips, travel guides, and behind-the-scenes stories from the QuickRide team.
          </p>
        </div>

        {/* Featured post */}
        <div className="featured-post">
          <div className="featured-post-grid">
            <div className="featured-post-visual">
              <div className="featured-post-visual-inner">
                <div className="featured-post-emoji-wrapper">
                  <span className="featured-post-emoji">🚖</span>
                </div>
                <p className="featured-post-label">Featured Story</p>
              </div>
            </div>
            <div className="featured-post-content">
              <span className={`badge ${posts[0].badgeClass} featured-post-category`}>
                {posts[0].category}
              </span>
              <h2 className="featured-post-title">{posts[0].title}</h2>
              <p className="featured-post-excerpt">{posts[0].excerpt}</p>
              <div className="featured-post-footer">
                <div className="featured-post-meta">
                  <span className="featured-post-meta-item"><User /> {posts[0].author}</span>
                  <span className="featured-post-meta-item"><Clock /> {posts[0].readTime}</span>
                </div>
                <button className="featured-post-read-more">
                  Read more <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Post grid */}
        <div className="blog-grid">
          {posts.slice(1).map((post) => {
            const emoji = ['✈️', '🏙️', '🧑‍✈️', '💰', '🤖'][post.id - 2] || '📰'
            return (
              <article key={post.id} className="blog-card">
                <div className={`blog-card-image ${post.imgClass}`}>
                  {emoji}
                </div>
                <div className="blog-card-body">
                  <span className={`blog-card-category ${post.badgeClass}`}>
                    {post.category}
                  </span>
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <div className="blog-card-footer">
                    <div className="blog-card-meta">
                      <span className="blog-card-meta-item"><User />{post.author}</span>
                      <span className="blog-card-meta-item"><Clock />{post.readTime}</span>
                    </div>
                    <button className="blog-card-read-more">
                      Read <ChevronRight />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Load more */}
        <div className="blog-load-more">
          <button className="btn btn-outline">Load More Articles</button>
        </div>
      </div>
    </div>
  )
}
