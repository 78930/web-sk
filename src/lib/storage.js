// Browser session persistence. Replaces the mobile app's SecureStore with
// localStorage so the auth token + user survive page reloads.

const TOKEN_KEY = "sketu.token";
const USER_KEY = "sketu.user";

export function saveSession(token, user) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* storage unavailable (private mode) — fall back to in-memory only */
  }
}

export function loadSession() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);
    if (!token || !rawUser) return null;
    return { token, user: JSON.parse(rawUser) };
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}
