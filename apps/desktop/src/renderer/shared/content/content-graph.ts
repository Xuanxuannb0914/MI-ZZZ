import { agents } from '../mock/agents';
import { driveDiscs } from '../mock/drive-discs';
import { events } from '../mock/events';
import { guides } from '../mock/guides';
import { materials } from '../mock/materials';
import { teams } from '../mock/teams';
import { versions } from '../mock/versions';
import { wEngines } from '../mock/w-engines';
import type { ContentEntityType, ContentRelations } from './types';

export interface ContentLink {
  readonly id: string;
  readonly type: ContentEntityType;
  readonly title: string;
  readonly description: string;
  readonly to: string;
}

const routeByType: Readonly<Record<ContentEntityType, (id: string) => string>> = {
  agent: (id) => `/zzz/agents/${id}`,
  'w-engine': (id) => `/zzz/w-engines/${id}`,
  'drive-disc': (id) => `/zzz/drive-discs/${id}`,
  team: (id) => `/zzz/teams/${id}`,
  material: (id) => `/zzz/materials/${id}`,
  guide: (id) => `/zzz/guides/${id}`,
  event: (id) => `/zzz/events/${id}`,
  announcement: () => '/news',
  version: () => '/zzz/events',
};

function link(type: ContentEntityType, id: string): ContentLink | undefined {
  switch (type) {
    case 'agent': {
      const item = agents.find((candidate) => candidate.id === id);
      return (
        item && {
          id,
          type,
          title: item.name,
          description: item.description,
          to: routeByType[type](id),
        }
      );
    }
    case 'w-engine': {
      const item = wEngines.find((candidate) => candidate.id === id);
      return (
        item && { id, type, title: item.name, description: item.effect, to: routeByType[type](id) }
      );
    }
    case 'drive-disc': {
      const item = driveDiscs.find((candidate) => candidate.id === id);
      return (
        item && {
          id,
          type,
          title: item.name,
          description: item.fourPieceEffect,
          to: routeByType[type](id),
        }
      );
    }
    case 'team': {
      const item = teams.find((candidate) => candidate.id === id);
      return (
        item && {
          id,
          type,
          title: item.name,
          description: item.description,
          to: routeByType[type](id),
        }
      );
    }
    case 'material': {
      const item = materials.find((candidate) => candidate.id === id);
      return (
        item && { id, type, title: item.name, description: item.purpose, to: routeByType[type](id) }
      );
    }
    case 'guide': {
      const item = guides.find((candidate) => candidate.id === id);
      return (
        item && {
          id,
          type,
          title: item.title,
          description: item.summary,
          to: routeByType[type](id),
        }
      );
    }
    case 'event': {
      const item = events.find((candidate) => candidate.id === id);
      return (
        item && {
          id,
          type,
          title: item.title,
          description: item.description ?? item.reward,
          to: routeByType[type](id),
        }
      );
    }
    case 'version': {
      const item = versions.find((candidate) => candidate.id === id);
      return (
        item && {
          id,
          type,
          title: `${item.code} ${item.name}`,
          description: item.theme,
          to: routeByType[type](id),
        }
      );
    }
    case 'announcement':
      return undefined;
  }
}

const relationFields: readonly [keyof ContentRelations, ContentEntityType][] = [
  ['agentIds', 'agent'],
  ['wEngineIds', 'w-engine'],
  ['driveDiscIds', 'drive-disc'],
  ['teamIds', 'team'],
  ['materialIds', 'material'],
  ['guideIds', 'guide'],
  ['eventIds', 'event'],
  ['versionIds', 'version'],
];

export function resolveContentLinks(relations: ContentRelations): readonly ContentLink[] {
  const recommended = relations as ContentRelations & {
    readonly recommendedWEngineIds?: readonly string[];
    readonly recommendedDriveDiscIds?: readonly string[];
  };
  return relationFields.flatMap(([field, type]) =>
    (
      relations[field] ??
      (field === 'wEngineIds' ? recommended.recommendedWEngineIds : undefined) ??
      (field === 'driveDiscIds' ? recommended.recommendedDriveDiscIds : undefined) ??
      []
    ).flatMap((id) => {
      const result = link(type, id);
      return result ? [result] : [];
    }),
  );
}

export function findRelatedContent(
  targetType: ContentEntityType,
  targetId: string,
): readonly ContentLink[] {
  const candidates: readonly [
    ContentEntityType,
    readonly (ContentRelations & { readonly id: string })[],
  ][] = [
    ['agent', agents],
    ['w-engine', wEngines],
    ['drive-disc', driveDiscs],
    ['team', teams],
    ['material', materials],
    ['guide', guides],
    ['event', events],
    ['version', versions],
  ];
  return candidates.flatMap(([type, entities]) =>
    entities.flatMap((entity) => {
      const links = resolveContentLinks(entity);
      return links.some((item) => item.type === targetType && item.id === targetId)
        ? link(type, entity.id)
          ? [link(type, entity.id) as ContentLink]
          : []
        : [];
    }),
  );
}
