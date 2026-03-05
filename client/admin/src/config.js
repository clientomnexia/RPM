/**
 * API Configuration
 * Determines the backend URL based on environment.
 * In development, it defaults to localhost if not specified in .env.
 */
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');

console.log(`API_URL Initialized [${import.meta.env.MODE}]:`, API_URL);

export default API_URL;
