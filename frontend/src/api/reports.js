import { apiRequest } from './client.js';

export const reportsApi = {
  summary: () => apiRequest('/reports/summary'),
  revenue: (year) => apiRequest('/reports/revenue', { query: { year } })
};
