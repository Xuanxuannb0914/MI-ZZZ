import { ChevronRight } from '@game-guide-hub/icons';
import { Link } from 'react-router-dom';

interface SectionTitleProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly actionLabel?: string;
  readonly actionTo?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
}: SectionTitleProps) {
  return (
    <div className="flex items-end justify-between gap-panel">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-caption font-semibold text-content-electric">{eyebrow}</p>
        ) : null}
        <h2 className="text-title2 font-semibold text-text-primary">{title}</h2>
        {description ? (
          <p className="mt-compact text-body text-text-secondary">{description}</p>
        ) : null}
      </div>
      {actionLabel && actionTo ? (
        <Link
          className="inline-flex shrink-0 items-center gap-compact text-label font-medium text-text-secondary transition-colors hover:text-text-primary"
          to={actionTo}
        >
          {actionLabel}
          <ChevronRight aria-hidden="true" size={16} />
        </Link>
      ) : null}
    </div>
  );
}
