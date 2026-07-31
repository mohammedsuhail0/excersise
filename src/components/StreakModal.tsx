import React, { useState } from 'react';
import { X, Flame, Shield, CheckCircle2, Calendar, Award, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { soundEngine } from '../services/soundEngine';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [isCheckedInToday, setIsCheckedInToday] = useState(false);

  if (!isOpen) return null;

  const handleCheckIn = () => {
    soundEngine.playSetCompleteChime();
    setIsCheckedInToday(true);
    onUpdateUser({
      streakDays: user.streakDays + 1,
      xp: user.xp + 50,
    });
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fade-up">
      <div className="w-full max-w-sm bg-[#0f1420]/95 border border-white/15 rounded-[32px] p-5 space-y-4 shadow-2xl relative text-white">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold leading-tight">Daily Streak Tracker</h2>
              <p className="text-[10px] text-orange-400 font-semibold uppercase tracking-wider">
                Keep the Flame Alive 🔥
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

        {/* STREAK COUNTER DISPLAY */}
        <div className="liquid-glass rounded-[24px] p-4 text-center space-y-2 border border-orange-500/30 relative overflow-hidden">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
            <Flame className="w-8 h-8 text-white fill-white animate-pulse" />
          </div>

          <div>
            <span className="text-3xl font-black text-white leading-none">
              {user.streakDays} <span className="text-orange-400 text-2xl">Days</span>
            </span>
            <p className="text-[11px] text-white/60 mt-1 font-medium">
              {user.streakDays === 0
                ? "Start your workout streak today!"
                : `Awesome! You are on a ${user.streakDays}-day streak!`}
            </p>
          </div>
        </div>

        {/* 7-DAY WEEKLY CALENDAR STRIP */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-white/70">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-orange-400" /> Weekly Activity
            </span>
            <span className="text-orange-400">+50 XP Per Check-In</span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day, index) => {
              const isPastOrToday = index <= (user.streakDays % 7);
              return (
                <div
                  key={day}
                  className={`rounded-2xl p-2 text-center border transition-all ${
                    isPastOrToday
                      ? 'liquid-glass-selected border-orange-500/40 text-orange-400'
                      : 'liquid-glass border-white/5 text-white/40'
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase block">{day}</span>
                  <div className="mt-1 flex items-center justify-center">
                    {isPastOrToday ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 fill-orange-400/20" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DAILY CHECK-IN BUTTON */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          {!isCheckedInToday ? (
            <button
              onClick={handleCheckIn}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[12px] font-extrabold uppercase shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Check In Today (+1 Day Streak & +50 XP)</span>
            </button>
          ) : (
            <div className="w-full py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold text-center flex items-center justify-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Checked In For Today! Streak Protected 🔥</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
