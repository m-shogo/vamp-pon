import { spotlightEnemyCharacterEntries } from './spotlightEnemyCharacterSource.ts';

/**
 * Legacy compatibility identity.
 *
 * `八影 / 夜綴りの八影` is no longer the Current formal Season 1 team name.
 * The Current formal name is `朔夜座`; see STORY_WORLD_MASTER_SOURCE and
 * SAKUYAZA_CURRENT_IDENTITY. This object survives only so old asset IDs,
 * call-name history, encounter ledgers and authored relationship material do
 * not lose lineage during migration.
 */
export const YATSUKAGE_GROUP_IDENTITY = {
  formalName: '夜綴りの八影',
  formalReading: 'よつづりの・やつかげ',
  shortName: '八影',
  shortReading: 'やつかげ',
  englishWorkingLabel: 'Eight Shadows of the Night Weave',
  memberCount: 8,
  taxonomy: 'LEGACY_EARLY_OBSERVER_LABEL_COMPATIBILITY_ONLY',
  meaning: '旧観測側が八つの強い「読み違い」をまとめたearly observer label。現在のSeason1 formal team identityではない。',
  namingRule: '旧観測ラベルとしてのみ保持する。Current formal team name / final Visual Master name / late player-facing formal labelへ昇格させない。',
  mysteryRule: '旧八影ラベルだけから創造者・共通起源・上下関係・黒幕を推定しない。',
  trueNameRule: '各個体の短い名前は作中の呼び名。真名・人間時代の名前・前世名を自動的に意味しない。',
  authority: 'SUPERSEDED_LEGACY_OBSERVER_LABEL',
  currentFormalName: '朔夜座',
  supersededBy: '朔夜座',
  currentNamingAuthorityPath: 'docs/sakuyaza-current-identity-v1.md',
  mayBeCurrentFormalTeamName: false,
  mayNameNewVisualMaster: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export type YatsukageCallNameEntry = {
  enemyId: string;
  currentEnemyName: string;
  callName: string;
  callNameReading: string;
  namingOrigin: string;
  whyItSticks: string;
  trueNameFrozen: false;
  factionMembershipImplied: false;
  runtimeAutoPromotionAllowed: false;
};

const seeds: readonly YatsukageCallNameEntry[] = [
  {
    enemyId: 'boss_name_without_owner',
    currentEnemyName: '持ち主のない名前',
    callName: 'ナシロ',
    callNameReading: 'なしろ',
    namingOrigin: '空欄の名札を見たCurrent側が、最初は便宜上そう呼び始める。本人へ勝手な「正解の名前」を貼る行為にならないよう、真名とは明確に分ける。',
    whyItSticks: '名前を持たないのではなく「まだ決めない余白」を含む短い呼び名。名札を扱う敵として音でも覚えやすい。',
    trueNameFrozen: false,
    factionMembershipImplied: false,
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'boss_closed_morning_box',
    currentEnemyName: '閉じた朝箱',
    callName: 'アサトジ',
    callNameReading: 'あさとじ',
    namingOrigin: '朝を閉じる仕草が何度も観測され、記録係が短縮して呼ぶようになる。',
    whyItSticks: '箱そのものより「朝を閉じる」という行為を名前に残すため、過去を知った後も意味が変わって聞こえる。',
    trueNameFrozen: false,
    factionMembershipImplied: false,
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'boss_night_without_route',
    currentEnemyName: '帰路のない夜',
    callName: 'ミチグレ',
    callNameReading: 'みちぐれ',
    namingOrigin: '道が一本ずつ暮れて消える現象から、旅をする側が自然にそう呼ぶ。',
    whyItSticks: '「帰れない怪物」ではなく、道そのものが暮れていく恐怖を短い音にする。',
    trueNameFrozen: false,
    factionMembershipImplied: false,
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'omburo_black_origami',
    currentEnemyName: 'オンブロ 黒折',
    callName: 'オリネ',
    callNameReading: 'おりね',
    namingOrigin: '毎回同じ折り目を一本だけ残すことから付いた呼び名。クロオリ本人と名前が近づきすぎないよう別音にする。',
    whyItSticks: '形態が変わっても「折り目」で同一個体だと分かる recurring rival の記号になる。',
    trueNameFrozen: false,
    factionMembershipImplied: false,
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'omburo_blank_card',
    currentEnemyName: 'オンブロ 余白枠',
    callName: 'ハクマ',
    callNameReading: 'はくま',
    namingOrigin: '中央へ何も書かない「白い間」を見続けた観測側が付ける。',
    whyItSticks: '空白を欠損ではなく意思として感じさせ、短い呼び名だけでも不気味さを残せる。',
    trueNameFrozen: false,
    factionMembershipImplied: false,
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'omburo_repair_seam',
    currentEnemyName: 'オンブロ 継ぎ目',
    callName: 'ツグリ',
    callNameReading: 'つぐり',
    namingOrigin: '壊れた物を見ると勝手に継ごうとする反復行動から付く。',
    whyItSticks: '「修理屋」のような善良語ではなく、継ぐ行為だけを残し、善意と侵害の両方を持てる。',
    trueNameFrozen: false,
    factionMembershipImplied: false,
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'omburo_dream_wave',
    currentEnemyName: 'オンブロ 夢波',
    callName: 'ユラネ',
    callNameReading: 'ゆらね',
    namingOrigin: '眠りへ引く波が、危険な時ほど静かに揺れることから付く。',
    whyItSticks: '柔らかく安心する響きなのに敵である、という誘惑型の矛盾を名前自体に持たせる。',
    trueNameFrozen: false,
    factionMembershipImplied: false,
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'omburo_nameplate',
    currentEnemyName: 'オンブロ 名札',
    callName: 'ペタ',
    callNameReading: 'ぺた',
    namingOrigin: '間違いを剥がさず、その上から新しい札を毎回ぺたぺた貼るため、アサ周辺から半ば呆れて定着する。',
    whyItSticks: '旧八影資料では唯一、呼ぶだけで少し笑える petty rival として設計された。Current朔夜座でもこの愛着資産は再審査して保持できる。',
    trueNameFrozen: false,
    factionMembershipImplied: false,
    runtimeAutoPromotionAllowed: false,
  },
] as const;

const spotlightIds = new Set(spotlightEnemyCharacterEntries.map((entry) => entry.enemyId));
for (const seed of seeds) {
  if (!spotlightIds.has(seed.enemyId)) throw new Error(`legacy 八影 call-name source references non-Spotlight8 enemy: ${seed.enemyId}`);
}

/** Legacy export name retained for existing imports. */
export const yatsukageCallNames = seeds;
export const yatsukageCallNameByEnemyId = new Map(yatsukageCallNames.map((entry) => [entry.enemyId, entry]));

export const yatsukageIdentitySummary = {
  legacyFormalName: YATSUKAGE_GROUP_IDENTITY.formalName,
  legacyShortName: YATSUKAGE_GROUP_IDENTITY.shortName,
  currentFormalName: YATSUKAGE_GROUP_IDENTITY.currentFormalName,
  authority: YATSUKAGE_GROUP_IDENTITY.authority,
  supersededBy: YATSUKAGE_GROUP_IDENTITY.supersededBy,
  memberCount: yatsukageCallNames.length,
  uniqueCallNameCount: new Set(yatsukageCallNames.map((entry) => entry.callName)).size,
  spotlightMemberCount: spotlightEnemyCharacterEntries.length,
  allCallNamesAreNotTrueNames: yatsukageCallNames.every((entry) => !entry.trueNameFrozen),
  factionMembershipImplied: false,
  mayBeCurrentFormalTeamName: false,
  mayNameNewVisualMaster: false,
  runtimeAutoPromotionAllowed: false,
} as const;
