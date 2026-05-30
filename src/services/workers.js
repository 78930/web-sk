import { apiRequest } from "../lib/api";
import { mapWorker, mapWorkerProfile } from "../lib/mappers";

export async function searchWorkers(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const response = await apiRequest(`/api/workers/search?${search.toString()}`);
  return response.items.map(mapWorker);
}

export async function getWorkerProfile(token) {
  const response = await apiRequest("/api/workers/me/profile", { token });
  return mapWorkerProfile(response);
}

export async function updateWorkerProfile(token, payload) {
  const response = await apiRequest("/api/workers/me/profile", {
    method: "PUT",
    token,
    body: payload,
  });
  return mapWorkerProfile(response);
}

export async function listMyApplications(token) {
  const { mapJobApplication } = await import("../lib/mappers");
  const response = await apiRequest("/api/workers/me/applications", { token });
  return response.items.map(mapJobApplication);
}
