import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMovie } from '../api/movie'
import { getShowtimes } from '../api/showtime'
import Loading from '../components/Loading'
import { formatTime, formatCurrency } from '../utils/date'
import { useAuth } from '../context/AuthContext'

export default function MovieDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [movie, setMovie] = useState(null)
  const [showtimes, setShowtimes] = useState([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [movieError, setMovieError] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => { getMovie(id).then(r => setMovie(r.data)).catch(() => setMovieError(true)) }, [id])

  useEffect(() => {
    if (!movie) return
    setLoading(true); setError('')
    getShowtimes(id, date).then(r => setShowtimes(r.data)).catch(() => setError('Không thể tải suất chiếu.')).finally(() => setLoading(false))
  }, [id, date, movie])

  if (movieError) return (
    <div className="text-center py-20 text-white/50">
      <p className="text-lg mb-2">Không tìm thấy phim</p>
      <Link to="/" className="text-purple-400 hover:underline">← Về trang chủ</Link>
    </div>
  )
  if (!movie) return <Loading />

  return (
    <div className="relative min-h-screen">
      <div className="stars" aria-hidden="true" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 mb-6 transition-colors">
          ← Về danh sách phim
        </Link>

        {/* Movie info */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="w-full md:w-64 shrink-0">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden neon-border shadow-card">
              {movie.posterUrl
                ? <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" loading="lazy" />
                : <div className="w-full h-full glass flex items-center justify-center text-white/20"><svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg></div>
              }
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-white mb-3">{movie.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.duration && <span className="glass px-3 py-1 rounded-full text-sm text-white/70">⏱ {movie.duration} phút</span>}
              {movie.genreName && <span className="glass px-3 py-1 rounded-full text-sm text-purple-300">🎭 {movie.genreName}</span>}
              {movie.releaseDate && <span className="glass px-3 py-1 rounded-full text-sm text-white/70">📅 {movie.releaseDate}</span>}
            </div>
            {movie.description && <p className="text-white/60 leading-relaxed">{movie.description}</p>}
            {movie.trailerUrl && (
              <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 btn-primary px-5 py-2.5 rounded-xl text-sm font-medium">
                ▶ Xem Trailer
              </a>
            )}
          </div>
        </div>

        {/* Showtimes */}
        <div className="glass rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-white">🎟 Chọn suất chiếu</h2>
            <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)}
              className="input-dark rounded-xl px-4 py-2 text-sm" aria-label="Chọn ngày" />
          </div>

          {loading ? <Loading /> : error ? (
            <p className="text-red-400 text-sm">{error}</p>
          ) : showtimes.length === 0 ? (
            <div className="text-center py-10 text-white/30">
              <p className="text-4xl mb-2">🎬</p>
              <p>Không có suất chiếu nào vào ngày này</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {showtimes.map(st => (
                user?.role === 'ADMIN' ? (
                  <div key={st.id} className="glass-dark rounded-xl p-4 neon-border opacity-60 cursor-not-allowed">
                    <p className="text-2xl font-bold gradient-text">{formatTime(st.startTime)}</p>
                    <p className="text-xs text-white/50 mt-1">{st.roomName}</p>
                    <div className="mt-2 pt-2 border-t border-white/10 space-y-0.5">
                      <p className="text-xs text-white/40">Thường: <span className="text-green-400">{formatCurrency(st.priceStandard)}</span></p>
                      <p className="text-xs text-white/40">VIP: <span className="text-gold-400">{formatCurrency(st.priceVip)}</span></p>
                    </div>
                  </div>
                ) : (
                  <Link key={st.id} to={`/book/${st.id}`}
                    className="glass-dark rounded-xl p-4 neon-border hover:neon-border transition-all duration-200 hover:scale-105 hover:shadow-neon group">
                    <p className="text-2xl font-bold gradient-text">{formatTime(st.startTime)}</p>
                    <p className="text-xs text-white/50 mt-1">{st.roomName}</p>
                    <div className="mt-2 pt-2 border-t border-white/10 space-y-0.5">
                      <p className="text-xs text-white/40">Thường: <span className="text-green-400">{formatCurrency(st.priceStandard)}</span></p>
                      <p className="text-xs text-white/40">VIP: <span className="text-gold-400">{formatCurrency(st.priceVip)}</span></p>
                    </div>
                  </Link>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
