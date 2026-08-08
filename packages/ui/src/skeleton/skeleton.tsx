import { classNames } from '@game-guide-hub/utils';
import type { HTMLAttributes } from 'react';

export type SkeletonProps = HTMLAttributes<HTMLSpanElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <span {...props} aria-hidden="true" className={classNames('ggh-skeleton', className)} />;
}
