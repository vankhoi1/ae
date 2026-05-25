import api from './axios'

export const getAllShowtimes = () => api.get('/showtimes/all')
export const getShowtimes = (movieId, date) => api.get('/showtimes', { params: { movieId, date } })
export const getShowtime = (id) => api.get(`/showtimes/${id}`)
export const createShowtime = (data) => api.post('/showtimes', data)
export const updateShowtime = (id, data) => api.put(`/showtimes/${id}`, data)
export const deleteShowtime = (id) => api.delete(`/showtimes/${id}`)
