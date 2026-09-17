import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import UploadPhotoModal from './UploadPhotoModal.jsx';
import AddAdminModal from './AddAdminModal.jsx';

// The round admin icon in the top-right corner and its dropdown menu.
export default function AdminMenu() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState(null); // 'photo' | 'admin' | null
  const wrapperRef = useRef(null);

  // close when clicking anywhere else or pressing Escape
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!admin) return null;

  const openDialog = (name) => {
    setOpen(false);
    setDialog(name);
  };

  const itemClasses =
    'block w-full px-5 py-2.5 text-left text-[15px] outline-none transition-colors hover:bg-lagoon-50 focus-visible:bg-lagoon-50';

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="rounded-full outline-none focus-visible:ring-4 focus-visible:ring-lagoon-200"
      >
        <Avatar name={admin.name} photoUrl={admin.photo_url} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl shadow-slate-900/10"
        >
          <div className="border-b border-slate-100 px-5 pt-2.5 pb-3">
            <p className="truncate text-[15px] font-semibold text-ink">{admin.name}</p>
            <p className="truncate text-sm text-slate-500">{admin.email}</p>
          </div>
          <div className="py-1">
            <button type="button" role="menuitem" className={`${itemClasses} text-slate-700`} onClick={() => openDialog('photo')}>
              Upload photo
            </button>
            <button type="button" role="menuitem" className={`${itemClasses} text-slate-700`} onClick={() => openDialog('admin')}>
              Add admin
            </button>
            <button
              type="button"
              role="menuitem"
              className={`${itemClasses} text-red-600 hover:bg-red-50 focus-visible:bg-red-50`}
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
            >
              Log out
            </button>
          </div>
        </div>
      )}

      <UploadPhotoModal open={dialog === 'photo'} onClose={() => setDialog(null)} />
      <AddAdminModal open={dialog === 'admin'} onClose={() => setDialog(null)} />
    </div>
  );
}
