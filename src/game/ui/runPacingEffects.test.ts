import { describe, expect, it } from 'vitest';
import { eliteStarts } from './runPacingRules';

describe('timing rules', () => {
  it('uses expected milestones', () => {
    expect(eliteStarts).toEqual([150, 300, 420]);
  });
});
