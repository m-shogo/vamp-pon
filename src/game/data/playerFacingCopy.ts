import { formatMetaCurrencyCarryHome, formatMetaCurrencyUseCta } from './metaCurrencyDisplay.ts';
import { WORLD_TERMS } from './worldTerms.ts';

/**
 * Short player-facing copy authority for active production UI.
 *
 * This does not change save/runtime IDs. It exists so Web/Unity implementations
 * can converge on one vocabulary instead of re-introducing screen-local strings.
 */
export const PLAYER_FACING_COPY = {
  title: WORLD_TERMS.product.title,
  navigation: {
    start: WORLD_TERMS.screens.start,
    stageSelect: WORLD_TERMS.screens.stageSelect,
    collection: WORLD_TERMS.screens.collection,
    growth: WORLD_TERMS.screens.upgrade,
    settings: WORLD_TERMS.screens.settings,
    retry: WORLD_TERMS.screens.retry,
  },
  firstRun: {
    move: '指を置いて、そのまま動かす',
    autoAttack: '攻撃は自動。',
    fragmentLevelUp: `${WORLD_TERMS.economy.runFragment}を拾ってレベルアップ。`,
  },
  result: {
    clearTitle: WORLD_TERMS.records.stageClear,
    defeatTitle: '夜に飲まれた',
    defeatExplanation: 'この読み方では、朝まで残れなかった。',
    rewardsHeading: '持ち帰り',
    newRecordsHeading: '新しい記録',
    eliteLabel: '強敵',
    defeatedEnemiesLabel: 'ほどいた影',
    noBlackYoukaLabel: `${WORLD_TERMS.kokuyou.transformation}なし`,
  },
} as const;

export function formatPlayerCarryHomeCopy(): string {
  return `朝まで残れなくても、${formatMetaCurrencyCarryHome()}`;
}

export function formatPlayerGrowthCta(): string {
  return formatMetaCurrencyUseCta();
}

export const PLAYER_FACING_LEGACY_COPY_TARGETS = [
  'VAMP PON',
  '忘れ物帳',
  '黒曜研究所',
  '黒曜なし',
  'EXPを拾ってレベルアップ',
  'Rewards',
  'New Records',
  'Elite',
] as const;

export const PLAYER_FACING_COPY_RUNTIME_CONNECTION = 'ACTIVE_WEB_AND_UNITY_CONNECTED' as const;
