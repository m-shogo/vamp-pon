import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import type Phaser from 'phaser';

vi.mock('phaser', () => ({
  default: { Input: { Events: { POINTER_DOWN: 'pointerdown' } } },
}));

import {
  AUDIO_ASSET_SPECS,
  AudioManager,
  bgmKeyForStage,
  isCooldownReady,
  selectPreloadableAudioAssets,
  type AudioManifest,
} from './AudioManager';

function readManifest(): AudioManifest {
  return JSON.parse(fs.readFileSync('public/assets/audio/audio-manifest.json', 'utf-8')) as AudioManifest;
}

describe('audio-manifest.json contract', () => {
  it('is valid JSON and separates loaded assets from optional keys', () => {
    const manifest = readManifest();
    expect(manifest.version).toBe(2);
    expect(Array.isArray(manifest.assets)).toBe(true);
    expect(Array.isArray(manifest.optionalKeys)).toBe(true);
  });

  it('uses known, unique keys and URLs whose files exist', () => {
    const manifest = readManifest();
    const known = new Set(AUDIO_ASSET_SPECS.map((spec) => spec.key));
    const keys = new Set<string>();
    const urls = new Set<string>();
    for (const entry of manifest.assets ?? []) {
      expect(known.has(entry.key as never)).toBe(true);
      expect(keys.has(entry.key)).toBe(false);
      expect(urls.has(entry.url)).toBe(false);
      expect(fs.existsSync(path.join('public', entry.url.replace(/^\//, '').replace(/^assets\//, 'assets/')))).toBe(true);
      keys.add(entry.key);
      urls.add(entry.url);
    }
  });

  it('declares every file-less key optional without overlapping loaded assets', () => {
    const manifest = readManifest();
    const loaded = new Set((manifest.assets ?? []).map((entry) => entry.key));
    const optional = manifest.optionalKeys ?? [];
    expect(new Set(optional).size).toBe(optional.length);
    expect(optional.every((key) => !loaded.has(key))).toBe(true);
    expect(new Set([...loaded, ...optional])).toEqual(new Set(AUDIO_ASSET_SPECS.map((spec) => spec.key)));
  });

  it('filters unknown, empty and duplicate preload entries', () => {
    expect(selectPreloadableAudioAssets({
      assets: [
        { key: 'hit', url: '/assets/audio/hit.ogg' },
        { key: 'hit', url: '/assets/audio/hit-duplicate.ogg' },
        { key: 'ui_select', url: '/assets/audio/hit.ogg' },
        { key: 'unknown', url: '/assets/audio/unknown.ogg' },
        { key: 'bgm_top', url: '' },
      ],
    })).toEqual([{ key: 'hit', url: '/assets/audio/hit.ogg' }]);
  });
});

describe('AudioManager playback policy', () => {
  it('throttles repeated events at the cooldown boundary', () => {
    expect(isCooldownReady(100, 154, 55)).toBe(false);
    expect(isCooldownReady(100, 155, 55)).toBe(true);
    expect(isCooldownReady(undefined, 0, 55)).toBe(true);
  });

  it('does not throw when an optional SE is not loaded', () => {
    let unlock: (() => void) | undefined;
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    const scene = {
      input: { once: (_event: string, cb: () => void) => { unlock = cb; }, off: vi.fn() },
      sound: { setMute: vi.fn(), unlock: vi.fn(), play: vi.fn() },
      cache: { audio: { exists: () => false } },
      time: { now: 100 },
      tweens: { killTweensOf: vi.fn(), add: vi.fn() },
    } as unknown as Phaser.Scene;
    const manager = new AudioManager();
    manager.init(scene);
    manager.unlockOnFirstInput();
    unlock?.();
    expect(() => manager.playSe('hit')).not.toThrow();
    expect(debug).toHaveBeenCalledTimes(1);
    debug.mockRestore();
  });

  it('does not start the same BGM twice and selects Stage keys', () => {
    let unlock: (() => void) | undefined;
    const play = vi.fn();
    const add = vi.fn(() => ({ isPlaying: true, play, stop: vi.fn(), destroy: vi.fn() }));
    const scene = {
      input: { once: (_event: string, cb: () => void) => { unlock = cb; }, off: vi.fn() },
      sound: { setMute: vi.fn(), unlock: vi.fn(), add },
      cache: { audio: { exists: () => true } },
      time: { now: 0 },
      tweens: { add: vi.fn(), killTweensOf: vi.fn() },
    } as unknown as Phaser.Scene;
    const manager = new AudioManager();
    manager.init(scene);
    manager.unlockOnFirstInput();
    unlock?.();
    expect(manager.playBgm('bgm_stage1')).toBe(true);
    expect(manager.playBgm('bgm_stage1')).toBe(true);
    expect(add).toHaveBeenCalledTimes(1);
    expect(play).toHaveBeenCalledTimes(1);
    expect(bgmKeyForStage(1)).toBe('bgm_stage1');
    expect(bgmKeyForStage(2)).toBe('bgm_stage2');
  });

  it('persists mute and volume settings and restores mute after a scene rebind', () => {
    const values = new Map<string, string>();
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
      },
    });
    const firstSetMute = vi.fn();
    const firstOff = vi.fn();
    const first = {
      input: { once: vi.fn(), off: firstOff },
      sound: { setMute: firstSetMute },
    } as unknown as Phaser.Scene;
    const secondSetMute = vi.fn();
    const second = {
      input: { once: vi.fn(), off: vi.fn() },
      sound: { setMute: secondSetMute },
    } as unknown as Phaser.Scene;

    const manager = new AudioManager();
    manager.init(first);
    manager.unlockOnFirstInput();
    manager.setMasterVolume(0.5);
    manager.setBgmVolume(0.25);
    manager.setSeVolume(0.4);
    manager.mute();
    manager.init(second);

    expect(JSON.parse(values.get('vampPon.audio.v1') ?? '{}')).toEqual({
      master: 0.5, bgm: 0.25, se: 0.4, muted: true,
    });
    expect(firstOff).toHaveBeenCalledTimes(1);
    expect(secondSetMute).toHaveBeenCalledWith(true);
    vi.unstubAllGlobals();
  });
});
