import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <nav className="glass-dark sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="text-xl font-bold gradient-text">MovieTicket</span>
          </Link>

          <button className="sm:hidden p-2 rounded-lg hover:bg-white/10" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>

          <div className="hidden sm:flex items-center gap-1">
            <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/') ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>Phim</Link>
            {user ? (
              <>
                {user.role !== 'ADMIN' && (
                  <Link to="/my-bookings" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/my-bookings') ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>Đơn đặt</Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/admin') ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>Quản trị</Link>
                )}
                <div className="w-px h-5 bg-white/20 mx-2" />
                <span className="text-white/40 text-sm truncate max-w-[120px]">{user.email}</span>
                <button onClick={logout} className="ml-2 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">Đăng xuất</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">Đăng nhập</Link>
                <Link to="/register" className="btn-primary px-4 py-2 rounded-lg text-sm font-medium">Đăng ký</Link>
              </>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden pb-4 space-y-1 border-t border-white/10 pt-3">
            <Link to="/" className="block px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10" onClick={() => setMenuOpen(false)}>Phim</Link>
            {user ? (
              <>
                {user.role !== 'ADMIN' && (
                  <Link to="/my-bookings" className="block px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10" onClick={() => setMenuOpen(false)}>Đơn đặt</Link>
                )}
                {user.role === 'ADMIN' && <Link to="/admin" className="block px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10" onClick={() => setMenuOpen(false)}>Quản trị</Link>}
                <div className="px-3 py-2 text-sm text-white/40">{user.email}</div>
                <button onClick={() => { logout(); setMenuOpen(false) }} className="block w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg">Đăng xuất</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10" onClick={() => setMenuOpen(false)}>Đăng nhập</Link>
                <Link to="/register" className="block px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10" onClick={() => setMenuOpen(false)}>Đăng ký</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
