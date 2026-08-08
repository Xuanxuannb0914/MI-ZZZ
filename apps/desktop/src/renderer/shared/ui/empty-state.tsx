import { Search } from '@game-guide-hub/icons';
import { EmptyState as SystemEmptyState } from '@game-guide-hub/ui';

interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <SystemEmptyState
      title={title}
      description={description}
      icon={Search}
      {...(actionLabel && onAction ? { actionLabel, onAction } : {})}
    />
  );
}
