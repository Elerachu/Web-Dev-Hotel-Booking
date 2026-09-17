export default function StatCard({ label, value, progress, footnote }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
      <p className="text-sm text-slate-500 sm:text-[15px]">{label}</p>
      <p className="tabular mt-1.5 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{value}</p>
      {progress !== undefined && (
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-lagoon-100"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          <div className="h-full rounded-full bg-lagoon-500" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      )}
      {footnote && <p className="mt-2 text-xs text-slate-400">{footnote}</p>}
    </div>
  );
}
