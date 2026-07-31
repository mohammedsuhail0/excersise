import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { soundEngine } from '../services/soundEngine';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userData: { name: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playTick();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (!isSupabaseConfigured || !supabase) {
        // Local auth fallback for environment without Supabase keys configured
        if (!email.trim() || !password.trim()) {
          throw new Error('Please enter a valid email and password.');
        }
        onAuthSuccess({
          name: name.trim() || email.split('@')[0] || 'Athlete',
          email: email.trim(),
        });
        onClose();
        return;
      }

      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              full_name: name.trim() || 'Athlete',
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          setSuccessMessage('Account created successfully! Logging you in...');
          setTimeout(() => {
            onAuthSuccess({
              name: name.trim() || email.split('@')[0] || 'Athlete',
              email: email.trim(),
            });
            onClose();
          }, 1000);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;

        if (data.user) {
          const userMetaName = data.user.user_metadata?.full_name || email.split('@')[0] || 'Athlete';
          onAuthSuccess({
            name: userMetaName,
            email: email.trim(),
          });
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fade-up">
      <div className="w-full max-w-sm bg-[#0f1420]/95 border border-white/15 rounded-[32px] p-5 space-y-4 shadow-2xl relative text-white">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold leading-tight">AuraFit Account</h2>
              <p className="text-[10px] text-orange-400 font-semibold uppercase tracking-wider">
                {authMode === 'signup' ? 'Create New Account' : 'Welcome Back Athlete'}
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

        {/* AUTH MODE TOGGLE PILLS */}
        <div className="flex items-center justify-between p-1 liquid-glass rounded-full border border-white/10">
          <button
            onClick={() => {
              soundEngine.playTick();
              setAuthMode('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 rounded-full text-[11px] font-extrabold transition-all ${
              authMode === 'signup'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              soundEngine.playTick();
              setAuthMode('signin');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 rounded-full text-[11px] font-extrabold transition-all ${
              authMode === 'signin'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* MESSAGES */}
        {errorMessage && (
          <div className="p-2.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-[11px] font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {authMode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/70 uppercase">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-9 pr-3 text-[12px] text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/70 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="athlete@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-9 pr-3 text-[12px] text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/70 uppercase">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-9 pr-3 text-[12px] text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[12px] font-extrabold uppercase shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <span>{loading ? 'Processing...' : authMode === 'signup' ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
