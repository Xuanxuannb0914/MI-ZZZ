import { classNames } from '@game-guide-hub/utils';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export type CardGlass = 'light' | 'medium' | 'strong';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  readonly glass?: CardGlass;
  readonly interactive?: boolean;
  readonly isLoading?: boolean;
  readonly loadingFallback?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    className,
    glass = 'medium',
    interactive = false,
    isLoading = false,
    loadingFallback,
    children,
    ...props
  },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      aria-busy={isLoading || undefined}
      className={classNames(
        'ggh-card ggh-glass border p-panel text-text-primary',
        `glass-${glass}`,
        interactive && 'ggh-card-interactive',
        className,
      )}
    >
      {isLoading ? loadingFallback : children}
    </div>
  );
});
