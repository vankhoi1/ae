import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as loginApi } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { const res = await loginApi({ email, password }); login(res.data.token); navigate('/') }
    catch (err) { setError(err.response?.data?.error || 'Đăng nhập thất bại') }
    finally { setLoading(false) }
  }

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4">
      <div className="stars" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎬</div>
          <h2 className="text-3xl font-extrabold gradient-text">Chào mừng trở lại</h2>
          <p className="text-white/40 mt-1 text-sm">Đăng nhập để đặt vé ngay</p>
        </div>
        <div className="glass rounded-2xl p-8 neon-border">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="input-dark w-full rounded-xl px-4 py-3 text-sm" placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Mật khẩu</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="input-dark w-full rounded-xl px-4 py-3 text-sm" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
          <p className="text-center text-sm text-white/40 mt-5">
            Chưa có tài khoản? <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
