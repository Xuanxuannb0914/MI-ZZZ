import { classNames } from '@game-guide-hub/utils';
import type { HTMLAttributes } from 'react';

export type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  readonly variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-surface-2 text-text-secondary',
  info: 'bg-info/15 text-info',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
};

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={classNames(
        'inline-flex min-h-control-compact items-center rounded-full px-content text-caption font-medium',
        variantClasses[variant],
        className,
      )}
    />
  );
}
