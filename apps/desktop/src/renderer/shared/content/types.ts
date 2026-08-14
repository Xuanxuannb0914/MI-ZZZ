export type ContentEntityType =
  | 'agent'
  | 'w-engine'
  | 'drive-disc'
  | 'team'
  | 'material'
  | 'guide'
  | 'event'
  | 'announcement'
  | 'version';

export interface ContentRelations {
  readonly agentIds?: readonly string[];
  readonly wEngineIds?: readonly string[];
  readonly driveDiscIds?: readonly string[];
  readonly teamIds?: readonly string[];
  readonly materialIds?: readonly string[];
  readonly guideIds?: readonly string[];
  readonly eventIds?: readonly string[];
  readonly versionIds?: readonly string[];
}

export interface ContentEntity extends ContentRelations {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

export type WEngineRarity = 'S' | 'A' | 'B';

export interface WEngine extends ContentEntity {
  readonly rarity: WEngineRarity;
  readonly specialty: string;
  readonly effect: string;
  readonly source: string;
}

export interface DriveDisc extends ContentEntity {
  readonly setName: string;
  readonly twoPieceEffect: string;
  readonly fourPieceEffect: string;
  readonly recommendedStats: readonly string[];
  readonly source: string;
}

export interface Version extends ContentEntity {
  readonly code: string;
  readonly period: string;
  readonly theme: string;
}
