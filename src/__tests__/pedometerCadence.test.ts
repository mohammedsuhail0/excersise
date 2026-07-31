import { describe, it, expect } from 'vitest';

/**
 * Pedometer Cadence Filter Logic Evaluator
 */
export function processPedometerStep(
  magnitude: number,
  delta: number,
  timeDeltaMs: number,
  consecutiveSteps: number
): { isStepCounted: boolean; newConsecutiveSteps: number } {
  // 1. Threshold Check: Must be a physical step impact
  if (magnitude >= 11.5 && delta >= 2.8) {
    // 2. Human Walking Cadence Pace Window (380ms - 850ms per stride)
    if (timeDeltaMs >= 380 && timeDeltaMs <= 850) {
      const nextConsecutive = consecutiveSteps + 1;
      // Require 2 consecutive rhythmic strides to eliminate single accidental jerks
      if (nextConsecutive >= 2) {
        return { isStepCounted: true, newConsecutiveSteps: nextConsecutive };
      }
      return { isStepCounted: false, newConsecutiveSteps: nextConsecutive };
    } else if (timeDeltaMs > 850) {
      // Pause too long -> Reset cadence lock to 1
      return { isStepCounted: false, newConsecutiveSteps: 1 };
    } else {
      // Rapid random hand shake (< 380ms) -> REJECT SHAKE!
      return { isStepCounted: false, newConsecutiveSteps: 0 };
    }
  }

  return { isStepCounted: false, newConsecutiveSteps: consecutiveSteps };
}

describe('Pedometer Cadence Filter Unit Tests', () => {
  it('should accept valid human walking stride pace (450ms interval) after 2 consecutive steps', () => {
    // Step 1: Initial stride
    const step1 = processPedometerStep(12.5, 3.2, 500, 0);
    expect(step1.isStepCounted).toBe(false);
    expect(step1.newConsecutiveSteps).toBe(1);

    // Step 2: Second stride in cadence window (450ms)
    const step2 = processPedometerStep(12.5, 3.2, 450, step1.newConsecutiveSteps);
    expect(step2.isStepCounted).toBe(true);
    expect(step2.newConsecutiveSteps).toBe(2);
  });

  it('should REJECT rapid hand shakes with intervals < 380ms (e.g. 200ms shake)', () => {
    // Rapid hand shake pulse at 200ms
    const result = processPedometerStep(14.0, 4.5, 200, 1);
    expect(result.isStepCounted).toBe(false);
    expect(result.newConsecutiveSteps).toBe(0);
  });

  it('should RESET cadence lock if pause between steps is too long (> 850ms)', () => {
    // Long pause of 1200ms
    const result = processPedometerStep(12.0, 3.0, 1200, 3);
    expect(result.isStepCounted).toBe(false);
    expect(result.newConsecutiveSteps).toBe(1);
  });
});
