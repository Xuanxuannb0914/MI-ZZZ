import { Check, ChevronUp, MoreHorizontal } from '@game-guide-hub/icons';
import { classNames } from '@game-guide-hub/utils';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef, type ReactNode } from 'react';

export const Dropdown = DropdownMenuPrimitive.Root;
export const DropdownTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownGroup = DropdownMenuPrimitive.Group;

export interface DropdownIconTriggerProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger> {
  readonly label: string;
}

export const DropdownIconTrigger = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  DropdownIconTriggerProps
>(function DropdownIconTrigger({ label, className, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Trigger
      {...props}
      ref={ref}
      aria-label={label}
      className={classNames(
        'inline-flex size-control items-center justify-center rounded-md text-text-secondary',
        'hover:bg-surface-2 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-action-primary',
        className,
      )}
    >
      <MoreHorizontal aria-hidden="true" className="size-icon-md" />
    </DropdownMenuPrimitive.Trigger>
  );
});

export const DropdownContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(function DropdownContent({ className, sideOffset = 8, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        {...props}
        ref={ref}
        sideOffset={sideOffset}
        className={classNames(
          'ggh-glass glass-strong z-dropdown min-w-menu rounded-md p-compact',
          'text-text-primary shadow-level-2',
          className,
        )}
      />
    </DropdownMenuPrimitive.Portal>
  );
});

export interface DropdownItemProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  readonly leading?: ReactNode;
}

export const DropdownItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownItemProps
>(function DropdownItem({ className, leading, children, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Item
      {...props}
      ref={ref}
      className={classNames(
        'flex h-control w-full cursor-default select-none items-center gap-control rounded-sm px-content',
        'text-body outline-none data-[highlighted]:bg-surface-3',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
    >
      {leading}
      {children}
    </DropdownMenuPrimitive.Item>
  );
});

export const DropdownCheckboxItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(function DropdownCheckboxItem({ className, children, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      {...props}
      ref={ref}
      className={classNames(
        'relative flex h-control cursor-default select-none items-center rounded-sm px-content pr-layout',
        'text-body outline-none data-[highlighted]:bg-surface-3',
        className,
      )}
    >
      <DropdownMenuPrimitive.ItemIndicator className="absolute right-content">
        <Check aria-hidden="true" className="size-icon-sm text-action-primary" />
      </DropdownMenuPrimitive.ItemIndicator>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
});

export const DropdownSeparator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(function DropdownSeparator({ className, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Separator
      {...props}
      ref={ref}
      className={classNames('my-compact h-px bg-border-subtle', className)}
    />
  );
});

export const DropdownLabel = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(function DropdownLabel({ className, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Label
      {...props}
      ref={ref}
      className={classNames(
        'px-content py-control text-caption font-semibold text-text-secondary',
        className,
      )}
    />
  );
});

export const DropdownSubTrigger = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(function DropdownSubTrigger({ className, children, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      {...props}
      ref={ref}
      className={classNames(
        'flex h-control items-center justify-between rounded-sm px-content text-body outline-none',
        'data-[highlighted]:bg-surface-3',
        className,
      )}
    >
      {children}
      <ChevronUp aria-hidden="true" className="size-icon-sm" />
    </DropdownMenuPrimitive.SubTrigger>
  );
});
