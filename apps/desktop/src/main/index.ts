import { app, BrowserWindow } from 'electron';
import { registerIpcHandlers, unregisterIpcHandlers } from './ipc/handlers';
import { createMainWindow } from './window';

let mainWindow: BrowserWindow | null = null;

function openMainWindow(): void {
  mainWindow = createMainWindow();
  mainWindow.once('closed', () => {
    mainWindow = null;
  });
}

async function bootstrap(): Promise<void> {
  await app.whenReady();
  registerIpcHandlers();
  openMainWindow();

  app.on('activate', () => {
    if (!mainWindow || mainWindow.isDestroyed() || BrowserWindow.getAllWindows().length === 0) {
      openMainWindow();
    }
  });
}

void bootstrap();

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  unregisterIpcHandlers();
});
