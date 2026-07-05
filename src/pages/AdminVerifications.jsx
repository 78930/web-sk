import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getVerifications, updateVerification, getWorkerDocuments, getWorkerDocument } from "../services/admin";

const STATUS_TABS = [
  { value: "",           label: "All" },
  { value: "PENDING",    label: "Pending" },
  { value: "VERIFIED",   label: "Verified" },
  { value: "REJECTED",   label: "Rejected" },
  { value: "UNVERIFIED", label: "Unverified" },
];

function StatusBadge({ status }) {
  const config = {
    VERIFIED:   { bg: "bg-green-100 dark:bg-green-900/30",  text: "text-green-700 dark:text-green-300",  dot: "bg-green-500",  label: "Verified"   },
    PENDING:    { bg: "bg-amber-100 dark:bg-amber-900/30",   text: "text-amber-700 dark:text-amber-300",   dot: "bg-amber-500",  label: "Pending"    },
    REJECTED:   { bg: "bg-red-100 dark:bg-red-900/30",       text: "text-red-700 dark:text-red-300",       dot: "bg-red-500",    label: "Rejected"   },
    UNVERIFIED: { bg: "bg-slate-100 dark:bg-slate-800",      text: "text-slate-600 dark:text-slate-400",   dot: "bg-slate-400",  label: "Unverified" },
  };
  const c = config[status] || config.UNVERIFIED;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function RejectModal({ profile, onClose, onConfirm }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    await onConfirm(profile._id, "REJECT", note);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reject Verification</h3>
        <p className="mt-1 text-sm text-slate-500">
          Rejecting <strong>{profile.fullName}</strong>. Add a reason so the worker knows what to fix.
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Profile incomplete — please add skills and work experience."
          rows={3}
          className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <div className="mt-4 flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Rejecting…" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

const DOC_LABELS = {
  AADHAAR:         { label: "Aadhaar Card",           icon: "🪪" },
  PAN:             { label: "PAN Card",               icon: "💳" },
  DRIVING_LICENSE: { label: "Driver's Licence",       icon: "🚗" },
  BANK_PASSBOOK:   { label: "Bank Passbook / Cheque", icon: "🏦" },
  RESUME_PDF:      { label: "Resume PDF",             icon: "📄" },
};

function DocumentsModal({ workerId, workerName, onClose }) {
  const { token } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null); // type string being fetched

  useEffect(() => {
    getWorkerDocuments({ token, workerId })
      .then((res) => setDocs(res.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, workerId]);

  async function viewDoc(type) {
    setViewing(type);
    try {
      const res = await getWorkerDocument({ token, workerId, type });
      const binary = atob(res.imageBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: res.mimeType });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      alert("Could not load document. Please try again.");
    } finally {
      setViewing(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Documents</h3>
            <p className="mt-0.5 text-sm text-slate-500">{workerName}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-2">
          {loading ? (
            <div className="py-8 text-center text-sm text-slate-400">Loading documents…</div>
          ) : docs.length === 0 ? (
            <div className="rounded-xl bg-slate-50 py-8 text-center text-sm text-slate-400 dark:bg-slate-800">
              No documents uploaded yet.
            </div>
          ) : (
            docs.map((doc) => {
              const meta = DOC_LABELS[doc.type] || { label: doc.type, icon: "📎" };
              return (
                <div
                  key={doc.type}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{meta.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{meta.label}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(doc.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => viewDoc(doc.type)}
                    disabled={viewing === doc.type}
                    className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                  >
                    {viewing === doc.type ? "Opening…" : "View"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <button onClick={onClose} className="btn-secondary mt-5 w-full">Close</button>
      </div>
    </div>
  );
}

const DOC_TYPE_LABELS = {
  AADHAAR: "Aadhaar",
  PAN: "PAN",
  DRIVING_LICENSE: "DL",
  BANK_PASSBOOK: "Passbook",
  RESUME_PDF: "Resume",
};

function DocCountBadge({ count, types }) {
  if (count === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        No docs
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
      {count} doc{count !== 1 ? "s" : ""}
      {types?.length > 0 && (
        <span className="text-green-600/70 dark:text-green-500/70">
          · {types.map((t) => DOC_TYPE_LABELS[t] || t).join(", ")}
        </span>
      )}
    </span>
  );
}

function ProfileCard({ profile, onAction }) {
  const [showDocs, setShowDocs] = useState(false);
  const skills = profile.skills?.slice(0, 4) || [];
  const extra = (profile.skills?.length || 0) - 4;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-lg font-extrabold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
            {(profile.fullName || "W")[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 dark:text-white">{profile.fullName || "—"}</span>
              <StatusBadge status={profile.verificationStatus} />
            </div>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              {profile.userPhone ? (
                <a
                  href={`tel:${profile.userPhone}`}
                  className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
                >
                  {profile.userPhone}
                </a>
              ) : (
                <span className="text-xs text-slate-400">No phone</span>
              )}
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <DocCountBadge count={profile.docCount ?? 0} types={profile.docTypes ?? []} />
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Experience</p>
          <p className="text-slate-700 dark:text-slate-300">{profile.experienceYears ?? 0} years</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Availability</p>
          <p className="text-slate-700 dark:text-slate-300">{profile.availability || "—"}</p>
        </div>
        {profile.preferredAreas?.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Area</p>
            <p className="text-slate-700 dark:text-slate-300">{profile.preferredAreas[0]}</p>
          </div>
        )}
        {profile.preferredRoles?.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Role</p>
            <p className="text-slate-700 dark:text-slate-300">{profile.preferredRoles[0]}</p>
          </div>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span key={s} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/20 dark:text-brand-300">
              {s}
            </span>
          ))}
          {extra > 0 && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800">
              +{extra} more
            </span>
          )}
        </div>
      )}

      {/* Rejection note if any */}
      {profile.verificationStatus === "REJECTED" && profile.verificationNote && (
        <div className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
          <strong>Rejection reason:</strong> {profile.verificationNote}
        </div>
      )}

      {/* Actions */}
      {profile.verificationStatus === "PENDING" && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => onAction(profile._id, "APPROVE", "")}
            className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
          >
            ✓ Approve
          </button>
          <button
            onClick={() => onAction(profile._id, "REJECT_MODAL")}
            className="flex-1 rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
          >
            ✗ Reject
          </button>
        </div>
      )}
      {profile.verificationStatus === "VERIFIED" && (
        <button
          onClick={() => onAction(profile._id, "REJECT_MODAL")}
          className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400"
        >
          Revoke verification
        </button>
      )}

      {/* Documents button */}
      <button
        onClick={() => setShowDocs(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
      >
        📎 View Documents
        {(profile.docCount ?? 0) > 0 && (
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            {profile.docCount}
          </span>
        )}
      </button>

      {showDocs && (
        <DocumentsModal
          workerId={profile._id}
          workerName={profile.fullName || "Worker"}
          onClose={() => setShowDocs(false)}
        />
      )}
    </div>
  );
}

export default function AdminVerifications() {
  const { token } = useAuth();
  const [activeStatus, setActiveStatus] = useState("PENDING");
  const [profiles, setProfiles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);

  const load = useCallback(async (status, page = 1) => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await getVerifications({ token, status: status || undefined, page });
      setProfiles(res.items);
      setPagination(res.pagination);
    } catch (err) {
      setError(err?.message || "Failed to load verifications.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(activeStatus); }, [load, activeStatus]);

  async function handleAction(profileId, action, note) {
    if (action === "REJECT_MODAL") {
      const profile = profiles.find((p) => p._id === profileId);
      setRejectTarget(profile);
      return;
    }
    try {
      await updateVerification({ token, profileId, action, note });
      await load(activeStatus);
    } catch (err) {
      alert(err?.message || "Action failed.");
    }
  }

  async function handleRejectConfirm(profileId, action, note) {
    await handleAction(profileId, action, note);
    setRejectTarget(null);
  }

  const pendingCount = activeStatus === "PENDING" ? pagination?.total : null;

  return (
    <div className="container-page section">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Profile Verifications
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Review worker profiles and issue the verified badge.
        </p>
      </div>

      {/* Status tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveStatus(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeStatus === tab.value
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {tab.label}
            {tab.value === "PENDING" && pendingCount ? (
              <span className="ml-1.5 rounded-full bg-white/25 px-1.5 py-0.5 text-xs">{pendingCount}</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Content */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <span className="text-5xl">🔍</span>
          <p className="font-semibold text-slate-700 dark:text-slate-300">No profiles found</p>
          <p className="text-sm text-slate-500">
            {activeStatus === "PENDING"
              ? "No pending verification requests right now."
              : "No profiles match this filter."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <ProfileCard key={profile._id} profile={profile} onAction={handleAction} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => load(activeStatus, pagination.page - 1)}
                className="btn-secondary disabled:opacity-40"
              >
                ← Previous
              </button>
              <span className="flex items-center px-4 text-sm text-slate-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={!pagination.hasMore}
                onClick={() => load(activeStatus, pagination.page + 1)}
                className="btn-secondary disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {rejectTarget && (
        <RejectModal
          profile={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleRejectConfirm}
        />
      )}
    </div>
  );
}
