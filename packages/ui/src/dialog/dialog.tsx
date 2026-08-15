import { classNames } from '@game-guide-hub/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export type DialogContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content>;

export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(function DialogContent({ className, children, ...props }, ref) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={classNames(
          'fixed inset-0 z-[var(--z-overlay)] bg-canvas/70 backdrop-blur-sm transition-opacity duration-(--ggh-motion-normal)',
          'data-[state=open]:opacity-100 data-[state=closed]:opacity-0',
        )}
      />
      <DialogPrimitive.Content
        {...props}
        ref={ref}
        className={classNames(
          'fixed left-1/2 top-1/2 z-[var(--z-dialog)] max-h-[calc(100dvh-2rem)] w-full max-w-dialog -translate-x-1/2 -translate-y-1/2 overflow-y-auto',
          'ggh-glass glass-strong rounded-xl p-section text-text-primary shadow-level-3',
          'focus-visible:outline-none',
          className,
        )}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      {...props}
      ref={ref}
      className={classNames('text-title3 font-semibold text-text-primary', className)}
    />
  );
});

export const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      {...props}
      ref={ref}
      className={classNames('mt-control text-body text-text-secondary', className)}
    />
  );
});
