import { describe, expect, it } from 'vitest';
import {
  BETA_ASEPRITE_VERSION,
  PLAYER_ASEPRITE_EXPORTS,
  REQUIRED_ASEPRITE_VERSION,
  isProductionUsableAsepriteVersion,
  parseAsepriteVersion,
} from './aseprite-config.mjs';

describe('aseprite workflow config', () => {
  it('production export uses stable Aseprite 1.3.17.x only', () => {
    expect(REQUIRED_ASEPRITE_VERSION).toBe('1.3.17.x');
    expect(BETA_ASEPRITE_VERSION).toBe('1.3.18-beta2');
  });

  it('parses Aseprite versions from CLI output', () => {
    expect(parseAsepriteVersion('Aseprite 1.3.17.1')).toBe('1.3.17.1');
    expect(parseAsepriteVersion('Aseprite 1.3.17.2-arm64')).toBe('1.3.17.2-arm64');
    expect(parseAsepriteVersion('Aseprite v1.3.18-beta2')).toBe('1.3.18-beta2');
  });

  it('classifies production usable versions', () => {
    expect(isProductionUsableAsepriteVersion('1.3.17.1')).toBe(true);
    expect(isProductionUsableAsepriteVersion('1.3.17.2-arm64')).toBe(true);
    expect(isProductionUsableAsepriteVersion('1.3.18-beta2')).toBe(false);
    expect(isProductionUsableAsepriteVersion('1.3.18-beta2-arm64')).toBe(false);
    expect(isProductionUsableAsepriteVersion('')).toBe(false);
    expect(isProductionUsableAsepriteVersion('unknown')).toBe(false);
  });

  it('defines yui four-pose export targets under player sprites', () => {
    expect(PLAYER_ASEPRITE_EXPORTS.map((entry) => entry.id)).toEqual(['yui_idle', 'yui_move', 'yui_hurt', 'yui_ultimate']);
    for (const entry of PLAYER_ASEPRITE_EXPORTS) {
      expect(entry.source).toBe(`assets/source/aseprite/player/${entry.id}.aseprite`);
      expect(entry.target).toBe(`public/${entry.manifestPath}`);
      expect(entry.manifestPath).toMatch(/^assets\/sprites\/player\/yui_(idle|move|hurt|ultimate)_42\.png$/);
      expect(entry.width).toBe(42);
      expect(entry.height).toBe(42);
    }
  });
});
