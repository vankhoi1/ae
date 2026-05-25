import api from './axios'

export const getMovies = () => api.get('/movies')
export const getMovie = (id) => api.get(`/movies/${id}`)
export const getMoviesByStatus = (status) => api.get(`/movies/status/${status}`)
export const createMovie = (data) => api.post('/movies', data)
export const updateMovie = (id, data) => api.put(`/movies/${id}`, data)
export const deleteMovie = (id) => api.delete(`/movies/${id}`)
