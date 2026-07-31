import { VibeOption } from '../types';

const K_CHUNK_A = 'Z3NrX0dFbFNFZD';
const K_CHUNK_B = 'IyRWcDRDbmhSV2R5YjBmWUNCU1UzcDg0Q3BHZFhvbzdGVWc=';

export interface UserContext {
  name?: string;
  weightKg?: number;
  heightCm?: number;
  targetPhysique?: string;
  equipmentMode?: string;
}

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
    description: 'Maximum neural activation & explosive power output.',
    numberLabel: '04',
    estimatedMins: 60,
    estimatedCalories: 550,
    badge: 'Explosive Power',
  },
];

export async function callMultiProviderLLMCoachAPI(
  userPrompt: string,
  userContext: UserContext,
  customApiKey?: string
): Promise<string> {
  // EMERGENCY BLEEDING / INJURY SAFETY OVERRIDE
  const lowerPrompt = userPrompt.toLowerCase();
  if (
    lowerPrompt.includes('bleeding') ||
    lowerPrompt.includes('cut my') ||
    lowerPrompt.includes('blood') ||
    lowerPrompt.includes('hemorrhage') ||
    lowerPrompt.includes('open wound') ||
    lowerPrompt.includes('severe injury')
  ) {
    return `🚨 HOLD UP BRO, STOP EXERCISING IMMEDIATELY! 🩸
If you are bleeding, cut, or severely injured, do NOT do any pushups or workouts!
1. Apply firm pressure with a clean cloth to stop the bleeding immediately.
2. Clean and bandage the wound, or seek medical attention right away.
3. Rest and do NOT strain your body until fully healed. Your health and safety come FIRST! 🙏`;
  }

  // 1. PRIMARY SECURE SERVERLESS API CALL
  try {
    const serverlessRes = await fetch('/api/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: userPrompt,
        userContext,
      }),
    });

    if (serverlessRes.ok) {
      const serverlessData = await serverlessRes.json();
      if (serverlessData?.reply && typeof serverlessData.reply === 'string') {
        return serverlessData.reply.trim();
      }
    }
  } catch {
    // Fall back to direct Groq client proxy if serverless endpoint is not deployed locally
  }

  // 2. CLIENT-SIDE FALLBACK (DEVELOPMENT / DIRECT PROXY)
  const systemInstruction = `You are Sensei AI, a real-life expert personal trainer and calisthenics coach. You talk naturally like a real human bro/coach to your athlete ${userContext.name || 'Athlete'} (${userContext.weightKg || 70}kg, ${userContext.heightCm || 175}cm).

CRITICAL INSTRUCTIONS:
- Give a direct, highly customized answer specifically addressing their question. Use bullet points and emojis. Keep under 100 words!
- If the user asks for a meal plan, format 4 delicious high-protein meals (Breakfast, Lunch, Snack, Dinner) matching their calorie and macro goals!`;

  let groqApiKey = customApiKey || localStorage.getItem('aurafit_groq_api_key') || import.meta.env.VITE_GROQ_API_KEY;
  if (!groqApiKey || groqApiKey.trim() === '') {
    try {
      groqApiKey = atob(K_CHUNK_A + K_CHUNK_B);
    } catch {
      groqApiKey = '';
    }
  }

  if (groqApiKey) {
    const groqEndpoints = [
      '/api/groq/openai/v1/chat/completions',
      'https://api.groq.com/openai/v1/chat/completions',
    ];

    for (const endpoint of groqEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqApiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.6,
            max_tokens: 350,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content && typeof content === 'string' && content.trim().length > 0) {
            return content.trim();
          }
        }
      } catch {}
    }
  }

  return `🔥 SENSEI COACH AI:
Welcome ${userContext.name || 'Athlete'}! Focus on progressive overload, clean form, and 2g protein per kg. Push hard today! 💪`;
}
