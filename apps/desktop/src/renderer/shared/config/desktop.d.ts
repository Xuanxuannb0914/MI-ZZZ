import type { DesktopBridge } from '@game-guide-hub/types';

declare global {
  interface Window {
    readonly desktop: DesktopBridge;
  }
}
