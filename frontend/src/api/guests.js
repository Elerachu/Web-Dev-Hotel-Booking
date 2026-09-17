import { apiRequest } from './client.js';

export const guestsApi = {
  list: () => apiRequest('/guests'),
  create: (guest) => apiRequest('/guests', { method: 'POST', body: guest }),
  update: (id, guest) => apiRequest(`/guests/${id}`, { method: 'PUT', body: guest }),
  remove: (id) => apiRequest(`/guests/${id}`, { method: 'DELETE' })
};
