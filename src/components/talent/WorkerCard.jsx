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

export default function WorkerCard({ worker }) {
  return (
    <div className="card card-hover flex flex-col p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
          {initials(worker.fullName) || "W"}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
            {worker.fullName}
          </h3>
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
    </div>
  );
}
