export type EconomyNamingStatus =
  | 'CURRENT_RUNTIME_ID'
  | 'CURRENT_DISPLAY_PENDING_REVIEW'
  | 'PROTOTYPE_COUNTER'
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
export const PROTOTYPE_LIGHT_COIN_COUNTER_ID = 'economy:prototype_light_coin_counter';
export const BLACK_YOUKA_MECHANIC_ID = 'mechanic:black_youka';

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
    concept: 'Stage1札「灯貨あつめ」の試作達成カウンター',
    namingStatus: 'PROTOTYPE_COUNTER',
    storagePaths: [],
    runtimeIds: [
      'NightBoardCell:fs_019_collect_100_light_coin',
      'prototype-formula:kills*0.35+memoryFragmentsCollected*0.7',
    ],
    currentDisplayLabels: ['灯貨'],
    spendable: false,
    persistent: false,
    autoRenameAllowed: false,
    notes: [
      '実在するinventoryやwalletではない。',
      '現在は撃破数と記憶片数から推定したproxy条件であり、永続通貨残高を参照していない。',
      '正式採用時は実tracked counterを追加するか、札名と条件を別概念へ移行する。',
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
  const prototypeCounter = collectionEconomyResourceById.get(PROTOTYPE_LIGHT_COIN_COUNTER_ID);
  const blackYouka = collectionEconomyResourceById.get(BLACK_YOUKA_MECHANIC_ID);

  if (!meta?.persistent || !meta.spendable) {
    errors.push('meta upgrade currency must be persistent and spendable');
  }
  if (fragments?.persistent || fragments?.spendable) {
    errors.push('run memory fragments must not be persistent or spendable');
  }
  if (prototypeCounter?.namingStatus !== 'PROTOTYPE_COUNTER') {
    errors.push('灯貨 must remain a prototype counter until real tracking exists');
  }
  if (blackYouka?.namingStatus !== 'NOT_CURRENCY') {
    errors.push('黒耀化 must remain outside the economy resource model');
  }

  if (meta?.currentDisplayLabels.includes('記憶片')) {
    errors.push('meta upgrade currency must not use 記憶片 as a display alias');
  }
  if (meta?.currentDisplayLabels.includes('灯貨')) {
    errors.push('meta upgrade currency must not auto-adopt the prototype 灯貨 label');
  }
  if (prototypeCounter?.runtimeIds.includes('profile.currency')) {
    errors.push('prototype 灯貨 counter must not read persistent profile.currency');
  }

  if (meta?.namingStatus === 'CURRENT_DISPLAY_PENDING_REVIEW') {
    warnings.push('meta upgrade currency display name is still pending Human review');
  }
  if (prototypeCounter?.namingStatus === 'PROTOTYPE_COUNTER') {
    warnings.push('灯貨 is not a real tracked currency yet');
  }

  return { errors, warnings };
}
