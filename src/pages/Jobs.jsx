import { useEffect, useState } from "react";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import JobCard from "../components/jobs/JobCard";
import { SkeletonCard, EmptyState, ErrorState } from "../components/ui/States";
import { listJobs } from "../services/jobs";

const EMPTY = { q: "", area: "", role: "", skill: "", shift: "" };

function FilterInput({ icon: IconCmp, placeholder, value, onChange, ariaLabel }) {
  return (
    <div className="input-icon-wrap">
      <IconCmp className="input-icon" />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
        aria-label={ariaLabel || placeholder}
      />
    </div>
  );
}

export default function Jobs() {
  const [filters, setFilters] = useState(EMPTY);
  // queryPage bundles applied filters + page so a single setState avoids double-fetches
  const [queryPage, setQueryPage] = useState({ applied: EMPTY, page: 1 });

  const [jobs,        setJobs]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore,     setHasMore]     = useState(false);
  const [error,       setError]       = useState(null);

  useEffect(() => {
    const { applied, page } = queryPage;
    let cancelled = false;

    if (page === 1) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    listJobs({ ...applied, page })
      .then(({ items, pagination }) => {
        if (cancelled) return;
        if (page === 1) {
          setJobs(items);
        } else {
          setJobs((prev) => [...prev, ...items]);
        }
        setHasMore(pagination?.hasMore ?? false);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load jobs");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      });

    return () => { cancelled = true; };
  }, [queryPage]);

  const onSubmit = (e) => {
    e.preventDefault();
    setQueryPage({ applied: filters, page: 1 });
  };
  const reset = () => {
    setFilters(EMPTY);
    setQueryPage({ applied: EMPTY, page: 1 });
  };
  const set       = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));
  const loadMore  = () => setQueryPage((q) => ({ ...q, page: q.page + 1 }));
  const isDirty   = Object.values(filters).some(Boolean);
  const { applied } = queryPage;
  const isFiltered  = Object.values(applied).some(Boolean);

  return (
    <>
      <Seo title="Factory jobs" path="/jobs" description="Browse open factory jobs by area, shift, role and skill on Sketu." />

      {/* Search bar */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container-page py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Find factory jobs
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Search live openings across factories. Filter by what matters to you.
              </p>
            </div>
            {!loading && (
              <span className="hidden shrink-0 text-sm text-slate-500 dark:text-slate-400 sm:block">
                <span className="font-bold text-slate-900 dark:text-white">{jobs.length}</span>{" "}
                {jobs.length === 1 ? "job" : "jobs"} found
              </span>
            )}
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <FilterInput
              icon={Icon.Search}
              placeholder="Search by title, keyword, company…"
              value={filters.q}
              onChange={set("q")}
              ariaLabel="Search jobs"
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <FilterInput icon={Icon.MapPin}   placeholder="Area"             value={filters.area}  onChange={set("area")}  />
              <FilterInput icon={Icon.Briefcase} placeholder="Role"            value={filters.role}  onChange={set("role")}  />
              <FilterInput icon={Icon.Bolt}      placeholder="Skill"           value={filters.skill} onChange={set("skill")} />
              <FilterInput icon={Icon.Clock}     placeholder="Shift (Day / Night)" value={filters.shift} onChange={set("shift")} />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1 gap-1.5">
                  <Icon.Search className="h-4 w-4" /> Search
                </button>
                {isDirty && (
                  <button type="button" onClick={reset} className="btn-ghost" aria-label="Reset filters">
                    <Icon.Close className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="section pt-12">
        <div className="container-page">
          {error ? (
            <ErrorState message={error} onRetry={() => setQueryPage((q) => ({ ...q }))} />
          ) : (
            <>
              {!loading && (
                <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">{jobs.length}</span>{" "}
                  {jobs.length === 1 ? "job" : "jobs"} found
                  {isFiltered && (
                    <button onClick={reset} className="ml-3 font-medium text-brand-600 hover:underline dark:text-brand-400">
                      Clear filters
                    </button>
                  )}
                </p>
              )}
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

              {/* Load more */}
              {!loading && hasMore && !loadingMore && (
                <div className="mt-8 flex justify-center">
                  <button onClick={loadMore} className="btn-secondary px-8">
                    Load more jobs
                  </button>
                </div>
              )}
              {loadingMore && (
                <div className="mt-8 flex justify-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Loading more jobs…</span>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
