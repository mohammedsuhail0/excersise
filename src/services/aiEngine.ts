import { VibeOption } from '../types';

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

/**
 * Calls Vercel Serverless Function (/api/coach).
 * ZERO Groq API keys are stored or referenced on the frontend client.
 */
export async function callMultiProviderLLMCoachAPI(
  userPrompt: string,
  userContext: UserContext
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

  // 100% SECURE SERVERLESS API CALL (Zero client keys exposed)
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
  } catch {}

  return `🔥 SENSEI COACH AI (Offline Mode):
Welcome ${userContext.name || 'Athlete'}! Focus on progressive overload, clean form, and 2g protein per kg. Push hard today! 💪`;
}
