import Button from './Button.jsx';

// Shared table frame: header row + loading / error / empty states.
// columns: [{ key, label, className }]; rows are rendered by the page via `children`.
export default function DataTable({ columns, loading, error, onRetry, isEmpty, emptyMessage, emptyAction, children }) {
  let stateContent = null;

  if (loading) {
    stateContent = <p className="text-slate-400">Loading…</p>;
  } else if (error) {
    stateContent = (
      <div className="flex flex-col items-center gap-3">
        <p className="text-red-600">{error.message}</p>
        {onRetry && (
          <Button variant="ghost" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  } else if (isEmpty) {
    stateContent = (
      <div className="flex flex-col items-center gap-4">
        <p className="text-slate-500">{emptyMessage}</p>
        {emptyAction}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-[15px]">
        <thead className="bg-lagoon-50/70 text-slate-600">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={`px-6 py-4 font-medium ${column.className || ''}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {stateContent ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-14 text-center">
                {stateContent}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Cell({ children, className = '' }) {
  return <td className={`px-6 py-4 text-ink ${className}`}>{children}</td>;
}

// "Edit  Delete" links at the end of each row
export function RowActions({ onEdit, onDelete, itemName }) {
  const linkBase =
    'rounded px-1 -mx-1 outline-none transition-colors focus-visible:ring-4 focus-visible:ring-lagoon-200';
  return (
    <div className="flex items-center gap-4">
      <button type="button" onClick={onEdit} className={`${linkBase} text-ink hover:text-lagoon-600`} aria-label={`Edit ${itemName}`}>
        Edit
      </button>
      <button type="button" onClick={onDelete} className={`${linkBase} text-red-600 hover:text-red-700`} aria-label={`Delete ${itemName}`}>
        Delete
      </button>
    </div>
  );
}
