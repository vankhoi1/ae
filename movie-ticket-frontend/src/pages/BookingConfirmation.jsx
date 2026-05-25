import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBooking, confirmBooking } from '../api/booking'
import Loading from '../components/Loading'
import { formatTime, formatDate, formatCurrency } from '../utils/date'

const STATUS_MAP = {
  PAID:      { label: 'Đã thanh toán', cls: 'text-green-400' },
  PENDING:   { label: 'Chờ thanh toán', cls: 'text-yellow-400' },
  CANCELLED: { label: 'Đã hủy',        cls: 'text-red-400' },
}

export default function BookingConfirmation() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    getBooking(id).then(r => setBooking(r.data)).catch(() => setLoadError(true)).finally(() => setLoading(false))
  }, [id])

  const handlePay = async () => {
    setPaying(true); setError('')
    try { await confirmBooking(id, 'VNPAY'); const r = await getBooking(id); setBooking(r.data) }
    catch { setError('Thanh toán thất bại. Vui lòng thử lại.') }
    setPaying(false)
  }

  if (loading) return <Loading />
  if (loadError || !booking) return (
    <div className="text-center py-20 text-white/40">
      <p className="mb-4">Không tìm thấy đơn đặt</p>
      <Link to="/" className="text-purple-400 hover:underline">Về trang chủ</Link>
    </div>
  )

  const isPaid = booking.status === 'PAID'
  const st = STATUS_MAP[booking.status] || { label: booking.status, cls: 'text-white/50' }

  const rows = [
    { label: 'Phim',        value: booking.movieTitle },
    { label: 'Ngày',        value: formatDate(booking.showtimeStart) },
    { label: 'Giờ',         value: formatTime(booking.showtimeStart) },
    { label: 'Phòng',       value: booking.roomName },
    { label: 'Ghế',         value: Array.isArray(booking.seats) ? booking.seats.join(', ') : booking.seats },
    { label: 'Phương thức', value: booking.paymentMethod, hide: !booking.paymentMethod },
  ]

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4">
      <div className="stars" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-2xl p-8 neon-border">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isPaid ? 'bg-green-500/20 border border-green-500/30' : 'bg-yellow-500/20 border border-yellow-500/30'}`}>
            {isPaid
              ? <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              : <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            }
          </div>

          <h2 className="text-2xl font-extrabold text-center gradient-text mb-1">
            {isPaid ? 'Thanh toán thành công!' : 'Chờ thanh toán'}
          </h2>
          <p className="text-center text-white/40 text-sm mb-6">Đơn #{booking.id}</p>

          {/* Details */}
          <div className="space-y-3 border-t border-white/10 pt-4">
            {rows.filter(r => !r.hide).map(r => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-white/40">{r.label}</span>
                <span className="text-white font-medium text-right max-w-[60%]">{r.value}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 border-t border-white/10">
              <span className="text-white/40">Tổng tiền</span>
              <span className="font-extrabold text-lg gradient-text">{formatCurrency(booking.totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Trạng thái</span>
              <span className={`font-semibold ${st.cls}`}>{st.label}</span>
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mt-4 text-sm">{error}</div>}

          {!isPaid && (
            <button onClick={handlePay} disabled={paying}
              className="btn-primary w-full mt-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-50">
              {paying ? 'Đang xử lý...' : `💳 Thanh toán · ${formatCurrency(booking.totalPrice)}`}
            </button>
          )}

          <div className="flex justify-center gap-6 mt-4">
            <Link to="/" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">Trang chủ</Link>
            <Link to="/my-bookings" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">Đơn đặt của tôi</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
