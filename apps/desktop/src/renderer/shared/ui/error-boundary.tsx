import { AlertCircle, RotateCcw } from '@game-guide-hub/icons';
import { Button, Card } from '@game-guide-hub/ui';
import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react';

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(_error: Error, _info: ErrorInfo): void {
    // Renderer errors remain local so Electron can keep the workspace recoverable.
  }

  public override render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    return <PageError onRetry={() => this.setState({ hasError: false })} />;
  }
}

export function PageError({ onRetry }: { readonly onRetry: () => void }) {
  return <main className="page-error-state"><Card glass="strong" className="max-w-lg text-center"><span className="ggh-icon-container ggh-icon-container-secondary mx-auto" aria-hidden="true"><AlertCircle size={22} /></span><h1 className="mt-panel text-title2 font-semibold">页面暂时无法显示</h1><p className="mt-compact text-body text-text-secondary">请重试，或返回其他资料页面继续浏览。本地内容与收藏记录不会丢失。</p><Button className="mt-panel" onClick={onRetry}><RotateCcw size={16} />重新加载</Button></Card></main>;
}
