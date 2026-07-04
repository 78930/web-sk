import { apiRequest } from "../lib/api";

export async function getVerifications({ token, status, page = 1, limit = 20 }) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set("status", status);
  return apiRequest(`/api/admin/verifications?${params.toString()}`, { token });
}

export async function updateVerification({ token, profileId, action, note = "" }) {
  return apiRequest(`/api/admin/verifications/${profileId}`, {
    method: "PATCH",
    token,
    body: { action, note },
  });
}

export async function bootstrapAdmin({ secret, name, phone }) {
  return apiRequest("/api/admin/bootstrap", {
    method: "POST",
    body: { secret, name, phone },
  });
}

export async function getWorkerDocuments({ token, workerId }) {
  return apiRequest(`/api/admin/workers/${workerId}/documents`, { token });
}

export async function getWorkerDocument({ token, workerId, type }) {
  return apiRequest(`/api/admin/workers/${workerId}/documents/${type}`, { token });
}
