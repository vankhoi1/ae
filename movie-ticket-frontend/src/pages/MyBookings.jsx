import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyBookings, cancelBooking } from '../api/booking'
import Loading from '../components/Loading'
import { formatTime, formatDate, formatCurrency } from '../utils/date'

const STATUS_MAP = {
  PAID:      { label: 'Đã thanh toán', cls: 'bg-green-500/15 text-green-400 border border-green-500/30' },
  PENDING:   { label: 'Chờ thanh toán', cls: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' },
  CANCELLED: { label: 'Đã hủy', cls: 'bg-red-500/15 text-red-400 border border-red-500/30' },
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  const load = () => {
    setLoading(true); setError('')
    getMyBookings().then(r => setBookings(r.data)).catch(() => setError('Không thể tải danh sách đơn đặt.')).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCancel = async (id) => {
    if (!confirm('Hủy đơn đặt này?')) return
    setCancellingId(id)
    try { await cancelBooking(id); load() } catch { alert('Hủy thất bại.') }
    setCancellingId(null)
  }

  if (loading) return <Loading />

  return (
    <div className="relative min-h-screen">
      <div className="stars" aria-hidden="true" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold gradient-text mb-8">🎟 Đơn đặt của tôi</h1>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-sm">{error}</div>}

        {bookings.length === 0 && !error ? (
          <div className="glass rounded-2xl p-16 text-center">
            <p className="text-5xl mb-4">🎬</p>
            <p className="text-white/40 mb-4">Chưa có đơn đặt nào</p>
            <Link to="/" className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium inline-block">Xem phim ngay</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map(b => {
              const st = STATUS_MAP[b.status] || { label: b.status, cls: 'bg-white/10 text-white/50' }
              return (
                <div key={b.id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start gap-4 hover:bg-white/10 transition-all">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 font-bold text-sm">
                      #{b.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{b.movieTitle}</h3>
                      <p className="text-sm text-white/50 mt-0.5">{formatDate(b.showtimeStart)} · {formatTime(b.showtimeStart)}</p>
                      <p className="text-sm text-white/40">{b.roomName} · Ghế: <span className="text-white/60">{Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}</span></p>
                      <p className="text-sm font-bold gradient-text mt-1">{formatCurrency(b.totalPrice)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${st.cls}`}>{st.label}</span>
                    <Link to={`/booking/${b.id}`} className="px-3 py-1 rounded-lg text-xs text-purple-400 hover:text-purple-300 glass transition-all">Xem</Link>
                    {b.status === 'PENDING' && (
                      <button onClick={() => handleCancel(b.id)} disabled={cancellingId === b.id}
                        className="px-3 py-1 rounded-lg text-xs text-red-400 hover:text-red-300 glass transition-all disabled:opacity-40">
                        {cancellingId === b.id ? 'Đang hủy...' : 'Hủy'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
