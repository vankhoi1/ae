import { useState, useEffect, useRef } from 'react'
import { getSeats } from '../api/room'
import { getShowtime } from '../api/showtime'
import { useParams, useNavigate } from 'react-router-dom'
import { createBooking, confirmBooking, releaseBooking } from '../api/booking'
import SeatMap from '../components/SeatMap'
import Loading from '../components/Loading'
import { formatTime, formatCurrency } from '../utils/date'

const HOLD_DURATION_MIN = 10

export default function SeatSelection() {
  const { showtimeId } = useParams()
  const navigate = useNavigate()
  const [showtime, setShowtime] = useState(null)
  const [seats, setSeats] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [booking, setBooking] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [timer, setTimer] = useState(HOLD_DURATION_MIN * 60)
  const timerRef = useRef(null)

  useEffect(() => {
    setLoading(true); setError('')
    getShowtime(showtimeId).then(st => {
      setShowtime(st.data)
      return getSeats(st.data.roomId, showtimeId)
    }).then(r => setSeats(r.data))
      .catch(() => setError('Không thể tải thông tin suất chiếu.'))
      .finally(() => setLoading(false))
  }, [showtimeId])

  useEffect(() => {
    if (!booking || timer <= 0) return
    timerRef.current = setInterval(() => {
      setTimer(prev => { if (prev <= 1) { clearInterval(timerRef.current); navigate('/'); return 0 } return prev - 1 })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [booking, timer, navigate])

  const toggleSeat = (seat) => {
    if (seat.occupied) return
    setSelected(prev => prev.some(s => s.id === seat.id) ? prev.filter(s => s.id !== seat.id) : [...prev, seat])
  }

  const totalPrice = selected.reduce((sum, seat) => {
    if (!showtime) return sum
    return sum + Number(seat.type === 'VIP' ? showtime.priceVip : showtime.priceStandard)
  }, 0)

  const handleBooking = async () => {
    if (selected.length === 0) return
    if (!confirm(`Xác nhận đặt ${selected.length} ghế?`)) return
    setBookingLoading(true); setError('')
    try {
      const res = await createBooking({ showtimeId: Number(showtimeId), seatIds: selected.map(s => s.id) })
      setBooking(res.data); setTimer(HOLD_DURATION_MIN * 60)
    } catch (err) { setError(err.response?.data?.error || 'Đặt vé thất bại') }
    setBookingLoading(false)
  }

  const handleConfirm = async () => {
    setConfirmLoading(true); setError('')
    try { await confirmBooking(booking.id, 'VNPAY'); navigate(`/booking/${booking.id}`) }
    catch { setError('Thanh toán thất bại') }
    setConfirmLoading(false)
  }

  const handleCancel = async () => {
    if (booking) { try { await releaseBooking(booking.id) } catch {} }
    navigate('/')
  }

  const fmtTimer = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

  if (loading) return <Loading />

  if (booking) return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4">
      <div className="stars" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md text-center">
        <div className="glass rounded-2xl p-8 neon-border">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Đã giữ ghế!</h2>
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-1.5 rounded-full text-sm font-medium mb-2">
            ⏱ Còn lại: {fmtTimer(timer)}
          </div>
          <p className="text-white/40 text-sm mb-6">Đơn #{booking.id} · {formatCurrency(booking.totalPrice)}</p>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-sm">{error}</div>}
          <button onClick={handleConfirm} disabled={confirmLoading}
            className="btn-primary w-full py-3 rounded-xl font-semibold mb-3 disabled:opacity-50">
            {confirmLoading ? 'Đang xử lý...' : '💳 Xác nhận thanh toán'}
          </button>
          <button onClick={handleCancel} className="w-full glass py-3 rounded-xl text-white/60 hover:text-white text-sm transition-all">
            Hủy giữ ghế
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative min-h-screen">
      <div className="stars" aria-hidden="true" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-sm">{error}</div>}

        {showtime && (
          <div className="glass rounded-2xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-bold text-lg text-white">{showtime.movieTitle}</h2>
              <p className="text-sm text-white/50">{formatTime(showtime.startTime)} · {showtime.roomName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/40">{selected.length} ghế đã chọn</p>
              <p className="text-xl font-bold gradient-text">{formatCurrency(totalPrice)}</p>
            </div>
          </div>
        )}

        <div className="glass rounded-2xl p-6 mb-6">
          <SeatMap seats={seats} selectedSeats={selected.map(s => s.id)} onToggle={toggleSeat} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate(-1)} className="glass px-6 py-3 rounded-xl text-white/60 hover:text-white text-sm transition-all">
            ← Quay lại
          </button>
          <button onClick={handleBooking} disabled={selected.length === 0 || bookingLoading}
            className="btn-primary px-10 py-3 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed">
            {bookingLoading ? 'Đang xử lý...' : selected.length === 0 ? 'Chọn ghế để tiếp tục' : `🎟 Đặt ${selected.length} ghế · ${formatCurrency(totalPrice)}`}
          </button>
        </div>
      </div>
    </div>
  )
}
