export type NamedObjectMigrationAction =
  | 'PRESERVE_LEGACY_REFERENCE'
  | 'DISPLAY_ALIAS'
  | 'REBIND_CURRENT_CONNECTION'
  | 'REVIEW_REQUIRED';

export type NamedObjectMigrationLedgerEntry = {
  id: string;
  entityType: 'keeper_prop' | 'lost_item' | 'character_name' | 'term' | 'board_node' | 'reward_type';
  legacyKey: string;
  legacyDisplayName?: string;
  currentStableId?: string;
  currentDisplayName?: string;
  action: NamedObjectMigrationAction;
  preserveLegacy: true;
  reason: string;
};

export const namedObjectMigrationLedger: NamedObjectMigrationLedgerEntry[] = [
  {
    id: 'keeper-yui-personal-item-v0',
    entityType: 'keeper_prop',
    legacyKey: 'keeper-yui.personalItem',
    legacyDisplayName: '左腰の小さな拾い物バッグ',
    currentStableId: 'named-object:yui:luminous_possession',
    currentDisplayName: '持ち主待ちのランタン',
    action: 'PRESERVE_LEGACY_REFERENCE',
    preserveLegacy: true,
    reason: '旧バッグは人物小物として保存し、Currentの光る持ち物と同一objectへ黙って上書きしない。',
  },
  {
    id: 'keeper-asa-personal-item-v0',
    entityType: 'keeper_prop',
    legacyKey: 'keeper-asa.personalItem',
    legacyDisplayName: '止まったままの小さな懐中時計',
    currentStableId: 'named-object:asa:luminous_possession',
    currentDisplayName: '名結びの小鋏',
    action: 'PRESERVE_LEGACY_REFERENCE',
    preserveLegacy: true,
    reason: '懐中時計を削除せず過去の所持品として保持し、戦闘・Stage2のCurrent objectは小鋏へ分離する。',
  },
  {
    id: 'keeper-nagi-personal-item-v0',
    entityType: 'keeper_prop',
    legacyKey: 'keeper-nagi.personalItem',
    legacyDisplayName: '書き足しだらけの折り畳み星図',
    currentStableId: 'named-object:nagi:luminous_possession',
    currentDisplayName: '月箱の銀鍵',
    action: 'PRESERVE_LEGACY_REFERENCE',
    preserveLegacy: true,
    reason: '旧route役由来の星図は履歴として残し、Currentのseal/guard identityとは別objectとして扱う。',
  },
  {
    id: 'keeper-michiru-personal-item-v0',
    entityType: 'keeper_prop',
    legacyKey: 'keeper-michiru.personalItem',
    legacyDisplayName: '水音を閉じ込めた青い小瓶',
    currentStableId: 'named-object:michiru:luminous_possession',
    currentDisplayName: '帰り針のコンパス',
    action: 'PRESERVE_LEGACY_REFERENCE',
    preserveLegacy: true,
    reason: '旧water役由来の小瓶は履歴として残し、Currentのroute/reroute identityとは別objectとして扱う。',
  },
  {
    id: 'keeper-tomori-personal-item-v0',
    entityType: 'keeper_prop',
    legacyKey: 'keeper-tomori.personalItem',
    legacyDisplayName: '色の違う糸を巻いた古い針差し',
    currentStableId: 'named-object:tomori:luminous_possession',
    currentDisplayName: '継火の修理ランプ',
    action: 'PRESERVE_LEGACY_REFERENCE',
    preserveLegacy: true,
    reason: '針差しは修理道具として残し、光る持ち物の主objectは修理ランプへ接続する。',
  },
  {
    id: 'lost-folded-map-corner-owner-v0',
    entityType: 'lost_item',
    legacyKey: 'lost-folded-map-corner.relatedKeeperId',
    legacyDisplayName: '折れた地図の角 → keeper-nagi',
    currentStableId: 'named-object:michiru:rare_item',
    currentDisplayName: '折れたコンパス針',
    action: 'REBIND_CURRENT_CONNECTION',
    preserveLegacy: true,
    reason: 'Currentではroute/地図/コンパスをミチルへ集約する。旧ナギ接続と旧本文はmigration historyへ残す。',
  },
  {
    id: 'lost-rusted-room-key-owner-v0',
    entityType: 'lost_item',
    legacyKey: 'lost-rusted-room-key.relatedKeeperId',
    legacyDisplayName: '錆びた部屋の鍵 → keeper-michiru',
    currentStableId: 'named-object:nagi:rare_item',
    currentDisplayName: '小さな銀の鍵',
    action: 'REBIND_CURRENT_CONNECTION',
    preserveLegacy: true,
    reason: 'Currentでは箱/鍵/sealをナギへ集約する。旧ミチル接続と旧本文はmigration historyへ残す。',
  },
  {
    id: 'shadow-kage1-display-name-v0',
    entityType: 'character_name',
    legacyKey: 'character:kage1',
    legacyDisplayName: 'カゲール1',
    currentStableId: 'character:kage1',
    currentDisplayName: 'カナメ',
    action: 'DISPLAY_ALIAS',
    preserveLegacy: true,
    reason: 'stable IDは維持し、visible Current名だけをカナメへ移す。',
  },
  {
    id: 'shadow-kage2-display-name-v0',
    entityType: 'character_name',
    legacyKey: 'character:kage2',
    legacyDisplayName: 'カゲール2',
    currentStableId: 'character:kage2',
    currentDisplayName: 'カスミ',
    action: 'DISPLAY_ALIAS',
    preserveLegacy: true,
    reason: 'stable IDは維持し、visible Current名だけをカスミへ移す。',
  },
  {
    id: 'shadow-kage3-display-name-v0',
    entityType: 'character_name',
    legacyKey: 'character:kage3',
    legacyDisplayName: 'カゲール3',
    currentStableId: 'character:kage3',
    currentDisplayName: 'トキ',
    action: 'DISPLAY_ALIAS',
    preserveLegacy: true,
    reason: 'stable IDは維持し、visible Current名だけをトキへ移す。',
  },
  {
    id: 'shadow-kage4-display-name-v0',
    entityType: 'character_name',
    legacyKey: 'character:kage4',
    legacyDisplayName: 'カゲール4',
    currentStableId: 'character:kage4',
    currentDisplayName: 'ツムギ',
    action: 'DISPLAY_ALIAS',
    preserveLegacy: true,
    reason: 'stable IDは維持し、visible Current名だけをツムギへ移す。',
  },
  {
    id: 'term-kokuyou-old-kanji-v0',
    entityType: 'term',
    legacyKey: 'display-term:黒曜化',
    legacyDisplayName: '黒曜化',
    currentStableId: 'world-term:black-youka',
    currentDisplayName: '黒耀化',
    action: 'DISPLAY_ALIAS',
    preserveLegacy: true,
    reason: '検索・save migrationでは旧表記を認識するが、Current visible UIへは黒耀化を表示する。',
  },
  {
    id: 'stage1-board-enemy-labels-v0',
    entityType: 'board_node',
    legacyKey: 'forgotten_street_night_board.enemy-label-cells',
    legacyDisplayName: 'しずくオンブラ / せかしオンブラ / にじみオンブラ / くろよオンブロ / かばんヨリシロ',
    action: 'REVIEW_REQUIRED',
    preserveLegacy: true,
    reason: 'Current48への1対1 mappingを推測せず、IDを保ったままKEEP/RENAME/REBIND/ARCHIVEを個別決定する。',
  },
  {
    id: 'stage1-board-black-form-term-v0',
    entityType: 'board_node',
    legacyKey: 'fs_008_clear_depth_1_no_black_form.condition',
    legacyDisplayName: '黒曜化なしで夜明けする',
    currentStableId: 'world-term:black-youka',
    currentDisplayName: '黒耀化なしで夜明けする',
    action: 'DISPLAY_ALIAS',
    preserveLegacy: true,
    reason: 'cell IDと達成状態を維持したまま表示だけCurrent termへ移す。',
  },
  {
    id: 'reward-light-coin-v0',
    entityType: 'reward_type',
    legacyKey: 'nightBoardReward.type:light_coin',
    legacyDisplayName: '灯貨 / 黒曜片',
    currentStableId: 'field-drop:memory-fragment',
    currentDisplayName: '記憶片',
    action: 'REVIEW_REQUIRED',
    preserveLegacy: true,
    reason: '既存save量・永続経済・表示文言への影響を確認してから通貨familyを統合する。',
  },
];

export type NamedObjectMigrationValidationResult = {
  errors: string[];
  warnings: string[];
};

export function validateNamedObjectMigrationLedger(): NamedObjectMigrationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = new Set<string>();

  for (const entry of namedObjectMigrationLedger) {
    if (ids.has(entry.id)) {
      errors.push(`duplicate migration id: ${entry.id}`);
    }
    ids.add(entry.id);

    if (!entry.preserveLegacy) {
      errors.push(`${entry.id} must preserve legacy data`);
    }
    if (entry.legacyKey.trim() === '' || entry.reason.trim() === '') {
      errors.push(`${entry.id} requires legacyKey and reason`);
    }
    if (entry.action === 'REVIEW_REQUIRED') {
      warnings.push(`${entry.id} still requires Human/current-production review`);
    }
  }

  const requiredMigrationIds = [
    'lost-folded-map-corner-owner-v0',
    'lost-rusted-room-key-owner-v0',
    'shadow-kage1-display-name-v0',
    'shadow-kage2-display-name-v0',
    'shadow-kage3-display-name-v0',
    'shadow-kage4-display-name-v0',
    'term-kokuyou-old-kanji-v0',
    'stage1-board-enemy-labels-v0',
    'reward-light-coin-v0',
  ];
  for (const id of requiredMigrationIds) {
    if (!ids.has(id)) {
      errors.push(`required migration entry missing: ${id}`);
    }
  }

  return { errors, warnings };
}
