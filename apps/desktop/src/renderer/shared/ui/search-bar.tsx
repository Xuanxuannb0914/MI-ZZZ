import { SearchField } from '@game-guide-hub/ui';
import type { KeyboardEvent, Ref } from 'react';

interface SearchBarProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder: string;
  readonly label: string;
  readonly className?: string;
  readonly inputRef?: Ref<HTMLInputElement>;
  readonly onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder,
  label,
  className,
  inputRef,
  onKeyDown,
}: SearchBarProps) {
  return (
    <SearchField
      ref={inputRef}
      value={value}
      onValueChange={onChange}
      placeholder={placeholder}
      label={label}
      className={className}
      onKeyDown={onKeyDown}
    />
  );
}
