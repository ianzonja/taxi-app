import Layout from './Layout'
import Home from './pages/Home'
import Booking from './pages/Booking'
import Blog from './pages/Blog'
import About from './pages/About'

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'booking', element: <Booking /> },
      { path: 'blog', element: <Blog /> },
      { path: 'about', element: <About /> },
    ],
  },
]
