// Basic Node.js module polyfills for React Native
global.Buffer = global.Buffer || require('buffer').Buffer;

// Polyfill for the stream module
if (typeof global.process === 'undefined') {
  global.process = require('process');
}

// Import URL polyfill
import 'react-native-url-polyfill/auto';

console.log('Node.js polyfills initialized');
