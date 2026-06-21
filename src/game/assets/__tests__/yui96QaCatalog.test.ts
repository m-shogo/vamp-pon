import { describe, expect, it } from 'vitest';
import {
  YUI_BASIC_48_KEYS,
  YUI_EXPRESSION_RAGE_48_KEYS,
  yui96Cells,
  yuiEquipmentQaNote,
} from '../yui96QaCatalog';

describe('yui96QaCatalog', () => {
  it('defines two unique 48-cell catalogs', () => {
    expect(YUI_BASIC_48_KEYS).toHaveLength(48);
    expect(YUI_EXPRESSION_RAGE_48_KEYS).toHaveLength(48);
    expect(new Set(YUI_BASIC_48_KEYS).size).toBe(48);
    expect(new Set(YUI_EXPRESSION_RAGE_48_KEYS).size).toBe(48);
  });

  it('maps indexes to an 8x6 grid', () => {
    const cells = yui96Cells(YUI_BASIC_48_KEYS);
    expect(cells[0]).toEqual({ index: 0, row: 1, column: 1, key: 'idle_front' });
    expect(cells[47]).toEqual({ index: 47, row: 6, column: 8, key: 'effect_icon' });
  });

  it('keeps body-relative equipment notes directional', () => {
    const cells = yui96Cells(YUI_BASIC_48_KEYS);
    expect(yuiEquipmentQaNote(cells[10])).toContain('奥側');
    expect(yuiEquipmentQaNote(cells[12])).toContain('手前側');
    expect(yuiEquipmentQaNote(cells[14])).toContain('左腰');
  });
});
