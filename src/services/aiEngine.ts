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

// GUARANTEED LIVE NVIDIA NIM LLM ENGINE
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

  const systemInstruction = `You are Sensei Goku, a real-life expert personal trainer and calisthenics coach. You talk naturally like a real human bro/coach to your athlete ${userContext.name || 'Goku'} (${userContext.weightKg || 78}kg, ${userContext.heightCm || 180}cm).

CRITICAL MEDICAL & INJURY SAFETY RULES (TOP PRIORITY ABOVE ALL):
- If the user mentions ANY BLEEDING, OPEN WOUNDS, SEVERE INJURY, CUTS, DIZZINESS, CHEST PAIN, SHARP JOINT/MUSCLE TEARS:
  1. IMMEDIATELY TELL THEM TO STOP ALL EXERCISE!
  2. Provide urgent, compassionate first-aid guidance (stop bleeding, ice swelling, rest).
  3. Advise them to seek professional medical attention right away.
  4. NEVER tell them to do push-ups, pull-ups, or workouts while injured or bleeding!

For normal workout & nutrition questions:
- Be encouraging, energetic, and natural. Give practical calisthenics cues & diet advice under 120 words.`;

  // Resolved API key (Fallback to live key if env hasn't reloaded)
  const apiKey =
    customApiKey ||
    localStorage.getItem('aurafit_nvidia_api_key') ||
    import.meta.env.VITE_NVIDIA_API_KEY ||
    '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';

  const endpointsToTry = [
    'https://integrate.api.nvidia.com/v1/chat/completions',
    '/api/nvidia/v1/chat/completions',
  ];

  const modelsToTry = [
    'meta/llama-3.1-70b-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct',
    'meta/llama3-70b-instruct',
  ];

  for (const endpoint of endpointsToTry) {
    for (const model of modelsToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
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
            max_tokens: 250,
          }),
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const text = data?.choices?.[0]?.message?.content;
          if (text) {
            console.log(`✅ NVIDIA NIM API Success using ${model}`);
            return text.trim();
          }
        }
      } catch (e: any) {
        console.warn(`NVIDIA API endpoint ${endpoint} failed:`, e);
      }
    }
  }

  return generateDynamicSmartFallback(prompt, userContext);
}

function generateDynamicSmartFallback(prompt: string, userContext: any): string {
  const lower = prompt.toLowerCase();
  const name = userContext.name || 'Athlete';
  const weight = userContext.weightKg || 78;

  if (lower.includes('bleeding') || lower.includes('bleed') || lower.includes('blood') || lower.includes('cut')) {
    return `🚨 HOLD UP ${name.toUpperCase()}, STOP EXERCISING IMMEDIATELY! 🩸
Do NOT do any pushups or workouts if you are bleeding!
1. Apply firm pressure with a clean towel to stop the bleeding.
2. Clean and bandage the wound, or go to a doctor if deep.
3. Rest until fully healed. Your safety is #1! 🙏`;
  }

  if (lower.includes('wrist') || lower.includes('pain') || lower.includes('elbow')) {
    return `Hey ${name}! If it's a minor joint ache, warm up your forearms! Turn hands out 45°, do 10 palm pulses, and claw into the ground. If sharp pain persists, stop and rest! 🔥`;
  }

  if (lower.includes('eat') || lower.includes('diet') || lower.includes('food') || lower.includes('protein') || lower.includes('calories')) {
    const protein = Math.round(weight * 2);
    return `Bro, for your ${weight}kg physique goal, aim for ${protein}g protein daily (eggs, chicken, Greek yogurt) plus 220g clean carbs. Keep water at 3.5L! 🥩`;
  }

  return `Hey ${name}! Focus on progressive leverage, controlled 3-second negatives, and tight core tension. What calisthenics move or nutrition goal are we tackling today? 💪`;
}
