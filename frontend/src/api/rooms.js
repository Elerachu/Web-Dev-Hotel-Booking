import { apiRequest } from './client.js';

export const roomsApi = {
  // status: 'available' | 'occupied' | 'maintenance' | undefined (all rooms)
  list: (status) => apiRequest('/rooms', { query: { status } }),
  create: (room) => apiRequest('/rooms', { method: 'POST', body: room }),
  update: (id, room) => apiRequest(`/rooms/${id}`, { method: 'PUT', body: room }),
  remove: (id) => apiRequest(`/rooms/${id}`, { method: 'DELETE' })
};
