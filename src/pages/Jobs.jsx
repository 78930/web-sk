import { useCallback, useEffect, useState } from "react";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import JobCard from "../components/jobs/JobCard";
import { TextField } from "../components/ui/Field";
import { SkeletonCard, EmptyState, ErrorState } from "../components/ui/States";
import { listJobs } from "../services/jobs";

const EMPTY = { q: "", area: "", role: "", skill: "", shift: "" };

export default function Jobs() {
  const [filters, setFilters] = useState(EMPTY);
  const [applied, setApplied] = useState(EMPTY);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback((params) => {
    setLoading(true);
    setError(null);
    listJobs(params)
      .then(setJobs)
      .catch((err) => setError(err.message || "Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(applied);
  }, [applied, load]);

  const onSubmit = (e) => {
    e.preventDefault();
    setApplied(filters);
  };

  const reset = () => {
    setFilters(EMPTY);
    setApplied(EMPTY);
  };

  const set = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  return (
    <>
      <Seo title="Factory jobs" path="/jobs" description="Browse open factory jobs by area, shift, role and skill on Sketu." />

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container-page py-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Find factory jobs
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Search live openings across factories. Filter by what matters to you.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <div className="relative lg:col-span-2">
              <Icon.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={filters.q}
                onChange={set("q")}
                placeholder="Search title or keyword"
                className="input-field pl-9"
                aria-label="Search jobs"
              />
            </div>
            <TextField placeholder="Area" value={filters.area} onChange={set("area")} aria-label="Area" />
            <TextField placeholder="Role" value={filters.role} onChange={set("role")} aria-label="Role" />
            <TextField placeholder="Skill" value={filters.skill} onChange={set("skill")} aria-label="Skill" />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">
                Search
              </button>
              <button type="button" onClick={reset} className="btn-ghost" aria-label="Reset filters">
                Reset
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="section pt-12">
        <div className="container-page">
          {error ? (
            <ErrorState message={error} onRetry={() => load(applied)} />
          ) : (
            <>
              {!loading ? (
                <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                  {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
                </p>
              ) : null}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                ) : jobs.length === 0 ? (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <EmptyState
                      icon={Icon.Briefcase}
                      title="No jobs match your search"
                      message="Try removing some filters or searching a different area."
                    />
                  </div>
                ) : (
                  jobs.map((job) => <JobCard key={job.id} job={job} />)
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
