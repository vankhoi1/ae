import { Link } from 'react-router-dom'

const cards = [
  { title: 'Phim', desc: 'Quản lý phim, thể loại', link: '/admin/movies', icon: '🎬', gradient: 'from-blue-500 to-cyan-500' },
  { title: 'Suất chiếu', desc: 'Quản lý lịch chiếu', link: '/admin/showtimes', icon: '🎟', gradient: 'from-purple-500 to-pink-500' },
  { title: 'Phòng chiếu', desc: 'Quản lý phòng & ghế', link: '/admin/rooms', icon: '🏛', gradient: 'from-orange-500 to-yellow-500' },
  { title: 'Doanh thu', desc: 'Xem báo cáo & xuất Excel', link: '/admin/revenue', icon: '📊', gradient: 'from-green-500 to-emerald-500' },
  { title: 'Người dùng', desc: 'Quản lý tài khoản người dùng', link: '/admin/users', icon: '👥', gradient: 'from-pink-500 to-rose-500' },
  { title: 'Đơn đặt', desc: 'Xem tất cả đơn đặt vé', link: '/admin/bookings', icon: '📋', gradient: 'from-indigo-500 to-violet-500' },
]

export default function Dashboard() {
  return (
    <div className="relative min-h-screen">
      <div className="stars" aria-hidden="true" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold gradient-text">Bảng điều khiển</h1>
          <p className="text-white/40 mt-1">Quản lý toàn bộ hệ thống rạp chiếu phim</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map(c => (
            <Link key={c.title} to={c.link}
              className="glass rounded-2xl p-6 neon-border hover:scale-105 hover:shadow-neon transition-all duration-300 group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {c.icon}
              </div>
              <h3 className="font-bold text-white text-lg">{c.title}</h3>
              <p className="text-sm text-white/40 mt-1">{c.desc}</p>
              <div className="mt-4 text-xs text-purple-400 group-hover:text-purple-300 transition-colors">Quản lý →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
