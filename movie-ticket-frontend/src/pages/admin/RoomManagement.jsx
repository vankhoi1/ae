import { useState, useEffect } from 'react'
import { getRooms, createRoom, deleteRoom } from '../../api/room'
import Loading from '../../components/Loading'

export default function RoomManagement() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', rows: 5, columns: 8 })
  const [showForm, setShowForm] = useState(false)

  const load = () => { setLoading(true); getRooms().then(r => setRooms(r.data)).catch(console.error).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try { await createRoom(form); setShowForm(false); setForm({ name: '', rows: 5, columns: 8 }); load() }
    catch { alert('Tạo phòng thất bại') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa phòng và tất cả ghế?')) return
    try { await deleteRoom(id); load() } catch { alert('Xóa thất bại') }
  }

  if (loading) return <Loading />

  const inputCls = 'input-dark w-full rounded-xl px-3 py-2 text-sm'
  const labelCls = 'block text-xs font-medium text-white/50 mb-1'

  return (
    <div className="relative min-h-screen">
      <div className="stars" aria-hidden="true" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold gradient-text">🏛 Quản lý phòng chiếu</h1>
          <button onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${showForm ? 'glass text-white/60' : 'btn-primary'}`}>
            {showForm ? 'Hủy' : '+ Thêm phòng'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 mb-6 neon-border">
            <h2 className="font-semibold text-white mb-4">Thêm phòng mới</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className={labelCls}>Tên phòng</label><input name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className={inputCls} /></div>
              <div><label className={labelCls}>Số hàng</label><input type="number" name="rows" value={form.rows} onChange={e => setForm({...form, rows: e.target.value})} required min={1} className={inputCls} /></div>
              <div><label className={labelCls}>Số cột</label><input type="number" name="columns" value={form.columns} onChange={e => setForm({...form, columns: e.target.value})} required min={1} className={inputCls} /></div>
            </div>
            <p className="text-xs text-white/30 mt-3">Tổng ghế sẽ tạo: {form.rows * form.columns} ghế</p>
            <button type="submit" className="btn-primary mt-4 px-6 py-2.5 rounded-xl text-sm font-medium">Tạo phòng</button>
          </form>
        )}

        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-white/40 text-xs uppercase">
                <th className="text-left p-3">Tên phòng</th>
                <th className="text-left p-3">Sơ đồ</th>
                <th className="text-left p-3">Tổng ghế</th>
                <th className="text-right p-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rooms.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-white/30">Chưa có phòng nào</td></tr>}
              {rooms.map(r => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-medium text-white">{r.name}</td>
                  <td className="p-3 text-white/50">{r.rowsCount} hàng × {r.columnsCount} cột</td>
                  <td className="p-3">
                    <span className="bg-purple-500/15 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full text-xs">
                      {r.rowsCount * r.columnsCount} ghế
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-300 text-xs">Xóa</button>
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
