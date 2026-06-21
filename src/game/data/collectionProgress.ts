export type CollectionEntryStage =
  | 'unknown'
  | 'seen'
  | 'released'
  | 'observed'
  | 'recorded'
  | 'remembered';

export type NightBoardCellKind = 'natural' | 'targeted' | 'mastery' | 'secret';
export type NightBoardCellState = 'hidden' | 'hinted' | 'revealed' | 'completed' | 'claimed';

export type NightBoardReward = {
  type: 'light_coin' | 'travel_prep' | 'memory_text' | 'cosmetic' | 'sound';
  amount?: number;
  memoryTextId?: string;
};

export type NightBoardCell = {
  id: string;
  boardId: string;
  x: number;
  y: number;
  kind: NightBoardCellKind;
  title: string;
  hiddenTitle?: string;
  hint?: string;
  condition: string;
  reward: NightBoardReward;
  revealBy?: string[];
};

export type CollectionProgressSaveData = {
  seenEnemyIds: string[];
  defeatedEnemyCounts: Record<string, number>;
  calmedBossIds: string[];
  discoveredLostItemIds: string[];
  unlockedMemoryTextIds: string[];
  nightBoard: {
    completedCellIds: string[];
    claimedCellIds: string[];
    revealedCellIds: string[];
    hintedCellIds: string[];
  };
};

export const COLLECTION_LABELS = {
  book: '忘れ物帳',
  board: '夜明け盤',
  bestiary: 'カゲモノ図鑑',
  lostItems: '忘れ物一覧',
  stageRecords: '夜路の記録',
  keeperRecords: '灯し手の記録',
} as const;

export const COLLECTION_ENTRY_STAGE_LABELS: Record<CollectionEntryStage, string> = {
  unknown: '未確認',
  seen: '見つけた',
  released: 'ほどいた',
  observed: '観察した',
  recorded: '記された',
  remembered: '思い出した',
};

export const FORGOTTEN_STREET_BOARD_ID = 'forgotten_street_night_board';

export const forgottenStreetNightBoardCells: NightBoardCell[] = [
  {
    id: 'fs_001_release_ink_shadow',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 0,
    y: 0,
    kind: 'natural',
    title: 'しずくをほどく',
    condition: 'しずくオンブラを初めてほどく',
    reward: { type: 'light_coin', amount: 5 },
  },
  {
    id: 'fs_002_release_paper_scrap_shadow',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 1,
    y: 0,
    kind: 'natural',
    title: '急ぐ影をほどく',
    condition: 'せかしオンブラを初めてほどく',
    reward: { type: 'light_coin', amount: 5 },
    revealBy: ['fs_001_release_ink_shadow'],
  },
  {
    id: 'fs_003_release_night_haze',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 2,
    y: 0,
    kind: 'natural',
    title: 'にじみを見つける',
    condition: 'にじみオンブラを初めてほどく',
    reward: { type: 'light_coin', amount: 5 },
    revealBy: ['fs_002_release_paper_scrap_shadow'],
  },
  {
    id: 'fs_004_release_black_label_shadow',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 3,
    y: 0,
    kind: 'natural',
    title: '大きな影をほどく',
    condition: 'くろよオンブロを初めてほどく',
    reward: { type: 'light_coin', amount: 20 },
    revealBy: ['fs_003_release_night_haze'],
  },
  {
    id: 'fs_005_calm_bag_yorishiro',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 4,
    y: 0,
    kind: 'natural',
    title: 'かばんを鎮める',
    condition: 'かばんヨリシロを鎮める',
    reward: { type: 'travel_prep', amount: 1 },
    revealBy: ['fs_004_release_black_label_shadow'],
  },
  {
    id: 'fs_006_clear_depth_1',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 0,
    y: 1,
    kind: 'natural',
    title: '最初の夜明け',
    condition: '忘れ物通り 深度1を夜明けする',
    reward: { type: 'light_coin', amount: 10 },
    revealBy: ['fs_001_release_ink_shadow'],
  },
  {
    id: 'fs_007_clear_depth_1_high_hp',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 1,
    y: 1,
    kind: 'targeted',
    title: '余裕の朝',
    condition: '忘れ物通り 深度1をHP50%以上で夜明けする',
    reward: { type: 'light_coin', amount: 20 },
    revealBy: ['fs_006_clear_depth_1'],
  },
  {
    id: 'fs_008_clear_depth_1_no_black_form',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 2,
    y: 1,
    kind: 'targeted',
    title: '黒に頼らない灯り',
    condition: '忘れ物通り 深度1を黒耀化なしで夜明けする',
    reward: { type: 'light_coin', amount: 20 },
    revealBy: ['fs_006_clear_depth_1'],
  },
  {
    id: 'fs_009_clear_depth_1_fast',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 3,
    y: 1,
    kind: 'targeted',
    title: '早い夜明け',
    condition: '忘れ物通り 深度1を4分以内に夜明けする',
    reward: { type: 'light_coin', amount: 20 },
    revealBy: ['fs_006_clear_depth_1'],
  },
  {
    id: 'fs_010_collect_200_memory_fragments',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 4,
    y: 1,
    kind: 'natural',
    title: '記憶片あつめ',
    condition: '1プレイで記憶片を200個集める',
    reward: { type: 'light_coin', amount: 10 },
    revealBy: ['fs_006_clear_depth_1'],
  },
  {
    id: 'fs_011_level_pencil_5',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 0,
    y: 2,
    kind: 'natural',
    title: '鉛筆を育てる',
    condition: 'にじみ鉛筆をLv5にする',
    reward: { type: 'light_coin', amount: 10 },
    revealBy: ['fs_006_clear_depth_1'],
  },
  {
    id: 'fs_012_level_paper_plane_5',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 1,
    y: 2,
    kind: 'natural',
    title: '紙ひこうきを育てる',
    condition: 'まよい紙ひこうきをLv5にする',
    reward: { type: 'light_coin', amount: 10 },
    revealBy: ['fs_011_level_pencil_5'],
  },
  {
    id: 'fs_013_lantern_weapon_100_releases',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 2,
    y: 2,
    kind: 'targeted',
    title: '灯りでほどく',
    condition: 'ランタン系武器で100体ほどく',
    reward: { type: 'light_coin', amount: 20 },
    revealBy: ['fs_011_level_pencil_5'],
  },
  {
    id: 'fs_014_ultimate_50_releases',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 3,
    y: 2,
    kind: 'targeted',
    title: '灯技の記録',
    condition: '灯技で50体ほどく',
    reward: { type: 'light_coin', amount: 20 },
    revealBy: ['fs_011_level_pencil_5'],
  },
  {
    id: 'fs_015_first_fusion',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 4,
    y: 2,
    kind: 'natural',
    title: '初めての灯合わせ',
    condition: '合体武器を初めて作る',
    reward: { type: 'travel_prep', amount: 1 },
    revealBy: ['fs_011_level_pencil_5'],
  },
  {
    id: 'fs_016_first_lost_item',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 0,
    y: 3,
    kind: 'natural',
    title: '忘れ物を拾う',
    condition: '忘れ物を初めて拾う',
    reward: { type: 'light_coin', amount: 10 },
    revealBy: ['fs_006_clear_depth_1'],
  },
  {
    id: 'fs_017_no_heal_3_min',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 1,
    y: 3,
    kind: 'targeted',
    title: 'たよらない夜路',
    condition: '回復を拾わず3分生存する',
    reward: { type: 'light_coin', amount: 20 },
    revealBy: ['fs_016_first_lost_item'],
  },
  {
    id: 'fs_018_clear_low_hp',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 2,
    y: 3,
    kind: 'mastery',
    title: 'ぎりぎりの朝',
    condition: 'HP30%以下で夜明けする',
    reward: { type: 'light_coin', amount: 30 },
    revealBy: ['fs_016_first_lost_item'],
  },
  {
    id: 'fs_019_collect_100_light_coin',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 3,
    y: 3,
    kind: 'natural',
    title: '灯貨あつめ',
    condition: '1プレイで灯貨を100集める',
    reward: { type: 'light_coin', amount: 10 },
    revealBy: ['fs_016_first_lost_item'],
  },
  {
    id: 'fs_020_reach_light_level_10',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 4,
    y: 3,
    kind: 'natural',
    title: '灯度10',
    condition: 'リザルトで灯度10に到達する',
    reward: { type: 'light_coin', amount: 10 },
    revealBy: ['fs_016_first_lost_item'],
  },
  {
    id: 'fs_021_clear_single_weapon',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 0,
    y: 4,
    kind: 'secret',
    title: 'ひとつの灯り',
    hiddenTitle: '？？？',
    hint: 'ヒント：武器を増やさず、ひとつを信じる',
    condition: '忘れ物通り 深度1を武器1種のみで夜明けする',
    reward: { type: 'travel_prep', amount: 1 },
    revealBy: ['fs_017_no_heal_3_min'],
  },
  {
    id: 'fs_022_clear_with_1_hp',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 1,
    y: 4,
    kind: 'secret',
    title: '消えかけの朝',
    hiddenTitle: '？？？',
    hint: 'ヒント：最後の灯りだけで朝を見る',
    condition: 'HP残り1で夜明けする',
    reward: { type: 'light_coin', amount: 50 },
    revealBy: ['fs_018_clear_low_hp'],
  },
  {
    id: 'fs_023_calm_yorishiro_with_ultimate',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 2,
    y: 4,
    kind: 'mastery',
    title: '灯技で鎮める',
    condition: 'かばんヨリシロを灯技で鎮める',
    reward: { type: 'light_coin', amount: 30 },
    revealBy: ['fs_005_calm_bag_yorishiro'],
  },
  {
    id: 'fs_024_release_onbro_fast',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 3,
    y: 4,
    kind: 'mastery',
    title: '早ほどき',
    condition: 'くろよオンブロを20秒以内にほどく',
    reward: { type: 'light_coin', amount: 30 },
    revealBy: ['fs_004_release_black_label_shadow'],
  },
  {
    id: 'fs_025_view_nemori_record',
    boardId: FORGOTTEN_STREET_BOARD_ID,
    x: 4,
    y: 4,
    kind: 'natural',
    title: '夜主の記録',
    condition: '夜主 ネモリの記録を見る',
    reward: { type: 'memory_text', memoryTextId: 'yanushi_nemori_record' },
    revealBy: ['fs_005_calm_bag_yorishiro'],
  },
];

export const forgottenStreetNightBoard = {
  id: FORGOTTEN_STREET_BOARD_ID,
  name: '忘れ物通り 夜明け盤',
  width: 5,
  height: 5,
  cells: forgottenStreetNightBoardCells,
} as const;
