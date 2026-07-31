-- ========================================================
-- AURAFIT SUPABASE DATABASE SCHEMA MIGRATION
-- Copy & Paste this entire script into your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Run
-- ========================================================

-- 1. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Goku',
  height_cm NUMERIC NOT NULL DEFAULT 180,
  weight_kg NUMERIC NOT NULL DEFAULT 78,
  target_physique TEXT NOT NULL DEFAULT 'Anime Aesthetic',
  level INT NOT NULL DEFAULT 5,
  xp INT NOT NULL DEFAULT 320,
  max_xp INT NOT NULL DEFAULT 500,
  streak_days INT NOT NULL DEFAULT 12,
  streak_shields INT NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. UNLOCKED PHASES & LEVEL PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.completed_phases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_id TEXT NOT NULL, -- e.g. 'chest-push', 'abs-core', 'muscle-up'
  unlocked_level INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_id)
);

-- 3. WORKOUT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  routine_title TEXT NOT NULL,
  duration_mins INT NOT NULL,
  calories_burned INT NOT NULL,
  xp_earned INT NOT NULL DEFAULT 150,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DAILY PEDOMETER STEP LOGS TABLE
CREATE TABLE IF NOT EXISTS public.step_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  step_date DATE DEFAULT CURRENT_DATE,
  steps INT NOT NULL DEFAULT 0,
  distance_km NUMERIC NOT NULL DEFAULT 0,
  calories_burned INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, step_date)
);

-- ENABLE ROW LEVEL SECURITY (RLS) FOR DATA SAFETY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.step_logs ENABLE ROW LEVEL SECURITY;

-- CREATE ACCESS POLICIES (USERS CAN READ/WRITE THEIR OWN DATA)
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own phases" ON public.completed_phases FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own workout logs" ON public.workout_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own step logs" ON public.step_logs FOR ALL USING (auth.uid() = user_id);
