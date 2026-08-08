import { parseRuntimeEnvironment } from '@game-guide-hub/config';
import type { DesktopEnvironmentInfo, DesktopPlatform } from '@game-guide-hub/types';
import { app, ipcMain } from 'electron';
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
}
