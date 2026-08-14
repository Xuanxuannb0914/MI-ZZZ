import type { LucideIcon } from '@game-guide-hub/icons';
import { Download, ShieldCheck, Sparkles, Star, Target } from '@game-guide-hub/icons';
import { analyzeGachaHistory, gachaHistory } from '../../shared/content';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { SectionTitle } from '../../shared/ui/section-title';

export default function GachaAnalyticsPage() {
  const analytics = analyzeGachaHistory(gachaHistory);
  const fiveStarRecords = gachaHistory.filter((record) => record.rarity === 5);
  return (
    <PageTransition>
      <Page className="page-surface gacha-analytics-page">
        <header className="flex flex-col gap-panel lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-caption font-semibold text-content-electric">数据中心 · 抽卡分析</p>
            <h1 className="mt-control text-title1 font-semibold">你的抽卡记录，一眼看懂</h1>
            <p className="mt-compact max-w-2xl text-body text-text-secondary">
              当前为本地示例数据。导入接口已预留，后续接入真实记录后会用同一套统计规则计算结果。
            </p>
          </div>
          <button
            className="ggh-button ggh-button-secondary inline-flex h-control items-center justify-center gap-compact px-panel text-label font-semibold"
            type="button"
            disabled
            title="真实导入接口即将接入"
          >
            <Download aria-hidden="true" size={16} />
            导入记录（即将开放）
          </button>
        </header>
        <nav className="page-tabs" aria-label="抽卡分析视图">
          <button type="button" className="is-active">
            数据概览
          </button>
          <button type="button">抽卡记录</button>
          <button type="button">欧非分析</button>
          <button type="button">角色统计</button>
          <button type="button">音擎统计</button>
        </nav>

        <section className="grid gap-content sm:grid-cols-2 xl:grid-cols-4" aria-label="抽卡统计">
          <Stat icon={Star} label="总抽数" value={`${analytics.totalPulls}`} detail="已解析记录" />
          <Stat
            icon={Sparkles}
            label="五星 / 限定"
            value={`${analytics.fiveStarCount} / ${analytics.limitedWinCount}`}
            detail="高稀有度与限定获取"
          />
          <Stat
            icon={Target}
            label="五星平均"
            value={analytics.averageFiveStarPity?.toFixed(1) ?? '--'}
            detail="五星出货平均抽数"
          />
          <Stat
            icon={ShieldCheck}
            label="当前保底"
            value={`${analytics.currentPity}`}
            detail="距离下一次五星"
          />
        </section>

        <section className="grid gap-layout lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
          <div>
            <SectionTitle
              eyebrow="出货轨迹"
              title="五星记录"
              description="按记录顺序计算每次五星出现前的抽数。"
            />
            <div className="mt-panel divide-y divide-border-subtle border-y border-border-subtle">
              {fiveStarRecords.map((record, index) => {
                const pity =
                  index === 0
                    ? Number(record.id)
                    : Number(record.id) - Number(fiveStarRecords[index - 1]?.id ?? 0);
                return (
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
                        {record.isLimited ? '限定角色' : '常驻角色'} · 第 {record.id} 抽
                      </p>
                    </div>
                    <strong className="font-mono text-label text-content-electric">
                      {pity} 抽
                    </strong>
                  </article>
                );
              })}
            </div>
          </div>
          <aside className="border-l border-border-subtle pl-panel lg:pl-layout">
            <p className="text-caption font-semibold text-content-electric">欧非指数</p>
            <div className="mt-control flex items-end gap-content">
              <p className="font-display text-display font-semibold tabular-nums text-text-primary">
                {analytics.luckScore}
              </p>
              <p className="pb-compact text-title3 font-semibold text-content-electric">
                {analytics.luckLabel}
              </p>
            </div>
            <div
              className="mt-panel h-2 overflow-hidden rounded-full bg-surface-3"
              role="progressbar"
              aria-label="欧非指数"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={analytics.luckScore}
            >
              <div
                className="h-full bg-gradient-to-r from-content-ether via-content-ice to-content-electric"
                style={{ width: `${analytics.luckScore}%` }}
              />
            </div>
            <dl className="mt-panel space-y-content text-caption">
              <div className="flex justify-between gap-content">
                <dt className="text-text-tertiary">最早五星</dt>
                <dd className="font-semibold text-text-primary">
                  {analytics.bestFiveStarPity ?? '--'} 抽
                </dd>
              </div>
              <div className="flex justify-between gap-content">
                <dt className="text-text-tertiary">最晚五星</dt>
                <dd className="font-semibold text-text-primary">
                  {analytics.worstFiveStarPity ?? '--'} 抽
                </dd>
              </div>
              <div className="flex justify-between gap-content">
                <dt className="text-text-tertiary">歪池次数</dt>
                <dd className="font-semibold text-text-primary">{analytics.guaranteeCount}</dd>
              </div>
            </dl>
            <p className="mt-panel border-l-2 border-content-electric pl-content text-caption leading-relaxed text-text-secondary">
              指数以五星平均出货抽数为主，并奖励更早出现的五星；80
              抽视作基准，不以随机文案代替数据解释。
            </p>
          </aside>
        </section>
      </Page>
    </PageTransition>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  detail,
}: {
  readonly icon: LucideIcon;
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
