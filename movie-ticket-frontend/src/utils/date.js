export function formatTime(dateStr) {
  if (!dateStr) return '--'
  const d = new Date(dateStr)
  if (isNaN(d)) return '--'
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(dateStr) {
  if (!dateStr) return '--'
  const d = new Date(dateStr)
  if (isNaN(d)) return '--'
  return d.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '--'
  return Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

export function formatDuration(minutes) {
  if (minutes == null || isNaN(minutes)) return '--'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} phút`
  if (m === 0) return `${h}h`
  return `${h}h${m}`
}
