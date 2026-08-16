import { Check, Clipboard, Copy, RefreshCw, Shield, Sparkles } from '@game-guide-hub/icons';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStarRailGachaLink } from '../../shared/hooks/use-star-rail-gacha-link';
import { PageTransition } from '../../shared/ui/page-transition';

export default function StarRailGachaPage() {
  const navigate = useNavigate();
  const { status, message, progress, result, copied, acquire, copyLink, reset } =
    useStarRailGachaLink();

  const handleAcquire = useCallback(() => {
    void acquire();
  }, [acquire]);

  const handleCopy = useCallback(() => {
    void copyLink();
  }, [copyLink]);

  const handleContinueImport = useCallback(() => {
    // 仅把来源标记为本地缓存链接，交由后续导入管线处理，不在此发起网络请求。
    navigate('/zzz/gacha');
  }, [navigate]);

  return (
    <PageTransition>
      <main className="starrail-gacha-page">
        <div className="starrail-gacha-glow" aria-hidden="true" />
        <section className="starrail-gacha-panel" aria-labelledby="starrail-gacha-title">
          <span className="starrail-gacha-icon" aria-hidden="true">
            <Sparkles size={22} />
          </span>
          <p className="starrail-gacha-kicker">崩坏：星穹铁道 · 本地抽卡数据</p>
          <h1 id="starrail-gacha-title">抽卡数据同步</h1>
          <p className="starrail-gacha-desc">
            自动读取本机游戏缓存
            <br />
            不联网 · 不上传 · 本地处理
          </p>

          {status === 'idle' ? <IdleView onAcquire={handleAcquire} /> : null}
          {status === 'scanning' ? <ScanningView progress={progress} /> : null}
          {status === 'success' ? (
            <SuccessView
              candidateCount={result?.candidateCount ?? 0}
              copied={copied}
              onCopy={handleCopy}
              onContinue={handleContinueImport}
              onReset={reset}
            />
          ) : null}
          {status === 'error' ? <ErrorView message={message} onRetry={handleAcquire} /> : null}

          <footer className="starrail-gacha-privacy">
            <Shield aria-hidden="true" size={13} />
            链接仅在本机内存中处理，不会保存或上传任何凭据
          </footer>
        </section>
      </main>
    </PageTransition>
  );
}

function IdleView({ onAcquire }: { readonly onAcquire: () => void }) {
  return (
    <button type="button" className="starrail-gacha-acquire" onClick={onAcquire}>
      <Clipboard aria-hidden="true" size={16} />
      获取抽卡记录
    </button>
  );
}

function ScanningView({ progress }: { readonly progress: string }) {
  return (
    <div className="starrail-gacha-scanning" role="status" aria-live="polite">
      <RefreshCw className="starrail-gacha-spin" aria-hidden="true" size={18} />
      <p className="starrail-gacha-scan-text">{progress || '正在定位缓存目录'}</p>
      <div className="starrail-gacha-progress" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}

function SuccessView({
  candidateCount,
  copied,
  onCopy,
  onContinue,
  onReset,
}: {
  readonly candidateCount: number;
  readonly copied: boolean;
  readonly onCopy: () => void;
  readonly onContinue: () => void;
  readonly onReset: () => void;
}) {
  return (
    <div className="starrail-gacha-success">
      <span className="starrail-gacha-success-icon" aria-hidden="true">
        <Check size={20} />
      </span>
      <p className="starrail-gacha-success-title">已在本机找到抽卡记录链接</p>
      <p className="starrail-gacha-success-note">该链接可能包含临时认证信息，请勿分享给他人。</p>
      {candidateCount > 0 ? (
        <p className="starrail-gacha-success-count">
          发现 {candidateCount} 个候选链接，已选择最新链接
        </p>
      ) : null}
      <div className="starrail-gacha-success-actions">
        <button type="button" className="starrail-gacha-button" onClick={onCopy}>
          <Copy aria-hidden="true" size={15} />
          {copied ? '已复制' : '复制链接'}
        </button>
        <button
          type="button"
          className="starrail-gacha-button starrail-gacha-button-primary"
          onClick={onContinue}
        >
          <Clipboard aria-hidden="true" size={15} />
          继续导入
        </button>
        <button
          type="button"
          className="starrail-gacha-button starrail-gacha-button-quiet"
          onClick={onReset}
        >
          重新获取
        </button>
      </div>
    </div>
  );
}

function ErrorView({
  message,
  onRetry,
}: {
  readonly message: string;
  readonly onRetry: () => void;
}) {
  return (
    <div className="starrail-gacha-error">
      <p className="starrail-gacha-error-text">{message}</p>
      <button type="button" className="starrail-gacha-button" onClick={onRetry}>
        <RefreshCw aria-hidden="true" size={15} />
        重试
      </button>
    </div>
  );
}
