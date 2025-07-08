import { BrowserWindow, ipcMain } from "electron";
import { IPCChannels } from "../channels";
import { AppEngines } from "../../main/AppEngines";
import { EngineStateChangeCommand } from "../../engine";

ipcMain.handle(
  IPCChannels.ENGINE_CONTROL,
  async (event, engineId: number, command: EngineStateChangeCommand) => {
    const eng = AppEngines.getEngine(engineId);
    if (!eng) {
      throw new Error(`Engine with ID ${engineId} not found`);
    }
    eng.changeState(command);
    return eng.state;
  }
);

ipcMain.handle(IPCChannels.ENGINE_INIT, async (event) => {
  console.log("Initializing new engine instance");
  const eng = AppEngines.createEngine();
  const wc = event.sender;
  const win = BrowserWindow.fromWebContents(wc);
  ipcMain.on(`engine:update:${eng.id}`, (event, data) => {
    event.sender.send(`engine:update:${eng.id}`, data);
  });
  ipcMain.on("engine:state_change", (event, engineId: number) => {
    const eng = AppEngines.getEngine(engineId);
    if (!eng) {
      console.warn(`Engine with ID ${engineId} not found for state change`);
      return;
    }
    const state = eng.state;
    event.sender.send(`engine:state:${engineId}`, state);
  });
  win.on("close", () => {
    AppEngines.removeEngine(eng.id);
    ipcMain.removeAllListeners(`engine:update:${eng.id}`);
  });
  return eng.id;
});

ipcMain.handle(IPCChannels.ENGINE_CLOSE, async (event, engineId: number) => {
  const eng = AppEngines.getEngine(engineId);
  if (!eng) {
    throw new Error(`Engine with ID ${engineId} not found`);
  }
  AppEngines.removeEngine(engineId);
  ipcMain.removeAllListeners(`engine:update:${engineId}`);
  return true;
});

ipcMain.handle(IPCChannels.ENGINE_CLOSE_ALL, async () => {
  const engines = AppEngines.getAllEngines();
  engines.forEach((engine) => {
    ipcMain.removeAllListeners(`engine:update:${engine.id}`);
  });
  AppEngines.closeAllEngines();

  return true;
});

ipcMain.handle(IPCChannels.ENGINE_RESET, async (event, engineId: number) => {
  const eng = AppEngines.getEngine(engineId);
  if (!eng) {
    throw new Error(`Engine with ID ${engineId} not found`);
  }
  AppEngines.removeEngine(engineId);
  AppEngines.createEngine(engineId);
  return true;
});
