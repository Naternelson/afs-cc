import { System } from "../System";

export class TestSystem extends System {
  onUpdate(dt: number): void {
    console.log(`Tick: ${this.engine.tickMeta.tick} \n\tDelta: ${dt}`);
  }
}
