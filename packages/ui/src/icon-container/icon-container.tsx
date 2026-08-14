import { classNames } from '@game-guide-hub/utils';
import type { HTMLAttributes, ReactNode } from 'react';

export type IconContainerTone = 'primary' | 'secondary' | 'accent' | 'warning';

export interface IconContainerProps extends HTMLAttributes<HTMLSpanElement> {
  readonly children: ReactNode;
  readonly tone?: IconContainerTone;
  readonly active?: boolean;
  readonly disabled?: boolean;
}

const toneClasses: Record<IconContainerTone, string> = {
  primary: '',
  secondary: 'ggh-icon-container-secondary',
  accent: 'ggh-icon-container-accent',
  warning: 'ggh-icon-container-warning',
};

export function IconContainer({
  children,
  tone = 'primary',
  active = false,
  disabled = false,
  className,
  ...props
}: IconContainerProps) {
  return (
    <span
      {...props}
      className={classNames('ggh-icon-container', toneClasses[tone], className)}
      data-active={active || undefined}
      aria-disabled={disabled || undefined}
    >
      {children}
    </span>
  );
}
