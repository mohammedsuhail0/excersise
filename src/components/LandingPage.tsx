import React from 'react';
import { Sparkles, ArrowRight, Lock } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface LandingPageProps {
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-5 text-center select-none overflow-hidden text-white relative">
      
      {/* BRAND LOGO BADGE AT TOP */}
      <div className="pt-2">
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/40 mx-auto">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* ULTRA-MINIMAL CENTER HERO TITLE */}
      <div className="space-y-2.5 max-w-xs my-auto">
        <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
          AURAFIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500">AI</span>
        </h1>
        <p className="text-[12px] text-white/70 font-medium leading-relaxed">
          AI Calisthenics • Bodyweight Progression • Hype Audio
        </p>
      </div>

      {/* MINIMAL HIGH-IMPACT CTAS (MOVED UP FOR NO-SCROLL FIT) */}
      <div className="w-full max-w-xs space-y-2 pb-4">
        <button
          onClick={() => {
            soundEngine.playTick();
            onOpenAuth();
          }}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[13px] uppercase tracking-wider shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <span>GET STARTED</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundEngine.playTick();
            onOpenAuth();
          }}
          className="w-full py-2.5 rounded-full liquid-glass border border-white/20 text-white/80 font-bold text-[11px] hover:text-white hover:border-orange-500/60 transition-all flex items-center justify-center space-x-1.5"
        >
          <Lock className="w-3.5 h-3.5 text-orange-400" />
          <span>SIGN IN TO YOUR ACCOUNT</span>
        </button>
      </div>

    </div>
  );
};
