import React from 'react';
import { X, CheckCircle2, AlertTriangle, Lightbulb, Target, Activity } from 'lucide-react';
import { CalisthenicsExercise } from '../types';

interface FormGuideModalProps {
  exercise: CalisthenicsExercise | null;
  onClose: () => void;
}

export const ExerciseFormGuideModal: React.FC<FormGuideModalProps> = ({ exercise, onClose }) => {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center p-2 sm:p-4 animate-fade-up">
      <div className="w-full max-w-md bg-[#0f1420]/95 border border-white/10 rounded-[32px] p-5 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl relative text-white">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Activity className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-[17px] font-bold leading-tight">{exercise.name}</h2>
              <p className="text-[11px] text-orange-400 font-medium">
                Equipment: {exercise.equipmentRequired === 'Home' ? '🏠 Home (Pull-Up Rod + Floor)' : '🏋️ Gym / Calisthenics Park'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated Cue Box */}
        <div className="liquid-glass rounded-[20px] p-3.5 flex items-center space-x-3 border border-orange-500/20 bg-orange-500/5">
          <Target className="w-5 h-5 text-orange-400 shrink-0 animate-pulse" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 block">Movement Trajectory</span>
            <p className="text-[12px] text-white/90 leading-snug">{exercise.formGuide.animatedCue}</p>
          </div>
        </div>

        {/* Target Muscles */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block">Target Muscles</span>
          <div className="flex flex-wrap gap-1.5">
            {exercise.targetMuscles.map((muscle) => (
              <span
                key={muscle}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-white/90"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {/* 1. Grip & Setup */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-emerald-400 text-[12px] font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>1. Grip & Hand Setup</span>
          </div>
          <p className="text-[12px] text-white/80 pl-5 leading-relaxed">{exercise.formGuide.gripSetup}</p>
        </div>

        {/* 2. Body Alignment */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-cyan-400 text-[12px] font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>2. Body Alignment & Core Tension</span>
          </div>
          <p className="text-[12px] text-white/80 pl-5 leading-relaxed">{exercise.formGuide.bodyAlignment}</p>
        </div>

        {/* 3. Execution Path */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-orange-400 text-[12px] font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>3. Execution & Range of Motion</span>
          </div>
          <p className="text-[12px] text-white/80 pl-5 leading-relaxed">{exercise.formGuide.execution}</p>
        </div>

        {/* 4. Common Mistakes to Avoid */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-1.5 text-red-400 text-[12px] font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Common Mistakes (What NOT To Do)</span>
          </div>
          <ul className="space-y-1 pl-5">
            {exercise.formGuide.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="text-[11px] text-white/70 list-disc leading-tight">
                {mistake}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Tip Box */}
        <div className="liquid-glass rounded-[20px] p-3 flex items-start space-x-2.5 border border-amber-400/20 bg-amber-400/5">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">Calisthenics Pro Tip</span>
            <p className="text-[11px] text-white/80 leading-snug">{exercise.formGuide.proTips}</p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium text-[13px] shadow-lg active:scale-95 transition-transform"
        >
          Got It — Return to Workout
        </button>
      </div>
    </div>
  );
};
