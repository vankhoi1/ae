import { useState, useEffect } from 'react'
import Loading from '../../components/Loading'
import api from '../../api/axios'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const load = () => {
    setLoading(true)
    api.get('/admin/users').then(r => setUsers(r.data)).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const toggleRole = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
    if (!confirm(`Đổi role của ${user.email} thành ${newRole}?`)) return
    setUpdatingId(user.id)
    try { await api.put(`/admin/users/${user.id}/role?role=${newRole}`); load() }
    catch { alert('Cập nhật thất bại') }
    setUpdatingId(null)
  }

  const toggleLock = async (user) => {
    const action = user.enabled ? 'khóa' : 'mở khóa'
    if (!confirm(`Xác nhận ${action} tài khoản ${user.email}?`)) return
    setUpdatingId(user.id)
    try { await api.put(`/admin/users/${user.id}/toggle-lock`); load() }
    catch { alert('Cập nhật thất bại') }
    setUpdatingId(null)
  }
  const filtered = search ? users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()) || u.name?.toLowerCase().includes(search.toLowerCase())) : users

  if (loading) return <Loading />

  return (
    <div className="relative min-h-screen">
      <div className="stars" aria-hidden="true" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold gradient-text mb-6">👥 Quản lý người dùng</h1>

        <div className="mb-4">
          <input type="text" placeholder="🔍 Tìm theo tên hoặc email..." value={search}
            onChange={e => setSearch(e.target.value)} className="input-dark w-full sm:w-80 rounded-xl px-4 py-2.5 text-sm" />
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-white/40 text-xs uppercase">
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Tên</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Số điện thoại</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Trạng thái</th>
                <th className="text-right p-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-white/30">Không có người dùng nào</td></tr>}
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 text-white/30 text-xs">#{u.id}</td>
                  <td className="p-3 font-medium text-white">{u.name}</td>
                  <td className="p-3 text-white/60">{u.email}</td>
                  <td className="p-3 text-white/50">{u.phone || '—'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.enabled ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'}`}>
                      {u.enabled ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-3">
                    <button onClick={() => toggleRole(u)} disabled={updatingId === u.id}
                      className="text-xs text-yellow-400 hover:text-yellow-300 disabled:opacity-40 transition-colors">
                      {u.role === 'ADMIN' ? 'Hạ USER' : 'Nâng ADMIN'}
                    </button>
                    <button onClick={() => toggleLock(u)} disabled={updatingId === u.id}
                      className={`text-xs disabled:opacity-40 transition-colors ${u.enabled ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}>
                      {u.enabled ? '🔒 Khóa' : '🔓 Mở khóa'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-white/30 mt-3">Tổng: {filtered.length} người dùng</p>
      </div>
    </div>
  )
}
