import { Prettify } from "../utility/type_helpers";
import { MessageQue } from "./message_que";
import World from "./world";

export type EngineState = Prettify<
  | "initializing"
  | "running"
  | "stopped"
  | "error"
  | "paused"
  | "restarting"
  | "exiting"
  | "idle"
  | "ready"
  | (string & { __engineState: true })
>;

export class EngineCore {
  private _state: EngineState = "idle";
  private _loopInterval = 200;
  private _loopTimeout: number = 30000;
  private _tickId: NodeJS.Timeout | null = null;
  private _nextTickTime: number = 0;
  private _world = new World();
  private _messageQue = new MessageQue();
  get state(): EngineState {
    return this._state;
  }
  init() {
    this._state = "initializing";
  }
  pause() {
    if (this._state === "running") {
      this._state = "paused";
      if (this._tickId) {
        clearTimeout(this._tickId);
        this._tickId = null;
      }
    }
  }
  resume() {
    if (this._state === "paused") {
      this._state = "running";
    }
  }
  start() {
    if (this._state === "initializing" || this._state === "paused") {
      this._state = "running";
      if (!this._tickId) {
        this._nextTickTime = performance.now();
        this.loop();
      }
    }
  }
  stop() {
    if (this._state === "running" || this._state === "paused") {
      this._state = "stopped";
      if (this._tickId) {
        clearTimeout(this._tickId);
        this._tickId = null;
      }
    }
  }
  restart() {
    if (this._state === "running" || this._state === "paused") {
      this._state = "restarting";
    }
  }
  exit() {
    if (this._state === "running" || this._state === "paused") {
      this._state = "exiting";
    }
  }
  error() {
    this._state = "error";
  }
  idle() {
    if (this._state === "running" || this._state === "paused") {
      this._state = "idle";
    }
  }
  ready() {
    if (this._state === "idle") {
      this._state = "ready";
    }
  }
  private async loop() {
    if (this._state !== "running") return;

    const now = performance.now();

    // Skip if we somehow started before we were scheduled
    if (now < this._nextTickTime) {
      const wait = this._nextTickTime - now;
      this._tickId = setTimeout(() => this.loop(), wait);
      return;
    }

    // ==== Your future system logic goes here ====
    try {
      //
    } catch (error) {
      console.error("Error in engine loop:", error);
      this.error();
      return;
    }
    // await this.runSystems(); <-- to be implemented

    // Schedule next tick
    const interval = this._loopInterval;
    const nextTime = this._nextTickTime + interval;
    const delay = Math.max(0, nextTime - performance.now());

    this._nextTickTime = nextTime;
    this._tickId = setTimeout(() => this.loop(), delay);
  }
  get messageQue() {
    return this._messageQue;
  }
  get world() {
    return this._world;
  }
}
