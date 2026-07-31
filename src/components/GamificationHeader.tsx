import React from 'react';
import { Flame, Sun, Moon, Image, Settings, Footprints } from 'lucide-react';
import { UserProfile } from '../types';

interface GamificationHeaderProps {
  user: UserProfile;
  currentSteps?: number;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
  onCycleBackground: () => void;
  onOpenSettings: () => void;
  onOpenStepCounter?: () => void;
}

export const GamificationHeader: React.FC<GamificationHeaderProps> = ({
  user,
  currentSteps = 6420,
  themeMode,
  onToggleTheme,
  onCycleBackground,
  onOpenSettings,
  onOpenStepCounter,
}) => {
  return (
    <div className="w-full flex items-center justify-between gap-1 select-none animate-fade-up">
      {/* LEFT: AVATAR + LEVEL & XP BAR */}
      <div className="flex items-center space-x-2 shrink-0">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-extrabold text-[13px] shadow-md border border-white/20">
            {user.name.charAt(0)}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 text-[8px] font-extrabold bg-black/90 text-orange-400 px-1 rounded-full border border-orange-500/40">
            Lvl {user.level}
          </span>
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-[11px] font-extrabold leading-none text-white tracking-tight">{user.name}</span>
          <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
              style={{ width: `${(user.xp / user.maxXp) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* RIGHT: CLEAN COMPACT INLINE BADGES (STREAK, COMPACT STEPS, THEME, BG, SETTINGS) */}
      <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
        {/* STREAK DAYS */}
        <div className="liquid-glass rounded-full px-1.5 py-0.5 flex items-center space-x-1 text-[9px] font-bold text-white shrink-0">
          <Flame className="w-2.5 h-2.5 text-orange-400 fill-orange-400" />
          <span>{user.streakDays}d</span>
        </div>

        {/* COMPACT PEDOMETER STEP COUNTER BUTTON */}
        {onOpenStepCounter && (
          <button
            onClick={onOpenStepCounter}
            className="liquid-glass-selected rounded-full px-1.5 py-0.5 flex items-center space-x-0.5 text-[9px] font-bold text-orange-400 border border-orange-500/30 hover:border-orange-500/60 shrink-0 transition-colors"
            title="Open Step Tracker"
          >
            <Footprints className="w-2.5 h-2.5 text-orange-400" />
            <span>{currentSteps > 9999 ? `${(currentSteps / 1000).toFixed(1)}k` : currentSteps.toLocaleString()}</span>
          </button>
        )}

        {/* THEME TOGGLE */}
        <button
          onClick={onToggleTheme}
          className="w-6.5 h-6.5 rounded-full liquid-glass flex items-center justify-center text-white/80 hover:text-white shrink-0 transition-colors"
          title="Toggle Dark/Light Mode"
        >
          {themeMode === 'dark' ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-slate-800" />}
        </button>

        {/* BG CYCLE BUTTON */}
        <button
          onClick={onCycleBackground}
          className="w-6.5 h-6.5 rounded-full liquid-glass flex items-center justify-center text-white/80 hover:text-white shrink-0 transition-colors"
          title="Cycle Background Image"
        >
          <Image className="w-3 h-3 text-orange-400" />
        </button>

        {/* SETTINGS GEAR */}
        <button
          onClick={onOpenSettings}
          className="w-6.5 h-6.5 rounded-full liquid-glass flex items-center justify-center text-white/80 hover:text-white shrink-0 transition-colors"
          title="Settings"
        >
          <Settings className="w-3 h-3 text-white/70" />
        </button>
      </div>
    </div>
  );
};
