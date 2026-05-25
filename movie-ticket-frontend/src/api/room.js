import api from './axios'

export const getRooms = () => api.get('/rooms')
export const getRoom = (id) => api.get(`/rooms/${id}`)
export const getSeats = (roomId, showtimeId) => api.get(`/rooms/${roomId}/seats`, { params: { showtimeId } })
export const createRoom = (data) => api.post('/rooms', data)
export const deleteRoom = (id) => api.delete(`/rooms/${id}`)
