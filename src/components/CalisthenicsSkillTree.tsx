import React, { useState } from 'react';
import { Award, Lock, CheckCircle2, Info, ChevronRight, Home, Dumbbell, Sparkles, Trophy } from 'lucide-react';
import { CalisthenicsMasterSkill, CalisthenicsExercise, EquipmentMode } from '../types';
import { CALISTHENICS_SKILL_TREE } from '../data/calisthenicsTree';
import { soundEngine } from '../services/soundEngine';

interface SkillTreeProps {
  equipmentMode: EquipmentMode;
  onToggleEquipment: () => void;
  onOpenFormGuide: (exercise: CalisthenicsExercise) => void;
  onStartPhaseWorkout: (exercises: CalisthenicsExercise[]) => void;
  onClaimMasteryXP: (xp: number) => void;
}

export const CalisthenicsSkillTree: React.FC<SkillTreeProps> = ({
  equipmentMode,
  onToggleEquipment,
  onOpenFormGuide,
  onStartPhaseWorkout,
  onClaimMasteryXP,
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string>('muscle-up');
  const [activeSkillTree, setActiveSkillTree] = useState<CalisthenicsMasterSkill[]>(CALISTHENICS_SKILL_TREE);

  const currentSkill = activeSkillTree.find((s) => s.id === selectedSkillId) || activeSkillTree[0];

  const handleSelectSkill = (skillId: string) => {
    soundEngine.playTick();
    setSelectedSkillId(skillId);
  };

  return (
    <div className="flex flex-col h-full justify-between select-none overflow-hidden space-y-2 animate-fade-up">
      {/* 1. TOP BAR & EQUIPMENT MODE TOGGLE */}
      <div className="space-y-1.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="liquid-glass rounded-full px-3 py-1 inline-flex items-center space-x-1.5">
            <Trophy className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] text-white/90 font-semibold tracking-tight">
              Pure Calisthenics Tree
            </span>
          </div>

          {/* HOME VS GYM EQUIPMENT TOGGLE */}
          <button
            onClick={() => {
              soundEngine.playTick();
              onToggleEquipment();
            }}
            className="liquid-glass-selected px-3 py-1 rounded-full text-[10px] font-medium text-white flex items-center space-x-1.5 border border-orange-500/30 hover:border-orange-500/50 transition-colors"
          >
            {equipmentMode === 'Home' ? (
              <>
                <Home className="w-3 h-3 text-orange-400" />
                <span>Home (Pull-Up Rod)</span>
              </>
            ) : (
              <>
                <Dumbbell className="w-3 h-3 text-amber-400" />
                <span>Gym / Park Equipment</span>
              </>
            )}
          </button>
        </div>

        {/* MASTER SKILL TABS SELECTOR */}
        <div className="grid grid-cols-4 gap-1.5">
          {activeSkillTree.map((skill) => {
            const isSelected = selectedSkillId === skill.id;
            return (
              <button
                key={skill.id}
                onClick={() => handleSelectSkill(skill.id)}
                className={`py-1.5 px-1 rounded-[16px] text-center transition-all flex flex-col items-center justify-center ${
                  isSelected ? 'liquid-glass-selected border border-orange-500/40 text-orange-400' : 'liquid-glass text-white/60'
                }`}
              >
                <span className="text-[10px] font-mono font-bold block">{skill.numberLabel}</span>
                <span className="text-[11px] font-medium truncate max-w-full block leading-tight">{skill.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SELECTED SKILL BANNER & PHASES GRID (FLEX-1 FILLS SCREEN) */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar space-y-2 min-h-0 my-0.5">
        {/* SKILL HEADER BANNER */}
        <div className="liquid-glass rounded-[22px] p-3 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-white leading-tight flex items-center gap-1.5">
              {currentSkill.title}
              {currentSkill.mastered && <Award className="w-4 h-4 text-amber-400" />}
            </h2>
            <p className="text-[11px] text-white/60">{currentSkill.subtitle}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20 block">
              +{currentSkill.expReward} EXP
            </span>
          </div>
        </div>

        {/* 4 PROGRESSION PHASES */}
        <div className="space-y-2 flex-1 min-h-0 overflow-y-auto no-scrollbar">
          {currentSkill.phases.map((phase) => {
            return (
              <div
                key={phase.phaseNumber}
                className={`liquid-glass rounded-[22px] p-3 space-y-2 transition-all ${
                  phase.unlocked ? 'border-l-2 border-orange-400' : 'opacity-60'
                }`}
              >
                {/* Phase Title Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded-md">
                      PHASE {phase.phaseNumber}
                    </span>
                    <h3 className="text-[13px] font-semibold text-white">{phase.title}</h3>
                  </div>

                  {!phase.unlocked ? (
                    <Lock className="w-3.5 h-3.5 text-white/40" />
                  ) : phase.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <button
                      onClick={() => onStartPhaseWorkout(phase.exercises)}
                      className="liquid-glass-selected px-2.5 py-1 rounded-full text-[10px] font-medium text-orange-400 flex items-center space-x-1 hover:text-white"
                    >
                      <span>Start Phase</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Phase Exercises List */}
                <div className="space-y-1.5">
                  {phase.exercises.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-2 rounded-[16px] liquid-glass flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{ex.name}</span>
                        <span className="text-[9px] text-white/50">{ex.recommendedSets} × {ex.recommendedReps}</span>
                      </div>

                      {/* IN-APP FORM GUIDE BUTTON */}
                      <button
                        onClick={() => onOpenFormGuide(ex)}
                        className="px-2 py-0.5 rounded-full liquid-glass text-orange-400 hover:text-white flex items-center space-x-1 text-[10px] font-medium"
                      >
                        <Info className="w-3 h-3" />
                        <span>Form Guide</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
