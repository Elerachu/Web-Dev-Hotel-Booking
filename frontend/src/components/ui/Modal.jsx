import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Centered popup. Closes on Escape, on the X, or by clicking the dimmed background.
export default function Modal({ open, title, onClose, children, width = 'max-w-lg' }) {
  const panelRef = useRef(null);

  // Keep the latest onClose in a ref so the effect below runs only when the popup opens
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);

    // stop the page behind from scrolling, and put the cursor in the first field
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const firstField = panelRef.current?.querySelector('input, select, textarea, button[data-autofocus]');
    firstField?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-lagoon-950/45 p-4 backdrop-blur-[2px] sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`my-8 w-full ${width} rounded-2xl bg-white p-6 shadow-2xl shadow-lagoon-950/20 motion-safe:animate-[modal-in_160ms_ease-out] sm:p-7`}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id="modal-title" className="text-xl font-semibold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-slate-400 transition-colors outline-none hover:bg-slate-100 hover:text-ink focus-visible:ring-4 focus-visible:ring-lagoon-200"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

// Right-aligned "Cancel / Save" row at the bottom of every form popup
export function ModalActions({ children }) {
  return <div className="mt-7 flex items-center justify-end gap-3">{children}</div>;
}
