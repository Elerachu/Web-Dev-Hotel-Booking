import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { NAV_ITEMS } from './navigation.js';

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-lagoon-950/40 lg:hidden ${open ? 'block' : 'hidden'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-68 flex-col bg-lagoon-900 px-4 pt-6 pb-8 transition-transform motion-reduce:transition-none lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
      >
        <div className="flex h-12 items-center justify-between px-3">
          <span className="text-[1.35rem] font-semibold tracking-tight text-white">Hotel admin</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-lagoon-200 outline-none hover:text-white focus-visible:ring-4 focus-visible:ring-lagoon-600 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-10 flex flex-col gap-1.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-xl px-4 py-3 text-[1.05rem] transition-colors outline-none focus-visible:ring-4 focus-visible:ring-lagoon-600 ${
                  isActive
                    ? 'bg-lagoon-50 font-medium text-lagoon-900'
                    : 'text-lagoon-100/80 hover:bg-lagoon-800 hover:text-white'
                }`
              }
            >
              <Icon size={21} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
