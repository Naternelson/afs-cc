import { PluginContext } from "./engine/PluginContext";

export type EntityId = number;

export type ComponentClass<T> = new (...args: any[]) => T;

export type EngineEvent = {
  type: string;
  payload?: any;
};

export type TickMetaData = {
  tick: number;
  delta: number;
  time: DOMHighResTimeStamp;
  interpolation: number;
};

export type EventCallback = (event: EngineEvent, meta: TickMetaData) => void;

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
