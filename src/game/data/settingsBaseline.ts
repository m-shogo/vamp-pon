import { WORLD_TERMS } from './worldTerms';

export type SettingsBaselineId =
  | 'bgmVolume'
  | 'seVolume'
  | 'hapticsEnabled'
  | 'reducedMotion';

export type SettingsBaselineDefinition = {
  id: SettingsBaselineId;
  label: string;
  kind: 'range' | 'toggle';
  defaultValue: number | boolean;
  min?: number;
  max?: number;
  step?: number;
  persistence: 'APP_PREFERENCE';
  resetWithGameplayProgress: false;
  notes: string[];
};

/**
 * Minimal production settings surface before RC.
 *
 * Numeric volume values are multipliers over the authored mix. `1` means
 * authored level, not a promise about device loudness or measured latency.
 */
export const SETTINGS_BASELINE: SettingsBaselineDefinition[] = [
  {
    id: 'bgmVolume',
    label: WORLD_TERMS.settings.bgm,
    kind: 'range',
    defaultValue: 1,
    min: 0,
    max: 1,
    step: 0.05,
    persistence: 'APP_PREFERENCE',
    resetWithGameplayProgress: false,
    notes: ['authored BGM mixへ乗算する', 'gameplay progress resetと分離する'],
  },
  {
    id: 'seVolume',
    label: WORLD_TERMS.settings.se,
    kind: 'range',
    defaultValue: 1,
    min: 0,
    max: 1,
    step: 0.05,
    persistence: 'APP_PREFERENCE',
    resetWithGameplayProgress: false,
    notes: ['authored SE mixへ乗算する', '重要stateはSE OFFでも視覚で残す'],
  },
  {
    id: 'hapticsEnabled',
    label: WORLD_TERMS.settings.haptics,
    kind: 'toggle',
    defaultValue: true,
    persistence: 'APP_PREFERENCE',
    resetWithGameplayProgress: false,
    notes: ['unsupported deviceでは安全にno-op', 'OFFでもcritical stateを理解可能にする'],
  },
  {
    id: 'reducedMotion',
    label: WORLD_TERMS.settings.reducedMotion,
    kind: 'toggle',
    defaultValue: false,
    persistence: 'APP_PREFERENCE',
    resetWithGameplayProgress: false,
    notes: [
      'camera shake・large zoom・long travel・lantern pulse・ink spreadを弱める',
      '操作可能になる時刻は遅らせない',
      'platform preferenceを取得できる場合は初期値候補にできるがuser overrideを優先する',
    ],
  },
];

export const SETTINGS_BASELINE_RUNTIME_CONNECTION = 'DEFINITION_NOT_CONNECTED' as const;

export function validateSettingsBaseline(): string[] {
  const errors: string[] = [];
  const ids = new Set<SettingsBaselineId>();
  for (const setting of SETTINGS_BASELINE) {
    if (ids.has(setting.id)) errors.push(`duplicate settings baseline id: ${setting.id}`);
    ids.add(setting.id);
    if (!setting.label.trim()) errors.push(`${setting.id} missing player label`);
    if (setting.persistence !== 'APP_PREFERENCE') errors.push(`${setting.id} must use APP_PREFERENCE`);
    if (setting.resetWithGameplayProgress !== false) errors.push(`${setting.id} must survive gameplay progress reset`);
    if (setting.kind === 'range') {
      if (typeof setting.defaultValue !== 'number') errors.push(`${setting.id} range default must be numeric`);
      if (setting.min !== 0 || setting.max !== 1) errors.push(`${setting.id} range must use 0..1 multiplier`);
      if (!setting.step || setting.step <= 0) errors.push(`${setting.id} range step must be positive`);
    }
    if (setting.kind === 'toggle' && typeof setting.defaultValue !== 'boolean') {
      errors.push(`${setting.id} toggle default must be boolean`);
    }
  }
  const expected: SettingsBaselineId[] = ['bgmVolume', 'seVolume', 'hapticsEnabled', 'reducedMotion'];
  for (const id of expected) if (!ids.has(id)) errors.push(`missing required settings baseline id: ${id}`);
  if (ids.size !== expected.length) errors.push(`settings baseline must contain exactly ${expected.length} required settings`);
  return errors;
}
