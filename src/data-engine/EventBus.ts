import { DataEngine } from "./DataEngine";
import { EngineEvent, EventCallback } from "./types";

export class EventBus {
  private engine: DataEngine;
  constructor(engine: DataEngine) {
    this.engine = engine;
  }

  private events: EngineEvent[] = [];
  private subscribers: Map<string, Set<EventCallback>> = new Map();
  emit(event: EngineEvent): void {
    this.events.push(event);
  }
  consume(): EngineEvent[] {
    const out = [...this.events];
    this.clear();
    return out;
  }
  clear(): void {
    this.events.length = 0;
  }

  on(type: string, callback: EventCallback): void {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type)?.add(callback);
  }
  off(type: string, callback: EventCallback): void {
    this.subscribers.get(type)?.delete(callback);
  }
  filter(type: string): EngineEvent[] {
    return this.events.filter((e) => e.type === type);
  }
}
