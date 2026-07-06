import { useEffect, useState } from "react";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import Pill, { StatusPill } from "../components/ui/Pill";
import { TextField, TextArea } from "../components/ui/Field";
import { Loading, EmptyState, ErrorState } from "../components/ui/States";
import { useAuth } from "../context/AuthContext";
import { getFactoryDashboard, listFactoryJobs } from "../services/factory";
import { createJob, updateJob, updateJobStatus } from "../services/jobs";
import { listJobApplications, shortlistApplication, hireApplication, rejectApplication } from "../services/applications";

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
    const payMin = Number(job.payMin) || 0;
    const payMax = Number(job.payMax) || 0;
    if (payMax > 0 && payMin > payMax) {
      setPostMsg("Minimum pay cannot exceed maximum pay.");
      setPosting(false);
      return;
    }
    try {
      await createJob(token, {
        title: job.title,
        description: job.description,
        area: job.area,
        shift: job.shift,
        skillsRequired: toArr(job.skillsRequired),
        payMin,
        payMax,
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

function JobRow({ job: initialJob, token, open, onToggle, onChanged }) {
  const [job, setJob] = useState(initialJob);
  const [apps, setApps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actingId, setActingId] = useState(null);
  const [toggling, setToggling] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editMsg, setEditMsg] = useState(null);

  // Hire modal state
  const [hireTarget, setHireTarget] = useState(null); // { appId, payDefault }
  const [hirePay, setHirePay] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [hiring, setHiring] = useState(false);

  const [rejectingId, setRejectingId] = useState(null);
  const [confirmClose, setConfirmClose] = useState(false); // inline confirm for job status toggle
  const [confirmRejectId, setConfirmRejectId] = useState(null); // inline confirm for reject

  useEffect(() => { setJob(initialJob); }, [initialJob]);

  useEffect(() => {
    if (!open) return;
    setApps(null);
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

  const onReject = async (id) => {
    setConfirmRejectId(id);
  };

  const confirmReject = async () => {
    const id = confirmRejectId;
    setConfirmRejectId(null);
    setRejectingId(id);
    try {
      await rejectApplication(token, id);
      await refresh();
      onChanged?.();
    } catch (err) {
      setError(err.message || "Could not reject applicant.");
    } finally {
      setRejectingId(null);
    }
  };

  const openHireModal = (app) => {
    setHireTarget({ appId: app.id, payDefault: job.payMax || job.payMin || 0 });
    setHirePay(String(job.payMax || job.payMin || ""));
    setHireDate("");
  };

  const submitHire = async (e) => {
    e.preventDefault();
    if (!hireTarget) return;
    setHiring(true);
    try {
      await hireApplication(token, hireTarget.appId, {
        proposedPay: Number(hirePay) || 0,
        joiningDate: hireDate || undefined,
      });
      setHireTarget(null);
      await refresh();
      onChanged?.();
    } catch (err) {
      setEditMsg(err.message || "Could not complete hire");
    } finally {
      setHiring(false);
    }
  };

  const toggleStatus = async () => {
    setConfirmClose(true);
  };

  const confirmToggle = async () => {
    const next = job.status === "OPEN" ? "CLOSED" : "OPEN";
    setConfirmClose(false);
    setToggling(true);
    try {
      const updated = await updateJobStatus(token, job.id, next);
      setJob(updated);
      onChanged?.();
    } catch (err) {
      setEditMsg(err.message || "Could not update job status");
    } finally {
      setToggling(false);
    }
  };

  const startEdit = () => {
    setEditMsg(null);
    setEditForm({
      title: job.title || "",
      area: job.area || "",
      shift: job.shift || "",
      description: job.description || "",
      skillsRequired: (job.skills || []).join(", "),
      payMin: job.payMin ? String(job.payMin) : "",
      payMax: job.payMax ? String(job.payMax) : "",
    });
    setEditing(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setEditMsg(null);
    try {
      const updated = await updateJob(token, job.id, {
        title: editForm.title,
        area: editForm.area,
        shift: editForm.shift,
        description: editForm.description,
        skillsRequired: toArr(editForm.skillsRequired),
        payMin: Number(editForm.payMin) || 0,
        payMax: Number(editForm.payMax) || 0,
      });
      setJob(updated);
      setEditing(false);
      setEditMsg("Job updated.");
      onChanged?.();
    } catch (err) {
      setEditMsg(err.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const setF = (k) => (e) => setEditForm((f) => ({ ...f, [k]: e.target.value }));
  const isOpen = job.status !== "CLOSED";

  return (
    <div className="card overflow-hidden">
      {/* Inline confirm — close/reopen job */}
      {confirmClose ? (
        <div className="flex items-center gap-3 border-b border-amber-200 bg-amber-50 px-5 py-3 dark:border-amber-800 dark:bg-amber-900/20">
          <Icon.Alert className="h-4 w-4 shrink-0 text-amber-600" />
          <p className="flex-1 text-sm font-medium text-amber-800 dark:text-amber-300">
            {job.status === "OPEN" ? `Close "${job.title}"? Workers won't be able to apply.` : `Reopen "${job.title}"?`}
          </p>
          <button onClick={confirmToggle} className="btn-primary text-xs py-1.5 px-3">
            {job.status === "OPEN" ? "Close job" : "Reopen"}
          </button>
          <button onClick={() => setConfirmClose(false)} className="btn-ghost text-xs py-1.5 px-3">Cancel</button>
        </div>
      ) : null}

      {/* Inline confirm — reject applicant */}
      {confirmRejectId ? (
        <div className="flex items-center gap-3 border-b border-red-200 bg-red-50 px-5 py-3 dark:border-red-800 dark:bg-red-900/20">
          <Icon.Alert className="h-4 w-4 shrink-0 text-red-500" />
          <p className="flex-1 text-sm font-medium text-red-700 dark:text-red-300">Reject this applicant? This cannot be undone.</p>
          <button onClick={confirmReject} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">Reject</button>
          <button onClick={() => setConfirmRejectId(null)} className="btn-ghost text-xs py-1.5 px-3">Cancel</button>
        </div>
      ) : null}

      {/* Row header */}
      <div className="flex w-full items-center gap-3 p-5">
        <button onClick={onToggle} className="flex flex-1 items-center gap-3 text-left">
          <div className="flex-1">
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

        {/* Job-level actions */}
        <div className="flex shrink-0 items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-700">
          <button
            onClick={startEdit}
            title="Edit job"
            className="btn-icon btn-ghost text-slate-500 hover:text-brand-600"
          >
            <Icon.Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={toggleStatus}
            disabled={toggling}
            title={isOpen ? "Close job" : "Reopen job"}
            className={`btn-icon btn-ghost ${isOpen ? "text-red-500 hover:text-red-700" : "text-emerald-600 hover:text-emerald-700"}`}
          >
            {toggling
              ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              : isOpen
                ? <Icon.Close className="h-4 w-4" />
                : <Icon.Refresh className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {editMsg ? (
        <p className="px-5 pb-2 text-sm text-emerald-600 dark:text-emerald-400">{editMsg}</p>
      ) : null}

      {/* Inline edit form */}
      {editing ? (
        <div className="border-t border-slate-200 bg-amber-50 p-5 dark:border-slate-800 dark:bg-amber-900/10">
          <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">Edit job details</h4>
          <form onSubmit={saveEdit} className="grid gap-3 sm:grid-cols-2">
            <TextField label="Title" value={editForm.title} onChange={setF("title")} required className="sm:col-span-2" />
            <TextField label="Area" value={editForm.area} onChange={setF("area")} required />
            <TextField label="Shift" value={editForm.shift} onChange={setF("shift")} required />
            <TextField label="Pay min (₹)" type="number" min="0" value={editForm.payMin} onChange={setF("payMin")} />
            <TextField label="Pay max (₹)" type="number" min="0" value={editForm.payMax} onChange={setF("payMax")} />
            <TextField label="Skills required (comma separated)" value={editForm.skillsRequired} onChange={setF("skillsRequired")} className="sm:col-span-2" />
            <TextArea label="Description" value={editForm.description} onChange={setF("description")} rows={3} className="sm:col-span-2" />
            {editMsg ? <p className="text-sm text-red-600 sm:col-span-2">{editMsg}</p> : null}
            <div className="flex gap-2 sm:col-span-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? "Saving…" : "Save changes"}</button>
              <button type="button" onClick={() => setEditing(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Hire modal */}
      {hireTarget ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
          onClick={() => setHireTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-white p-6 pb-10 shadow-xl dark:bg-slate-900 sm:rounded-2xl sm:pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Extend a job offer</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Set the proposed pay and joining date</p>
            <form onSubmit={submitHire} className="mt-4 space-y-3">
              <div>
                <label className="label-field">Proposed pay (₹ / month)</label>
                <input
                  type="number"
                  min="0"
                  value={hirePay}
                  onChange={(e) => setHirePay(e.target.value)}
                  className="input-field mt-1"
                  placeholder="e.g. 18000"
                  required
                />
              </div>
              <div>
                <label className="label-field">Joining date (optional)</label>
                <input
                  type="date"
                  value={hireDate}
                  onChange={(e) => setHireDate(e.target.value)}
                  className="input-field mt-1"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={hiring} className="btn-primary flex-1">
                  {hiring ? "Sending offer…" : "Send offer"}
                </button>
                <button type="button" onClick={() => setHireTarget(null)} className="btn-ghost">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Applications panel */}
      {open && !editing ? (
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
                      {a.workerPhone ? (
                        <a
                          href={`tel:${a.workerPhone}`}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300"
                        >
                          <Icon.Phone className="h-3.5 w-3.5" /> {a.workerPhone}
                        </a>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {a.status === "APPLIED" ? (
                        <button onClick={() => onShortlist(a.id)} disabled={actingId === a.id} className="btn-secondary text-sm">
                          {actingId === a.id ? "…" : "Shortlist"}
                        </button>
                      ) : null}
                      {a.status === "HIRED" ? (
                        <Pill tone="green">Hired</Pill>
                      ) : a.status === "REJECTED" ? (
                        <Pill tone="slate">Rejected</Pill>
                      ) : (
                        <>
                          <button onClick={() => openHireModal(a)} disabled={actingId === a.id} className="btn-primary text-sm">
                            Hire
                          </button>
                          <button
                            onClick={() => onReject(a.id)}
                            disabled={rejectingId === a.id}
                            className="btn-ghost text-sm text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            {rejectingId === a.id ? "…" : "Reject"}
                          </button>
                        </>
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
