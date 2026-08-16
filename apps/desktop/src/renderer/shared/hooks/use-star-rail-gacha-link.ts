import type { StarRailGachaLinkResult } from '@game-guide-hub/types';
import { useCallback, useState } from 'react';
import { createRequestId } from '../lib/request-id';

export type StarRailGachaStatus = 'idle' | 'scanning' | 'success' | 'error';

export interface StarRailGachaState {
  readonly status: StarRailGachaStatus;
  readonly message: string;
  readonly progress: string;
  readonly result: StarRailGachaLinkResult | null;
  readonly copied: boolean;
}

const initialState: StarRailGachaState = {
  status: 'idle',
  message: '',
  progress: '',
  result: null,
  copied: false,
};

const progressSteps: readonly string[] = [
  '正在定位缓存目录',
  '正在扫描版本目录',
  '正在读取缓存',
  '正在解析抽卡链接',
  '正在验证数据格式',
];

/**
 * React hook that drives the Star Rail local-cache gacha link acquisition.
 * It only talks to the desktop bridge; it never issues a network request.
 */
export function useStarRailGachaLink() {
  const [state, setState] = useState<StarRailGachaState>(initialState);
  const [isScanning, setIsScanning] = useState(false);

  const acquire = useCallback(async (): Promise<StarRailGachaLinkResult> => {
    const bridge = (
      window as unknown as {
        desktop?: { starRail: { getGachaLink(): Promise<StarRailGachaLinkResult> } };
      }
    ).desktop;
    if (!bridge?.starRail || typeof bridge.starRail.getGachaLink !== 'function') {
      const unavailable: StarRailGachaLinkResult = {
        status: 'error',
        candidateCount: 0,
        message: '该功能仅支持桌面端运行，请在 Electron 应用中打开。',
        errorCode: 'unknown',
      };
      setState({
        ...initialState,
        status: 'error',
        message: unavailable.message,
        result: unavailable,
      });
      return unavailable;
    }

    setIsScanning(true);
    setState((current) => ({ ...current, status: 'scanning', progress: progressSteps[0] ?? '' }));

    // Advance the progress hint through the pipeline stages.
    const timer = window.setInterval(() => {
      setState((current) => {
        const index = progressSteps.indexOf(current.progress);
        const next = progressSteps[index + 1];
        return next ? { ...current, progress: next } : current;
      });
    }, 350);

    try {
      const result = await bridge.starRail.getGachaLink();
      window.clearInterval(timer);
      setState({
        status: result.status === 'success' ? 'success' : 'error',
        message: result.message,
        progress: result.status === 'success' ? '复制成功' : '',
        result,
        copied: result.status === 'success',
      });
      return result;
    } finally {
      window.clearInterval(timer);
      setIsScanning(false);
    }
  }, []);

  const copyLink = useCallback(async (): Promise<boolean> => {
    if (!state.result?.link) return false;
    try {
      await navigator.clipboard.writeText(state.result.link);
      setState((current) => ({ ...current, copied: true, message: '已复制到剪贴板' }));
      return true;
    } catch {
      setState((current) => ({ ...current, copied: false, message: '复制失败，请手动复制' }));
      return false;
    }
  }, [state.result]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    isScanning,
    acquire,
    copyLink,
    reset,
    requestId: createRequestId(),
  };
}
