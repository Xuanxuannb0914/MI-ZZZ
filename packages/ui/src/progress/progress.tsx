import { classNames } from '@game-guide-hub/utils';
import type { ProgressHTMLAttributes } from 'react';

export interface ProgressProps extends ProgressHTMLAttributes<HTMLProgressElement> {
  readonly tone?: 'primary' | 'accent';
}

export function Progress({ className, tone = 'primary', ...props }: ProgressProps) {
  return (
    <progress
      {...props}
      className={classNames('ggh-progress', tone === 'accent' && 'ggh-progress-accent', className)}
    />
  );
}
