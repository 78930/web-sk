import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import { TextField } from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";

function RoleToggle({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      {[
        { id: "worker", label: "I'm a worker" },
        { id: "factory", label: "I'm a factory" },
      ].map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            value === opt.id
              ? "bg-white text-brand-700 shadow-sm dark:bg-slate-950 dark:text-brand-300"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, requestLoginOtp, loginWithOtp } = useAuth();
  const redirectTo = location.state?.from || "/dashboard";

  const [mode, setMode] = useState("name"); // "name" | "otp"
  const [role, setRole] = useState("worker");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const submitName = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login({ role, name: name.trim(), phone: phone.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      const res = await requestLoginOtp({ phone: phone.trim() });
      setOtpSent(true);
      setInfo(res.message || "OTP sent.");
    } catch (err) {
      setError(err.message || "Could not send OTP");
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await loginWithOtp({ phone: phone.trim(), otp: otp.trim() });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Log in" path="/login" />
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-md">
            <div className="card p-8">
              <div className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Icon.Briefcase className="h-6 w-6" />
                </span>
                <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Log in to your Sketu account
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                {[
                  { id: "name", label: "Name + phone" },
                  { id: "otp", label: "Phone OTP" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMode(m.id);
                      setError(null);
                    }}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      mode === m.id
                        ? "bg-white text-brand-700 shadow-sm dark:bg-slate-950 dark:text-brand-300"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {error ? (
                <div className="alert-error mt-5 rounded-xl">
                  <Icon.Alert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              ) : null}

              {mode === "name" ? (
                <form onSubmit={submitName} className="mt-5 space-y-4">
                  <div>
                    <span className="label-field">I am a…</span>
                    <RoleToggle value={role} onChange={setRole} />
                  </div>
                  <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} placeholder="As registered" required />
                  <TextField label="Phone number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit number" required />
                  <div className="relative">
                    <TextField
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
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
                    {busy ? "Logging in…" : "Log in"}
                  </button>
                </form>
              ) : (
                <div className="mt-5 space-y-4">
                  <form onSubmit={otpSent ? verifyOtp : sendOtp} className="space-y-4">
                    <TextField label="Phone number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Registered phone" required disabled={otpSent} />
                    {otpSent ? (
                      <TextField label="Enter OTP" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" hint={info} required />
                    ) : info ? (
                      <p className="text-xs text-slate-400">{info}</p>
                    ) : null}
                    <button type="submit" disabled={busy} className="btn-primary w-full">
                      {busy ? "Please wait…" : otpSent ? "Verify & log in" : "Send OTP"}
                    </button>
                  </form>
                  {otpSent ? (
                    <button onClick={() => { setOtpSent(false); setOtp(""); setInfo(null); }} className="btn-ghost w-full text-sm">
                      Change phone number
                    </button>
                  ) : null}
                </div>
              )}

              <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                New to Sketu?{" "}
                <Link to="/register" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
