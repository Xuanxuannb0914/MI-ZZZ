import type { PropsWithChildren } from 'react';

/** Isolates the startup scene from the application shell. */
export function LandingLayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
