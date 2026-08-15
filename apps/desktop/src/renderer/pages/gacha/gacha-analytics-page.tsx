import {
  Database,
  Download,
  List,
  Radio,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Target,
  Trash2,
} from '@game-guide-hub/icons';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Tabs,
} from '@game-guide-hub/ui';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  buildGachaAnalysis,
  type GachaBannerType,
  type GachaDataSource,
  type GachaHistoryItem,
  type GachaImportSummary,
  LocalGachaDataProvider,
} from '../../shared/content';
import { EmptyState } from '../../shared/ui/empty-state';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { SectionTitle } from '../../shared/ui/section-title';

const views = [
  { value: 'overview', label: '数据概览' },
  { value: 'history', label: '抽卡记录' },
  { value: 'luck', label: '欧非分析' },
  { value: 'agents', label: '角色统计' },
  { value: 'engines', label: '音擎统计' },
] as const;

const bannerLabels: Readonly<Record<GachaBannerType, string>> = {
  'limited-agent': '限定角色池',
  'limited-w-engine': '限定音擎池',
  standard: '常驻池',
};

type GachaView = (typeof views)[number]['value'];
type HistoryBannerFilter = GachaBannerType | 'all';
type HistoryRarityFilter = 'all' | 3 | 4 | 5;
type HistoryItemFilter = 'all' | GachaHistoryItem['itemType'];
type HistorySort = 'newest' | 'oldest' | 'rarity';
type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export default function GachaAnalyticsPage() {
  const providerRef = useRef<LocalGachaDataProvider | null>(null);
  if (!providerRef.current) providerRef.current = new LocalGachaDataProvider();
  const provider = providerRef.current;
  const [records, setRecords] = useState<readonly GachaHistoryItem[]>([]);
  const [view, setView] = useState<GachaView>('overview');
  const [historyBanner, setHistoryBanner] = useState<HistoryBannerFilter>('all');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importValue, setImportValue] = useState('');
  const [source, setSource] = useState<Exclude<GachaDataSource, 'local-cache'>>('json');
  const [importError, setImportError] = useState('');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [summary, setSummary] = useState<GachaImportSummary | null>(null);

  useEffect(() => {
    const cached = provider.load();
    setRecords(cached);
    setSyncStatus(cached.length ? 'success' : 'idle');
  }, [provider]);

  const importRecords = useCallback(() => {
    setSyncStatus('syncing');
    const result = provider.importText(importValue, source);
    setSummary(result.summary);
    setRecords(result.records);
    if (!result.summary.acceptedRecords) {
      setImportError(result.summary.issues[0] ?? '未解析到可导入的新记录。');
      setSyncStatus('error');
      return;
    }
    setImportError('');
    setSyncStatus('success');
    setView('overview');
  }, [importValue, provider, source]);

  const readClipboard = useCallback(async () => {
    try {
      setSource('clipboard');
      setImportValue(await navigator.clipboard.readText());
      setImportError('');
    } catch {
      setImportError('无法读取剪贴板。请授予剪贴板权限或直接粘贴 JSON 数据。');
    }
  }, []);

  const clearRecords = useCallback(() => {
    provider.clear();
    setRecords([]);
    setSummary(null);
    setSyncStatus('idle');
  }, [provider]);

  return (
    <PageTransition>
      <Page className="page-surface gacha-analytics-page">
        <header className="flex flex-col gap-panel lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-caption font-semibold text-content-electric">抽卡分析</p>
            <h1 className="mt-control text-title1 font-semibold">把抽卡记录变成可解释的数据</h1>
            <p className="mt-compact max-w-2xl text-body text-text-secondary">
              导入后仅在当前设备中解析。本地模型会计算出货、保底、限定命中与欧非指数，可直接替换为后续官方接口。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-content">
            <SyncIndicator status={syncStatus} recordCount={records.length} />
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
              <button
                className="ggh-button ggh-button-secondary inline-flex h-control items-center justify-center gap-compact px-panel text-label font-semibold"
                type="button"
                onClick={() => setIsImportOpen(true)}
              >
                <Download aria-hidden="true" size={16} />
                获取抽卡数据
              </button>
              <DialogContent aria-describedby="gacha-import-description">
                <DialogTitle>同步抽卡数据</DialogTitle>
                <DialogDescription id="gacha-import-description">
                  仅解析本地数据，不会访问或模拟游戏官方接口。支持导入 JSON 或读取剪贴板中的 JSON。
                </DialogDescription>
                <Tabs
                  className="mt-panel"
                  items={[
                    { value: 'json', label: 'JSON 导入' },
                    { value: 'clipboard', label: '剪贴板' },
                  ]}
                  value={source}
                  onValueChange={setSource}
                  label="数据来源"
                />
                {source === 'clipboard' ? (
                  <button
                    type="button"
                    className="ggh-button ggh-button-quiet mt-content h-control px-panel text-label"
                    onClick={readClipboard}
                  >
                    <RotateCcw aria-hidden="true" size={15} /> 读取剪贴板
                  </button>
                ) : null}
                <label
                  className="mt-panel block text-label font-semibold text-text-primary"
                  htmlFor="gacha-import-json"
                >
                  抽卡记录 JSON（必须包含 records、id、itemName、rarity、pulledAt）
                </label>
                <textarea
                  id="gacha-import-json"
                  value={importValue}
                  onChange={(event) => setImportValue(event.target.value)}
                  className="mt-compact min-h-56 w-full resize-y rounded-md border border-border-subtle bg-canvas/60 p-content font-mono text-caption text-text-primary outline-none transition-colors focus:border-content-electric"
                />
                {importError ? (
                  <p className="mt-compact text-caption text-danger">{importError}</p>
                ) : null}
                {summary ? <ImportSummary summary={summary} /> : null}
                <div className="mt-panel flex flex-wrap justify-end gap-content">
                  <DialogClose className="ggh-button ggh-button-quiet h-control px-panel text-label">
                    取消
                  </DialogClose>
                  <button
                    type="button"
                    className="ggh-button ggh-button-primary inline-flex h-control items-center gap-compact px-panel text-label font-semibold"
                    onClick={importRecords}
                  >
                    <Download aria-hidden="true" size={16} />
                    解析并同步
                  </button>
                </div>
              </DialogContent>
            </Dialog>
            {records.length ? (
              <button
                type="button"
                onClick={clearRecords}
                className="inline-flex h-control items-center gap-compact px-compact text-caption text-text-tertiary hover:text-danger"
              >
                <Trash2 aria-hidden="true" size={15} /> 清空本地数据
              </button>
            ) : null}
          </div>
        </header>

        <Tabs items={views} value={view} onValueChange={setView} label="抽卡分析视图" />
        {view === 'overview' ? <Overview records={records} /> : null}
        {view === 'history' ? (
          <HistoryView records={records} filter={historyBanner} onFilterChange={setHistoryBanner} />
        ) : null}
        {view === 'luck' ? <LuckView records={records} /> : null}
        {view === 'agents' ? <ItemStatsView records={records} itemType="agent" /> : null}
        {view === 'engines' ? <ItemStatsView records={records} itemType="w-engine" /> : null}
      </Page>
    </PageTransition>
  );
}

function Overview({ records }: { readonly records: readonly GachaHistoryItem[] }) {
  const { statistics, banners } = useMemo(() => buildGachaAnalysis(records), [records]);
  const fiveStarRecords = records.filter((record) => record.rarity === 5);
  if (!records.length) {
    return (
      <EmptyState
        title="等待抽卡数据"
        description="通过“获取抽卡数据”导入 JSON，或从剪贴板读取已导出的本地记录。"
      />
    );
  }
  return (
    <>
      <section className="grid gap-content sm:grid-cols-2 xl:grid-cols-4" aria-label="抽卡统计">
        <Metric
          icon={Database}
          label="总抽数"
          value={`${statistics.totalPulls}`}
          detail="已解析记录"
        />
        <Metric
          icon={Star}
          label="五星"
          value={`${statistics.fiveStarCount}`}
          detail={`四星 ${statistics.fourStarCount} 件`}
        />
        <Metric
          icon={Target}
          label="五星平均"
          value={formatPity(statistics.averageFiveStarPity)}
          detail="按五星出现前抽数计算"
        />
        <Metric
          icon={Radio}
          label="当前保底"
          value={`${statistics.currentPity}`}
          detail="限定角色池当前进度"
        />
      </section>
      <section className="grid gap-layout lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
        <div>
          <SectionTitle
            eyebrow="出货轨迹"
            title="五星记录"
            description="每次五星的实际出货抽数，不使用随机评价。"
          />
          <div className="mt-panel divide-y divide-border-subtle border-y border-border-subtle">
            {fiveStarRecords.length ? (
              fiveStarRecords.map((record, index) => (
                <article key={record.id} className="flex items-center gap-content py-content">
                  <span
                    className="ggh-icon-container ggh-icon-container-secondary"
                    aria-hidden="true"
                  >
                    <Sparkles size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-label font-semibold text-text-primary">
                      {record.itemName}
                    </h2>
                    <p className="mt-compact text-caption text-text-tertiary">
                      {record.isLimited ? '限定获得' : '未命中限定'} · {formatDate(record.pulledAt)}
                    </p>
                  </div>
                  <strong className="font-mono text-label text-content-electric">
                    {statistics.fiveStarPities[index] ?? '--'} 抽
                  </strong>
                </article>
              ))
            ) : (
              <InlineEmpty
                title="暂无五星记录"
                description="导入包含五星的记录后会显示出货轨迹。"
              />
            )}
          </div>
        </div>
        <aside className="border-l border-border-subtle pl-panel lg:pl-layout">
          <p className="text-caption font-semibold text-content-electric">限定池状态</p>
          <p className="mt-control font-display text-display font-semibold tabular-nums text-text-primary">
            {statistics.limitedWinRate === null
              ? '--'
              : `${Math.round(statistics.limitedWinRate * 100)}%`}
          </p>
          <p className="mt-compact text-label text-text-secondary">限定角色命中率</p>
          <dl className="mt-panel space-y-content text-caption">
            <DataRow label="命中限定" value={`${statistics.limitedWinCount} 次`} />
            <DataRow label="未命中限定" value={`${statistics.limitedLossCount} 次`} />
            <DataRow
              label="最早 / 最晚五星"
              value={`${statistics.bestFiveStarPity ?? '--'} / ${statistics.worstFiveStarPity ?? '--'} 抽`}
            />
          </dl>
          <div className="mt-layout border-t border-border-subtle pt-panel">
            <p className="text-caption font-semibold text-text-primary">卡池进度</p>
            <div className="mt-content space-y-content">
              {banners.map((banner) => (
                <DataRow
                  key={banner.bannerType}
                  label={bannerLabels[banner.bannerType]}
                  value={`${banner.pullCount} 抽 · 保底 ${banner.currentPity}`}
                />
              ))}
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

function HistoryView({
  records,
  filter,
  onFilterChange,
}: {
  readonly records: readonly GachaHistoryItem[];
  readonly filter: HistoryBannerFilter;
  readonly onFilterChange: (value: HistoryBannerFilter) => void;
}) {
  const [keyword, setKeyword] = useState('');
  const [rarity, setRarity] = useState<HistoryRarityFilter>('all');
  const [itemType, setItemType] = useState<HistoryItemFilter>('all');
  const [sort, setSort] = useState<HistorySort>('newest');
  const [page, setPage] = useState(0);
  const filtered = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    return records
      .filter(
        (record) =>
          (filter === 'all' || record.bannerType === filter) &&
          (rarity === 'all' || record.rarity === rarity) &&
          (itemType === 'all' || record.itemType === itemType) &&
          (!normalized ||
            `${record.itemName} ${bannerLabels[record.bannerType]}`
              .toLowerCase()
              .includes(normalized)),
      )
      .sort((left, right) => {
        if (sort === 'rarity')
          return right.rarity - left.rarity || right.pulledAt.localeCompare(left.pulledAt);
        return sort === 'newest'
          ? right.pulledAt.localeCompare(left.pulledAt)
          : left.pulledAt.localeCompare(right.pulledAt);
      });
  }, [filter, itemType, keyword, rarity, records, sort]);
  const pageSize = 40;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleRecords = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const updateFilter = <Value extends string>(setter: (value: Value) => void, value: Value) => {
    setter(value);
    setPage(0);
  };
  const filters: readonly { readonly value: HistoryBannerFilter; readonly label: string }[] = [
    { value: 'all', label: '全部' },
    ...Object.entries(bannerLabels).map(([value, label]) => ({
      value: value as GachaBannerType,
      label,
    })),
  ];
  return (
    <section aria-label="抽卡历史记录">
      <div className="flex flex-wrap items-center justify-between gap-panel">
        <SectionTitle
          eyebrow="原始记录"
          title="抽卡历史"
          description="导入顺序与时间保留在本地，方便核对解析结果。"
        />
        <Tabs items={filters} value={filter} onValueChange={onFilterChange} label="抽卡池筛选" />
      </div>
      <div className="mt-panel grid gap-content md:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
        <label className="flex min-w-0 items-center gap-compact border-b border-border-subtle py-compact text-text-tertiary">
          <Search aria-hidden="true" size={15} />
          <span className="sr-only">搜索抽卡记录</span>
          <input
            className="min-w-0 flex-1 bg-transparent text-label text-text-primary outline-none"
            value={keyword}
            onChange={(event) => updateFilter(setKeyword, event.target.value)}
            placeholder="搜索物品或卡池"
          />
        </label>
        <Tabs
          items={[
            { value: 'all', label: '全部' },
            { value: 'agent', label: '角色' },
            { value: 'w-engine', label: '音擎' },
          ]}
          value={itemType}
          onValueChange={(value) => updateFilter(setItemType, value)}
          label="物品类型筛选"
        />
        <Tabs
          items={[
            { value: 'all', label: '全稀有度' },
            { value: '5', label: '五星' },
            { value: '4', label: '四星' },
          ]}
          value={rarity === 'all' ? 'all' : String(rarity)}
          onValueChange={(value) => {
            setRarity(value === 'all' ? 'all' : value === '5' ? 5 : 4);
            setPage(0);
          }}
          label="稀有度筛选"
        />
        <Tabs
          items={[
            { value: 'newest', label: '最新' },
            { value: 'oldest', label: '最早' },
            { value: 'rarity', label: '稀有度' },
          ]}
          value={sort}
          onValueChange={(value) => updateFilter(setSort, value)}
          label="排序方式"
        />
      </div>
      <div className="mt-panel divide-y divide-border-subtle border-y border-border-subtle">
        {visibleRecords.length ? (
          visibleRecords.map((record, index) => (
            <article
              key={record.id}
              className="grid grid-cols-[2.4rem_minmax(0,1fr)_auto] items-center gap-content py-content"
            >
              <span
                className={`font-mono text-label ${record.rarity === 5 ? 'text-content-electric' : record.rarity === 4 ? 'text-content-ether' : 'text-text-tertiary'}`}
              >
                {record.rarity}★
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-label font-semibold text-text-primary">
                  {record.itemName}
                </h2>
                <p className="mt-compact text-caption text-text-tertiary">
                  {bannerLabels[record.bannerType]} ·{' '}
                  {record.itemType === 'agent' ? '代理人' : '音擎'}
                </p>
              </div>
              <span className="text-right text-caption text-text-tertiary">
                #{page * pageSize + index + 1}
                <br />
                {formatDate(record.pulledAt)}
              </span>
            </article>
          ))
        ) : (
          <InlineEmpty title="当前卡池没有记录" description="切换筛选或导入对应卡池的抽卡记录。" />
        )}
      </div>
      {filtered.length > pageSize ? (
        <div className="mt-content flex items-center justify-between text-caption text-text-secondary">
          <span>
            显示 {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filtered.length)} /{' '}
            {filtered.length}
          </span>
          <span className="flex gap-compact">
            <button
              type="button"
              className="ggh-button ggh-button-quiet h-control px-content text-label"
              disabled={page === 0}
              onClick={() => setPage((value) => value - 1)}
            >
              上一页
            </button>
            <button
              type="button"
              className="ggh-button ggh-button-quiet h-control px-content text-label"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((value) => value + 1)}
            >
              下一页
            </button>
          </span>
        </div>
      ) : null}
    </section>
  );
}

function SyncIndicator({
  status,
  recordCount,
}: {
  readonly status: SyncStatus;
  readonly recordCount: number;
}) {
  const label =
    status === 'syncing'
      ? '正在同步'
      : status === 'success'
        ? '已同步'
        : status === 'error'
          ? '同步异常'
          : '等待同步';
  const color =
    status === 'success'
      ? 'text-success'
      : status === 'error'
        ? 'text-danger'
        : 'text-text-tertiary';
  return (
    <p className={`text-caption ${color}`}>
      <span aria-hidden="true">●</span> {label} · {recordCount} 条本地记录
    </p>
  );
}

function ImportSummary({ summary }: { readonly summary: GachaImportSummary }) {
  return (
    <dl className="mt-content grid grid-cols-2 gap-content border-y border-border-subtle py-content text-caption sm:grid-cols-4">
      <SummaryItem label="已导入" value={`${summary.acceptedRecords} 条`} />
      <SummaryItem label="重复" value={`${summary.duplicateRecords} 条`} />
      <SummaryItem label="异常" value={`${summary.rejectedRecords} 条`} />
      <SummaryItem label="本地合计" value={`${summary.totalRecords} 条`} />
    </dl>
  );
}

function SummaryItem({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div>
      <dt className="text-text-tertiary">{label}</dt>
      <dd className="mt-compact font-semibold text-text-primary">{value}</dd>
    </div>
  );
}

function LuckView({ records }: { readonly records: readonly GachaHistoryItem[] }) {
  const { statistics } = useMemo(() => buildGachaAnalysis(records), [records]);
  const fiveStarRecords = records.filter((record) => record.rarity === 5);
  const maxPity = Math.max(80, ...statistics.fiveStarPities);
  return (
    <section className="grid gap-layout lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
      <div>
        <SectionTitle
          eyebrow="可解释评分"
          title="欧非分析"
          description="以五星平均出货和最早五星为核心；80 抽是计算基准。"
        />
        <ul className="mt-panel space-y-content" aria-label="五星出货分布">
          {statistics.fiveStarPities.length ? (
            statistics.fiveStarPities.map((pity, index) => (
              <li
                key={fiveStarRecords[index]?.id ?? `pity-${pity}`}
                className="grid grid-cols-[3.5rem_minmax(0,1fr)_3rem] items-center gap-content text-caption"
              >
                <span className="text-text-tertiary">第 {index + 1} 次</span>
                <span className="h-2 overflow-hidden rounded-full bg-surface-3">
                  <span
                    className="block h-full rounded-full bg-content-electric"
                    style={{ width: `${Math.max(4, (pity / maxPity) * 100)}%` }}
                  />
                </span>
                <strong className="text-right font-mono text-text-primary">{pity} 抽</strong>
              </li>
            ))
          ) : (
            <InlineEmpty
              title="暂无可分析的五星记录"
              description="导入记录后，系统会据此展示出货分布。"
            />
          )}
        </ul>
      </div>
      <aside className="border-l border-border-subtle pl-panel lg:pl-layout">
        <p className="text-caption font-semibold text-content-electric">欧非指数</p>
        <div className="mt-control flex items-end gap-content">
          <p className="font-display text-display font-semibold tabular-nums text-text-primary">
            {statistics.luckScore}
          </p>
          <p className="pb-compact text-title3 font-semibold text-content-electric">
            {statistics.luckLabel}
          </p>
        </div>
        <div
          className="mt-panel h-2 overflow-hidden rounded-full bg-surface-3"
          role="progressbar"
          aria-label="欧非指数"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={statistics.luckScore}
        >
          <div
            className="h-full bg-gradient-to-r from-content-ether via-content-ice to-content-electric"
            style={{ width: `${statistics.luckScore}%` }}
          />
        </div>
        <dl className="mt-panel space-y-content text-caption">
          <DataRow label="五星平均" value={`${formatPity(statistics.averageFiveStarPity)} 抽`} />
          <DataRow label="五星数量" value={`${statistics.fiveStarCount} 件`} />
          <DataRow label="四星数量" value={`${statistics.fourStarCount} 件`} />
          <DataRow
            label="限定命中率"
            value={
              statistics.limitedWinRate === null
                ? '--'
                : `${Math.round(statistics.limitedWinRate * 100)}%`
            }
          />
        </dl>
      </aside>
    </section>
  );
}

function ItemStatsView({
  records,
  itemType,
}: {
  readonly records: readonly GachaHistoryItem[];
  readonly itemType: GachaHistoryItem['itemType'];
}) {
  const items = useMemo(() => {
    const itemsByName = new Map<
      string,
      { name: string; count: number; fiveStarCount: number; limitedCount: number }
    >();
    for (const record of records) {
      if (record.itemType !== itemType) continue;
      const current = itemsByName.get(record.itemName);
      itemsByName.set(record.itemName, {
        name: record.itemName,
        count: (current?.count ?? 0) + 1,
        fiveStarCount: (current?.fiveStarCount ?? 0) + Number(record.rarity === 5),
        limitedCount: (current?.limitedCount ?? 0) + Number(record.isLimited),
      });
    }
    return [...itemsByName.values()].sort(
      (left, right) => right.count - left.count || right.fiveStarCount - left.fiveStarCount,
    );
  }, [itemType, records]);
  const title = itemType === 'agent' ? '角色统计' : '音擎统计';
  return (
    <section>
      <SectionTitle
        eyebrow="获得汇总"
        title={title}
        description="按导入记录聚合，重复获得与限定状态均可核对。"
      />
      <div className="mt-panel divide-y divide-border-subtle border-y border-border-subtle">
        {items.length ? (
          items.map((item) => (
            <article key={item.name} className="flex items-center gap-content py-content">
              <span className="ggh-icon-container ggh-icon-container-secondary" aria-hidden="true">
                {itemType === 'agent' ? <Star size={16} /> : <List size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-label font-semibold text-text-primary">{item.name}</h2>
                <p className="mt-compact text-caption text-text-tertiary">
                  五星 {item.fiveStarCount} · 限定 {item.limitedCount}
                </p>
              </div>
              <strong className="font-mono text-label text-content-electric">
                {item.count} 次
              </strong>
            </article>
          ))
        ) : (
          <InlineEmpty
            title={`暂无${itemType === 'agent' ? '角色' : '音擎'}记录`}
            description="导入对应道具类型的记录后显示统计。"
          />
        )}
      </div>
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  readonly icon: typeof Star;
  readonly label: string;
  readonly value: string;
  readonly detail: string;
}) {
  return (
    <article className="ggh-glass glass-light ggh-card p-panel">
      <Icon aria-hidden="true" className="text-content-electric" size={18} />
      <p className="mt-panel text-caption text-text-tertiary">{label}</p>
      <p className="mt-compact font-display text-title1 font-semibold tabular-nums text-text-primary">
        {value}
      </p>
      <p className="mt-compact text-caption text-text-secondary">{detail}</p>
    </article>
  );
}
function DataRow({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="flex justify-between gap-content">
      <dt className="text-text-tertiary">{label}</dt>
      <dd className="text-right font-semibold text-text-primary">{value}</dd>
    </div>
  );
}
function InlineEmpty({
  title,
  description,
}: {
  readonly title: string;
  readonly description: string;
}) {
  return <EmptyState title={title} description={description} />;
}
function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '未知时间'
    : new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric' }).format(date);
}
function formatPity(value: number | null) {
  return value === null ? '--' : value.toFixed(1);
}
