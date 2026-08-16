import { classNames } from '@game-guide-hub/utils';

export type LoadingSize = 'small' | 'medium' | 'large';

export interface LoadingProps {
  readonly label: string;
  readonly size?: LoadingSize;
  readonly className?: string;
}

const sizeClasses: Record<LoadingSize, string> = {
  small: 'size-icon-sm',
  medium: 'size-icon-md',
  large: 'size-icon-lg',
};

export function Loading({ label, size = 'medium', className }: LoadingProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={classNames('inline-flex items-center justify-center gap-2', className)}
    >
      <span
        aria-hidden="true"
        className={classNames('relative inline-grid place-items-center', sizeClasses[size])}
      >
        <span className="ggh-pulse-ring absolute inset-0 rounded-full motion-reduce:hidden" />
        <span
          className="block size-3/5 rounded-full border-2 border-border-strong border-t-action-primary animate-spin motion-reduce:animate-none"
          style={{ boxShadow: '0 0 12px var(--ggh-color-glow)' }}
        />
      </span>
    </span>
  );
}
