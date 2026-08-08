import type { LucideIcon } from '@game-guide-hub/icons';
import { ChevronRight } from '@game-guide-hub/icons';
import { Link } from 'react-router-dom';

interface GameCardProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly to: string;
}

export function GameCard({ icon: Icon, title, description, to }: GameCardProps) {
  return (
    <Link
      to={to}
      className="group flex min-h-28 items-center gap-panel rounded-lg border border-border-subtle bg-surface-1 p-panel shadow-level-1 transition-[border-color,background-color] hover:border-border-strong hover:bg-surface-2"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-content-electric text-on-action-primary">
        <Icon aria-hidden="true" size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-label font-semibold">{title}</strong>
        <span className="mt-compact block text-caption text-text-secondary">{description}</span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="text-text-tertiary transition-transform group-hover:translate-x-0.5"
        size={18}
      />
    </Link>
  );
}
