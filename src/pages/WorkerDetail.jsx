import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import Pill from "../components/ui/Pill";
import { Loading, ErrorState } from "../components/ui/States";
import { useAuth } from "../context/AuthContext";
import { getWorkerById } from "../services/workers";
import { listFactoryJobs } from "../services/factory";
import { shortlistWorkerForJob } from "../services/applications";

function Section({ title, children }) {
  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{title}</h2>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Detail({ icon: IconComp, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-900/50">
      <IconComp className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="text-xs font-medium text-slate-400 dark:text-slate-500 w-24 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{value}</span>
    </div>
  );
}

export default function WorkerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuth();
  const isFactory = user?.type === "factory";

  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Shortlist flow
  const [factoryJobs, setFactoryJobs] = useState([]);
  const [showJobPicker, setShowJobPicker] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);
  const [shortlistMsg, setShortlistMsg] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getWorkerById(id)
      .then((w) => active && setWorker(w))
      .catch((err) => active && setError(err.message || "Worker profile not found"))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && isFactory && token) {
      listFactoryJobs(token, { status: "OPEN" }).then(setFactoryJobs).catch(() => {});
    }
  }, [isAuthenticated, isFactory, token]);

  async function handleShortlistJob(jobId) {
    if (!token || !id) return;
    setShortlistMsg(null);
    try {
      await shortlistWorkerForJob(token, jobId, id);
      setShortlisted(true);
      setShowJobPicker(false);
      setShortlistMsg("Worker shortlisted successfully.");
    } catch (err) {
      setShortlistMsg(err.message || "Could not shortlist worker.");
      setShowJobPicker(false);
    }
  }

  if (loading) return <div className="container-page section"><Loading label="Loading worker profile…" /></div>;
  if (error || !worker)
    return (
      <div className="container-page section">
        <ErrorState message={error || "Worker not found"} onRetry={() => navigate(0)} />
        <div className="mt-6 text-center">
          <Link to="/talent" className="btn-secondary">Back to talent search</Link>
        </div>
      </div>
    );

  return (
    <>
      <Seo
        title={`${worker.fullName} — Worker profile`}
        path={`/workers/${id}`}
        description={`${worker.headline || worker.role} with ${worker.experience} experience. Available in ${worker.area}.`}
      />

      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container-page py-6">
          <Link to="/talent" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400">
            <Icon.ArrowRight className="h-4 w-4 rotate-180" /> Back to talent search
          </Link>
        </div>
      </div>

      <section className="section pt-10">
        <div className="container-page grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-2xl font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                {(worker.fullName || "W").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {worker.fullName}
                  </h1>
                  {worker.verificationStatus === "VERIFIED" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                  {worker.isOpenToWork ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Open to work
                    </span>
                  ) : null}
                </div>
                {worker.headline ? (
                  <p className="mt-1 text-lg text-slate-600 dark:text-slate-300">{worker.headline}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                  {worker.area !== "Not specified" && (
                    <span className="inline-flex items-center gap-1.5">
                      <Icon.MapPin className="h-4 w-4" /> {worker.area}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Icon.Briefcase className="h-4 w-4" /> {worker.experience}
                  </span>
                  {worker.shift !== "Any" && (
                    <span className="inline-flex items-center gap-1.5">
                      <Icon.Clock className="h-4 w-4" /> {worker.shift}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <Section title="Details">
              <div className="space-y-2">
                <Detail icon={Icon.Wallet} label="Min salary" value={worker.salaryPreference} />
                <Detail icon={Icon.Clock} label="Availability" value={worker.availability} />
                <Detail icon={Icon.MapPin} label="Areas" value={worker.preferredAreas.join(", ") || null} />
                <Detail icon={Icon.Briefcase} label="Shifts" value={worker.preferredShifts.join(", ") || null} />
              </div>
            </Section>

            {/* Skills */}
            {worker.skills?.length ? (
              <Section title="Skills">
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((s) => (
                    <Pill key={s} tone="brand">{s}</Pill>
                  ))}
                </div>
              </Section>
            ) : null}

            {/* Preferred roles */}
            {worker.preferredRoles?.length ? (
              <Section title="Preferred roles">
                <div className="flex flex-wrap gap-2">
                  {worker.preferredRoles.map((r) => (
                    <Pill key={r} tone="slate">{r}</Pill>
                  ))}
                </div>
              </Section>
            ) : null}

            {/* Certifications */}
            {worker.certifications?.length ? (
              <Section title="Certifications">
                <div className="flex flex-wrap gap-2">
                  {worker.certifications.map((c) => (
                    <Pill key={c} tone="amber">{c}</Pill>
                  ))}
                </div>
              </Section>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="card sticky top-24 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {isFactory ? "Recruit this worker" : "Worker profile"}
              </h3>

              {shortlistMsg ? (
                <div className={`mt-3 rounded-xl p-3 text-sm ${shortlisted ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-200"}`}>
                  {shortlistMsg}
                </div>
              ) : null}

              {!isAuthenticated ? (
                <>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    Log in as a factory to shortlist this worker.
                  </p>
                  <Link to="/login" state={{ from: `/workers/${id}` }} className="btn-primary mt-4 w-full">
                    Log in as a factory
                  </Link>
                </>
              ) : !isFactory ? (
                <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                  Only factory accounts can shortlist workers.
                </p>
              ) : shortlisted ? (
                <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-900/30">
                  <Icon.CheckCircle className="mx-auto mb-1 h-6 w-6 text-emerald-600" />
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Shortlisted</p>
                  <Link to="/dashboard" className="btn-secondary mt-3 w-full text-sm">View pipeline</Link>
                </div>
              ) : (
                <button
                  onClick={() => setShowJobPicker(true)}
                  className="btn-primary mt-4 w-full"
                >
                  Shortlist for a job
                </button>
              )}

              <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                <Link to="/talent" className="btn-ghost w-full text-sm">
                  Back to search
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Job picker modal */}
      {showJobPicker ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
          onClick={() => setShowJobPicker(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-white p-6 pb-10 shadow-xl dark:bg-slate-900 sm:rounded-2xl sm:pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Select job to shortlist for</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Pick one of your open jobs</p>
            <div className="mt-4 space-y-2">
              {factoryJobs.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No open jobs found.{" "}
                  <Link to="/dashboard" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
                    Post a job first
                  </Link>
                </p>
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
              onClick={() => setShowJobPicker(false)}
              className="mt-4 w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
