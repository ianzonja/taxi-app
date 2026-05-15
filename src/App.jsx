import Layout from './Layout'
import Home from './pages/Home'
import Booking from './pages/Booking'
import Blog from './pages/Blog'
import About from './pages/About'
import Festivals from './pages/Festivals'
import NationalParks from './pages/NationalParks'
import DayTrips from './pages/DayTrips'
import PaymentSuccess from './pages/PaymentSuccess'

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'booking', element: <Booking /> },
      { path: 'blog', element: <Blog /> },
      { path: 'festivals', element: <Festivals /> },
      { path: 'national-parks', element: <NationalParks /> },
      { path: 'day-trips', element: <DayTrips /> },
      { path: 'about', element: <About /> },
      { path: 'payment-success', element: <PaymentSuccess /> },
    ],
  },
]
