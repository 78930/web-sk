// Web port of mobile-app/lib/mappers.ts. Normalises raw API documents into
// view-friendly objects. Kept field-for-field compatible with the mobile app.

export function roleToUserType(role) {
  return role === "FACTORY" ? "factory" : "worker";
}

export function mapAuthUser(input) {
  const profile = input.profile || undefined;
  const type = roleToUserType(input.user.role);
  const fallbackName = type === "factory" ? "Factory User" : "Worker User";

  const name =
    type === "factory"
      ? profile?.companyName || profile?.hrName || fallbackName
      : profile?.fullName || fallbackName;

  return {
    id: String(input.user.id || input.user._id || ""),
    name,
    email: input.user.email,
    phone: input.user.phone,
    type,
    role: input.user.role,
  };
}

export function mapJob(item) {
  const companyName = item?.factoryProfile?.companyName || item?.companyName || "Factory";
  const payMin = Number(item?.payMin || 0);
  const payMax = Number(item?.payMax || 0);
  return {
    id: String(item?._id || item?.id || ""),
    company: companyName,
    companyName,
    area: item?.area || "",
    role: item?.title || item?.role || "",
    title: item?.title || item?.role || "",
    shift: item?.shift || "",
    pay: formatPay(payMin, payMax),
    payMin,
    payMax,
    skills: arr(item?.skillsRequired) || arr(item?.skills) || [],
    skillsRequired: arr(item?.skillsRequired) || arr(item?.skills) || [],
    description: item?.description || "",
    status: item?.status || "OPEN",
    employmentType: item?.employmentType || "Full-time",
    factoryDescription: item?.factoryProfile?.description || "",
    createdAt: item?.createdAt || "",
  };
}

export function mapWorker(item) {
  const experienceYears = Number(item?.experienceYears || 0);
  const salaryMin = Number(item?.salaryMin || 0);
  const preferredAreas = arr(item?.preferredAreas) || [];
  const preferredRoles = arr(item?.preferredRoles) || [];
  const preferredShifts = arr(item?.preferredShifts) || [];
  return {
    id: String(item?._id || item?.id || ""),
    name: item?.fullName || "Worker",
    fullName: item?.fullName || "Worker",
    area: preferredAreas[0] || "Not specified",
    preferredAreas,
    role: preferredRoles[0] || "Not specified",
    preferredRoles,
    experience: `${experienceYears || 0} years`,
    experienceYears,
    shift: preferredShifts[0] || "Any",
    preferredShifts,
    salaryPreference: salaryMin > 0 ? `₹${salaryMin}+` : "Negotiable",
    salaryMin,
    availability: item?.availability || "Available",
    headline: item?.headline || "",
    skills: arr(item?.skills) || [],
    certifications: arr(item?.certifications) || [],
    availableNow: item?.isOpenToWork ?? true,
    isOpenToWork: item?.isOpenToWork ?? true,
  };
}

export function mapWorkerProfile(item) {
  return {
    id: String(item?._id || item?.id || ""),
    fullName: item?.fullName || "",
    headline: item?.headline || "",
    skills: arr(item?.skills) || [],
    preferredRoles: arr(item?.preferredRoles) || [],
    experienceYears: Number(item?.experienceYears || 0),
    certifications: arr(item?.certifications) || [],
    preferredAreas: arr(item?.preferredAreas) || [],
    preferredShifts: arr(item?.preferredShifts) || [],
    salaryMin: Number(item?.salaryMin || 0),
    availability: item?.availability || "",
    isOpenToWork: item?.isOpenToWork ?? true,
  };
}

export function mapFactoryProfile(item) {
  return {
    id: String(item?._id || item?.id || ""),
    companyName: item?.companyName || "",
    hrName: item?.hrName || "",
    industrialAreas: arr(item?.industrialAreas) || [],
    companySize: item?.companySize || "",
    description: item?.description || "",
  };
}

export function mapFactoryDashboardSummary(item) {
  return {
    openJobs: Number(item?.openJobs || 0),
    totalApplications: Number(item?.totalApplications || 0),
    shortlisted: Number(item?.shortlisted || 0),
    hires: Number(item?.hires || 0),
  };
}

export function mapJobApplication(item) {
  return {
    id: String(item?._id || item?.id || ""),
    jobId: String(item?.job?._id || item?.job || ""),
    workerUserId: item?.workerUser ? String(item.workerUser) : undefined,
    status: item?.status || "APPLIED",
    note: item?.note || "",
    createdAt: item?.createdAt || "",
    updatedAt: item?.updatedAt || "",
    worker: mapWorker(item?.workerProfile || {}),
    job: item?.job && typeof item.job === "object" ? mapJob(item.job) : undefined,
  };
}

function formatPay(payMin, payMax) {
  if (payMin > 0 && payMax > 0) return `₹${payMin}–₹${payMax}`;
  if (payMin > 0) return `₹${payMin}+`;
  if (payMax > 0) return `Up to ₹${payMax}`;
  return "Negotiable";
}

function arr(value) {
  return Array.isArray(value) ? value : null;
}
