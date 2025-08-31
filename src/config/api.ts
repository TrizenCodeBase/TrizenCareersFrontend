import { ENV_CONFIG } from './environment';

// API Configuration
const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    HEALTH: `${API_BASE_URL}/api/health`,
    APPLICATIONS: `${API_BASE_URL}/api/v1/applications`,
    USERS: {
      REGISTER: `${API_BASE_URL}/api/v1/users/register`,
      LOGIN: `${API_BASE_URL}/api/v1/users/login`,
      PROFILE: `${API_BASE_URL}/api/v1/users/profile`,
    },
  },
};

export default API_CONFIG;
