import { Search, Wrench } from '@game-guide-hub/icons';
import { Card, EmptyState, Tabs } from '@game-guide-hub/ui';
import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { findRelatedContent, findWEngineById, wEngines } from '../../shared/content';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { SearchBar } from '../../shared/ui/search-bar';
import { Tag } from '../../shared/ui/tag';

const rarities = ['全部', 'S', 'A', 'B'] as const;
type Rarity = (typeof rarities)[number];

export default function WEnginesPage() {
  const { id } = useParams();
  const [rarity, setRarity] = useState<Rarity>('全部');
  const [keyword, setKeyword] = useState('');
  const selected = id ? findWEngineById(id) : undefined;
  const list = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    return wEngines.filter(
      (item) =>
        (rarity === '全部' || item.rarity === rarity) &&
        (!normalized ||
          `${item.name} ${item.specialty} ${item.effect}`.toLowerCase().includes(normalized)),
    );
  }, [keyword, rarity]);
  if (id && !selected) return <Navigate replace to="/zzz/w-engines" />;

  return (
    <PageTransition>
      <Page className="page-surface content-catalog">
        <header className="content-catalog-header">
          <div>
            <p className="text-caption font-semibold text-content-electric">
              装备资料库 · 本地 Mock
            </p>
            <h1 className="mt-control text-title1 font-semibold">音擎中心</h1>
            <p className="mt-compact text-body text-text-secondary">
              根据特性、稀有度与关联角色快速定位培养方案。
            </p>
          </div>
          <SearchBar
            value={keyword}
            onChange={setKeyword}
            placeholder="搜索音擎、特性或效果"
            label="搜索音擎"
            className="w-full lg:max-w-md"
          />
        </header>
        {selected ? <WEngineDetail id={selected.id} /> : null}
        <Tabs
          items={rarities.map((value) => ({
            value,
            label: value === '全部' ? value : `${value} 级`,
          }))}
          value={rarity}
          onValueChange={setRarity}
          label="音擎稀有度筛选"
        />
        {list.length ? (
          <div className="grid gap-content md:grid-cols-2 xl:grid-cols-3">
            {list.map((item) => (
              <Link className="group block" key={item.id} to={`/zzz/w-engines/${item.id}`}>
                <Card interactive className="h-full">
                  <div className="flex gap-content">
                    <span className="ggh-icon-container ggh-icon-container-accent">
                      <Wrench size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap gap-control">
                        <strong className="text-label">{item.name}</strong>
                        <Tag>{item.rarity} 级</Tag>
                      </span>
                      <span className="mt-compact block text-caption text-content-electric">
                        {item.specialty}
                      </span>
                      <span className="mt-control block text-caption text-text-secondary">
                        {item.effect}
                      </span>
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="没有找到音擎"
            description="试试名称、特性或效果关键词。"
            actionLabel="清除搜索"
            onAction={() => {
              setKeyword('');
              setRarity('全部');
            }}
          />
        )}
      </Page>
    </PageTransition>
  );
}

function WEngineDetail({ id }: { readonly id: string }) {
  const item = findWEngineById(id);
  if (!item) return null;
  const related = findRelatedContent('w-engine', id).slice(0, 6);
  return (
    <Card glass="strong" className="content-detail-panel">
      <div className="flex flex-wrap items-start justify-between gap-panel">
        <div>
          <p className="text-caption text-content-electric">
            {item.rarity} 级 · {item.specialty}
          </p>
          <h2 className="mt-control text-title2 font-semibold">{item.name}</h2>
          <p className="mt-compact max-w-3xl text-body text-text-secondary">{item.effect}</p>
        </div>
        <Link
          to="/zzz/w-engines"
          className="text-caption text-text-secondary hover:text-text-primary"
        >
          返回音擎列表
        </Link>
      </div>
      <div className="mt-panel grid gap-content md:grid-cols-2">
        <Detail label="获取方式" value={item.source} />
        <Detail
          label="关联内容"
          value={related.map((link) => link.title).join('、') || '正在整理'}
        />
      </div>
    </Card>
  );
}
function Detail({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="rounded-md border border-border-subtle bg-surface-1 p-content">
      <span className="text-caption text-text-tertiary">{label}</span>
      <p className="mt-compact text-label text-text-primary">{value}</p>
    </div>
  );
}
