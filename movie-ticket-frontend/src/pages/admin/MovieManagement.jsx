import { useState, useEffect } from 'react'
import { getMovies, createMovie, updateMovie, deleteMovie } from '../../api/movie'
import { getGenres } from '../../api'
import Loading from '../../components/Loading'

const emptyForm = { title: '', description: '', duration: 120, releaseDate: '', posterUrl: '', trailerUrl: '', genreId: '', status: 'NOW_SHOWING' }

export default function MovieManagement() {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try { const [m, g] = await Promise.all([getMovies(), getGenres()]); setMovies(m.data); setGenres(g.data) }
    catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (form.posterUrl?.startsWith('data:')) return setError('Vui lòng nhập URL ảnh (https://...), không dùng base64.')
    const payload = { ...form, genreId: form.genreId ? Number(form.genreId) : null, duration: Number(form.duration) }
    try {
      editing ? await updateMovie(editing, payload) : await createMovie(payload)
      setShowForm(false); setEditing(null); setForm(emptyForm); load()
    } catch (err) { setError(err.response?.data?.error || 'Thao tác thất bại') }
  }

  const handleEdit = (m) => {
    setForm({ title: m.title, description: m.description||'', duration: m.duration, releaseDate: m.releaseDate||'', posterUrl: m.posterUrl||'', trailerUrl: m.trailerUrl||'', genreId: m.genreId||'', status: m.status })
    setEditing(m.id); setShowForm(true); setError('')
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa phim này?')) return
    try { await deleteMovie(id); load() } catch { setError('Xóa thất bại') }
  }

  const filtered = search ? movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase())) : movies

  if (loading) return <Loading />

  const inputCls = 'input-dark w-full rounded-xl px-3 py-2 text-sm'
  const labelCls = 'block text-xs font-medium text-white/50 mb-1'

  return (
    <div className="relative min-h-screen">
      <div className="stars" aria-hidden="true" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-extrabold gradient-text">🎬 Quản lý phim</h1>
          <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyForm); setError('') }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${showForm ? 'glass text-white/60' : 'btn-primary'}`}>
            {showForm ? 'Hủy' : '+ Thêm phim'}
          </button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-sm">{error}</div>}

        {showForm && (
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 mb-6 neon-border">
            <h2 className="font-semibold text-white mb-4">{editing ? 'Chỉnh sửa phim' : 'Thêm phim mới'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div><label className={labelCls}>Tiêu đề</label><input name="title" value={form.title} onChange={handleChange} required className={inputCls} /></div>
              <div><label className={labelCls}>Thời lượng (phút)</label><input type="number" name="duration" value={form.duration} onChange={handleChange} required min={1} className={inputCls} /></div>
              <div><label className={labelCls}>Ngày phát hành</label><input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Trạng thái</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
                  <option value="NOW_SHOWING">Đang chiếu</option>
                  <option value="COMING_SOON">Sắp chiếu</option>
                </select>
              </div>
              <div><label className={labelCls}>Thể loại</label>
                <select name="genreId" value={form.genreId} onChange={handleChange} className={inputCls}>
                  <option value="">-- Chọn thể loại --</option>
                  {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>URL ảnh poster</label><input name="posterUrl" value={form.posterUrl} onChange={handleChange} className={inputCls} placeholder="https://..." /></div>
              <div><label className={labelCls}>URL trailer</label><input name="trailerUrl" value={form.trailerUrl} onChange={handleChange} className={inputCls} placeholder="https://..." /></div>
              <div className="md:col-span-2 lg:col-span-3"><label className={labelCls}>Mô tả</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputCls} /></div>
            </div>
            {form.posterUrl && !form.posterUrl.startsWith('data:') && (
              <div className="flex items-center gap-4 mt-4 p-3 glass rounded-xl">
                <img src={form.posterUrl} alt="preview" className="w-12 h-16 object-cover rounded-lg" onError={e => e.target.style.display='none'} />
                <p className="text-xs text-white/40 truncate">{form.posterUrl}</p>
              </div>
            )}
            <button type="submit" className="btn-primary mt-4 px-6 py-2.5 rounded-xl text-sm font-medium">{editing ? 'Cập nhật' : 'Tạo phim'}</button>
          </form>
        )}

        <div className="mb-4">
          <input type="text" placeholder="🔍 Tìm kiếm phim..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-dark w-full sm:w-80 rounded-xl px-4 py-2.5 text-sm" />
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-white/40 text-xs uppercase">
                <th className="text-left p-3 w-12">Ảnh</th>
                <th className="text-left p-3">Tiêu đề</th>
                <th className="text-left p-3 hidden sm:table-cell">Thể loại</th>
                <th className="text-left p-3 hidden md:table-cell">Thời lượng</th>
                <th className="text-left p-3">Trạng thái</th>
                <th className="text-right p-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-white/30">{search ? 'Không tìm thấy phim nào' : 'Chưa có phim nào'}</td></tr>
              ) : filtered.map(m => (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3">
                    {m.posterUrl
                      ? <img src={m.posterUrl} alt="" className="w-10 h-14 object-cover rounded-lg" onError={e => e.target.style.display='none'} />
                      : <div className="w-10 h-14 glass rounded-lg flex items-center justify-center text-white/20 text-xs">N/A</div>}
                  </td>
                  <td className="p-3 font-medium text-white">{m.title}</td>
                  <td className="p-3 text-white/50 hidden sm:table-cell">{m.genreName || '—'}</td>
                  <td className="p-3 text-white/50 hidden md:table-cell">{m.duration} phút</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.status === 'NOW_SHOWING' ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'}`}>
                      {m.status === 'NOW_SHOWING' ? 'Đang chiếu' : 'Sắp chiếu'}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-3">
                    <button onClick={() => handleEdit(m)} className="text-blue-400 hover:text-blue-300 text-xs">Sửa</button>
                    <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-300 text-xs">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
