import api from './axios'

export const getRevenueReport = (from, to) => api.get('/reports/revenue', { params: { from, to } })
export const exportRevenueReport = (from, to) => api.get('/reports/revenue/export', { params: { from, to }, responseType: 'blob' })
