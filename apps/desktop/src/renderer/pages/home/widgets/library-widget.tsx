import { ArrowUpRight, Clock3, Heart } from '@game-guide-hub/icons';
import { Widget as WidgetShell } from '@game-guide-hub/ui';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../../app/stores/app-store';
import { agents, guides } from '../../../shared/content';

export const LibraryWidget = memo(function LibraryWidget() {
  const historyGuideIds = useAppStore((state) => state.historyGuideIds);
  const favoriteGuideIds = useAppStore((state) => state.favoriteGuideIds);
  const favoriteAgentIds = useAppStore((state) => state.favoriteAgentIds);
  const recentGuides = historyGuideIds
    .map((id) => guides.find((guide) => guide.id === id))
    .filter((guide): guide is (typeof guides)[number] => Boolean(guide))
    .slice(0, 2);
  const favoriteAgents = agents.filter((agent) => favoriteAgentIds.includes(agent.id)).slice(0, 2);

  return (
    <WidgetShell
      title="继续浏览"
      eyebrow="本地阅读记录"
      icon={Clock3}
      className="workspace-widget-library"
    >
      <div className="workspace-library-section">
        <div className="workspace-library-heading">
          <span>最近阅读</span>
          <Link to="/zzz/favorites" aria-label="查看最近阅读">
            <ArrowUpRight aria-hidden="true" size={14} />
          </Link>
        </div>
        {recentGuides.length ? (
          recentGuides.map((guide) => (
            <Link key={guide.id} to={`/zzz/guides/${guide.id}`} className="workspace-library-row">
              <span className="workspace-library-copy">
                <strong>{guide.title}</strong>
                <small>
                  {guide.category} · {guide.readTime} 分钟
                </small>
              </span>
              <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          ))
        ) : (
          <p className="workspace-library-empty">打开一篇攻略后会显示在这里。</p>
        )}
      </div>
      <div className="workspace-library-section">
        <div className="workspace-library-heading">
          <span>
            <Heart aria-hidden="true" size={13} /> 收藏
          </span>
          <span className="workspace-library-count">{favoriteGuideIds.length} 篇攻略</span>
        </div>
        <p className="workspace-library-empty">
          {favoriteAgents.length
            ? `已固定 ${favoriteAgents.map((agent) => agent.name).join('、')} 等角色。`
            : '在角色或攻略页点击心形按钮固定常用内容。'}
        </p>
      </div>
    </WidgetShell>
  );
});
