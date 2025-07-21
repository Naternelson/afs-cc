import { DataEngine } from "./DataEngine";
import { System } from "./System";

type RegisteredSystem = {
  instance: System;
  priority: number;
  enabled: boolean;
  tags: string[];
};

export class SystemManager {
  private engine: DataEngine;
  enableProfiler = false;
  private systems: RegisteredSystem[] = [];

  constructor(engine: DataEngine) {
    this.engine = engine;
  }

  add(system: System, priority: number = 0, tags: string[] = []): void {
    this.systems.push({
      instance: system,
      priority,
      enabled: true,
      tags,
    });
    system.onInit();
    this.sortSystems();
  }

  remove(system: System): void {
    const index = this.systems.findIndex((s) => s.instance === system);
    if (index !== -1) {
      this.systems[index].instance.onDestroy();
      this.systems.splice(index, 1);
    }
  }
  moveSystem(system: System, newPriority: number): void {
    const entry = this.systems.find((s) => s.instance === system);
    if (entry) {
      entry.priority = newPriority;
      this.sortSystems();
    }
  }
  enable(system: System): void {
    const entry = this.systems.find((s) => s.instance === system);
    if (entry) {
      entry.enabled = true;
    }
  }
  disable(system: System): void {
    const entry = this.systems.find((s) => s.instance === system);
    if (entry) {
      entry.enabled = false;
    }
  }
  enableTag(tag: string): void {
    for (const s of this.systems) {
      if (s.tags.includes(tag)) {
        s.enabled = true;
      }
    }
  }

  disableTag(tag: string): void {
    for (const s of this.systems) {
      if (s.tags.includes(tag)) {
        s.enabled = false;
      }
    }
  }

  private sortSystems(): void {
    this.systems.sort((a, b) => a.priority - b.priority);
  }
  update(dt: number): void {
    for (const { instance, enabled } of this.systems) {
      if (!enabled) continue;
      const label = instance.constructor.name;
      const start = performance.now();
      instance.onUpdate(dt);

      if (this.enableProfiler) {
        const end = performance.now();
        const duration = end - start;
        console.log(`System ${label} took ${duration.toFixed(3)} ms`);
      }
    }
  }
  getAll(): System[] {
    return this.systems.map((s) => s.instance);
  }
  debugPrintOrder(): void {
    console.log("System Execution Order:");
    for (const { instance, priority, enabled } of this.systems) {
      console.log(
        `Priority: ${priority}, System: ${instance.constructor.name}, Enabled: ${enabled}`
      );
    }
  }
  clear(): void {
    for (const { instance } of this.systems) {
      instance.onDestroy?.();
    }
    this.systems = [];
  }
}
