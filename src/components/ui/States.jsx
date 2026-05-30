import Icon from "./Icons";

export function Spinner({ className = "h-6 w-6" }) {
  return (
    <svg className={`animate-spin text-brand-600 ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4z" />
    </svg>
  );
}

export function Loading({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 text-slate-500 dark:text-slate-400 ${className}`}>
      <Spinner className="h-8 w-8" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card animate-pulse p-5">
      <div className="mb-3 h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mb-2 h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mb-4 h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="flex gap-2">
        <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", message, icon: IconCmp = Icon.Inbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
        <IconCmp className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      {message ? <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{message}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900/50 dark:bg-red-950/30">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300">
        <Icon.Alert className="h-6 w-6" />
      </div>
      <p className="max-w-md text-sm font-medium text-red-700 dark:text-red-300">{message}</p>
      {onRetry ? (
        <button onClick={onRetry} className="btn-secondary mt-4">
          Try again
        </button>
      ) : null}
    </div>
  );
}
