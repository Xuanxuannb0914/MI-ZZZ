import { describe, expect, it } from 'vitest';
import { agents, findAgentById } from './agents';

describe('agent roster', () => {
  it('should provide a complete and uniquely addressable local roster', () => {
    const agentIds = agents.map((agent) => agent.id);

    expect(agents.length).toBeGreaterThanOrEqual(20);
    expect(new Set(agentIds).size).toBe(agentIds.length);
    expect(agents.every((agent) => agent.avatar.startsWith('/assets/agents/'))).toBe(true);
    expect(agentIds.every((agentId) => findAgentById(agentId)?.id === agentId)).toBe(true);
  });
});
