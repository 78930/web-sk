import { apiRequest } from "../lib/api";
import { mapWorker, mapWorkerProfile, mapJobApplication } from "../lib/mappers";

export async function searchWorkers(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  });
  const response = await apiRequest(`/api/workers/search?${search.toString()}`);
  return { items: response.items.map(mapWorker), pagination: response.pagination };
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

export async function getWorkerById(id) {
  const response = await apiRequest(`/api/workers/${id}`);
  return mapWorker(response);
}

export async function listMyApplications(token) {
  const response = await apiRequest("/api/workers/me/applications", { token });
  return response.items.map(mapJobApplication);
}
