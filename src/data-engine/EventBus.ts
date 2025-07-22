import { BaseEngine } from "./BaseEngine";
import { EngineEvent, EventCallback } from "./types";

export class EventBus {
  private engine: BaseEngine;
  constructor(engine: BaseEngine) {
    this.engine = engine;
  }

  private events: EngineEvent[] = [];
  private subscribers: Map<string, Set<EventCallback>> = new Map();
  private onceSubs: Map<string, Set<EventCallback>> = new Map();
  emit(event: EngineEvent): void {
    this.events.push(event);
    const subs = this.subscribers.get(event.type);
    if (subs) {
      for (const cb of subs) {
        try {cb(event)} catch {
            console.error("There be errors")
        }
      }
    }
    const onceSubs = this.onceSubs.get(event.type);
    if (onceSubs) {
      for (const cb of onceSubs) {
        cb(event);
      }
      this.onceSubs.delete(event.type);
    }
  }
  consume(): EngineEvent[] {
    const out = [...this.events];
    this.clear();
    return out;
  }
  clear(): void {
    this.events.length = 0;
  }

  on(type: string, callback: EventCallback): () => void {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type)?.add(callback);
    return () => this.off(type, callback);
  }
  off(type: string, callback: EventCallback): void {
    this.subscribers.get(type)?.delete(callback);
  }
  filter(type: string): EngineEvent[] {
    return this.events.filter((e) => e.type === type);
  }
  clearSubscribers() {
    this.subscribers.clear();
  }
}
