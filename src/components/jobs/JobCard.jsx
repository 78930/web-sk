import { Link } from "react-router-dom";
import Icon from "../ui/Icons";
import Pill from "../ui/Pill";

export default function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job.id}`} className="card card-hover group flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-brand-600 dark:text-white">
            {job.title}
          </h3>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{job.companyName}</p>
        </div>
        <span className="shrink-0 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
          {job.pay}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
        {job.area ? (
          <span className="inline-flex items-center gap-1.5">
            <Icon.MapPin className="h-4 w-4" /> {job.area}
          </span>
        ) : null}
        {job.shift ? (
          <span className="inline-flex items-center gap-1.5">
            <Icon.Clock className="h-4 w-4" /> {job.shift}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1.5">
          <Icon.Briefcase className="h-4 w-4" /> {job.employmentType}
        </span>
      </div>

      {job.skills?.length ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <Pill key={skill} tone="slate">
              {skill}
            </Pill>
          ))}
          {job.skills.length > 4 ? <Pill tone="slate">+{job.skills.length - 4}</Pill> : null}
        </div>
      ) : null}

      <div className="mt-5 flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400">
        View details
        <Icon.ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
