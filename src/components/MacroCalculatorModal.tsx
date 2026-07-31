import React, { useState } from 'react';
import { X, Utensils, Flame, Sparkles, Scale, Ruler, Trophy, Bot, CheckCircle2, ChevronRight } from 'lucide-react';
import { UserProfile, TargetPhysique } from '../types';
import { callMultiProviderLLMCoachAPI } from '../services/aiEngine';
import { soundEngine } from '../services/soundEngine';

interface MacroCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const MacroCalculatorModal: React.FC<MacroCalculatorModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [weightKg, setWeightKg] = useState<number>(user.weightKg || 70);
  const [heightCm, setHeightCm] = useState<number>(user.heightCm || 175);
  const [age, setAge] = useState<number>(24);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active'>('moderate');
  const [goal, setGoal] = useState<'cut' | 'maintain' | 'bulk'>('maintain');

  const [aiMealPlan, setAiMealPlan] = useState<string>('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);

  if (!isOpen) return null;

  // Calculate Mifflin-St Jeor BMR & TDEE
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr += gender === 'male' ? 5 : -161;
  bmr = Math.round(bmr);

  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    moderate: 1.55,
    active: 1.75,
  };
  const tdee = Math.round(bmr * (multipliers[activityLevel] || 1.55));

  let targetCalories = tdee;
  if (goal === 'cut') targetCalories = Math.round(tdee * 0.8);
  if (goal === 'bulk') targetCalories = Math.round(tdee * 1.15);

  const proteinGrams = Math.round(weightKg * 2.2);
  const fatGrams = Math.round(weightKg * 1.0);

  const proteinCalories = proteinGrams * 4;
  const fatCalories = fatGrams * 9;
  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
  const carbGrams = Math.round(remainingCalories / 4);

  const goalTitleMap = {
    cut: 'Fat Loss Cut',
    maintain: 'Recomp & Maintenance',
    bulk: 'Lean Muscle Bulk',
  };

  const handleGenerateAIMealPlan = async () => {
    soundEngine.playTick();
    setIsGeneratingPlan(true);
    setAiMealPlan('');

    const prompt = `Generate a high-protein 1-day calisthenics meal plan for a ${weightKg}kg ${gender} athlete aiming for ${goalTitleMap[goal]}:
- Daily Calorie Goal: ${targetCalories} kcal
- Protein Target: ${proteinGrams} grams
- Carbs Target: ${carbGrams} grams
- Fats Target: ${fatGrams} grams

Structure into 4 meals (Breakfast, Lunch, Pre-Workout Snack, Dinner). Keep it high-protein, clean, delicious, and concise!`;

    try {
      const planText = await callMultiProviderLLMCoachAPI(prompt, user);
      soundEngine.playSetCompleteChime();
      setAiMealPlan(planText);
    } catch (e) {
      console.error('Failed to generate meal plan:', e);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fade-up">
      <div className="w-full max-w-sm h-[92vh] max-h-[640px] bg-[#0f1420]/95 border border-white/15 rounded-[32px] p-4 flex flex-col justify-between shadow-2xl relative text-white">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Utensils className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-[15px] font-extrabold leading-tight">Bio-Nutrition Macro Calculator</h2>
              <p className="text-[10px] text-orange-400 font-semibold uppercase tracking-wider">
                Mifflin-St Jeor TDEE Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full liquid-glass flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CALCULATOR CONTROLS & RESULT DISPLAY */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 my-2 pr-1">
          
          {/* TDEE & MACRO RESULTS CARD */}
          <div className="liquid-glass rounded-[24px] p-3.5 border border-orange-500/30 text-center space-y-2 relative overflow-hidden">
            <div>
              <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest block">
                Target Daily Energy
              </span>
              <h3 className="text-3xl font-black text-white leading-none mt-1">
                {targetCalories.toLocaleString()} <span className="text-sm font-bold text-orange-400">kcal/day</span>
              </h3>
              <p className="text-[10px] text-white/60 font-medium mt-1">
                BMR: {bmr.toLocaleString()} kcal • TDEE: {tdee.toLocaleString()} kcal
              </p>
            </div>

            {/* TRIPLE MACRO CARDS */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <div className="bg-orange-500/15 border border-orange-500/30 rounded-2xl p-2 text-center">
                <span className="text-[14px] font-black text-orange-400 block">{proteinGrams}g</span>
                <span className="text-[9px] text-white/60 font-bold block uppercase">Protein</span>
              </div>
              <div className="bg-amber-500/15 border border-amber-500/30 rounded-2xl p-2 text-center">
                <span className="text-[14px] font-black text-amber-400 block">{carbGrams}g</span>
                <span className="text-[9px] text-white/60 font-bold block uppercase">Carbs</span>
              </div>
              <div className="bg-yellow-500/15 border border-yellow-500/30 rounded-2xl p-2 text-center">
                <span className="text-[14px] font-black text-yellow-400 block">{fatGrams}g</span>
                <span className="text-[9px] text-white/60 font-bold block uppercase">Fats</span>
              </div>
            </div>
          </div>

          {/* INPUT FORM FIELDS */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9.5px] font-bold text-white/70 uppercase">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-[12px] text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9.5px] font-bold text-white/70 uppercase">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-[12px] text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* GOAL SELECTION PILLS */}
            <div className="space-y-1">
              <label className="text-[9.5px] font-bold text-white/70 uppercase">Fitness Goal</label>
              <div className="grid grid-cols-3 gap-1 p-1 liquid-glass rounded-2xl border border-white/10">
                {(['cut', 'maintain', 'bulk'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      soundEngine.playTick();
                      setGoal(g);
                    }}
                    className={`py-1.5 rounded-xl text-[10px] font-extrabold uppercase transition-all ${
                      goal === g
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI MEAL PLAN GENERATION */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              onClick={handleGenerateAIMealPlan}
              disabled={isGeneratingPlan}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-extrabold uppercase shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <Bot className="w-4 h-4" />
              <span>{isGeneratingPlan ? 'Sensei AI Generating Meal Plan...' : 'Generate AI Meal Plan'}</span>
            </button>

            {aiMealPlan && (
              <div className="liquid-glass rounded-[20px] p-3 border border-orange-500/30 text-[11px] leading-relaxed text-white/90 whitespace-pre-wrap space-y-1 animate-fade-up">
                <div className="flex items-center space-x-1 text-orange-400 font-bold text-[11px] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sensei High-Protein Meal Plan</span>
                </div>
                <div>{aiMealPlan}</div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
