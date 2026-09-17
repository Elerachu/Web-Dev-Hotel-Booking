import { statusLabel } from '../../utils/format.js';

const STYLES = {
  available: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  checked_in: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  maintenance: 'bg-amber-50 text-amber-700 ring-amber-200',
  cancelled: 'bg-red-50 text-red-700 ring-red-200',
  occupied: 'bg-slate-100 text-slate-600 ring-slate-200',
  checked_out: 'bg-slate-100 text-slate-600 ring-slate-200'
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium whitespace-nowrap ring-1 ring-inset ${
        STYLES[status] || STYLES.occupied
      }`}
    >
      {statusLabel(status)}
    </span>
  );
}
