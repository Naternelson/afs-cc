export const IPCChannels = {
  PING: "ping",
  ENGINE_CONTROL: "engine:control",
  ENGINE_RESET: "engine:reset",
  ENGINE_INIT: "engine:init",
  ENGINE_CLOSE: "engine:close",
  ENGINE_CLOSE_ALL: "engine:close_all",
  DATA_PALLETS: "data:pallets",
  FILE_WATCH_START: "file_watch:start",
  FILE_WATCH_STOP: "file_watch:stop",
};

export type IPCChannel = (typeof IPCChannels)[keyof typeof IPCChannels];
