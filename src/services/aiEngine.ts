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

// LIVE NVIDIA NIM LLM ENGINE (DEFAULTS TO NVIDIA NIM LLAMA-3.1-70B)
export async function callMultiProviderLLMCoachAPI(
  prompt: string,
  userContext: any,
  provider: LLMProvider = 'nvidia',
  customApiKey?: string
): Promise<string> {
  const systemInstruction = `You are Sensei Goku, an elite Master Calisthenics & Fitness Coach. You speak directly to the athlete:
- Name: ${userContext.name || 'Goku'}
- Height: ${userContext.heightCm || 180}cm
- Weight: ${userContext.weightKg || 78}kg
- Target Physique: ${userContext.targetPhysique || 'Anime Aesthetic'}
- Level: ${userContext.level || 5}

Answer the user's question with deep biomechanical accuracy, progressive calisthenics leverage cues, and sports nutrition science. Keep your answer under 160 words, concise, formatted with clear bullet points and emojis. Be motivating, direct, and helpful!`;

  // 1. NVIDIA NIM API (PRIMARY ENGINE)
  if (provider === 'nvidia') {
    const apiKey = customApiKey || import.meta.env.VITE_NVIDIA_API_KEY || '';
    if (apiKey) {
      try {
        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'meta/llama-3.1-70b-instruct',
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 350,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data?.choices?.[0]?.message?.content;
          if (text) return text.trim();
        } else {
          console.warn('NVIDIA API Response status:', response.status, await response.text());
        }
      } catch (e) {
        console.warn('NVIDIA NIM API Error:', e);
      }
    }
  }

  // 2. GROQ API FALLBACK
  if (provider === 'groq') {
    const apiKey = customApiKey || import.meta.env.VITE_GROQ_API_KEY || '';
    if (apiKey) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 350,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data?.choices?.[0]?.message?.content;
          if (text) return text.trim();
        }
      } catch (e) {
        console.warn('Groq LLM API Error:', e);
      }
    }
  }

  // 3. GEMINI 1.5 FLASH API FALLBACK
  if (provider === 'gemini') {
    const apiKey = customApiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text.trim();
        }
      } catch (e) {
        console.warn('Gemini API Error:', e);
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

  return `💪 Hey ${name}! To progress in calisthenics, focus on progressive leverage (shifting body weight further forward or raising feet), strict 3-0-1 tempo, and full range of motion. Ask me about any specific move or nutrition goal!`;
}
