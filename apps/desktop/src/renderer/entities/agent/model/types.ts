export const agentAttributes = ['电', '以太', '冰', '火', '物理'] as const;
export const agentSpecialties = ['异常', '强攻', '防护', '击破', '支援'] as const;
export const agentRarities = ['S', 'A'] as const;

export type AgentAttribute = (typeof agentAttributes)[number];
export type AgentSpecialty = (typeof agentSpecialties)[number];
export type AgentRarity = (typeof agentRarities)[number];

export interface Agent {
  readonly id: string;
  readonly name: string;
  readonly faction: string;
  readonly attribute: AgentAttribute;
  readonly specialty: AgentSpecialty;
  readonly rarity: AgentRarity;
  readonly avatar: string;
  readonly cover: string;
  readonly accentClass: string;
  readonly description: string;
  readonly recommendedTeam: readonly string[];
  readonly recommendedWeapon: string;
  readonly recommendedDriveDisc: readonly string[];
  readonly materials: readonly string[];
  readonly skills: readonly string[];
}
