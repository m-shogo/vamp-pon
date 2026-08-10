export type CurrentRelationCharacterId =
  | 'yui'
  | 'asa'
  | 'nagi'
  | 'michiru'
  | 'tomori'
  | 'sen'
  | 'ritsu'
  | 'koyori'
  | 'gen'
  | 'hana'
  | 'yubi'
  | 'madoka'
  | 'shiro'
  | 'tobari'
  | 'nemu'
  | 'kuroori'
  | 'kage1'
  | 'kage2'
  | 'kage3'
  | 'kage4'
  | 'ren';

export type CurrentRelationshipInventoryAuthority =
  | 'DETAILED_MACHINE_ARC'
  | 'CURRENT_HUB_COVERAGE_ARC';

export type CurrentRelationshipDetailStatus =
  | 'CURRENT_STRONG_RELATIONSHIP'
  | 'CURRENT_DIRECTION'
  | 'CURRENT_DIRECTION_WITH_CANDIDATE_FACTS'
  | 'CURRENT_RESERVE_DIRECTION';

export type CurrentRelationshipInventoryEntry = {
  id: string;
  order: number;
  participants: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId];
  displayLabel: string;
  authority: CurrentRelationshipInventoryAuthority;
  detailStatus: CurrentRelationshipDetailStatus;
  detailedMachineArcAvailable: boolean;
  reserveInvolved: boolean;
  currentCoverage: true;
  exactIncidentFrozen: false;
  romanceFrozenByInventory: false;
  bloodRelationFrozenByInventory: false;
  mainMysteryFrozenByInventory: false;
  source: 'docs/RELATIONSHIPS.md';
  detailedSource?: 'docs/design-targets/generated/character-relationship-arc-map-v1.json';
};

const detailed = (
  id: string,
  order: number,
  participants: CurrentRelationshipInventoryEntry['participants'],
  displayLabel: string,
  detailStatus: CurrentRelationshipDetailStatus,
  reserveInvolved = false,
): CurrentRelationshipInventoryEntry => ({
  id,
  order,
  participants,
  displayLabel,
  authority: 'DETAILED_MACHINE_ARC',
  detailStatus,
  detailedMachineArcAvailable: true,
  reserveInvolved,
  currentCoverage: true,
  exactIncidentFrozen: false,
  romanceFrozenByInventory: false,
  bloodRelationFrozenByInventory: false,
  mainMysteryFrozenByInventory: false,
  source: 'docs/RELATIONSHIPS.md',
  detailedSource: 'docs/design-targets/generated/character-relationship-arc-map-v1.json',
});

const coverage = (
  id: string,
  order: number,
  participants: CurrentRelationshipInventoryEntry['participants'],
  displayLabel: string,
  detailStatus: CurrentRelationshipDetailStatus = 'CURRENT_DIRECTION_WITH_CANDIDATE_FACTS',
  reserveInvolved = false,
): CurrentRelationshipInventoryEntry => ({
  id,
  order,
  participants,
  displayLabel,
  authority: 'CURRENT_HUB_COVERAGE_ARC',
  detailStatus,
  detailedMachineArcAvailable: false,
  reserveInvolved,
  currentCoverage: true,
  exactIncidentFrozen: false,
  romanceFrozenByInventory: false,
  bloodRelationFrozenByInventory: false,
  mainMysteryFrozenByInventory: false,
  source: 'docs/RELATIONSHIPS.md',
});

export const CURRENT_RELATIONSHIP_CHARACTER_IDS: readonly CurrentRelationCharacterId[] = [
  'yui', 'asa', 'nagi', 'michiru', 'tomori', 'sen', 'ritsu', 'koyori', 'gen', 'hana',
  'yubi', 'madoka', 'shiro', 'tobari', 'nemu', 'kuroori', 'kage1', 'kage2', 'kage3', 'kage4', 'ren',
] as const;

export const currentRelationshipInventory: readonly CurrentRelationshipInventoryEntry[] = [
  detailed('yui-asa', 1, ['yui', 'asa'], 'ユイ × アサ — 速さと確認', 'CURRENT_STRONG_RELATIONSHIP'),
  detailed('yui-kuroori', 2, ['yui', 'kuroori'], 'ユイ × クロオリ — 開く / 預かる', 'CURRENT_DIRECTION_WITH_CANDIDATE_FACTS'),
  detailed('nagi-kaname', 3, ['nagi', 'kage1'], 'ナギ × カナメ — 二つの守り', 'CURRENT_DIRECTION'),
  detailed('michiru-toki', 4, ['michiru', 'kage3'], 'ミチル × トキ — 道を選ぶ / 測る', 'CURRENT_DIRECTION'),
  detailed('tomori-tsumugi', 5, ['tomori', 'kage4'], 'トモリ × ツムギ — 直す / 跡を残す', 'CURRENT_DIRECTION'),
  detailed('ritsu-koyori', 6, ['ritsu', 'koyori'], 'リツ × コヨリ — 守る兄 / 救う妹', 'CURRENT_STRONG_RELATIONSHIP'),
  detailed('sen-koyori', 7, ['sen', 'koyori'], 'セン × コヨリ — 教える人 / ruleを作る子ども', 'CURRENT_DIRECTION'),
  detailed('yubi-tobari', 8, ['yubi', 'tobari'], 'ユウビ × トバリ — 届ける時 / 門を開ける時', 'CURRENT_DIRECTION'),
  detailed('madoka-ren', 9, ['madoka', 'ren'], 'マドカ × レン — 気づく / 伝える', 'CURRENT_RESERVE_DIRECTION', true),
  detailed('shiro-tsumugi', 10, ['shiro', 'kage4'], 'シロ × ツムギ — 未分類 / 未完', 'CURRENT_DIRECTION'),
  detailed('nemu-toki', 11, ['nemu', 'kage3'], 'ネム × トキ — 夢 / 計測', 'CURRENT_DIRECTION_WITH_CANDIDATE_FACTS'),
  detailed('gen-michiru', 12, ['gen', 'michiru'], 'ゲン × ミチル — 昔の道 / 今の道', 'CURRENT_DIRECTION_WITH_CANDIDATE_FACTS'),

  coverage('asa-kasumi', 13, ['asa', 'kage2'], 'アサ × カスミ — 名乗らせる / 隠して待つ'),
  coverage('yui-tomori', 14, ['yui', 'tomori'], 'ユイ × トモリ — 持ち主 / 修理した人 / 継がれた灯り'),
  coverage('hana-tsumugi', 15, ['hana', 'kage4'], 'ハナ × ツムギ — 保存 / 傷跡'),
  coverage('sen-shiro', 16, ['sen', 'shiro'], 'セン × シロ — 説明する / 未分類で残す'),
  coverage('nagi-tobari', 17, ['nagi', 'tobari'], 'ナギ × トバリ — 閉じる / 帰るため開ける'),
  coverage('kaname-ritsu', 18, ['kage1', 'ritsu'], 'カナメ × リツ — 守る人同士が誰へ任せるか'),
  coverage('yubi-kasumi', 19, ['yubi', 'kage2'], 'ユウビ × カスミ — 宛名を見せない配達'),
  coverage('madoka-nemu', 20, ['madoka', 'nemu'], 'マドカ × ネム — 見たこと / 夢で見たこと'),
  coverage('gen-toki', 21, ['gen', 'kage3'], 'ゲン × トキ — 古い経験 / 現在の測定'),
  coverage('hana-shiro', 22, ['hana', 'shiro'], 'ハナ × シロ — 意味が分かる物 / 分からない物を残す'),
  coverage('kuroori-yubi', 23, ['kuroori', 'yubi'], 'クロオリ × ユウビ — 今は渡さない責任'),
  coverage('ren-toki', 24, ['ren', 'kage3'], 'レン × トキ — 差分 / 測定値', 'CURRENT_RESERVE_DIRECTION', true),
] as const;

export const currentRelationshipInventoryById = new Map(currentRelationshipInventory.map((entry) => [entry.id, entry]));

const relationCountByCharacter = new Map<CurrentRelationCharacterId, number>(CURRENT_RELATIONSHIP_CHARACTER_IDS.map((id) => [id, 0]));
for (const entry of currentRelationshipInventory) {
  for (const participant of entry.participants) {
    relationCountByCharacter.set(participant, (relationCountByCharacter.get(participant) ?? 0) + 1);
  }
}

export const currentRelationshipCoverageByCharacter = CURRENT_RELATIONSHIP_CHARACTER_IDS.map((characterId) => ({
  characterId,
  relationCount: relationCountByCharacter.get(characterId) ?? 0,
}));

export const currentRelationshipInventorySummary = {
  total: currentRelationshipInventory.length,
  detailedMachineArcs: currentRelationshipInventory.filter((entry) => entry.detailedMachineArcAvailable).length,
  currentHubCoverageArcs: currentRelationshipInventory.filter((entry) => !entry.detailedMachineArcAvailable).length,
  reserveInvolvedArcs: currentRelationshipInventory.filter((entry) => entry.reserveInvolved).map((entry) => entry.id),
  characterCount: CURRENT_RELATIONSHIP_CHARACTER_IDS.length,
  minimumDistinctiveLanes: Math.min(...currentRelationshipCoverageByCharacter.map((entry) => entry.relationCount)),
  exactIncidentFrozenCount: currentRelationshipInventory.filter((entry) => entry.exactIncidentFrozen).length,
  romanceFrozenByInventoryCount: currentRelationshipInventory.filter((entry) => entry.romanceFrozenByInventory).length,
  bloodRelationFrozenByInventoryCount: currentRelationshipInventory.filter((entry) => entry.bloodRelationFrozenByInventory).length,
  mainMysteryFrozenByInventoryCount: currentRelationshipInventory.filter((entry) => entry.mainMysteryFrozenByInventory).length,
} as const;
