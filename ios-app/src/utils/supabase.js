import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For local development, you might need to use your computer's local IP
const LOCAL_IP = '10.0.0.161'; // Replace with your computer's local IP

// Configuration
const supabaseUrl = 'https://beuiydgkvbbppyobyguq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldWl5ZGdrdmJicHB5b2J5Z3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzODAwODAsImV4cCI6MjA2Mzk1NjA4MH0.pSRh1Xz0aDS5vAw1IIEmkPcKwYH0TBjtIZN3gwryRY0';

// Create a single Supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  // Add custom fetch implementation for better error handling
  fetch: (url, options = {}) => {
    console.log('Request URL:', url);
    return fetch(url, { ...options })
      .then(response => {
        if (!response.ok) {
          console.error('Request failed with status:', response.status);
          console.error('Response headers:', Object.fromEntries(response.headers.entries()));
        }
        return response;
      })
      .catch(error => {
        console.error('Network request failed:', error);
        throw error;
      });
  },
});

// Helper functions for authentication
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
};
