import {
  agents,
  dailySchedules,
  events,
  driveDiscs,
  guides,
  materials,
  news,
  teams,
  todaysMaterials,
  versions,
  wEngines,
} from '../content';

export type SearchResultKind =
  | '角色'
  | '攻略'
  | '活动'
  | '资讯'
  | '驱动盘'
  | '音擎'
  | '配队'
  | '材料'
  | '版本';

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
  to: `/zzz/agents/${agent.id}`,
  keywords: `${agent.name} ${agent.attribute} ${agent.specialty} ${agent.faction}`,
}));

const guideResults: readonly SearchResult[] = guides.map((guide) => ({
  id: `guide-${guide.id}`,
  title: guide.title,
  description: guide.summary,
  kind: '攻略',
  to: `/zzz/guides/${guide.id}`,
  keywords: `${guide.title} ${guide.summary} ${guide.category} ${guide.tags.join(' ')}`,
}));

const eventResults: readonly SearchResult[] = events.map((event) => ({
  id: `event-${event.id}`,
  title: event.title,
  description: `${event.type ?? '活动'} · ${event.duration}`,
  kind: '活动',
  to: '/zzz/events',
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

const driveDiscResults: readonly SearchResult[] = driveDiscs.map((disc) => ({
  id: `disc-${disc.id}`,
  title: disc.name,
  description: disc.fourPieceEffect,
  kind: '驱动盘',
  to: `/zzz/drive-discs/${disc.id}`,
  keywords: `${disc.name} ${disc.setName} ${disc.description} 驱动盘 套装 词条`,
}));

const weaponResults: readonly SearchResult[] = wEngines.map((weapon) => ({
  id: `weapon-${weapon.id}`,
  title: weapon.name,
  description: weapon.effect,
  kind: '音擎',
  to: `/zzz/w-engines/${weapon.id}`,
  keywords: `${weapon.name} ${weapon.specialty} ${weapon.effect} 音擎 武器`,
}));

const teamResults: readonly SearchResult[] = teams.map((team) => ({
  id: `team-${team.id}`,
  title: team.name,
  description: team.description,
  kind: '配队',
  to: `/zzz/teams/${team.id}`,
  keywords: `${team.name} ${team.members.join(' ')} ${team.focus} 配队 队伍`,
}));

const versionResults: readonly SearchResult[] = versions.map((version) => ({
  id: `version-${version.id}`,
  title: `${version.code} ${version.name}`,
  description: version.theme,
  kind: '版本',
  to: '/zzz/events',
  keywords: `${version.code} ${version.name} ${version.theme} 版本`,
}));

const materialResults: readonly SearchResult[] = materials.map((material) => ({
  id: `material-${material.id}`,
  title: material.name,
  description: `${material.category} · ${material.purpose}`,
  kind: '材料',
  to: `/zzz/materials/${material.id}`,
  keywords: `${material.name} ${material.category} ${material.purpose} ${material.source.join(' ')} 材料 养成 体力 每日 周常`,
}));

const scheduleMaterialResults: readonly SearchResult[] = Array.from(
  new Set([...todaysMaterials, ...dailySchedules.flatMap((schedule) => schedule.materials)]),
).map((title, index) => ({
  id: `schedule-material-${index}`,
  title,
  description: '今日养成材料与体力规划',
  kind: '材料',
  to: '/zzz/planner',
  keywords: `${title} 材料 养成 体力 每日 周常`,
}));

export const searchIndex: readonly SearchResult[] = [
  ...agentResults,
  ...guideResults,
  ...eventResults,
  ...newsResults,
  ...driveDiscResults,
  ...weaponResults,
  ...teamResults,
  ...versionResults,
  ...materialResults,
  ...scheduleMaterialResults,
];

export function searchLocal(keyword: string, limit?: number): readonly SearchResult[] {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) return [];
  const results = searchIndex.filter((item) =>
    item.keywords.toLowerCase().includes(normalizedKeyword),
  );
  return typeof limit === 'number' ? results.slice(0, limit) : results;
}
