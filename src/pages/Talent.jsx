import { useEffect, useState } from "react";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import WorkerCard from "../components/talent/WorkerCard";
import { TextField } from "../components/ui/Field";
import { SkeletonCard, EmptyState, ErrorState } from "../components/ui/States";
import { searchWorkers } from "../services/workers";
import { listFactoryJobs } from "../services/factory";
import { shortlistWorkerForJob } from "../services/applications";
import { useAuth } from "../context/AuthContext";

const EMPTY = { q: "", area: "", role: "", skill: "", shift: "" };

export default function Talent() {
  const { isAuthenticated, user, token } = useAuth();
  const isFactory = user?.type === "factory";

  const [filters, setFilters] = useState(EMPTY);
  // queryPage bundles applied filters + page so a single setState avoids double-fetches
  const [queryPage, setQueryPage] = useState({ applied: EMPTY, page: 1 });

  const [workers,     setWorkers]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore,     setHasMore]     = useState(false);
  const [error,       setError]       = useState(null);

  // Shortlist flow
  const [factoryJobs,      setFactoryJobs]      = useState([]);
  const [shortlistPending, setShortlistPending] = useState(null);
  const [shortlisted,      setShortlisted]      = useState({});
  const [shortlistMsg,     setShortlistMsg]     = useState(null);

  useEffect(() => {
    if (isAuthenticated && isFactory && token) {
      listFactoryJobs(token, { status: "OPEN" }).then(setFactoryJobs).catch(() => {});
    }
  }, [isAuthenticated, isFactory, token]);

  useEffect(() => {
    const { applied, page } = queryPage;
    let cancelled = false;

    if (page === 1) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    searchWorkers({ ...applied, page })
      .then(({ items, pagination }) => {
        if (cancelled) return;
        if (page === 1) {
          setWorkers(items);
        } else {
          setWorkers((prev) => [...prev, ...items]);
        }
        setHasMore(pagination?.hasMore ?? false);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load talent");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      });

    return () => { cancelled = true; };
  }, [queryPage]);

  const onSubmit = (e) => { e.preventDefault(); setQueryPage({ applied: filters, page: 1 }); };
  const reset    = ()  => { setFilters(EMPTY); setQueryPage({ applied: EMPTY, page: 1 }); };
  const set      = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));
  const loadMore = () => setQueryPage((q) => ({ ...q, page: q.page + 1 }));

  async function handleShortlistJob(jobId) {
    if (!token || !shortlistPending) return;
    setShortlistMsg(null);
    try {
      await shortlistWorkerForJob(token, jobId, shortlistPending);
      setShortlisted((s) => ({ ...s, [shortlistPending]: true }));
      setShortlistMsg("Worker shortlisted successfully.");
    } catch (err) {
      setShortlistMsg(err.message || "Could not shortlist worker.");
    } finally {
      setShortlistPending(null);
    }
  }

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

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <div className="relative">
              <Icon.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={filters.q}
                onChange={set("q")}
                placeholder="Search by name, skill, or role…"
                className="input-field pl-9"
                aria-label="Search workers"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <TextField placeholder="Area"             value={filters.area}  onChange={set("area")}  aria-label="Area"  />
              <TextField placeholder="Role"             value={filters.role}  onChange={set("role")}  aria-label="Role"  />
              <TextField placeholder="Skill"            value={filters.skill} onChange={set("skill")} aria-label="Skill" />
              <TextField placeholder="Shift (Day / Night)" value={filters.shift} onChange={set("shift")} aria-label="Shift" />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Search</button>
                <button type="button" onClick={reset} className="btn-ghost" aria-label="Reset filters">Reset</button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <section className="section pt-12">
        <div className="container-page">
          {error ? (
            <ErrorState message={error} onRetry={() => setQueryPage((q) => ({ ...q }))} />
          ) : (
            <>
              {!loading && (
                <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                  {workers.length} {workers.length === 1 ? "worker" : "workers"} available
                </p>
              )}
              {shortlistMsg && (
                <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  {shortlistMsg}
                  <button onClick={() => setShortlistMsg(null)} className="ml-3 font-semibold hover:underline">Dismiss</button>
                </div>
              )}

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
                  workers.map((w) => (
                    <WorkerCard
                      key={w.id}
                      worker={w}
                      onShortlist={isFactory ? (id) => setShortlistPending(id) : undefined}
                      shortlisted={shortlisted[w.id] ?? false}
                    />
                  ))
                )}
              </div>

              {/* Load more */}
              {!loading && hasMore && !loadingMore && (
                <div className="mt-8 flex justify-center">
                  <button onClick={loadMore} className="btn-secondary px-8">
                    Load more workers
                  </button>
                </div>
              )}
              {loadingMore && (
                <div className="mt-8 flex justify-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Loading more workers…</span>
                </div>
              )}

              {/* Shortlist job picker modal */}
              {shortlistPending && (
                <div
                  className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
                  onClick={() => setShortlistPending(null)}
                >
                  <div
                    className="w-full max-w-md rounded-t-3xl bg-white p-6 pb-10 shadow-xl dark:bg-slate-900 sm:rounded-2xl sm:pb-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Select job to shortlist for</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Pick one of your open jobs</p>
                    <div className="mt-4 space-y-2">
                      {factoryJobs.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">No open jobs found. Post a job first.</p>
                      ) : (
                        factoryJobs.map((job) => (
                          <button
                            key={job.id}
                            onClick={() => handleShortlistJob(job.id)}
                            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-brand-300 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-brand-600"
                          >
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white">{job.title || job.role}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{job.area} · {job.shift}</div>
                            </div>
                            <Icon.ArrowRight className="h-4 w-4 text-slate-400" />
                          </button>
                        ))
                      )}
                    </div>
                    <button
                      onClick={() => setShortlistPending(null)}
                      className="mt-4 w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
