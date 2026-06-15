import { describe, expect, it } from 'vitest';
import { PICKUP, PLAYER_DEFAULTS } from '../constants';

describe('player hitbox policy', () => {
  it('東方方式の判定サイズを維持する', () => {
    expect(PLAYER_DEFAULTS.radius).toBe(6);
    expect(PLAYER_DEFAULTS.visualSize).toBe(42);
  });

  it('キャラ改善でプレイヤー基礎値とpickup吸引値を巻き込まない', () => {
    expect(PLAYER_DEFAULTS.hp).toBe(110);
    expect(PLAYER_DEFAULTS.moveSpeed).toBe(115);
    expect(PLAYER_DEFAULTS.invulnSec).toBe(0.75);
    expect(PICKUP.collectRadius).toBe(22);
    expect(PICKUP.magnetRange).toBe(95);
    expect(PICKUP.magnetSpeed).toBe(280);
  });
});
