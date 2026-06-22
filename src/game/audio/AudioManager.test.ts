import { describe, it, expect } from 'vitest';

const KNOWN_SE_KEYS = [
  'se_hit', 'se_enemyDeath', 'se_expCollect', 'se_levelUp',
  'se_evolution', 'se_heal', 'se_playerDamage', 'se_ultimate',
  'se_blackMode', 'se_bossWarning', 'se_clear', 'se_select', 'se_reroll',
];
const KNOWN_BGM_KEYS = ['bgm_stage1', 'bgm_boss', 'bgm_clear'];
const ALL_KNOWN_KEYS = new Set([...KNOWN_SE_KEYS, ...KNOWN_BGM_KEYS]);

describe('audio-manifest.json contract', () => {
  it('manifest file is valid JSON with version and assets array', async () => {
    const fs = await import('fs');
    const raw = fs.readFileSync('public/assets/audio/audio-manifest.json', 'utf-8');
    const manifest = JSON.parse(raw);
    expect(manifest).toHaveProperty('version');
    expect(Array.isArray(manifest.assets)).toBe(true);
  });

  it('all manifest entries have known keys and non-empty urls', async () => {
    const fs = await import('fs');
    const raw = fs.readFileSync('public/assets/audio/audio-manifest.json', 'utf-8');
    const manifest = JSON.parse(raw);
    for (const entry of manifest.assets) {
      expect(ALL_KNOWN_KEYS.has(entry.key)).toBe(true);
      if (entry.url !== undefined) {
        expect(typeof entry.url).toBe('string');
        expect(entry.url.length).toBeGreaterThan(0);
      }
    }
  });

  it('known keys list matches expected SE and BGM keys', () => {
    expect(ALL_KNOWN_KEYS.size).toBe(KNOWN_SE_KEYS.length + KNOWN_BGM_KEYS.length);
    for (const key of KNOWN_SE_KEYS) {
      expect(key).toMatch(/^se_/);
    }
    for (const key of KNOWN_BGM_KEYS) {
      expect(key).toMatch(/^bgm_/);
    }
  });
});
