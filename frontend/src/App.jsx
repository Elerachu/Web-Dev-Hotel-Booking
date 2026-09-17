import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import FullScreenMessage from './components/ui/FullScreenMessage.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Guests from './pages/Guests.jsx';
import Rooms from './pages/Rooms.jsx';
import Bookings from './pages/Bookings.jsx';

// The chart library is large, so the Revenue page is downloaded only when someone opens it
const Revenue = lazy(() => import('./pages/Revenue.jsx'));

// Only lets logged-in admins through; everyone else is sent to /login.
function RequireAdmin({ children }) {
  const { status, retry } = useAuth();

  if (status === 'checking') return <FullScreenMessage title="Loading…" />;
  if (status === 'unreachable') {
    return (
      <FullScreenMessage
        title="Can't reach the server"
        message="Check that the backend is running on port 5000, then try again."
        actionLabel="Try again"
        onAction={retry}
      />
    );
  }
  if (status === 'signed-out') return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { status } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={status === 'signed-in' ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        element={
          <RequireAdmin>
            <AppLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="guests" element={<Guests />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="bookings" element={<Bookings />} />
        <Route
          path="revenue"
          element={
            <Suspense fallback={<p className="text-slate-400">Loading…</p>}>
              <Revenue />
            </Suspense>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
