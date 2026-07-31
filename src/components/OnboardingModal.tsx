import React, { useState } from 'react';
import { TargetPhysique, UserProfile } from '../types';
import { Sparkles, Dumbbell, Flame, Heart, X } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveProfile: (updated: Partial<UserProfile>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveProfile,
}) => {
  const [name, setName] = useState(user.name);
  const [heightCm, setHeightCm] = useState(user.heightCm);
  const [weightKg, setWeightKg] = useState(user.weightKg);
  const [targetPhysique, setTargetPhysique] = useState<TargetPhysique>(user.targetPhysique);

  if (!isOpen) return null;

  const handleSave = () => {
    soundEngine.playSetCompleteChime();
    onSaveProfile({
      name,
      heightCm,
      weightKg,
      targetPhysique,
    });
    onClose();
  };

  const physiques: { id: TargetPhysique; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'Anime Aesthetic',
      title: 'Anime Aesthetic',
      desc: 'Lean, V-tapered waist, defined abs, high mobility.',
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: 'Lean Athletic',
      title: 'Lean Athletic',
      desc: 'Functional stamina, postured strength, balanced cardio.',
      icon: <Flame className="w-5 h-5 text-cyan-400" />,
    },
    {
      id: 'Powerlifter',
      title: 'Powerlifter',
      desc: 'Heavy compound strength, dense muscle mass, max effort.',
      icon: <Dumbbell className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'Zen Mobility',
      title: 'Zen Mobility',
      desc: 'Active recovery, spinal health, deep flexibility.',
      icon: <Heart className="w-5 h-5 text-teal-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#161f32] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Target Physique Goal</h2>
            <p className="text-xs text-slate-400">Customize your physical targets and dimensions.</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Target Physique Style</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {physiques.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setTargetPhysique(p.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    targetPhysique === p.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : 'bg-slate-800/40 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {p.icon}
                    <h4 className="text-xs font-bold text-white">{p.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button onClick={handleSave} className="w-full btn-primary py-2.5 text-sm">
            Save Target Profile
          </button>
        </div>
      </div>
    </div>
  );
};
