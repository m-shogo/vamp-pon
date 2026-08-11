import { stageProductionEntries } from './stageProductionDatabase.ts';

export type StageWorldLayer =
  | 'THRESHOLD_NIGHT'
  | 'NIGHT_RECORD'
  | 'REALITY_ECHO_NIGHT'
  | 'RECORD_NIGHT'
  | 'THRESHOLD_MULTI_ERA'
  | 'NIGHT_UNKNOWN_ADJACENT'
  | 'NIGHT_IDEOLOGY_COLLISION'
  | 'NIGHT_DAWN_THRESHOLD';

export type StageWorldLoreEntry = {
  stageId: string;
  worldLayer: StageWorldLayer;
  institutionLinks: readonly string[];
  incidentIds: readonly string[];
  knowledgeBeat: string;
  ordinaryDetail: string;
  forbiddenImplication: string;
  sakumeiRelevance: 'NONE' | 'MIRROR_SEED' | 'CLUE' | 'REVEAL_CANDIDATE';
  runtimeAutoPromotionAllowed: false;
};

export const stageWorldLoreEntries: readonly StageWorldLoreEntry[] = [
  {
    stageId: 'forgotten_street',
    worldLayer: 'THRESHOLD_NIGHT',
    institutionLinks: ['lost-property', 'local-shop', 'residential-route'],
    incidentIds: ['INC-NAME-001'],
    knowledgeBeat: 'Night first reads as an ordinary lived street with one or two details that are wrong rather than a separate fantasy world.',
    ordinaryDetail: '傘立て、閉店札、持ち主不明の小物など、誰かが少し前まで暮らしていた痕跡を残す。',
    forbiddenImplication: 'Stage1 alone may not define the final identity or origin of Night.',
    sakumeiRelevance: 'NONE',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'name_tag_alley',
    worldLayer: 'NIGHT_RECORD',
    institutionLinks: ['school-name-tags', 'postal-labels', 'shop-hold-tags'],
    incidentIds: ['INC-NAME-001'],
    knowledgeBeat: 'Correcting a wrong name and deciding a correct name before the person confirms it are different actions.',
    ordinaryDetail: '学校・荷札・取り置き札など用途の違う名前札を混在させる。',
    forbiddenImplication: 'Shared name motifs may not imply that Kasumi, Nashiro and Petta belong to one faction.',
    sakumeiRelevance: 'MIRROR_SEED',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'moon_box_library',
    worldLayer: 'NIGHT_RECORD',
    institutionLinks: ['library', 'archive'],
    incidentIds: ['INC-GATE-001'],
    knowledgeBeat: 'The key question is who chooses the opening time and expiration condition, not simply open versus closed.',
    ordinaryDetail: '貸出札、保管期限、箱の管理札を置き、書庫を生活運用された場所にする。',
    forbiddenImplication: 'The Moon Box may not be promoted into a Night-origin machine.',
    sakumeiRelevance: 'MIRROR_SEED',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'return_map_crossing',
    worldLayer: 'THRESHOLD_NIGHT',
    institutionLinks: ['road', 'transport', 'sign-maintenance'],
    incidentIds: ['INC-ROUTE-002'],
    knowledgeBeat: 'An old map can have been correct at its own time even when it is wrong for the present route.',
    ordinaryDetail: '工事迂回、手描き案内、消された道路線など時間差のあるroute evidenceを残す。',
    forbiddenImplication: 'Stars may not become an infallible single-route navigation authority.',
    sakumeiRelevance: 'MIRROR_SEED',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'repair_lamp_workshop',
    worldLayer: 'REALITY_ECHO_NIGHT',
    institutionLinks: ['repair-shop', 'craft-economy'],
    incidentIds: ['INC-LAMP-001'],
    knowledgeBeat: 'Different repair languages can exist on the same type of object across eras without proving same-object lineage.',
    ordinaryDetail: '修理日付、交換部品、煤、作業椅子など手仕事の生活痕を見せる。',
    forbiddenImplication: 'A similar repair seam may not prove that Tomori directly handed Yui her lantern.',
    sakumeiRelevance: 'MIRROR_SEED',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'chalk_classroom',
    worldLayer: 'REALITY_ECHO_NIGHT',
    institutionLinks: ['school', 'education'],
    incidentIds: [],
    knowledgeBeat: 'Ordinary learning and explanation can carry era differences without becoming a Main Mystery answer.',
    ordinaryDetail: '机の傷、出席札、忘れ物箱、黒板の日直跡を残す。',
    forbiddenImplication: 'The school may not silently become a secret Night-training institution.',
    sakumeiRelevance: 'NONE',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'half_candy_arcade',
    worldLayer: 'REALITY_ECHO_NIGHT',
    institutionLinks: ['small-retail', 'local-economy'],
    incidentIds: [],
    knowledgeBeat: 'Reality economy is visible through ordinary daily purchases and remains separate from gameplay currency.',
    ordinaryDetail: '値札跡、包み紙、古看板、店先benchを普通の生活物として置く。',
    forbiddenImplication: 'Ordinary snacks may not all be upgraded into mystery relics.',
    sakumeiRelevance: 'NONE',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'paper_cord_playground',
    worldLayer: 'REALITY_ECHO_NIGHT',
    institutionLinks: ['playground', 'school', 'maintenance'],
    incidentIds: ['INC-CIVIC-001'],
    knowledgeBeat: 'Being small does not remove a person from counts, records or agency.',
    ordinaryDetail: '遊具補修、地面の線、名前跡など、子どもが実際に遊んだ痕跡を優先する。',
    forbiddenImplication: 'Childhood atmosphere may not be reduced to missing-child horror clichés or forced tragedy.',
    sakumeiRelevance: 'NONE',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'old_compass_station',
    worldLayer: 'THRESHOLD_MULTI_ERA',
    institutionLinks: ['station', 'transport'],
    incidentIds: ['INC-ROUTE-001', 'INC-ROUTE-002'],
    knowledgeBeat: 'Material and transport evidence can make the cast suspect era mismatch without anyone announcing exact years.',
    ordinaryDetail: 'bench、駅灯、時刻表跡、切符様式をera evidenceとして使う。',
    forbiddenImplication: 'Gen being elderly may not itself prove that he belongs to the OLD era.',
    sakumeiRelevance: 'MIRROR_SEED',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'pressed_flower_archive',
    worldLayer: 'RECORD_NIGHT',
    institutionLinks: ['archive', 'household-preservation'],
    incidentIds: ['INC-CIVIC-001'],
    knowledgeBeat: 'Preserving something can mean keeping it long enough to hand it back rather than closing it forever.',
    ordinaryDetail: '保存箱、季節ラベル、本、布包みを生活手順として見せる。',
    forbiddenImplication: 'Hana preservation may not be collapsed into Asatoji permanent containment.',
    sakumeiRelevance: 'MIRROR_SEED',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'unposted_post_office',
    worldLayer: 'REALITY_ECHO_NIGHT',
    institutionLinks: ['postal', 'delivery'],
    incidentIds: ['INC-POST-001'],
    knowledgeBeat: 'Undelivered does not mean uncared-for; holding, returning and delivering are different responsibilities.',
    ordinaryDetail: '仕分け棚、保管期限、返送印、職員の手書き補足を残す。',
    forbiddenImplication: 'Postal workers may not all be promoted into people who know the truth of Night.',
    sakumeiRelevance: 'MIRROR_SEED',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'paper_plane_window',
    worldLayer: 'REALITY_ECHO_NIGHT',
    institutionLinks: ['witness', 'media', 'school', 'household'],
    incidentIds: [],
    knowledgeBeat: 'Firsthand witnessing can still be incomplete; seen and unseen parts must remain distinct.',
    ordinaryDetail: '窓、回覧物、遠景、紙飛行機を「見る生活」の手触りとして使う。',
    forbiddenImplication: 'An observer character may not become the authorial omniscient answer source.',
    sakumeiRelevance: 'NONE',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'white_bookmark_library',
    worldLayer: 'RECORD_NIGHT',
    institutionLinks: ['archive', 'library'],
    incidentIds: ['INC-ARCHIVE-001'],
    knowledgeBeat: 'Erase, force-classify and preserve-as-unclassified are three different responses to uncertainty.',
    ordinaryDetail: '未分類棚、注記、異版、白いしおりを実務として見せる。',
    forbiddenImplication: 'Unclassified records may not all become a hidden cache of Main Mystery answers.',
    sakumeiRelevance: 'MIRROR_SEED',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'ticket_gate_station',
    worldLayer: 'THRESHOLD_NIGHT',
    institutionLinks: ['station', 'transport', 'gate-operation'],
    incidentIds: ['INC-ROUTE-001', 'INC-GATE-001'],
    knowledgeBeat: 'A boundary can protect return by controlling passage rather than merely stopping movement.',
    ordinaryDetail: '改札、切符穴、待合、帰宅案内を普通の交通運用として置く。',
    forbiddenImplication: 'The gate may not be promoted into the machine that created Night.',
    sakumeiRelevance: 'MIRROR_SEED',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'dream_waterway',
    worldLayer: 'NIGHT_UNKNOWN_ADJACENT',
    institutionLinks: ['household-sleep', 'aftercare'],
    incidentIds: [],
    knowledgeBeat: 'Dream-like phenomena can exist inside Night without proving that Night itself is a dream.',
    ordinaryDetail: '日記、睡眠、静かな水辺の習慣を残し、pure abstractionだけにしない。',
    forbiddenImplication: 'This Stage may not be used as proof that Night equals a dream world.',
    sakumeiRelevance: 'MIRROR_SEED',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'black_origami_roof',
    worldLayer: 'NIGHT_IDEOLOGY_COLLISION',
    institutionLinks: ['roof-access', 'record-concealment'],
    incidentIds: [],
    knowledgeBeat: 'Kuroori keeping something closed and Orine folding meaning away are related questions with different ownership rules.',
    ordinaryDetail: '屋根の補修跡や生活物を残し、黒い紙だけの抽象空間にしない。',
    forbiddenImplication: 'Kuroori and Orine may not be implied to be the same person, relatives or creator/creation by visual similarity alone.',
    sakumeiRelevance: 'CLUE',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'erased_name_wall',
    worldLayer: 'NIGHT_RECORD',
    institutionLinks: ['public-signage', 'name-record'],
    incidentIds: ['INC-NAME-001'],
    knowledgeBeat: 'Privacy, erasure, correction and imposed naming remain distinct ethical actions.',
    ordinaryDetail: '訂正跡、剥がした札の糊跡、古い文字層を生活recordとして残す。',
    forbiddenImplication: 'Theme similarity may not auto-create faction membership among Kasumi, Nashiro and Petta.',
    sakumeiRelevance: 'CLUE',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'ruler_rooftop',
    worldLayer: 'NIGHT_RECORD',
    institutionLinks: ['measurement', 'surveying', 'time-record'],
    incidentIds: ['INC-ROUTE-002'],
    knowledgeBeat: 'Measurements can both be honest when time and conditions differ; measurement itself is not the villain.',
    ordinaryDetail: '測量線、時計記録、補修基準など実務の痕跡を置く。',
    forbiddenImplication: 'Measurement and science may not be framed as inherently cold or evil.',
    sakumeiRelevance: 'MIRROR_SEED',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'blank_card_room',
    worldLayer: 'RECORD_NIGHT',
    institutionLinks: ['archive', 'classification'],
    incidentIds: ['INC-ARCHIVE-001'],
    knowledgeBeat: 'Tsumugi leaves room for what comes next, Shiro preserves uncertainty, and Hakuma erases meaning to prevent misunderstanding.',
    ordinaryDetail: 'card storage、注記枠、余白の使い分けをrecord practiceとして見せる。',
    forbiddenImplication: 'Hakuma may not be implied to be Tsumugi’s enemy form or alternate identity.',
    sakumeiRelevance: 'REVEAL_CANDIDATE',
    runtimeAutoPromotionAllowed: false,
  },
  {
    stageId: 'dawn_return_square',
    worldLayer: 'NIGHT_DAWN_THRESHOLD',
    institutionLinks: ['public-square', 'return-route'],
    incidentIds: [],
    knowledgeBeat: 'Title1 pays local emotional answers about return, re-choice and Black-Youka without answering the final origin of Night.',
    ordinaryDetail: '前Stageの地図、名札、箱、修理跡など生活Objectを小さく再登場させて世界を持ち帰る。',
    forbiddenImplication: 'Stage20 may not dump Night origin, Sakumei founder or full cosmology at the cost of the Happy End.',
    sakumeiRelevance: 'NONE',
    runtimeAutoPromotionAllowed: false,
  },
] as const;

const productionIds = stageProductionEntries.map((entry) => entry.id);
const integrationIds = stageWorldLoreEntries.map((entry) => entry.stageId);

export const stageWorldLoreSummary = {
  productionStageCount: productionIds.length,
  integrationStageCount: integrationIds.length,
  uniqueIntegrationStageCount: new Set(integrationIds).size,
  missingProductionStageIds: productionIds.filter((id) => !integrationIds.includes(id)),
  orphanIntegrationStageIds: integrationIds.filter((id) => !productionIds.includes(id)),
  sakumeiClueOrRevealStageCount: stageWorldLoreEntries.filter((entry) => entry.sakumeiRelevance === 'CLUE' || entry.sakumeiRelevance === 'REVEAL_CANDIDATE').length,
  runtimeAutoPromotionAllowed: false,
} as const;
