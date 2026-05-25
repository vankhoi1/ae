import api from './axios'

// Auth
export const login = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/register', data)

// Movies
export const getMovies = () => api.get('/movies')
export const getMoviesByStatus = (status) => api.get(`/movies/status/${status}`)
export const getMovieById = (id) => api.get(`/movies/${id}`)
export const createMovie = (data) => api.post('/movies', data)
export const updateMovie = (id, data) => api.put(`/movies/${id}`, data)
export const deleteMovie = (id) => api.delete(`/movies/${id}`)

// Genres
export const getGenres = () => api.get('/genres')

// Showtimes
export const getShowtimes = (movieId, date) => api.get('/showtimes', { params: { movieId, date } })
export const getShowtimeById = (id) => api.get(`/showtimes/${id}`)
export const createShowtime = (data) => api.post('/showtimes', data)
export const updateShowtime = (id, data) => api.put(`/showtimes/${id}`, data)
export const deleteShowtime = (id) => api.delete(`/showtimes/${id}`)

// Rooms
export const getRooms = () => api.get('/rooms')
export const getRoomById = (id) => api.get(`/rooms/${id}`)
export const getSeats = (roomId, showtimeId) => api.get(`/rooms/${roomId}/seats`, { params: { showtimeId } })
export const createRoom = (data) => api.post('/rooms', data)
export const deleteRoom = (id) => api.delete(`/rooms/${id}`)

// Bookings
export const createBooking = (data) => api.post('/bookings', data)
export const confirmBooking = (id, paymentMethod) => api.post(`/bookings/${id}/confirm`, null, { params: { paymentMethod } })
export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel`)
export const getMyBookings = () => api.get('/bookings/my')
export const getBookingById = (id) => api.get(`/bookings/${id}`)

// Reports
export const getRevenueReport = (startDate, endDate) => api.get('/reports/revenue', { params: { startDate, endDate } })
export const getMovieReport = () => api.get('/reports/movies')
