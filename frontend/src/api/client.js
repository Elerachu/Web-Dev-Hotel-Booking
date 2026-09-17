// Every call to the backend goes through apiRequest().
// It adds the login token, turns JSON in/out, and converts failures into ApiError
// so pages can simply show error.message.

const API_BASE = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'hotel_admin_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY)
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status; // HTTP status code, or 0 when the server could not be reached
  }
}

export async function apiRequest(path, { method = 'GET', body, query } = {}) {
  let url = `${API_BASE}/api${path}`;
  if (query) {
    const params = new URLSearchParams(
      Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== '')
    );
    if (params.toString()) url += `?${params}`;
  }

  const headers = {};
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (body instanceof FormData) {
    payload = body; // the browser sets the multipart Content-Type itself
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let response;
  try {
    // no-store: always ask the server, so a list never shows stale data after an edit
    response = await fetch(url, { method, headers, body: payload, cache: 'no-store' });
  } catch {
    throw new ApiError('Cannot reach the server. Check that the backend is running.', 0);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // A token that stopped working (expired, or signed with a different JWT_SECRET) logs the admin out.
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event('auth:expired'));
    }
    const fallback =
      response.status >= 500
        ? 'The server had a problem. Check that the backend and database are running.'
        : `Request failed (${response.status})`;
    throw new ApiError(data?.message || fallback, response.status);
  }

  return data;
}

// Turns a stored path like /uploads/admins/x.png into a URL the <img> tag can load.
export function assetUrl(path) {
  return path ? `${API_BASE}${path}` : null;
}
