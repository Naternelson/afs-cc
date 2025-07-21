import { DataEngine } from "./DataEngine";

export class TickLoop {
  private engine: DataEngine;
  private running = false;
  private lastTime = 0;
  private accumulator = 0;
  private fixedDt: number;
  private timer: any = null;
  private intervalMs: number;
  private interpolation = 0;

  constructor(engine: DataEngine, updatesPerSecond = 60) {
    this.engine = engine;
    this.fixedDt = 1 / updatesPerSecond; // e.g. 60Hz = 16.67ms
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.tick(); // kick off immediately
  }

  stop(): void {
    this.running = false;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  private tick = (): void => {
    if (!this.running) return;

    const now = performance.now();
    let delta = (now - this.lastTime) / 1000; // seconds
    this.lastTime = now;

    // Clamp huge delta (e.g. after long pause)
    if (delta > 0.5) delta = this.fixedDt;

    this.accumulator += delta;

    while (this.accumulator >= this.fixedDt) {
      this.engine.update(this.fixedDt);
      this.accumulator -= this.fixedDt;
    }
    this.interpolation = this.accumulator / this.fixedDt;
    this.timer = setTimeout(this.tick, this.intervalMs);
  };

  // Optionally: render or pass interpolation (accumulator / fixedDt) here

  step(): void {
    this.engine.update(this.fixedDt);
  }

  setRate(updatesPerSecond: number): void {
    this.fixedDt = 1 / updatesPerSecond;
    this.intervalMs = 1000 / updatesPerSecond;
  }
  getInterpolationFactor(): number {
    return this.interpolation;
  }
}
