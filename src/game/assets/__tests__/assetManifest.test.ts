import { describe, it, expect } from 'vitest';
import { assetManifest, assetById, ENEMY_ASSET, WEAPON_ASSET, RARE_ASSET } from '../assetManifest';
import { YUI_GAMEPLAY_FRAME_ASSETS, YUI_HUD_FRAME_ASSETS } from '../playerFrames';
import { weapons } from '../../data/weapons';
import { enemies } from '../../data/enemies';
import { rareItems } from '../../data/rareItems';
import { evolutions } from '../../data/evolutions';

const IMAGE_EXT = /\.(png|webp)$/;

describe('assetManifest', () => {
  it('id が一意', () => {
    expect(new Set(assetManifest.map((a) => a.id)).size).toBe(assetManifest.length);
  });

  it('全エントリが正しい path / サイズ / kind を持つ', () => {
    for (const a of assetManifest) {
      expect(a.path, `${a.id} の path`).toMatch(IMAGE_EXT);
      expect(a.width).toBeGreaterThan(0);
      expect(a.height).toBeGreaterThan(0);
      expect(typeof a.required).toBe('boolean');
      expect(typeof a.fallback).toBe('boolean');
    }
  });

  it('ユイ4ポーズのpathがAseprite export設計と一致', () => {
    const expected = new Map([
      ['yui_idle', 'assets/sprites/player/yui_idle_42.png'],
      ['yui_move', 'assets/sprites/player/yui_move_42.png'],
      ['yui_hurt', 'assets/sprites/player/yui_hurt_42.png'],
      ['yui_ultimate', 'assets/sprites/player/yui_ultimate_42.png'],
    ]);
    for (const [id, path] of expected) {
      const asset = assetById.get(id);
      expect(asset?.path, id).toBe(path);
      expect(asset?.width, id).toBe(42);
      expect(asset?.height, id).toBe(42);
      expect(asset?.kind, id).toBe('player');
    }
  });

  it('Core5ユイのゲーム用17フレームが180px原本へ対応する', () => {
    expect(YUI_GAMEPLAY_FRAME_ASSETS).toHaveLength(17);
    for (const frame of YUI_GAMEPLAY_FRAME_ASSETS) {
      const asset = assetById.get(frame.id);
      expect(asset, frame.id).toBeTruthy();
      expect(asset?.path).toContain('core5-original-frames/yui/');
      expect(asset?.width).toBe(180);
      expect(asset?.height).toBe(180);
      expect(asset?.kind).toBe('player');
      expect(asset?.required).toBe(false);
    }
  });

  it('Core5ユイのHUD用4フレームが登録される', () => {
    expect(YUI_HUD_FRAME_ASSETS).toHaveLength(4);
    for (const frame of YUI_HUD_FRAME_ASSETS) {
      const asset = assetById.get(frame.id);
      expect(asset, frame.id).toBeTruthy();
      expect(asset?.path).toContain('core5-original-frames/yui/');
      expect(asset?.width).toBe(180);
      expect(asset?.height).toBe(180);
      expect(asset?.kind).toBe('player');
      expect(asset?.required).toBe(false);
    }
  });
});

describe('マッピングと manifest の対応漏れがない', () => {
  it('敵 visualKind がすべて manifest のアセットに対応', () => {
    for (const e of enemies) {
      const id = ENEMY_ASSET[e.visualKind];
      expect(id, `${e.id} (${e.visualKind})`).toBeTruthy();
      expect(assetById.has(id)).toBe(true);
    }
  });

  it('全武器（進化後含む）が manifest のアセットに対応', () => {
    for (const w of weapons) {
      const id = WEAPON_ASSET[w.id];
      expect(id, `${w.id} のアセット`).toBeTruthy();
      expect(assetById.has(id)).toBe(true);
    }
  });

  it('全レアアイテムが manifest のアセットに対応', () => {
    for (const r of rareItems) {
      const id = RARE_ASSET[r.id];
      expect(id, `${r.id} のアセット`).toBeTruthy();
      expect(assetById.has(id)).toBe(true);
    }
  });

  it('進化先武器すべてに専用アセットがある', () => {
    for (const evo of evolutions) {
      const id = WEAPON_ASSET[evo.evolvedWeaponId];
      expect(id, `${evo.evolvedWeaponId} のアセット`).toBeTruthy();
      expect(assetById.has(id)).toBe(true);
    }
  });

  it('ENEMY/WEAPON/RARE が指すアセットidはすべて実在する', () => {
    const ids = [...Object.values(ENEMY_ASSET), ...Object.values(WEAPON_ASSET), ...Object.values(RARE_ASSET)];
    for (const id of ids) expect(assetById.has(id), id).toBe(true);
  });
});
