export const IPCChannels = {
  PING: "ping",
  ENGINE_CONTROL: "engine:control",
  ENGINE_RESET: "engine:reset",
  ENGINE_INIT: "engine:init",
  ENGINE_CLOSE: "engine:close",
  ENGINE_CLOSE_ALL: "engine:close_all",
  DATA_PALLETS: "data:pallets",
};

export type IPCChannel = (typeof IPCChannels)[keyof typeof IPCChannels];
