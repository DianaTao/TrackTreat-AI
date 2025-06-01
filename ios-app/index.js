// Import all modules at the top first
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import './src/utils/supabase';
import 'expo-router/entry';

// Initialize Node.js polyfills
global.Buffer = require('buffer').Buffer;
global.process = require('process');

console.log('TrackTreat AI - Basic polyfills initialized');
