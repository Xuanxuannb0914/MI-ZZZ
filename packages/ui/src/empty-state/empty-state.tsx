import type { LucideIcon } from '@game-guide-hub/icons';
import { classNames } from '@game-guide-hub/utils';
import type { ReactNode } from 'react';
import { Button } from '../button/button';
import { IconContainer } from '../icon-container/icon-container';

export interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly secondaryAction?: ReactNode;
  readonly className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <section className={classNames('ggh-empty-state ggh-glass glass-light', className)}>
      <div>
        <IconContainer className="mx-auto" tone="secondary">
          <Icon aria-hidden="true" size={18} />
        </IconContainer>
        <h2 className="mt-content text-title3 font-semibold text-text-primary">{title}</h2>
        <p className="mt-compact max-w-reading text-body text-text-secondary">{description}</p>
        {actionLabel && onAction ? (
          <Button className="mt-panel" variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
        {secondaryAction}
      </div>
    </section>
  );
}
