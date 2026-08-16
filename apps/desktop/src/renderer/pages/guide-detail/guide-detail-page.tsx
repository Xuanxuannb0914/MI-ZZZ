import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronLeft,
  Film,
  Heart,
  History,
  List,
  Share2,
  Sparkles,
} from '@game-guide-hub/icons';
import { Banner, Button, Card, ScrollArea } from '@game-guide-hub/ui';
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../app/stores/app-store';
import { findGuideById, guides, resolveContentLinks } from '../../shared/content';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { Tag } from '../../shared/ui/tag';

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
      <Page className="page-surface page-guide-detail max-w-app">
        <Link
          to="/zzz/guides"
          className="inline-flex min-h-control items-center gap-compact text-label text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft aria-hidden="true" size={17} />
          返回攻略中心
        </Link>
        <Banner
          className="mt-panel"
          artwork={guide.cover}
          eyebrow={`${guide.category} · ${guide.difficulty} · ${guide.readTime} 分钟阅读`}
          title={guide.title}
          description={guide.summary}
        >
          <Button
            variant={isFavorite ? 'primary' : 'secondary'}
            onClick={() => toggleFavoriteGuide(guide.id)}
            aria-pressed={isFavorite}
          >
            <Heart aria-hidden="true" size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? '已收藏' : '收藏'}
          </Button>
          <Button variant="secondary" onClick={shareGuide}>
            <Share2 aria-hidden="true" size={16} />
            {shareLabel}
          </Button>
        </Banner>

        <div className="grid gap-layout xl:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="min-w-0 space-y-layout">
            <div className="flex flex-wrap items-center gap-content text-caption text-text-tertiary">
              <span className="inline-flex items-center gap-compact">
                <BookOpen aria-hidden="true" size={15} />
                作者：{guide.author}
              </span>
              <span className="inline-flex items-center gap-compact">
                <History aria-hidden="true" size={15} />
                更新于 {guide.updatedAt}
              </span>
              {guide.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>

            <Card className="space-y-panel" glass="light">
              <div className="flex items-center gap-content">
                <span className="ggh-icon-container ggh-icon-container-accent" aria-hidden="true">
                  <Sparkles size={16} />
                </span>
                <div>
                  <p className="text-caption text-text-tertiary">编辑摘要</p>
                  <h2 className="text-title2 font-semibold">先做对关键决策，再优化上限</h2>
                </div>
              </div>
              <p className="text-body text-text-secondary">
                这篇攻略将复杂的版本信息拆成可执行的步骤，适合收藏后在游戏内逐项核对。所有内容均为本地
                Mock，实际数据请以游戏内公告为准。
              </p>
            </Card>

            {entityLinks.length ? (
              <Card className="space-y-content" glass="medium">
                <div>
                  <p className="text-caption text-content-electric">知识网络</p>
                  <h2 className="mt-compact text-title2 font-semibold">文中关联实体</h2>
                </div>
                <div className="flex flex-wrap gap-control">
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
              </Card>
            ) : null}

            {guide.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-layout space-y-content"
              >
                <h2 className="flex items-center gap-control text-title2 font-semibold">
                  <span className="text-content-electric">/</span>
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-reading text-body leading-relaxed text-text-secondary"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            <Card className="space-y-content" glass="medium">
              <div className="flex items-center gap-content">
                <span
                  className="ggh-icon-container ggh-icon-container-secondary"
                  aria-hidden="true"
                >
                  <Film size={16} />
                </span>
                <div>
                  <p className="text-caption text-text-tertiary">演示素材</p>
                  <h2 className="text-title2 font-semibold">视频讲解（即将上线）</h2>
                </div>
              </div>
              <div className="guide-video-placeholder" role="img" aria-label="视频演示占位区域">
                <Film aria-hidden="true" size={28} />
                <span>将支持章节跳转与训练场演示</span>
              </div>
            </Card>

            <Card className="space-y-content" glass="light">
              <h2 className="text-title2 font-semibold">评论区（即将上线）</h2>
              <p className="text-body text-text-secondary">
                未来将支持绳匠分享实战数据、补充版本差异与讨论路线。
              </p>
            </Card>
          </article>

          <aside className="min-w-0 space-y-panel xl:sticky xl:top-[calc(var(--spacing-app-header)+var(--spacing-panel))] xl:self-start">
            <Card glass="strong" className="space-y-content">
              <div className="flex items-center gap-control">
                <List aria-hidden="true" className="text-content-electric" size={17} />
                <h2 className="text-label font-semibold">目录</h2>
              </div>
              <ScrollArea label="攻略目录" className="max-h-64 space-y-compact pr-compact">
                {guide.sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex min-h-control items-center gap-content rounded-md px-content text-caption text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                  >
                    <span className="text-content-electric">0{index + 1}</span>
                    {section.title}
                  </a>
                ))}
              </ScrollArea>
            </Card>

            <Card glass="light" className="space-y-content">
              <h2 className="text-label font-semibold">相关攻略</h2>
              <div className="space-y-control">
                {relatedGuides.map((related) => (
                  <Link
                    key={related.id}
                    to={`/zzz/guides/${related.id}`}
                    className="group flex items-start gap-control rounded-md border border-border-subtle p-content hover:bg-surface-2"
                  >
                    <span className="mt-compact text-content-electric">↗</span>
                    <span className="min-w-0">
                      <strong className="block truncate text-caption text-text-primary">
                        {related.title}
                      </strong>
                      <small className="mt-compact block text-caption text-text-tertiary">
                        {related.readTime} 分钟 · {related.updatedAt}
                      </small>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="ml-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      size={14}
                    />
                  </Link>
                ))}
              </div>
            </Card>

            <div className="flex items-start gap-control text-caption text-text-tertiary">
              <Check aria-hidden="true" className="mt-compact shrink-0 text-success" size={14} />
              本地内容已缓存，可在无网络环境下继续阅读。
            </div>
          </aside>
        </div>
      </Page>
    </PageTransition>
  );
}
