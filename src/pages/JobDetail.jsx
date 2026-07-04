import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import Pill, { StatusPill } from "../components/ui/Pill";
import { TextArea } from "../components/ui/Field";
import { Loading, ErrorState } from "../components/ui/States";
import { useAuth } from "../context/AuthContext";
import { getJobDetails, applyToJob } from "../services/jobs";
import { isJobSaved, toggleSavedJob } from "../services/savedJobs";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [note, setNote] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyMsg, setApplyMsg] = useState(null); // { type, text }
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setSaved(isJobSaved(id));
    getJobDetails(id)
      .then((j) => active && setJob(j))
      .catch((err) => active && setError(err.message || "Job not found"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const isWorker = user?.type === "worker";

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyMsg(null);
    setApplying(true);
    try {
      await applyToJob(token, id, note.trim());
      setApplyMsg({ type: "success", text: "Application submitted! Track it from your dashboard." });
      setNote("");
    } catch (err) {
      setApplyMsg({ type: "error", text: err.message || "Could not apply to this job." });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="container-page section"><Loading label="Loading job…" /></div>;
  if (error || !job)
    return (
      <div className="container-page section">
        <ErrorState message={error || "Job not found"} onRetry={() => navigate(0)} />
        <div className="mt-6 text-center">
          <Link to="/jobs" className="btn-secondary">Back to jobs</Link>
        </div>
      </div>
    );

  return (
    <>
      <Seo title={job.title} path={`/jobs/${id}`} description={`${job.title} at ${job.companyName} — ${job.area}. Apply on Sketu.`} />

      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container-page flex items-center justify-between py-6">
          <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400">
            <Icon.ArrowRight className="h-4 w-4 rotate-180" /> Back to jobs
          </Link>
          {job ? (
            <button
              onClick={() => setSaved(toggleSavedJob(job))}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors ${
                saved
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
              aria-label={saved ? "Remove from saved jobs" : "Save job"}
            >
              <Icon.Star className="h-4 w-4" />
              {saved ? "Saved" : "Save job"}
            </button>
          ) : null}
        </div>
      </div>

      <section className="section pt-10">
        <div className="container-page grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    {job.title}
                  </h1>
                  <StatusPill status={job.status} />
                </div>
                <p className="mt-1 text-lg text-slate-600 dark:text-slate-300">{job.companyName}</p>
              </div>
              <span className="rounded-xl bg-brand-50 px-4 py-2 text-lg font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                {job.pay}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
              {job.area && <span className="inline-flex items-center gap-1.5"><Icon.MapPin className="h-4 w-4" /> {job.area}</span>}
              {job.shift && <span className="inline-flex items-center gap-1.5"><Icon.Clock className="h-4 w-4" /> {job.shift}</span>}
              <span className="inline-flex items-center gap-1.5"><Icon.Briefcase className="h-4 w-4" /> {job.employmentType}</span>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Job description</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-300">
                {job.description || "No description provided."}
              </p>
            </div>

            {job.skills?.length ? (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Skills required</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <Pill key={s} tone="brand">{s}</Pill>
                  ))}
                </div>
              </div>
            ) : null}

            {job.factoryDescription ? (
              <div className="mt-8 card p-6">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">About {job.companyName}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{job.factoryDescription}</p>
              </div>
            ) : null}
          </div>

          {/* Apply sidebar */}
          <aside className="lg:col-span-1">
            <div className="card sticky top-24 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Apply for this job</h3>

              {!isAuthenticated ? (
                <>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Log in as a worker to apply in one click.
                  </p>
                  <Link to="/login" state={{ from: `/jobs/${id}` }} className="btn-primary mt-4 w-full">
                    Log in to apply
                  </Link>
                  <Link to="/register" className="btn-ghost mt-2 w-full">
                    Create a worker account
                  </Link>
                </>
              ) : !isWorker ? (
                <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
                  You're signed in as a factory. Switch to a worker account to apply for jobs.
                </p>
              ) : applyMsg?.type === "success" ? (
                <div className="mt-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                  <Icon.CheckCircle className="mb-1 h-5 w-5" />
                  {applyMsg.text}
                  <Link to="/dashboard" className="btn-secondary mt-3 w-full">View my applications</Link>
                </div>
              ) : (
                <form onSubmit={handleApply} className="mt-4 space-y-3">
                  <TextArea
                    label="Message to the factory (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Tell them why you're a good fit…"
                    rows={4}
                  />
                  {applyMsg?.type === "error" ? (
                    <p className="text-sm text-red-600 dark:text-red-400">{applyMsg.text}</p>
                  ) : null}
                  <button type="submit" disabled={applying} className="btn-primary w-full">
                    {applying ? "Submitting…" : "Apply now"}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
