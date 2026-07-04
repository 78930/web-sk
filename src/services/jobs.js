import { apiRequest } from "../lib/api";
import { mapJob } from "../lib/mappers";

export async function listJobs(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  });
  const response = await apiRequest(`/api/jobs?${search.toString()}`);
  return { items: response.items.map(mapJob), pagination: response.pagination };
}

export async function getJobDetails(jobId) {
  const response = await apiRequest(`/api/jobs/${jobId}`);
  return mapJob(response);
}

export async function createJob(token, payload) {
  const response = await apiRequest("/api/jobs", {
    method: "POST",
    token,
    body: payload,
  });
  return mapJob(response);
}

export async function updateJob(token, jobId, payload) {
  const response = await apiRequest(`/api/jobs/${jobId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
  return mapJob(response);
}

export async function updateJobStatus(token, jobId, status) {
  const response = await apiRequest(`/api/jobs/${jobId}`, {
    method: "PATCH",
    token,
    body: { status },
  });
  return mapJob(response);
}

export async function applyToJob(token, jobId, note) {
  return apiRequest(`/api/jobs/${jobId}/apply`, {
    method: "POST",
    token,
    body: note ? { note } : {},
  });
}
