import React from 'react';
import { Sparkles, Dumbbell, Activity, Utensils, Music, Shield, ArrowRight, Zap, Trophy, Users, Flame, Lock } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenAuth }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 overflow-y-auto no-scrollbar relative select-none animate-fade-up text-white">
      
      {/* HERO SECTION */}
      <div className="space-y-4 pt-4 text-center">
        {/* BADGE */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[11px] font-extrabold shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>NEXT-GEN AI CALISTHENICS PLATFORM</span>
        </div>

        {/* HERO TITLE */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
            AURAFIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500">AI</span>
          </h1>
          <p className="text-[12px] text-white/70 max-w-xs mx-auto leading-relaxed">
            Master bodyweight skills, get sub-second AI coaching, track your steps, and listen to hype workout playlists.
          </p>
        </div>

        {/* PRIMARY CTA BUTTONS */}
        <div className="space-y-2 pt-2 max-w-xs mx-auto">
          <button
            onClick={() => {
              soundEngine.playTick();
              onEnterApp();
            }}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-[13px] uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <span>Launch Workout Engine</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                soundEngine.playTick();
                onOpenAuth();
              }}
              className="flex-1 py-2.5 rounded-full liquid-glass border border-white/20 text-white font-bold text-[11px] hover:border-orange-500 transition-all flex items-center justify-center space-x-1"
            >
              <Lock className="w-3.5 h-3.5 text-orange-400" />
              <span>Sign In / Register</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playTick();
                onEnterApp();
              }}
              className="flex-1 py-2.5 rounded-full liquid-glass border border-white/10 text-white/70 font-bold text-[11px] hover:text-white transition-all"
            >
              <span>Guest Trial</span>
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE CARDS GRID */}
      <div className="grid grid-cols-2 gap-2.5 my-6">
        <div className="liquid-glass rounded-[24px] p-3.5 border border-white/10 space-y-1.5">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-[13px] font-extrabold leading-snug">50ms AI Coach</h3>
          <p className="text-[10px] text-white/60 leading-tight">Instant Groq Llama 3.3 form cues & custom meal plans.</p>
        </div>

        <div className="liquid-glass rounded-[24px] p-3.5 border border-white/10 space-y-1.5">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Dumbbell className="w-4 h-4" />
          </div>
          <h3 className="text-[13px] font-extrabold leading-snug">Skill Progression</h3>
          <p className="text-[10px] text-white/60 leading-tight">Unlock Chest, Push, Pull & Muscle-Up tiers as you level up.</p>
        </div>

        <div className="liquid-glass rounded-[24px] p-3.5 border border-white/10 space-y-1.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="text-[13px] font-extrabold leading-snug">Step Pedometer</h3>
          <p className="text-[10px] text-white/60 leading-tight">Hardware Motion sensing with cadence shake rejection.</p>
        </div>

        <div className="liquid-glass rounded-[24px] p-3.5 border border-white/10 space-y-1.5">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Music className="w-4 h-4" />
          </div>
          <h3 className="text-[13px] font-extrabold leading-snug">Spotify Hype Deck</h3>
          <p className="text-[10px] text-white/60 leading-tight">Trending Phonk, Hardstyle & Lofi relaxation playlists.</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center pt-2 border-t border-white/10">
        <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
          AuraFit AI • Built for Calisthenics Athletes
        </p>
      </div>

    </div>
  );
};
