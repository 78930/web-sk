import { apiRequest } from "../lib/api";
import { mapAuthUser, mapFactoryProfile, mapWorkerProfile } from "../lib/mappers";

// role: "worker" | "factory"  -> backend expects "WORKER" | "FACTORY"
function apiRole(role) {
  return role === "factory" ? "FACTORY" : "WORKER";
}

export async function login({ role, name, phone }) {
  const auth = await apiRequest("/api/auth/login", {
    method: "POST",
    body: { role: apiRole(role), name, phone },
  });
  const me = await getMe(auth.token);
  return {
    token: auth.token,
    user: mapAuthUser({ user: auth.user, profile: me.profile }),
    profile: me.profile,
  };
}

export async function register({ role, name, phone }) {
  const auth = await apiRequest("/api/auth/register", {
    method: "POST",
    body: { role: apiRole(role), name, phone },
  });
  const me = await getMe(auth.token);
  return {
    token: auth.token,
    user: mapAuthUser({ user: auth.user, profile: me.profile }),
    profile: me.profile,
  };
}

export async function requestLoginOtp({ phone }) {
  return apiRequest("/api/auth/request-otp", {
    method: "POST",
    body: { phone },
  });
}

export async function loginWithOtp({ phone, otp }) {
  const auth = await apiRequest("/api/auth/verify-login-otp", {
    method: "POST",
    body: { phone, otp },
  });
  const me = await getMe(auth.token);
  return {
    token: auth.token,
    user: mapAuthUser({ user: auth.user, profile: me.profile }),
    profile: me.profile,
  };
}

export async function adminLogin({ phone, secret }) {
  const auth = await apiRequest("/api/admin/login", {
    method: "POST",
    body: { phone, secret },
  });
  return {
    token: auth.token,
    user: mapAuthUser({ user: auth.user, profile: null }),
    profile: null,
  };
}

export async function getMe(token) {
  const result = await apiRequest("/api/auth/me", { token });
  const type = result.user.role === "FACTORY" ? "factory" : result.user.role === "ADMIN" ? "admin" : "worker";
  const profile = result.profile
    ? type === "factory"
      ? mapFactoryProfile(result.profile)
      : type === "admin"
      ? null
      : mapWorkerProfile(result.profile)
    : null;

  return {
    user: mapAuthUser({ user: result.user, profile }),
    profile,
  };
}
