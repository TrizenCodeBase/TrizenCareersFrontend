// Environment Configuration
const DEFAULT_PROD_API_BASE_URL = 'https://trizen-careers-backend.llp.trizenventures.com';

function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim();
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
}

function resolveApiBaseUrl(): string {
  const fromEnv = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
  const mode = import.meta.env.MODE || 'production';

  // In development, allow empty string so Vite proxy can be used (avoids CORS)
  if (mode === 'development') return normalizeBaseUrl(fromEnv);

  // Use environment variable if provided, otherwise use default
  if (fromEnv) return normalizeBaseUrl(fromEnv);

  return normalizeBaseUrl(DEFAULT_PROD_API_BASE_URL);
}

function resolveHackathonApiBaseUrl(): string {
  const fromEnv = (import.meta.env.VITE_HACKATHON_API_URL as string | undefined) ?? '';
  if (fromEnv) return normalizeBaseUrl(fromEnv);
  return import.meta.env.MODE === 'development' ? 'http://localhost:4000' : '';
}

export const ENV_CONFIG = {
  // API Base URL - configure in .env file (VITE_API_BASE_URL)
  // In development, leave empty to use Vite proxy (avoids CORS)
  API_BASE_URL: resolveApiBaseUrl(),

  // Hyderabad Founder Circle backend (hackathon problem statements) - VITE_HACKATHON_API_URL.
  // When empty, applicants type their problem statement instead of picking from the list.
  HACKATHON_API_BASE_URL: resolveHackathonApiBaseUrl(),

  // Email Service Configuration - configure in .env file
  EMAIL_SERVICE: {
    BASE_URL: import.meta.env.VITE_EMAIL_SERVICE_URL || 'https://trizensupportemailservice.llp.trizenventures.com',
    API_KEY: import.meta.env.VITE_EMAIL_SERVICE_API_KEY || 'trizen-support-email-2024-secure-key-xyz789',
    FROM_EMAIL: import.meta.env.VITE_EMAIL_FROM || 'careers@trizenventures.com',
    FROM_NAME: import.meta.env.VITE_EMAIL_FROM_NAME || 'Trizen Ventures Careers'
  },

  // Environment
  NODE_ENV: import.meta.env.MODE || 'production',

  // Is Development
  IS_DEV: import.meta.env.MODE === 'development',

  // Is Production
  IS_PROD: import.meta.env.MODE === 'production',
};

export default ENV_CONFIG;

