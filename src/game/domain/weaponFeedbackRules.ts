import type { AreaVisualKind, ProjectileVisualKind } from './weaponVisual';

export type ProjectileFeedbackFamily = 'graphite' | 'lamp' | 'paper_cut' | 'glass' | 'paper_wind';
export type AreaFeedbackFamily = 'ink_pool' | 'lamp_ring' | 'dawn_mix';

export function projectileFeedbackFamily(kind: ProjectileVisualKind): ProjectileFeedbackFamily {
  switch (kind) {
    case 'star':
    case 'paper_lantern':
      return 'lamp';
    case 'blade':
    case 'envelope_blade':
      return 'paper_cut';
    case 'glass_marble':
    case 'lens_marble':
      return 'glass';
    case 'paper_airplane':
    case 'big_plane':
      return 'paper_wind';
    case 'pencil':
    case 'pencil_line':
    case 'name_line':
    default:
      return 'graphite';
  }
}

export function projectileTrailIntervalSec(kind: ProjectileVisualKind): number {
  switch (projectileFeedbackFamily(kind)) {
    case 'paper_wind': return 0.045;
    case 'lamp': return 0.06;
    case 'glass': return 0.075;
    case 'paper_cut': return 0.07;
    case 'graphite':
    default: return 0.055;
  }
}

export function areaFeedbackFamily(kind: AreaVisualKind): AreaFeedbackFamily {
  switch (kind) {
    case 'lamp': return 'lamp_ring';
    case 'dawn': return 'dawn_mix';
    case 'ink':
    default: return 'ink_pool';
  }
}

export function projectileHitLabel(kind: ProjectileVisualKind): string {
  switch (projectileFeedbackFamily(kind)) {
    case 'lamp': return '灯';
    case 'paper_cut': return '切';
    case 'glass': return '反';
    case 'paper_wind': return '風';
    case 'graphite':
    default: return '線';
  }
}
