import { EngineCore } from "../core";
import { ipcMain } from "electron";
import { EngineSystem } from "../system";
export const updateRenderer: EngineSystem = (
  _delta,
  _tick,
  engine: EngineCore
) => {
  const world = engine.world.serialize();
  ipcMain.emit(`engine:update:${engine.id}`, world);
};
