import { describe, expect, it } from 'vitest';
import { evolutionPresentation } from './evolutionPresentation';

describe('evolution presentation', () => {
  it('強化進化・合体・覚醒で異なる意味とモチーフを返す', () => {
    const upgrade = evolutionPresentation('upgrade');
    const fusion = evolutionPresentation('fusion');
    const awakening = evolutionPresentation('awakening');

    expect(new Set([upgrade.headline, fusion.headline, awakening.headline]).size).toBe(3);
    expect(new Set([upgrade.motif, fusion.motif, awakening.motif]).size).toBe(3);
    expect(fusion.strong).toBe(true);
    expect(awakening.durationMs).toBeGreaterThan(upgrade.durationMs);
  });
});
