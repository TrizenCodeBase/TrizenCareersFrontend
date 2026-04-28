// Environment Configuration
export const ENV_CONFIG = {
  // API Base URL - configure in .env file (VITE_API_BASE_URL)
  // In development, leave empty to use Vite proxy (avoids CORS)
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',

  // Email Service Configuration - configure in .env file
  EMAIL_SERVICE: {
    BASE_URL: import.meta.env.VITE_EMAIL_SERVICE_URL,
    API_KEY: import.meta.env.VITE_EMAIL_SERVICE_API_KEY,
    FROM_EMAIL: import.meta.env.VITE_EMAIL_FROM,
    FROM_NAME: import.meta.env.VITE_EMAIL_FROM_NAME
  },

  // Environment
  NODE_ENV: import.meta.env.MODE || 'production',

  // Is Development
  IS_DEV: import.meta.env.MODE === 'development',

  // Is Production
  IS_PROD: import.meta.env.MODE === 'production',
};

export default ENV_CONFIG;

