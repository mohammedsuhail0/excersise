import { describe, it, expect } from 'vitest';

export interface UserProgressionState {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  streakDays: number;
}

export interface LevelUpResult {
  newLevel: number;
  currentXp: number;
  maxXp: number;
  didLevelUp: boolean;
  unlockedPhaseTitle: string | null;
}

/**
 * Progression Tree Engine logic for processing set logs and workout completions.
 */
export class ProgressionTreeEngine {
  public static processXpGain(
    currentState: UserProgressionState,
    xpAmount: number,
    muscleGroupKey = 'chest-push'
  ): LevelUpResult {
    const totalXp = currentState.xp + xpAmount;
    let level = currentState.level;
    let maxXp = currentState.maxXp;
    let remainingXp = totalXp;
    let didLevelUp = false;

    while (remainingXp >= maxXp) {
      didLevelUp = true;
      level += 1;
      remainingXp -= maxXp;
      maxXp += 100; // Formula: Next level requires 100 more XP
    }

    const unlockedPhaseTitle = didLevelUp
      ? `Phase ${level}: Advanced ${muscleGroupKey.toUpperCase()} Tier Unlocked!`
      : null;

    return {
      newLevel: level,
      currentXp: remainingXp,
      maxXp,
      didLevelUp,
      unlockedPhaseTitle,
    };
  }
}

describe('Calisthenics Progression Tree Engine Suite (progression.test.ts)', () => {
  it('should process standard set log (+25 XP) without leveling up when total XP is below threshold', () => {
    const initialUser: UserProgressionState = {
      name: 'Athlete',
      level: 1,
      xp: 50,
      maxXp: 200,
      streakDays: 1,
    };

    const result = ProgressionTreeEngine.processXpGain(initialUser, 25, 'chest-push');

    expect(result.didLevelUp).toBe(false);
    expect(result.newLevel).toBe(1);
    expect(result.currentXp).toBe(75);
    expect(result.maxXp).toBe(200);
    expect(result.unlockedPhaseTitle).toBeNull();
  });

  it('should trigger Level-Up state, carry over excess XP, and return unlocked Phase data when threshold is crossed', () => {
    const initialUser: UserProgressionState = {
      name: 'Athlete',
      level: 1,
      xp: 180,
      maxXp: 200,
      streakDays: 2,
    };

    // Completing workout session (+150 XP): 180 + 150 = 330 XP Total
    // 330 >= 200 -> Level 2, Remaining XP = 130, Next maxXp = 300
    const result = ProgressionTreeEngine.processXpGain(initialUser, 150, 'chest-push');

    expect(result.didLevelUp).toBe(true);
    expect(result.newLevel).toBe(2);
    expect(result.currentXp).toBe(130);
    expect(result.maxXp).toBe(300);
    expect(result.unlockedPhaseTitle).toContain('Phase 2: Advanced CHEST-PUSH Tier Unlocked!');
  });

  it('should handle multi-level jumps correctly when massive XP is awarded', () => {
    const initialUser: UserProgressionState = {
      name: 'Athlete',
      level: 1,
      xp: 0,
      maxXp: 200,
      streakDays: 5,
    };

    // Award 600 XP (Requires 200 for Lvl 2, then 300 for Lvl 3 = 500 XP total for Lvl 3)
    // 600 - 500 = 100 XP remaining at Lvl 3 (Next maxXp = 400)
    const result = ProgressionTreeEngine.processXpGain(initialUser, 600, 'muscle-up');

    expect(result.didLevelUp).toBe(true);
    expect(result.newLevel).toBe(3);
    expect(result.currentXp).toBe(100);
    expect(result.maxXp).toBe(400);
    expect(result.unlockedPhaseTitle).toContain('Phase 3: Advanced MUSCLE-UP Tier Unlocked!');
  });
});
