import { createClient } from '@supabase/supabase-js';

// These values should be replaced with your actual Supabase URL and anon key
// In production, these should be loaded from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a singleton Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Profile = {
  id: string;
  user_id: string;
  weight_kg: number | null;
  height_cm: number | null;
  dob: string | null;
  gender: string | null;
  activity_level: string | null;
  created_at: string;
  updated_at: string;
};

export type Meal = {
  id: string;
  user_id: string;
  image_url: string | null;
  transcript: string | null;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    [key: string]: number;
  } | null;
  advice: string | null;
  logged_at: string;
  created_at: string;
};

export type Gamification = {
  user_id: string;
  badges: {
    id: string;
    name: string;
    description: string;
    earned_at: string;
  }[];
  current_level: number;
  xp: number;
  last_updated: string;
};
