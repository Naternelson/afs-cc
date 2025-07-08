import { Prettify } from "../utility/type_helpers";
import { MessageQue } from "./message_que";
import { EngineSystem } from "./system";
import { updateRenderer } from "./systems/updateRenderer";
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
  private _id: number = 1;
  get id(): number {
    return this._id;
  }
  private _state: EngineState = "idle";
  private _loopInterval = 200;
  private _loopTimeout: number = 30000;
  private _tickId: NodeJS.Timeout | null = null;
  private _nextTickTime: number = 0;
  private _world = new World();
  private _systems: Array<EngineSystem> = [updateRenderer];
  private _messageQue = new MessageQue();
  get state(): EngineState {
    return this._state;
  }
  constructor(id?: number) {
    if (id !== undefined) {
      this._id = id;
    }
  }
  changeState(state: EngineStateChangeCommand) {
    switch (state) {
      case "start":
        this.start();
        break;
      case "stop":
        this.stop();
        break;
      case "pause":
        this.pause();
        break;
      case "resume":
        this.resume();
        break;
      case "restart":
        this.restart();
        break;
      case "exit":
        this.exit();
        break;
      case "error":
        this.error();
        break;
      case "idle":
        this.idle();
        break;
      case "ready":
        this.ready();
        break;
    }
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
  error(error?: Error) {
    this._state = "error";
    if (error) {
      console.error("Engine error:", error);
    } else {
      console.error("Engine encountered an error.");
    }
    if (this._tickId) {
      clearTimeout(this._tickId);
      this._tickId = null;
    }
    this._nextTickTime = 0;
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
      const delta = now - this._nextTickTime;
      const tick = Math.floor(this._nextTickTime / this._loopInterval);
      await Promise.race([
        this.runSystems(delta, tick),
        waitFail(this._loopTimeout),
      ]);
    } catch (error) {
      console.error("Error in engine loop:", error);
      this.error(error);
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
  private async runSystems(delta: number, tick: number) {
    if (this._state !== "running") return;

    for (const system of this._systems) {
      try {
        system(delta, tick, this);
      } catch (error) {
        console.error("Error in system:", error);
        this.error(error as Error);
      }
    }
  }

  addSystem(system: EngineSystem, index?: number) {
    if (index !== undefined) {
      this._systems.splice(index, 0, system);
    } else {
      this._systems.unshift(system);
    }
  }
  removeSystem(system: EngineSystem) {
    const index = this._systems.indexOf(system);
    if (index !== -1) {
      this._systems.splice(index, 1);
    }
  }
  getSystems(): Array<EngineSystem> {
    return this._systems;
  }
  updateSystem(system: EngineSystem) {
    const index = this._systems.indexOf(system);
    if (index !== -1) {
      this._systems[index] = system;
    } else {
      console.warn("System not found in engine:", system);
    }
  }
}

export type EngineStateChangeCommand =
  | "start"
  | "stop"
  | "pause"
  | "resume"
  | "restart"
  | "exit"
  | "error"
  | "idle"
  | "ready";

const waitFail = (ms: number) =>
  new Promise((_resolve, reject) => setTimeout(reject, ms));
