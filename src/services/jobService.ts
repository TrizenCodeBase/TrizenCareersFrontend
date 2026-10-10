import { API_CONFIG } from '@/config/api';
import initialJobsData from '@/data/jobs.json';

export interface Job {
  id: string;
  title: string;
  slug: string;
  location: string;
  type: string;
  category: string;
  shortDescription: string;
  description: string;
  applicationPrompt?: string;
  tags?: string[];
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  selectionProcess?: string[];
  preferredExperience?: string[];
  kpis?: string[];
  idealCandidate?: string;
  duration?: string;
  startDate?: string;
  applicationDeadline?: string;
  postedDate?: string;
  status?: string;
  closedDate?: string | null;
  [key: string]: any;
}

const fallbackJobs: Job[] = [
  ...(((initialJobsData as any).jobs || []).map((j: any) => ({ ...j, status: j.status || 'published' }))),
  ...(((initialJobsData as any).archivedJobs || []).map((j: any) => ({ ...j, status: 'closed' }))),
];

let cachedJobs: Job[] | null = null;

/**
 * Fetches all jobs from TrizenCareersBackend.
 * Falls back to local jobs.json data if the backend is temporarily unreachable.
 */
export async function getJobs(forceRefresh = false): Promise<Job[]> {
  if (cachedJobs && !forceRefresh) {
    return cachedJobs;
  }

  try {
    const res = await fetch(API_CONFIG.ENDPOINTS.JOBS);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      cachedJobs = json.data;
      return json.data;
    }
  } catch (err) {
    console.warn('Could not fetch jobs from backend, using fallback data:', err);
  }

  cachedJobs = fallbackJobs;
  return fallbackJobs;
}

/**
 * Fetches a single job by its ID or slug from TrizenCareersBackend.
 */
export async function getJobByIdOrSlug(idOrSlug: string): Promise<Job | null> {
  if (!idOrSlug) return null;

  const trimmed = idOrSlug.trim();
  const pattern = /^TV-[A-Z]+-[A-Z]+-\d{4}-\d{3}/i;
  const match = trimmed.match(pattern);
  const normalizedId = match ? match[0].toUpperCase() : trimmed;

  try {
    const res = await fetch(API_CONFIG.ENDPOINTS.jobById(normalizedId));
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn(`Could not fetch job ${normalizedId} from backend:`, err);
  }

  // Fallback to checking cached or initial jobs
  const jobs = cachedJobs || fallbackJobs;
  const found = jobs.find((j) =>
    j.id === normalizedId ||
    j.id?.toLowerCase() === normalizedId.toLowerCase() ||
    j.slug === idOrSlug ||
    j.slug?.toLowerCase() === idOrSlug.toLowerCase() ||
    `${j.id}-${j.slug}`.toLowerCase() === idOrSlug.toLowerCase()
  );

  return found || null;
}
