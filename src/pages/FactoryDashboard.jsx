import { useEffect, useState } from "react";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import Pill, { StatusPill } from "../components/ui/Pill";
import { TextField, TextArea } from "../components/ui/Field";
import { Loading, EmptyState, ErrorState } from "../components/ui/States";
import { useAuth } from "../context/AuthContext";
import { getFactoryDashboard, listFactoryJobs } from "../services/factory";
import { createJob } from "../services/jobs";
import { listJobApplications, shortlistApplication, hireApplication } from "../services/applications";

function toArr(str) {
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

const BLANK_JOB = {
  title: "",
  description: "",
  area: "",
  shift: "Day",
  skillsRequired: "",
  payMin: "",
  payMax: "",
  employmentType: "Full-time",
};

export default function FactoryDashboard() {
  const { token, user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [job, setJob] = useState(BLANK_JOB);
  const [posting, setPosting] = useState(false);
  const [postMsg, setPostMsg] = useState(null);

  const [openJobId, setOpenJobId] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([getFactoryDashboard(token), listFactoryJobs(token)])
      .then(([s, j]) => {
        setSummary(s);
        setJobs(j);
      })
      .catch((err) => setError(err.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const set = (k) => (e) => setJob((j) => ({ ...j, [k]: e.target.value }));

  const submitJob = async (e) => {
    e.preventDefault();
    setPosting(true);
    setPostMsg(null);
    try {
      await createJob(token, {
        title: job.title,
        description: job.description,
        area: job.area,
        shift: job.shift,
        skillsRequired: toArr(job.skillsRequired),
        payMin: Number(job.payMin) || 0,
        payMax: Number(job.payMax) || 0,
        employmentType: job.employmentType,
      });
      setJob(BLANK_JOB);
      setShowForm(false);
      setPostMsg("Job posted successfully.");
      load();
    } catch (err) {
      setPostMsg(err.message || "Could not post job.");
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div className="container-page section"><Loading label="Loading dashboard…" /></div>;
  if (error) return <div className="container-page section"><ErrorState message={error} onRetry={load} /></div>;

  const stats = [
    { label: "Open jobs", value: summary?.openJobs ?? 0, icon: Icon.Briefcase },
    { label: "Applications", value: summary?.totalApplications ?? 0, icon: Icon.Inbox },
    { label: "Shortlisted", value: summary?.shortlisted ?? 0, icon: Icon.Star },
    { label: "Hires", value: summary?.hires ?? 0, icon: Icon.CheckCircle },
  ];

  return (
    <>
      <Seo title="Factory dashboard" />
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container-page py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Factory dashboard</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {user?.name}
              </h1>
            </div>
            <button onClick={() => { setShowForm((v) => !v); setPostMsg(null); }} className="btn-primary">
              <Icon.Plus className="h-4 w-4" /> {showForm ? "Close" : "Post a job"}
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="card p-4">
                <s.icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{s.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
          {postMsg ? <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">{postMsg}</p> : null}
        </div>
      </section>

      {showForm ? (
        <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="container-page py-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Post a new job</h2>
            <form onSubmit={submitJob} className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField label="Job title" value={job.title} onChange={set("title")} placeholder="e.g. Machine Operator" required className="sm:col-span-2" />
              <TextArea label="Description" value={job.description} onChange={set("description")} placeholder="Responsibilities, requirements…" rows={4} required className="sm:col-span-2" />
              <TextField label="Area" value={job.area} onChange={set("area")} placeholder="e.g. Okhla, Delhi" required />
              <TextField label="Shift" value={job.shift} onChange={set("shift")} placeholder="Day / Night" required />
              <TextField label="Pay min (₹)" type="number" min="0" value={job.payMin} onChange={set("payMin")} />
              <TextField label="Pay max (₹)" type="number" min="0" value={job.payMax} onChange={set("payMax")} />
              <TextField label="Skills required (comma separated)" value={job.skillsRequired} onChange={set("skillsRequired")} placeholder="Welding, CNC" className="sm:col-span-2" />
              <TextField label="Employment type" value={job.employmentType} onChange={set("employmentType")} placeholder="Full-time" />
              <div className="flex items-end">
                <button type="submit" disabled={posting} className="btn-primary w-full">
                  {posting ? "Posting…" : "Publish job"}
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : null}

      <section className="section pt-10">
        <div className="container-page">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your job postings</h2>
          <div className="mt-4 space-y-4">
            {jobs.length === 0 ? (
              <EmptyState
                icon={Icon.Briefcase}
                title="No jobs posted yet"
                message="Post your first job to start receiving applications."
                action={<button onClick={() => setShowForm(true)} className="btn-primary">Post a job</button>}
              />
            ) : (
              jobs.map((j) => (
                <JobRow
                  key={j.id}
                  job={j}
                  token={token}
                  open={openJobId === j.id}
                  onToggle={() => setOpenJobId((cur) => (cur === j.id ? null : j.id))}
                  onChanged={load}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function JobRow({ job, token, open, onToggle, onChanged }) {
  const [apps, setApps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actingId, setActingId] = useState(null);

  useEffect(() => {
    if (!open || apps) return;
    setLoading(true);
    listJobApplications(token, job.id)
      .then(setApps)
      .catch((err) => setError(err.message || "Failed to load applicants"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const refresh = () =>
    listJobApplications(token, job.id).then(setApps).catch(() => {});

  const onShortlist = async (id) => {
    setActingId(id);
    try {
      await shortlistApplication(token, id);
      await refresh();
      onChanged?.();
    } finally {
      setActingId(null);
    }
  };

  const onHire = async (app) => {
    setActingId(app.id);
    try {
      await hireApplication(token, app.id, { proposedPay: job.payMax || job.payMin || 0 });
      await refresh();
      onChanged?.();
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="card overflow-hidden">
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-3 p-5 text-left">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">{job.title}</h3>
            <StatusPill status={job.status} />
          </div>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {job.area} · {job.shift} · {job.pay}
          </p>
        </div>
        <Icon.ArrowRight className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open ? (
        <div className="border-t border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/40">
          {loading ? (
            <Loading label="Loading applicants…" />
          ) : error ? (
            <ErrorState message={error} onRetry={refresh} />
          ) : !apps || apps.length === 0 ? (
            <EmptyState icon={Icon.Users} title="No applicants yet" message="Applications will appear here as workers apply." />
          ) : (
            <div className="space-y-3">
              {apps.map((a) => (
                <div key={a.id} className="card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900 dark:text-white">{a.worker?.fullName || "Worker"}</h4>
                        <StatusPill status={a.status} />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {a.worker?.headline || a.worker?.role} · {a.worker?.experience}
                      </p>
                      {a.worker?.skills?.length ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {a.worker.skills.slice(0, 5).map((s) => <Pill key={s} tone="slate">{s}</Pill>)}
                        </div>
                      ) : null}
                      {a.note ? <p className="mt-2 text-sm italic text-slate-500 dark:text-slate-400">"{a.note}"</p> : null}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {a.status === "APPLIED" ? (
                        <button onClick={() => onShortlist(a.id)} disabled={actingId === a.id} className="btn-secondary text-sm">
                          {actingId === a.id ? "…" : "Shortlist"}
                        </button>
                      ) : null}
                      {a.status !== "HIRED" ? (
                        <button onClick={() => onHire(a)} disabled={actingId === a.id} className="btn-primary text-sm">
                          {actingId === a.id ? "…" : "Hire"}
                        </button>
                      ) : (
                        <Pill tone="green">Hired</Pill>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
