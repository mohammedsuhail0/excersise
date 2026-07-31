import React from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { FeatureConfig } from '../types';

interface FeatureSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FeatureConfig;
  onToggleFeature: (key: keyof FeatureConfig) => void;
}

export const FeatureSettingsModal: React.FC<FeatureSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onToggleFeature,
}) => {
  if (!isOpen) return null;

  const featureList: { key: keyof FeatureConfig; label: string; desc: string }[] = [
    { key: 'skillTree', label: 'Pure Calisthenics Tree', desc: 'Master Skills & Phase Progression' },
    { key: 'workoutTracker', label: 'Workout Tracker', desc: 'Sets, reps & rest timer' },
    { key: 'musicDeck', label: 'Focus Audio Deck', desc: 'Ambient focus soundscapes' },
    { key: 'macroTracker', label: 'Nutritional Fuel', desc: 'Macronutrients & calories' },
    { key: 'gamification', label: 'XP & Leveling System', desc: 'Streak & level progress' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up">
      <div className="w-full max-w-sm bg-[#0f1420]/95 border border-white/10 rounded-[32px] p-5 space-y-4 shadow-2xl relative text-white">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-orange-400" />
            <h2 className="text-[16px] font-bold">App Modules</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {featureList.map((item) => {
            const isActive = !!config[item.key];
            return (
              <div
                key={item.key}
                onClick={() => onToggleFeature(item.key)}
                className={`p-3 rounded-[20px] cursor-pointer transition-all flex items-center justify-between ${
                  isActive ? 'liquid-glass-selected' : 'liquid-glass opacity-60'
                }`}
              >
                <div>
                  <h3 className="text-[13px] font-medium text-white">{item.label}</h3>
                  <p className="text-[10px] text-white/60">{item.desc}</p>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-orange-500 text-white' : 'liquid-glass text-white/40'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium text-[13px] shadow-lg active:scale-95 transition-transform"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
