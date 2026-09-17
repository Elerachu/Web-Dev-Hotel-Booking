import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import { titleForPath } from './navigation.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

// Frame around every page after login
export default function AppLayout() {
  const { pathname } = useLocation();
  const title = titleForPath(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  usePageMeta(title, '/favicon.svg'); // dashboard favicon placeholder

  // close the mobile menu after navigating
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className="min-h-full lg:grid lg:grid-cols-[17rem_1fr]">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-col">
        <Topbar title={title} onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1 px-5 py-7 sm:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
