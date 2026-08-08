import { describe, expect, it } from 'vitest';
import { materials } from './materials';

describe('materials content', () => {
  it('提供可检索的 Alpha 材料目录', () => {
    expect(materials.length).toBeGreaterThanOrEqual(30);
    expect(materials.every((material) => material.name && material.source.length > 0)).toBe(true);
    expect(new Set(materials.map((material) => material.id)).size).toBe(materials.length);
  });
});
