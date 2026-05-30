export function TextField({ label, hint, error, id, className = "", ...props }) {
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="label-field">
          {label}
        </label>
      ) : null}
      <input id={id} className="input-field" {...props} />
      {error ? (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextArea({ label, hint, id, className = "", rows = 4, ...props }) {
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="label-field">
          {label}
        </label>
      ) : null}
      <textarea id={id} rows={rows} className="input-field resize-y" {...props} />
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

export function SelectField({ label, id, children, className = "", ...props }) {
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="label-field">
          {label}
        </label>
      ) : null}
      <select id={id} className="input-field" {...props}>
        {children}
      </select>
    </div>
  );
}
