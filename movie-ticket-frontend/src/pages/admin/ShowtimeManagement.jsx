import { useState, useEffect } from 'react'
import { getAllShowtimes, createShowtime, updateShowtime, deleteShowtime } from '../../api/showtime'
import { getMovies } from '../../api/movie'
import { getRooms } from '../../api/room'
import Loading from '../../components/Loading'

const pad = (n) => String(n).padStart(2, '0')
const toInputDT = (val) => {
  if (!val) return ''
  const d = new Date(val)
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
const fmtTime = (val) => val ? new Date(val).toLocaleTimeString('vi-VN', {hour:'2-digit',minute:'2-digit'}) : '-'
const fmtDate = (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '-'
const fmtPrice = (n) => Number(n).toLocaleString('vi-VN')

const SUGGESTED_TIMES = ['08:00','09:30','11:00','13:00','14:30','16:00','17:30','19:00','20:30','22:00']

export default function ShowtimeManagement() {
  const [showtimes, setShowtimes] = useState([])
  const [movies, setMovies] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMovieId, setSelectedMovieId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [batch, setBatch] = useState({ roomId: '', date: '', times: [], customTime: '', priceStandard: 85000, priceVip: 130000 })
  const [editId, setEditId] = useState(null)
  const [editRow, setEditRow] = useState({})

  const loadData = async () => {
    setLoading(true)
    try {
      const [st, mv, rm] = await Promise.all([getAllShowtimes(), getMovies(), getRooms()])
      setShowtimes(st.data)
      setMovies(mv.data)
      setRooms(rm.data)
      setBatch(b => ({ ...b, roomId: b.roomId || rm.data[0]?.id || '' }))
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const calcEnd = (dateStr, timeStr, movieId) => {
    const movie = movies.find(m => m.id === Number(movieId))
    if (!dateStr || !timeStr || !movie?.duration) return ''
    const start = new Date(`${dateStr}T${timeStr}`)
    const end = new Date(start.getTime() + (movie.duration + 15) * 60000)
    return toInputDT(end)
  }

  // Kiểm tra giờ mới có overlap với suất chiếu nào trong phòng+ngày không
  const isTimeConflict = (roomId, date, newTimeStr, newMovieId) => {
    if (!roomId || !date || !newTimeStr) return false
    const newStart = new Date(`${date}T${newTimeStr}`)
    const newEnd = new Date(newStart.getTime() + ((movies.find(m => m.id === Number(newMovieId))?.duration || 120) + 15) * 60000)

    return showtimes.some(s => {
      if (String(s.roomId) !== String(roomId)) return false
      if (!s.startTime?.startsWith(date)) return false
      const sStart = new Date(s.startTime)
      const sEnd = new Date(s.endTime)
      // overlap nếu khoảng thời gian giao nhau
      return newStart < sEnd && newEnd > sStart
    })
  }

  // Lấy các giờ đã bị chiếm theo phòng + ngày (tất cả phim)
  const getOccupiedTimes = (roomId, date) => {
    if (!roomId || !date) return []
    return showtimes
      .filter(s => String(s.roomId) === String(roomId) && s.startTime?.startsWith(date))
      .map(s => {
        const d = new Date(s.startTime)
        return `${pad(d.getHours())}:${pad(d.getMinutes())}`
      })
  }

  // Kiểm tra 1 giờ gợi ý có conflict không
  const isSuggestedTimeConflict = (t) => {
    return isTimeConflict(batch.roomId, batch.date, t, selectedMovieId)
  }

  const occupiedTimes = getOccupiedTimes(batch.roomId, batch.date)

  const toggleTime = (t) => {
    if (isSuggestedTimeConflict(t)) return
    // Check conflict với các giờ đã chọn trong batch
    const conflictWithBatch = batch.times.some(existing => {
      const existStart = new Date(`${batch.date}T${existing}`)
      const existEnd = new Date(existStart.getTime() + ((movies.find(m => m.id === Number(selectedMovieId))?.duration || 120) + 15) * 60000)
      const newStart = new Date(`${batch.date}T${t}`)
      const newEnd = new Date(newStart.getTime() + ((movies.find(m => m.id === Number(selectedMovieId))?.duration || 120) + 15) * 60000)
      return newStart < existEnd && newEnd > existStart
    })
    if (conflictWithBatch) return alert(`Giờ ${t} bị trùng với giờ đã chọn trong danh sách`)
    setBatch(b => ({
      ...b,
      times: b.times.includes(t) ? b.times.filter(x => x !== t) : [...b.times, t]
    }))
  }

  const addCustomTime = () => {
    const t = batch.customTime
    if (!t) return
    if (isTimeConflict(batch.roomId, batch.date, t, selectedMovieId)) {
      return alert(`Giờ ${t} bị trùng với suất chiếu đang có trong phòng này`)
    }
    // Check conflict với batch hiện tại
    const dur = (movies.find(m => m.id === Number(selectedMovieId))?.duration || 120) + 15
    const conflictWithBatch = batch.times.some(existing => {
      const existStart = new Date(`${batch.date}T${existing}`)
      const existEnd = new Date(existStart.getTime() + dur * 60000)
      const newStart = new Date(`${batch.date}T${t}`)
      const newEnd = new Date(newStart.getTime() + dur * 60000)
      return newStart < existEnd && newEnd > existStart
    })
    if (conflictWithBatch) return alert(`Giờ ${t} bị trùng với giờ đã chọn trong danh sách`)
    if (batch.times.includes(t)) return
    setBatch(b => ({ ...b, times: [...b.times, t], customTime: '' }))
  }

  const handleBatchSubmit = async (e) => {
    e.preventDefault()
    if (batch.times.length === 0) return alert('Chọn ít nhất 1 khung giờ')
    // Kiểm tra trùng lần cuối
    const conflicts = batch.times.filter(t => isTimeConflict(batch.roomId, batch.date, t, selectedMovieId))
    if (conflicts.length > 0) return alert(`Các giờ sau bị trùng lịch phòng: ${conflicts.join(', ')}`)
    try {
      await Promise.all(batch.times.map(t => {
        const startTime = `${batch.date}T${t}`
        const endTime = calcEnd(batch.date, t, selectedMovieId)
        return createShowtime({
          movieId: Number(selectedMovieId),
          roomId: Number(batch.roomId),
          date: batch.date,
          startTime,
          endTime: endTime || startTime,
          priceStandard: Number(batch.priceStandard),
          priceVip: Number(batch.priceVip),
        })
      }))
      setShowAddForm(false)
      setBatch(b => ({ ...b, times: [], date: '', customTime: '' }))
      loadData()
    } catch { alert('Tạo suất chiếu thất bại') }
  }

  const startEdit = (st) => {
    setEditId(st.id)
    setEditRow({ roomId: st.roomId, startTime: toInputDT(st.startTime), endTime: toInputDT(st.endTime), priceStandard: st.priceStandard, priceVip: st.priceVip })
  }

  const saveEdit = async (id) => {
    try {
      const date = editRow.startTime.split('T')[0]
      await updateShowtime(id, { ...editRow, movieId: Number(selectedMovieId), roomId: Number(editRow.roomId), date, priceStandard: Number(editRow.priceStandard), priceVip: Number(editRow.priceVip) })
      setEditId(null); loadData()
    } catch { alert('Cập nhật thất bại') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa suất chiếu này?')) return
    try { await deleteShowtime(id); loadData() } catch { alert('Xóa thất bại') }
  }

  const movieShowtimes = (mid) => showtimes.filter(s => s.movieId === mid).sort((a,b) => new Date(a.startTime)-new Date(b.startTime))
  const selectedMovie = movies.find(m => m.id === selectedMovieId)

  if (loading) return <Loading />

  return (
    <div className="relative min-h-screen">
      <div className="stars" aria-hidden="true" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold gradient-text mb-6">🎟 Quản lý suất chiếu</h1>
        <div className="flex gap-6">

          {/* Cột trái */}
          <div className="w-60 shrink-0 space-y-2">
            <p className="text-xs font-semibold text-white/40 uppercase mb-2">Chọn phim</p>
            {movies.map(m => {
              const cnt = movieShowtimes(m.id).length
              const active = selectedMovieId === m.id
              return (
                <button key={m.id} onClick={() => { setSelectedMovieId(m.id); setShowAddForm(false); setEditId(null) }}
                  className={`w-full text-left px-3 py-3 rounded-xl border text-sm transition-all ${active ? 'btn-primary border-transparent shadow' : 'glass text-white/70 hover:text-white border-white/10'}`}>
                  <div className="font-medium leading-snug">{m.title}</div>
                  <div className={`text-xs mt-0.5 ${active ? 'text-white/70' : 'text-white/30'}`}>{m.duration} phút · {cnt} suất</div>
                </button>
              )
            })}
          </div>

          {/* Cột phải */}
          <div className="flex-1 min-w-0">
            {!selectedMovieId ? (
              <div className="glass rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center h-64 text-white/30">
                ← Chọn phim để quản lý suất chiếu
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedMovie?.title}</h2>
                    <p className="text-sm text-white/40">{selectedMovie?.duration} phút · {movieShowtimes(selectedMovieId).length} suất chiếu</p>
                  </div>
                  <button onClick={() => { setShowAddForm(v => !v); setEditId(null) }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${showAddForm ? 'glass text-white/60' : 'btn-primary'}`}>
                    {showAddForm ? 'Hủy' : '+ Thêm suất chiếu'}
                  </button>
                </div>

                {/* Form batch */}
                {showAddForm && (
                  <form onSubmit={handleBatchSubmit} className="glass neon-border rounded-2xl p-5 mb-5 space-y-4">
                    <p className="font-semibold text-white text-sm">Thêm suất chiếu cho <span className="gradient-text">{selectedMovie?.title}</span></p>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-white/50 mb-1">Phòng chiếu</label>
                        <select value={batch.roomId} onChange={e => setBatch({...batch, roomId: e.target.value, times: []})} required className="input-dark w-full rounded-xl px-3 py-2 text-sm">
                          {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/50 mb-1">Ngày chiếu</label>
                        <input type="date" value={batch.date} onChange={e => setBatch({...batch, date: e.target.value, times: []})} required className="input-dark w-full rounded-xl px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/50 mb-1">Giá thường (đ)</label>
                        <input type="number" value={batch.priceStandard} onChange={e => setBatch({...batch, priceStandard: e.target.value})} required min="0" className="input-dark w-full rounded-xl px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/50 mb-1">Giá VIP (đ)</label>
                        <input type="number" value={batch.priceVip} onChange={e => setBatch({...batch, priceVip: e.target.value})} required min="0" className="input-dark w-full rounded-xl px-3 py-2 text-sm" />
                      </div>
                    </div>

                    {/* Khung giờ */}
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-2">
                        Khung giờ có sẵn
                        {batch.roomId && batch.date && (() => {
                          const cnt = SUGGESTED_TIMES.filter(t => isSuggestedTimeConflict(t)).length
                          return cnt > 0 ? <span className="text-red-400 ml-2">({cnt} giờ bị trùng lịch)</span> : null
                        })()}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTED_TIMES.map(t => {
                          const occupied = isSuggestedTimeConflict(t)
                          const dur = (movies.find(m => m.id === Number(selectedMovieId))?.duration || 120) + 15
                          const conflictBatch = !occupied && batch.times.some(existing => {
                            const existStart = new Date(`${batch.date}T${existing}`)
                            const existEnd = new Date(existStart.getTime() + dur * 60000)
                            const newStart = new Date(`${batch.date}T${t}`)
                            const newEnd = new Date(newStart.getTime() + dur * 60000)
                            return newStart < existEnd && newEnd > existStart
                          })
                          const selected = batch.times.includes(t)
                          const blocked = occupied || (conflictBatch && !selected)
                          const endT = batch.date ? calcEnd(batch.date, t, selectedMovieId) : ''
                          const endLabel = endT ? `→${fmtTime(endT)}` : ''
                          return (
                            <button key={t} type="button"
                              onClick={() => toggleTime(t)}
                              disabled={blocked}
                              title={occupied ? `Phòng đã có suất lúc ${t}` : conflictBatch ? `Trùng với giờ đã chọn` : ''}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                                ${blocked ? 'bg-red-500/10 text-red-400/50 border border-red-500/20 cursor-not-allowed line-through' : ''}
                                ${selected && !blocked ? 'btn-primary' : ''}
                                ${!selected && !blocked ? 'glass text-white/60 hover:text-white' : ''}
                              `}>
                              {t} {endLabel}
                              {blocked && ' 🔒'}
                            </button>
                          )
                        })}
                      </div>

                      {/* Thêm giờ tùy chỉnh */}
                      <div className="flex gap-2 mt-3 items-center">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-white/40 mb-1">Hoặc nhập giờ tùy chỉnh</label>
                          <input type="time" value={batch.customTime}
                            onChange={e => setBatch({...batch, customTime: e.target.value})}
                            className="input-dark rounded-xl px-3 py-2 text-sm w-full" />
                        </div>
                        <button type="button" onClick={addCustomTime}
                          className="mt-5 glass px-4 py-2 rounded-xl text-sm text-white/70 hover:text-white transition-all">
                          + Thêm
                        </button>
                      </div>

                      {batch.times.length > 0 && (
                        <div className="mt-3 p-3 glass rounded-xl">
                          <p className="text-xs text-purple-400 mb-2">Sẽ tạo {batch.times.length} suất chiếu:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {batch.times.sort().map(t => (
                              <span key={t} className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full text-xs">
                                {t}
                                <button type="button" onClick={() => setBatch(b => ({...b, times: b.times.filter(x => x !== t)}))} className="text-purple-400 hover:text-red-400">×</button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button type="submit" className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium">
                      Tạo {batch.times.length > 0 ? `${batch.times.length} suất chiếu` : 'suất chiếu'}
                    </button>
                  </form>
                )}

                {/* Bảng */}
                <div className="glass rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="border-b border-white/10">
                      <tr className="text-white/40 text-xs uppercase">
                        <th className="text-left p-3">Phòng</th>
                        <th className="text-left p-3">Ngày</th>
                        <th className="text-left p-3">Bắt đầu</th>
                        <th className="text-left p-3">Kết thúc</th>
                        <th className="text-left p-3">Giá thường</th>
                        <th className="text-left p-3">Giá VIP</th>
                        <th className="text-right p-3">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {movieShowtimes(selectedMovieId).length === 0 && (
                        <tr><td colSpan={7} className="p-8 text-center text-white/30">Chưa có suất chiếu nào</td></tr>
                      )}
                      {movieShowtimes(selectedMovieId).map(st => (
                        <tr key={st.id} className={`transition-colors ${editId === st.id ? 'bg-yellow-500/10' : 'hover:bg-white/5'}`}>
                          {editId === st.id ? (
                            <>
                              <td className="p-2">
                                <select value={editRow.roomId} onChange={e => setEditRow({...editRow, roomId: e.target.value})} className="input-dark rounded-lg px-2 py-1 text-xs w-full">
                                  {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                              </td>
                              <td className="p-2 text-white/30 text-xs">{fmtDate(st.startTime)}</td>
                              <td className="p-2"><input type="datetime-local" value={editRow.startTime} onChange={e => setEditRow({...editRow, startTime: e.target.value})} className="input-dark rounded-lg px-2 py-1 text-xs w-36" /></td>
                              <td className="p-2"><input type="datetime-local" value={editRow.endTime} onChange={e => setEditRow({...editRow, endTime: e.target.value})} className="input-dark rounded-lg px-2 py-1 text-xs w-36" /></td>
                              <td className="p-2"><input type="number" value={editRow.priceStandard} onChange={e => setEditRow({...editRow, priceStandard: e.target.value})} className="input-dark rounded-lg px-2 py-1 text-xs w-24" /></td>
                              <td className="p-2"><input type="number" value={editRow.priceVip} onChange={e => setEditRow({...editRow, priceVip: e.target.value})} className="input-dark rounded-lg px-2 py-1 text-xs w-24" /></td>
                              <td className="p-2 text-right space-x-2">
                                <button onClick={() => saveEdit(st.id)} className="text-green-400 hover:text-green-300 text-xs font-medium">Lưu</button>
                                <button onClick={() => setEditId(null)} className="text-white/30 hover:text-white/60 text-xs">Hủy</button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="p-3 font-medium text-white">{st.roomName}</td>
                              <td className="p-3 text-white/50">{fmtDate(st.startTime)}</td>
                              <td className="p-3 text-white/50">{fmtTime(st.startTime)}</td>
                              <td className="p-3 text-white/50">{fmtTime(st.endTime)}</td>
                              <td className="p-3 text-green-400">{fmtPrice(st.priceStandard)}đ</td>
                              <td className="p-3 text-yellow-400">{fmtPrice(st.priceVip)}đ</td>
                              <td className="p-3 text-right space-x-3">
                                <button onClick={() => startEdit(st)} className="text-blue-400 hover:text-blue-300 text-xs">Sửa</button>
                                <button onClick={() => handleDelete(st.id)} className="text-red-400 hover:text-red-300 text-xs">Xóa</button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
