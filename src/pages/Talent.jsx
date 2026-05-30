import { useCallback, useEffect, useState } from "react";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import WorkerCard from "../components/talent/WorkerCard";
import { TextField } from "../components/ui/Field";
import { SkeletonCard, EmptyState, ErrorState } from "../components/ui/States";
import { searchWorkers } from "../services/workers";

const EMPTY = { q: "", area: "", role: "", skill: "", shift: "" };

export default function Talent() {
  const [filters, setFilters] = useState(EMPTY);
  const [applied, setApplied] = useState(EMPTY);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback((params) => {
    setLoading(true);
    setError(null);
    searchWorkers(params)
      .then(setWorkers)
      .catch((err) => setError(err.message || "Failed to load talent"))
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
      <Seo title="Find talent" path="/talent" description="Search verified, open-to-work factory talent by skill, area and shift on Sketu." />

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container-page py-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Find skilled workers
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Browse verified workers who are open to work. Filter by skill, area and shift.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <div className="relative lg:col-span-2">
              <Icon.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={filters.q}
                onChange={set("q")}
                placeholder="Search name or skill"
                className="input-field pl-9"
                aria-label="Search workers"
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
                  {workers.length} {workers.length === 1 ? "worker" : "workers"} available
                </p>
              ) : null}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                ) : workers.length === 0 ? (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <EmptyState
                      icon={Icon.Users}
                      title="No workers match your search"
                      message="Try widening your filters or searching a different skill."
                    />
                  </div>
                ) : (
                  workers.map((w) => <WorkerCard key={w.id} worker={w} />)
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
