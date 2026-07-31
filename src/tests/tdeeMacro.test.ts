import { describe, it, expect } from 'vitest';

export interface BmrInput {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'moderate' | 'active';
  goal: 'cut' | 'maintain' | 'bulk';
}

export interface MacroResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  fatGrams: number;
  carbGrams: number;
}

/**
 * Calculates BMR, TDEE, and Target Macros using Mifflin-St Jeor Formula
 */
export function calculateTdeeAndMacros(input: BmrInput): MacroResult {
  const { weightKg, heightCm, age, gender, activityLevel, goal } = input;

  // Mifflin-St Jeor Equation
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr += gender === 'male' ? 5 : -161;
  bmr = Math.round(bmr);

  // Activity Multiplier
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    moderate: 1.55,
    active: 1.75,
  };
  const tdee = Math.round(bmr * (multipliers[activityLevel] || 1.55));

  // Goal Calorie Target Adjustment
  let targetCalories = tdee;
  if (goal === 'cut') targetCalories = Math.round(tdee * 0.8); // 20% deficit
  if (goal === 'bulk') targetCalories = Math.round(tdee * 1.15); // 15% surplus

  // Macro Distribution: Protein = 2.2g per kg, Fat = 1g per kg, Remainder = Carbs
  const proteinGrams = Math.round(weightKg * 2.2);
  const fatGrams = Math.round(weightKg * 1.0);

  const proteinCalories = proteinGrams * 4;
  const fatCalories = fatGrams * 9;
  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
  const carbGrams = Math.round(remainingCalories / 4);

  return {
    bmr,
    tdee,
    targetCalories,
    proteinGrams,
    fatGrams,
    carbGrams,
  };
}

describe('Bio-Nutrition TDEE & Macro Calculation Math Suite (tdeeMacro.test.ts)', () => {
  it('should accurately calculate BMR and TDEE for a 75kg, 180cm, 25yo male with moderate activity', () => {
    const input: BmrInput = {
      weightKg: 75,
      heightCm: 180,
      age: 25,
      gender: 'male',
      activityLevel: 'moderate',
      goal: 'maintain',
    };

    const result = calculateTdeeAndMacros(input);

    // BMR = 10*75 + 6.25*180 - 5*25 + 5 = 750 + 1125 - 125 + 5 = 1755 kcal
    expect(result.bmr).toBe(1755);

    // TDEE = 1755 * 1.55 = 2720.25 -> 2720 kcal
    expect(result.tdee).toBe(2720);
    expect(result.targetCalories).toBe(2720);

    // Protein = 75 * 2.2 = 165g
    expect(result.proteinGrams).toBe(165);

    // Fat = 75 * 1.0 = 75g
    expect(result.fatGrams).toBe(75);

    // Protein Cals = 165*4 = 660, Fat Cals = 75*9 = 675. Total = 1335
    // Remaining Carbs = (2720 - 1335) / 4 = 1385 / 4 = 346g
    expect(result.carbGrams).toBe(346);
  });

  it('should apply 20% calorie deficit for a fat loss cut goal', () => {
    const input: BmrInput = {
      weightKg: 80,
      heightCm: 175,
      age: 30,
      gender: 'male',
      activityLevel: 'sedentary',
      goal: 'cut',
    };

    const result = calculateTdeeAndMacros(input);

    // BMR = 10*80 + 6.25*175 - 5*30 + 5 = 800 + 1093.75 - 150 + 5 = 1748.75 -> 1749 kcal
    expect(result.bmr).toBe(1749);

    // TDEE = 1749 * 1.2 = 2098.8 -> 2099 kcal
    expect(result.tdee).toBe(2099);

    // Cut Target = 2099 * 0.8 = 1679.2 -> 1679 kcal
    expect(result.targetCalories).toBe(1679);
  });
});
