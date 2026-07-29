export type EconomyNamingStatus =
  | 'CURRENT_RUNTIME_ID'
  | 'CURRENT_DISPLAY_PENDING_REVIEW'
  | 'CURRENT_TRACKED_COUNTER_PENDING_NAME'
  | 'NOT_CURRENCY';

export type EconomyResourceDefinition = {
  id: string;
  concept: string;
  namingStatus: EconomyNamingStatus;
  storagePaths: string[];
  runtimeIds: string[];
  currentDisplayLabels: string[];
  spendable: boolean;
  persistent: boolean;
  autoRenameAllowed: false;
  notes: string[];
};

export const META_UPGRADE_CURRENCY_ID = 'economy:meta_upgrade_currency';
export const RUN_MEMORY_FRAGMENT_ID = 'economy:run_memory_fragment';
/** Stable compatibility ID. The counter is now real-tracked; only its display name remains under review. */
export const PROTOTYPE_LIGHT_COIN_COUNTER_ID = 'economy:prototype_light_coin_counter';
export const RUN_EARNED_META_CURRENCY_COUNTER_ID = PROTOTYPE_LIGHT_COIN_COUNTER_ID;
export const BLACK_YOUKA_MECHANIC_ID = 'mechanic:black_youka';
export const STAGE1_RUN_EARNED_META_CURRENCY_TARGET = 100;
export const RUN_EARNED_META_CURRENCY_TRANSIENT_FIELD = 'earnedMetaCurrencyThisRun';

export type RunEarnedMetaCurrencyStats = {
  earnedMetaCurrencyThisRun?: number;
};

function normalizeEarnedMetaCurrency(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.floor(numeric));
}

/**
 * Records the already-calculated run settlement amount on transient runtime stats.
 * This is not a wallet, is not persisted, and deliberately excludes achievement rewards.
 */
export function recordRunEarnedMetaCurrency(
  stats: object,
  amount: number,
): number {
  const normalized = normalizeEarnedMetaCurrency(amount);
  (stats as RunEarnedMetaCurrencyStats).earnedMetaCurrencyThisRun = normalized;
  return normalized;
}

export function readRunEarnedMetaCurrency(stats: object): number {
  return normalizeEarnedMetaCurrency(
    (stats as RunEarnedMetaCurrencyStats).earnedMetaCurrencyThisRun,
  );
}

export function meetsStage1RunEarnedMetaCurrencyTarget(stats: object): boolean {
  return readRunEarnedMetaCurrency(stats) >= STAGE1_RUN_EARNED_META_CURRENCY_TARGET;
}

export const collectionEconomyResources: EconomyResourceDefinition[] = [
  {
    id: META_UPGRADE_CURRENCY_ID,
    concept: '探索後に持ち帰り、永続強化・返還・実績報酬へ使う保存資源',
    namingStatus: 'CURRENT_DISPLAY_PENDING_REVIEW',
    storagePaths: [
      'PlayerProfile.currency',
      'PlayerProfile.totalCurrencyEarned',
    ],
    runtimeIds: [
      'profile.currency',
      'RunSettlement.currencyEarned',
      'RunSettlement.achievementReward',
      'NightBoardReward.type:light_coin',
      'UpgradeId:currencyGain',
    ],
    currentDisplayLabels: ['黒曜片'],
    spendable: true,
    persistent: true,
    autoRenameAllowed: false,
    notes: [
      '保存fieldと内部reward typeは互換IDとして維持する。',
      '黒曜片という表示名は経済命名レビュー対象であり、黒耀化の誤記修正と同時に置換しない。',
      '新表示名を採用する場合もsave field currencyとreward type light_coinはalias migrationを経る。',
    ],
  },
  {
    id: RUN_MEMORY_FRAGMENT_ID,
    concept: 'ラン中に拾い、経験値・成長へ変換される記憶の欠片',
    namingStatus: 'CURRENT_RUNTIME_ID',
    storagePaths: [],
    runtimeIds: [
      'RuntimeStats.memoryFragmentsCollected',
      'pickup:memory_fragment',
    ],
    currentDisplayLabels: ['記憶片'],
    spendable: false,
    persistent: false,
    autoRenameAllowed: false,
    notes: [
      '永続強化資源ではない。',
      'ラン終了時のmeta currency計算へ数値寄与するが、同一resourceではない。',
    ],
  },
  {
    id: PROTOTYPE_LIGHT_COIN_COUNTER_ID,
    concept: 'Stage1札「灯貨あつめ」が読む、1ランの実獲得meta currency一時カウンター',
    namingStatus: 'CURRENT_TRACKED_COUNTER_PENDING_NAME',
    storagePaths: [],
    runtimeIds: [
      'NightBoardCell:fs_019_collect_100_light_coin',
      `transient:RunStats.${RUN_EARNED_META_CURRENCY_TRANSIENT_FIELD}`,
    ],
    currentDisplayLabels: ['灯貨'],
    spendable: false,
    persistent: false,
    autoRenameAllowed: false,
    notes: [
      'walletではなく、RunSettlement.currencyEarnedの確定値をラン終了時だけ読むmetricである。',
      'achievementReward、profile残高、記憶片数からのproxy計算は含めない。',
      '表示名「灯貨」はHuman naming review前なので永続通貨名へ自動昇格しない。',
    ],
  },
  {
    id: BLACK_YOUKA_MECHANIC_ID,
    concept: '感情と黒インクが一つの読みへ固定される戦闘・物語メカニクス',
    namingStatus: 'NOT_CURRENCY',
    storagePaths: [],
    runtimeIds: [
      'RuntimeStats.berserkUses',
      'UpgradeId:noBerserkBonus',
    ],
    currentDisplayLabels: ['黒耀化'],
    spendable: false,
    persistent: false,
    autoRenameAllowed: false,
    notes: [
      '通貨ではない。',
      '黒曜片の表示名レビューと黒耀化の正字修正を混同しない。',
    ],
  },
];

export const collectionEconomyResourceById = new Map(
  collectionEconomyResources.map((resource) => [resource.id, resource]),
);

export const collectionEconomyRuntimeIdOwner = new Map(
  collectionEconomyResources.flatMap((resource) =>
    resource.runtimeIds.map((runtimeId) => [runtimeId, resource.id] as const),
  ),
);

export type CollectionEconomyTerminologyValidationResult = {
  errors: string[];
  warnings: string[];
};

export function validateCollectionEconomyTerminology(): CollectionEconomyTerminologyValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const resourceIds = new Set<string>();
  const runtimeIds = new Set<string>();

  for (const resource of collectionEconomyResources) {
    if (resourceIds.has(resource.id)) {
      errors.push(`duplicate economy resource id: ${resource.id}`);
    }
    resourceIds.add(resource.id);

    if (resource.concept.trim() === '') {
      errors.push(`${resource.id} concept is empty`);
    }
    if (resource.currentDisplayLabels.length === 0) {
      errors.push(`${resource.id} must preserve at least one display label`);
    }
    if (resource.autoRenameAllowed) {
      errors.push(`${resource.id} must not allow automatic renaming`);
    }

    for (const runtimeId of resource.runtimeIds) {
      if (runtimeIds.has(runtimeId)) {
        errors.push(`runtime economy id belongs to multiple concepts: ${runtimeId}`);
      }
      runtimeIds.add(runtimeId);
    }
  }

  const meta = collectionEconomyResourceById.get(META_UPGRADE_CURRENCY_ID);
  const fragments = collectionEconomyResourceById.get(RUN_MEMORY_FRAGMENT_ID);
  const runCounter = collectionEconomyResourceById.get(RUN_EARNED_META_CURRENCY_COUNTER_ID);
  const blackYouka = collectionEconomyResourceById.get(BLACK_YOUKA_MECHANIC_ID);

  if (!meta?.persistent || !meta.spendable) {
    errors.push('meta upgrade currency must be persistent and spendable');
  }
  if (fragments?.persistent || fragments?.spendable) {
    errors.push('run memory fragments must not be persistent or spendable');
  }
  if (runCounter?.namingStatus !== 'CURRENT_TRACKED_COUNTER_PENDING_NAME') {
    errors.push('Stage1 灯貨 counter must use the actual tracked run-currency metric');
  }
  if (
    !runCounter?.runtimeIds.includes(
      `transient:RunStats.${RUN_EARNED_META_CURRENCY_TRANSIENT_FIELD}`,
    )
  ) {
    errors.push('Stage1 run-currency counter is missing its transient tracked field');
  }
  if (runCounter?.runtimeIds.some((id) => id.startsWith('prototype-formula:'))) {
    errors.push('Stage1 run-currency counter must not retain the old proxy formula');
  }
  if (blackYouka?.namingStatus !== 'NOT_CURRENCY') {
    errors.push('黒耀化 must remain outside the economy resource model');
  }

  if (meta?.currentDisplayLabels.includes('記憶片')) {
    errors.push('meta upgrade currency must not use 記憶片 as a display alias');
  }
  if (meta?.currentDisplayLabels.includes('灯貨')) {
    errors.push('meta upgrade currency must not auto-adopt the pending 灯貨 label');
  }
  if (runCounter?.runtimeIds.includes('profile.currency')) {
    errors.push('run-earned counter must not read the persistent wallet balance');
  }
  if (runCounter?.runtimeIds.includes('RunSettlement.achievementReward')) {
    errors.push('run-earned counter must not count achievement rewards');
  }

  if (meta?.namingStatus === 'CURRENT_DISPLAY_PENDING_REVIEW') {
    warnings.push('meta upgrade currency display name is still pending Human review');
  }
  if (runCounter?.namingStatus === 'CURRENT_TRACKED_COUNTER_PENDING_NAME') {
    warnings.push('Stage1 counter is real-tracked, but its 灯貨 display name is still pending Human review');
  }

  return { errors, warnings };
}
