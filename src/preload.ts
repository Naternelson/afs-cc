// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { IPCChannel, IPCChannels } from "./ipc/channels";

contextBridge.exposeInMainWorld("ipc", {
  invoke: <T = any>(channel: IPCChannel, ...args: any[]) => {
    // Strip off any 'unsafe' channels
    if (
      Object.keys(IPCChannels)
        .map((e) => e.toLowerCase())
        .includes(channel.toLowerCase())
    ) {
      return ipcRenderer.invoke(channel, ...args);
    } else {
      console.warn(
        `Attempted to invoke unsafe channel: ${channel}`,
        IPCChannels
      );
      return Promise.reject(new Error(`Unsafe channel: ${channel}`));
    }
  },
});
