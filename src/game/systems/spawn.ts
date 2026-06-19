import type Phaser from 'phaser';
import type { RuntimeState } from '../runtime';
import type { WaveDefinition, WaveSpawnDefinition } from '../domain/types';
import { wavesForStage } from '../data/waves';
import { enemyById } from '../data/enemies';
import { DEFAULT_GAME_CONFIG } from '../domain/constants';
import { spawnEnemy } from './enemies';
import { pickSpawnPosition } from '../utils/viewport';
import { depthForState } from '../persistence/profile';

/** ウェーブ表に従って敵をスポーンする。アキュムレータはランごとに新規生成。 */
export class SpawnSystem {
  private rateAccum = new Map<string, number>();
  private firedOneShots = new Set<string>();

  update(scene: Phaser.Scene, state: RuntimeState, dt: number): void {
    if (state.enemies.length >= DEFAULT_GAME_CONFIG.maxEnemies) return;
    const wave = this.findWave(state.elapsedSec, state.stageNumber);
    if (!wave) return;

    for (let i = 0; i < wave.spawns.length; i += 1) {
      const spawn = wave.spawns[i];
      const key = `${state.stageNumber}:${wave.start}:${spawn.enemyId}:${i}`;
      if (spawn.spawnCount != null) {
        this.handleOneShot(scene, state, spawn, key);
      } else if (spawn.spawnRatePerSecond != null) {
        this.handleRate(scene, state, spawn, key, dt);
      }
    }
  }

  private findWave(t: number, stageNumber: number): WaveDefinition | null {
    for (const w of wavesForStage(stageNumber)) {
      if (t >= w.start && t < w.end) return w;
    }
    return null;
  }

  private aliveOfType(state: RuntimeState, enemyId: string): number {
    let n = 0;
    for (const e of state.enemies) if (e.defId === enemyId) n += 1;
    return n;
  }

  private handleOneShot(scene: Phaser.Scene, state: RuntimeState, spawn: WaveSpawnDefinition, key: string): void {
    if (this.firedOneShots.has(key)) return;
    this.firedOneShots.add(key);
    const def = enemyById.get(spawn.enemyId);
    if (!def) return;
    const depth = depthForState(state);
    const count = Math.max(1, Math.round((spawn.spawnCount ?? 1) * depth.spawnCount));
    for (let i = 0; i < count; i += 1) {
      const pos = pickSpawnPosition(spawn.directionWeights, state.player);
      spawnEnemy(scene, state, def, pos.x, pos.y);
    }
  }

  private handleRate(
    scene: Phaser.Scene,
    state: RuntimeState,
    spawn: WaveSpawnDefinition,
    key: string,
    dt: number,
  ): void {
    const def = enemyById.get(spawn.enemyId);
    if (!def) return;
    const depth = depthForState(state);
    const maxAlive = spawn.maxAlive != null ? Math.ceil(spawn.maxAlive * depth.maxAlive) : Infinity;
    if (this.aliveOfType(state, spawn.enemyId) >= maxAlive) return;

    const acc = (this.rateAccum.get(key) ?? 0) + (spawn.spawnRatePerSecond ?? 0) * depth.spawnRate * dt;
    let toSpawn = Math.floor(acc);
    this.rateAccum.set(key, acc - toSpawn);

    while (
      toSpawn > 0 &&
      this.aliveOfType(state, spawn.enemyId) < maxAlive &&
      state.enemies.length < DEFAULT_GAME_CONFIG.maxEnemies
    ) {
      const pos = pickSpawnPosition(spawn.directionWeights, state.player);
      spawnEnemy(scene, state, def, pos.x, pos.y);
      toSpawn -= 1;
    }
  }
}
