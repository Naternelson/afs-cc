import { System } from "../engine/System";
import { EngineEvent } from "../types";

export class ErrorSystem extends System {
  onInit(): void {
    this.engine.eventBus.on("error", this.handleError);
  }
  onUpdate(dt: number): void {}
  handleError(event: EngineEvent) {
    const { error, context } = event.payload;
    console.error("[Engine Error]", context, error);
  }
}
