import { Link } from "react-router-dom";
import Icon from "../ui/Icons";
import Pill from "../ui/Pill";

export default function JobCard({ job }) {
  const initial = (job.companyName || "F").charAt(0).toUpperCase();

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="card card-hover group flex flex-col p-5 gap-4"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Company avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white text-sm font-extrabold shadow-sm">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-slate-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
            {job.title}
          </h3>
          <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
            {job.companyName}
          </p>
        </div>
        {/* Pay badge */}
        <span className="shrink-0 rounded-xl bg-accent-50 px-2.5 py-1 text-xs font-bold text-accent-700 dark:bg-accent-900/30 dark:text-accent-300">
          {job.pay}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-500 dark:text-slate-400">
        {job.area ? (
          <span className="inline-flex items-center gap-1.5">
            <Icon.MapPin className="h-3.5 w-3.5 text-slate-400" /> {job.area}
          </span>
        ) : null}
        {job.shift ? (
          <span className="inline-flex items-center gap-1.5">
            <Icon.Clock className="h-3.5 w-3.5 text-slate-400" /> {job.shift}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1.5">
          <Icon.Briefcase className="h-3.5 w-3.5 text-slate-400" /> {job.employmentType}
        </span>
      </div>

      {/* Skills */}
      {job.skills?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <Pill key={skill} tone="slate">{skill}</Pill>
          ))}
          {job.skills.length > 4 ? (
            <Pill tone="slate">+{job.skills.length - 4}</Pill>
          ) : null}
        </div>
      ) : null}

      {/* CTA */}
      <div className="mt-auto flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400">
        View details
        <Icon.ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
