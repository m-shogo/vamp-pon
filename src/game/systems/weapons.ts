import type Phaser from 'phaser';
import type { WeaponDefinition } from '../domain/types';
import type { RuntimeState, EnemyRuntime, ProjectileRuntime, GroundAreaRuntime, OrbiterRuntime } from '../runtime';
import { nextIid } from '../runtime';
import { weaponById } from '../data/weapons';
import { PROJECTILE } from '../domain/constants';
import { distance, normalize, randomAngle, angleToVec } from '../utils/math';
import { isFarOffscreen } from '../utils/viewport';
import { GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import {
  createProjectileView,
  createMarbleView,
  createAreaView,
  createOrbiterView,
} from '../ui/factory';
import { damageEnemy } from './enemies';

type EffectValues = Record<string, number | string | boolean>;

const MARBLE_BASE_SPEED = 150;
const RADIAL_BASE_SPEED = 200;

/** レベル効果を畳み込んで具体値を得る。 */
function resolveWeapon(def: WeaponDefinition, level: number): EffectValues {
  const base: EffectValues = { ...def.levels[0].effect } as EffectValues;
  for (let l = 2; l <= level; l += 1) {
    const eff = def.levels[l - 1]?.effect;
    if (!eff) continue;
    for (const [k, v] of Object.entries(eff)) {
      if (k === 'type' || k === 'targeting' || k === 'evolved') {
        base[k] = v as string | boolean;
        continue;
      }
      if (k.endsWith('Add')) {
        const bk = k.slice(0, -3);
        base[bk] = ((base[bk] as number) ?? 0) + (v as number);
      } else if (k.endsWith('Multiplier')) {
        const bk = k.slice(0, -'Multiplier'.length);
        base[bk] = ((base[bk] as number) ?? 1) * (v as number);
      } else {
        base[k] = v as number | string | boolean;
      }
    }
  }
  return base;
}

function num(eff: EffectValues, key: string, fallback = 0): number {
  const v = eff[key];
  return typeof v === 'number' ? v : fallback;
}

export function findNearestEnemy(state: RuntimeState, x: number, y: number): EnemyRuntime | null {
  let best: EnemyRuntime | null = null;
  let bestD = Infinity;
  for (const e of state.enemies) {
    if (e.dead) continue;
    const d = distance(e.x, e.y, x, y);
    if (d < bestD) {
      bestD = d;
      best = e;
    }
  }
  return best;
}

/** 武器の発射・弾/範囲/オービターの更新をまとめて行う。 */
export function updateWeapons(scene: Phaser.Scene, state: RuntimeState, dt: number): void {
  const p = state.player;

  for (const weapon of state.inventory.weapons) {
    const def = weaponById.get(weapon.id);
    if (!def) continue;
    const eff = resolveWeapon(def, weapon.level);
    const type = eff.type as string;

    if (type === 'orbit') {
      // オービターは常時。発射クールダウンなし。
      continue;
    }

    weapon.cooldownRemaining -= dt;
    if (weapon.cooldownRemaining > 0) continue;

    const cooldown = num(eff, 'cooldown', 1.25) * p.cooldownMultiplier;
    weapon.cooldownRemaining = cooldown;
    fireWeapon(scene, state, type, eff);
  }

  updateOrbiters(scene, state, dt);
  updateProjectiles(scene, state, dt);
  updateAreas(scene, state, dt);
}

function fireWeapon(scene: Phaser.Scene, state: RuntimeState, type: string, eff: EffectValues): void {
  const p = state.player;
  const damage = num(eff, 'damage', 0) * p.might;

  switch (type) {
    case 'projectile': {
      const target = findNearestEnemy(state, p.x, p.y);
      if (!target) break;
      const count = Math.max(1, num(eff, 'projectiles', 1));
      const pierce = num(eff, 'pierce', 0);
      const baseAngle = Math.atan2(target.y - p.y, target.x - p.x);
      for (let i = 0; i < count; i += 1) {
        const spread = (i - (count - 1) / 2) * 0.18;
        const a = baseAngle + spread;
        spawnProjectile(scene, state, {
          kind: eff.evolved ? 'star' : 'pencil',
          angle: a,
          speed: PROJECTILE.nightPencilSpeed,
          damage,
          hitsLeft: pierce + 1,
          bouncesLeft: 0,
          life: PROJECTILE.lifeSec,
        });
      }
      break;
    }
    case 'radial_random_projectile': {
      const count = Math.max(1, num(eff, 'projectiles', 3));
      const speed = RADIAL_BASE_SPEED * num(eff, 'speed', 1);
      for (let i = 0; i < count; i += 1) {
        spawnProjectile(scene, state, {
          kind: 'star',
          angle: randomAngle(),
          speed,
          damage,
          hitsLeft: 1,
          bouncesLeft: 0,
          life: PROJECTILE.lifeSec,
        });
      }
      break;
    }
    case 'bouncing_projectile': {
      const count = Math.max(1, num(eff, 'projectiles', 1));
      const speed = MARBLE_BASE_SPEED * num(eff, 'speed', 1);
      const bounces = num(eff, 'bounces', 1);
      const life = num(eff, 'duration', 2.5);
      for (let i = 0; i < count; i += 1) {
        spawnProjectile(scene, state, {
          kind: 'marble',
          angle: randomAngle(),
          speed,
          damage,
          hitsLeft: Infinity,
          bouncesLeft: bounces,
          life,
        });
      }
      break;
    }
    case 'ground_area': {
      const target = findNearestEnemy(state, p.x, p.y);
      const maxAreas = Math.max(1, num(eff, 'maxAreas', 1));
      const alive = state.areas.length;
      if (alive >= maxAreas) {
        // 最古を消す
        const oldest = state.areas.shift();
        oldest?.view.destroy();
      }
      const tx = target ? target.x : p.x;
      const ty = target ? target.y : p.y;
      spawnArea(scene, state, {
        x: tx,
        y: ty,
        radius: num(eff, 'radius', 45),
        dps: num(eff, 'damagePerSecond', 5) * p.might,
        duration: num(eff, 'duration', 2),
      });
      break;
    }
  }
}

type ProjectileSpec = {
  kind: 'pencil' | 'star' | 'marble';
  angle: number;
  speed: number;
  damage: number;
  hitsLeft: number;
  bouncesLeft: number;
  life: number;
};

function spawnProjectile(scene: Phaser.Scene, state: RuntimeState, spec: ProjectileSpec): void {
  const p = state.player;
  const v = angleToVec(spec.angle);
  const view =
    spec.kind === 'marble'
      ? createMarbleView(scene, PROJECTILE.radius + 1)
      : createProjectileView(scene, spec.kind === 'star' ? 'star' : 'pencil', PROJECTILE.radius);
  view.setPosition(p.x, p.y);
  const proj: ProjectileRuntime = {
    iid: nextIid(state),
    x: p.x,
    y: p.y,
    vx: v.x * spec.speed,
    vy: v.y * spec.speed,
    damage: spec.damage,
    radius: PROJECTILE.radius,
    hitsLeft: spec.hitsLeft,
    bouncesLeft: spec.bouncesLeft,
    lifeRemaining: spec.life,
    hitSet: new Set<number>(),
    view,
    dead: false,
  };
  state.projectiles.push(proj);
}

function updateProjectiles(scene: Phaser.Scene, state: RuntimeState, dt: number): void {
  for (const proj of state.projectiles) {
    if (proj.dead) continue;
    proj.x += proj.vx * dt;
    proj.y += proj.vy * dt;
    proj.lifeRemaining -= dt;

    if (proj.lifeRemaining <= 0) {
      proj.dead = true;
      proj.view.destroy();
      continue;
    }

    // 壁反射（ビー玉）/ 画面外カル
    if (isFarOffscreen(proj.x, proj.y, 8)) {
      if (proj.bouncesLeft > 0) {
        if (proj.x < 0 || proj.x > GAME_WIDTH) proj.vx *= -1;
        if (proj.y < 0 || proj.y > GAME_HEIGHT) proj.vy *= -1;
        proj.x = Math.max(0, Math.min(GAME_WIDTH, proj.x));
        proj.y = Math.max(0, Math.min(GAME_HEIGHT, proj.y));
        proj.bouncesLeft -= 1;
      } else {
        proj.dead = true;
        proj.view.destroy();
        continue;
      }
    }

    proj.view.setPosition(proj.x, proj.y);

    // 衝突
    for (const e of state.enemies) {
      if (e.dead) continue;
      if (proj.hitSet.has(e.iid)) continue;
      if (distance(proj.x, proj.y, e.x, e.y) <= proj.radius + e.radius) {
        damageEnemy(scene, state, e, proj.damage);
        proj.hitSet.add(e.iid);
        if (Number.isFinite(proj.hitsLeft)) {
          proj.hitsLeft -= 1;
          if (proj.hitsLeft <= 0) {
            proj.dead = true;
            proj.view.destroy();
            break;
          }
        }
      }
    }
  }
  state.projectiles = state.projectiles.filter((pr) => !pr.dead);
}

function spawnArea(
  scene: Phaser.Scene,
  state: RuntimeState,
  spec: { x: number; y: number; radius: number; dps: number; duration: number },
): void {
  const view = createAreaView(scene, spec.radius);
  view.setPosition(spec.x, spec.y);
  const area: GroundAreaRuntime = {
    iid: nextIid(state),
    x: spec.x,
    y: spec.y,
    radius: spec.radius,
    dps: spec.dps,
    remaining: spec.duration,
    tickAccum: 0,
    view,
    dead: false,
  };
  state.areas.push(area);
}

const AREA_TICK = 0.25;

function updateAreas(scene: Phaser.Scene, state: RuntimeState, dt: number): void {
  for (const area of state.areas) {
    if (area.dead) continue;
    area.remaining -= dt;
    if (area.remaining <= 0) {
      area.dead = true;
      area.view.destroy();
      continue;
    }
    area.tickAccum += dt;
    while (area.tickAccum >= AREA_TICK) {
      area.tickAccum -= AREA_TICK;
      const tickDamage = area.dps * AREA_TICK;
      for (const e of state.enemies) {
        if (e.dead) continue;
        if (distance(area.x, area.y, e.x, e.y) <= area.radius + e.radius) {
          damageEnemy(scene, state, e, tickDamage);
        }
      }
    }
  }
  state.areas = state.areas.filter((a) => !a.dead);
}

/** 月のしおり（オービター）。所持していれば常時回転し近接攻撃する。 */
function updateOrbiters(scene: Phaser.Scene, state: RuntimeState, dt: number): void {
  const orbitWeapon = state.inventory.weapons.find((w) => {
    const def = weaponById.get(w.id);
    return def && (def.levels[0].effect.type as string) === 'orbit';
  });

  if (!orbitWeapon) {
    for (const o of state.orbiters) o.view.destroy();
    state.orbiters = [];
    state.orbitHitCooldowns.clear();
    return;
  }

  const def = weaponById.get(orbitWeapon.id)!;
  const eff = resolveWeapon(def, orbitWeapon.level);
  const count = Math.max(1, num(eff, 'orbiters', 1));
  const radius = num(eff, 'radius', 60);
  const damage = num(eff, 'damage', 8) * state.player.might;
  const hitInterval = num(eff, 'hitInterval', 0.6);
  const orbitRadius = 12;

  // オービター数を同期
  while (state.orbiters.length < count) {
    const o: OrbiterRuntime = { angle: 0, view: createOrbiterView(scene) };
    state.orbiters.push(o);
  }
  while (state.orbiters.length > count) {
    state.orbiters.pop()?.view.destroy();
  }

  state.orbitAngle += dt * 2.4;
  const p = state.player;

  // ヒットクールダウン減衰
  for (const [iid, t] of state.orbitHitCooldowns) {
    const nt = t - dt;
    if (nt <= 0) state.orbitHitCooldowns.delete(iid);
    else state.orbitHitCooldowns.set(iid, nt);
  }

  state.orbiters.forEach((o, i) => {
    const a = state.orbitAngle + (i / count) * Math.PI * 2;
    const ox = p.x + Math.cos(a) * radius;
    const oy = p.y + Math.sin(a) * radius;
    o.angle = a;
    o.view.setPosition(ox, oy);

    for (const e of state.enemies) {
      if (e.dead) continue;
      if (state.orbitHitCooldowns.has(e.iid)) continue;
      if (distance(ox, oy, e.x, e.y) <= orbitRadius + e.radius) {
        damageEnemy(scene, state, e, damage);
        state.orbitHitCooldowns.set(e.iid, hitInterval);
      }
    }
  });
}
