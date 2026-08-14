import { classNames } from '@game-guide-hub/utils';
import type { ReactNode } from 'react';

export interface TabItem<Value extends string> {
  readonly value: Value;
  readonly label: string;
  readonly icon?: ReactNode;
  readonly disabled?: boolean;
}

export interface TabsProps<Value extends string> {
  readonly value: Value;
  readonly items: readonly TabItem<Value>[];
  readonly onValueChange: (value: Value) => void;
  readonly label: string;
  readonly className?: string;
}

export function Tabs<Value extends string>({
  value,
  items,
  onValueChange,
  label,
  className,
}: TabsProps<Value>) {
  return (
    <div className={classNames('ggh-tabs-list', className)} role="tablist" aria-label={label}>
      {items.map((item) => (
        <button
          type="button"
          role="tab"
          aria-selected={item.value === value}
          disabled={item.disabled}
          key={item.value}
          className="ggh-tab inline-flex items-center gap-compact"
          onClick={() => onValueChange(item.value)}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
