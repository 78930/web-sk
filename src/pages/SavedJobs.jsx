import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import Pill from "../components/ui/Pill";
import { EmptyState } from "../components/ui/States";
import { listSavedJobs, toggleSavedJob } from "../services/savedJobs";

export default function SavedJobs() {
  const [jobs, setJobs] = useState(() => listSavedJobs().map((s) => s.job));

  function handleRemove(job) {
    toggleSavedJob(job);
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
  }

  return (
    <>
      <Seo title="Saved jobs" path="/saved-jobs" />

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container-page py-10">
          <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400">
            <Icon.ArrowRight className="h-4 w-4 rotate-180" /> Back to jobs
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Saved jobs
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Jobs you've bookmarked to review or apply to later.
          </p>
        </div>
      </section>

      <section className="section pt-10">
        <div className="container-page">
          {jobs.length === 0 ? (
            <EmptyState
              icon={Icon.Star}
              title="No saved jobs yet"
              message="Browse jobs and tap the star icon to save interesting roles for later."
              action={<Link to="/jobs" className="btn-primary">Browse jobs</Link>}
            />
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white text-sm font-extrabold shadow-sm">
                        {(job.companyName || "F").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                          {job.title}
                        </h3>
                        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                          {job.companyName}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                          {job.area ? (
                            <span className="inline-flex items-center gap-1">
                              <Icon.MapPin className="h-3.5 w-3.5" /> {job.area}
                            </span>
                          ) : null}
                          {job.shift ? (
                            <span className="inline-flex items-center gap-1">
                              <Icon.Clock className="h-3.5 w-3.5" /> {job.shift}
                            </span>
                          ) : null}
                          <span className="inline-flex items-center gap-1">
                            <Icon.Wallet className="h-3.5 w-3.5" /> {job.pay}
                          </span>
                        </div>
                        {job.skills?.length ? (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {job.skills.slice(0, 4).map((s) => (
                              <Pill key={s} tone="slate">{s}</Pill>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-start">
                      <Link to={`/jobs/${job.id}`} className="btn-primary text-sm">
                        Apply now
                      </Link>
                      <button
                        onClick={() => handleRemove(job)}
                        className="btn-ghost text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                        title="Remove from saved"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
