import React, { useState } from 'react';
import { X, User, Scale, Ruler, Trophy, LogOut, Save, CheckCircle2 } from 'lucide-react';
import { UserProfile, TargetPhysique } from '../types';
import { soundEngine } from '../services/soundEngine';

interface AccountProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onSignOut: () => void;
}

export const AccountProfileModal: React.FC<AccountProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateProfile,
  onSignOut,
}) => {
  const [name, setName] = useState(user.name);
  const [weightKg, setWeightKg] = useState(user.weightKg);
  const [heightCm, setHeightCm] = useState(user.heightCm);
  const [targetPhysique, setTargetPhysique] = useState<TargetPhysique>(user.targetPhysique);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playTick();
    onUpdateProfile({
      name,
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      targetPhysique,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fade-up">
      <div className="w-full max-w-sm bg-[#0f1420]/95 border border-white/15 rounded-[32px] p-5 space-y-4 shadow-2xl relative text-white">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-md">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold leading-tight">Athlete Profile</h2>
              <p className="text-[10px] text-orange-400 font-semibold uppercase tracking-wider">
                Level {user.level} Athlete • {user.xp}/{user.maxXp} XP
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

        {savedSuccess && (
          <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile Saved & Synced to Cloud!</span>
          </div>
        )}

        {/* PROFILE EDIT FORM */}
        <form onSubmit={handleSave} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/70 uppercase">Athlete Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-white/40 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-9 pr-3 text-[12px] text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/70 uppercase">Weight (kg)</label>
              <div className="relative">
                <Scale className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  min={30}
                  max={250}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-9 pr-3 text-[12px] text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/70 uppercase">Height (cm)</label>
              <div className="relative">
                <Ruler className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  min={100}
                  max={240}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-9 pr-3 text-[12px] text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/70 uppercase">Target Physique Goal</label>
            <div className="relative">
              <Trophy className="w-4 h-4 text-white/40 absolute left-3 top-3 pointer-events-none" />
              <select
                value={targetPhysique}
                onChange={(e) => setTargetPhysique(e.target.value as TargetPhysique)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-9 pr-3 text-[12px] text-white focus:outline-none focus:border-orange-500 appearance-none"
              >
                <option value="Anime Aesthetic" className="bg-[#0f1420] text-white">Anime Aesthetic</option>
                <option value="Lean Athletic" className="bg-[#0f1420] text-white">Lean Athletic</option>
                <option value="Powerlifter" className="bg-[#0f1420] text-white">Powerlifter</option>
                <option value="Zen Mobility" className="bg-[#0f1420] text-white">Zen Mobility</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[12px] font-extrabold uppercase shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </form>

        {/* SIGN OUT */}
        <div className="pt-2 border-t border-white/10">
          <button
            onClick={() => {
              soundEngine.playTick();
              onSignOut();
              onClose();
            }}
            className="w-full py-2 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-[11px] font-bold uppercase flex items-center justify-center space-x-1.5 hover:bg-red-500/25 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
