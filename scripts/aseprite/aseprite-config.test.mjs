import { describe, expect, it } from 'vitest';
import {
  BETA_ASEPRITE_VERSION,
  PLAYER_ASEPRITE_EXPORTS,
  REQUIRED_ASEPRITE_VERSION,
  parseAsepriteVersion,
} from './aseprite-config.mjs';

describe('aseprite workflow config', () => {
  it('production export uses stable Aseprite only', () => {
    expect(REQUIRED_ASEPRITE_VERSION).toBe('1.3.17.1');
    expect(BETA_ASEPRITE_VERSION).toBe('1.3.18-beta2');
  });

  it('parses Aseprite versions from CLI output', () => {
    expect(parseAsepriteVersion('Aseprite 1.3.17.1')).toBe('1.3.17.1');
    expect(parseAsepriteVersion('Aseprite v1.3.18-beta2')).toBe('1.3.18-beta2');
  });

  it('defines yui four-pose export targets under player sprites', () => {
    expect(PLAYER_ASEPRITE_EXPORTS.map((entry) => entry.id)).toEqual(['yui_idle', 'yui_move', 'yui_hurt', 'yui_ultimate']);
    for (const entry of PLAYER_ASEPRITE_EXPORTS) {
      expect(entry.source).toBe(`assets/source/aseprite/player/${entry.id}.aseprite`);
      expect(entry.target).toBe(`public/${entry.manifestPath}`);
      expect(entry.manifestPath).toMatch(/^assets\/sprites\/player\/yui_(idle|move|hurt|ultimate)_32\.png$/);
      expect(entry.width).toBe(32);
      expect(entry.height).toBe(32);
    }
  });
});
