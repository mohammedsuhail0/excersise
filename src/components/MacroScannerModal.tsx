import React, { useState } from 'react';
import { Utensils, Plus, Check, Flame } from 'lucide-react';

export const MacroScannerModal: React.FC = () => {
  const [calories, setCalories] = useState(1850);
  const targetCalories = 2400;

  const [protein, setProtein] = useState(140);
  const targetProtein = 180;

  const [carbs, setCarbs] = useState(210);
  const targetCarbs = 260;

  const [fat, setFat] = useState(55);
  const targetFat = 75;

  const [mealLogged, setMealLogged] = useState(false);

  const handleAddMeal = () => {
    setCalories((prev) => Math.min(targetCalories, prev + 450));
    setProtein((prev) => Math.min(targetProtein, prev + 35));
    setCarbs((prev) => Math.min(targetCarbs, prev + 50));
    setFat((prev) => Math.min(targetFat, prev + 12));
    setMealLogged(true);
    setTimeout(() => setMealLogged(false), 2000);
  };

  const calPercent = Math.round((calories / targetCalories) * 100);

  return (
    <div className="flex flex-col h-full justify-between select-none animate-fade-up space-y-2.5">
      {/* Header */}
      <div className="liquid-glass rounded-[24px] p-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Utensils className="w-5 h-5 text-orange-400" />
          <div>
            <h3 className="text-[15px] font-medium text-white">Nutritional Fuel</h3>
            <p className="text-[11px] text-white/60">Energy & macronutrient tracking</p>
          </div>
        </div>

        <button
          onClick={handleAddMeal}
          className="liquid-glass-selected px-3.5 py-1.5 rounded-full text-[11px] font-medium text-white flex items-center space-x-1"
        >
          {mealLogged ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{mealLogged ? 'Logged' : 'Add Meal'}</span>
        </button>
      </div>

      {/* Main Calorie Ring */}
      <div className="liquid-glass rounded-[28px] p-6 flex-1 flex flex-col items-center justify-center space-y-3 my-1">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-white/10"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-orange-400"
              strokeDasharray={`${calPercent}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-white">{calories}</span>
            <span className="text-[11px] text-white/60">/ {targetCalories} kcal</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-white/70">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>{targetCalories - calories} kcal remaining today</span>
        </div>
      </div>

      {/* Macro Breakdown Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="liquid-glass rounded-[22px] p-3.5 text-center">
          <span className="text-[11px] font-medium text-orange-400 block">Protein</span>
          <span className="text-[17px] font-bold text-white">{protein}g</span>
          <span className="text-[10px] text-white/50 block">/ {targetProtein}g</span>
        </div>

        <div className="liquid-glass rounded-[22px] p-3.5 text-center">
          <span className="text-[11px] font-medium text-amber-400 block">Carbs</span>
          <span className="text-[17px] font-bold text-white">{carbs}g</span>
          <span className="text-[10px] text-white/50 block">/ {targetCarbs}g</span>
        </div>

        <div className="liquid-glass rounded-[22px] p-3.5 text-center">
          <span className="text-[11px] font-medium text-amber-500 block">Fats</span>
          <span className="text-[17px] font-bold text-white">{fat}g</span>
          <span className="text-[10px] text-white/50 block">/ {targetFat}g</span>
        </div>
      </div>
    </div>
  );
};
