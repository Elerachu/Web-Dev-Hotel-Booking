import { Menu } from 'lucide-react';
import AdminMenu from './AdminMenu.jsx';

export default function Topbar({ title, onOpenMenu }) {
  return (
    <header className="sticky top-0 z-20 flex h-[5.9rem] items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 sm:px-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="-ml-1 rounded-lg p-1.5 text-ink outline-none hover:bg-slate-100 focus-visible:ring-4 focus-visible:ring-lagoon-200 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[2rem]">{title}</h1>
      </div>
      <AdminMenu />
    </header>
  );
}
