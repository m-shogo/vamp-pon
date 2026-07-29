import { describe, expect, it } from 'vitest';
import {
  SETTINGS_BASELINE,
  SETTINGS_BASELINE_RUNTIME_CONNECTION,
  validateSettingsBaseline,
} from './settingsBaseline';

describe('settings baseline', () => {
  it('release前に必要な4設定だけをCurrent baselineへ固定する', () => {
    expect(SETTINGS_BASELINE.map((setting) => setting.id)).toEqual([
      'bgmVolume',
      'seVolume',
      'hapticsEnabled',
      'reducedMotion',
    ]);
    expect(SETTINGS_BASELINE.map((setting) => setting.label)).toEqual([
      'BGM',
      'SE',
      '振動',
      '演出を控えめに',
    ]);
  });

  it('全設定をgameplay progress resetから分離する', () => {
    expect(SETTINGS_BASELINE.every((setting) => setting.persistence === 'APP_PREFERENCE')).toBe(true);
    expect(SETTINGS_BASELINE.every((setting) => setting.resetWithGameplayProgress === false)).toBe(true);
  });

  it('volumeはauthored mixへの0..1 multiplierに限定する', () => {
    const ranges = SETTINGS_BASELINE.filter((setting) => setting.kind === 'range');
    expect(ranges).toHaveLength(2);
    expect(ranges.every((setting) => setting.min === 0 && setting.max === 1)).toBe(true);
  });

  it('Definitionだけでruntime settings実装済みとは扱わない', () => {
    expect(validateSettingsBaseline()).toEqual([]);
    expect(SETTINGS_BASELINE_RUNTIME_CONNECTION).toBe('DEFINITION_NOT_CONNECTED');
  });
});
