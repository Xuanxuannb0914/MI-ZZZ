import type {
  DesktopBridge,
  DesktopEnvironmentInfo,
  DesktopPlatform,
  RuntimeEnvironment,
  StarRailGachaErrorCode,
  StarRailGachaLinkResult,
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
const starRailErrorCodes: readonly StarRailGachaErrorCode[] = [
  'cache-dir-not-found',
  'no-version-dirs',
  'no-cache-file',
  'file-in-use',
  'permission-denied',
  'no-url-found',
  'invalid-url',
  'clipboard-failed',
  'unknown',
];

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

function parseStarRailGachaResult(value: unknown): StarRailGachaLinkResult {
  if (typeof value !== 'object' || value === null) {
    throw new TypeError('Star Rail gacha result must be an object.');
  }

  const candidate = value as Record<string, unknown>;
  if (candidate.status !== 'success' && candidate.status !== 'error') {
    throw new TypeError('Star Rail gacha result status is invalid.');
  }
  if (typeof candidate.message !== 'string') {
    throw new TypeError('Star Rail gacha result message is invalid.');
  }
  if (typeof candidate.candidateCount !== 'number') {
    throw new TypeError('Star Rail gacha candidate count is invalid.');
  }

  const link =
    candidate.status === 'success' && typeof candidate.link === 'string'
      ? candidate.link
      : undefined;
  const errorCode =
    typeof candidate.errorCode === 'string' &&
    starRailErrorCodes.includes(candidate.errorCode as StarRailGachaErrorCode)
      ? (candidate.errorCode as StarRailGachaErrorCode)
      : undefined;

  return {
    status: candidate.status,
    message: candidate.message,
    candidateCount: candidate.candidateCount,
    ...(link !== undefined ? { link } : {}),
    ...(errorCode !== undefined ? { errorCode } : {}),
  };
}

const desktopBridge: DesktopBridge = {
  app: {
    getEnvironment: async () => {
      const value: unknown = await ipcRenderer.invoke(ipcChannels.getEnvironment);
      return parseEnvironmentInfo(value);
    },
  },
  starRail: {
    getGachaLink: async () => {
      const value: unknown = await ipcRenderer.invoke(ipcChannels.getStarRailGachaLink);
      return parseStarRailGachaResult(value);
    },
  },
};

contextBridge.exposeInMainWorld('desktop', desktopBridge);
