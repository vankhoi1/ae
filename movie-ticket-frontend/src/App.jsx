import { Routes, Route, Link } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import UserOnlyRoute from './components/UserOnlyRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MovieDetail from './pages/MovieDetail'
import SeatSelection from './pages/SeatSelection'
import BookingConfirmation from './pages/BookingConfirmation'
import MyBookings from './pages/MyBookings'
import MovieManagement from './pages/admin/MovieManagement'
import ShowtimeManagement from './pages/admin/ShowtimeManagement'
import RoomManagement from './pages/admin/RoomManagement'
import RevenueReport from './pages/admin/RevenueReport'
import Dashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import BookingManagement from './pages/admin/BookingManagement'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/book/:showtimeId" element={<UserOnlyRoute><SeatSelection /></UserOnlyRoute>} />
        <Route path="/booking/:id" element={<UserOnlyRoute><BookingConfirmation /></UserOnlyRoute>} />
        <Route path="/my-bookings" element={<UserOnlyRoute><MyBookings /></UserOnlyRoute>} />
        <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/admin/movies" element={<AdminRoute><MovieManagement /></AdminRoute>} />
        <Route path="/admin/showtimes" element={<AdminRoute><ShowtimeManagement /></AdminRoute>} />
        <Route path="/admin/rooms" element={<AdminRoute><RoomManagement /></AdminRoute>} />
        <Route path="/admin/revenue" element={<AdminRoute><RevenueReport /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
        <Route path="/admin/bookings" element={<AdminRoute><BookingManagement /></AdminRoute>} />
        <Route path="*" element={
          <div className="text-center py-20">
            <p className="text-6xl font-extrabold gradient-text mb-4">404</p>
            <p className="text-white/40 mb-6">Trang không tồn tại</p>
            <Link to="/" className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium">Về trang chủ</Link>
          </div>
        } />
      </Route>
    </Routes>
  )
}
