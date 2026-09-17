import { LoaderCircle } from 'lucide-react';

const VARIANTS = {

  primary: 'bg-ink text-white hover:bg-slate-800 disabled:bg-slate-400',
  // plain text button used for "Cancel"
  ghost: 'text-slate-500 hover:text-ink hover:bg-slate-100 disabled:text-slate-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300'
};

export default function Button({
  variant = 'primary',
  loading = false,
  className = '',
  children,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors outline-none focus-visible:ring-4 focus-visible:ring-lagoon-200 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && <LoaderCircle size={16} className="motion-safe:animate-spin" />}
      {children}
    </button>
  );
}
