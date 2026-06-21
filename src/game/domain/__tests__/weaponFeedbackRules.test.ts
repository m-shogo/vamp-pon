import { describe, expect, it } from 'vitest';
import {
  areaFeedbackFamily,
  projectileFeedbackFamily,
  projectileHitLabel,
  projectileTrailIntervalSec,
} from '../weaponFeedbackRules';

describe('weaponFeedbackRules', () => {
  it('groups projectile visuals into readable feedback families', () => {
    expect(projectileFeedbackFamily('pencil')).toBe('graphite');
    expect(projectileFeedbackFamily('paper_lantern')).toBe('lamp');
    expect(projectileFeedbackFamily('glass_marble')).toBe('glass');
    expect(projectileFeedbackFamily('paper_airplane')).toBe('paper_wind');
  });

  it('uses short but bounded trail intervals', () => {
    const kinds = ['pencil', 'paper_lantern', 'glass_marble', 'paper_airplane'] as const;
    for (const kind of kinds) {
      const interval = projectileTrailIntervalSec(kind);
      expect(interval).toBeGreaterThanOrEqual(0.045);
      expect(interval).toBeLessThanOrEqual(0.075);
    }
  });

  it('keeps hit labels compact for mobile readability', () => {
    expect(projectileHitLabel('pencil')).toBe('線');
    expect(projectileHitLabel('paper_lantern')).toBe('灯');
    expect(projectileHitLabel('glass_marble')).toBe('反');
    expect(projectileHitLabel('paper_airplane')).toBe('風');
  });

  it('groups area visuals separately from projectile visuals', () => {
    expect(areaFeedbackFamily('ink')).toBe('ink_pool');
    expect(areaFeedbackFamily('lamp')).toBe('lamp_ring');
    expect(areaFeedbackFamily('dawn')).toBe('dawn_mix');
  });
});
