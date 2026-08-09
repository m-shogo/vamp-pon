export type NamedObjectNamingStatus = 'CURRENT_DIRECTION' | 'WORKING';
export type NamedObjectPhase =
  | 'luminous_possession'
  | 'starter_gear'
  | 'passive_item'
  | 'rare_item'
  | 'lamp_tsugi'
  | 'akatsuki_biraki';

export type NamedObjectConnectionType =
  | 'character'
  | 'stage'
  | 'gameplay'
  | 'relationship'
  | 'archive';

export type CharacterObjectLineageDefinition = {
  characterId: string;
  characterDisplayName: string;
  namingStatus: NamedObjectNamingStatus;
  requiredForLaunchCompletion: boolean;
  stageIds: number[];
  gameplayVerbs: string[];
  relationshipCharacterIds: string[];
  archiveKeys: string[];
  legacyReferences: string[];
  luminousPossession: string;
  starterGear: string;
  passiveItem: string;
  rareItem: string;
  lampTsugi: string;
  akatsukiBiraki: string;
};

export type NamedObjectConnection = {
  type: NamedObjectConnectionType;
  targetId: string;
};

export type NamedObjectDefinition = {
  id: string;
  lineageId: string;
  characterId: string;
  characterDisplayName: string;
  phase: NamedObjectPhase;
  displayName: string;
  namingStatus: NamedObjectNamingStatus;
  requiredForLaunchCompletion: boolean;
  sameObjectPhase: boolean;
  connections: NamedObjectConnection[];
};

export type CompletionGroupDefinition = {
  id: 'night_roads' | 'keepers' | 'item_lineages' | 'kagemono' | 'bonds' | 'night_margin';
  displayName: string;
  designTargetCount: number;
  denominatorSource: string;
};

export const characterObjectLineages: CharacterObjectLineageDefinition[] = [
  {
    characterId: "yui",
    characterDisplayName: "ユイ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [1],
    gameplayVerbs: ["pickup", "hold", "owner-check"],
    relationshipCharacterIds: ["kuroori", "asa"],
    archiveKeys: ["keeper:yui", "constellation:keeper:yui", "completion:character:yui"],
    legacyReferences: ["左腰の小さな拾い物バッグ"],
    luminousPossession: "持ち主待ちのランタン",
    starterGear: "夜の鉛筆",
    passiveItem: "金のコンパス",
    rareItem: "誰かの名前札",
    lampTsugi: "未完成の一行",
    akatsukiBiraki: "消えない名前",
  },
  {
    characterId: "asa",
    characterDisplayName: "アサ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [2],
    gameplayVerbs: ["mark", "rename", "consent"],
    relationshipCharacterIds: ["yui", "kage2"],
    archiveKeys: ["keeper:asa", "constellation:keeper:asa", "completion:character:asa"],
    legacyReferences: ["止まったままの小さな懐中時計"],
    luminousPossession: "名結びの小鋏",
    starterGear: "絵はがきカッター",
    passiveItem: "旅のバッジ",
    rareItem: "封のされた手紙",
    lampTsugi: "暁綴りの紙片",
    akatsukiBiraki: "暁に結ぶ名",
  },
  {
    characterId: "nagi",
    characterDisplayName: "ナギ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [3],
    gameplayVerbs: ["seal", "guard", "reopen"],
    relationshipCharacterIds: ["kage1", "tobari"],
    archiveKeys: ["keeper:nagi", "constellation:keeper:nagi", "completion:character:nagi"],
    legacyReferences: ["書き足しだらけの折り畳み星図"],
    luminousPossession: "月箱の銀鍵",
    starterGear: "月のしおり",
    passiveItem: "月明かりのしおり",
    rareItem: "小さな銀の鍵",
    lampTsugi: "封月のしおり",
    akatsukiBiraki: "夜をしまう箱",
  },
  {
    characterId: "michiru",
    characterDisplayName: "ミチル",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [4],
    gameplayVerbs: ["route", "reroute", "compare"],
    relationshipCharacterIds: ["kage3", "gen"],
    archiveKeys: ["keeper:michiru", "constellation:keeper:michiru", "completion:character:michiru"],
    legacyReferences: ["水音を閉じ込めた青い小瓶"],
    luminousPossession: "帰り針のコンパス",
    starterGear: "街灯の輪",
    passiveItem: "外れた地図ピン",
    rareItem: "折れたコンパス針",
    lampTsugi: "星図の道糸",
    akatsukiBiraki: "帰り道の星",
  },
  {
    characterId: "tomori",
    characterDisplayName: "トモリ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [5],
    gameplayVerbs: ["repair", "leave-scar", "finish"],
    relationshipCharacterIds: ["kage4", "hana"],
    archiveKeys: ["keeper:tomori", "constellation:keeper:tomori", "completion:character:tomori"],
    legacyReferences: ["色の違う糸を巻いた古い針差し"],
    luminousPossession: "継火の修理ランプ",
    starterGear: "黒インクの小瓶",
    passiveItem: "白い余白",
    rareItem: "切れた灯芯",
    lampTsugi: "ほころび灯し",
    akatsukiBiraki: "夜を直す灯",
  },
  {
    characterId: "sen",
    characterDisplayName: "セン",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [6],
    gameplayVerbs: ["draw-line", "teach", "branch"],
    relationshipCharacterIds: ["shiro", "koyori"],
    archiveKeys: ["keeper:sen", "constellation:keeper:sen", "completion:character:sen"],
    legacyReferences: [],
    luminousPossession: "白線のチョーク灯",
    starterGear: "チョークの線",
    passiveItem: "小さな黒板消し",
    rareItem: "消された一文",
    lampTsugi: "教室の道筋",
    akatsukiBiraki: "消えない一文",
  },
  {
    characterId: "ritsu",
    characterDisplayName: "リツ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [7],
    gameplayVerbs: ["split", "distribute", "share"],
    relationshipCharacterIds: ["koyori", "kage1"],
    archiveKeys: ["keeper:ritsu", "constellation:keeper:ritsu", "completion:character:ritsu"],
    legacyReferences: [],
    luminousPossession: "半灯りの飴缶",
    starterGear: "半分の飴",
    passiveItem: "半分の包み紙",
    rareItem: "残った片割れ",
    lampTsugi: "包み紙の火",
    akatsukiBiraki: "残した半分",
  },
  {
    characterId: "koyori",
    characterDisplayName: "コヨリ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [8],
    gameplayVerbs: ["name", "summon-helper", "connect"],
    relationshipCharacterIds: ["ritsu", "sen"],
    archiveKeys: ["keeper:koyori", "constellation:keeper:koyori", "completion:character:koyori"],
    legacyReferences: [],
    luminousPossession: "呼び名の紙縒り札",
    starterGear: "小さな名札",
    passiveItem: "呼び名の紙縒り",
    rareItem: "書きかけの名前",
    lampTsugi: "呼び名の紙縒り",
    akatsukiBiraki: "一番消えない名",
  },
  {
    characterId: "gen",
    characterDisplayName: "ゲン",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [9],
    gameplayVerbs: ["compare-old-route", "hold-safe-zone", "recalculate"],
    relationshipCharacterIds: ["michiru", "kage3"],
    archiveKeys: ["keeper:gen", "constellation:keeper:gen", "completion:character:gen"],
    legacyReferences: [],
    luminousPossession: "古針の駅灯",
    starterGear: "古いコンパス",
    passiveItem: "駅前の道火",
    rareItem: "錆びた針箱",
    lampTsugi: "駅前の道火",
    akatsukiBiraki: "古い道の朝",
  },
  {
    characterId: "hana",
    characterDisplayName: "ハナ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [10],
    gameplayVerbs: ["preserve", "slow", "allow-change"],
    relationshipCharacterIds: ["kage4", "shiro"],
    archiveKeys: ["keeper:hana", "constellation:keeper:hana", "completion:character:hana"],
    legacyReferences: [],
    luminousPossession: "花脈の保管箱",
    starterGear: "押し花のしおり",
    passiveItem: "箱底の花",
    rareItem: "乾いた花びら",
    lampTsugi: "箱底の花",
    akatsukiBiraki: "枯れない頁",
  },
  {
    characterId: "yubi",
    characterDisplayName: "ユウビ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [11],
    gameplayVerbs: ["delay", "deliver", "wait-for-recipient"],
    relationshipCharacterIds: ["tobari", "kage2"],
    archiveKeys: ["keeper:yubi", "constellation:keeper:yubi", "completion:character:yubi"],
    legacyReferences: [],
    luminousPossession: "返事待ちの郵便灯",
    starterGear: "未配達の封筒",
    passiveItem: "古い消印",
    rareItem: "開かない返信",
    lampTsugi: "遅れて届く火",
    akatsukiBiraki: "届かなかった返事",
  },
  {
    characterId: "madoka",
    characterDisplayName: "マドカ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [12],
    gameplayVerbs: ["observe", "reveal", "act-on-difference"],
    relationshipCharacterIds: ["ren", "nemu"],
    archiveKeys: ["keeper:madoka", "constellation:keeper:madoka", "completion:character:madoka"],
    legacyReferences: [],
    luminousPossession: "見送り窓の観測レンズ",
    starterGear: "窓際の紙飛行機",
    passiveItem: "曇った窓紙",
    rareItem: "見ていた切れ端",
    lampTsugi: "見ていた紙翼",
    akatsukiBiraki: "気づいていた朝",
  },
  {
    characterId: "shiro",
    characterDisplayName: "シロ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [13],
    gameplayVerbs: ["classify", "defer", "preserve-unknown"],
    relationshipCharacterIds: ["sen", "kage4"],
    archiveKeys: ["keeper:shiro", "constellation:keeper:shiro", "completion:character:shiro"],
    legacyReferences: [],
    luminousPossession: "未分類の白栞灯",
    starterGear: "白いしおり",
    passiveItem: "未分類の頁",
    rareItem: "読めない一頁",
    lampTsugi: "未分類の頁",
    akatsukiBiraki: "読めない頁の灯",
  },
  {
    characterId: "tobari",
    characterDisplayName: "トバリ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [14],
    gameplayVerbs: ["close-gate", "open-return", "route-flow"],
    relationshipCharacterIds: ["yubi", "nagi"],
    archiveKeys: ["keeper:tobari", "constellation:keeper:tobari", "completion:character:tobari"],
    legacyReferences: [],
    luminousPossession: "往復穴の改札鋏",
    starterGear: "改札ばさみ",
    passiveItem: "古い切符",
    rareItem: "片道ではない切符",
    lampTsugi: "改札のひかり",
    akatsukiBiraki: "片道ではない切符",
  },
  {
    characterId: "nemu",
    characterDisplayName: "ネム",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [15],
    gameplayVerbs: ["forecast", "rewrite", "keep-possibility"],
    relationshipCharacterIds: ["madoka", "kage3"],
    archiveKeys: ["keeper:nemu", "constellation:keeper:nemu", "completion:character:nemu"],
    legacyReferences: [],
    luminousPossession: "夢頁の水面日記",
    starterGear: "夢日記",
    passiveItem: "眠り頁",
    rareItem: "夢で見た地図",
    lampTsugi: "眠り頁",
    akatsukiBiraki: "夢で見た朝",
  },
  {
    characterId: "kuroori",
    characterDisplayName: "クロオリ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [16],
    gameplayVerbs: ["fold", "hold", "open-by-consent"],
    relationshipCharacterIds: ["yui", "yubi"],
    archiveKeys: ["keeper:kuroori", "constellation:keeper:kuroori", "completion:character:kuroori"],
    legacyReferences: [],
    luminousPossession: "折り目だけ光る黒紙",
    starterGear: "黒い折り紙",
    passiveItem: "四つ折りの影",
    rareItem: "開かない折り目",
    lampTsugi: "四つ折りの影",
    akatsukiBiraki: "開かれる黒紙",
  },
  {
    characterId: "kage1",
    characterDisplayName: "カナメ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [3, 16],
    gameplayVerbs: ["intercept", "guard", "share-burden"],
    relationshipCharacterIds: ["nagi", "ritsu"],
    archiveKeys: ["keeper:kage1", "constellation:keeper:kage1", "completion:character:kage1"],
    legacyReferences: ["カゲール1"],
    luminousPossession: "受け灯の腕帯",
    starterGear: "影の折り目",
    passiveItem: "隠し火",
    rareItem: "守りすぎた影",
    lampTsugi: "隠し火",
    akatsukiBiraki: "朝まで残った影",
  },
  {
    characterId: "kage2",
    characterDisplayName: "カスミ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [2, 17],
    gameplayVerbs: ["conceal", "leave-trace", "restore-by-choice"],
    relationshipCharacterIds: ["asa", "yubi"],
    archiveKeys: ["keeper:kage2", "constellation:keeper:kage2", "completion:character:kage2"],
    legacyReferences: ["カゲール2"],
    luminousPossession: "消し跡の白灯",
    starterGear: "消しゴムのかけら",
    passiveItem: "薄れ名",
    rareItem: "消せない一文字",
    lampTsugi: "薄れ名",
    akatsukiBiraki: "残された一文字",
  },
  {
    characterId: "kage3",
    characterDisplayName: "トキ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [4, 18],
    gameplayVerbs: ["measure", "mark-provisional", "allow-unmeasured"],
    relationshipCharacterIds: ["michiru", "ren"],
    archiveKeys: ["keeper:kage3", "constellation:keeper:kage3", "completion:character:kage3"],
    legacyReferences: ["カゲール3"],
    luminousPossession: "星目盛りの夜定規",
    starterGear: "夜読みの定規",
    passiveItem: "角度の火",
    rareItem: "割れた角度線",
    lampTsugi: "角度の火",
    akatsukiBiraki: "測れない夜明け",
  },
  {
    characterId: "kage4",
    characterDisplayName: "ツムギ",
    namingStatus: "CURRENT_DIRECTION",
    requiredForLaunchCompletion: true,
    stageIds: [5, 19],
    gameplayVerbs: ["stitch", "leave-blank", "choose-finish"],
    relationshipCharacterIds: ["tomori", "hana", "shiro"],
    archiveKeys: ["keeper:kage4", "constellation:keeper:kage4", "completion:character:kage4"],
    legacyReferences: ["カゲール4"],
    luminousPossession: "余白を縫う糸巻き",
    starterGear: "空白のカード",
    passiveItem: "余白の継ぎ目",
    rareItem: "黒い余白",
    lampTsugi: "余白の継ぎ目",
    akatsukiBiraki: "続きを描く朝",
  },
  {
    characterId: "ren",
    characterDisplayName: "レン",
    namingStatus: "WORKING",
    requiredForLaunchCompletion: false,
    stageIds: [12, 18],
    gameplayVerbs: ["focus", "detect-delta", "keep-context"],
    relationshipCharacterIds: ["madoka", "kage3"],
    archiveKeys: ["keeper:ren", "constellation:keeper:ren", "completion:character:ren"],
    legacyReferences: [],
    luminousPossession: "片焦点のレンズ灯",
    starterGear: "レンズのしるし",
    passiveItem: "片曇りのレンズ布",
    rareItem: "見落とされた余白片",
    lampTsugi: "硝子の道筋",
    akatsukiBiraki: "見落とさない朝",
  }
];

const PHASE_KEYS: Array<[NamedObjectPhase, keyof Pick<
  CharacterObjectLineageDefinition,
  'luminousPossession' | 'starterGear' | 'passiveItem' | 'rareItem' | 'lampTsugi' | 'akatsukiBiraki'
>]> = [
  ['luminous_possession', 'luminousPossession'],
  ['starter_gear', 'starterGear'],
  ['passive_item', 'passiveItem'],
  ['rare_item', 'rareItem'],
  ['lamp_tsugi', 'lampTsugi'],
  ['akatsuki_biraki', 'akatsukiBiraki'],
];

function connectionsFor(lineage: CharacterObjectLineageDefinition): NamedObjectConnection[] {
  return [
    { type: 'character', targetId: lineage.characterId },
    ...lineage.stageIds.map((stageId) => ({ type: 'stage' as const, targetId: `stage:${stageId}` })),
    ...lineage.gameplayVerbs.map((verb) => ({ type: 'gameplay' as const, targetId: verb })),
    ...lineage.relationshipCharacterIds.map((characterId) => ({ type: 'relationship' as const, targetId: characterId })),
    ...lineage.archiveKeys.map((archiveKey) => ({ type: 'archive' as const, targetId: archiveKey })),
  ];
}

export const namedObjectRegistry: NamedObjectDefinition[] = characterObjectLineages.flatMap((lineage) => {
  const seenNames = new Set<string>();
  return PHASE_KEYS.map(([phase, key]) => {
    const displayName = lineage[key];
    const sameObjectPhase = seenNames.has(displayName);
    seenNames.add(displayName);
    return {
      id: `named-object:${lineage.characterId}:${phase}`,
      lineageId: `character-lineage:${lineage.characterId}`,
      characterId: lineage.characterId,
      characterDisplayName: lineage.characterDisplayName,
      phase,
      displayName,
      namingStatus: lineage.namingStatus,
      requiredForLaunchCompletion: lineage.requiredForLaunchCompletion,
      sameObjectPhase,
      connections: connectionsFor(lineage),
    };
  });
});

export const namedObjectById = new Map(namedObjectRegistry.map((entry) => [entry.id, entry]));
export const characterObjectLineageById = new Map(
  characterObjectLineages.map((entry) => [entry.characterId, entry]),
);

export const allLightsCompletionDesign = {
  version: 'design-v1',
  runtimeFrozen: false,
  rewardId: 'all-lights-morning',
  rewardDisplayName: '全灯の朝',
  groups: [
    {
      id: 'night_roads',
      displayName: '夜路',
      designTargetCount: 20,
      denominatorSource: 'src/game/data/stageProductionDatabase.ts',
    },
    {
      id: 'keepers',
      displayName: '灯し手',
      designTargetCount: 21,
      denominatorSource: 'characterObjectLineages',
    },
    {
      id: 'item_lineages',
      displayName: '灯具',
      designTargetCount: 21,
      denominatorSource: 'characterObjectLineages',
    },
    {
      id: 'kagemono',
      displayName: 'カゲモノ',
      designTargetCount: 48,
      denominatorSource: 'src/game/data/enemyProductionDatabase.ts',
    },
    {
      id: 'bonds',
      displayName: '結び',
      designTargetCount: 21,
      denominatorSource: 'Current21 signature relationship nodes',
    },
    {
      id: 'night_margin',
      displayName: '夜の余白',
      designTargetCount: 1,
      denominatorSource: 'versioned secret-constellation group completion',
    },
  ] satisfies CompletionGroupDefinition[],
} as const;

export type NamedObjectRegistryValidationResult = {
  errors: string[];
  warnings: string[];
};

export function validateNamedObjectRegistry(): NamedObjectRegistryValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const lineageIds = new Set<string>();
  const objectIds = new Set<string>();
  const currentCharacterNames = new Map([
    ['kuroori', 'クロオリ'],
    ['kage1', 'カナメ'],
    ['kage2', 'カスミ'],
    ['kage3', 'トキ'],
    ['kage4', 'ツムギ'],
    ['ren', 'レン'],
  ]);

  if (characterObjectLineages.length !== 21) {
    errors.push(`Current21 lineage count must be 21, got ${characterObjectLineages.length}`);
  }

  for (const lineage of characterObjectLineages) {
    if (lineageIds.has(lineage.characterId)) {
      errors.push(`duplicate character lineage: ${lineage.characterId}`);
    }
    lineageIds.add(lineage.characterId);

    const expectedName = currentCharacterNames.get(lineage.characterId);
    if (expectedName && lineage.characterDisplayName !== expectedName) {
      errors.push(`${lineage.characterId} display name must be ${expectedName}`);
    }

    if (lineage.stageIds.length === 0) {
      errors.push(`${lineage.characterId} must connect to at least one stage`);
    }
    for (const stageId of lineage.stageIds) {
      if (!Number.isInteger(stageId) || stageId < 1 || stageId > 20) {
        errors.push(`${lineage.characterId} has invalid stage id: ${stageId}`);
      }
    }
    if (lineage.gameplayVerbs.length === 0) {
      errors.push(`${lineage.characterId} must connect to gameplay`);
    }
    if (lineage.relationshipCharacterIds.length === 0) {
      errors.push(`${lineage.characterId} must connect to a relationship`);
    }
    if (lineage.archiveKeys.length === 0) {
      errors.push(`${lineage.characterId} must connect to archive`);
    }
    if (lineage.namingStatus === 'WORKING') {
      warnings.push(`${lineage.characterId} includes Working display names`);
    }
  }

  for (const entry of namedObjectRegistry) {
    if (objectIds.has(entry.id)) {
      errors.push(`duplicate named object id: ${entry.id}`);
    }
    objectIds.add(entry.id);

    if (entry.displayName.trim() === '') {
      errors.push(`${entry.id} displayName is empty`);
    }
    if (entry.displayName.includes('黒曜化')) {
      errors.push(`${entry.id} uses forbidden current term 黒曜化`);
    }

    const connectionTypes = new Set(entry.connections.map((connection) => connection.type));
    for (const requiredType of ['character', 'stage', 'gameplay', 'archive'] as const) {
      if (!connectionTypes.has(requiredType)) {
        errors.push(`${entry.id} missing ${requiredType} connection`);
      }
    }
    if (connectionTypes.size < 4) {
      errors.push(`${entry.id} must have at least four connection types`);
    }
  }

  const byLineage = new Map<string, NamedObjectDefinition[]>();
  for (const entry of namedObjectRegistry) {
    const list = byLineage.get(entry.lineageId) ?? [];
    list.push(entry);
    byLineage.set(entry.lineageId, list);
  }
  for (const [lineageId, entries] of byLineage) {
    const firstByName = new Map<string, NamedObjectDefinition>();
    for (const entry of entries) {
      const first = firstByName.get(entry.displayName);
      if (!first) {
        firstByName.set(entry.displayName, entry);
      } else if (!entry.sameObjectPhase) {
        errors.push(`${lineageId} repeats "${entry.displayName}" without sameObjectPhase`);
      }
    }
  }

  if (allLightsCompletionDesign.version.trim() === '') {
    errors.push('completion design version is required');
  }
  if (allLightsCompletionDesign.runtimeFrozen) {
    errors.push('design-v1 must not claim a frozen runtime denominator');
  }
  for (const group of allLightsCompletionDesign.groups) {
    if (!Number.isInteger(group.designTargetCount) || group.designTargetCount <= 0) {
      errors.push(`${group.id} must have a finite positive design target`);
    }
  }

  const ren = characterObjectLineageById.get('ren');
  if (!ren || ren.namingStatus !== 'WORKING' || ren.requiredForLaunchCompletion) {
    errors.push('Ren must remain Working and excluded from launch completion until promoted');
  }

  return { errors, warnings };
}
