export type TargetPhysique = 'Anime Aesthetic' | 'Lean Athletic' | 'Powerlifter' | 'Zen Mobility';

export interface UserProfile {
  name: string;
  heightCm: number;
  weightKg: number;
  targetPhysique: TargetPhysique;
  level: number;
  xp: number;
  maxXp: number;
  streakDays: number;
  streakShields: number;
}

export type EquipmentMode = 'Home' | 'Gym';

export type VibeStage = 'Restorative' | 'Steady Flow' | 'High Energy' | 'Peak Power';

export interface VibeOption {
  stage: 1 | 2 | 3 | 4;
  id: VibeStage;
  title: string;
  subtitle: string;
  description: string;
  numberLabel: string;
  estimatedMins: number;
  estimatedCalories: number;
  badge: string;
}

export interface ExerciseFormGuide {
  gripSetup: string;
  bodyAlignment: string;
  execution: string;
  commonMistakes: string[];
  proTips: string;
  animatedCue: string;
}

export interface CalisthenicsExercise {
  id: string;
  name: string;
  category?: string;
  equipmentRequired: 'Home' | 'Gym' | 'Both';
  recommendedSets: number;
  recommendedReps: string;
  targetMuscles: string[];
  formGuide: ExerciseFormGuide;
  suggestedWeightKg?: number;
  ghostPerformance?: {
    lastReps: number;
    lastWeightKg: number;
    lastDate: string;
  };
}

export interface CalisthenicsPhase {
  phaseNumber: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  exercises: CalisthenicsExercise[];
}

export interface CalisthenicsMasterSkill {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  numberLabel: string;
  description: string;
  mastered: boolean;
  expReward: number;
  phases: CalisthenicsPhase[];
}

export interface WorkoutRoutine {
  id: string;
  vibeStage: VibeStage;
  title: string;
  description: string;
  estimatedMins: number;
  estimatedCalories: number;
  exercises: CalisthenicsExercise[];
}

export interface SetLog {
  setId: string;
  exerciseId: string;
  reps: number;
  weightKg: number;
  completed: boolean;
  timestamp: string;
}

export interface FeatureConfig {
  skillTree: boolean;
  vibeSelector?: boolean;
  workoutTracker: boolean;
  musicDeck: boolean;
  macroTracker: boolean;
  gamification: boolean;
}
