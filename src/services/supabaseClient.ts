import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project-id.supabase.co');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// SYNC HELPER FUNCTIONS WITH FALLBACK TO LOCALSTORAGE
export async function syncUserProfileToSupabase(userId: string, profile: any) {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      name: profile.name,
      height_cm: profile.heightCm,
      weight_kg: profile.weightKg,
      target_physique: profile.targetPhysique,
      level: profile.level,
      xp: profile.xp,
      max_xp: profile.maxXp,
      streak_days: profile.streakDays,
      streak_shields: profile.streakShields,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch (e) {
    console.warn('Supabase sync warning:', e);
    return false;
  }
}

export async function syncCompletedLevelToSupabase(userId: string, targetId: string, level: number) {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('completed_phases').upsert({
      user_id: userId,
      target_id: targetId,
      unlocked_level: level,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,target_id' });
    return !error;
  } catch (e) {
    console.warn('Supabase sync warning:', e);
    return false;
  }
}

export async function logWorkoutToSupabase(userId: string, routineTitle: string, durationMins: number, caloriesBurned: number, xpEarned: number) {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('workout_logs').insert({
      user_id: userId,
      routine_title: routineTitle,
      duration_mins: durationMins,
      calories_burned: caloriesBurned,
      xp_earned: xpEarned,
      completed_at: new Date().toISOString(),
    });
    return !error;
  } catch (e) {
    console.warn('Supabase sync warning:', e);
    return false;
  }
}

export async function syncStepsToSupabase(userId: string, steps: number, distanceKm: number, caloriesBurned: number) {
  if (!supabase) return false;
  try {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('step_logs').upsert({
      user_id: userId,
      step_date: today,
      steps: steps,
      distance_km: distanceKm,
      calories_burned: caloriesBurned,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,step_date' });
    return !error;
  } catch (e) {
    console.warn('Supabase sync warning:', e);
    return false;
  }
}
