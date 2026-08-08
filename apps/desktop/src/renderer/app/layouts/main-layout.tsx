import type { PropsWithChildren } from 'react';
import { AppShell } from '../../widgets/app-shell/app-shell';

/** Owns the persistent shell used after startup has completed. */
export function MainLayout({ children }: PropsWithChildren) {
  return <AppShell>{children}</AppShell>;
}
