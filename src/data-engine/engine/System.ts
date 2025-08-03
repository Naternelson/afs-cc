import { BaseEngine } from "./BaseEngine";

export abstract class System {
  protected engine: BaseEngine;
  constructor(engine: BaseEngine) {
    this.engine = engine;
  }
  abstract onUpdate(dt: number): void;
  onInit?(): void;
  onDestroy?(): void;
}
