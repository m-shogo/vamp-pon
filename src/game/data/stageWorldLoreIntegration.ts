import { stageProductionEntries } from './stageProductionDatabase.ts';

export type StageWorldLayer =
  | 'THRESHOLD_DREAM'
  | 'DREAM_RECORD'
  | 'REALITY_ECHO_DREAM'
  | 'RECORD_DREAM'
  | 'THRESHOLD_MULTI_ERA'
  | 'DREAM_UNKNOWN_ADJACENT'
  | 'DREAM_IDEOLOGY_COLLISION'
  | 'DREAM_MOONLESS_DEPTH';

export type SakuyazaStageRelevance = 'NONE' | 'MIRROR_SEED' | 'CLUE' | 'REVEAL_CANDIDATE';

export type StageWorldLoreEntry = {
  stageId: string;
  worldLayer: StageWorldLayer;
  institutionLinks: readonly string[];
  incidentIds: readonly string[];
  knowledgeBeat: string;
  ordinaryDetail: string;
  forbiddenImplication: string;
  sakuyazaRelevance: SakuyazaStageRelevance;
  /** @deprecated Legacy authored field kept so older readers do not break. Current formal identity is 朔夜座. */
  sakumeiRelevance: SakuyazaStageRelevance;
  runtimeAutoPromotionAllowed: false;
};

const entry = (
  value: Omit<StageWorldLoreEntry, 'sakumeiRelevance' | 'runtimeAutoPromotionAllowed'>,
): StageWorldLoreEntry => ({
  ...value,
  sakumeiRelevance: value.sakuyazaRelevance,
  runtimeAutoPromotionAllowed: false,
});

export const stageWorldLoreEntries: readonly StageWorldLoreEntry[] = [
  entry({
    stageId: 'forgotten_street',
    worldLayer: 'THRESHOLD_DREAM',
    institutionLinks: ['lost-property', 'local-shop', 'residential-route'],
    incidentIds: ['INC-NAME-001'],
    knowledgeBeat: 'Yoru-no-Shirube is already a Dream world; Stage1 should make that Dream feel like an ordinary lived street whose era and ownership are slightly wrong.',
    ordinaryDetail: '傘立て、閉店札、落とし物、生活音を置き、最初から抽象異界だけにしない。',
    forbiddenImplication: 'Stage1 may not explain the final origin or sharing mechanism of the Dream world.',
    sakuyazaRelevance: 'NONE',
  }),
  entry({
    stageId: 'name_tag_alley',
    worldLayer: 'DREAM_RECORD',
    institutionLinks: ['school-name-tags', 'postal-labels', 'shop-hold-tags'],
    incidentIds: ['INC-NAME-001'],
    knowledgeBeat: 'Correcting a wrong name and imposing a correct name before consent are different actions.',
    ordinaryDetail: '学校名札、荷札、取り置き札など用途の違う名前を混在させる。',
    forbiddenImplication: 'Name motifs alone may not imply that Kasumi, Nashiro and Petta share one origin or hierarchy.',
    sakuyazaRelevance: 'MIRROR_SEED',
  }),
  entry({
    stageId: 'moon_box_library',
    worldLayer: 'DREAM_RECORD',
    institutionLinks: ['library', 'archive'],
    incidentIds: ['INC-GATE-001'],
    knowledgeBeat: 'The question is who chooses opening time and reopening conditions, not simply open versus closed.',
    ordinaryDetail: '貸出札、保管期限、箱の管理札を残し、書庫が使われていた生活感を見せる。',
    forbiddenImplication: 'The Moon Box may not be promoted into the machine that created the Dream world.',
    sakuyazaRelevance: 'MIRROR_SEED',
  }),
  entry({
    stageId: 'return_map_crossing',
    worldLayer: 'THRESHOLD_MULTI_ERA',
    institutionLinks: ['road', 'transport', 'sign-maintenance'],
    incidentIds: ['INC-ROUTE-002'],
    knowledgeBeat: 'An old map can be correct in its own era while wrong for another era; exact time tags remain weak in Dream.',
    ordinaryDetail: '工事迂回、旧道、手描き案内、消された路線をEra evidenceとして残す。',
    forbiddenImplication: 'Stars or one constellation name may not become an infallible single-route authority.',
    sakuyazaRelevance: 'MIRROR_SEED',
  }),
  entry({
    stageId: 'repair_lamp_workshop',
    worldLayer: 'REALITY_ECHO_DREAM',
    institutionLinks: ['repair-shop', 'craft'],
    incidentIds: ['INC-LAMP-001'],
    knowledgeBeat: 'Repair language and materials can expose era difference without proving same-object lineage.',
    ordinaryDetail: '修理日付、交換部品、煤、作業椅子を手仕事の生活痕として見せる。',
    forbiddenImplication: 'A similar seam may not prove that Tomori directly handed Yui the lantern.',
    sakuyazaRelevance: 'MIRROR_SEED',
  }),
  entry({
    stageId: 'chalk_classroom',
    worldLayer: 'REALITY_ECHO_DREAM',
    institutionLinks: ['school', 'education'],
    incidentIds: [],
    knowledgeBeat: 'School words, tools and routines can carry era difference without exposition.',
    ordinaryDetail: '机の傷、出席札、忘れ物箱、黒板の日直跡を置く。',
    forbiddenImplication: 'The school may not silently become a secret Dream-training institution.',
    sakuyazaRelevance: 'NONE',
  }),
  entry({
    stageId: 'half_candy_arcade',
    worldLayer: 'REALITY_ECHO_DREAM',
    institutionLinks: ['small-retail', 'food-culture'],
    incidentIds: [],
    knowledgeBeat: 'Food is easy to obtain in Dream, so packaging, vocabulary and unfamiliar snacks should carry era clues rather than survival stakes.',
    ordinaryDetail: '包み紙、古看板、店先benchを日常の記憶として使う。',
    forbiddenImplication: 'Dream food may not require a normal currency economy or turn every snack into a mystery relic.',
    sakuyazaRelevance: 'NONE',
  }),
  entry({
    stageId: 'paper_cord_playground',
    worldLayer: 'REALITY_ECHO_DREAM',
    institutionLinks: ['playground', 'school', 'maintenance'],
    incidentIds: ['INC-CIVIC-001'],
    knowledgeBeat: 'Childhood traces should establish ordinary life before they become incident evidence.',
    ordinaryDetail: '遊具補修、地面の線、名前跡を普通の遊びの痕跡として置く。',
    forbiddenImplication: 'Childhood atmosphere may not be reduced to missing-child horror or forced tragedy.',
    sakuyazaRelevance: 'NONE',
  }),
  entry({
    stageId: 'old_compass_station',
    worldLayer: 'THRESHOLD_MULTI_ERA',
    institutionLinks: ['station', 'transport'],
    incidentIds: ['INC-ROUTE-001', 'INC-ROUTE-002'],
    knowledgeBeat: 'Ticket, station and material evidence can make the cast suspect era mismatch without exact-year self-introductions.',
    ordinaryDetail: 'bench、駅灯、時刻表跡、切符様式をEra evidenceとして使う。',
    forbiddenImplication: 'Gen being elderly may not itself prove that he comes from an older era.',
    sakuyazaRelevance: 'MIRROR_SEED',
  }),
  entry({
    stageId: 'pressed_flower_archive',
    worldLayer: 'RECORD_DREAM',
    institutionLinks: ['archive', 'household-preservation'],
    incidentIds: ['INC-CIVIC-001'],
    knowledgeBeat: 'Preserving can mean keeping something long enough to return it rather than closing it forever.',
    ordinaryDetail: '保存箱、季節label、本、布包みを生活手順として置く。',
    forbiddenImplication: 'Hana preservation may not be collapsed into Asatoji permanent containment.',
    sakuyazaRelevance: 'MIRROR_SEED',
  }),
  entry({
    stageId: 'unposted_post_office',
    worldLayer: 'REALITY_ECHO_DREAM',
    institutionLinks: ['postal', 'delivery'],
    incidentIds: ['INC-POST-001'],
    knowledgeBeat: 'Undelivered, held, returned and deliberately not delivered are different responsibilities.',
    ordinaryDetail: '仕分け棚、保管期限、返送印、職員の手書き補足を残す。',
    forbiddenImplication: 'Postal workers may not all know the final mechanism of the Dream world.',
    sakuyazaRelevance: 'MIRROR_SEED',
  }),
  entry({
    stageId: 'paper_plane_window',
    worldLayer: 'REALITY_ECHO_DREAM',
    institutionLinks: ['witness', 'media', 'school', 'household'],
    incidentIds: [],
    knowledgeBeat: 'Firsthand witnessing can remain incomplete; seen and unseen parts must stay distinct.',
    ordinaryDetail: '窓、回覧物、遠景、紙飛行機を「見る生活」の手触りとして使う。',
    forbiddenImplication: 'An observer character may not become an omniscient authorial answer source.',
    sakuyazaRelevance: 'NONE',
  }),
  entry({
    stageId: 'white_bookmark_library',
    worldLayer: 'RECORD_DREAM',
    institutionLinks: ['archive', 'library'],
    incidentIds: ['INC-ARCHIVE-001'],
    knowledgeBeat: 'Erase, force-classify and preserve-as-unclassified are distinct responses to uncertainty.',
    ordinaryDetail: '未分類棚、注記、異版、白いしおりをrecord practiceとして見せる。',
    forbiddenImplication: 'Unclassified records may not all become hidden Main Mystery answer caches.',
    sakuyazaRelevance: 'MIRROR_SEED',
  }),
  entry({
    stageId: 'ticket_gate_station',
    worldLayer: 'THRESHOLD_MULTI_ERA',
    institutionLinks: ['station', 'transport', 'gate-operation'],
    incidentIds: ['INC-ROUTE-001', 'INC-GATE-001'],
    knowledgeBeat: 'A boundary can control passage without being the device that causes Waking or creates the Dream.',
    ordinaryDetail: '改札、切符穴、待合、案内をEra-specific transport tracesとして置く。',
    forbiddenImplication: 'The gate may not be promoted into a physical dawn-return machine.',
    sakuyazaRelevance: 'MIRROR_SEED',
  }),
  entry({
    stageId: 'dream_waterway',
    worldLayer: 'DREAM_UNKNOWN_ADJACENT',
    institutionLinks: ['sleep-routine', 'aftercare'],
    incidentIds: [],
    knowledgeBeat: 'This Stage can openly lean into Dream logic because Yoru-no-Shirube being a Dream is already decided; only the final mechanism remains unknown.',
    ordinaryDetail: '日記、休息、静かな水辺、知らないEraの飲み物などを置き、抽象空間だけにしない。',
    forbiddenImplication: 'The Stage may not claim to reveal who created the shared Dream or how the final mechanism works.',
    sakuyazaRelevance: 'MIRROR_SEED',
  }),
  entry({
    stageId: 'black_origami_roof',
    worldLayer: 'DREAM_IDEOLOGY_COLLISION',
    institutionLinks: ['roof-access', 'record-concealment'],
    incidentIds: [],
    knowledgeBeat: 'Kuroori closing something and Orine folding meaning away are related questions with different ownership rules.',
    ordinaryDetail: '屋根の補修跡や生活物を残し、黒い紙だけの抽象空間にしない。',
    forbiddenImplication: 'Kuroori and Orine may not be implied to be the same person, relatives or creator/creation by motif similarity.',
    sakuyazaRelevance: 'CLUE',
  }),
  entry({
    stageId: 'erased_name_wall',
    worldLayer: 'DREAM_RECORD',
    institutionLinks: ['public-signage', 'name-record'],
    incidentIds: ['INC-NAME-001'],
    knowledgeBeat: 'Privacy, erasure, correction and imposed naming remain distinct ethical actions.',
    ordinaryDetail: '訂正跡、剥がした札の糊跡、古い文字層を生活Recordとして残す。',
    forbiddenImplication: 'Theme similarity may not auto-create shared origin among Kasumi, Nashiro and Petta.',
    sakuyazaRelevance: 'CLUE',
  }),
  entry({
    stageId: 'ruler_rooftop',
    worldLayer: 'DREAM_RECORD',
    institutionLinks: ['measurement', 'surveying', 'time-record'],
    incidentIds: ['INC-ROUTE-002'],
    knowledgeBeat: 'Measurements can both be honest when era and conditions differ; science itself is not the villain.',
    ordinaryDetail: '測量線、時計記録、補修基準を実務痕として置く。',
    forbiddenImplication: 'Measurement may not be framed as inherently cold or evil, and exact time tags should not suddenly become universally clear.',
    sakuyazaRelevance: 'MIRROR_SEED',
  }),
  entry({
    stageId: 'blank_card_room',
    worldLayer: 'DREAM_RECORD',
    institutionLinks: ['archive', 'classification'],
    incidentIds: ['INC-ARCHIVE-001'],
    knowledgeBeat: 'Tsumugi leaves room, Shiro preserves uncertainty, and Hakuma erases meaning to prevent misunderstanding.',
    ordinaryDetail: 'card storage、注記枠、余白の使い分けをRecord practiceとして見せる。',
    forbiddenImplication: 'Hakuma may not be implied to be Tsumugi’s enemy form or alternate identity.',
    sakuyazaRelevance: 'REVEAL_CANDIDATE',
  }),
  entry({
    stageId: 'dawn_return_square',
    worldLayer: 'DREAM_MOONLESS_DEPTH',
    institutionLinks: ['public-square', 'waking-threshold'],
    incidentIds: [],
    knowledgeBeat: 'The legacy Stage ID can host a local emotional resolution and Waking while the sky remains night; its ID must not force a physical dawn into Canon.',
    ordinaryDetail: '前Stageの地図、名札、箱、修理跡、星座の違和感を小さく再登場させ、Dreamで積んだ日常を返す。',
    forbiddenImplication: 'Stage20 may not create a sunrise, dump the Dream origin, reveal a fixed 群青残響録 boss, or require a Sakuyaza founder to finish the Happy End.',
    sakuyazaRelevance: 'NONE',
  }),
] as const;

const productionIds = stageProductionEntries.map((item) => item.id);
const integrationIds = stageWorldLoreEntries.map((item) => item.stageId);

export const stageWorldLoreSummary = {
  productionStageCount: productionIds.length,
  integrationStageCount: integrationIds.length,
  uniqueIntegrationStageCount: new Set(integrationIds).size,
  missingProductionStageIds: productionIds.filter((id) => !integrationIds.includes(id)),
  orphanIntegrationStageIds: integrationIds.filter((id) => !productionIds.includes(id)),
  sakuyazaClueOrRevealStageCount: stageWorldLoreEntries.filter(
    (item) => item.sakuyazaRelevance === 'CLUE' || item.sakuyazaRelevance === 'REVEAL_CANDIDATE',
  ).length,
  /** @deprecated legacy metric name kept for compatibility */
  sakumeiClueOrRevealStageCount: stageWorldLoreEntries.filter(
    (item) => item.sakuyazaRelevance === 'CLUE' || item.sakuyazaRelevance === 'REVEAL_CANDIDATE',
  ).length,
  physicalMorningStageCount: 0,
  runtimeAutoPromotionAllowed: false,
} as const;
