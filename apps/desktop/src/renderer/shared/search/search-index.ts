import { agents } from '../mock/agents';
import { events } from '../mock/events';
import { guides } from '../mock/guides';
import { news } from '../mock/news';

export type SearchResultKind = '角色' | '攻略' | '活动' | '资讯' | '驱动盘' | '音擎' | '版本';

export interface SearchResult {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly kind: SearchResultKind;
  readonly to: string;
  readonly keywords: string;
}

const agentResults: readonly SearchResult[] = agents.map((agent) => ({
  id: `agent-${agent.id}`,
  title: agent.name,
  description: `${agent.attribute}属性 · ${agent.specialty} · ${agent.faction}`,
  kind: '角色',
  to: `/agent/${agent.id}`,
  keywords: `${agent.name} ${agent.attribute} ${agent.specialty} ${agent.faction}`,
}));

const guideResults: readonly SearchResult[] = guides.map((guide) => ({
  id: `guide-${guide.id}`,
  title: guide.title,
  description: guide.summary,
  kind: '攻略',
  to: `/guide/${guide.id}`,
  keywords: `${guide.title} ${guide.summary} ${guide.category} ${guide.tags.join(' ')}`,
}));

const eventResults: readonly SearchResult[] = events.map((event) => ({
  id: `event-${event.id}`,
  title: event.title,
  description: `${event.type ?? '活动'} · ${event.duration}`,
  kind: '活动',
  to: '/events',
  keywords: `${event.title} ${event.type ?? ''} ${event.reward}`,
}));

const newsResults: readonly SearchResult[] = news.map((entry) => ({
  id: `news-${entry.id}`,
  title: entry.title,
  description: entry.summary,
  kind: entry.kind === '版本' ? '版本' : '资讯',
  to: '/news',
  keywords: `${entry.title} ${entry.summary} ${entry.kind} ${entry.date}`,
}));

const driveDiscResults: readonly SearchResult[] = Array.from(
  new Set(agents.flatMap((agent) => agent.recommendedDriveDisc)),
).map((title, index) => ({
  id: `disc-${index}`,
  title,
  description: '角色推荐驱动盘配置',
  kind: '驱动盘',
  to: '/guides?category=资源',
  keywords: `${title} 驱动盘 套装 词条`,
}));

const weaponResults: readonly SearchResult[] = Array.from(
  new Set(agents.map((agent) => agent.recommendedWeapon)),
).map((title, index) => ({
  id: `weapon-${index}`,
  title,
  description: '角色推荐音擎',
  kind: '音擎',
  to: '/guides?category=角色养成',
  keywords: `${title} 音擎 武器`,
}));

export const searchIndex: readonly SearchResult[] = [
  ...agentResults,
  ...guideResults,
  ...eventResults,
  ...newsResults,
  ...driveDiscResults,
  ...weaponResults,
];

export function searchLocal(keyword: string, limit?: number): readonly SearchResult[] {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) return [];
  const results = searchIndex.filter((item) =>
    item.keywords.toLowerCase().includes(normalizedKeyword),
  );
  return typeof limit === 'number' ? results.slice(0, limit) : results;
}
