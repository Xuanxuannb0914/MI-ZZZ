import { classNames } from '@game-guide-hub/utils';
import type { HTMLAttributes } from 'react';

export interface ScrollAreaProps extends HTMLAttributes<HTMLElement> {
  readonly label: string;
}

export function ScrollArea({ label, className, children, ...props }: ScrollAreaProps) {
  return (
    <section {...props} className={classNames('ggh-scroll-area', className)} aria-label={label}>
      {children}
    </section>
  );
}
