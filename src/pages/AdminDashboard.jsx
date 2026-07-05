import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAdminStats, getVerifications } from "../services/admin";
import Icon from "../components/ui/Icons";

function StatCard({ label, value, sub, color, icon: CardIcon }) {
  const colors = {
    blue:   { bg: "bg-brand-50 dark:bg-brand-900/20",   text: "text-brand-600 dark:text-brand-400",   val: "text-brand-700 dark:text-brand-300" },
    green:  { bg: "bg-green-50 dark:bg-green-900/20",   text: "text-green-600 dark:text-green-400",   val: "text-green-700 dark:text-green-300" },
    amber:  { bg: "bg-amber-50 dark:bg-amber-900/20",   text: "text-amber-600 dark:text-amber-400",   val: "text-amber-700 dark:text-amber-300" },
    slate:  { bg: "bg-slate-100 dark:bg-slate-800",      text: "text-slate-500 dark:text-slate-400",   val: "text-slate-700 dark:text-slate-300" },
    purple: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400", val: "text-purple-700 dark:text-purple-300" },
    red:    { bg: "bg-red-50 dark:bg-red-900/20",       text: "text-red-600 dark:text-red-400",       val: "text-red-700 dark:text-red-300" },
  };
  const c = colors[color] || colors.slate;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg}`}>
          <CardIcon className={`h-5 w-5 ${c.text}`} />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-extrabold tabular-nums text-slate-900 dark:text-white">
          {value ?? "—"}
        </p>
        <p className="mt-0.5 text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
        {sub && <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{sub}</p>}
      </div>
    </div>
  );
}

function VerifBadge({ status }) {
  const map = {
    PENDING:    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    VERIFIED:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    REJECTED:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    UNVERIFIED: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status] || map.UNVERIFIED}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

const DOC_LABELS = {
  AADHAAR: "Aadhaar", PAN: "PAN", DRIVING_LICENSE: "DL",
  BANK_PASSBOOK: "Passbook", RESUME_PDF: "Resume",
};

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const [s, r] = await Promise.all([
        getAdminStats({ token }),
        getVerifications({ token, status: "PENDING", limit: 5 }),
      ]);
      setStats(s);
      setRecent(r.items || []);
    } catch {
      // ignore
    } finally {
      setLoadingStats(false);
      setLoadingRecent(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const v = stats?.verifications || {};

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Welcome back{user?.name ? `, ${user.name}` : ""}. Here's what's happening on the platform.
        </p>
      </div>

      {/* Stats grid */}
      {loadingStats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total Workers"
            value={stats?.totalWorkers}
            sub={`${v.VERIFIED || 0} verified`}
            color="blue"
            icon={Icon.Users}
          />
          <StatCard
            label="Total Factories"
            value={stats?.totalFactories}
            color="purple"
            icon={(p) => <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}><path d="M2 20V9l6-5v5l6-5v5l6-5v11a1 1 0 01-1 1H3a1 1 0 01-1-1z" /></svg>}
          />
          <StatCard
            label="Open Jobs"
            value={stats?.openJobs}
            sub={`${stats?.totalJobs || 0} total posted`}
            color="green"
            icon={Icon.Briefcase}
          />
          <StatCard
            label="Total Applications"
            value={stats?.totalApplications}
            sub={`${stats?.hired || 0} hired`}
            color="slate"
            icon={Icon.Inbox}
          />
          <StatCard
            label="Pending Verification"
            value={v.PENDING || 0}
            sub="Awaiting admin review"
            color="amber"
            icon={Icon.Clock}
          />
          <StatCard
            label="Verified Workers"
            value={v.VERIFIED || 0}
            sub={`${v.REJECTED || 0} rejected`}
            color="green"
            icon={Icon.CheckCircle}
          />
        </div>
      )}

      {/* Verification status breakdown */}
      {stats && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Verification breakdown</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              { label: "Unverified", key: "UNVERIFIED", color: "bg-slate-400" },
              { label: "Pending",    key: "PENDING",    color: "bg-amber-400" },
              { label: "Verified",   key: "VERIFIED",   color: "bg-green-500" },
              { label: "Rejected",   key: "REJECTED",   color: "bg-red-500"  },
            ].map(({ label, key, color }) => {
              const count = v[key] || 0;
              const total = Object.values(v).reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {label}: <strong className="text-slate-900 dark:text-white">{count}</strong>
                    <span className="ml-1 text-xs text-slate-400">({pct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
          {/* Progress bar */}
          {(() => {
            const total = Object.values(v).reduce((a, b) => a + b, 0) || 1;
            return (
              <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                {[
                  { key: "UNVERIFIED", color: "bg-slate-400" },
                  { key: "PENDING",    color: "bg-amber-400" },
                  { key: "VERIFIED",   color: "bg-green-500" },
                  { key: "REJECTED",   color: "bg-red-500"  },
                ].map(({ key, color }) => {
                  const pct = ((v[key] || 0) / total) * 100;
                  return pct > 0 ? (
                    <div key={key} className={`${color}`} style={{ width: `${pct}%` }} />
                  ) : null;
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* Recent pending verifications */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Pending verifications
            {v.PENDING > 0 && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                {v.PENDING}
              </span>
            )}
          </h2>
          <Link
            to="/admin/verifications"
            className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            View all <Icon.ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loadingRecent ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
            <Icon.CheckCircle className="h-8 w-8 text-green-400" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No pending verifications</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            {recent.map((profile, idx) => (
              <div
                key={profile._id}
                className={`flex items-center justify-between gap-4 px-5 py-4 ${
                  idx < recent.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-sm font-extrabold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    {(profile.fullName || "W")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {profile.fullName || "Unknown"}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {profile.userPhone && (
                        <span className="text-xs text-slate-400">{profile.userPhone}</span>
                      )}
                      {(profile.docCount ?? 0) > 0 && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {profile.docCount} doc{profile.docCount !== 1 ? "s" : ""}
                          {profile.docTypes?.length > 0 && (
                            <span className="text-green-500/70"> · {profile.docTypes.map(t => DOC_LABELS[t] || t).join(", ")}</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <VerifBadge status={profile.verificationStatus} />
                  <Link
                    to="/admin/verifications"
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
