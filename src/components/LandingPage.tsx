import React from 'react';
import { Sparkles, Dumbbell, Activity, Utensils, Music, Shield, ArrowRight, Zap, Trophy, Users, Flame, Lock, CheckCircle2, Star } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenAuth }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between overflow-y-auto no-scrollbar relative select-none animate-fade-up text-white p-4 space-y-6">
      
      {/* TOP LANDING NAVBAR */}
      <header className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-orange-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-[16px] font-black tracking-tight text-white">
            AURAFIT <span className="text-orange-400">AI</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              soundEngine.playTick();
              onOpenAuth();
            }}
            className="px-3.5 py-1.5 rounded-full liquid-glass border border-white/20 text-white font-bold text-[11px] hover:border-orange-500 transition-all"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="text-center space-y-4 pt-2">
        {/* TOP BADGE */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[11px] font-extrabold shadow-sm">
          <Zap className="w-3.5 h-3.5" />
          <span>POWERED BY 50MS GROQ LLM AI</span>
        </div>

        {/* HERO TITLE */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
            Master Calisthenics With <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500">
              AI-Powered Coaching
            </span>
          </h1>
          <p className="text-[12px] text-white/70 max-w-xs mx-auto leading-relaxed font-medium">
            Unlock bodyweight skills, get sub-second form cues, track hardware steps, and train with hype Spotify playlists.
          </p>
        </div>

        {/* HERO CALL TO ACTION (CTA) */}
        <div className="space-y-2 pt-2 max-w-xs mx-auto">
          <button
            onClick={() => {
              soundEngine.playTick();
              onOpenAuth();
            }}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-[13px] uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <span>Start Training Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundEngine.playTick();
              onEnterApp();
            }}
            className="w-full py-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 font-semibold text-[11px] hover:text-white hover:border-white/20 transition-all"
          >
            Preview App Dashboard
          </button>
        </div>

        {/* SOCIAL PROOF RATING BAR */}
        <div className="flex items-center justify-center space-x-3 pt-2 text-[11px] text-white/70 font-semibold">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400" />
          </div>
          <span>4.9/5 Rating • 10k+ Workouts</span>
        </div>
      </section>

      {/* FEATURE CARDS GRID */}
      <section className="space-y-3">
        <h2 className="text-[12px] font-extrabold uppercase text-orange-400 tracking-wider text-center">
          Everything You Need To Build An Aesthetic Physique
        </h2>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="liquid-glass rounded-[24px] p-3.5 border border-white/10 space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-[13px] font-extrabold leading-snug">50ms Sensei AI</h3>
            <p className="text-[10px] text-white/60 leading-tight">Instant form checks and custom high-protein meal plans.</p>
          </div>

          <div className="liquid-glass rounded-[24px] p-3.5 border border-white/10 space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
            <h3 className="text-[13px] font-extrabold leading-snug">Calisthenics Tree</h3>
            <p className="text-[10px] text-white/60 leading-tight">Progressive tiers from push-ups to muscle-ups.</p>
          </div>

          <div className="liquid-glass rounded-[24px] p-3.5 border border-white/10 space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-[13px] font-extrabold leading-snug">Motion Pedometer</h3>
            <p className="text-[10px] text-white/60 leading-tight">Hardware accelerometer walking stride counter.</p>
          </div>

          <div className="liquid-glass rounded-[24px] p-3.5 border border-white/10 space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Music className="w-4 h-4" />
            </div>
            <h3 className="text-[13px] font-extrabold leading-snug">Spotify Deck</h3>
            <p className="text-[10px] text-white/60 leading-tight">Trending Phonk, Hardstyle & Lofi workout playlists.</p>
          </div>
        </div>
      </section>

      {/* WHY ATHLETES CHOOSE AURAFIT */}
      <section className="liquid-glass rounded-[28px] p-4 border border-orange-500/30 space-y-3">
        <h3 className="text-[14px] font-black text-white flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-400" /> Why Calisthenics Athletes Love AuraFit
        </h3>
        
        <div className="space-y-2 text-[11px] text-white/80">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <span><strong>Zero Equipment Required:</strong> Train anywhere with progressive bodyweight movements.</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <span><strong>Gamified Leveling:</strong> Earn XP, level up, and maintain workout daily streaks.</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <span><strong>Bio-Macro Calculator:</strong> Calculate TDEE and tailored muscle-building nutrition.</span>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playTick();
            onOpenAuth();
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-[12px] uppercase shadow-md hover:scale-[1.02] transition-all"
        >
          Create Free Athlete Account
        </button>
      </section>

      {/* FOOTER */}
      <footer className="text-center pt-3 border-t border-white/10 space-y-1 shrink-0">
        <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
          AuraFit AI © 2026 • All Rights Reserved
        </p>
      </footer>

    </div>
  );
};
