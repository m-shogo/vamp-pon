import type Phaser from 'phaser';
import type { EnemyDefinition } from '../domain/types';
import type { RuntimeState, EnemyRuntime } from '../runtime';
import { nextIid } from '../runtime';
import { PLAYER_DEFAULTS, COLORS, GAME_STATUS, GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { clamp, distance, normalize } from '../utils/math';
import { randRange } from '../utils/rng';
import { capsuleDropChanceFor, chargerPhaseFor, computeBehaviorStep } from '../domain/enemyRules';
import { createEnemyView, enemyRadiusFor } from '../ui/factory';
import { capsuleRewardBurst, inkPuff, shakeOnHit } from '../ui/effects';
import { spawnFragment, spawnCapsule, spawnHealPickup } from './pickups';
import { berserkDamageMultiplier, chargeBerserkFromDamage } from './berserk';
import { stagePowerForStage } from '../data/stageScaling';
import { depthForState, profileBonuses } from '../persistence/profile';
import { GAME_FEEL_CONFIG } from '../config/GameFeelConfig';
import { getAudioManager } from '../audio/AudioManager';
import { getEffectManager } from '../effects/EffectManager';
import { recordEnemyDefeated, recordEnemySeen } from './runCollectionMetrics';
import { tryConsumeSurvivalRevival } from './survivalRevival';
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
  hpMultiplier = 1,
): void {
  recordEnemySeen(state.stats, def.id);
  const depth = depthForState(state);
  const stage = stagePowerForStage(state.stageNumber);
  const radius = enemyRadiusFor(def);
  const view = createEnemyView(scene, def, radius);
  view.setPosition(x, y);
  const isElite = def.tags.includes('elite');
  const capsuleDropChance = capsuleDropChanceFor(def);
  const hp = Math.max(1, def.hp * depth.enemyHp * stage.enemyHp * hpMultiplier);
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
  if (isElite) {
    view.setScale(1.15);
  }
  state.enemies.push(enemy);
  if (def.id === 'black_label_shadow' && scene.data.get('vampPonBossWarningShown') !== true) {
    scene.data.set('vampPonBossWarningShown', true);
    getAudioManager(scene).playSe('boss_warning', { volume: 0.64, priority: 3 });
    getEffectManager(scene).bossWarning({ label: 'オンブロ 接近' });
  }
}

/** プレイヤー被弾処理。暴走ゲージは実際に失ったHPだけで増える。 */
export function applyPlayerDamage(
  scene: Phaser.Scene,
  state: RuntimeState,
  amount: number,
  source?: { x: number; y: number; strong?: boolean },
): void {
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
  if (source) {
    const dir = normalize(p.x - source.x, p.y - source.y);
    const knockback = source.strong ? 10 : 6;
    p.x = clamp(p.x + dir.x * knockback, p.radius, GAME_WIDTH - p.radius);
    p.y = clamp(p.y + dir.y * knockback, p.radius, GAME_HEIGHT - p.radius);
    state.playerView.setPosition(p.x, p.y);
  }
  getAudioManager(scene).playSe('player_damage', { volume: 0.66, priority: source?.strong ? 2 : 1 });
  const effects = getEffectManager(scene);
  effects.playerDamage();
  effects.playerDamageView(state.playerView, { sourceX: source?.x, sourceY: source?.y, strong: source?.strong });
  shakeOnHit(scene);
  if (p.hp <= 0) {
    if (tryConsumeSurvivalRevival(state)) return;
    p.hp = 0;
    state.status = GAME_STATUS.GAMEOVER;
  }
}

/** 敵にダメージを与え、死亡時はドロップして除去する。 */
export function damageEnemy(scene: Phaser.Scene, state: RuntimeState, enemy: EnemyRuntime, amount: number): void {
  if (enemy.dead) return;
  enemy.hp -= amount * berserkDamageMultiplier(state);
  enemy.flashRemaining = FLASH_SEC;
  const effects = getEffectManager(scene);
  effects.enemyHitView(enemy.view, enemy.x, enemy.y, state.player.x, state.player.y, { elite: enemy.isElite });
  getAudioManager(scene).playSe('hit', { volume: 0.42, rate: 0.95 + Math.random() * 0.1 });
  if (enemy.isElite && amount >= enemy.maxHp * 0.08) {
    getAudioManager(scene).playSe('boss_hit', { volume: 0.48, rate: 0.94, priority: 1 });
  }
  effects.hit(enemy.x, enemy.y, { elite: enemy.isElite, strong: amount >= enemy.maxHp * 0.2 });
  if (amount >= enemy.maxHp * 0.2) effects.hitStop(GAME_FEEL_CONFIG.hitStopMs.hit);
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
  const effects = getEffectManager(scene);
  effects.enemyDeath(enemy.x, enemy.y, {
    elite: enemy.isElite,
    defId: enemy.defId,
    black: (state.berserk?.activeRemaining ?? 0) > 0,
  });
  getAudioManager(scene).playEnemyDeath(effects.combo(), enemy.isElite);

  if (enemy.defId === 'black_label_shadow') {
    getAudioManager(scene).playSe('boss_defeat', { volume: 0.72, priority: 4 });
  }

  if (enemy.isElite) {
    showEliteDefeatBanner(scene, state.stageNumber);
  }

  const count = Math.max(1, Math.min(Math.ceil(enemy.xpDrop), 5));
  const per = (enemy.xpDrop * GAME_FEEL_CONFIG.expGemValueScale) / count;
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
  effects.enemyDeathView(enemy.view, { elite: enemy.isElite, defId: enemy.defId });
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

function showEliteDefeatBanner(scene: Phaser.Scene, stageNumber: number): void {
  const label = stageNumber === 2 ? '雨影がほどけた' : '影がほどけた';
  const text = scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.38, label, {
    fontFamily: 'serif',
    fontSize: '18px',
    color: '#ffe7c8',
    fontStyle: 'bold',
    resolution: 2,
  }).setOrigin(0.5).setDepth(210).setAlpha(0);
  text.setStroke('#0a0816', 4);
  scene.tweens.add({
    targets: text,
    alpha: { from: 0, to: 1 },
    y: text.y - 12,
    duration: 300,
    ease: 'Quad.easeOut',
    hold: 600,
    yoyo: true,
    onComplete: () => text.destroy(),
  });
}

const ELITE_HP_BAR_WIDTH = 36;
const ELITE_HP_BAR_HEIGHT = 4;

function drawEliteHpBar(e: EnemyRuntime): void {
  const bar = e.hpBar!;
  bar.clear();
  const ratio = Math.max(0, e.hp / e.maxHp);
  const x = e.x - ELITE_HP_BAR_WIDTH / 2;
  const y = e.y - e.radius * 1.4 - 6;
  bar.fillStyle(0x0a0816, 0.7);
  bar.fillRect(x - 1, y - 1, ELITE_HP_BAR_WIDTH + 2, ELITE_HP_BAR_HEIGHT + 2);
  const fillColor = ratio > 0.5 ? 0xc8a0ff : ratio > 0.25 ? 0xffd080 : 0xff7070;
  bar.fillStyle(fillColor, 0.9);
  bar.fillRect(x, y, ELITE_HP_BAR_WIDTH * ratio, ELITE_HP_BAR_HEIGHT);
}

function createInkPuddleThreat(
  scene: Phaser.Scene,
  state: RuntimeState,
  x: number,
  y: number,
  damage: number,
  radius: number,
  delaySec: number,
): void {
  const g = scene.add.graphics().setDepth(82);
  g.fillStyle(0x1a1028, 0.18).fillCircle(x, y, radius);
  g.lineStyle(2, 0xa98bff, 0.58).strokeCircle(x, y, radius);
  g.lineStyle(1, 0x1c1630, 0.62).strokeCircle(x, y, radius * 0.72);

  scene.tweens.add({
    targets: g,
    alpha: 0.35,
    yoyo: true,
    repeat: Math.max(1, Math.floor(delaySec * 4)),
    duration: 120,
  });

  scene.time.delayedCall(delaySec * 1000, () => {
    if (state.status !== GAME_STATUS.PLAYING) {
      g.destroy();
      return;
    }
    const p = state.player;
    const inRange = distance(x, y, p.x, p.y) <= radius + p.radius;
    if (inRange) applyPlayerDamage(scene, state, damage, { x, y, strong: true });
    inkPuff(scene, x, y, radius * 0.45, false);
    scene.tweens.add({
      targets: g,
      alpha: 0,
      duration: 280,
      onComplete: () => g.destroy(),
    });
  });
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
    updateChargerTelegraph(e, p.x, p.y, state.elapsedSec);
    maybeUseSpecialAttack(scene, state, e, dt);
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
        if (blob) blob.setFillStyle(e.isElite ? COLORS.enemyElite : COLORS.enemyInk, 1);
      }
    }

    if (e.hpBar && e.isElite) {
      drawEliteHpBar(e);
    }

    const d = distance(e.x, e.y, p.x, p.y);
    if (d <= e.radius + p.radius) applyPlayerDamage(scene, state, e.contactDamage, { x: e.x, y: e.y, strong: e.isElite });
  }

  state.enemies = state.enemies.filter((e) => !e.dead);
}
