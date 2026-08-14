import { classNames } from '@game-guide-hub/utils';
import type { ImgHTMLAttributes } from 'react';

export type ImageFrameVariant = 'banner' | 'cover' | 'avatar' | 'thumbnail' | 'background';

export interface ImageFrameProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  readonly alt: string;
  readonly variant?: ImageFrameVariant;
  readonly frameClassName?: string;
}

const aspectClasses: Record<ImageFrameVariant, string> = {
  banner: 'aspect-[16/7]',
  cover: 'aspect-[4/5]',
  avatar: 'aspect-square rounded-full',
  thumbnail: 'aspect-[16/10]',
  background: 'aspect-video',
};

export function ImageFrame({
  variant = 'thumbnail',
  frameClassName,
  className,
  alt,
  loading = 'lazy',
  ...props
}: ImageFrameProps) {
  return (
    <span className={classNames('ggh-image-frame', aspectClasses[variant], frameClassName)}>
      <img {...props} alt={alt} loading={loading} className={className} />
    </span>
  );
}
