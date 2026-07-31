import { describe, it, expect } from 'vitest';
import { UserProfile } from '../types';

/**
 * Calculates XP and Level Progression
 */
export function calculateXpGain(
  user: UserProfile,
  xpEarned: number
): { level: number; xp: number; maxXp: number; levelUpOccurred: boolean } {
  const newXpTotal = user.xp + xpEarned;
  let currentLevel = user.level;
  let currentMaxXp = user.maxXp;
  let remainingXp = newXpTotal;
  let levelUpOccurred = false;

  while (remainingXp >= currentMaxXp) {
    levelUpOccurred = true;
    currentLevel += 1;
    remainingXp -= currentMaxXp;
    currentMaxXp += 100;
  }

  return {
    level: currentLevel,
    xp: remainingXp,
    maxXp: currentMaxXp,
    levelUpOccurred,
  };
}

describe('XP Progression Level-Up Math Unit Tests', () => {
  it('should add XP without leveling up if total is under maxXp', () => {
    const initialUser: UserProfile = {
      name: 'Test Athlete',
      heightCm: 175,
      weightKg: 70,
      targetPhysique: 'Anime Aesthetic',
      level: 1,
      xp: 50,
      maxXp: 200,
      streakDays: 1,
      streakShields: 0,
    };

    const result = calculateXpGain(initialUser, 25);
    expect(result.level).toBe(1);
    expect(result.xp).toBe(75);
    expect(result.maxXp).toBe(200);
    expect(result.levelUpOccurred).toBe(false);
  });

  it('should level up user and carry over remaining XP when total exceeds maxXp', () => {
    const initialUser: UserProfile = {
      name: 'Test Athlete',
      heightCm: 175,
      weightKg: 70,
      targetPhysique: 'Anime Aesthetic',
      level: 1,
      xp: 180,
      maxXp: 200,
      streakDays: 1,
      streakShields: 0,
    };

    // 180 + 150 = 330 XP. Requires 200 to level up -> Level 2, 130 XP left, next maxXp = 300
    const result = calculateXpGain(initialUser, 150);
    expect(result.level).toBe(2);
    expect(result.xp).toBe(130);
    expect(result.maxXp).toBe(300);
    expect(result.levelUpOccurred).toBe(true);
  });
});
