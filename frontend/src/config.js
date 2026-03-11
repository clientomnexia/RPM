/**
 * API Configuration
 * Determines the backend URL based on environment.
 * In development, defaults to localhost:3000 if not specified in .env.
 */
const rawUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');
const API_URL = rawUrl.replace(/\/api$/, '');

export default API_URL;
