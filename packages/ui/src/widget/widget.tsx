import type { LucideIcon } from '@game-guide-hub/icons';
import { classNames } from '@game-guide-hub/utils';
import type { ReactNode } from 'react';
import { useId } from 'react';
import { IconContainer } from '../icon-container/icon-container';

export interface WidgetProps {
  readonly title: string;
  readonly eyebrow: string;
  readonly icon: LucideIcon;
  readonly action?: ReactNode;
  readonly className?: string;
  readonly children: ReactNode;
}

export function Widget({ title, eyebrow, icon: Icon, action, className, children }: WidgetProps) {
  const titleId = useId();

  return (
    <section
      className={classNames('ggh-widget ggh-glass glass-medium', className)}
      aria-labelledby={titleId}
    >
      <header className="ggh-widget-header">
        <IconContainer className="ggh-widget-icon">
          <Icon aria-hidden="true" size={16} />
        </IconContainer>
        <span className="ggh-widget-heading">
          <small>{eyebrow}</small>
          <strong id={titleId}>{title}</strong>
        </span>
        {action ? <span className="ggh-widget-action">{action}</span> : null}
      </header>
      <div className="ggh-widget-body">{children}</div>
    </section>
  );
}
