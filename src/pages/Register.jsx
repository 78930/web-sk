import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import { TextField } from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";

const BENEFITS = {
  worker: ["Build a verified worker profile", "Apply to jobs in one tap", "Track every application"],
  factory: ["Post jobs in minutes", "Search verified worker talent", "Shortlist and hire from a dashboard"],
};

function cleanError(msg) {
  if (!msg) return "Could not create account";
  return msg.replace(/^[a-zA-Z_]+:\s*/, "");
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState("worker");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setBusy(true);
    try {
      await register({ role, name: name.trim(), phone: phone.trim(), password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(cleanError(err.message));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Create account" path="/register" />
      <section className="section">
        <div className="container-page">
          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
            <div className="hidden flex-col justify-center lg:flex">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Join Sketu in under a minute
              </h1>
              <p className="mt-3 text-slate-600 dark:text-slate-300">
                Create a secure account with your phone number and password. Pick your role to get started.
              </p>
              <ul className="mt-8 space-y-3">
                {BENEFITS[role].map((b) => (
                  <li key={b} className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                      <Icon.Check className="h-4 w-4" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-8">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">It&apos;s free — no card required.</p>
              </div>
              <div className="mt-6">
                <span className="label-field">I want to join as a&hellip;</span>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "worker", label: "Worker", icon: Icon.Users, desc: "Looking for jobs" },
                    { id: "factory", label: "Factory", icon: Icon.Briefcase, desc: "Looking to hire" },
                  ].map((opt) => (
                    <button key={opt.id} type="button" onClick={() => setRole(opt.id)}
                      className={`rounded-xl border p-4 text-left transition-all ${role === opt.id ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/30" : "border-slate-200 hover:border-brand-300 dark:border-slate-700"}`}
                    >
                      <opt.icon className={`h-6 w-6 ${role === opt.id ? "text-brand-600 dark:text-brand-300" : "text-slate-400"}`} />
                      <div className="mt-2 font-semibold text-slate-900 dark:text-white">{opt.label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              {error ? (
                <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">{error}</p>
              ) : null}
              <form onSubmit={submit} className="mt-5 space-y-4">
                <TextField
                  label={role === "factory" ? "Company / HR name" : "Full name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === "factory" ? "e.g. Acme Industries" : "Your full name"}
                  required
                />
                <TextField
                  label="Phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  pattern="[6-9][0-9]{9}"
                  minLength={10}
                  maxLength={10}
                  title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9"
                  required
                />
                <div className="relative">
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Icon.EyeOff className="h-4 w-4" /> : <Icon.Eye className="h-4 w-4" />}
                  </button>
                </div>
                <button type="submit" disabled={busy} className="btn-primary w-full">
                  {busy ? "Creating account…" : "Create account"}
                </button>
              </form>
              <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">Log in</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
