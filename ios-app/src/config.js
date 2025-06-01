// API Configuration
export const API_URL = 'http://10.40.105.44:8000';  // Your local IP address
// export const API_URL = 'https://api.tracktreat.ai';  // For production

// Other configuration constants
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
export const MAX_RECORDING_DURATION = 60;  // 60 seconds
export const API_TIMEOUT = 60000;  // 60 seconds timeout (increased from 30s) 