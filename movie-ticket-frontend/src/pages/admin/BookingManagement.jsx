import { useState, useEffect } from 'react'
import Loading from '../../components/Loading'
import api from '../../api/axios'
import { formatDate, formatTime, formatCurrency } from '../../utils/date'

const STATUS_MAP = {
  PAID:      { label: 'Đã thanh toán', cls: 'bg-green-500/15 text-green-400 border border-green-500/30' },
  PENDING:   { label: 'Chờ thanh toán', cls: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' },
  CANCELLED: { label: 'Đã hủy', cls: 'bg-red-500/15 text-red-400 border border-red-500/30' },
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    api.get('/bookings/all').then(r => setBookings(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = bookings.filter(b => {
    const matchSearch = !search || b.movieTitle?.toLowerCase().includes(search.toLowerCase()) || b.userEmail?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || b.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalRevenue = bookings.filter(b => b.status === 'PAID').reduce((s, b) => s + Number(b.totalPrice), 0)

  if (loading) return <Loading />

  return (
    <div className="relative min-h-screen">
      <div className="stars" aria-hidden="true" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold gradient-text mb-6">📋 Quản lý đơn đặt</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Tổng đơn', value: bookings.length, cls: 'from-purple-500 to-pink-500' },
            { label: 'Đã thanh toán', value: bookings.filter(b=>b.status==='PAID').length, cls: 'from-green-500 to-emerald-500' },
            { label: 'Chờ thanh toán', value: bookings.filter(b=>b.status==='PENDING').length, cls: 'from-yellow-500 to-orange-500' },
            { label: 'Doanh thu', value: formatCurrency(totalRevenue), cls: 'from-blue-500 to-cyan-500' },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-4">
              <div className={`text-xs text-white/40 mb-1`}>{s.label}</div>
              <div className={`text-xl font-extrabold bg-gradient-to-r ${s.cls} bg-clip-text text-transparent`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input type="text" placeholder="🔍 Tìm phim hoặc email..." value={search}
            onChange={e => setSearch(e.target.value)} className="input-dark rounded-xl px-4 py-2 text-sm w-64" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-dark rounded-xl px-3 py-2 text-sm">
            <option value="">Tất cả trạng thái</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="PENDING">Chờ thanh toán</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-white/40 text-xs uppercase">
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Người dùng</th>
                <th className="text-left p-3">Phim</th>
                <th className="text-left p-3">Suất chiếu</th>
                <th className="text-left p-3">Ghế</th>
                <th className="text-left p-3">Tổng tiền</th>
                <th className="text-left p-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-white/30">Không có đơn đặt nào</td></tr>}
              {filtered.map(b => {
                const st = STATUS_MAP[b.status] || { label: b.status, cls: 'bg-white/10 text-white/50' }
                return (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 text-white/30 text-xs">#{b.id}</td>
                    <td className="p-3 text-white/60 text-xs">{b.userEmail}</td>
                    <td className="p-3 font-medium text-white">{b.movieTitle}</td>
                    <td className="p-3 text-white/50 text-xs">{formatDate(b.showtimeStart)} {formatTime(b.showtimeStart)}</td>
                    <td className="p-3 text-white/50 text-xs">{Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}</td>
                    <td className="p-3 font-semibold gradient-text">{formatCurrency(b.totalPrice)}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${st.cls}`}>{st.label}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-white/30 mt-3">Hiển thị {filtered.length} / {bookings.length} đơn</p>
      </div>
    </div>
  )
}
