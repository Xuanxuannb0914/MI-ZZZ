import { Bookmark, Heart, Radio, Trash2, Zap } from '@game-guide-hub/icons';
import { useState } from 'react';
import { type CommunityPost, communityPosts } from '../../shared/content';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';

export default function CommunityFeedPage() {
  const [likedPostIds, setLikedPostIds] = useState<readonly string[]>([]);
  const [favoritePostIds, setFavoritePostIds] = useState<readonly string[]>([]);
  const [activeCategory, setActiveCategory] = useState<'推荐' | CommunityPost['kind']>('推荐');
  const [posts, setPosts] = useState<readonly CommunityPost[]>(communityPosts);
  const [isComposing, setIsComposing] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftExcerpt, setDraftExcerpt] = useState('');
  const toggleLike = (postId: string) => {
    setLikedPostIds((current) =>
      current.includes(postId) ? current.filter((id) => id !== postId) : [...current, postId],
    );
  };
  const publishPost = () => {
    const title = draftTitle.trim();
    const excerpt = draftExcerpt.trim();
    if (!title || !excerpt) return;
    setPosts((current) => [
      {
        id: `local-${Date.now()}`,
        author: '访客绳匠',
        avatarLabel: '访',
        kind: '心得',
        title,
        excerpt,
        tags: ['本地发布'],
        publishedAt: '刚刚',
        likeCount: 0,
        commentCount: 0,
      },
      ...current,
    ]);
    setDraftTitle('');
    setDraftExcerpt('');
    setIsComposing(false);
    setActiveCategory('推荐');
  };
  const visiblePosts =
    activeCategory === '推荐' ? posts : posts.filter((post) => post.kind === activeCategory);
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
            onClick={() => setIsComposing((current) => !current)}
            className="ggh-button ggh-button-secondary inline-flex h-control items-center justify-center gap-compact px-panel text-label font-semibold"
          >
            <Zap aria-hidden="true" size={16} />
            发布内容
          </button>
        </header>
        <nav className="page-tabs" aria-label="绳网分类">
          {(['推荐', '攻略', '配队', '抽卡记录', '心得'] as const).map((label) => (
            <button
              key={label}
              type="button"
              aria-pressed={activeCategory === label}
              className={activeCategory === label ? 'is-active' : undefined}
              onClick={() => setActiveCategory(label)}
            >
              {label}
            </button>
          ))}
        </nav>
        {isComposing ? (
          <section
            className="mx-auto max-w-reading border-y border-border-subtle py-panel"
            aria-label="发布绳网内容"
          >
            <label className="sr-only" htmlFor="community-title">
              帖子标题
            </label>
            <input
              id="community-title"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              placeholder="写下标题"
              className="w-full bg-transparent text-title3 font-semibold text-text-primary outline-none placeholder:text-text-tertiary"
            />
            <label className="sr-only" htmlFor="community-body">
              帖子正文
            </label>
            <textarea
              id="community-body"
              value={draftExcerpt}
              onChange={(event) => setDraftExcerpt(event.target.value)}
              placeholder="分享攻略、配队或游戏心得"
              className="mt-content min-h-24 w-full resize-y bg-transparent text-body text-text-secondary outline-none placeholder:text-text-tertiary"
            />
            <div className="mt-content flex justify-end gap-content">
              <button
                type="button"
                className="ggh-button ggh-button-quiet h-control px-panel text-label"
                onClick={() => setIsComposing(false)}
              >
                取消
              </button>
              <button
                type="button"
                className="ggh-button ggh-button-primary h-control px-panel text-label"
                disabled={!draftTitle.trim() || !draftExcerpt.trim()}
                onClick={publishPost}
              >
                发布
              </button>
            </div>
          </section>
        ) : null}
        <section
          className="mx-auto max-w-reading divide-y divide-border-subtle border-y border-border-subtle"
          aria-label="绳网推荐内容"
        >
          {visiblePosts.map((post) => {
            const isLiked = likedPostIds.includes(post.id);
            const isFavorite = favoritePostIds.includes(post.id);
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
                  <button
                    type="button"
                    aria-label={`收藏 ${post.title}`}
                    aria-pressed={isFavorite}
                    onClick={() =>
                      setFavoritePostIds((current) =>
                        current.includes(post.id)
                          ? current.filter((id) => id !== post.id)
                          : [...current, post.id],
                      )
                    }
                    className={isFavorite ? 'text-content-electric' : 'hover:text-text-primary'}
                  >
                    <Bookmark
                      aria-hidden="true"
                      size={15}
                      fill={isFavorite ? 'currentColor' : 'none'}
                    />
                  </button>
                  {post.author === '访客绳匠' ? (
                    <button
                      type="button"
                      aria-label={`删除 ${post.title}`}
                      onClick={() =>
                        setPosts((current) => current.filter((item) => item.id !== post.id))
                      }
                      className="hover:text-danger"
                    >
                      <Trash2 aria-hidden="true" size={15} />
                    </button>
                  ) : null}
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
