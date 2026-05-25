import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerApi } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { const res = await registerApi(form); login(res.data.token); navigate('/') }
    catch (err) { setError(err.response?.data?.error || 'Đăng ký thất bại') }
    finally { setLoading(false) }
  }

  const fields = [
    { name: 'name', label: 'Họ tên', type: 'text', placeholder: 'Nguyễn Văn A' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
    { name: 'password', label: 'Mật khẩu', type: 'password', placeholder: '••••••••', minLength: 6 },
    { name: 'phone', label: 'Số điện thoại', type: 'text', placeholder: '0901234567' },
  ]

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4">
      <div className="stars" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎟</div>
          <h2 className="text-3xl font-extrabold gradient-text">Tạo tài khoản</h2>
          <p className="text-white/40 mt-1 text-sm">Tham gia để trải nghiệm đặt vé đỉnh cao</p>
        </div>
        <div className="glass rounded-2xl p-8 neon-border">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(f => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-white/60 mb-1.5">{f.label}</label>
                <input type={f.type} name={f.name} value={form[f.name]}
                  onChange={e => setForm({...form, [e.target.name]: e.target.value})}
                  required={f.name !== 'phone'} minLength={f.minLength}
                  className="input-dark w-full rounded-xl px-4 py-3 text-sm" placeholder={f.placeholder} />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </button>
          </form>
          <p className="text-center text-sm text-white/40 mt-5">
            Đã có tài khoản? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
