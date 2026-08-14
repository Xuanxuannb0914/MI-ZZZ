import { Check, ChevronLeft, Film, Sparkles } from '@game-guide-hub/icons';
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../app/stores/app-store';
import { findGuideById, guides, resolveContentLinks } from '../../shared/content';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { GuideHeader } from './components/guide-header';
import { GuideMeta } from './components/guide-meta';
import { GuideSection } from './components/guide-section';
import { GuideToc } from './components/guide-toc';
import { RelatedGuides } from './components/related-guides';

export default function GuideDetailPage() {
  const { id } = useParams();
  const guide = id ? findGuideById(id) : undefined;
  const [shareLabel, setShareLabel] = useState('分享攻略');
  const favoriteGuideIds = useAppStore((state) => state.favoriteGuideIds);
  const toggleFavoriteGuide = useAppStore((state) => state.toggleFavoriteGuide);
  const recordGuideVisit = useAppStore((state) => state.recordGuideVisit);

  if (!guide) return <Navigate replace to="/zzz/guides" />;

  const isFavorite = favoriteGuideIds.includes(guide.id);
  const relatedGuides = guides
    .filter((candidate) => candidate.id !== guide.id && candidate.category === guide.category)
    .slice(0, 3);
  const entityLinks = resolveContentLinks(guide).slice(0, 8);

  const shareGuide = async () => {
    recordGuideVisit(guide.id);
    const shareUrl = `${window.location.origin}${window.location.pathname}#/guide/${guide.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareLabel('链接已复制');
    } catch {
      setShareLabel('已生成分享链接');
    }
  };

  return (
    <PageTransition>
      <Page className="page-surface page-guide-detail max-w-app guide-reading-page">
        <Link to="/zzz/guides" className="guide-back-link">
          <ChevronLeft aria-hidden="true" size={17} />
          返回攻略中心
        </Link>
        <GuideHeader
          guide={guide}
          isFavorite={isFavorite}
          shareLabel={shareLabel}
          onToggleFavorite={() => toggleFavoriteGuide(guide.id)}
          onShare={shareGuide}
        />

        <div className="guide-reading-layout">
          <aside className="guide-reading-toc-rail">
            <GuideToc sections={guide.sections} />
          </aside>

          <article className="guide-reading-article">
            <GuideMeta guide={guide} />

            <section className="guide-summary" aria-labelledby="guide-summary-title">
              <div className="guide-summary__heading">
                <span className="ggh-icon-container ggh-icon-container-accent" aria-hidden="true">
                  <Sparkles size={16} />
                </span>
                <div>
                  <p>编辑摘要</p>
                  <h2 id="guide-summary-title">先做对关键决策，再优化上限</h2>
                </div>
              </div>
              <p>
                这篇攻略将复杂的版本信息拆成可执行的步骤，适合收藏后在游戏内逐项核对。所有内容均为本地
                Mock，实际数据请以游戏内公告为准。
              </p>
            </section>

            {entityLinks.length ? (
              <section className="guide-entity-links" aria-labelledby="guide-entities-title">
                <div>
                  <p>知识网络</p>
                  <h2 id="guide-entities-title">文中关联实体</h2>
                </div>
                <div>
                  {entityLinks.map((entity) => (
                    <Link
                      key={`${entity.type}-${entity.id}`}
                      to={entity.to}
                      className="article-entity-link"
                    >
                      <span>
                        {entity.type === 'agent'
                          ? '角色'
                          : entity.type === 'guide'
                            ? '攻略'
                            : entity.type}
                      </span>
                      {entity.title}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {guide.sections.map((section, index) => (
              <GuideSection key={section.id} section={section} index={index} />
            ))}

            <section className="guide-video" aria-labelledby="guide-video-title">
              <div className="guide-video__heading">
                <span
                  className="ggh-icon-container ggh-icon-container-secondary"
                  aria-hidden="true"
                >
                  <Film size={16} />
                </span>
                <div>
                  <p>演示素材</p>
                  <h2 id="guide-video-title">视频讲解（即将上线）</h2>
                </div>
              </div>
              <div className="guide-video-placeholder" role="img" aria-label="视频演示占位区域">
                <Film aria-hidden="true" size={28} />
                <span>将支持章节跳转与训练场演示</span>
              </div>
            </section>

            <section className="guide-future-note" aria-labelledby="guide-comments-title">
              <h2 id="guide-comments-title">评论区（即将上线）</h2>
              <p>未来将支持绳匠分享实战数据、补充版本差异与讨论路线。</p>
            </section>
          </article>

          <aside className="guide-reading-side-rail">
            <RelatedGuides guides={relatedGuides} />
            <div className="guide-offline-status">
              <Check aria-hidden="true" className="mt-compact shrink-0 text-success" size={14} />
              本地内容已缓存，可在无网络环境下继续阅读。
            </div>
          </aside>
        </div>
      </Page>
    </PageTransition>
  );
}
