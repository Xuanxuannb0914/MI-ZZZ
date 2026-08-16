import { parseRuntimeEnvironment } from '@game-guide-hub/config';
import type {
  DesktopEnvironmentInfo,
  DesktopPlatform,
  StarRailGachaLinkResult,
} from '@game-guide-hub/types';
import { app, ipcMain } from 'electron';
import { createStarRailGachaFactory } from '../star-rail/factory';
import { redactSensitiveUrl } from '../star-rail/redact';
import { ipcChannels } from './channels';

export function registerIpcHandlers(): void {
  ipcMain.handle(
    ipcChannels.getEnvironment,
    (): DesktopEnvironmentInfo => ({
      environment: parseRuntimeEnvironment(process.env.DESKTOP_ENV),
      platform: getSupportedPlatform(),
      version: app.getVersion(),
    }),
  );

  ipcMain.handle(ipcChannels.getStarRailGachaLink, (): StarRailGachaLinkResult => {
    const factory = createStarRailGachaFactory();
    const result = factory.service.getStarRailGachaLink();

    // Log a redacted version for debugging. Never log the full URL.
    if (result.status === 'success' && result.link) {
      const redacted = redactSensitiveUrl(result.link);
      // eslint-disable-next-line no-console
      console.debug(
        `[star-rail] gacha link found: ${redacted} (${result.candidateCount} candidates)`,
      );
    } else {
      // eslint-disable-next-line no-console
      console.debug(`[star-rail] gacha link failed: ${result.errorCode} (${result.message})`);
    }

    return result;
  });
}

function getSupportedPlatform(): DesktopPlatform {
  if (process.platform === 'darwin') {
    return 'darwin';
  }

  if (process.platform === 'win32') {
    return 'win32';
  }

  return 'linux';
}

export function unregisterIpcHandlers(): void {
  ipcMain.removeHandler(ipcChannels.getEnvironment);
  ipcMain.removeHandler(ipcChannels.getStarRailGachaLink);
}
