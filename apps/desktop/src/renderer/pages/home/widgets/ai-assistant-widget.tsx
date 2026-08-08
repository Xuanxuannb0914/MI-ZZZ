import { Bot, Sparkles } from '@game-guide-hub/icons';
import { memo } from 'react';
import { WidgetShell } from './widget-shell';

const aiCapabilities = ['AI培养建议', 'AI配队分析', 'AI攻略总结'] as const;

export const AiAssistantWidget = memo(function AiAssistantWidget() {
  return (
    <WidgetShell
      title="AI 助手"
      eyebrow="ASTERIS INTELLIGENCE"
      icon={Bot}
      className="workspace-widget-ai"
      action={<span className="workspace-coming-badge">即将上线</span>}
    >
      <div className="workspace-ai-content">
        <span className="workspace-ai-orb" aria-hidden="true">
          <Sparkles size={17} />
        </span>
        <p>基于你的角色库、养成进度与活动目标生成建议，核心智能功能正在准备中。</p>
        <div>
          {aiCapabilities.map((capability) => (
            <span key={capability}>{capability}</span>
          ))}
        </div>
      </div>
    </WidgetShell>
  );
});
