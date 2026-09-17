import { apiRequest } from './client.js';

export const bookingsApi = {
  // /details includes guest_name and room_number (the backend JOINs guests and rooms)
  listWithDetails: () => apiRequest('/bookings/details'),
  create: (booking) => apiRequest('/bookings', { method: 'POST', body: booking }),
  update: (id, booking) => apiRequest(`/bookings/${id}`, { method: 'PUT', body: booking }),
  remove: (id) => apiRequest(`/bookings/${id}`, { method: 'DELETE' })
};
