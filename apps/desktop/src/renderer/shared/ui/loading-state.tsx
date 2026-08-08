import { Loading } from '@game-guide-hub/ui';

export function LoadingState() {
  return (
    <div className="flex min-h-80 items-center justify-center">
      <Loading label="页面加载中" size="large" />
    </div>
  );
}
