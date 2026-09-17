import Button from './Button.jsx';

export default function FullScreenMessage({ title, message, actionLabel, onAction }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-lagoon-50 p-6">
      <div className="max-w-sm text-center">
        <h1 className="text-xl font-semibold text-ink">{title}</h1>
        {message && <p className="mt-2 text-slate-500">{message}</p>}
        {actionLabel && (
          <Button className="mt-6" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
