import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Pedometer Motion Algorithm Engine under test
 * Pure function simulating the 380ms-850ms cadence filter & acceleration magnitude checks.
 */
export interface MotionSample {
  acceleration: { x: number; y: number; z: number };
  timestamp: number;
}

export class PedometerSensorEngine {
  private lastStepTime = 0;
  private lastMagnitude = 9.8;
  private consecutiveSteps = 0;
  public totalSteps = 0;

  constructor(private onStepCallback?: (steps: number) => void) {}

  public processMotionEvent(event: MotionSample): boolean {
    const { x, y, z } = event.acceleration;
    const mag = Math.sqrt(x * x + y * y + z * z);
    const now = event.timestamp;
    const timeDelta = now - this.lastStepTime;

    const delta = Math.abs(mag - this.lastMagnitude);
    this.lastMagnitude = mag;

    // Acceleration Threshold: Step impact requires mag >= 11.5 m/s² and delta >= 2.8 m/s²
    if (mag >= 11.5 && delta >= 2.8) {
      // Cadence Window Check: 380ms - 850ms per stride
      if (timeDelta >= 380 && timeDelta <= 850) {
        this.consecutiveSteps += 1;
        this.lastStepTime = now;

        // Require at least 2 consecutive rhythmic steps to eliminate single jerks
        if (this.consecutiveSteps >= 2) {
          this.totalSteps += 1;
          if (this.onStepCallback) {
            this.onStepCallback(this.totalSteps);
          }
          return true;
        }
      } else if (timeDelta > 850) {
        // Pause (> 850ms) -> Set cadence lock to 1
        this.consecutiveSteps = 1;
        this.lastStepTime = now;
      } else {
        // Rapid hand shake (< 380ms) -> REJECT SHAKE! Reset lock to 0
        this.consecutiveSteps = 0;
      }
    }

    return false;
  }

  public reset(): void {
    this.lastStepTime = 0;
    this.lastMagnitude = 9.8;
    this.consecutiveSteps = 0;
    this.totalSteps = 0;
  }
}

describe('Hardware Motion Pedometer Sensor Suite (pedometer.test.ts)', () => {
  let engine: PedometerSensorEngine;
  let mockStepCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockStepCallback = vi.fn();
    engine = new PedometerSensorEngine(mockStepCallback);

    // Mock global window DeviceMotionEvent
    if (typeof window !== 'undefined') {
      vi.stubGlobal('DeviceMotionEvent', class MockDeviceMotionEvent {
        accelerationIncludingGravity = { x: 0, y: 0, z: 9.8 };
      });
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should successfully increment steps when movement is within 380ms - 850ms cadence window', () => {
    const baseTime = 10000;

    // Stride 1 impact at baseTime (mag ~13.85 m/s², delta = 4.05)
    engine.processMotionEvent({
      acceleration: { x: 8, y: 8, z: 8 },
      timestamp: baseTime,
    });

    // Stride 2 impact at baseTime + 450ms (mag ~17.32 m/s², delta = 3.47 >= 2.8)
    const stepRecorded = engine.processMotionEvent({
      acceleration: { x: 10, y: 10, z: 10 },
      timestamp: baseTime + 450,
    });

    expect(stepRecorded).toBe(true);
    expect(engine.totalSteps).toBe(1);
    expect(mockStepCallback).toHaveBeenCalledWith(1);
  });

  it('should REJECT rapid hand-shakes with time interval < 300ms and not increment steps', () => {
    const baseTime = 10000;

    // Stride 1
    engine.processMotionEvent({
      acceleration: { x: 8, y: 8, z: 8 },
      timestamp: baseTime,
    });

    // Rapid shake at 150ms interval (< 300ms)
    const shakeRecorded = engine.processMotionEvent({
      acceleration: { x: 12, y: 12, z: 12 },
      timestamp: baseTime + 150,
    });

    expect(shakeRecorded).toBe(false);
    expect(engine.totalSteps).toBe(0);
    expect(mockStepCallback).not.toHaveBeenCalled();
  });

  it('should RESET cadence lock and filter out steps after a long pause (> 1000ms)', () => {
    const baseTime = 10000;

    // Stride 1
    engine.processMotionEvent({
      acceleration: { x: 8, y: 8, z: 8 },
      timestamp: baseTime,
    });

    // Long pause of 1500ms (> 1000ms)
    const pauseStep = engine.processMotionEvent({
      acceleration: { x: 12, y: 12, z: 12 },
      timestamp: baseTime + 1500,
    });

    // Long pause resets cadence lock to 1, so step is not incremented on pause
    expect(pauseStep).toBe(false);
    expect(engine.totalSteps).toBe(0);
  });
});
