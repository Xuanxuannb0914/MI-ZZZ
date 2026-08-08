import type {
  DesktopBridge,
  DesktopEnvironmentInfo,
  DesktopPlatform,
  RuntimeEnvironment,
} from '@game-guide-hub/types';
import { contextBridge, ipcRenderer } from 'electron';
import { ipcChannels } from '../main/ipc/channels';

const runtimeEnvironments: readonly RuntimeEnvironment[] = [
  'development',
  'test',
  'staging',
  'production',
];
const desktopPlatforms: readonly DesktopPlatform[] = ['darwin', 'win32', 'linux'];

function parseEnvironmentInfo(value: unknown): DesktopEnvironmentInfo {
  if (typeof value !== 'object' || value === null) {
    throw new TypeError('Desktop environment response must be an object.');
  }

  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.environment !== 'string' ||
    !runtimeEnvironments.includes(candidate.environment as RuntimeEnvironment) ||
    typeof candidate.platform !== 'string' ||
    !desktopPlatforms.includes(candidate.platform as DesktopPlatform) ||
    typeof candidate.version !== 'string'
  ) {
    throw new TypeError('Desktop environment response is invalid.');
  }

  return {
    environment: candidate.environment as RuntimeEnvironment,
    platform: candidate.platform as DesktopPlatform,
    version: candidate.version,
  };
}

const desktopBridge: DesktopBridge = {
  app: {
    getEnvironment: async () => {
      const value: unknown = await ipcRenderer.invoke(ipcChannels.getEnvironment);
      return parseEnvironmentInfo(value);
    },
  },
};

contextBridge.exposeInMainWorld('desktop', desktopBridge);
