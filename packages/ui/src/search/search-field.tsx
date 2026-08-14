import { Search, X } from '@game-guide-hub/icons';
import { classNames } from '@game-guide-hub/utils';
import type { ChangeEvent, InputHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';

export interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly label: string;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { value, onValueChange, label, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onValueChange(event.target.value);

  return (
    <div
      className={classNames('group relative flex h-control-comfortable items-center', className)}
    >
      <label className="sr-only" htmlFor={inputId}>
        {label}
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-content text-text-tertiary group-focus-within:text-primary"
        size={18}
      />
      <input
        {...props}
        ref={ref}
        id={inputId}
        type="search"
        value={value}
        onChange={handleChange}
        className="ggh-input h-full w-full border pl-layout pr-layout text-body text-text-primary outline-none placeholder:text-text-tertiary"
      />
      {value ? (
        <button
          type="button"
          className="ggh-button ggh-button-quiet absolute right-compact flex size-control items-center justify-center"
          onClick={() => onValueChange('')}
          aria-label="清空搜索"
        >
          <X aria-hidden="true" size={16} />
        </button>
      ) : null}
    </div>
  );
});
