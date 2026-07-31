import React, { useState, useEffect, useRef } from 'react';
import { Check, Trophy, Clock, ChevronRight, ChevronLeft, ArrowRight, Sparkles, Home, Info, Lock } from 'lucide-react';
import { WorkoutRoutine, SetLog, CalisthenicsExercise } from '../types';
import { soundEngine } from '../services/soundEngine';

interface ActiveWorkoutProps {
  routine: WorkoutRoutine;
  onLogSet: (setLog: SetLog) => void;
  onFinishWorkout: () => void;
  onBackToSkills?: () => void;
  onOpenFormGuide?: (exercise: CalisthenicsExercise) => void;
}

export const ActiveWorkoutMode: React.FC<ActiveWorkoutProps> = ({
  routine,
  onLogSet,
  onFinishWorkout,
  onBackToSkills,
  onOpenFormGuide,
}) => {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [completedSetMap, setCompletedSetMap] = useState<Record<string, boolean>>({});
  const [restTimerSeconds, setRestTimerSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [lastLoggedSetNum, setLastLoggedSetNum] = useState<number | null>(null);

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const maxDrag = 271;

  const currentExercise = routine.exercises[currentExerciseIdx] || routine.exercises[0];

  // Rest Timer Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimerSeconds > 0) {
      interval = setInterval(() => {
        setRestTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            soundEngine.playRestCompleteBell();
            return 0;
          }
          soundEngine.playTick();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimerSeconds]);

  // Calculate total sets across all exercises in routine
  const totalWorkoutSets = routine.exercises.reduce((sum, ex) => sum + (ex.recommendedSets || 3), 0);
  const completedWorkoutSets = Object.keys(completedSetMap).filter((k) => completedSetMap[k]).length;
  const isWorkoutFullyCompleted = completedWorkoutSets >= totalWorkoutSets;

  const toggleSetComplete = (setIndex: number) => {
    const key = `${currentExercise.id}-set-${setIndex}`;
    const alreadyDone = completedSetMap[key];

    if (!alreadyDone) {
      soundEngine.playSetCompleteChime();
      setCompletedSetMap((prev) => ({ ...prev, [key]: true }));
      setLastLoggedSetNum(setIndex);

      onLogSet({
        setId: key,
        exerciseId: currentExercise.id,
        reps: typeof currentExercise.recommendedReps === 'number' ? currentExercise.recommendedReps : 8,
        weightKg: currentExercise.suggestedWeightKg || 0,
        completed: true,
        timestamp: new Date().toISOString(),
      });

      setRestTimerSeconds(60);
      setIsResting(true);
    } else {
      setCompletedSetMap((prev) => ({ ...prev, [key]: false }));
      setIsResting(false);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isWorkoutFullyCompleted) return;
    setIsDragging(true);
    startXRef.current = e.clientX - dragX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !isWorkoutFullyCompleted) return;
    const newX = e.clientX - startXRef.current;
    const clampedX = Math.max(0, Math.min(maxDrag, newX));
    currentXRef.current = clampedX;
    setDragX(clampedX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !isWorkoutFullyCompleted) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    if (currentXRef.current >= maxDrag * 0.85) {
      setDragX(maxDrag);
      soundEngine.playSetCompleteChime();
      setTimeout(() => {
        onFinishWorkout();
      }, 300);
    } else {
      setDragX(0);
    }
  };

  const totalSets = currentExercise.recommendedSets || 3;
  const ghost = currentExercise.ghostPerformance || { lastReps: 8, lastWeightKg: 0, lastDate: 'Previous Session' };

  const formatReps = (repsVal: string | number) => {
    const str = String(repsVal);
    if (str.toLowerCase().includes('rep') || str.toLowerCase().includes('hold') || str.toLowerCase().includes('s')) {
      return str;
    }
    return `${str} reps`;
  };

  return (
    <div className="flex flex-col h-full justify-between select-none overflow-hidden animate-fade-up space-y-2">
      {/* EXERCISE HEADER */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-2">
            {onBackToSkills && (
              <button
                onClick={onBackToSkills}
                className="liquid-glass px-2 py-0.5 rounded-full text-[10px] font-medium text-orange-400 flex items-center space-x-1 hover:text-white"
              >
                <Home className="w-3 h-3" />
                <span>Skills Home</span>
              </button>
            )}
            <span className="font-semibold text-orange-400 uppercase tracking-wider">
              Exercise {currentExerciseIdx + 1} of {routine.exercises.length}
            </span>
          </div>

          <span className="text-white/60 font-medium truncate max-w-[140px]">{routine.title}</span>
        </div>

        {/* ACTIVE EXERCISE CARD */}
        <div className="liquid-glass rounded-[24px] p-3.5 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[19px] font-bold text-white leading-snug">{currentExercise.name}</h2>
              <p className="text-[11px] text-white/60">Target: {currentExercise.targetMuscles.join(', ')}</p>
            </div>

            {/* FORM GUIDE BUTTON RIGHT IN WORKOUT CARD */}
            {onOpenFormGuide && (
              <button
                onClick={() => onOpenFormGuide(currentExercise)}
                className="liquid-glass-selected px-2.5 py-1 rounded-full text-[10px] font-semibold text-orange-400 border border-orange-500/30 flex items-center space-x-1 hover:text-white shrink-0"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Form Guide</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/5">
            <span className="text-white/70 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Ghost Target: {ghost.lastReps} reps × {ghost.lastWeightKg > 0 ? `${ghost.lastWeightKg}kg` : 'BW'}
            </span>
            <span className="text-orange-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Beat Ghost
            </span>
          </div>
        </div>
      </div>

      {/* SETS TABLE WITH EXPLICIT "LOG SET" AND "DONE" BUTTON STATES */}
      <div className="flex-1 flex flex-col justify-between space-y-2 my-1">
        {Array.from({ length: totalSets }).map((_, setIdx) => {
          const setNum = setIdx + 1;
          const key = `${currentExercise.id}-set-${setNum}`;
          const isDone = !!completedSetMap[key];

          return (
            <div
              key={setNum}
              className={`flex-1 p-3 rounded-[22px] transition-all flex items-center justify-between ${
                isDone ? 'liquid-glass-selected border border-orange-500/30' : 'liquid-glass'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-[11px] font-mono text-white/60 font-medium">Set #{setNum}</span>
                <div>
                  <span className="text-[13px] font-bold text-white block">
                    Target: {formatReps(currentExercise.recommendedReps)}
                  </span>
                  <span className="text-[10px] text-white/50">Tempo: 3-0-1 • Bodyweight</span>
                </div>
              </div>

              {/* CLEAR ACTION BUTTON: "MARK DONE" OR "✓ COMPLETED" */}
              <button
                onClick={() => toggleSetComplete(setNum)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center space-x-1.5 transition-all ${
                  isDone
                    ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md'
                    : 'liquid-glass-selected text-orange-400 border border-orange-500/30 hover:border-orange-500/60'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isDone ? 'Done (+25 XP)' : 'Mark Done'}</span>
              </button>
            </div>
          );
        })}

        {/* REST TIMER WIDGET WITH CLEAR ANNOUNCEMENT */}
        {isResting && (
          <div className="liquid-glass-selected rounded-[20px] p-3 flex items-center justify-between animate-fade-up border border-orange-500/40">
            <div className="flex items-center space-x-2.5">
              <Clock className="w-4 h-4 text-orange-400 animate-spin" />
              <div>
                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">
                  Set #{lastLoggedSetNum} Complete! Resting...
                </span>
                <span className="text-[14px] font-medium text-white">{restTimerSeconds}s recovery timer</span>
              </div>
            </div>
            <button
              onClick={() => setIsResting(false)}
              className="text-[11px] text-orange-400 underline font-semibold hover:text-white"
            >
              Skip Rest
            </button>
          </div>
        )}
      </div>

      {/* FOOTER & SLIDER TRACK */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <button
            disabled={currentExerciseIdx === 0}
            onClick={() => {
              setCurrentExerciseIdx((prev) => Math.max(0, prev - 1));
              setIsResting(false);
            }}
            className="px-4 py-1.5 text-[11px] font-medium rounded-full liquid-glass text-white/70 hover:text-white disabled:opacity-30 flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev Exercise</span>
          </button>

          {currentExerciseIdx < routine.exercises.length - 1 && (
            <button
              onClick={() => {
                setCurrentExerciseIdx((prev) => prev + 1);
                setIsResting(false);
              }}
              className="px-4 py-1.5 text-[11px] font-medium rounded-full liquid-glass text-orange-400 hover:text-white flex items-center gap-1"
            >
              <span>Next Exercise</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* SLIDE TO FINISH WORKOUT TRACK */}
        <div className="w-full relative">
          <div
            className={`w-full h-[52px] rounded-full relative flex items-center px-1 overflow-hidden transition-all ${
              isWorkoutFullyCompleted
                ? 'liquid-glass-selected border border-orange-500/40'
                : 'liquid-glass opacity-60'
            }`}
          >
            <span className="text-white/70 text-[12px] font-medium absolute left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1">
              {!isWorkoutFullyCompleted && <Lock className="w-3 h-3 text-amber-400" />}
              <span>
                {isWorkoutFullyCompleted
                  ? 'Slide to Finish Workout (+150 XP)'
                  : `Complete All Sets (${completedWorkoutSets}/${totalWorkoutSets})`}
              </span>
            </span>

            <div className="absolute right-4 flex items-center space-x-0.5 pointer-events-none">
              <ChevronRight className="w-[14px] h-[14px] text-white/40" />
              <ChevronRight className="w-[14px] h-[14px] text-white/50" />
              <ChevronRight className="w-[14px] h-[14px] text-white/60" />
            </div>

            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center shadow-md z-20 touch-none transition-transform duration-75 ${
                isWorkoutFullyCompleted ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-40'
              }`}
              style={{
                transform: `translateX(${dragX}px)`,
              }}
            >
              {isWorkoutFullyCompleted ? (
                <ArrowRight className="w-4 h-4 text-gray-800" />
              ) : (
                <Lock className="w-4 h-4 text-gray-800" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
