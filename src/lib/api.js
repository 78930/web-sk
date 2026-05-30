// Web port of mobile-app/lib/api.ts — same request/error contract,
// adapted to read the base URL from Vite env instead of Expo Constants.

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function resolveApiBaseUrl() {
  // Empty in dev -> requests hit "/api" and Vite proxies them to the backend.
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  return String(fromEnv || "").replace(/\/$/, "");
}

export const API_BASE_URL = resolveApiBaseUrl();

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const data = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    throw new ApiError(getErrorMessage(data), response.status, data);
  }

  return data;
}

function getErrorMessage(data) {
  if (typeof data !== "object" || !data) {
    return "Request failed";
  }
  const payload = data;

  if (Array.isArray(payload.issues) && payload.issues.length > 0) {
    const details = payload.issues
      .map((issue) => {
        const field = issue.path?.length ? String(issue.path.join(".")) : "field";
        return issue.message ? `${field}: ${issue.message}` : field;
      })
      .join("; ");
    return details || (typeof payload.message === "string" ? payload.message : "Request failed");
  }

  return typeof payload.message === "string" ? payload.message : "Request failed";
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
