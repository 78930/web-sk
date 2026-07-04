import Icon from "./Icons";

export function Spinner({ className = "h-6 w-6" }) {
  return (
    <svg className={`animate-spin text-brand-600 ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4z" />
    </svg>
  );
}

export function Loading({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 ${className}`}>
      <Spinner className="h-8 w-8" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className="skeleton h-10 w-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded-lg" />
          <div className="skeleton h-3 w-1/2 rounded-lg" />
        </div>
        <div className="skeleton h-6 w-16 rounded-xl shrink-0" />
      </div>
      {/* Meta row */}
      <div className="flex gap-3">
        <div className="skeleton h-3 w-20 rounded-lg" />
        <div className="skeleton h-3 w-16 rounded-lg" />
        <div className="skeleton h-3 w-20 rounded-lg" />
      </div>
      {/* Skill pills */}
      <div className="flex gap-2">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-20 rounded-full" />
        <div className="skeleton h-5 w-14 rounded-full" />
      </div>
      {/* Footer */}
      <div className="skeleton h-4 w-24 rounded-lg" />
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", message, icon: IconCmp = Icon.Inbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-900/40 dark:text-brand-300">
        <IconCmp className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      {message && <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="alert-error rounded-2xl px-6 py-10 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300">
        <Icon.Alert className="h-6 w-6" />
      </div>
      <p className="max-w-md text-sm font-medium">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-4 mx-auto">
          Try again
        </button>
      )}
    </div>
  );
}
