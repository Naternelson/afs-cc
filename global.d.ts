export {};

declare global {
  interface Window {
    ipc: {
      send: <T = any>(channel: string, data: T) => void;
      on: <T = any>(
        channel: string,
        func: (event: Electron.IpcRendererEvent, data: T) => void
      ) => void;
      once: <T = any>(
        channel: string,
        func: (event: Electron.IpcRendererEvent, data: T) => void
      ) => void;
      removeListener: <T = any>(
        channel: string,
        func: (event: Electron.IpcRendererEvent, data: T) => void
      ) => void;
      removeAllListeners: (channel: string) => void;
      invoke: <T = any>(channel: string, ...args: any[]) => Promise<T>;
    };
  }
}
