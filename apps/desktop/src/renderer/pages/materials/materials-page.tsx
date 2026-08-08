import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  Search,
  Sparkles,
} from '@game-guide-hub/icons';
import { Card, EmptyState, Tabs } from '@game-guide-hub/ui';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { materialCategories } from '../../entities/material/model/types';
import { findMaterialById, materials } from '../../shared/content';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { SearchBar } from '../../shared/ui/search-bar';
import { Tag } from '../../shared/ui/tag';

const filters = ['全部', ...materialCategories] as const;
type MaterialFilter = (typeof filters)[number];

export default function MaterialsPage() {
  const { id } = useParams<{ id: string }>();
  const selectedMaterial = id ? findMaterialById(id) : undefined;
  const [filter, setFilter] = useState<MaterialFilter>('全部');
  const [keyword, setKeyword] = useState('');
  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredMaterials = useMemo(
    () =>
      materials.filter(
        (material) =>
          (filter === '全部' || material.category === filter) &&
          (!normalizedKeyword ||
            `${material.name} ${material.category} ${material.purpose} ${material.source.join(' ')}`
              .toLowerCase()
              .includes(normalizedKeyword)),
      ),
    [filter, normalizedKeyword],
  );

  return (
    <PageTransition>
      <Page className="page-surface page-materials">
        <header className="flex flex-col gap-panel lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-caption font-semibold text-content-electric">
              养成资料库 · 本地 Mock
            </p>
            <h1 className="mt-control text-title1 font-semibold">材料查询</h1>
            <p className="mt-compact max-w-2xl text-body text-text-secondary">
              按用途、来源与关联角色整理当前版本的养成材料，数据仅作规划参考，请以游戏内掉落为准。
            </p>
          </div>
          <SearchBar
            value={keyword}
            onChange={setKeyword}
            placeholder="搜索材料、用途或来源"
            label="搜索材料"
            className="w-full lg:max-w-md"
          />
        </header>

        {selectedMaterial ? <MaterialDetail material={selectedMaterial} /> : null}

        <Tabs
          items={filters.map((item) => ({ value: item, label: item }))}
          value={filter}
          onValueChange={setFilter}
          label="材料分类筛选"
        />

        {filteredMaterials.length ? (
          <div className="grid gap-content md:grid-cols-2 xl:grid-cols-3">
            {filteredMaterials.map((material) => (
              <Link key={material.id} to={`/zzz/materials/${material.id}`} className="group block">
                <Card interactive className="h-full">
                  <div className="flex items-start gap-content">
                    <span
                      className="ggh-icon-container ggh-icon-container-accent"
                      aria-hidden="true"
                    >
                      <PackageOpen size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-control">
                        <strong className="text-label">{material.name}</strong>
                        <Tag>{material.rarity}</Tag>
                      </span>
                      <span className="mt-compact block text-caption text-content-electric">
                        {material.category}
                      </span>
                      <span className="mt-control block line-clamp-2 text-caption text-text-secondary">
                        {material.purpose}
                      </span>
                    </span>
                    <ChevronRight
                      aria-hidden="true"
                      className="shrink-0 text-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-content-electric"
                      size={16}
                    />
                  </div>
                  <div className="mt-panel flex items-center gap-control text-caption text-text-tertiary">
                    <Sparkles aria-hidden="true" size={14} />
                    <span className="truncate">来源：{material.source[0]}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="没有找到材料"
            description="试试材料名称、分类或刷取来源。"
            actionLabel="清除筛选"
            onAction={() => {
              setKeyword('');
              setFilter('全部');
            }}
          />
        )}
      </Page>
    </PageTransition>
  );
}

function MaterialDetail({
  material,
}: {
  readonly material: NonNullable<ReturnType<typeof findMaterialById>>;
}) {
  return (
    <Card glass="strong" className="mb-layout border-content-electric/25">
      <div className="flex flex-wrap items-start gap-panel">
        <span className="ggh-icon-container ggh-icon-container-accent" aria-hidden="true">
          <PackageOpen size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-control">
            <Link
              to="/zzz/materials"
              className="inline-flex items-center gap-compact text-caption text-text-tertiary hover:text-text-primary"
            >
              <ChevronLeft aria-hidden="true" size={14} /> 材料总览
            </Link>
            <Tag>{material.category}</Tag>
            <Tag>{material.rarity}</Tag>
          </div>
          <h2 className="mt-content text-title2 font-semibold">{material.name}</h2>
          <p className="mt-compact max-w-3xl text-body text-text-secondary">{material.purpose}</p>
        </div>
      </div>
      <div className="mt-panel grid gap-content md:grid-cols-3">
        <DetailBlock label="推荐获取" value={material.recommendedObtain} />
        <DetailBlock label="常见来源" value={material.source.join('、')} />
        <DetailBlock
          label="关联内容"
          value={
            material.relatedAgents.length
              ? material.relatedAgents.join('、')
              : '当前版本暂无指定角色'
          }
        />
      </div>
      {material.relatedGuides.length ? (
        <div className="mt-panel flex items-center gap-control border-t border-border-subtle pt-panel text-caption text-text-secondary">
          <BookOpen aria-hidden="true" size={15} className="text-content-electric" />
          关联攻略：{material.relatedGuides.join('、')}
        </div>
      ) : null}
    </Card>
  );
}

function DetailBlock({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-1 p-content">
      <span className="text-caption text-text-tertiary">{label}</span>
      <p className="mt-compact text-label leading-relaxed text-text-primary">{value}</p>
    </div>
  );
}
