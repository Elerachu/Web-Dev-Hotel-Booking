import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth.js';
import { tokenStore } from '../api/client.js';

const AuthContext = createContext(null);

// status:
//   'checking'    - on page load, asking the backend whether the saved token still works
//   'signed-in'   - admin is available
//   'signed-out'  - show the login page
//   'unreachable' - a token exists but the backend did not answer (server down)
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState('checking');

  const logout = useCallback(() => {
    tokenStore.clear();
    setAdmin(null);
    setStatus('signed-out');
  }, []);

  const loadCurrentAdmin = useCallback(async () => {
    if (!tokenStore.get()) {
      setStatus('signed-out');
      return;
    }
    setStatus('checking');
    try {
      setAdmin(await authApi.me());
      setStatus('signed-in');
    } catch (error) {
      if (error.status === 401) logout();
      else setStatus('unreachable');
    }
  }, [logout]);

  useEffect(() => {
    loadCurrentAdmin();
  }, [loadCurrentAdmin]);

  // api/client.js fires this event whenever the backend rejects the token
  useEffect(() => {
    window.addEventListener('auth:expired', logout);
    return () => window.removeEventListener('auth:expired', logout);
  }, [logout]);

  const startSession = ({ token, admin: loggedInAdmin }) => {
    tokenStore.set(token);
    setAdmin(loggedInAdmin);
    setStatus('signed-in');
  };

  const value = {
    admin,
    status,
    login: async (email, password) => startSession(await authApi.login(email, password)),
    createFirstAdmin: async (details) => startSession(await authApi.signup(details)),
    logout,
    retry: loadCurrentAdmin,
    setAdmin // used after uploading or removing a photo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
