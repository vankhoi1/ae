import { useState } from 'react'
import { getRevenueReport, exportRevenueReport } from '../../api/report'
import Loading from '../../components/Loading'

const fmt = (n) => Number(n).toLocaleString('vi-VN') + 'đ'

export default function RevenueReport() {
  const [from, setFrom] = useState(() => new Date(Date.now() - 30*86400000).toISOString().split('T')[0])
  const [to, setTo] = useState(() => new Date().toISOString().split('T')[0])
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    try { const res = await getRevenueReport(from, to); setData(res.data) }
    catch { alert('Tải báo cáo thất bại') }
    setLoading(false)
  }

  const handleExport = async () => {
    try {
      const res = await exportRevenueReport(from, to)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a'); a.href = url; a.download = 'revenue_report.xlsx'
      document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url)
    } catch { alert('Xuất thất bại') }
  }

  const totalRevenue = data?.reduce((s, r) => s + Number(r.totalRevenue), 0) || 0
  const totalBookings = data?.reduce((s, r) => s + Number(r.totalBookings), 0) || 0
  const totalTickets = data?.reduce((s, r) => s + Number(r.totalTickets), 0) || 0

  return (
    <div className="relative min-h-screen">
      <div className="stars" aria-hidden="true" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold gradient-text mb-6">📊 Báo cáo doanh thu</h1>

        <div className="glass rounded-2xl p-6 mb-6 neon-border">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1">Từ ngày</label>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="input-dark rounded-xl px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1">Đến ngày</label>
              <input type="date" value={to} onChange={e => setTo(e.target.value)} className="input-dark rounded-xl px-3 py-2 text-sm" />
            </div>
            <button onClick={handleSearch} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium">🔍 Tìm kiếm</button>
            {data && <button onClick={handleExport} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all">📥 Xuất Excel</button>}
          </div>
        </div>

        {loading && <Loading />}

        {data && !loading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Tổng doanh thu', value: fmt(totalRevenue), icon: '💰', cls: 'from-purple-500 to-pink-500' },
                { label: 'Tổng đơn đặt',   value: totalBookings,     icon: '🎟', cls: 'from-blue-500 to-cyan-500' },
                { label: 'Tổng vé',         value: totalTickets,      icon: '🎫', cls: 'from-orange-500 to-yellow-500' },
              ].map(c => (
                <div key={c.label} className="glass rounded-2xl p-5 neon-border">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.cls} flex items-center justify-center text-xl mb-3`}>{c.icon}</div>
                  <p className="text-xs text-white/40 mb-1">{c.label}</p>
                  <p className="text-2xl font-extrabold gradient-text">{c.value}</p>
                </div>
              ))}
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10">
                  <tr className="text-white/40 text-xs uppercase">
                    <th className="text-left p-3">Ngày</th>
                    <th className="text-left p-3">Đơn đặt</th>
                    <th className="text-left p-3">Vé</th>
                    <th className="text-right p-3">Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.map(r => (
                    <tr key={r.date} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-medium text-white">{r.date}</td>
                      <td className="p-3 text-white/50">{r.totalBookings}</td>
                      <td className="p-3 text-white/50">{r.totalTickets}</td>
                      <td className="p-3 text-right font-bold gradient-text">{fmt(r.totalRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
