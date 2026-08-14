export const ipcChannels = {
  getEnvironment: 'desktop:v1:get-environment',
} as const;

export type IpcChannel = (typeof ipcChannels)[keyof typeof ipcChannels];
