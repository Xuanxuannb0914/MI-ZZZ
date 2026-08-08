import { ArrowUpRight, Megaphone, Newspaper, Wrench } from '@game-guide-hub/icons';
import { Card, Tabs } from '@game-guide-hub/ui';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { news } from '../../shared/content';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { Tag } from '../../shared/ui/tag';

const filters = ['全部', '公告', '版本', '活动', '维护', '资讯'] as const;
type NewsFilter = (typeof filters)[number];
const iconByKind = {
  公告: Megaphone,
  版本: Newspaper,
  活动: Newspaper,
  维护: Wrench,
  资讯: Newspaper,
} as const;

export default function NewsPage() {
  const [filter, setFilter] = useState<NewsFilter>('全部');
  const entries = useMemo(
    () => (filter === '全部' ? news : news.filter((entry) => entry.kind === filter)),
    [filter],
  );

  return (
    <PageTransition>
      <Page className="page-surface page-news">
        <header>
          <p className="text-caption font-semibold text-content-electric">官方资料</p>
          <h1 className="mt-control text-title1 font-semibold">资讯中心</h1>
          <p className="mt-compact text-body text-text-secondary">
            版本、活动、维护与绳网动态集中查看。
          </p>
        </header>
        <Tabs
          items={filters.map((item) => ({ value: item, label: item }))}
          value={filter}
          onValueChange={setFilter}
          label="资讯类型筛选"
        />
        <div className="grid gap-content xl:grid-cols-2">
          {entries.map((entry, index) => {
            const Icon = iconByKind[entry.kind];
            return (
              <Card
                key={entry.id}
                interactive
                className={index === 0 ? 'xl:col-span-2' : undefined}
              >
                <Link to="/news" className="flex items-start gap-content">
                  <span
                    className="ggh-icon-container ggh-icon-container-secondary"
                    aria-hidden="true"
                  >
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-control">
                      <strong className="text-label">{entry.title}</strong>
                      <Tag>{entry.kind}</Tag>
                    </span>
                    <span className="mt-compact block text-body text-text-secondary">
                      {entry.summary}
                    </span>
                    <time
                      className="mt-content block text-caption text-text-tertiary"
                      dateTime={entry.date}
                    >
                      {entry.date}
                    </time>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="shrink-0 text-text-tertiary"
                    size={16}
                  />
                </Link>
              </Card>
            );
          })}
        </div>
      </Page>
    </PageTransition>
  );
}
