import { Platform } from 'react-native';

// Use localhost for iOS simulator and local IP for physical devices
const API_BASE_URL = Platform.select({
  ios: Platform.isSimulator ? 'http://localhost:8000' : 'http://10.0.0.161:8000',
  android: 'http://10.0.0.61:8000',
  default: 'http://localhost:8000',
});

export const API_URL = API_BASE_URL;

// Log the current environment for debugging
console.log(`Using API URL: ${API_URL}`);
console.log(`Platform: ${Platform.OS}, Is Simulator: ${Platform.isSimulator}`);
