import { Sparkles } from '@game-guide-hub/icons';
import type { ReactNode } from 'react';

interface GuideCalloutProps {
  readonly title: string;
  readonly children: ReactNode;
}

export function GuideCallout({ title, children }: GuideCalloutProps) {
  return (
    <aside className="guide-callout" aria-label={title}>
      <Sparkles aria-hidden="true" size={16} />
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </aside>
  );
}
