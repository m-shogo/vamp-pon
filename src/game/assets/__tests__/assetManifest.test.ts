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
    expect(new Set(assetManifest.map((asset) => asset.id)).size).toBe(assetManifest.length);
  });

  it('実画像entryとfallback-only entryを区別する', () => {
    for (const asset of assetManifest) {
      expect(asset.width).toBeGreaterThan(0);
      expect(asset.height).toBeGreaterThan(0);
      expect(typeof asset.required).toBe('boolean');
      expect(typeof asset.fallback).toBe('boolean');

      if (asset.path) {
        expect(asset.path, `${asset.id} の path`).toMatch(IMAGE_EXT);
      } else {
        expect(asset.fallback, `${asset.id} fallback-only`).toBe(true);
        expect(asset.required, `${asset.id} fallback-only required`).toBe(false);
      }
    }
  });

  it('旧ユイ4ポーズは画像pathを持たずCore5 fallback互換だけ残す', () => {
    for (const id of ['yui_idle', 'yui_move', 'yui_hurt', 'yui_ultimate']) {
      const asset = assetById.get(id);
      expect(asset, id).toBeTruthy();
      expect(asset?.path, id).toBeUndefined();
      expect(asset?.fallback, id).toBe(true);
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

describe('マッピングとmanifestの対応', () => {
  it('敵 visualKind がすべて対応する', () => {
    for (const enemy of enemies) {
      const id = ENEMY_ASSET[enemy.visualKind];
      expect(id, `${enemy.id} (${enemy.visualKind})`).toBeTruthy();
      expect(assetById.has(id)).toBe(true);
    }
  });

  it('全武器が対応する', () => {
    for (const weapon of weapons) {
      const id = WEAPON_ASSET[weapon.id];
      expect(id, `${weapon.id} のアセット`).toBeTruthy();
      expect(assetById.has(id)).toBe(true);
    }
  });

  it('全レアアイテムが対応する', () => {
    for (const rare of rareItems) {
      const id = RARE_ASSET[rare.id];
      expect(id, `${rare.id} のアセット`).toBeTruthy();
      expect(assetById.has(id)).toBe(true);
    }
  });

  it('全進化先が対応する', () => {
    for (const evolution of evolutions) {
      const id = WEAPON_ASSET[evolution.evolvedWeaponId];
      expect(id, `${evolution.evolvedWeaponId} のアセット`).toBeTruthy();
      expect(assetById.has(id)).toBe(true);
    }
  });
});
