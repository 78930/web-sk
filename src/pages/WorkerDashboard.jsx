import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import Pill, { StatusPill } from "../components/ui/Pill";
import { TextField, TextArea } from "../components/ui/Field";
import { Loading, EmptyState, ErrorState } from "../components/ui/States";
import { useAuth } from "../context/AuthContext";
import { getWorkerProfile, updateWorkerProfile } from "../services/workers";
import { listMyApplications } from "../services/applications";

function csv(arr) {
  return (arr || []).join(", ");
}
function toArr(str) {
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

export default function WorkerDashboard() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([getWorkerProfile(token), listMyApplications(token)])
      .then(([p, a]) => {
        setProfile(p);
        setApps(a);
      })
      .catch((err) => setError(err.message || "Failed to load your dashboard"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const startEdit = () => {
    setSaveMsg(null);
    setForm({
      fullName: profile.fullName || "",
      headline: profile.headline || "",
      experienceYears: profile.experienceYears || 0,
      salaryMin: profile.salaryMin || 0,
      availability: profile.availability || "",
      skills: csv(profile.skills),
      preferredRoles: csv(profile.preferredRoles),
      preferredAreas: csv(profile.preferredAreas),
      preferredShifts: csv(profile.preferredShifts),
      certifications: csv(profile.certifications),
      isOpenToWork: profile.isOpenToWork,
    });
    setEditing(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    try {
      const updated = await updateWorkerProfile(token, {
        fullName: form.fullName,
        headline: form.headline,
        experienceYears: Number(form.experienceYears) || 0,
        salaryMin: Number(form.salaryMin) || 0,
        availability: form.availability,
        isOpenToWork: form.isOpenToWork,
        skills: toArr(form.skills),
        preferredRoles: toArr(form.preferredRoles),
        preferredAreas: toArr(form.preferredAreas),
        preferredShifts: toArr(form.preferredShifts),
        certifications: toArr(form.certifications),
      });
      setProfile(updated);
      setEditing(false);
      setSaveMsg("Profile updated.");
    } catch (err) {
      setSaveMsg(err.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (loading) return <div className="container-page section"><Loading label="Loading your dashboard…" /></div>;
  if (error) return <div className="container-page section"><ErrorState message={error} onRetry={load} /></div>;

  const stats = [
    { label: "Applications", value: apps.length, icon: Icon.Inbox },
    { label: "Shortlisted", value: apps.filter((a) => a.status === "SHORTLISTED").length, icon: Icon.Star },
    { label: "Hired", value: apps.filter((a) => a.status === "HIRED").length, icon: Icon.CheckCircle },
  ];

  return (
    <>
      <Seo title="My dashboard" />
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container-page py-10">
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Worker dashboard</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Hello, {profile?.fullName || user?.name}
          </h1>
          <div className="mt-6 grid grid-cols-3 gap-4 sm:max-w-lg">
            {stats.map((s) => (
              <div key={s.label} className="card p-4">
                <s.icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{s.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-10">
        <div className="container-page grid gap-8 lg:grid-cols-3">
          {/* Profile */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">My profile</h2>
                {!editing ? (
                  <button onClick={startEdit} className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
                    Edit
                  </button>
                ) : null}
              </div>

              {saveMsg ? <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">{saveMsg}</p> : null}

              {!editing ? (
                <div className="mt-4 space-y-3 text-sm">
                  <Detail label="Headline" value={profile.headline || "—"} />
                  <Detail label="Experience" value={`${profile.experienceYears} years`} />
                  <Detail label="Min salary" value={profile.salaryMin ? `₹${profile.salaryMin}` : "Negotiable"} />
                  <Detail label="Availability" value={profile.availability || "—"} />
                  <Detail label="Open to work" value={profile.isOpenToWork ? "Yes" : "No"} />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Skills</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {profile.skills?.length ? profile.skills.map((s) => <Pill key={s} tone="brand">{s}</Pill>) : <span className="text-slate-400">None added</span>}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={save} className="mt-4 space-y-3">
                  <TextField label="Full name" value={form.fullName} onChange={set("fullName")} />
                  <TextField label="Headline" value={form.headline} onChange={set("headline")} placeholder="e.g. CNC operator, 5 yrs" />
                  <div className="grid grid-cols-2 gap-3">
                    <TextField label="Experience (yrs)" type="number" min="0" value={form.experienceYears} onChange={set("experienceYears")} />
                    <TextField label="Min salary (₹)" type="number" min="0" value={form.salaryMin} onChange={set("salaryMin")} />
                  </div>
                  <TextField label="Availability" value={form.availability} onChange={set("availability")} placeholder="Immediate" />
                  <TextField label="Skills (comma separated)" value={form.skills} onChange={set("skills")} />
                  <TextField label="Preferred roles" value={form.preferredRoles} onChange={set("preferredRoles")} />
                  <TextField label="Preferred areas" value={form.preferredAreas} onChange={set("preferredAreas")} />
                  <TextField label="Preferred shifts" value={form.preferredShifts} onChange={set("preferredShifts")} />
                  <TextField label="Certifications" value={form.certifications} onChange={set("certifications")} />
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <input type="checkbox" checked={form.isOpenToWork} onChange={(e) => setForm((f) => ({ ...f, isOpenToWork: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-brand-600" />
                    Open to work
                  </label>
                  <div className="flex gap-2 pt-1">
                    <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? "Saving…" : "Save"}</button>
                    <button type="button" onClick={() => setEditing(false)} className="btn-ghost">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Applications */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">My applications</h2>
            <div className="mt-4 space-y-4">
              {apps.length === 0 ? (
                <EmptyState
                  icon={Icon.Inbox}
                  title="No applications yet"
                  message="Browse open jobs and apply — they'll show up here."
                  action={<Link to="/jobs" className="btn-primary">Browse jobs</Link>}
                />
              ) : (
                apps.map((a) => (
                  <div key={a.id} className="card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {a.job?.title || "Job"}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {a.job?.companyName} {a.job?.area ? `· ${a.job.area}` : ""}
                        </p>
                      </div>
                      <StatusPill status={a.status} />
                    </div>
                    {a.note ? (
                      <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                        "{a.note}"
                      </p>
                    ) : null}
                    {a.job?.id ? (
                      <Link to={`/jobs/${a.job.id}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
                        View job <Icon.ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
      <span className="font-medium text-slate-700 dark:text-slate-200">{value}</span>
    </div>
  );
}
