import { classNames } from '@game-guide-hub/utils';
import type { PropsWithChildren } from 'react';

interface PageProps extends PropsWithChildren {
  readonly className?: string;
}

export function Page({ children, className }: PageProps) {
  return (
    <div
      className={classNames(
        'mx-auto w-full max-w-app space-y-layout px-panel py-layout lg:px-layout',
        className,
      )}
    >
      {children}
    </div>
  );
}
