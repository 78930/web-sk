import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import Pill, { StatusPill } from "../components/ui/Pill";
import { TextField, TextArea } from "../components/ui/Field";
import { Loading, EmptyState, ErrorState } from "../components/ui/States";
import { useAuth } from "../context/AuthContext";
import { getWorkerProfile, updateWorkerProfile, requestVerification, listMyDocuments, getDocument, uploadDocument, deleteDocument } from "../services/workers";
import { listMyApplications, respondToHireOffer } from "../services/applications";
import { uploadProfilePhoto } from "../services/auth";
import { listSavedJobs } from "../services/savedJobs";

function csv(arr) {
  return (arr || []).join(", ");
}
function toArr(str) {
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

function profileCompleteness(p) {
  if (!p) return { pct: 0, missing: [] };
  const checks = [
    [!!p.headline, "headline"],
    [(p.skills || []).length > 0, "skills"],
    [(p.preferredAreas || []).length > 0, "preferred areas"],
    [(p.preferredRoles || []).length > 0, "preferred roles"],
    [p.experienceYears > 0, "experience years"],
    [p.salaryMin > 0, "minimum salary"],
  ];
  const done = checks.filter(([ok]) => ok).length;
  const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
  return { pct: Math.round((done / checks.length) * 100), missing };
}

const DOC_LABELS = {
  AADHAAR: "Aadhaar Card",
  PAN: "PAN Card",
  DRIVING_LICENSE: "Driving Licence",
  BANK_PASSBOOK: "Bank Passbook",
  RESUME_PDF: "Resume / CV",
};
const DOC_TYPES = Object.keys(DOC_LABELS);

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(",")[1];
      resolve({ base64, mimeType: file.type || "image/jpeg" });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function WorkerDashboard() {
  const { token, user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [apps, setApps] = useState([]);
  const [savedCount, setSavedCount] = useState(() => listSavedJobs().length);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  // Photo upload
  const photoInputRef = useRef(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoMsg, setPhotoMsg] = useState(null);

  // Verification
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState(null);

  // Hire offer respond
  const [hireResponding, setHireResponding] = useState(null);
  const [hireMsg, setHireMsg] = useState(null);

  // Documents
  const [docs, setDocs] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [docUploading, setDocUploading] = useState(null);
  const docInputRef = useRef(null);
  const [pendingDocType, setPendingDocType] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.allSettled([getWorkerProfile(token), listMyApplications(token)])
      .then(([profileResult, appsResult]) => {
        if (cancelled) return;
        if (profileResult.status === "fulfilled") setProfile(profileResult.value);
        else setError(profileResult.reason?.message || "Failed to load profile");
        if (appsResult.status === "fulfilled") setApps(appsResult.value);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    setSavedCount(listSavedJobs().length);
    return () => { cancelled = true; };
  }, [token]);

  useEffect(() => {
    if (!token) return;
    setDocsLoading(true);
    listMyDocuments(token).then(setDocs).catch(() => {}).finally(() => setDocsLoading(false));
  }, [token]);

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    setPhotoMsg(null);
    try {
      const { base64, mimeType } = await readFileAsBase64(file);
      await uploadProfilePhoto(token, base64, mimeType);
      await refreshProfile();
      setPhotoMsg("Photo updated.");
    } catch (err) {
      setPhotoMsg(err.message || "Photo upload failed.");
    } finally {
      setPhotoUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  }

  async function handleRequestVerification() {
    setVerifyBusy(true);
    setVerifyMsg(null);
    try {
      const res = await requestVerification(token);
      setVerifyMsg(res.message || "Verification request submitted.");
      setProfile((p) => p ? { ...p, verificationStatus: "PENDING" } : p);
    } catch (err) {
      setVerifyMsg(err.message || "Could not submit request.");
    } finally {
      setVerifyBusy(false);
    }
  }

  async function handleHireRespond(applicationId, decision) {
    setHireResponding(applicationId);
    setHireMsg(null);
    try {
      await respondToHireOffer(token, applicationId, decision);
      setApps((prev) => prev.map((a) =>
        a.id === applicationId ? { ...a, hireStatus: decision } : a
      ));
      setHireMsg(decision === "ACCEPTED" ? "Offer accepted! Contact the factory HR to confirm details." : "Offer declined.");
    } catch (err) {
      setHireMsg(err.message || "Could not respond to offer.");
    } finally {
      setHireResponding(null);
    }
  }

  async function handleDocUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !pendingDocType) return;
    setDocUploading(pendingDocType);
    try {
      const { base64, mimeType } = await readFileAsBase64(file);
      await uploadDocument(token, pendingDocType, base64, mimeType);
      const fresh = await listMyDocuments(token);
      setDocs(fresh);
    } catch (err) {
      // silently keep existing docs on error
    } finally {
      setDocUploading(null);
      setPendingDocType(null);
      if (docInputRef.current) docInputRef.current.value = "";
    }
  }

  async function handleDocDelete(type) {
    setDocUploading(type);
    try {
      await deleteDocument(token, type);
      setDocs((prev) => prev.filter((d) => d.type !== type));
    } catch {
      // ignore
    } finally {
      setDocUploading(null);
    }
  }

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
    { label: "Applications", value: apps.length, icon: Icon.Inbox, to: null },
    { label: "Shortlisted", value: apps.filter((a) => a.status === "SHORTLISTED").length, icon: Icon.Star, to: null },
    { label: "Hired", value: apps.filter((a) => a.status === "HIRED").length, icon: Icon.CheckCircle, to: null },
    { label: "Saved jobs", value: savedCount, icon: Icon.Bookmark, to: "/saved-jobs" },
  ];
  const { pct, missing } = profileCompleteness(profile);

  return (
    <>
      <Seo title="My dashboard" />
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container-page py-10">
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Worker dashboard</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Hello, {profile?.fullName || user?.name}
          </h1>

          {/* Profile completeness */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50 sm:max-w-lg">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Profile {pct}% complete
                {profile?.isOpenToWork ? (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Open to work
                  </span>
                ) : null}
              </span>
              <span className="text-sm text-slate-500">{pct}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-2 rounded-full bg-brand-600 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            {missing.length > 0 && pct < 100 ? (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Add: {missing.slice(0, 3).join(" · ")}{missing.length > 3 ? ` +${missing.length - 3} more` : ""}
              </p>
            ) : pct === 100 ? (
              <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">Your profile is complete — factories can find you!</p>
            ) : null}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:max-w-2xl">
            {stats.map((s) =>
              s.to ? (
                <Link key={s.label} to={s.to} className="card p-4 hover:border-brand-300 transition-colors">
                  <s.icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{s.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
                </Link>
              ) : (
                <div key={s.label} className="card p-4">
                  <s.icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{s.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="section pt-10">
        <div className="container-page grid gap-8 lg:grid-cols-3">
          {/* Profile */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">My profile</h2>
                {!editing ? (
                  <button onClick={startEdit} className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
                    Edit
                  </button>
                ) : null}
              </div>

              {/* Profile photo */}
              <div className="mt-4 flex items-center gap-4">
                <div className="relative">
                  {user?.photoBase64 ? (
                    <img
                      src={`data:${user.photoMimeType || "image/jpeg"};base64,${user.photoBase64}`}
                      alt="Profile"
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-brand-200 dark:ring-brand-800"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                      {(profile?.fullName || user?.name || "W").split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    disabled={photoUploading}
                    className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm hover:bg-brand-700"
                    title="Change photo"
                  >
                    <Icon.Camera className="h-3 w-3" />
                  </button>
                  <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{profile?.fullName || user?.name}</p>
                  {profile?.headline ? <p className="text-xs text-slate-500 dark:text-slate-400">{profile.headline}</p> : null}
                  {photoMsg ? <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">{photoMsg}</p> : null}
                </div>
              </div>

              {/* Verification status banner */}
              {profile?.verificationStatus === "VERIFIED" && (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
                  <svg viewBox="0 0 20 20" fill="#D97706" className="h-5 w-5 shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Profile Verified</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">Your identity has been verified by Sketu admin</p>
                  </div>
                </div>
              )}
              {profile?.verificationStatus === "PENDING" && (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                  <Icon.Clock className="h-5 w-5 shrink-0 text-slate-400" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Verification Pending</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Admin is reviewing your documents</p>
                  </div>
                </div>
              )}
              {profile?.verificationStatus === "REJECTED" && (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-red-50 px-4 py-3 dark:bg-red-900/20">
                  <Icon.Alert className="h-5 w-5 shrink-0 text-red-500" />
                  <div>
                    <p className="text-sm font-semibold text-red-700 dark:text-red-300">Verification Rejected</p>
                    {profile?.verificationNote && (
                      <p className="text-xs text-red-600 dark:text-red-400">{profile.verificationNote}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Request verification button */}
              {(profile?.verificationStatus === "UNVERIFIED" || profile?.verificationStatus === "REJECTED") && (
                <div className="mt-4">
                  <button
                    onClick={handleRequestVerification}
                    disabled={verifyBusy}
                    className="btn-primary w-full text-sm py-2"
                  >
                    {verifyBusy ? "Submitting…" : "Request Verification"}
                  </button>
                  {verifyMsg ? <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{verifyMsg}</p> : null}
                </div>
              )}

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

            {/* Documents */}
            <div className="card p-6">
              <input ref={docInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleDocUpload} />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">My documents</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Upload to support verification</p>
              <div className="mt-4 space-y-3">
                {docsLoading ? (
                  <p className="text-sm text-slate-400">Loading…</p>
                ) : DOC_TYPES.map((type) => {
                  const uploaded = docs.find((d) => d.type === type);
                  const busy = docUploading === type;
                  return (
                    <div key={type} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon.Document className={`h-4 w-4 shrink-0 ${uploaded ? "text-emerald-500" : "text-slate-400"}`} />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{DOC_LABELS[type]}</span>
                        {uploaded ? (
                          <span className="shrink-0 text-xs text-emerald-600 dark:text-emerald-400">✓ Uploaded</span>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {uploaded ? (
                          <>
                            <button
                              onClick={async () => {
                                try {
                                  const full = await getDocument(token, type);
                                  const url = `data:${full.mimeType};base64,${full.imageBase64}`;
                                  window.open(url, "_blank");
                                } catch { /* ignore */ }
                              }}
                              className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-brand-600 shadow-sm ring-1 ring-slate-200 hover:bg-brand-50 dark:bg-slate-700 dark:text-brand-300 dark:ring-slate-600"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDocDelete(type)}
                              disabled={busy}
                              className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-red-500 shadow-sm ring-1 ring-slate-200 hover:bg-red-50 dark:bg-slate-700 dark:ring-slate-600"
                            >
                              {busy ? "…" : <Icon.Trash className="h-3.5 w-3.5" />}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => { setPendingDocType(type); docInputRef.current?.click(); }}
                            disabled={busy}
                            className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600"
                          >
                            {busy ? "Uploading…" : <span className="flex items-center gap-1"><Icon.Upload className="h-3 w-3" />Upload</span>}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">My applications</h2>
            {hireMsg ? (
              <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                {hireMsg}
                <button onClick={() => setHireMsg(null)} className="ml-3 font-semibold hover:underline">Dismiss</button>
              </div>
            ) : null}
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
                    {a.status === "HIRED" && (a.proposedPay != null || a.joiningDate) ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {a.proposedPay != null ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <Icon.Wallet className="h-3 w-3" /> Proposed pay: ₹{a.proposedPay.toLocaleString("en-IN")}
                          </span>
                        ) : null}
                        {a.joiningDate ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <Icon.Clock className="h-3 w-3" /> Joining: {new Date(a.joiningDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                    {a.status === "HIRED" && a.hireStatus === "OFFERED" ? (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleHireRespond(a.id, "ACCEPTED")}
                          disabled={hireResponding === a.id}
                          className="flex-1 rounded-xl bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                          {hireResponding === a.id ? "…" : "Accept offer"}
                        </button>
                        <button
                          onClick={() => handleHireRespond(a.id, "REJECTED")}
                          disabled={hireResponding === a.id}
                          className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300"
                        >
                          Decline
                        </button>
                      </div>
                    ) : null}
                    {a.status === "HIRED" && a.hireStatus === "ACCEPTED" ? (
                      <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">✓ Offer accepted</p>
                    ) : null}
                    {a.status === "HIRED" && a.hireStatus === "REJECTED" ? (
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Offer declined</p>
                    ) : null}
                    {a.note ? (
                      <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                        "{a.note}"
                      </p>
                    ) : null}
                    {a.factoryPhone ? (
                      <div className="mt-3">
                        <a
                          href={`tel:${a.factoryPhone}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300"
                        >
                          <Icon.Phone className="h-3.5 w-3.5" /> Factory HR: {a.factoryPhone}
                        </a>
                      </div>
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
