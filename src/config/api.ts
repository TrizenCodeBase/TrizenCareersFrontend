import { ENV_CONFIG } from './environment';

// API Configuration
const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

function join(baseUrl: string, path: string) {
  if (!baseUrl) return path; // dev: rely on Vite proxy / same-origin
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    HEALTH: join(API_BASE_URL, '/api/health'),
    APPLICATIONS: join(API_BASE_URL, '/api/v1/applications'),
    APPLICATIONS_UPLOAD_RESUME: join(API_BASE_URL, '/api/v1/applications/upload-resume'),
    USERS: {
      REGISTER: join(API_BASE_URL, '/api/v1/users/register'),
      LOGIN: join(API_BASE_URL, '/api/v1/users/login'),
      PROFILE: join(API_BASE_URL, '/api/v1/users/profile'),
    },
  },
};

if (typeof window !== 'undefined' && import.meta.env.PROD) {
  // Helps verify deployed bundles are using the intended API host.
  console.info('[API_CONFIG] BASE_URL =', API_CONFIG.BASE_URL);
}

export default API_CONFIG;
