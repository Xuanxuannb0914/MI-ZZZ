export const ipcChannels = {
  getEnvironment: 'desktop:v1:get-environment',
  getStarRailGachaLink: 'starrail:v1:get-gacha-link',
} as const;

export type IpcChannel = (typeof ipcChannels)[keyof typeof ipcChannels];
