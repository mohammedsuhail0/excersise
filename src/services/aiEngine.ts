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

// NATURAL HUMAN PERSONAL TRAINER LLM ENGINE
export async function callMultiProviderLLMCoachAPI(
  prompt: string,
  userContext: any,
  provider: LLMProvider = 'nvidia',
  customApiKey?: string
): Promise<string> {
  const systemInstruction = `You are Sensei Goku, a real-life expert personal trainer and calisthenics coach. You talk naturally like a real human bro/coach to your athlete ${userContext.name || 'Goku'} (${userContext.weightKg || 78}kg, ${userContext.heightCm || 180}cm, ${userContext.targetPhysique || 'Anime Aesthetic'} goal).

Your Personality & Tone:
- Talk like a real, passionate, natural human personal trainer. Be direct, encouraging, energetic, and authentic.
- NEVER sound like a robotic customer service bot or AI assistant. NEVER say "As an AI..." or "As your Calisthenics Coach, I strictly focus on...".
- If your athlete asks something off-topic (like coding, math, or random stuff), respond naturally in character like a real gym bro/trainer would (e.g., "Bro, I build chest and shoulders, I don't write code! Drop and give me 20 pushups instead 😜").
- Give practical, high-impact, natural fitness and nutrition advice. Keep responses under 110 words, direct, engaging, and motivating!`;

  if (provider === 'nvidia') {
    const apiKey = customApiKey || import.meta.env.VITE_NVIDIA_API_KEY || '';
    if (!apiKey) {
      return generateDynamicSmartFallback(prompt, userContext);
    }

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
          const timeoutId = setTimeout(() => controller.abort(), 4000);

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
              temperature: 0.7, // Warm, creative, natural human temperature
              max_tokens: 220,
            }),
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const text = data?.choices?.[0]?.message?.content;
            if (text) return text.trim();
          }
        } catch (e) {
          // Timeout or fetch error -> try next
        }
      }
    }
  }

  return generateDynamicSmartFallback(prompt, userContext);
}

function generateDynamicSmartFallback(prompt: string, userContext: any): string {
  const lower = prompt.toLowerCase();
  const name = userContext.name || 'Athlete';
  const weight = userContext.weightKg || 78;

  if (lower.includes('wrist') || lower.includes('pain') || lower.includes('elbow')) {
    return `Hey ${name}! Wrist pain on pushing moves means forearms need pre-warming. Turn your hands out 45°, do 10 palm pulses, and claw into the ground! 🔥`;
  }

  if (lower.includes('eat') || lower.includes('diet') || lower.includes('food') || lower.includes('protein') || lower.includes('calories')) {
    const protein = Math.round(weight * 2);
    return `Bro, for your ${weight}kg physique goal, aim for ${protein}g protein daily (eggs, chicken, Greek yogurt) plus 220g clean carbs. Keep water at 3.5L! 🥩`;
  }

  if (lower.includes('python') || lower.includes('code') || lower.includes('script')) {
    return `Bro, I build chest and shoulders, I don't write Python code! Drop and give me 20 clean pushups instead 😜💪`;
  }

  return `Hey ${name}! Focus on progressive leverage, controlled 3-second negatives, and tight core tension. What are we blasting today? 💪`;
}
