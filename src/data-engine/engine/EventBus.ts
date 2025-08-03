import { BaseEngine } from "./BaseEngine";
import { EngineEvent, EventCallback } from "../types";

type Subscriber = {
  event: string;
  callback: EventCallback;
  immediate: boolean;
  once: boolean;
};

export class EventBus {
  private engine: BaseEngine;
  constructor(engine: BaseEngine) {
    this.engine = engine;
  }

  private events: EngineEvent[] = [];
  private subscribers: Map<string, Set<Subscriber>> = new Map();
  emit(event: EngineEvent): void {
    this.events.push(event);
    const subs = this.subscribers.get(event.type);
    if (!subs) return;
    for (const sub of subs) {
      if (!sub.immediate) continue;
      this.dispatch(event, sub);
    }
  }
  private dispatch(event: EngineEvent, sub: Subscriber) {
    try {
      sub.callback(event, this.engine.tickMeta);
      if (!sub.once) return;
      this.subscribers.get(event.type)?.delete(sub);
    } catch (e) {
      console.error("Error in subscriber for ${event.type}", e);
    }
  }
  process() {
    const queued = [...this.events];
    this.clear();
    for (const event of queued) {
      const subs = this.subscribers.get(event.type);
      if (!subs) return;
      for (const sub of subs) {
        if (sub.immediate) continue;
        this.dispatch(event, sub);
      }
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
  reset(): void {
    this.clear();
    this.clearSubscribers();
  }

  on(
    type: string,
    callback: EventCallback,
    options: { immediate?: boolean; once?: boolean } = {}
  ): () => void {
    const subscriber: Subscriber = {
      event: type,
      callback,
      immediate: options.immediate ?? false,
      once: options.once ?? false,
    };
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type)!.add(subscriber);
    return () => this.off(type, callback);
  }
  off(type: string, callback: EventCallback): void {
    const subs = this.subscribers.get(type);
    if (!subs) return;
    for (const sub of subs) {
      if ((sub.callback = callback)) {
        subs.delete(sub);
      }
    }
  }
  clearSubscribers() {
    this.subscribers.clear();
  }
}
