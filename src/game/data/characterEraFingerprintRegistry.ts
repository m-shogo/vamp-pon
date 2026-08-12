import {
  CHARACTER_ERA_FORESHADOW_DIALOGUE,
  type RealityEraLane,
} from './characterEraForeshadowDialogueReservoir.ts';

export const ERA_FINGERPRINT_RULES = {
  authority: 'docs/character-era-fingerprints-v1.md',
  status: 'AUTHOR_CANDIDATE_NON_CANON',
  characterCountRequired: 36,
  categoriesRequired: 9,
  categories: [
    'vocabulary',
    'food',
    'communication',
    'school',
    'work',
    'transport',
    'tools',
    'money',
    'humor',
  ],
  exactYearAllowed: false,
  exactBirthYearAllowed: false,
  eraLabelInDialogueAllowed: false,
  superiorityFramingAllowed: false,
  oneFingerprintMayProveEra: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export type EraFingerprintCategory = (typeof ERA_FINGERPRINT_RULES.categories)[number];

type LaneFingerprint = Readonly<Record<EraFingerprintCategory, readonly string[]>>;

const LANE_FINGERPRINTS: Readonly<Record<RealityEraLane, LaneFingerprint>> = {
  POSTWAR_RECOVERY_SCARCITY: {
    vocabulary: ['repair/reuse before replacement', 'distance and quantity described materially'],
    food: ['seasonality and preservation are ordinary knowledge', 'wrapping/container reuse is unremarkable'],
    communication: ['message arrival is not assumed immediate', 'address and handwriting carry practical weight'],
    school: ['paper reference and copying by hand feel ordinary', 'reference material is treated as scarce enough to preserve'],
    work: ['skill is read through hands, tools, routes, and repetition', 'availability outside work is not assumed'],
    transport: ['landmarks and lived route memory can outrank formal maps', 'walking/transit effort is part of distance'],
    tools: ['repairability matters before novelty', 'multi-use household objects are normal'],
    money: ['waste avoidance appears before price optimization', 'small material losses are noticed'],
    humor: ['jokes lean on practical exaggeration and shared physical situations', 'new convenience may be teased without being rejected'],
  },
  GROWTH_POLLUTION_ENERGY_TRANSITION: {
    vocabulary: ['new/old infrastructure coexist in ordinary speech', 'pollution, energy, and development are concrete lived changes'],
    food: ['household storage shifts alongside appliances and distribution', 'seasonal/local knowledge coexists with mass availability'],
    communication: ['fixed-place contact expectations remain strong', 'printed notices and direct calls feel authoritative but not infallible'],
    school: ['printed classifications may age visibly', 'institutional knowledge can lag social/technical change'],
    work: ['rapid industrial/service change creates mixed old/new routines', 'occupation does not map neatly to one technology level'],
    transport: ['new roads overwrite but do not erase older route memory', 'station/road expansion changes practical geography'],
    tools: ['hand and industrial production coexist', 'appliance transition leaves hybrid habits'],
    money: ['durability and household upgrade costs both matter', 'growth does not imply equal prosperity'],
    humor: ['jokes can hinge on yesterday becoming obsolete unusually fast', 'new convenience and old habit coexist without moral ranking'],
  },
  POST_BUBBLE_EARLY_MOBILE_INTERNET: {
    vocabulary: ['online/offline boundary is explicit', 'reachable and available are treated as different states'],
    food: ['convenience and household routine coexist without full app-mediated ordering assumptions', 'meeting places can be chosen around known chains/landmarks'],
    communication: ['mobile/email access expands faster than etiquette stabilizes', 'handles, forwarding, and privacy feel newly consequential'],
    school: ['paper handouts and networked search coexist', 'computer-room/shared-device assumptions remain plausible'],
    work: ['being contactable after hours becomes a pressure point', 'schedule changes can arrive by phone/mail rather than unified apps'],
    transport: ['paper maps and mobile lookup overlap', 'route uncertainty is solved by asking, calling, or checking limited web data'],
    tools: ['single-purpose devices coexist with early convergence', 'storage/transfer limits are noticed'],
    money: ['cash and physical statements remain default enough to matter', 'fees and communication costs are more visible decisions'],
    humor: ['missed calls, bad signal, mail timing, and awkward online identity are natural joke surfaces', 'future-perfect digital literacy is avoided'],
  },
  PRESENT_INFORMATION_ABUNDANCE: {
    vocabulary: ['searchability and source quality are separate concepts', 'recorded does not mean understood'],
    food: ['delivery/search/review abundance can coexist with local embodied knowledge', 'choice overload is ordinary'],
    communication: ['notifications, group chats, aliases, and consent boundaries are ordinary', 'context collapse is a known social risk'],
    school: ['finding information is easier than evaluating it', 'version/source comparison matters'],
    work: ['calendar precision and always-on contact can conflict with rest', 'metrics and lived sequence may disagree'],
    transport: ['live routing is expected but outages/closures still require local judgment', 'service status differs from physical path existence'],
    tools: ['multi-function networked devices are default', 'metadata/version history can become evidence'],
    money: ['cashless convenience and subscription/fee opacity can coexist', 'price comparison is easy while total cost can remain unclear'],
    humor: ['screenshots, search results, notifications, and algorithmic oddities are ordinary joke surfaces', 'being online is not treated as omniscience'],
  },
  FAR_FUTURE_IDENTITY_COEXISTENCE: {
    vocabulary: ['identity branch/body/designation distinctions are administratively ordinary', 'preferred address outranks inferred category'],
    food: ['food choice can be preference/culture rather than biological necessity alone', 'shared meals remain social even across embodiment differences'],
    communication: ['identity/authentication and consent are distinct', 'copying data does not automatically copy personhood'],
    school: ['curricula assume coexistence among humans/androids/robots/avatars without flattening them', 'historical media literacy includes obsolete identity systems'],
    work: ['role and embodiment are not treated as destiny', 'presence, instance, and delegation require explicit distinction'],
    transport: ['physical travel and remote/avatar presence can coexist', 'arrival is not always equivalent to body relocation'],
    tools: ['advanced systems are ordinary enough not to require exposition', 'manual/handwritten tools can persist by preference'],
    money: ['ownership/access/use-right can be distinct concepts', 'abundance in one domain does not imply post-scarcity everywhere'],
    humor: ['jokes can hinge on instance/body bureaucracy without dehumanization', 'future people are not written as smugly superior'],
  },
  CROSS_ERA_LONG_LIVED: {
    vocabulary: ['references from multiple eras can be correct without one neat origin answer', 'speech may retain layered habits rather than one period costume'],
    food: ['preferences can span incompatible historical defaults', 'nostalgia is specific rather than generic'],
    communication: ['old and new etiquette are both legible', 'choosing one medium can be personal rather than ignorance'],
    school: ['classification changes are remembered as changes, not trivia dumps', 'later terminology may be used while older framing remains understood'],
    work: ['skills can migrate across occupations/eras without proving one biography', 'adaptation does not erase earlier habits'],
    transport: ['route memory can outlive infrastructure', 'multiple map conventions may be intelligible'],
    tools: ['obsolete and current tools may both be used competently', 'competence does not imply ownership of every era'],
    money: ['value judgments can reflect several economic regimes without exact-age proof', 'old denominations/prices are not used as cheap exposition'],
    humor: ['anachronism can be noticed quietly rather than played as constant punchline', 'longevity is not reduced to “old person” jokes'],
  },
} as const;

export type CharacterEraFingerprintEntry = Readonly<{
  id: string;
  name: string;
  lane: RealityEraLane;
  assignmentStatus: 'UPSTREAM_CURRENT' | 'AUTHOR_CANDIDATE' | 'OPEN_SPECIAL';
  fingerprints: LaneFingerprint;
  personalAnchors: readonly string[];
}>;

export const CHARACTER_ERA_FINGERPRINTS: readonly CharacterEraFingerprintEntry[] =
  CHARACTER_ERA_FORESHADOW_DIALOGUE.map((entry) => ({
    id: entry.id,
    name: entry.name,
    lane: entry.lane,
    assignmentStatus: entry.assignmentStatus,
    fingerprints: LANE_FINGERPRINTS[entry.lane],
    personalAnchors: [
      ...entry.evidenceSeeds.slice(0, 2),
      ...entry.dialogueSeeds.slice(0, 1),
    ],
  }));

export const FIVE_BEAT_ERA_REVEAL_PATTERN = [
  'ordinary_mismatch',
  'repeat_with_new_context',
  'counterevidence_from_another_character',
  'reality_object_or_record_evidence',
  'earlier_line_reinterpreted',
] as const;
