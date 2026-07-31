import React, { useState, useEffect, useRef } from 'react';
import { Footprints, Flame, MapPin, Clock, Award, X, Plus, Play, Pause, RotateCcw, Smartphone, Activity } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface StepCounterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSteps: number;
  stepGoal: number;
  onUpdateSteps: (newSteps: number | ((prev: number) => number)) => void;
}

export const StepCounterModal: React.FC<StepCounterModalProps> = ({
  isOpen,
  onClose,
  currentSteps,
  stepGoal,
  onUpdateSteps,
}) => {
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  
  // Cadence & Rhythmic Step Filter State Refs
  const lastStepTimeRef = useRef<number>(0);
  const consecutiveRhythmicStepsRef = useRef<number>(0);
  const lastAccelMagnitudeRef = useRef<number>(9.8);

  // Calculate stats based on steps
  const distanceKm = (currentSteps * 0.00075).toFixed(2); // Avg step ~ 0.75m
  const caloriesBurned = Math.round(currentSteps * 0.04); // Avg ~ 0.04 kcal per step
  const activeMins = Math.round(currentSteps / 100); // Avg ~ 100 steps/min
  const progressPercent = Math.min(100, Math.round((currentSteps / stepGoal) * 100));

  // SMART RHYTHMIC CADENCE PEDOMETER FILTER (REJECTS RANDOM PHONE SHAKES)
  useEffect(() => {
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      if (!isLiveTracking) return;

      const acc = event.acceleration || event.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      // 1. Calculate magnitude of acceleration
      const mag = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      const now = Date.now();
      const timeDelta = now - lastStepTimeRef.current;

      // 2. Low-Pass Filter: Calculate peak acceleration change delta
      const magDelta = Math.abs(mag - lastAccelMagnitudeRef.current);
      lastAccelMagnitudeRef.current = mag;

      // 3. Human Walking Stride Cadence Rules:
      // - Walking step impact threshold: mag > 11.5 m/s² and delta > 2.8 m/s²
      // - Human walking stride pace is between 380ms (fast sprint) and 850ms (slow walk) per step.
      // - Random rapid hand shakes are < 350ms -> REJECTED!
      if (mag > 11.5 && magDelta > 2.8) {
        if (timeDelta >= 380 && timeDelta <= 850) {
          // Rhythmic stride confirmed!
          consecutiveRhythmicStepsRef.current += 1;
          lastStepTimeRef.current = now;

          // Require at least 2 consecutive rhythmic strides before counting to eliminate single accidental jerks
          if (consecutiveRhythmicStepsRef.current >= 2) {
            onUpdateSteps((prev) => prev + 1);
          }
        } else if (timeDelta > 850) {
          // Reset cadence lock if pause between steps is too long
          consecutiveRhythmicStepsRef.current = 1;
          lastStepTimeRef.current = now;
        } else {
          // Time delta < 380ms: Rapid random shaking detected -> REJECT SHAKE!
          consecutiveRhythmicStepsRef.current = 0;
        }
      }
    };

    if (isLiveTracking) {
      if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
          (DeviceMotionEvent as any).requestPermission()
            .then((permissionState: string) => {
              if (permissionState === 'granted') {
                window.addEventListener('devicemotion', handleDeviceMotion);
              }
            })
            .catch(() => {});
        } else {
          window.addEventListener('devicemotion', handleDeviceMotion);
        }
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('devicemotion', handleDeviceMotion);
      }
    };
  }, [isLiveTracking, onUpdateSteps]);

  if (!isOpen) return null;

  const handleAddSteps = (amount: number) => {
    soundEngine.playTick();
    onUpdateSteps(currentSteps + amount);
  };

  const handleResetSteps = () => {
    soundEngine.playTick();
    onUpdateSteps(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fade-up">
      <div className="w-full max-w-sm bg-[#0f1420]/95 border border-white/10 rounded-[32px] p-5 space-y-4 shadow-2xl relative text-white">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Footprints className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold leading-tight">Pedometer Step Counter</h2>
              <p className="text-[10px] text-orange-400 font-semibold flex items-center gap-1">
                <Activity className="w-3 h-3 text-orange-400" /> Smart Walking Cadence Filter Active
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

        {/* STEP PROGRESS CIRCLE / BAR */}
        <div className="liquid-glass rounded-[24px] p-4 text-center space-y-3 relative overflow-hidden border border-orange-500/30">
          <div className="relative inline-flex items-center justify-center">
            {/* SVG CIRCULAR PROGRESS */}
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="54"
                stroke="currentColor"
                strokeWidth="10"
                className="text-white/10"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="54"
                stroke="currentColor"
                strokeWidth="10"
                className="text-orange-500 transition-all duration-500"
                strokeDasharray="339.29"
                strokeDashoffset={339.29 - (339.29 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="text-[24px] font-extrabold text-white leading-none">
                {currentSteps.toLocaleString()}
              </span>
              <span className="text-[10px] text-white/60 font-medium mt-1">
                / {stepGoal.toLocaleString()} steps
              </span>
            </div>
          </div>

          {/* PROGRESS PERCENT BADGE */}
          <div className="flex items-center justify-center space-x-2 text-[11px]">
            <span className="text-orange-400 font-bold bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
              {progressPercent}% Goal Reached
            </span>
            {progressPercent >= 100 && (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Goal Unlocked!
              </span>
            )}
          </div>
        </div>

        {/* STATS TRIPLETS (DISTANCE, CALORIES, DURATION) */}
        <div className="grid grid-cols-3 gap-2">
          <div className="liquid-glass rounded-[18px] p-2.5 text-center">
            <MapPin className="w-4 h-4 text-orange-400 mx-auto mb-1" />
            <span className="text-[13px] font-bold text-white block">{distanceKm}</span>
            <span className="text-[9px] text-white/50 block">Distance (km)</span>
          </div>

          <div className="liquid-glass rounded-[18px] p-2.5 text-center">
            <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-[13px] font-bold text-white block">{caloriesBurned}</span>
            <span className="text-[9px] text-white/50 block">Burned (kcal)</span>
          </div>

          <div className="liquid-glass rounded-[18px] p-2.5 text-center">
            <Clock className="w-4 h-4 text-orange-400 mx-auto mb-1" />
            <span className="text-[13px] font-bold text-white block">{activeMins}m</span>
            <span className="text-[9px] text-white/50 block">Active Walk</span>
          </div>
        </div>

        {/* CONTROLS & STEP SIMULATOR & RESET BUTTON */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center space-x-2">
            {/* LIVE TRACKING TOGGLE */}
            <button
              onClick={() => {
                soundEngine.playTick();
                setIsLiveTracking((prev) => !prev);
              }}
              className={`flex-1 py-2.5 rounded-full text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-all ${
                isLiveTracking
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md animate-pulse'
                  : 'liquid-glass text-orange-400 border border-orange-500/30'
              }`}
            >
              {isLiveTracking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isLiveTracking ? 'Motion Sensor Active' : 'Start Motion Sensor'}</span>
            </button>

            {/* MANUAL +500 STEPS */}
            <button
              onClick={() => handleAddSteps(500)}
              className="liquid-glass px-3 py-2.5 rounded-full text-[11px] font-bold text-white hover:text-orange-400 flex items-center gap-1 shrink-0"
              title="Add 500 Steps"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+500</span>
            </button>

            {/* RESET STEPS BUTTON WITH RESET ICON */}
            <button
              onClick={handleResetSteps}
              className="px-3 py-2.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-all active:scale-95"
              title="Reset Steps to 0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
