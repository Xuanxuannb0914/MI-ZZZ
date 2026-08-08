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
      className={classNames('inline-flex items-center justify-center', className)}
    >
      <span
        aria-hidden="true"
        className={classNames(
          'animate-spin rounded-full border-2 border-border-strong border-t-action-primary motion-reduce:animate-none',
          sizeClasses[size],
        )}
      />
    </span>
  );
}
