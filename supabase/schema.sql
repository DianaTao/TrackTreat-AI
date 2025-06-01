-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    weight_kg NUMERIC,
    height_cm NUMERIC,
    dob DATE,
    gender TEXT,
    activity_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to create a profile after user signup
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_user();

-- Meals Table
CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT,
    voice_url TEXT,
    transcript TEXT,
    meal_name TEXT,
    nutrition JSONB,
    advice TEXT,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster querying of meals by user and date
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals (user_id, logged_at);

-- Gamification Table
CREATE TABLE IF NOT EXISTS gamification (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    badges JSONB DEFAULT '[]'::jsonb,
    current_level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to create gamification record after user signup
CREATE OR REPLACE FUNCTION public.create_gamification_for_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.gamification (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created_gamification
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.create_gamification_for_user();

-- RLS (Row Level Security) Policies
-- Ensure users can only access their own data

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Meals RLS
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own meals"
    ON meals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals"
    ON meals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals"
    ON meals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals"
    ON meals FOR DELETE
    USING (auth.uid() = user_id);

-- Gamification RLS
ALTER TABLE gamification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own gamification data"
    ON gamification FOR SELECT
    USING (auth.uid() = user_id);

-- Only the application can update gamification data
CREATE POLICY "Service role can update gamification data"
    ON gamification FOR UPDATE
    USING (auth.role() = 'service_role');
