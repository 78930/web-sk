import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  login as loginService,
  register as registerService,
  loginWithOtp as loginWithOtpService,
  requestLoginOtp as requestLoginOtpService,
  getMe,
} from "../services/auth";
import { clearSession, loadSession, saveSession } from "../lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Restore a saved session on first load and re-validate it against the API.
  useEffect(() => {
    const session = loadSession();
    if (!session) {
      setInitializing(false);
      return;
    }
    setToken(session.token);
    setUser(session.user);
    getMe(session.token)
      .then((fresh) => {
        setUser(fresh.user);
        setProfile(fresh.profile);
        saveSession(session.token, fresh.user);
      })
      .catch((err) => {
        // Only evict session on confirmed 401 — network errors keep the user logged in
        if (err?.status === 401) {
          clearSession();
          setToken(null);
          setUser(null);
          setProfile(null);
        }
      })
      .finally(() => setInitializing(false));
  }, []);

  const persist = useCallback((session) => {
    setToken(session.token);
    setUser(session.user);
    setProfile(session.profile);
    saveSession(session.token, session.user);
    return session;
  }, []);

  const login = useCallback((payload) => loginService(payload).then(persist), [persist]);
  const register = useCallback((payload) => registerService(payload).then(persist), [persist]);
  const loginWithOtp = useCallback(
    (payload) => loginWithOtpService(payload).then(persist),
    [persist]
  );
  const requestLoginOtp = useCallback((payload) => requestLoginOtpService(payload), []);

  const refreshProfile = useCallback(async () => {
    if (!token) return null;
    const fresh = await getMe(token);
    setUser(fresh.user);
    setProfile(fresh.profile);
    saveSession(token, fresh.user);
    return fresh;
  }, [token]);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      profile,
      setProfile,
      initializing,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      loginWithOtp,
      requestLoginOtp,
      refreshProfile,
      logout,
    }),
    [token, user, profile, initializing, login, register, loginWithOtp, requestLoginOtp, refreshProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
