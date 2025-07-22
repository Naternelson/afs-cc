import { BaseEngine } from "./BaseEngine";
import { PluginRegistry } from "./PluginRegistry";
import { System } from "./System";

export class PluginContext {
  private systems: System[] = [];
  private engine: BaseEngine;
  private registry: PluginRegistry;
  public readonly name: string;

  constructor(name: string, engine: BaseEngine, registry: PluginRegistry) {
    this.name = name;
    this.engine = engine;
    this.registry = registry;
  }
  addSystem(system: System, priority = 0, tags: string[] = []): void {
    this.engine.systems.add(system, priority, tags);
    this.systems.push(system);
  }
  removeSystem(system: System): void {
    this.engine.systems.remove(system);
    this.systems = this.systems.filter((s) => s !== system);
  }
  clearSystems(): void {
    for (const system of this.systems) {
      this.engine.systems.remove(system);
    }
    this.systems = [];
  }
  getSystems(): System[] {
    return [...this.systems];
  }
}
