import { apiRequest } from "../lib/api";
import { mapJob } from "../lib/mappers";

export async function listJobs(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const response = await apiRequest(`/api/jobs?${search.toString()}`);
  return response.items.map(mapJob);
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

export async function applyToJob(token, jobId, note) {
  return apiRequest(`/api/jobs/${jobId}/apply`, {
    method: "POST",
    token,
    body: note ? { note } : {},
  });
}
