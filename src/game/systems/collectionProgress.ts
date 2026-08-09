import type { RuntimeState } from '../runtime';
import {
  forgottenStreetNightBoard,
  forgottenStreetNightBoardCells,
  type NightBoardCell,
} from '../data/collectionProgress';
import {
  hasCalmedStage1LegacyTarget,
  hasReleasedStage1LegacyTarget,
} from '../data/stage1LegacyRuntimeCompatibility';
import { meetsStage1RunEarnedMetaCurrencyTarget } from '../data/collectionEconomyTerminology';
import { loadProfile, saveProfile } from '../persistence/profile';
import { loadCollectionProgress, saveCollectionProgress } from '../persistence/collection';
import { getEnemyDefeats, getHealsCollected, getSeenEnemyIds } from './runCollectionMetrics';

export type CollectionSettlement = {
  boardId: string;
  boardName: string;
  newlyCompleted: NightBoardCell[];
  newlyRevealed: NightBoardCell[];
  newlyHinted: NightBoardCell[];
  newlySeenEnemyIds: string[];
  newlyReleasedEnemyIds: string[];
  lightCoinReward: number;
  travelPrepReward: number;
  memoryTextIds: string[];
  completedCount: number;
  totalCells: number;
};

export function settleCollectionProgress(state: RuntimeState, cleared: boolean): CollectionSettlement {
  const progress = loadCollectionProgress();
  const seenBefore = new Set(progress.seenEnemyIds);
  const releasedBefore = new Set(
    Object.entries(progress.defeatedEnemyCounts)
      .filter(([, count]) => count > 0)
      .map(([id]) => id),
  );
  const revealedBefore = new Set(progress.nightBoard.revealedCellIds);
  const hintedBefore = new Set(progress.nightBoard.hintedCellIds);

  const runSeenEnemyIds = getSeenEnemyIds(state.stats);
  const runEnemyDefeats = getEnemyDefeats(state.stats);

  for (const enemyId of runSeenEnemyIds) {
    if (!progress.seenEnemyIds.includes(enemyId)) progress.seenEnemyIds.push(enemyId);
  }
  for (const [enemyId, count] of Object.entries(runEnemyDefeats)) {
    progress.defeatedEnemyCounts[enemyId] = (progress.defeatedEnemyCounts[enemyId] ?? 0) + count;
  }

  if (state.stats.capsulesOpened > 0 && !progress.discoveredLostItemIds.includes('memory_capsule')) {
    progress.discoveredLostItemIds.push('memory_capsule');
  }

  if (cleared && state.stageNumber >= 5 && !progress.calmedBossIds.includes('bag_yorishiro')) {
    progress.calmedBossIds.push('bag_yorishiro');
  }
  if (cleared && state.stageNumber >= 10 && !progress.calmedBossIds.includes('yanushi_nemori')) {
    progress.calmedBossIds.push('yanushi_nemori');
  }

  const newlyCompleted: NightBoardCell[] = [];
  for (const cell of forgottenStreetNightBoardCells) {
    if (progress.nightBoard.completedCellIds.includes(cell.id)) continue;
    if (!isCellComplete(cell.id, state, cleared, progress, runEnemyDefeats)) continue;
    progress.nightBoard.completedCellIds.push(cell.id);
    progress.nightBoard.claimedCellIds.push(cell.id);
    newlyCompleted.push(cell);
  }

  const completedNow = new Set(progress.nightBoard.completedCellIds);
  for (const cell of forgottenStreetNightBoardCells) {
    const canReveal = !cell.revealBy?.length || cell.revealBy.some((id) => completedNow.has(id));
    if (!canReveal) continue;
    if (cell.kind === 'secret' && !completedNow.has(cell.id)) {
      if (!progress.nightBoard.hintedCellIds.includes(cell.id)) progress.nightBoard.hintedCellIds.push(cell.id);
      continue;
    }
    if (!progress.nightBoard.revealedCellIds.includes(cell.id)) progress.nightBoard.revealedCellIds.push(cell.id);
  }

  const memoryTextIds: string[] = [];
  let lightCoinReward = 0;
  let travelPrepReward = 0;
  for (const cell of newlyCompleted) {
    if (cell.reward.type === 'light_coin') lightCoinReward += cell.reward.amount ?? 0;
    if (cell.reward.type === 'travel_prep') travelPrepReward += cell.reward.amount ?? 0;
    if (cell.reward.type === 'memory_text' && cell.reward.memoryTextId) {
      memoryTextIds.push(cell.reward.memoryTextId);
      if (!progress.unlockedMemoryTextIds.includes(cell.reward.memoryTextId)) {
        progress.unlockedMemoryTextIds.push(cell.reward.memoryTextId);
      }
    }
  }

  if (travelPrepReward > 0) {
    // TODO(collection): travel_prep（旅支度）報酬の実通貨は未実装。
    // 現状は完了ログだけ残し、リザルト表示でも「準備済みカゲモノ」マーカーとして扱う。
    const marker = `travel_prep:${forgottenStreetNightBoard.id}:${progress.nightBoard.completedCellIds.length}`;
    if (!progress.unlockedMemoryTextIds.includes(marker)) progress.unlockedMemoryTextIds.push(marker);
  }

  saveCollectionProgress(progress);

  if (lightCoinReward > 0) {
    const profile = loadProfile();
    profile.currency += lightCoinReward;
    profile.totalCurrencyEarned += lightCoinReward;
    saveProfile(profile);
  }

  const revealedNow = new Set(progress.nightBoard.revealedCellIds);
  const hintedNow = new Set(progress.nightBoard.hintedCellIds);
  const seenNow = new Set(progress.seenEnemyIds);
  const releasedNow = new Set(Object.keys(progress.defeatedEnemyCounts));

  return {
    boardId: forgottenStreetNightBoard.id,
    boardName: forgottenStreetNightBoard.name,
    newlyCompleted,
    newlyRevealed: forgottenStreetNightBoardCells.filter((cell) => revealedNow.has(cell.id) && !revealedBefore.has(cell.id)),
    newlyHinted: forgottenStreetNightBoardCells.filter((cell) => hintedNow.has(cell.id) && !hintedBefore.has(cell.id)),
    newlySeenEnemyIds: [...seenNow].filter((id) => !seenBefore.has(id)),
    newlyReleasedEnemyIds: [...releasedNow].filter((id) => !releasedBefore.has(id)),
    lightCoinReward,
    travelPrepReward,
    memoryTextIds,
    completedCount: progress.nightBoard.completedCellIds.length,
    totalCells: forgottenStreetNightBoardCells.length,
  };
}

function isCellComplete(
  cellId: string,
  state: RuntimeState,
  cleared: boolean,
  progress: ReturnType<typeof loadCollectionProgress>,
  runEnemyDefeats: Record<string, number>,
): boolean {
  const weaponLevel = (weaponId: string) => state.inventory.weapons.find((weapon) => weapon.id === weaponId)?.level ?? 0;
  const stage1Cleared = cleared && state.stageNumber === 1;
  const hpRatio = state.player.maxHp > 0 ? state.player.hp / state.player.maxHp : 0;

  switch (cellId) {
    case 'fs_001_release_ink_shadow':
      return hasReleasedStage1LegacyTarget('ink_shadow', progress.defeatedEnemyCounts, runEnemyDefeats);
    case 'fs_002_release_paper_scrap_shadow':
      return hasReleasedStage1LegacyTarget('paper_scrap_shadow', progress.defeatedEnemyCounts, runEnemyDefeats);
    case 'fs_003_release_night_haze':
      return hasReleasedStage1LegacyTarget('night_haze', progress.defeatedEnemyCounts, runEnemyDefeats);
    case 'fs_004_release_black_label_shadow':
      return hasReleasedStage1LegacyTarget('black_label_shadow', progress.defeatedEnemyCounts, runEnemyDefeats);
    case 'fs_005_calm_bag_yorishiro':
      return hasCalmedStage1LegacyTarget('bag_yorishiro', progress.calmedBossIds) || (cleared && state.stageNumber >= 5);
    case 'fs_006_clear_depth_1': return stage1Cleared;
    case 'fs_007_clear_depth_1_high_hp': return stage1Cleared && hpRatio >= 0.5;
    case 'fs_008_clear_depth_1_no_black_form': return stage1Cleared && state.stats.berserkUses === 0;
    case 'fs_009_clear_depth_1_fast': return stage1Cleared && state.stats.survivedSec <= 240;
    case 'fs_010_collect_200_memory_fragments': return state.stats.memoryFragmentsCollected >= 200;
    case 'fs_011_level_pencil_5': return weaponLevel('night_pencil') >= 5;
    case 'fs_012_level_paper_plane_5': return weaponLevel('paper_airplane') >= 5;
    // TODO(collection): 灯技/必殺で倒したカゲモノ数を正確に取れていない。
    // 暫定で「必殺発動 + 総撃破数」で代替。weapon/ultimate kill別カウントが入ったら差し替え。
    case 'fs_013_lantern_weapon_100_releases': return state.stats.ultimateUses > 0 && state.stats.kills >= 100;
    case 'fs_014_ultimate_50_releases': return state.stats.ultimateUses > 0 && state.stats.kills >= 50;
    case 'fs_015_first_fusion': return state.stats.evolutions.length > 0;
    case 'fs_016_first_lost_item': return state.stats.capsulesOpened > 0 || progress.discoveredLostItemIds.includes('memory_capsule');
    case 'fs_017_no_heal_3_min': return state.stats.survivedSec >= 180 && getHealsCollected(state.stats) === 0;
    case 'fs_018_clear_low_hp': return cleared && hpRatio > 0 && hpRatio <= 0.3;
    case 'fs_019_collect_100_light_coin': return meetsStage1RunEarnedMetaCurrencyTarget(state.stats);
    case 'fs_020_reach_light_level_10': return state.player.level >= 10;
    case 'fs_021_clear_single_weapon': return stage1Cleared && state.inventory.weapons.length <= 1;
    case 'fs_022_clear_with_1_hp': return cleared && state.player.hp <= 1;
    case 'fs_023_calm_yorishiro_with_ultimate':
      return state.stats.ultimateUses > 0 && (
        hasCalmedStage1LegacyTarget('bag_yorishiro', progress.calmedBossIds) ||
        (cleared && state.stageNumber >= 5)
      );
    // TODO(collection): eliteKillSecs は「ラン経過秒」基準で、本来狙う「出現から20秒以内」とは異なる。
    // スポーン時刻を保持できるようにしたら差し替える。
    case 'fs_024_release_onbro_fast': return state.telemetry.eliteKillSecs.some((sec) => sec <= 20);
    case 'fs_025_view_nemori_record':
      return hasCalmedStage1LegacyTarget('yanushi_nemori', progress.calmedBossIds) || (cleared && state.stageNumber >= 10);
    default: return false;
  }
}
