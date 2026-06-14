import { describe, expect, it } from 'vitest';
import { PLAYER_DEFAULTS } from '../constants';

describe('player hitbox policy', () => {
  it('東方方式の判定サイズを維持する', () => {
    expect(PLAYER_DEFAULTS.radius).toBe(6);
    expect(PLAYER_DEFAULTS.visualSize).toBe(36);
  });
});
