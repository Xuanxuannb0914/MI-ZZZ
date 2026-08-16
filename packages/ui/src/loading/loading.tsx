import { classNames } from '@game-guide-hub/utils';

export type LoadingSize = 'small' | 'medium' | 'large';

export interface LoadingProps {
  readonly label: string;
  readonly size?: LoadingSize;
  readonly className?: string;
  /** 可选进度值（0-100）。传入后以数字百分比展示，用于创意加载态。 */
  readonly progress?: number;
}

const sizeClasses: Record<LoadingSize, string> = {
  small: 'size-icon-sm',
  medium: 'size-icon-md',
  large: 'size-icon-lg',
};

export function Loading({ label, size = 'medium', className, progress }: LoadingProps) {
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
      {typeof progress === 'number' && (
        <span className="text-caption font-mono tabular-nums text-text-secondary">
          {Math.round(progress)}%
        </span>
      )}
    </span>
  );
}
