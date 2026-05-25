import api from './axios'

export const createBooking = (data) => api.post('/bookings', data)
export const confirmBooking = (id, paymentMethod) => api.post(`/bookings/${id}/confirm`, null, { params: { paymentMethod } })
export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel`)
export const releaseBooking = (id) => api.post(`/bookings/${id}/release`)
export const getMyBookings = () => api.get('/bookings/my')
export const getBooking = (id) => api.get(`/bookings/${id}`)
