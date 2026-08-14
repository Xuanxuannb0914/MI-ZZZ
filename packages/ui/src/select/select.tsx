import { Check, ChevronDown, ChevronUp } from '@game-guide-hub/icons';
import { classNames } from '@game-guide-hub/utils';
import * as SelectPrimitive from '@radix-ui/react-select';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = forwardRef<
  ElementRef<typeof SelectPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(function SelectTrigger({ className, children, ...props }, ref) {
  return (
    <SelectPrimitive.Trigger
      {...props}
      ref={ref}
      className={classNames(
        'inline-flex h-control w-full items-center justify-between gap-control rounded-md border',
        'border-border-strong bg-surface-1 px-content text-body text-text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown aria-hidden="true" className="size-icon-sm text-text-secondary" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

export const SelectContent = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(function SelectContent({ className, children, position = 'popper', ...props }, ref) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        {...props}
        ref={ref}
        position={position}
        className={classNames(
          'z-dropdown max-h-popover-max min-w-(--radix-select-trigger-width) overflow-y-auto rounded-md',
          'ggh-glass glass-strong p-compact text-text-primary shadow-level-2',
          className,
        )}
      >
        <SelectPrimitive.ScrollUpButton className="flex h-control-compact items-center justify-center">
          <ChevronUp aria-hidden="true" className="size-icon-sm" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-control-compact items-center justify-center">
          <ChevronDown aria-hidden="true" className="size-icon-sm" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

export const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(function SelectItem({ className, children, ...props }, ref) {
  return (
    <SelectPrimitive.Item
      {...props}
      ref={ref}
      className={classNames(
        'relative flex h-control cursor-default select-none items-center rounded-sm px-content pr-layout',
        'text-body outline-none data-[highlighted]:bg-surface-3 data-[highlighted]:text-text-primary',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-content inline-flex items-center">
        <Check aria-hidden="true" className="size-icon-sm text-action-primary" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});

export const SelectLabel = forwardRef<
  ElementRef<typeof SelectPrimitive.Label>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(function SelectLabel({ className, ...props }, ref) {
  return (
    <SelectPrimitive.Label
      {...props}
      ref={ref}
      className={classNames(
        'px-content py-control text-caption font-semibold text-text-secondary',
        className,
      )}
    />
  );
});

export const SelectSeparator = forwardRef<
  ElementRef<typeof SelectPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(function SelectSeparator({ className, ...props }, ref) {
  return (
    <SelectPrimitive.Separator
      {...props}
      ref={ref}
      className={classNames('my-compact h-px bg-border-subtle', className)}
    />
  );
});
