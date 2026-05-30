const TONES = {
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  red: "bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-200",
};

export default function Pill({ children, tone = "slate", className = "" }) {
  return <span className={`pill ${TONES[tone] || TONES.slate} ${className}`}>{children}</span>;
}

// Maps application/job status -> tone + label
export function StatusPill({ status }) {
  const map = {
    OPEN: ["green", "Open"],
    PAUSED: ["amber", "Paused"],
    CLOSED: ["slate", "Closed"],
    APPLIED: ["brand", "Applied"],
    SHORTLISTED: ["amber", "Shortlisted"],
    HIRED: ["green", "Hired"],
    REJECTED: ["red", "Not selected"],
  };
  const [tone, label] = map[status] || ["slate", status];
  return <Pill tone={tone}>{label}</Pill>;
}
