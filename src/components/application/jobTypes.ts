export const LEGACY_SMM_JOB_IDS = ['TV-MKT-SMM-2025-003', 'TV-MKT-SMM-2026-003'] as const;
export const CONTENT_SOCIAL_MEDIA_JOB_IDS = ['TV-MKT-CSM-2026-004', 'TV-MKT-CSMI-2026-006'] as const;
export const GROWTH_MARKETING_JOB_IDS = ['TV-MKT-GME-2026-003', 'TV-MKT-GMI-2026-005'] as const;
export const MERN_INTERN_JOB_IDS = [
  'TV-WEB-MERN-2025-005',
  'TV-WEB-MERN-2025-002',
  'TV-WEB-MERN-2026-005',
  'TV-WEB-MERN-2026-002',
  'TV-WEB-MERN-2026-008'
] as const;
export const MERN_FULLTIME_JOB_IDS = ['TV-WEB-MERN-2026-007'] as const;
export const MERN_JOB_IDS = [...MERN_INTERN_JOB_IDS, ...MERN_FULLTIME_JOB_IDS] as const;

export const ENGINEERING_FULLTIME_JOB_IDS = [
  'TV-AI-AUT-2026-001',
  'TV-WEB-MERN-2026-007'
] as const;

export const ENGINEERING_INTERN_JOB_IDS = [
  'TV-AIML-INT-2025-001',
  'TV-AIML-INT-2026-001',
  'TV-AI-FS-2026-002',
  ...MERN_INTERN_JOB_IDS
] as const;

/** Active listings from jobs.json (open roles) */
export const ACTIVE_JOB_IDS = [
  'TV-AI-AUT-2026-001',
  'TV-AI-FS-2026-002',
  'TV-MKT-GME-2026-003',
  'TV-MKT-CSM-2026-004',
  'TV-MKT-GMI-2026-005',
  'TV-MKT-CSMI-2026-006',
  'TV-WEB-MERN-2026-007',
  'TV-WEB-MERN-2026-008'
] as const;

export type JobFormType = 'legacy-smm' | 'content-social' | 'growth-marketing' | 'engineering';

export function getJobFormType(jobId: string | undefined): JobFormType {
  if (!jobId) return 'engineering';
  if ((LEGACY_SMM_JOB_IDS as readonly string[]).includes(jobId)) return 'legacy-smm';
  if ((CONTENT_SOCIAL_MEDIA_JOB_IDS as readonly string[]).includes(jobId)) return 'content-social';
  if ((GROWTH_MARKETING_JOB_IDS as readonly string[]).includes(jobId)) return 'growth-marketing';
  return 'engineering';
}

export function isMarketingIntern(jobId: string | undefined): boolean {
  return jobId === 'TV-MKT-GMI-2026-005' || jobId === 'TV-MKT-CSMI-2026-006';
}

export function isMernJob(jobId: string | undefined): boolean {
  if (!jobId) return false;
  return (MERN_JOB_IDS as readonly string[]).includes(jobId);
}

export function isMernInternJob(jobId: string | undefined): boolean {
  if (!jobId) return false;
  return (MERN_INTERN_JOB_IDS as readonly string[]).includes(jobId);
}

export function isMernFullTimeJob(jobId: string | undefined): boolean {
  if (!jobId) return false;
  return (MERN_FULLTIME_JOB_IDS as readonly string[]).includes(jobId);
}

export function isEngineeringFullTimeJob(jobId: string | undefined): boolean {
  if (!jobId) return false;
  return (ENGINEERING_FULLTIME_JOB_IDS as readonly string[]).includes(jobId);
}

export function isEngineeringInternJob(jobId: string | undefined): boolean {
  if (!jobId) return false;
  return (ENGINEERING_INTERN_JOB_IDS as readonly string[]).includes(jobId);
}

/** Year of passing out is collected for interns and MERN full-time, not AI automation full-time. */
export function requiresYearOfPassingOut(jobId: string | undefined): boolean {
  if (!jobId) return true;
  if (isMernFullTimeJob(jobId)) return true;
  if (isEngineeringFullTimeJob(jobId)) return false;
  return true;
}

const JOB_ID_PATTERN = /^TV-[A-Z]+-[A-Z]+-\d{4}-\d{3}$/;

export function normalizeJobId(rawJobId?: string): string | undefined {
  if (!rawJobId) return undefined;
  const trimmed = rawJobId.trim();
  if (JOB_ID_PATTERN.test(trimmed)) return trimmed;
  const parts = trimmed.split('-');
  if (parts.length >= 5) {
    const candidate = parts.slice(0, 5).join('-');
    if (JOB_ID_PATTERN.test(candidate)) return candidate;
  }
  return trimmed;
}
