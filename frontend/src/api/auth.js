import { apiRequest } from './client.js';

export const authApi = {
  status: () => apiRequest('/auth/status'),
  login: (email, password) => apiRequest('/auth/login', { method: 'POST', body: { email, password } }),
  // First admin (no token yet) gets { token, admin }; later admins get { message, admin }
  signup: (admin) => apiRequest('/auth/signup', { method: 'POST', body: admin }),
  me: () => apiRequest('/auth/me'),
  uploadPhoto: (file) => {
    const form = new FormData();
    form.append('photo', file); // field name must match upload.single('photo') in the backend
    return apiRequest('/auth/me/photo', { method: 'POST', body: form });
  },
  removePhoto: () => apiRequest('/auth/me/photo', { method: 'DELETE' })
};
