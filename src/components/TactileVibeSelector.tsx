import React, { useState, useRef } from 'react';
import { ArrowRight, ChevronRight, MessageSquare, Sparkles, Target, Award, CheckCircle } from 'lucide-react';
import { EquipmentMode, CalisthenicsExercise, UserProfile } from '../types';
import { TARGET_MUSCLE_GROUPS, CALISTHENICS_SKILL_TREE } from '../data/calisthenicsTree';
import { soundEngine } from '../services/soundEngine';

interface CalisthenicsHomeProps {
  user: UserProfile;
  equipmentMode: EquipmentMode;
  completedLevels: Record<string, number>;
  onToggleEquipment: () => void;
  onStartWorkout: (exercises: CalisthenicsExercise[], title: string) => void;
}

export const TactileVibeSelector: React.FC<CalisthenicsHomeProps> = ({
  completedLevels,
  onStartWorkout,
}) => {
  const [viewMode, setViewMode] = useState<'muscles' | 'skills'>('muscles');
  const [selectedId, setSelectedId] = useState<string>('chest-push');

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const maxDrag = 271;

  // Active Selected Item
  const currentMuscleGroup = TARGET_MUSCLE_GROUPS.find((m) => m.id === selectedId) || TARGET_MUSCLE_GROUPS[0];
  const currentSkill = CALISTHENICS_SKILL_TREE.find((s) => s.id === selectedId) || CALISTHENICS_SKILL_TREE[0];

  const activeTitle = viewMode === 'muscles' ? currentMuscleGroup.title : currentSkill.title;
  const currentLvl = completedLevels[selectedId] || 1;

  // Get active exercises for current level
  const activeExercises = viewMode === 'muscles'
    ? currentMuscleGroup.exercises
    : (currentSkill.phases[Math.min(currentLvl - 1, currentSkill.phases.length - 1)]?.exercises || currentSkill.phases[0].exercises);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX - dragX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - startXRef.current;
    const clampedX = Math.max(0, Math.min(maxDrag, newX));
    currentXRef.current = clampedX;
    setDragX(clampedX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    if (currentXRef.current >= maxDrag * 0.85) {
      setDragX(maxDrag);
      soundEngine.playSetCompleteChime();
      setTimeout(() => {
        onStartWorkout(activeExercises, `${activeTitle} (Phase ${currentLvl})`);
        setDragX(0);
      }, 300);
    } else {
      setDragX(0);
    }
  };

  const handleSelectItem = (id: string) => {
    soundEngine.playTick();
    setSelectedId(id);
  };

  return (
    <div className="flex flex-col h-full justify-between select-none overflow-hidden space-y-2">
      {/* 1. TOP HEADER WITH CLEAN MODE SWITCHER (EQUIPMENT BUTTON REMOVED FOR MAXIMUM SPACE) */}
      <div className="space-y-1.5 shrink-0">
        <div className="flex items-center justify-between">
          {/* VIEW MODE TOGGLE (TARGET MUSCLES VS SKILLS) */}
          <div className="liquid-glass p-0.5 rounded-full inline-flex items-center space-x-1 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <button
              onClick={() => {
                soundEngine.playTick();
                setViewMode('muscles');
                setSelectedId('chest-push');
              }}
              className={`px-3 py-1 rounded-full text-[10.5px] font-bold flex items-center space-x-1 transition-all ${
                viewMode === 'muscles' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Target Muscles</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playTick();
                setViewMode('skills');
                setSelectedId('muscle-up');
              }}
              className={`px-3 py-1 rounded-full text-[10.5px] font-bold flex items-center space-x-1 transition-all ${
                viewMode === 'skills' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Skills Tree</span>
            </button>
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <p className="text-white/70 text-[11.5px] font-medium mb-0 tracking-wide">
            {viewMode === 'muscles' ? 'Select a target body part to train' : 'Select a calisthenics skill to master'}
          </p>
          <h1 className="text-white text-[21px] sm:text-[23px] font-extrabold leading-tight tracking-tight">
            {viewMode === 'muscles' ? 'What are we blasting today?' : 'Which skill will you conquer?'}
          </h1>
        </div>
      </div>

      {/* 2. THE 4 CARDS GRID */}
      <div className="grid grid-cols-2 gap-2.5 flex-1 min-h-0 my-0.5">
        {viewMode === 'muscles'
          ? TARGET_MUSCLE_GROUPS.map((group, idx) => {
              const isSelected = selectedId === group.id;
              const lvl = completedLevels[group.id] || 1;
              const delays = ['0.2s', '0.28s', '0.36s', '0.44s'];

              return (
                <div
                  key={group.id}
                  onClick={() => handleSelectItem(group.id)}
                  className={`rounded-[24px] p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-200 animate-fade-up h-full ${
                    isSelected
                      ? 'liquid-glass-selected border-2 border-orange-500 shadow-lg shadow-orange-500/20 scale-[1.01]'
                      : 'liquid-glass hover:border-orange-500/20 opacity-80'
                  }`}
                  style={{ animationDelay: delays[idx] }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-[11px] font-bold font-mono">
                      {group.numberLabel}
                    </span>
                    {lvl > 1 ? (
                      <span className="text-[9.5px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" />
                        <span>Phase {lvl} Active</span>
                      </span>
                    ) : (
                      <span className="text-[9.5px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                        {group.exercises.length} Exercises
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-white text-[16px] sm:text-[17px] font-extrabold leading-snug tracking-tight">
                      {group.title}
                    </h3>
                    <p className="text-white/70 text-[11px] mt-1 font-medium leading-normal">{group.subtitle}</p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span className="text-white/50">{lvl > 1 ? `Phase ${lvl} Ready` : group.category}</span>
                    <span className={`font-bold flex items-center gap-0.5 ${isSelected ? 'text-orange-400' : 'text-white/40'}`}>
                      <span>{isSelected ? 'Selected' : 'Select'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          : CALISTHENICS_SKILL_TREE.map((skill, idx) => {
              const isSelected = selectedId === skill.id;
              const lvl = completedLevels[skill.id] || 1;
              const delays = ['0.2s', '0.28s', '0.36s', '0.44s'];

              return (
                <div
                  key={skill.id}
                  onClick={() => handleSelectItem(skill.id)}
                  className={`rounded-[24px] p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-200 animate-fade-up h-full ${
                    isSelected
                      ? 'liquid-glass-selected border-2 border-orange-500 shadow-lg shadow-orange-500/20 scale-[1.01]'
                      : 'liquid-glass hover:border-orange-500/20 opacity-80'
                  }`}
                  style={{ animationDelay: delays[idx] }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-[11px] font-bold font-mono">
                      {skill.numberLabel}
                    </span>
                    <span className="text-[9.5px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                      Phase {lvl} / {skill.phases.length}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-white text-[16px] sm:text-[17px] font-extrabold leading-snug tracking-tight">
                      {skill.title}
                    </h3>
                    <p className="text-white/70 text-[11px] mt-1 font-medium leading-normal">{skill.subtitle}</p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span className="text-white/50">Phase {lvl} Active</span>
                    <span className={`font-bold flex items-center gap-0.5 ${isSelected ? 'text-orange-400' : 'text-white/40'}`}>
                      <span>{isSelected ? 'Selected' : 'Select'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
      </div>

      {/* 3. CHAT ASSISTANT & SLIDE TO START TRACK */}
      <div className="space-y-2 shrink-0">
        <div
          className="w-full flex justify-center animate-fade-up"
          style={{ animationDelay: '0.5s' }}
        >
          <button
            type="button"
            onClick={() => soundEngine.playTick()}
            className="liquid-glass px-4 py-1 rounded-full inline-flex items-center space-x-1.5 text-[11px] font-semibold text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
            <span>AI Calisthenics Coach (LLM Ready)</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </button>
        </div>

        <div
          className="w-full relative animate-fade-up"
          style={{ animationDelay: '0.55s' }}
        >
          <div className="w-full h-[52px] rounded-full liquid-glass-selected border border-orange-500/40 relative flex items-center px-1 overflow-hidden shadow-md">
            <span className="text-white text-[13px] font-extrabold absolute left-1/2 -translate-x-1/2 pointer-events-none truncate max-w-[240px]">
              Slide to Start {activeTitle} (Phase {currentLvl})
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
              className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing z-20 touch-none transition-transform duration-75"
              style={{
                transform: `translateX(${dragX}px)`,
              }}
            >
              <ArrowRight className="w-4 h-4 text-gray-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
