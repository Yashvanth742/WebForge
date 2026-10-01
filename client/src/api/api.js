import axios from 'axios';

/**
 * Axios instance configured for WebForge API server.
 * Uses credentials (cookies) and attaches the CSRF token to state-changing requests.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '',
  withCredentials: true,
});

// Interceptor to attach X-CSRF-Token header from csrf cookie
api.interceptors.request.use((config) => {
  const csrf = document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrf='))
    ?.split('=')[1];

  if (csrf && !['get', 'head', 'options'].includes(config.method?.toLowerCase() || '')) {
    config.headers['X-CSRF-Token'] = decodeURIComponent(csrf);
  }

  return config;
});

export default api;
