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

// ULTRA-FAST & STRICT FITNESS GUARDRAILED LLM ENGINE
export async function callMultiProviderLLMCoachAPI(
  prompt: string,
  userContext: any,
  provider: LLMProvider = 'nvidia',
  customApiKey?: string
): Promise<string> {
  const lowerPrompt = prompt.toLowerCase();

  // 1. INSTANT CLIENT-SIDE GUARDRAIL FOR CODING / NON-FITNESS REQUESTS
  const offTopicKeywords = ['python', 'code', 'javascript', 'html', 'css', 'java', 'programming', 'script', 'function', 'math', 'equation', 'game', 'movie', 'song', 'essay', 'poem'];
  if (offTopicKeywords.some((word) => lowerPrompt.includes(word))) {
    return `OSS ${userContext.name || 'Athlete'}! 🥋 As your Calisthenics Coach, I strictly focus on workouts, bodyweight skill progressions, form cues, and sports nutrition. Let us get back to training! 💪`;
  }

  const systemInstruction = `You are Sensei Goku, a Master Calisthenics Coach. You talk directly to the athlete:
- Athlete: ${userContext.name || 'Goku'} (${userContext.weightKg || 78}kg, ${userContext.heightCm || 180}cm, ${userContext.targetPhysique || 'Anime Aesthetic'} target).

CRITICAL RULE: You are STRICTLY a Calisthenics, Fitness, & Sports Nutrition Coach. If the user asks about ANYTHING else (coding, Python, math, movies, tech), politely refuse and refocus on workouts.
Answer fitness questions concisely in under 90 words with bullet points and emojis. Be fast, direct, and motivating!`;

  // 2. ULTRA-FAST NVIDIA NIM INFERENCE (MAX 180 TOKENS FOR SPEED)
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
          const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s speed timeout

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
              temperature: 0.5,
              max_tokens: 180, // Reduced tokens for ultra-fast generation speed
            }),
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const text = data?.choices?.[0]?.message?.content;
            if (text) return text.trim();
          }
        } catch (e) {
          // Timeout or fetch error -> try next or fallback fast
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
    return `🔥 Hey ${name}! Joint/wrist discomfort during pushing exercises happens when forearms aren't pre-warmed.
• Turn hands outward 45° to open carpal space.
• Perform 10 palm pulses and wrist waves.
• Spread fingers wide and claw into the ground to absorb force evenly!`;
  }

  if (lower.includes('eat') || lower.includes('diet') || lower.includes('food') || lower.includes('protein') || lower.includes('calories')) {
    const protein = Math.round(weight * 2);
    return `🥩 For your ${weight}kg target:
• Daily Protein Goal: ${protein}g (Egg whites, chicken breast, Greek yogurt).
• Carbs: ~220g for workout energy (Oats, rice, bananas).
• Hydration: Drink 3.5L of water daily to maximize muscle pump!`;
  }

  if (lower.includes('muscle-up') || lower.includes('muscle up')) {
    return `⚡ The Muscle-Up relies on explosive pull height:
• Pull the bar down to your lower ribs, not just your chin.
• Use the False Grip (wrist resting over the bar).
• Whip your chest over the bar at the apex of the pull!`;
  }

  if (lower.includes('planche')) {
    return `🤸 For Planche mastery:
• Lock elbows 100% straight — no bending!
• Protracted shoulders (push shoulder blades away from each other).
• Hold Tuck Planche for 5 sets of 12s before advancing!`;
  }

  return `💪 OSS ${name}! To progress in calisthenics, focus on progressive leverage (shifting body weight further forward), strict 3-0-1 tempo, and full range of motion. What calisthenics move or nutrition goal are we tackling today?`;
}
