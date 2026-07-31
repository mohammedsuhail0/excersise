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

// 100% DIRECT LIVE NVIDIA NIM LLM ENGINE
export async function callMultiProviderLLMCoachAPI(
  prompt: string,
  userContext: any,
  provider: LLMProvider = 'nvidia',
  customApiKey?: string
): Promise<string> {
  const lowerPrompt = prompt.toLowerCase();

  // 1. SPECIFIC MEDICAL EMERGENCY & INJURY SAFETY CHECK (EXCLUDES FITNESS "CUT" DIET GOAL)
  const medicalEmergencyKeywords = [
    'bleeding', 'bleed', 'blood wound', 'deep cut', 'open wound', 'chest pain', 
    'dizziness', 'dizzy', 'fainted', 'faint', 'broken bone', 'fracture', 'dislocated', 'torn muscle', 'severe pain'
  ];

  if (medicalEmergencyKeywords.some((word) => lowerPrompt.includes(word))) {
    return `🚨 HOLD UP BRO, STOP EXERCISING IMMEDIATELY! 🩸
If you are bleeding, cut, or severely injured, do NOT do any pushups or workouts!
1. Apply firm pressure with a clean cloth to stop the bleeding immediately.
2. Clean and bandage the wound, or seek medical attention right away.
3. Rest and do NOT strain your body until fully healed. Your health and safety come FIRST! 🙏`;
  }

  const systemInstruction = `You are Sensei Goku, a real-life expert personal trainer and calisthenics coach. You talk naturally like a real human bro/coach to your athlete ${userContext.name || 'Goku'} (${userContext.weightKg || 78}kg, ${userContext.heightCm || 180}cm).

CRITICAL INSTRUCTIONS:
- Give a direct, highly customized answer specifically addressing their question. Use bullet points and emojis. Keep under 120 words!
- If the user asks for a meal plan, format 4 delicious high-protein meals (Breakfast, Lunch, Snack, Dinner) matching their calorie and macro goals!`;

  const apiKey =
    customApiKey ||
    localStorage.getItem('aurafit_nvidia_api_key') ||
    import.meta.env.VITE_NVIDIA_API_KEY ||
    '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';

  const endpointsToTry = [
    '/api/nvidia/v1/chat/completions',
    'https://integrate.api.nvidia.com/v1/chat/completions',
  ];

  const modelsToTry = [
    'meta/llama-3.1-70b-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct',
    'meta/llama3-70b-instruct',
  ];

  let lastError = '';

  for (const endpoint of endpointsToTry) {
    for (const model of modelsToTry) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data?.choices?.[0]?.message?.content;
          if (text) {
            console.log(`✅ NVIDIA NIM LLM Response received via ${endpoint} (${model})`);
            return text.trim();
          }
        } else {
          const errBody = await response.text();
          console.error(`❌ NVIDIA API (${endpoint}) HTTP ${response.status}:`, errBody);
          lastError = `HTTP ${response.status}: ${errBody}`;
        }
      } catch (e: any) {
        console.error(`❌ NVIDIA API Fetch Error on ${endpoint}:`, e?.message);
        lastError = e?.message || 'Network Fetch Error';
      }
    }
  }

  return `⚠️ Direct NVIDIA NIM LLM Connection Error: ${lastError || 'Failed to reach integrate.api.nvidia.com'}. Please check your internet connection or API key.`;
}
