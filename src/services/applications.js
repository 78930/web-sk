import { apiRequest } from "../lib/api";
import { mapJobApplication } from "../lib/mappers";

export async function listJobApplications(token, jobId) {
  const response = await apiRequest(`/api/jobs/${jobId}/applications`, { token });
  return response.items.map(mapJobApplication);
}

export async function listMyApplications(token) {
  const response = await apiRequest("/api/workers/me/applications", { token });
  return response.items.map(mapJobApplication);
}

export async function shortlistApplication(token, applicationId) {
  const response = await apiRequest(`/api/applications/${applicationId}/shortlist`, {
    method: "POST",
    token,
  });
  return mapJobApplication(response);
}

export async function hireApplication(token, applicationId, payload) {
  return apiRequest(`/api/applications/${applicationId}/hire`, {
    method: "POST",
    token,
    body: payload,
  });
}

export async function rejectApplication(token, applicationId) {
  const response = await apiRequest(`/api/applications/${applicationId}/reject`, {
    method: "POST",
    token,
  });
  return mapJobApplication(response);
}

export async function shortlistWorkerForJob(token, jobId, workerProfileId) {
  const response = await apiRequest(`/api/jobs/${jobId}/shortlist-worker`, {
    method: "POST",
    token,
    body: { workerProfileId },
  });
  return mapJobApplication(response);
}
