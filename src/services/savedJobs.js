const KEY = "sketu.saved-jobs";

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function write(map) {
  localStorage.setItem(KEY, JSON.stringify(map));
}

export function isJobSaved(jobId) {
  return Boolean(read()[jobId]);
}

export function toggleSavedJob(job) {
  const map = read();
  const wasSaved = Boolean(map[job.id]);
  if (wasSaved) {
    delete map[job.id];
  } else {
    map[job.id] = { jobId: job.id, savedAt: new Date().toISOString(), job };
  }
  write(map);
  return !wasSaved;
}

export function listSavedJobs() {
  return Object.values(read()).sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1));
}
