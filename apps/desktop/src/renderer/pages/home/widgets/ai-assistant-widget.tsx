import { ArrowUpRight, Bot, Check } from '@game-guide-hub/icons';
import { Widget as WidgetShell } from '@game-guide-hub/ui';
import { memo } from 'react';

const capabilities = ['AI 培养建议', 'AI 配队分析', 'AI 攻略总结'] as const;

export const AiAssistantWidget = memo(function AiAssistantWidget() {
  return (
    <WidgetShell title="AI 助手" eyebrow="下一阶段能力" icon={Bot} className="workspace-widget-ai">
      <div className="workspace-ai-content">
        <div>
          <strong>让每一次养成决策都有依据</strong>
          <p>即将接入版本数据、角色 Build 与你的本地收藏，生成可解释的建议。</p>
        </div>
        <span className="workspace-ai-status">敬请期待</span>
      </div>
      <div className="workspace-ai-capabilities">
        {capabilities.map((capability) => (
          <span key={capability}>
            <Check aria-hidden="true" size={14} />
            {capability}
          </span>
        ))}
      </div>
      <button type="button" className="workspace-ai-link" disabled aria-label="AI 助手敬请期待">
        查看能力路线图 <ArrowUpRight aria-hidden="true" size={14} />
      </button>
    </WidgetShell>
  );
});
