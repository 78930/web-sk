import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import { TextField } from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAsAdmin, isAuthenticated, user } = useAuth();

  const [phone, setPhone] = useState("");
  const [secret, setSecret] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.type === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await loginAsAdmin({ phone: phone.trim(), secret: secret.trim() });
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Check phone and secret.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Admin Login" path="/admin/login" />
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-sm">
            <div className="card p-8">
              <div className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white">
                  <Icon.Shield className="h-6 w-6" />
                </span>
                <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                  Admin Login
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Restricted access — Sketu administrators only
                </p>
              </div>

              {error && (
                <div className="alert-error mt-5 rounded-xl">
                  <Icon.Alert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={submit} className="mt-6 space-y-4">
                <TextField
                  label="Admin phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit number"
                  required
                />
                <TextField
                  label="Admin secret"
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Admin secret key"
                  required
                />
                <button type="submit" disabled={busy} className="btn-primary w-full bg-amber-500 hover:bg-amber-600 focus:ring-amber-400">
                  {busy ? "Logging in…" : "Log in as Admin"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Not an admin?{" "}
                <Link to="/login" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
                  Worker / Factory login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
