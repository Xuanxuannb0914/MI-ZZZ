import { classNames } from '@game-guide-hub/utils';
import type { HTMLAttributes } from 'react';

export type TagTone = 'neutral' | 'electric' | 'ether' | 'ice' | 'fire' | 'physical';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  readonly tone?: TagTone;
}

const toneClasses: Record<TagTone, string> = {
  neutral: 'border-border-subtle bg-surface-2 text-text-secondary',
  electric: 'border-content-electric/30 bg-content-electric/10 text-content-electric',
  ether: 'border-content-ether/30 bg-content-ether/10 text-content-ether',
  ice: 'border-content-ice/30 bg-content-ice/10 text-content-ice',
  fire: 'border-content-fire/30 bg-content-fire/10 text-content-fire',
  physical: 'border-content-physical/30 bg-content-physical/10 text-content-physical',
};

export function Tag({ className, tone = 'neutral', ...props }: TagProps) {
  return (
    <span
      {...props}
      className={classNames(
        'inline-flex min-h-control-compact items-center rounded-full border px-content text-caption font-medium',
        toneClasses[tone],
        className,
      )}
    />
  );
}
