import { classNames } from '@game-guide-hub/utils';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

export interface AvatarProps {
  readonly src?: string;
  readonly alt: string;
  readonly fallback: string;
  readonly className?: string;
}

export function Avatar({ src, alt, fallback, className }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={classNames(
        'inline-flex size-avatar shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-2',
        className,
      )}
    >
      <AvatarPrimitive.Image className="size-full object-cover" src={src} alt={alt} />
      <AvatarPrimitive.Fallback
        className="flex size-full items-center justify-center text-caption font-medium text-text-secondary"
        delayMs={200}
      >
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
