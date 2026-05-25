import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMoviesByStatus } from '../api/movie'
import Loading from '../components/Loading'

export default function Home() {
  const [movies, setMovies] = useState([])
  const [tab, setTab] = useState('NOW_SHOWING')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = (t) => {
    setLoading(true); setError('')
    getMoviesByStatus(t).then(r => setMovies(r.data)).catch(() => setError('Không thể tải danh sách phim.')).finally(() => setLoading(false))
  }

  useEffect(() => { load(tab) }, [tab])

  return (
    <div className="relative min-h-screen">
      <div className="stars" aria-hidden="true" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold gradient-text mb-3">🎬 Rạp Chiếu Phim</h1>
          <p className="text-white/50 text-lg">Đặt vé nhanh chóng · Ghế tốt nhất · Trải nghiệm đỉnh cao</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 justify-center">
          {[{key:'NOW_SHOWING',label:'🎥 Đang chiếu'},{key:'COMING_SOON',label:'⏳ Sắp chiếu'}].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${tab === t.key ? 'btn-primary shadow-neon' : 'glass text-white/60 hover:text-white hover:bg-white/10'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? <Loading /> : error ? (
          <div className="text-center py-16">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => load(tab)} className="btn-primary px-6 py-2 rounded-lg text-sm">Thử lại</button>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-16 text-white/40">Không có phim nào</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {movies.map(movie => (
              <Link key={movie.id} to={`/movies/${movie.id}`} className="movie-card group block">
                <div className="glass rounded-2xl overflow-hidden neon-border hover:neon-border">
                  <div className="aspect-[2/3] bg-white/5 relative overflow-hidden">
                    {movie.posterUrl ? (
                      <img src={movie.posterUrl} alt={movie.title} loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
                    ) : null}
                    <div className={`absolute inset-0 flex-col items-center justify-center gap-2 text-white/30 ${movie.posterUrl ? 'hidden' : 'flex'}`}>
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
                    </div>
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-xs text-white/80 bg-purple-600/80 px-2 py-0.5 rounded-full">Xem ngay →</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-white/90 group-hover:text-purple-300 truncate text-sm transition-colors">{movie.title}</h3>
                    <p className="text-xs text-white/40 mt-1">
                      {movie.duration != null ? `${movie.duration} phút` : ''}
                      {movie.genreName && ` · ${movie.genreName}`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
