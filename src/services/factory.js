import { apiRequest } from "../lib/api";
import { mapFactoryDashboardSummary, mapFactoryProfile, mapJob } from "../lib/mappers";

export async function getFactoryDashboard(token) {
  const response = await apiRequest("/api/factories/dashboard/summary", { token });
  return mapFactoryDashboardSummary(response);
}

export async function getFactoryProfile(token) {
  const response = await apiRequest("/api/factories/me/profile", { token });
  return mapFactoryProfile(response);
}

export async function updateFactoryProfile(token, payload) {
  const response = await apiRequest("/api/factories/me/profile", {
    method: "PUT",
    token,
    body: payload,
  });
  return mapFactoryProfile(response);
}

export async function listFactoryJobs(token, params = {}) {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  const response = await apiRequest(
    `/api/factories/jobs${search.toString() ? `?${search.toString()}` : ""}`,
    { token }
  );
  return response.items.map(mapJob);
}
