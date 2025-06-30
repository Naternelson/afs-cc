export const IPCChannels = {
  PING: "ping",
  ENGINE_START: "engine_start",
  ENGINE_PAUSE: "engine_pause",
};

export type IPCChannel = keyof typeof IPCChannels;
