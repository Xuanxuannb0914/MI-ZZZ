import { classNames } from '@game-guide-hub/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger';
export type ButtonSize = 'compact' | 'default' | 'comfortable';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'ggh-button-primary',
  secondary: 'ggh-button-secondary',
  quiet: 'ggh-button-quiet',
  danger: 'ggh-button-danger',
};

const sizeClasses: Record<ButtonSize, string> = {
  compact: 'h-control-compact px-content text-caption',
  default: 'h-control px-panel text-label',
  comfortable: 'h-control-comfortable px-panel text-body',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'default',
    isLoading = false,
    disabled,
    children,
    type = 'button',
    ...props
  },
  ref,
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={classNames(
        'ggh-button inline-flex shrink-0 items-center justify-center gap-control font-medium',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="size-icon-sm animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
        />
      ) : null}
      {children}
    </button>
  );
});
