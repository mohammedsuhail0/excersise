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
    exercises: [],
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

export type LLMProvider = 'nvidia' | 'groq' | 'gemini';

// GUARANTEED DYNAMIC LLM COACH ENGINE
export async function callMultiProviderLLMCoachAPI(
  prompt: string,
  userContext: any,
  provider: LLMProvider = 'nvidia',
  customApiKey?: string
): Promise<string> {
  const lowerPrompt = prompt.toLowerCase();

  // 1. URGENT MEDICAL EMERGENCY & INJURY SAFETY CHECK
  const medicalEmergencyKeywords = [
    'bleeding', 'bleed', 'blood', 'cut', 'wound', 'chest pain', 'dizziness', 
    'dizzy', 'fainted', 'faint', 'broken', 'fracture', 'dislocated', 'torn', 'severe pain'
  ];

  if (medicalEmergencyKeywords.some((word) => lowerPrompt.includes(word))) {
    return `🚨 HOLD UP BRO, STOP EXERCISING IMMEDIATELY! 🩸
If you are bleeding, cut, or severely injured, do NOT do any pushups or workouts!
1. Apply firm pressure with a clean cloth to stop the bleeding immediately.
2. Clean and bandage the wound, or seek medical attention right away.
3. Rest and do NOT strain your body until fully healed. Your health and safety come FIRST! 🙏`;
  }

  const systemInstruction = `You are Sensei Goku, an elite Master Calisthenics Coach. You talk directly to your athlete ${userContext.name || 'Goku'} (${userContext.weightKg || 78}kg, ${userContext.heightCm || 180}cm).

Give a direct, highly customized answer specifically addressing their question. Use bullet points and emojis. Keep under 110 words!`;

  const apiKey =
    customApiKey ||
    localStorage.getItem('aurafit_nvidia_api_key') ||
    import.meta.env.VITE_NVIDIA_API_KEY ||
    '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';

  // Try proxied endpoint first to bypass browser CORS, then direct URL
  const endpointsToTry = [
    '/api/nvidia/v1/chat/completions',
    'https://integrate.api.nvidia.com/v1/chat/completions',
  ];

  const modelsToTry = [
    'meta/llama-3.1-70b-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct',
  ];

  for (const endpoint of endpointsToTry) {
    for (const model of modelsToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 220,
          }),
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const text = data?.choices?.[0]?.message?.content;
          if (text) {
            console.log(`✅ NVIDIA NIM API Success via ${endpoint} using ${model}`);
            return text.trim();
          }
        } else {
          console.warn(`NVIDIA API ${endpoint} HTTP ${response.status}:`, await response.text());
        }
      } catch (e: any) {
        console.warn(`NVIDIA API endpoint ${endpoint} fetch error:`, e?.message);
      }
    }
  }

  // DYNAMIC FALLBACK MATCHING THE EXACT QUESTION IF NETWORK FAILS
  return generateDynamicSmartFallback(prompt, userContext);
}

function generateDynamicSmartFallback(prompt: string, userContext: any): string {
  const lower = prompt.toLowerCase();
  const name = userContext.name || 'Goku';
  const weight = userContext.weightKg || 78;

  if (lower.includes('abs') || lower.includes('core') || lower.includes('stomach') || lower.includes('six pack')) {
    return `🔥 Abs Workout for ${name}:
• Hanging Leg Raises: 4 sets x 12 reps (Hollow body tension)
• Dragon Flags or Negative Tuck Levers: 3 sets x 8 reps
• Plank to Pike Pulses: 3 sets x 45 seconds
Keep core hollow and pelvis tilted posteriorly throughout! ⚡`;
  }

  if (lower.includes('arm') || lower.includes('bicep') || lower.includes('tricep')) {
    return `💪 Calisthenics Arm Blast for ${name}:
• Chins / Underhand Pull-ups: 4 sets x 8 reps (Peak bicep squeeze)
• Bodyweight Tricep Extensions (on low bar/bench): 4 sets x 12 reps
• Korean Dips or Ring Dips: 3 sets x 10 reps
Focus on strict 3-second eccentric negatives on every rep! 🔥`;
  }

  if (lower.includes('chest') || lower.includes('pushup') || lower.includes('push-up') || lower.includes('dip')) {
    return `💥 Chest Hypertrophy Blast:
• Ring Dips / Deep Bar Dips: 4 sets x 10 reps
• Archer Push-ups: 3 sets x 8 reps per side
• Deficit Push-ups (Hands on parallettes): 4 sets x 15 reps
Squeeze inner chest hard at full lockout! ⚡`;
  }

  if (lower.includes('leg') || lower.includes('squat') || lower.includes('pistol')) {
    return `🦵 Calisthenics Leg Annihilation:
• Pistol Squats: 4 sets x 8 reps per leg
• Nordic Hamstring Curls (or Negatives): 3 sets x 6 reps
• Explosive Jump Squats: 4 sets x 15 reps
Explode off the floor with max power! ⚡`;
  }

  if (lower.includes('shoulder') || lower.includes('pike') || lower.includes('handstand')) {
    return `🤸 Boulder Shoulders Routine:
• Elevated Pike Push-ups: 4 sets x 10 reps
• Wall Handstand Holds: 3 sets x 45 seconds
• Scapular Wall Slides & Shrugs: 3 sets x 15 reps
Keep elbows tucked 45° and push shoulders up into ears! 🔥`;
  }

  if (lower.includes('eat') || lower.includes('diet') || lower.includes('food') || lower.includes('protein') || lower.includes('calories')) {
    const protein = Math.round(weight * 2);
    return `🥩 Nutrition Guide for ${weight}kg physique goal:
• Protein: ${protein}g daily (Chicken breast, egg whites, Greek yogurt)
• Carbs: 220g clean carbs (Oats, rice, sweet potatoes)
• Water: 3.5L daily to keep muscles hydrated and full! 💧`;
  }

  return `💪 Hey ${name}! For ${prompt}, focus on progressive leverage (shifting body weight), strict 3-second negatives, and full range of motion. Give it 100% effort on every single set! 🔥`;
}
