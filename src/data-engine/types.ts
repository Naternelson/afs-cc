import { PluginContext } from "./PluginContext";

export type EntityId = number;

export type ComponentClass<T> = new (...args: any[]) => T;

export type EngineEvent = {
  type: string;
  payload?: any;
};

export type EventCallback = (event: EngineEvent) => void;

export interface EnginePlugin {
  name: string;
  install(engine: PluginContext): void;
  uninstall(engine: PluginContext): void;
}

export type EngineLifecycleEvent =
  | "engine:init"
  | "engine:start"
  | "engine:pause"
  | "engine:resume"
  | "engine:stop"
  | "engine:destroy";
