import type Phaser from 'phaser';
import type { EnemyDefinition } from '../domain/types';
import type { RuntimeState, EnemyRuntime } from '../runtime';
import { nextIid } from '../runtime';
import { PLAYER_DEFAULTS, COLORS, GAME_STATUS } from '../domain/constants';
import { distance } from '../utils/math';
import { randRange } from '../utils/rng';
import { capsuleDropChanceFor, computeBehaviorStep } from '../domain/enemyRules';
import { createEnemyView, enemyRadiusFor } from '../ui/factory';
import { inkPuff, shakeOnHit } from '../ui/effects';
import { spawnFragment, spawnCapsule, spawnHealPickup } from './pickups';
import { berserkDamageMultiplier, chargeBerserkFromDamage } from './berserk';
import {
  ENEMY_PROTOTYPE_SHEETS,
  enemyPrototypeFacingForMotion,
} from '../assets/enemyPrototypeSheet';

const FLASH_SEC = 0.08;
const NORMAL_HEAL_DROP_CHANCE = 0.035;
const LOW_HP_HEAL_DROP_CHANCE = 0.09;
const ELITE_HEAL_DROP_CHANCE = 0.75;
const HEAL_AMOUNT = 18;
const ELITE_HEAL_AMOUNT = 36;
const DIRECTIONAL_SPRITE_CACHE_KEY = 'enemyPrototypeDirectionalSprite';

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
  const capsuleDropChance = capsuleDropChanceFor(def);
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
    capsuleDropChance,
    offsetSign: Math.random() < 0.5 ? -1 : 1,
    flashRemaining: 0,
    view,
    hpBar: isElite ? scene.add.graphics().setDepth(view.depth + 1) : null,
    dead: false,
  };
  state.enemies.push(enemy);
}

/** プレイヤー被弾処理。暴走ゲージは実際に失ったHPだけで増える。 */
export function applyPlayerDamage(scene: Phaser.Scene, state: RuntimeState, amount: number): void {
  const p = state.player;
  if (p.invulnRemaining > 0) return;
  const appliedDamage = Math.min(p.hp, Math.max(0, amount));
  if (appliedDamage <= 0) return;
  p.hp -= appliedDamage;
  state.stats.damageTaken += appliedDamage;
  chargeBerserkFromDamage(state, appliedDamage);
  if (state.telemetry.firstDamageSec === null) state.telemetry.firstDamageSec = state.elapsedSec;
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
  enemy.hp -= amount * berserkDamageMultiplier(state);
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
  if (state.telemetry.firstKillSec === null) state.telemetry.firstKillSec = state.elapsedSec;
  if (enemy.isElite) {
    state.stats.elitesKilled += 1;
    state.telemetry.eliteKillSecs.push(state.elapsedSec);
  }

  const count = Math.max(1, Math.min(enemy.xpDrop, 5));
  const per = enemy.xpDrop / count;
  for (let i = 0; i < count; i += 1) {
    const ox = count > 1 ? randRange(-12, 12) : 0;
    const oy = count > 1 ? randRange(-12, 12) : 0;
    spawnFragment(scene, state, enemy.x + ox, enemy.y + oy, per);
  }

  maybeDropHeal(scene, state, enemy);

  if (enemy.capsuleDropChance > 0 && Math.random() < enemy.capsuleDropChance) {
    spawnCapsule(scene, state, enemy.x, enemy.y);
  }

  inkPuff(scene, enemy.x, enemy.y, enemy.radius, enemy.isElite);
  enemy.view.destroy();
  enemy.hpBar?.destroy();
}

function maybeDropHeal(scene: Phaser.Scene, state: RuntimeState, enemy: EnemyRuntime): void {
  const p = state.player;
  if (p.hp >= p.maxHp) return;

  const hpRatio = p.hp / p.maxHp;
  const chance = enemy.isElite
    ? ELITE_HEAL_DROP_CHANCE
    : hpRatio <= 0.35
      ? LOW_HP_HEAL_DROP_CHANCE
      : NORMAL_HEAL_DROP_CHANCE;

  if (Math.random() >= chance) return;
  const amount = enemy.isElite ? ELITE_HEAL_AMOUNT : HEAL_AMOUNT;
  spawnHealPickup(scene, state, enemy.x + randRange(-10, 10), enemy.y + randRange(-10, 10), amount);
}

function directionalEnemySprite(
  view: Phaser.GameObjects.Container,
): Phaser.GameObjects.Image | null {
  const cached = view.getData(DIRECTIONAL_SPRITE_CACHE_KEY) as Phaser.GameObjects.Image | undefined;
  if (cached) return cached;

  const sprite = view.list.find((child) => {
    const candidate = child as Phaser.GameObjects.Image;
    return typeof candidate.getData === 'function'
      && candidate.getData('enemyPrototypeDirectional') === true;
  }) as Phaser.GameObjects.Image | undefined;

  if (!sprite) return null;
  view.setData(DIRECTIONAL_SPRITE_CACHE_KEY, sprite);
  return sprite;
}

function updateEnemyPrototypeFacing(
  scene: Phaser.Scene,
  view: Phaser.GameObjects.Container,
  dirX: number,
  dirY: number,
): void {
  const sprite = directionalEnemySprite(view);
  if (!sprite) return;

  const frame = sprite.getData('enemyPrototypeFrame') as number | undefined;
  if (frame == null) return;

  const facing = enemyPrototypeFacingForMotion(dirX, dirY);
  const desiredSheet = ENEMY_PROTOTYPE_SHEETS[facing];
  const fallbackSheet = facing === 'front'
    ? ENEMY_PROTOTYPE_SHEETS.left
    : ENEMY_PROTOTYPE_SHEETS.front;
  const sheet = scene.textures.exists(desiredSheet.id)
    ? desiredSheet
    : scene.textures.exists(fallbackSheet.id)
      ? fallbackSheet
      : null;

  if (!sheet) return;
  if (sprite.texture.key !== sheet.id) sprite.setTexture(sheet.id, frame);

  const usingLeftSheet = sheet.id === ENEMY_PROTOTYPE_SHEETS.left.id;
  sprite.setFlipX(usingLeftSheet && dirX > 0);
}

/** 敵の移動・接触・点滅を更新する。 */
export function updateEnemies(scene: Phaser.Scene, state: RuntimeState, dt: number): void {
  const p = state.player;

  if (p.invulnRemaining > 0) p.invulnRemaining = Math.max(0, p.invulnRemaining - dt);
  if (p.flashRemaining > 0) {
    p.flashRemaining = Math.max(0, p.flashRemaining - dt);
    const blink = Math.floor(p.flashRemaining * 20) % 2 === 0 ? 0.4 : 1;
    state.playerView.setAlpha(blink);
  } else {
    state.playerView.setAlpha(1);
  }

  for (const e of state.enemies) {
    if (e.dead) continue;

    const step = computeBehaviorStep({
      behavior: e.behavior,
      dx: p.x - e.x,
      dy: p.y - e.y,
      dist: distance(e.x, e.y, p.x, p.y),
      offsetSign: e.offsetSign,
      iid: e.iid,
      elapsedSec: state.elapsedSec,
    });
    updateEnemyPrototypeFacing(scene, e.view, step.dirX, step.dirY);
    e.x += step.dirX * e.moveSpeed * step.speedFactor * dt;
    e.y += step.dirY * e.moveSpeed * step.speedFactor * dt;
    e.view.setPosition(e.x, e.y);

    if (e.view.scaleX !== 1) {
      const s = e.view.scaleX + (1 - e.view.scaleX) * Math.min(1, dt * 12);
      e.view.setScale(Math.abs(s - 1) < 0.01 ? 1 : s);
    }

    if (e.flashRemaining > 0) {
      e.flashRemaining = Math.max(0, e.flashRemaining - dt);
      if (e.flashRemaining === 0) {
        const blob = e.view.getData('blob') as Phaser.GameObjects.Arc | undefined;
        const baseFill = (e.view.getData('baseFill') as number | undefined) ?? COLORS.enemyInk;
        const baseAlpha = (e.view.getData('baseAlpha') as number | undefined) ?? 1;
        if (blob) blob.setFillStyle(baseFill, baseAlpha);
      }
    }

    if (e.hpBar) {
      e.hpBar.clear();
      const w = e.radius * 2;
      const ratio = Math.max(0, e.hp / e.maxHp);
      e.hpBar.fillStyle(COLORS.hpBack, 0.8).fillRect(e.x - e.radius, e.y - e.radius - 8, w, 4);
      e.hpBar.fillStyle(COLORS.hpFill, 1).fillRect(e.x - e.radius, e.y - e.radius - 8, w * ratio, 4);
    }

    if (p.invulnRemaining <= 0 && distance(e.x, e.y, p.x, p.y) <= p.radius + e.radius) {
      applyPlayerDamage(scene, state, e.contactDamage);
    }
  }

  state.enemies = state.enemies.filter((e) => !e.dead);
}
