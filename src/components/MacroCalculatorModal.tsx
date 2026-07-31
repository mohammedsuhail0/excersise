import React, { useState } from 'react';
import { X, Calculator, Utensils, Flame, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import { callMultiProviderLLMCoachAPI } from '../services/aiEngine';
import { soundEngine } from '../services/soundEngine';

interface MacroCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

type Goal = 'cut' | 'maintain' | 'bulk';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'intense';

export const MacroCalculatorModal: React.FC<MacroCalculatorModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [weightKg, setWeightKg] = useState<number>(user.weightKg || 78);
  const [heightCm, setHeightCm] = useState<number>(user.heightCm || 180);
  const [age, setAge] = useState<number>(22);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('cut');

  const [aiMealPlan, setAiMealPlan] = useState<string>('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);

  if (!isOpen) return null;

  // Mifflin-St Jeor Equation for BMR
  const bmr =
    gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    intense: 1.725,
  };

  const tdee = Math.round(bmr * activityMultipliers[activity]);

  let targetCalories = tdee;
  if (goal === 'cut') targetCalories = Math.round(tdee * 0.8); // 20% deficit
  if (goal === 'bulk') targetCalories = Math.round(tdee * 1.15); // 15% surplus

  // Macro Calculation:
  // Protein: 2.2g per kg
  // Fat: 25% of target calories / 9
  // Carbs: Remaining calories / 4
  const proteinGrams = Math.round(weightKg * 2.2);
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  const carbGrams = Math.round((targetCalories - proteinGrams * 4 - fatGrams * 9) / 4);

  const goalLabel = goal === 'cut' ? 'FAT LOSS DEFICIT' : goal === 'bulk' ? 'LEAN MUSCLE BULK' : 'MAINTENANCE';

  const handleGenerateAIMealPlan = async () => {
    soundEngine.playTick();
    setIsGeneratingPlan(true);
    setAiMealPlan('');

    const prompt = `Generate a high-protein 1-day calisthenics meal plan for a ${weightKg}kg ${gender} athlete:
- Daily Target: ${targetCalories} kcal
- Protein: ${proteinGrams}g | Carbs: ${carbGrams}g | Fats: ${fatGrams}g
- Goal: ${goalLabel}

Format with 4 meals (Breakfast, Lunch, Pre-Workout Snack, Dinner). Keep it concise, high-protein, delicious, and easy to prepare!`;

    try {
      const planText = await callMultiProviderLLMCoachAPI(prompt, user, 'nvidia');
      soundEngine.playSetCompleteChime();
      setAiMealPlan(planText);
    } catch (e) {
      console.error('Failed to generate AI meal plan:', e);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fade-up">
      <div className="w-full max-w-sm max-h-[90vh] bg-[#0f1420]/95 border border-amber-500/40 rounded-[32px] flex flex-col justify-between overflow-hidden shadow-2xl relative text-white">
        
        {/* HEADER */}
        <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md border border-white/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <h2 className="text-[15px] font-extrabold leading-tight">Macro & TDEE Calculator</h2>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[9.5px] text-amber-400 font-semibold">Precision Bio-Nutrition Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full liquid-glass flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SCROLLABLE FORM & STATS */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 no-scrollbar">
          
          {/* STATS CARDS SUMMARY */}
          <div className="grid grid-cols-2 gap-2">
            <div className="liquid-glass p-3 rounded-2xl border border-amber-500/30 text-center">
              <span className="text-[9px] text-amber-400/80 font-bold uppercase tracking-wider block">Daily Calories</span>
              <span className="text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-orange-500" />
                {targetCalories} <span className="text-[10px] text-white/60">kcal</span>
              </span>
              <span className="text-[8.5px] text-white/50 block capitalize">Goal: {goal}</span>
            </div>

            <div className="liquid-glass p-3 rounded-2xl border border-white/15 text-center">
              <span className="text-[9px] text-white/60 font-bold uppercase tracking-wider block">TDEE Maintenance</span>
              <span className="text-2xl font-black text-white">{tdee}</span>
              <span className="text-[8.5px] text-emerald-400 block">BMR: {Math.round(bmr)} kcal</span>
            </div>
          </div>

          {/* MACRO BREAKDOWN PILLS */}
          <div className="liquid-glass p-3 rounded-2xl border border-white/10 space-y-2">
            <span className="text-[10px] font-extrabold text-white/80 uppercase tracking-wider block">Target Macro Breakdown</span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-orange-500/20 border border-orange-500/40 p-2 rounded-xl">
                <span className="text-[9px] text-orange-300 font-bold block">Protein</span>
                <span className="text-base font-black text-white">{proteinGrams}g</span>
              </div>
              <div className="bg-amber-500/20 border border-amber-500/40 p-2 rounded-xl">
                <span className="text-[9px] text-amber-300 font-bold block">Carbs</span>
                <span className="text-base font-black text-white">{carbGrams}g</span>
              </div>
              <div className="bg-emerald-500/20 border border-emerald-500/40 p-2 rounded-xl">
                <span className="text-[9px] text-emerald-300 font-bold block">Fats</span>
                <span className="text-base font-black text-white">{fatGrams}g</span>
              </div>
            </div>
          </div>

          {/* INPUT FORM CONTROLS */}
          <div className="space-y-3 bg-black/40 p-3 rounded-2xl border border-white/10">
            {/* GOAL SELECTOR */}
            <div>
              <label className="text-[10px] text-white/70 font-bold block mb-1">FITNESS GOAL</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['cut', 'maintain', 'bulk'] as Goal[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      soundEngine.playTick();
                      setGoal(g);
                    }}
                    className={`py-1.5 rounded-xl text-[10.5px] font-extrabold uppercase transition-all ${
                      goal === g
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* WEIGHT & HEIGHT */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-white/70 font-bold block mb-1">WEIGHT (KG)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none font-bold text-center"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/70 font-bold block mb-1">HEIGHT (CM)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none font-bold text-center"
                />
              </div>
            </div>

            {/* AGE & ACTIVITY */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-white/70 font-bold block mb-1">AGE</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none font-bold text-center"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/70 font-bold block mb-1">ACTIVITY</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-2 py-1.5 text-[11px] text-white outline-none font-bold capitalize"
                >
                  <option value="sedentary" className="bg-[#0f1420] text-white">Sedentary</option>
                  <option value="light" className="bg-[#0f1420] text-white">Light (1-3 days)</option>
                  <option value="moderate" className="bg-[#0f1420] text-white">Moderate (3-5 days)</option>
                  <option value="intense" className="bg-[#0f1420] text-white">Intense (6-7 days)</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI MEAL PLAN GENERATOR BUTTON */}
          <button
            onClick={handleGenerateAIMealPlan}
            disabled={isGeneratingPlan}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white font-extrabold text-xs shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 border border-white/20 disabled:opacity-50"
          >
            {isGeneratingPlan ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Generating NVIDIA AI Meal Plan...</span>
              </>
            ) : (
              <>
                <Utensils className="w-4 h-4 text-white" />
                <span>Generate 1-Day AI Meal Plan</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              </>
            )}
          </button>

          {/* AI GENERATED MEAL PLAN DISPLAY */}
          {aiMealPlan && (
            <div className="liquid-glass p-3.5 rounded-2xl border border-amber-500/40 space-y-2 animate-fade-up">
              <div className="flex items-center space-x-2 text-amber-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[11px] font-extrabold">Your Custom NVIDIA AI Meal Plan</span>
              </div>
              <p className="text-[11.5px] leading-relaxed text-white/90 whitespace-pre-line font-medium bg-black/40 p-3 rounded-xl border border-white/10">
                {aiMealPlan}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
