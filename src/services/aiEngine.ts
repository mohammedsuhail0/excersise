import { VibeOption, WorkoutRoutine, VibeStage, ExerciseFormGuide } from '../types';

export const DEFAULT_FORM_GUIDE: ExerciseFormGuide = {
  gripSetup: 'Neutral overhand grip shoulder-width apart.',
  bodyAlignment: 'Hollow body hold with tight core and glutes.',
  execution: 'Control movement smoothly through full range of motion.',
  commonMistakes: ['Flaring elbows out to 90 degrees.', 'Using momentum or kipping.'],
  proTips: 'Maintain maximum muscular tension throughout every rep.',
  animatedCue: 'Controlled vertical movement trajectory.',
};

export const VIBE_OPTIONS: VibeOption[] = [
  {
    stage: 1,
    id: 'Restorative',
    title: 'Restorative',
    subtitle: 'Zen Recovery',
    description: 'Gentle joint mobility & spinal decompression.',
    numberLabel: '01',
    estimatedMins: 20,
    estimatedCalories: 110,
    badge: 'Gentle Recovery',
  },
  {
    stage: 2,
    id: 'Steady Flow',
    title: 'Steady Flow',
    subtitle: 'Zone 2 Cardio',
    description: 'Rhythmic functional strength & posture endurance.',
    numberLabel: '02',
    estimatedMins: 35,
    estimatedCalories: 240,
    badge: 'Endurance & Posture',
  },
  {
    stage: 3,
    id: 'High Energy',
    title: 'High Energy',
    subtitle: 'Muscle Sculpt',
    description: 'Targeted progressive muscle building & hypertrophy.',
    numberLabel: '03',
    estimatedMins: 50,
    estimatedCalories: 420,
    badge: 'Muscle Building',
  },
  {
    stage: 4,
    id: 'Peak Power',
    title: 'Peak Power',
    subtitle: 'Primal Heavy',
    description: 'Heavy compound lifts & explosive PR attempts.',
    numberLabel: '04',
    estimatedMins: 60,
    estimatedCalories: 580,
    badge: 'Heavy PR Lifts',
  },
];

export const ROUTINES_MAP: Record<VibeStage, WorkoutRoutine> = {
  Restorative: {
    id: 'restorative-01',
    vibeStage: 'Restorative',
    title: 'Zen Recovery & Spine Decompression',
    description: 'Low-impact flow designed for joint health and deep recovery.',
    estimatedMins: 20,
    estimatedCalories: 110,
    exercises: [
      {
        id: 'r1',
        name: 'Cat-Cow Spine Flow',
        category: 'Mobility',
        equipmentRequired: 'Home',
        formGuide: DEFAULT_FORM_GUIDE,
        targetMuscles: ['Spine', 'Core'],
        recommendedSets: 3,
        recommendedReps: '12 reps',
        ghostPerformance: { lastReps: 12, lastWeightKg: 0, lastDate: '3 days ago' },
      },
      {
        id: 'r2',
        name: 'World\'s Greatest Stretch',
        category: 'Flexibility',
        equipmentRequired: 'Home',
        formGuide: DEFAULT_FORM_GUIDE,
        targetMuscles: ['Hips', 'Thoracic Spine'],
        recommendedSets: 3,
        recommendedReps: '8 reps / side',
        ghostPerformance: { lastReps: 8, lastWeightKg: 0, lastDate: '3 days ago' },
      },
    ],
  },
  'Steady Flow': {
    id: 'steady-01',
    vibeStage: 'Steady Flow',
    title: 'Balanced Athletic Strength',
    description: 'Controlled tempo strength exercises for posture and stamina.',
    estimatedMins: 35,
    estimatedCalories: 240,
    exercises: [],
  },
  'High Energy': {
    id: 'high-01',
    vibeStage: 'High Energy',
    title: 'Hypertrophy & Posture Sculpt',
    description: 'Moderate-to-heavy resistance targeting major muscle groups.',
    estimatedMins: 50,
    estimatedCalories: 420,
    exercises: [],
  },
  'Peak Power': {
    id: 'peak-01',
    vibeStage: 'Peak Power',
    title: 'Heavy Compound Strength & Explosive PRs',
    description: 'Heavy resistance training focusing on max neurological output.',
    estimatedMins: 60,
    estimatedCalories: 580,
    exercises: [],
  },
};

// MASTER AI CALISTHENICS COACH RESPONSE GENERATOR
export function generateCoachResponse(prompt: string, userContext: any): string {
  const lower = prompt.toLowerCase();
  const userName = userContext.name || 'Athlete';
  const weight = userContext.weightKg || 78;

  if (lower.includes('wrist') || lower.includes('pain') || lower.includes('joint')) {
    return `🔥 Hey ${userName}! Wrist pain during Pike Push-Ups or Planche leans is very common when wrist extensors aren't warm. Try this:
1. Warm up with 10 wrist circles & palm pulses on the floor.
2. Turn your hands slightly outward (at 45°) to relieve compression on the carpal tunnel.
3. Keep your fingers spread wide and claw the floor to distribute your body weight evenly!`;
  }

  if (lower.includes('eat') || lower.includes('macro') || lower.includes('diet') || lower.includes('protein')) {
    const targetProtein = Math.round(weight * 2); // 2g per kg
    return `🥩 For your ${weight}kg target physique, your daily macronutrient baseline is:
• Protein: ${targetProtein}g / day (Crucial for muscle recovery & low body fat)
• Carbs: ~220g (Focus on rice, oats, sweet potatoes for training energy)
• Healthy Fats: ~65g (Avocados, eggs, almonds)
Pro Tip: Drink 3.5L of water daily to keep muscle bellies hydrated!`;
  }

  if (lower.includes('muscle-up') || lower.includes('muscle up')) {
    return `⚡ The Muscle-Up is 80% speed & transition, not just pull-up strength!
1. Build explosive power: Practice Chest-to-Bar Pull-Ups where your lower ribs touch the bar.
2. The False Grip: Curl your wrists over the bar so your palm heel sits directly on top.
3. Drive knees slightly forward as you pull high to sweep your chest over the bar!`;
  }

  if (lower.includes('planche') || lower.includes('tuck planche')) {
    return `🤸 To unlock the Planche, straight-arm scapular protraction is key!
1. Practice Tuck Planche holds: Aim for 5 sets of 12-15 seconds holds.
2. Keep your arms locked 100% straight — do not bend at the elbows!
3. Push your shoulder blades forward (protraction) and hollow your stomach. Move to Straddle Planche only when you can hold 15s comfortably!`;
  }

  if (lower.includes('handstand') || lower.includes('hspu')) {
    return `🤸 For Handstand Push-Ups (HSPU):
1. Lower down in a tripod position: Head goes slightly forward of your hands, forming a triangle.
2. Keep your elbows tucked in at 45 degrees, never flare them out wide.
3. Press upward through your shoulders while keeping your core & legs zipped tight!`;
  }

  return `💪 Great question, ${userName}! In pure calisthenics, progressive overload comes from altering body leverage and tempo, not just adding weight. Focus on 3-second slow negatives, full range of motion, and maintaining tight core tension in every single rep!`;
}
