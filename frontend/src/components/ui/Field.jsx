// Label + input pairs used in every form popup.

const controlClasses =
  'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-[15px] text-ink placeholder:text-slate-400 outline-none transition-colors focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-100 disabled:bg-slate-50';

export function Field({ label, htmlFor, hint, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[15px] text-slate-600">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function TextInput({ id, label, hint, className, ...props }) {
  return (
    <Field label={label} htmlFor={id} hint={hint} className={className}>
      <input id={id} className={controlClasses} {...props} />
    </Field>
  );
}

export function SelectInput({ id, label, hint, className, children, ...props }) {
  return (
    <Field label={label} htmlFor={id} hint={hint} className={className}>
      <select id={id} className={controlClasses} {...props}>
        {children}
      </select>
    </Field>
  );
}

export function FormError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
      {message}
    </p>
  );
}
