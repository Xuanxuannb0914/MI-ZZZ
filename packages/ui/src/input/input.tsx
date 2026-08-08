import { classNames } from '@game-guide-hub/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, hasError = false, ...props },
  ref,
) {
  return (
    <input
      {...props}
      ref={ref}
      aria-invalid={hasError || undefined}
      className={classNames(
        'ggh-input h-control w-full border px-content text-body text-text-primary',
        'placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2',
        'disabled:cursor-not-allowed disabled:bg-surface-2 disabled:opacity-50',
        hasError
          ? 'border-danger focus-visible:ring-danger'
          : 'border-border-strong focus-visible:ring-action-primary',
        className,
      )}
    />
  );
});
