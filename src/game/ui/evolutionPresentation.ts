import type { EvolutionKind } from '../domain/types';

export type EvolutionMotif = 'paper-rise' | 'ink-lamp-merge' | 'memory-seal';

export type EvolutionPresentation = {
  headline: string;
  subtitle: string;
  motif: EvolutionMotif;
  flashRgb: readonly [number, number, number];
  durationMs: number;
  strong: boolean;
};

const PRESENTATIONS: Record<EvolutionKind, EvolutionPresentation> = {
  upgrade: {
    headline: '強化進化',
    subtitle: 'ひとつの道具が、さらに深くなる',
    motif: 'paper-rise',
    flashRgb: [255, 240, 176],
    durationMs: 1100,
    strong: false,
  },
  fusion: {
    headline: '合体',
    subtitle: 'ふたつの忘れ物が、ひとつにつながる',
    motif: 'ink-lamp-merge',
    flashRgb: [244, 222, 174],
    durationMs: 1400,
    strong: true,
  },
  awakening: {
    headline: '覚醒',
    subtitle: 'レアな記憶が、道具に宿る',
    motif: 'memory-seal',
    flashRgb: [225, 211, 248],
    durationMs: 1500,
    strong: true,
  },
};

export function evolutionPresentation(kind: EvolutionKind): EvolutionPresentation {
  return PRESENTATIONS[kind];
}
