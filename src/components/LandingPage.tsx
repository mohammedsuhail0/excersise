import React from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface LandingPageProps {
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 text-center select-none overflow-hidden text-white relative">
      
      {/* APP TITLE MOVED UP TO TOP */}
      <div className="pt-6 space-y-2 max-w-xs">
        <h1 className="text-4xl font-black tracking-tight text-white leading-none">
          AURAFIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500">AI</span>
        </h1>
        <p className="text-[12px] text-white/70 font-semibold tracking-wide">
          AI Calisthenics • Bodyweight Progression • Hype Audio
        </p>
      </div>

      {/* ACTION BUTTONS MOVED ALMOST TO CENTER */}
      <div className="w-full max-w-xs space-y-3 my-auto">
        <button
          onClick={() => {
            soundEngine.playTick();
            onOpenAuth();
          }}
          className="w-full py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[14px] uppercase tracking-wider shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <span>GET STARTED</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundEngine.playTick();
            onOpenAuth();
          }}
          className="w-full py-3 rounded-full liquid-glass border border-white/20 text-white/80 font-bold text-[11px] hover:text-white hover:border-orange-500/60 transition-all flex items-center justify-center space-x-1.5"
        >
          <Lock className="w-3.5 h-3.5 text-orange-400" />
          <span>SIGN IN TO YOUR ACCOUNT</span>
        </button>
      </div>

      {/* BOTTOM PADDING SPACER */}
      <div className="pb-4 text-[10px] text-white/40 font-mono tracking-widest uppercase">
        Next-Gen Fitness Engine
      </div>

    </div>
  );
};
