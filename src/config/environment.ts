// Environment Configuration
export const ENV_CONFIG = {
  // API Base URL - defaults to production, can be overridden by environment variable
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://trizencareersbackend.llp.trizenventures.com',
  
  // Environment
  NODE_ENV: import.meta.env.MODE || 'production',
  
  // Is Development
  IS_DEV: import.meta.env.MODE === 'development',
  
  // Is Production
  IS_PROD: import.meta.env.MODE === 'production',
};

export default ENV_CONFIG;
