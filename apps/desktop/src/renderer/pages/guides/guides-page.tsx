import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../app/stores/app-store';
import type { GuideCategory } from '../../entities/guide/model/types';
import { guideCategories } from '../../entities/guide/model/types';
import { GuideCard } from '../../entities/guide/ui/guide-card';
import { guides } from '../../shared/content';
import { EmptyState } from '../../shared/ui/empty-state';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { SearchBar } from '../../shared/ui/search-bar';

type CategoryFilter = GuideCategory | '全部';

export default function GuidesPage() {
  const [params] = useSearchParams();
  const searchKeyword = useAppStore((state) => state.searchKeyword);
  const setSearchKeyword = useAppStore((state) => state.setSearchKeyword);
  const requestedCategory = params.get('category');
  const initialCategory: CategoryFilter = guideCategories.some((item) => item === requestedCategory)
    ? (requestedCategory as CategoryFilter)
    : '全部';
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const normalizedKeyword = searchKeyword.trim().toLowerCase();
  const filteredGuides = guides.filter(
    (guide) =>
      (category === '全部' || guide.category === category) &&
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
        <fieldset className="flex flex-wrap gap-compact">
          <legend className="sr-only">按分类筛选攻略</legend>
          {guideCategories.map((guideCategory) => (
            <button
              key={guideCategory}
              type="button"
              onClick={() => setCategory(guideCategory)}
              className={
                category === guideCategory
                  ? 'h-control rounded-full bg-content-electric px-panel text-label font-semibold text-on-action-primary'
                  : 'h-control rounded-full border border-border-subtle bg-surface-1 px-panel text-label text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary'
              }
            >
              {guideCategory}
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
              setCategory('全部');
            }}
          />
        )}
      </Page>
    </PageTransition>
  );
}
