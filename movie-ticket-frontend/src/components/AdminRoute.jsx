import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="text-center py-20 text-gray-500">Đang tải...</div>
  if (!user || user.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}
