export const IPCChannels = {
  PING: "ping",
  ENGINE_START: "engine_start",
  ENGINE_PAUSE: "engine_pause",
  ENGINE_CONTROL: "engine/control" 
};

export type IPCChannel = keyof typeof IPCChannels;
