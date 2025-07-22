import { ComponentManager } from "./ComponentManager";
import { EntityManager } from "./EntityManager";
import { EventBus } from "./EventBus";
import { PluginRegistry } from "./PluginRegistry";
import { QueryBuilder } from "./QueryBuilder";
import { SystemManager } from "./SystemManager";
import { ErrorSystem } from "./systems/ErrorSystem";
import { TickLoop } from "./TickLoop";
import { ComponentClass, EnginePlugin } from "./types";

export class BaseEngine {
  private initialized = false;
  private paused = false;
  entities = new EntityManager(this);
  components = new ComponentManager(this);
  systems = new SystemManager(this);
  eventBus = new EventBus(this);
  loop = new TickLoop(this);
  plugins = new PluginRegistry(this);
  constructor() {
    this.systems.add(new ErrorSystem(this), 0, ["error"]);
  }
  update(dt: number): void {
    if (this.paused) return;
    this.systems.update(dt);
  }
  query<T extends any[]>(
    ...components: ComponentClass<any>[]
  ): QueryBuilder<T> {
    return new QueryBuilder<T>(this, ...components);
  }
  clear(): void {
    this.systems.clear();
    this.components.clear();
    this.entities.clear();
    this.eventBus.clear();
  }
  start(updatesPerSecond = 60): void {
    if (!this.initialized) this.init();
    this.loop.setRate(updatesPerSecond);
    this.eventBus.emit({ type: "engine:start" });
    this.loop.start();
  }
  stop(): void {
    this.eventBus.emit({ type: "engine:stop" });
    this.loop.stop();
    this.paused = false;
  }
  use(plugin: EnginePlugin) {
    this.plugins.register(plugin);
  }
  removePlugin(name: string) {
    this.plugins.unregister(name);
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    this.eventBus.emit({
      type: "engine:init",
    });
  }
  pause() {
    this.paused = true;
    this.eventBus.emit({
      type: "engine:pause",
    });
  }
  resume() {
    this.paused = false;
    this.eventBus.emit({
      type: "engine:resumed",
    });
  }
  destroy() {
    this.stop();
    this.clear();
    this.plugins.clear();
    this.initialized = false;
    this.eventBus.emit({ type: "engine:destroy" });
  }
}
