import { Link } from "react-router-dom";
import Icon from "../ui/Icons";
import Pill from "../ui/Pill";

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function WorkerCard({ worker, onShortlist, shortlisted }) {
  return (
    <div className="card card-hover flex flex-col p-5">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 shrink-0">
          {worker.photoBase64 ? (
            <img
              src={`data:${worker.photoMimeType || "image/jpeg"};base64,${worker.photoBase64}`}
              alt={worker.fullName}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
              {initials(worker.fullName) || "W"}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
              {worker.fullName}
            </h3>
            {worker.verificationStatus === "VERIFIED" && (
              <svg viewBox="0 0 20 20" fill="#D97706" className="h-4 w-4 shrink-0" aria-label="Verified worker">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {worker.headline || worker.role}
          </p>
        </div>
        {worker.isOpenToWork ? <Pill tone="green">Open to work</Pill> : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Icon.MapPin className="h-4 w-4" /> {worker.area}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Icon.Clock className="h-4 w-4" /> {worker.shift}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Icon.Star className="h-4 w-4" /> {worker.experience}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Icon.Wallet className="h-4 w-4" /> {worker.salaryPreference}
        </span>
      </div>

      {worker.skills?.length ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {worker.skills.slice(0, 4).map((skill) => (
            <Pill key={skill} tone="brand">
              {skill}
            </Pill>
          ))}
          {worker.skills.length > 4 ? <Pill tone="slate">+{worker.skills.length - 4}</Pill> : null}
        </div>
      ) : null}

      <div className="mt-4 flex gap-2">
        <Link
          to={`/workers/${worker.id}`}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-600 dark:hover:text-brand-300"
        >
          View profile
        </Link>
        {onShortlist ? (
          <button
            onClick={() => onShortlist(worker.id)}
            disabled={shortlisted}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              shortlisted
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                : "bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300 dark:hover:bg-brand-900/50"
            }`}
          >
            {shortlisted ? "✓ Shortlisted" : "Shortlist"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
