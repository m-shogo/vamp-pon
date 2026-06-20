import type Phaser from 'phaser';
import type { EnemyDefinition } from '../domain/types';
import type { RuntimeState, EnemyRuntime } from '../runtime';
import { nextIid } from '../runtime';
import { PLAYER_DEFAULTS, COLORS, GAME_STATUS } from '../domain/constants';
import { distance } from '../utils/math';
import { randRange } from '../utils/rng';
import { capsuleDropChanceFor, chargerPhaseFor, computeBehaviorStep } from '../domain/enemyRules';
import { createEnemyView, enemyRadiusFor } from '../ui/factory';
import { capsuleRewardBurst, inkPuff, shakeOnHit } from '../ui/effects';
import { spawnFragment, spawnCapsule, spawnHealPickup } from './pickups';
import { berserkDamageMultiplier, chargeBerserkFromDamage } from './berserk';
import { stagePowerForStage } from '../data/stageScaling';
import { depthForState, profileBonuses } from '../persistence/profile';
import { recordEnemyDefeated, recordEnemySeen } from './runCollectionMetrics';
import {
  ENEMY_PROTOTYPE_SHEETS,
  enemyPrototypeFacingForMotion,
} from '../assets/enemyPrototypeSheet';

const FLASH_SEC = 0.08;
const NORMAL_HEAL_DROP_CHANCE = 0.055;
const LOW_HP_HEAL_DROP_CHANCE = 0.14;
const ELITE_HEAL_DROP_CHANCE = 0.75;
const MAX_ACTIVE_HEAL_PICKUPS = 5;
const HEAL_AMOUNT = 18;
const ELITE_HEAL_AMOUNT = 36;
const DIRECTIONAL_SPRITE_CACHE_KEY = 'enemyPrototypeDirectionalSprite';
const SPECIAL_ATTACK_START_SEC = 110;

export function spawnEnemy(
  scene: Phaser.Scene,
  state: RuntimeState,
  def: EnemyDefinition,
  x: number,
  y: number,
): void {
  recordEnemySeen(state.stats, def.id);
  const depth = depthForState(state);
  const stage = stagePowerForStage(state.stageNumber);
  const radius = enemyRadiusFor(def);
  const view = createEnemyView(scene, def, radius);
  view.setPosition(x, y);
  const isElite = def.tags.includes('elite');
  const capsuleDropChance = capsuleDropChanceFor(def);
  const hp = Math.max(1, def.hp * depth.enemyHp * stage.enemyHp);
  const enemy: EnemyRuntime = {
    iid: nextIid(state),
    defId: def.id,
    x,
    y,
    hp,
    maxHp: hp,
    moveSpeed: def.moveSpeed * depth.enemySpeed * stage.enemySpeed,
    contactDamage: def.contactDamage * depth.enemyDamage * stage.enemyDamage,
    xpDrop: def.xpDrop * depth.xp * stage.xp,
    radius,
    behavior: def.behavior,
    isElite,
    capsuleDropChance,
    offsetSign: Math.random() < 0.5 ? -1 : 1,
    flashRemaining: 0,
    specialAttackCooldown: randRange(1.2, 3.8),
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
  const reducedAmount = amount * profileBonuses().damageTakenMultiplier;
  const appliedDamage = Math.min(p.hp, Math.max(0, reducedAmount));
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
  recordEnemyDefeated(state.stats, enemy.defId);
  if (state.telemetry.firstKillSec === null) state.telemetry.firstKillSec = state.elapsedSec;
  if (enemy.isElite) {
    state.stats.elitesKilled += 1;
    state.telemetry.eliteKillSecs.push(state.elapsedSec);
  }

  const count = Math.max(1, Math.min(Math.ceil(enemy.xpDrop), 5));
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
  if (enemy.defId === 'black_capsule') {
    capsuleRewardBurst(scene, enemy.x, enemy.y);
  }

  inkPuff(scene, enemy.x, enemy.y, enemy.radius, enemy.isElite);
  enemy.view.destroy();
  enemy.hpBar?.destroy();
}

function maybeDropHeal(scene: Phaser.Scene, state: RuntimeState, enemy: EnemyRuntime): void {
  const p = state.player;
  if (p.hp >= p.maxHp) return;
  if (state.pickups.filter((pickup) => pickup.kind === 'heal').length >= MAX_ACTIVE_HEAL_PICKUPS) return;

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

function updateChargerTelegraph(enemy: EnemyRuntime, playerX: number, playerY: number, elapsedSec: number): void {
  const telegraph = enemy.view.getData('chargerTelegraph') as Phaser.GameObjects.Graphics | undefined;
  if (!telegraph) return;
  // charger telegraph continues below
  telegraph.clear();
  if (enemy.behavior !== 'charger') {
    telegraph.setVisible(false);
    return;
  }

  const phase = chargerPhaseFor({ iid: enemy.iid, elapsedSec });
  if (phase === 'recovery') {
    telegraph.setVisible(false);
    return;
  }

  const dx = playerX - enemy.x;
  const dy = playerY - enemy.y;
  const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
  const ux = dx / len;
  const uy = dy / len;
  const reach = phase === 'dash' ? enemy.radius * 4.2 : enemy.radius * 3.4;
  const alpha = phase === 'dash' ? 0.72 : 0.46;
  const color = phase === 'dash' ? 0xffd0aa : 0xff8e7a;

  telegraph.setVisible(true);
  telegraph.lineStyle(phase === 'dash' ? 3 : 2, color, alpha);
  telegraph.beginPath();
  telegraph.moveTo(ux * enemy.radius * 0.8, uy * enemy.radius * 0.8);
  telegraph.lineTo(ux * reach, uy * reach);
  telegraph.strokePath();
  telegraph.lineStyle(2, color, alpha * 0.8).strokeCircle(0, 0, enemy.radius + (phase === 'dash' ? 5 : 2));
}

function maybeUseSpecialAttack(scene: Phaser.Scene, state: RuntimeState, enemy: EnemyRuntime, dt: number): void {
  if (state.elapsedSec < SPECIAL_ATTACK_START_SEC) return;
  enemy.specialAttackCooldown -= dt;
  if (enemy.specialAttackCooldown > 0) return;

  if (enemy.defId === 'black_capsule') {
    enemy.specialAttackCooldown = randRange(4.2, 6.2);
    createInkPuddleThreat(scene, state, enemy.x, enemy.y, enemy.contactDamage * 0.45, 44, 0.55);
    return;
  }

  if (enemy.defId === 'night_haze') {
    enemy.specialAttackCooldown = randRange(3.4, 5.1);
    createInkPuddleThreat(scene, state, state.player.x, state.player.y, enemy.contactDamage * 0.55, 54, 0.72);
    return;
  }

  if (enemy.isElite) {
    enemy.specialAttackCooldown = randRange(3.0, 4.4);
    createInkPuddleThreat(scene, state, state.player.x + randRange(-24, 24), state.player.y + randRange(-24, 24), enemy.contactDamage * 0.5, 62, 0.85);
  }
}

function createInkPuddleThreat(
  scene: Phaser.Scene,
  state: RuntimeState,
  x: number,
  y: number,
  damage: number,
  radius: number,
  warningSec: number,
): void {
  const g = scene.add.graphics().setDepth(state.playerView.depth - 1);
  g.setPosition(x, y);
  g.fillStyle(COLORS.ink, 0.1).fillCircle(0, 0, radius);
  g.lineStyle(2, 0x9b5cff, 0.55).strokeCircle(0, 0, radius);
  scene.tweens.add({ targets: g, alpha: 0.55, yoyo: true, repeat: 2, duration: warningSec * 300 });
  scene.time.delayedCall(warningSec * 1000, () => {
    if (!scene.scene.isActive()) { g.destroy(); return; }
    const hit = distance(state.player.x, state.player.y, x, y) <= radius + state.player.radius;
    if (hit) applyPlayerDamage(scene, state, damage);
    g.clear();
    g.fillStyle(COLORS.ink, 0.22).fillCircle(0, 0, radius);
    scene.tweens.add({ targets: g, alpha: 0, duration: 520, onComplete: () => g.destroy() });
  });
}

export function updateEnemies(scene: Phaser.Scene, state: RuntimeState, dt: number): void {
  const p = state.player;
  for (const e of state.enemies) {
    if (e.dead) continue;
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const step = computeBehaviorStep(e, p.x, p.y, state.elapsedSec, dt);
    e.x += step.x;
    e.y += step.y;
    e.view.setPosition(e.x, e.y);
    updateEnemyPrototypeFacing(scene, e.view, dx, dy);
    if (e.hpBar) updateHpBar(e);
    if (e.flashRemaining > 0) {
      e.flashRemaining -= dt;
      if (e.flashRemaining <= 0) {
        const blob = e.view.getData('blob') as Phaser.GameObjects.Arc | undefined;
        if (blob) blob.setFillStyle(e.isElite ? 0x10121e : COLORS.ink, 1);
        e.view.setScale(1);
      }
    }
    maybeUseSpecialAttack(scene, state, e, dt);
    if (distance(e.x, e.y, p.x, p.y) <= e.radius + p.radius) applyPlayerDamage(scene, state, e.contactDamage);
  }
  state.enemies = state.enemies.filter((e) => !e.dead);
}

function updateHpBar(enemy: EnemyRuntime): void {
  const g = enemy.hpBar;
  if (!g) return;
  g.clear();
  const ratio = Math.max(0, enemy.hp / enemy.maxHp);
  const width = 46;
  g.setPosition(enemy.x - width / 2, enemy.y - enemy.radius - 10);
  g.fillStyle(0x160d25, 0.78).fillRoundedRect(0, 0, width, 5, 3);
  g.fillStyle(0xf5d58a, 0.95).fillRoundedRect(0, 0, width * ratio, 5, 3);
}
