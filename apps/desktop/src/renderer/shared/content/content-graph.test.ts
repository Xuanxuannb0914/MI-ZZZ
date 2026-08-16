import { describe, expect, it } from 'vitest';
import { resolveContentLinks } from './content-graph';
import { agents, driveDiscs, materials, teams, versions, wEngines } from './index';

describe('ZZZ content graph', () => {
  it('keeps the alpha catalog above its minimum content threshold', () => {
    expect(agents.length).toBeGreaterThanOrEqual(20);
    expect(wEngines.length).toBeGreaterThanOrEqual(20);
    expect(driveDiscs.length).toBeGreaterThanOrEqual(30);
    expect(materials.length).toBeGreaterThanOrEqual(40);
    expect(teams.length).toBeGreaterThanOrEqual(15);
    expect(versions.length).toBeGreaterThanOrEqual(3);
  });

  it('resolves ID-based relationships into navigable content links', () => {
    const miyabi = agents.find((agent) => agent.id === 'miyabi');
    expect(miyabi).toBeDefined();
    const links = resolveContentLinks(miyabi ?? {});
    expect(links.some((link) => link.type === 'w-engine')).toBe(true);
    expect(links.some((link) => link.type === 'team')).toBe(true);
    expect(links.every((link) => link.to.startsWith('/zzz/'))).toBe(true);
  });
});
