// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { IPCChannel, IPCChannels } from "./ipc/channels";

contextBridge.exposeInMainWorld("ipc", {
  invoke: <T = any>(channel: IPCChannel, ...args: any[]) => {
    // Strip off any 'unsafe' channels
    if (
      Object.values(IPCChannels)
        .map((e) => e.toLowerCase())
        .includes(channel.toLowerCase())
    ) {
      console.log(`Invoking channel: ${channel}`);
      // Use `ipcRenderer.invoke` to
      return ipcRenderer.invoke(channel, ...args);
    } else {
      console.warn(`Attempted to invoke unsafe channel: ${channel}`);
      return Promise.reject(new Error(`Unsafe channel: ${channel}`));
    }
  },
  on: <T = any>(
    channel: string,
    func: (event: Electron.IpcRendererEvent, data: T) => void
  ) => {
    ipcRenderer.on(channel, func);
  },
});
