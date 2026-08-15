import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../app/stores/app-store';
import type { Guide } from '../../entities/guide/model/types';
import { GuideCard } from '../../entities/guide/ui/guide-card';
import { guides } from '../../shared/content';
import { EmptyState } from '../../shared/ui/empty-state';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { SearchBar } from '../../shared/ui/search-bar';

type GuideView = '推荐' | '最新' | '新手' | '角色' | '配队' | '养成' | '活动' | '高难';

const guideViews: readonly GuideView[] = [
  '推荐',
  '最新',
  '新手',
  '角色',
  '配队',
  '养成',
  '活动',
  '高难',
];

function matchesGuideView(guide: Guide, view: GuideView) {
  switch (view) {
    case '推荐':
      return guide.isFeatured;
    case '最新':
      return true;
    case '新手':
      return guide.category === '入门';
    case '角色':
      return guide.category === '角色养成';
    case '配队':
      return guide.category === '配队';
    case '养成':
      return guide.category === '角色养成' || guide.category === '资源';
    case '活动':
      return guide.category === '活动';
    case '高难':
      return ['战斗', '挑战', '终局'].includes(guide.category);
  }
}

function toGuideView(category: string | null): GuideView {
  if (category === '入门') return '新手';
  if (category === '角色养成') return '角色';
  if (category === '配队') return '配队';
  if (category === '资源') return '养成';
  if (category === '活动') return '活动';
  if (category === '战斗' || category === '挑战' || category === '终局') return '高难';
  return '推荐';
}

export default function GuidesPage() {
  const [params] = useSearchParams();
  const searchKeyword = useAppStore((state) => state.searchKeyword);
  const setSearchKeyword = useAppStore((state) => state.setSearchKeyword);
  const requestedCategory = params.get('category');
  const [view, setView] = useState<GuideView>(() => toGuideView(requestedCategory));
  const normalizedKeyword = searchKeyword.trim().toLowerCase();
  const filteredGuides = guides.filter(
    (guide) =>
      matchesGuideView(guide, view) &&
      (!normalizedKeyword ||
        `${guide.title} ${guide.summary} ${guide.category}`
          .toLowerCase()
          .includes(normalizedKeyword)),
  );

  return (
    <PageTransition>
      <Page className="page-surface page-guides">
        <header className="flex flex-col gap-panel lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-caption font-semibold text-content-electric">作战手册</p>
            <h1 className="mt-control text-title1 font-semibold">攻略中心</h1>
            <p className="mt-compact text-body text-text-secondary">
              覆盖养成、战斗、配队与版本活动的实用参考。
            </p>
          </div>
          <SearchBar
            value={searchKeyword}
            onChange={setSearchKeyword}
            placeholder="搜索攻略内容"
            label="搜索攻略"
            className="w-full lg:max-w-md"
          />
        </header>
        <fieldset className="page-tabs">
          <legend className="sr-only">按任务筛选攻略</legend>
          {guideViews.map((guideView) => (
            <button
              key={guideView}
              type="button"
              onClick={() => setView(guideView)}
              className={view === guideView ? 'is-active' : undefined}
              aria-pressed={view === guideView}
            >
              {guideView}
            </button>
          ))}
        </fieldset>
        {filteredGuides.length ? (
          <div className="grid gap-content md:grid-cols-2 xl:grid-cols-3">
            {filteredGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="没有找到攻略"
            description="当前搜索和分类下暂无匹配的本地攻略。"
            actionLabel="清除筛选"
            onAction={() => {
              setSearchKeyword('');
              setView('推荐');
            }}
          />
        )}
      </Page>
    </PageTransition>
  );
}
