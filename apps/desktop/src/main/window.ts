import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { BrowserWindow, shell } from 'electron';

function isAllowedNavigation(
  url: string,
  developmentUrl: string | undefined,
  rendererEntryPath: string,
): boolean {
  try {
    const target = new URL(url);

    if (developmentUrl) {
      return target.origin === new URL(developmentUrl).origin;
    }

    return (
      target.protocol === 'file:' && target.pathname === pathToFileURL(rendererEntryPath).pathname
    );
  } catch {
    return false;
  }
}

export function createMainWindow(): BrowserWindow {
  const developmentUrl = process.env.VITE_DEV_SERVER_URL;
  const rendererEntryPath = join(__dirname, '../../renderer/index.html');
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 640,
    show: false,
    backgroundColor: '#0B0D12',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  window.once('ready-to-show', () => window.show());
  window.webContents.setWindowOpenHandler(({ url }) => {
    try {
      if (new URL(url).protocol === 'https:') {
        void shell.openExternal(url);
      }
    } catch {
      return { action: 'deny' };
    }

    return { action: 'deny' };
  });
  window.webContents.on('will-navigate', (event, url) => {
    if (!isAllowedNavigation(url, developmentUrl, rendererEntryPath)) {
      event.preventDefault();
    }
  });

  if (developmentUrl) {
    void window.loadURL(developmentUrl);
  } else {
    void window.loadFile(rendererEntryPath);
  }

  return window;
}
