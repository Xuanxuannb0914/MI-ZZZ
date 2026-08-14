import { classNames } from '@game-guide-hub/utils';
import type { ReactNode } from 'react';

export interface BannerProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly artwork?: string;
  readonly children?: ReactNode;
  readonly className?: string;
}

export function Banner({ eyebrow, title, description, artwork, children, className }: BannerProps) {
  return (
    <section className={classNames('ggh-banner ggh-glass glass-medium', className)}>
      {artwork ? (
        <img className="ggh-banner-artwork" src={artwork} alt="" width="1920" height="640" />
      ) : null}
      <div className="ggh-banner-scrim" aria-hidden="true" />
      <div className="ggh-banner-content">
        {eyebrow ? <p className="ggh-banner-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="ggh-banner-description">{description}</p> : null}
        {children ? <div className="ggh-banner-actions">{children}</div> : null}
      </div>
    </section>
  );
}
