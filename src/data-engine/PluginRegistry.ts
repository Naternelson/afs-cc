import { DataEngine } from "./DataEngine";
import { PluginContext } from "./PluginContext";
import { System } from "./System";
import { EnginePlugin } from "./types";

export class PluginRegistry {
  private engine: DataEngine;
  private installed = new Map<string, EnginePlugin>();
  private contexts = new Map<string, PluginContext>(); // plugin name → context

  constructor(engine: DataEngine) {
    this.engine = engine;
  }

  register(plugin: EnginePlugin): void {
    if (this.installed.has(plugin.name)) return;

    const context = new PluginContext(plugin.name, this.engine, this);
    plugin.install(context);

    this.installed.set(plugin.name, plugin);
    this.contexts.set(plugin.name, context);
  }

  unregister(name: string): void {
    const plugin = this.installed.get(name);
    const context = this.contexts.get(name);

    if (!plugin || !context) return;

    plugin.uninstall?.(context);
    context.clearSystems(); // fallback safety
    this.installed.delete(name);
    this.contexts.delete(name);
  }

  has(name: string): boolean {
    return this.installed.has(name);
  }

  getContext(name: string): PluginContext | undefined {
    return this.contexts.get(name);
  }

  clear(): void {
    for (const name of this.installed.keys()) {
      this.unregister(name);
    }
  }
}