import type Phaser from 'phaser';
import type { EnemyDefinition } from '../domain/types';
import type { RuntimeState, EnemyRuntime } from '../runtime';
import { nextIid } from '../runtime';
import { PLAYER_DEFAULTS, COLORS, GAME_STATUS } from '../domain/constants';
import { distance, normalize } from '../utils/math';
import { randRange } from '../utils/rng';
import { createEnemyView, enemyRadiusFor } from '../ui/factory';
import { inkPuff, shakeOnHit } from '../ui/effects';
import { spawnFragment, spawnCapsule } from './pickups';

const FLASH_SEC = 0.08;

export function spawnEnemy(
  scene: Phaser.Scene,
  state: RuntimeState,
  def: EnemyDefinition,
  x: number,
  y: number,
): void {
  const radius = enemyRadiusFor(def);
  const view = createEnemyView(scene, def, radius);
  view.setPosition(x, y);
  const isElite = def.tags.includes('elite');
  const enemy: EnemyRuntime = {
    iid: nextIid(state),
    defId: def.id,
    x,
    y,
    hp: def.hp,
    maxHp: def.hp,
    moveSpeed: def.moveSpeed,
    contactDamage: def.contactDamage,
    xpDrop: def.xpDrop,
    radius,
    behavior: def.behavior,
    isElite,
    dropsCapsule: !!def.drops?.some((d) => d.type === 'memory_capsule'),
    offsetSign: Math.random() < 0.5 ? -1 : 1,
    flashRemaining: 0,
    view,
    hpBar: isElite ? scene.add.graphics().setDepth(view.depth + 1) : null,
    dead: false,
  };
  state.enemies.push(enemy);
}

/** プレイヤー被弾処理。 */
export function applyPlayerDamage(scene: Phaser.Scene, state: RuntimeState, amount: number): void {
  const p = state.player;
  if (p.invulnRemaining > 0) return;
  p.hp -= amount;
  state.stats.damageTaken += amount;
  p.invulnRemaining = PLAYER_DEFAULTS.invulnSec;
  p.flashRemaining = PLAYER_DEFAULTS.invulnSec;
  shakeOnHit(scene);
  if (p.hp <= 0) {
    p.hp = 0;
    state.status = GAME_STATUS.GAMEOVER;
  }
}

/** 敵にダメージを与え、死亡時はドロップして除去する。 */
export function damageEnemy(scene: Phaser.Scene, state: RuntimeState, enemy: EnemyRuntime, amount: number): void {
  if (enemy.dead) return;
  enemy.hp -= amount;
  enemy.flashRemaining = FLASH_SEC;
  enemy.view.setScale(1.22);
  const blob = enemy.view.getData('blob') as Phaser.GameObjects.Arc | undefined;
  if (blob) blob.setFillStyle(0xffffff, 1);
  if (enemy.hp <= 0) {
    killEnemy(scene, state, enemy);
  }
}

export function killEnemy(scene: Phaser.Scene, state: RuntimeState, enemy: EnemyRuntime): void {
  if (enemy.dead) return;
  enemy.dead = true;
  state.stats.kills += 1;
  if (enemy.isElite) state.stats.elitesKilled += 1;

  // 欠片ドロップ
  const count = Math.max(1, Math.min(enemy.xpDrop, 5));
  const per = enemy.xpDrop / count;
  for (let i = 0; i < count; i += 1) {
    const ox = count > 1 ? randRange(-12, 12) : 0;
    const oy = count > 1 ? randRange(-12, 12) : 0;
    spawnFragment(scene, state, enemy.x + ox, enemy.y + oy, per);
  }

  if (enemy.dropsCapsule) {
    spawnCapsule(scene, state, enemy.x, enemy.y);
  }

  inkPuff(scene, enemy.x, enemy.y, enemy.radius, enemy.isElite);
  enemy.view.destroy();
  enemy.hpBar?.destroy();
}

/** 敵の移動・接触・点滅を更新する。 */
export function updateEnemies(scene: Phaser.Scene, state: RuntimeState, dt: number): void {
  const p = state.player;

  // プレイヤーの無敵/点滅減衰
  if (p.invulnRemaining > 0) p.invulnRemaining = Math.max(0, p.invulnRemaining - dt);
  if (p.flashRemaining > 0) {
    p.flashRemaining = Math.max(0, p.flashRemaining - dt);
    // 無敵中は点滅
    const blink = Math.floor(p.flashRemaining * 20) % 2 === 0 ? 0.4 : 1;
    state.playerView.setAlpha(blink);
  } else {
    state.playerView.setAlpha(1);
  }

  for (const e of state.enemies) {
    if (e.dead) continue;

    // 移動方向
    let dir = normalize(p.x - e.x, p.y - e.y);
    if (e.behavior === 'offset_chase') {
      const d = distance(e.x, e.y, p.x, p.y);
      if (d > 80) {
        const perp = { x: -dir.y, y: dir.x };
        dir = normalize(dir.x + perp.x * e.offsetSign * 0.6, dir.y + perp.y * e.offsetSign * 0.6);
      }
    }
    e.x += dir.x * e.moveSpeed * dt;
    e.y += dir.y * e.moveSpeed * dt;
    e.view.setPosition(e.x, e.y);

    // 命中スケールポップを徐々に戻す
    if (e.view.scaleX !== 1) {
      const s = e.view.scaleX + (1 - e.view.scaleX) * Math.min(1, dt * 12);
      e.view.setScale(Math.abs(s - 1) < 0.01 ? 1 : s);
    }

    // 点滅減衰
    if (e.flashRemaining > 0) {
      e.flashRemaining = Math.max(0, e.flashRemaining - dt);
      if (e.flashRemaining === 0) {
        const blob = e.view.getData('blob') as Phaser.GameObjects.Arc | undefined;
        if (blob) blob.setFillStyle(e.isElite ? COLORS.enemyElite : COLORS.enemyInk, 1);
      }
    }

    // エリートHPバー
    if (e.hpBar) {
      e.hpBar.clear();
      const w = e.radius * 2;
      const ratio = Math.max(0, e.hp / e.maxHp);
      e.hpBar.fillStyle(COLORS.hpBack, 0.8).fillRect(e.x - e.radius, e.y - e.radius - 8, w, 4);
      e.hpBar.fillStyle(COLORS.hpFill, 1).fillRect(e.x - e.radius, e.y - e.radius - 8, w * ratio, 4);
    }

    // 接触ダメージ
    if (p.invulnRemaining <= 0 && distance(e.x, e.y, p.x, p.y) <= p.radius + e.radius) {
      applyPlayerDamage(scene, state, e.contactDamage);
    }
  }

  state.enemies = state.enemies.filter((e) => !e.dead);
}
