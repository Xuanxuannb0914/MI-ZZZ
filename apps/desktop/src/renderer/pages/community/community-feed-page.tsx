import { Heart, Radio, Zap } from '@game-guide-hub/icons';
import { useState } from 'react';
import { communityPosts } from '../../shared/content';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';

export default function CommunityFeedPage() {
  const [likedPostIds, setLikedPostIds] = useState<readonly string[]>([]);
  const toggleLike = (postId: string) => {
    setLikedPostIds((current) =>
      current.includes(postId) ? current.filter((id) => id !== postId) : [...current, postId],
    );
  };
  return (
    <PageTransition>
      <Page className="page-surface">
        <header className="flex flex-col gap-panel lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-caption font-semibold text-content-electric">绳网</p>
            <h1 className="mt-control text-title1 font-semibold">来自新艾利都的实时信号</h1>
            <p className="mt-compact max-w-2xl text-body text-text-secondary">
              攻略、配队、抽卡记录与讨论以更轻量的内容流呈现，不把社区做成传统论坛列表。
            </p>
          </div>
          <button
            type="button"
            disabled
            title="发布功能即将接入"
            className="ggh-button ggh-button-secondary inline-flex h-control items-center justify-center gap-compact px-panel text-label font-semibold"
          >
            <Zap aria-hidden="true" size={16} />
            发布内容（即将开放）
          </button>
        </header>
        <nav className="page-tabs" aria-label="绳网分类">
          {['推荐', '攻略', '配队', '抽卡记录', '心得'].map((label, index) => (
            <button
              key={label}
              type="button"
              aria-pressed={index === 0}
              className={index === 0 ? 'is-active' : undefined}
            >
              {label}
            </button>
          ))}
        </nav>
        <section
          className="mx-auto max-w-reading divide-y divide-border-subtle border-y border-border-subtle"
          aria-label="绳网推荐内容"
        >
          {communityPosts.map((post) => {
            const isLiked = likedPostIds.includes(post.id);
            return (
              <article key={post.id} className="py-layout">
                <div className="flex items-center gap-content text-caption">
                  <span
                    className="ggh-icon-container size-control rounded-full text-label font-semibold"
                    aria-hidden="true"
                  >
                    {post.avatarLabel}
                  </span>
                  <span className="font-semibold text-text-primary">{post.author}</span>
                  <span className="text-text-tertiary">{post.publishedAt}</span>
                  <span className="ml-auto text-content-electric">{post.kind}</span>
                </div>
                <h2 className="mt-panel text-title2 font-semibold text-text-primary">
                  {post.title}
                </h2>
                <p className="mt-content text-body leading-relaxed text-text-secondary">
                  {post.excerpt}
                </p>
                <div className="mt-panel flex flex-wrap gap-compact">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-content py-compact text-caption text-content-electric"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <footer className="mt-panel flex items-center gap-panel text-caption text-text-tertiary">
                  <button
                    type="button"
                    onClick={() => toggleLike(post.id)}
                    aria-pressed={isLiked}
                    className={
                      isLiked
                        ? 'inline-flex items-center gap-compact text-content-electric'
                        : 'inline-flex items-center gap-compact hover:text-text-primary'
                    }
                  >
                    <Heart aria-hidden="true" size={15} fill={isLiked ? 'currentColor' : 'none'} />
                    {post.likeCount + (isLiked ? 1 : 0)}
                  </button>
                  <span className="inline-flex items-center gap-compact">
                    <Radio aria-hidden="true" size={15} />
                    {post.commentCount}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-compact">
                    <Radio aria-hidden="true" size={15} />
                    绳网信号
                  </span>
                </footer>
              </article>
            );
          })}
        </section>
      </Page>
    </PageTransition>
  );
}
