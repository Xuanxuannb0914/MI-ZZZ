import { ArrowUpRight, Search } from '@game-guide-hub/icons';
import { Card, EmptyState, Tabs } from '@game-guide-hub/ui';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../app/stores/app-store';
import { searchLocal } from '../../shared/search/search-index';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { SearchBar } from '../../shared/ui/search-bar';
import { Tag } from '../../shared/ui/tag';

const filters = ['全部', '角色', '攻略', '活动', '资讯', '驱动盘', '音擎', '版本'] as const;
type SearchFilter = (typeof filters)[number];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const searchKeyword = useAppStore((state) => state.searchKeyword);
  const setSearchKeyword = useAppStore((state) => state.setSearchKeyword);
  const query = params.get('q') ?? searchKeyword;
  const [filter, setFilter] = useState<SearchFilter>('全部');

  useEffect(() => {
    if (params.get('q') !== searchKeyword && searchKeyword)
      setParams({ q: searchKeyword }, { replace: true });
  }, [params, searchKeyword, setParams]);

  const results = useMemo(() => {
    const localResults = searchLocal(query);
    return filter === '全部'
      ? localResults
      : localResults.filter((result) => result.kind === filter);
  }, [filter, query]);

  return (
    <PageTransition>
      <Page className="page-surface page-search">
        <header className="flex flex-col gap-panel lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-caption font-semibold text-content-electric">本地资料库</p>
            <h1 className="mt-control text-title1 font-semibold">全局搜索</h1>
            <p className="mt-compact text-body text-text-secondary">
              在角色、攻略、活动与版本资讯之间快速定位。
            </p>
          </div>
          <SearchBar
            value={searchKeyword}
            onChange={setSearchKeyword}
            placeholder="搜索角色、攻略、活动、资讯..."
            label="搜索本地资料"
            className="w-full lg:max-w-lg"
            onKeyDown={(event) => {
              if (event.key === 'Enter') setParams({ q: searchKeyword }, { replace: true });
            }}
          />
        </header>
        <Tabs
          items={filters.map((item) => ({ value: item, label: item }))}
          value={filter}
          onValueChange={setFilter}
          label="搜索类型筛选"
        />
        {results.length ? (
          <div className="grid gap-content xl:grid-cols-2">
            {results.map((result) => (
              <Link key={result.id} to={result.to} className="group block">
                <Card interactive className="flex items-start gap-content">
                  <span className="ggh-icon-container" aria-hidden="true">
                    <Search size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-control">
                      <strong className="truncate text-label">{result.title}</strong>
                      <Tag>{result.kind}</Tag>
                    </span>
                    <span className="mt-compact block line-clamp-2 text-caption text-text-secondary">
                      {result.description}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="shrink-0 text-text-tertiary transition-colors group-hover:text-content-electric"
                    size={16}
                  />
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title={query ? '没有匹配内容' : '输入关键词开始搜索'}
            description={
              query
                ? '试试角色名、攻略分类、活动名称或材料名称。'
                : '本地资料库支持角色、攻略、活动、资讯、音擎和驱动盘。'
            }
            {...(query
              ? {
                  actionLabel: '清除搜索',
                  onAction: () => {
                    setSearchKeyword('');
                    setParams({}, { replace: true });
                  },
                }
              : {})}
          />
        )}
      </Page>
    </PageTransition>
  );
}
