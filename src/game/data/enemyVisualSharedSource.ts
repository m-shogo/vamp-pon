import {
  enemyProductionEntries,
  type EnemyFamily,
  type EnemyProductionEntry,
  type EnemyRank,
} from './enemyProductionDatabase.ts';
import type { ArtworkApprovalState } from './sharedSourceContracts.ts';

export type EnemyVariantKind = 'NORMAL' | 'ELITE' | 'BOSS' | 'BLACK_INK_VARIANT' | 'DAWN_CLEANSED';
export type EnemySpoilerTier = 'PUBLIC_SAFE' | 'GUIDE_SPOILER';
export type EnemyVariantAvailability = 'PRIMARY' | 'NOT_APPLICABLE' | 'EXPLICIT_APPROVAL_ONLY' | 'REFERENCE_ONLY';

export type EnemyFamilyVisualRule = {
  family: EnemyFamily;
  primaryShapeLanguage: string;
  materialFeel: string;
  faceRule: string;
  limbRule: string;
  scaleRule: string;
  idleMotion: string;
  moveMotion: string;
  attackMotion: string;
  deathMotion: string;
  spawnFantasy: string;
  dropFantasy: string;
  iconRule: string;
  smallScaleReadability: string;
  goodsPotential: readonly string[];
  avoid: readonly string[];
};

export type EnemyVariantPolicy = Record<EnemyVariantKind, EnemyVariantAvailability>;

export type EnemyVisualSharedSourceEntry = {
  id: string;
  displayName: string;
  enemyClass: EnemyRank;
  enemyFamily: EnemyFamily;
  threatTier: EnemyRank;
  originType: 'KAGEMONO_MEMORY_SHADOW';
  stageAffinity: readonly string[];
  visualSilhouette: string;
  primaryShapeLanguage: string;
  primaryColor: string;
  accentColor: string;
  materialFeel: string;
  faceRule: string;
  limbRule: string;
  scaleRule: string;
  idleMotion: string;
  moveMotion: string;
  attackMotion: string;
  deathMotion: string;
  attackLanguage: string;
  weaknessFantasy: string;
  spawnFantasy: string;
  dropFantasy: string;
  loreRole: string;
  blackInkRelation: string;
  starBeastRelation: string;
  spoilerTier: EnemySpoilerTier;
  iconRule: string;
  smallScaleReadability: string;
  goodsPotential: readonly string[];
  avoid: readonly string[];
  negativePromptHints: readonly string[];
  generationBriefSeed: string;
  variants: EnemyVariantPolicy;
  authoritySource: 'src/game/data/enemyProductionDatabase.ts';
  runtimeReady: false;
  artworkReady: false;
  artworkState: ArtworkApprovalState;
};

const COMMON_AVOID = [
  'generic AI monster anatomy',
  'photorealistic creature rendering',
  'hard horror, gore, exposed flesh, teeth-first horror',
  'neon cyan/purple glow language',
  'generic RPG demon horns or armor',
  'meaningless particles that replace a readable silhouette',
  'letters, numbers, logos, watermarks',
] as const;

export const ENEMY_FAMILY_VISUAL_RULES: Record<EnemyFamily, EnemyFamilyVisualRule> = {
  ombu: {
    family: 'ombu',
    primaryShapeLanguage: 'one compact rounded ink-memory body plus one readable object/paper trace; soft asymmetry, no humanoid anatomy',
    materialFeel: 'matte black ink soaked into fibrous paper with one soft edge bloom; never wet photoreal slime',
    faceRule: '0-2 tiny pale eye marks only when needed for direction; no mouth, teeth, nose, or expressive human face',
    limbRule: 'no arms; no humanoid legs; movement is body glide, bob, fold, tilt, or object-led pull',
    scaleRule: 'small baseline enemy; motif hook must remain readable at 24-32px without adding detail',
    idleMotion: 'slow ink breathing: 2-4% body swell plus a tiny paper/object trace flutter',
    moveMotion: 'short glide or bob with the silhouette leading; no procedural tentacle walk',
    attackMotion: 'single anticipation change tied to the entry attackCue, then immediate release; one readable cause before effect',
    deathMotion: 'ink fixation loosens, silhouette collapses inward, then 2-4 paper/ink fragments separate without explosion spam',
    spawnFantasy: 'a small wrong reading gathers from a paper edge, floor stain, route line, or named-object trace already present in the scene',
    dropFantasy: 'the fixed black reading releases one small clue/object trace; reward readability wins over particle spectacle',
    iconRule: 'crop to the body plus the one defining motif hook; preserve negative space and never add a badge frame to explain it',
    smallScaleReadability: 'round body + exactly one motif hook should survive at 24px; detail may disappear but family and hook may not',
    goodsPotential: ['bestiary sticker', 'small mascot charm', 'paper-shadow acrylic', 'collection card'],
    avoid: [...COMMON_AVOID, 'arms on an Ombu', 'more than one competing prop hook'],
  },
  omburo: {
    family: 'omburo',
    primaryShapeLanguage: 'broad ink body with two heavy forelimb masses and one object-derived structural cue; wider than an Ombu, still paper/ink rather than beast anatomy',
    materialFeel: 'dense matte ink with torn-paper shoulder/arm edges and restrained amber/paper highlights from the attached motif',
    faceRule: 'small recessed eye marks or blank face plane; no jaw, fangs, snout, or realistic animal skull',
    limbRule: 'two thick readable arms are the family discriminator; hands stay simplified mitten/ink-block shapes, never five-finger horror hands',
    scaleRule: 'medium pressure enemy; wider mass and arms must read before surface detail at 32px',
    idleMotion: 'heavy shoulder settle and slow ink compression, as if paper layers are carrying weight',
    moveMotion: 'weight-shift advance, short brace, or push; speed may vary but silhouette remains broad and grounded',
    attackMotion: 'arms or attached object cue wind up once, then strike/push/place; anticipation must remain visible under crowd pressure',
    deathMotion: 'arm mass loses shape first, then the central ink body folds into a torn-paper shadow and releases the clue',
    spawnFantasy: 'a larger misreading accumulates from several nearby traces and binds them into one broad pressure shape',
    dropFantasy: 'the attached object clue falls free after the arm/body fixation collapses',
    iconRule: 'show broad shoulders/arms plus one motif cue; never crop both arms away',
    smallScaleReadability: 'two thick arm masses + one attached motif distinguish Omburo from Ombu at 32px',
    goodsPotential: ['bestiary acrylic', 'soft vinyl silhouette', 'enemy badge', 'encounter card'],
    avoid: [...COMMON_AVOID, 'thin arms', 'bodybuilder anatomy', 'gorilla/ogre shorthand', 'detailed fingers'],
  },
  wrong_reading: {
    family: 'wrong_reading',
    primaryShapeLanguage: 'an everyday object, route mark, memory trace, or empty space read incorrectly; silhouette stays concept-led instead of monster-led',
    materialFeel: 'paper, ink, glass, thread, chalk, ticket stock, or object material partially fixed by black ink; keep real-material cues restrained',
    faceRule: 'prefer no face; if direction is necessary, use one tiny eye pair embedded as annotation-like marks, never a creature head',
    limbRule: 'no default limbs; motion comes from the object/mark behavior itself unless the existing entry silhouette explicitly requires a body mass',
    scaleRule: 'scale follows the misread object or sign; silhouette meaning must remain legible before decoration',
    idleMotion: 'the wrong interpretation repeats one subtle impossible behavior: loop, reverse, erase, fold, point, seal, or delay',
    moveMotion: 'object-logic movement rather than animal walk: slide, rotate, fold, rewind, stamp, trace, or drift',
    attackMotion: 'the entry attackCue becomes the single visual verb; avoid adding a second magical attack language',
    deathMotion: 'the impossible reading stops, black fixation peels away, and the ordinary clue remains for a moment',
    spawnFantasy: 'a familiar sign/object is misread in place until its black interpretation becomes interactive',
    dropFantasy: 'release the ordinary trace that was hidden by the wrong reading rather than a generic crystal/orb',
    iconRule: 'one impossible object/mark action in silhouette; no monster portrait treatment',
    smallScaleReadability: 'the object/mark category must read at 24-32px even if the black-fixation detail disappears',
    goodsPotential: ['concept sticker', 'ticket/paper insert', 'archive card', 'small prop charm'],
    avoid: [...COMMON_AVOID, 'turning the object into a generic mimic monster', 'adding teeth or eyes just to make it feel like an enemy'],
  },
  great_shadow: {
    family: 'great_shadow',
    primaryShapeLanguage: 'landmark-scale wrong reading: one dominant stage/object motif enlarged into a memorable black-paper silhouette with secondary route/paper structures',
    materialFeel: 'layered matte ink, torn paper, shadowed real-material traces, and restrained lantern/dawn contrast; never glossy kaiju skin',
    faceRule: 'face is optional and subordinate to the landmark motif; no skull/dragon/demon face as a shortcut to boss importance',
    limbRule: 'only use limbs when the canonical silhouette/attack requires them; landmark, route, box, name, or compass structure remains primary',
    scaleRule: 'boss scale must be communicated by overlap, landmark relationship, and slow mass shifts—not by adding detail or giant glow',
    idleMotion: 'slow scene-level deformation: paper layers breathe, route lines pull, object seams flex, or ink boundaries re-fix',
    moveMotion: 'deliberate stage-shaping movement with readable pauses; mobile camera must preserve the dominant motif',
    attackMotion: 'large anticipation keyed to the existing attackCue, then one stage-readable change; avoid screen-filling noise between tells',
    deathMotion: 'dominant motif stops enforcing the wrong reading, ink layers unbind in sequence, and the released clue/object trace remains longest',
    spawnFantasy: 'the stage motif itself becomes over-fixed into one Great Shadow rather than a random boss teleporting in',
    dropFantasy: 'a named clue, route trace, or forgotten-object fragment remains after the large reading releases; never a generic treasure shower',
    iconRule: 'use the dominant landmark/object silhouette and one stage relation; never squeeze the full boss scene into an icon',
    smallScaleReadability: 'boss icon must read as a unique dominant motif at 32px; scale is implied by shape, not extra crowns/frames',
    goodsPotential: ['premium bestiary card', 'large acrylic silhouette', 'artbook spread', 'boss route stamp'],
    avoid: [...COMMON_AVOID, 'kaiju/dragon/demon normalization', 'giant circular aura', 'boss crown', 'screen-filling particle fog'],
  },
};

function variantPolicyFor(rank: EnemyRank): EnemyVariantPolicy {
  return {
    NORMAL: rank === 'small' || rank === 'medium' ? 'PRIMARY' : 'NOT_APPLICABLE',
    ELITE: rank === 'elite' ? 'PRIMARY' : 'NOT_APPLICABLE',
    BOSS: rank === 'boss' ? 'PRIMARY' : 'NOT_APPLICABLE',
    BLACK_INK_VARIANT: 'EXPLICIT_APPROVAL_ONLY',
    DAWN_CLEANSED: 'REFERENCE_ONLY',
  };
}

function primaryColor(entry: EnemyProductionEntry): string {
  return entry.palette[0] ?? 'ink black';
}

function accentColor(entry: EnemyProductionEntry): string {
  return entry.palette[1] ?? entry.palette[0] ?? 'paper cream';
}

function generationBriefSeed(entry: EnemyProductionEntry, rule: EnemyFamilyVisualRule): string {
  return [
    `${entry.name} (${entry.id}) — ${entry.rank}/${entry.family}.`,
    `Readable role: ${entry.readableRole}`,
    `Silhouette: ${entry.silhouette}`,
    `Shape language: ${rule.primaryShapeLanguage}`,
    `Material: ${rule.materialFeel}`,
    `Movement: ${entry.movement}; attack cue: ${entry.attackCue}`,
    `Wrong reading: ${entry.wrongReading}; released clue: ${entry.releasedClue}`,
    `Palette: ${entry.palette.join(', ')}`,
    `Stage affinity: ${entry.stageAffinity.join(', ')}`,
    `Keep mobile readability and paper/ink identity. Do not add generic monster anatomy or neon spectacle.`,
  ].join('\n');
}

export const enemyVisualSharedSourceEntries: readonly EnemyVisualSharedSourceEntry[] = enemyProductionEntries.map((entry) => {
  const rule = ENEMY_FAMILY_VISUAL_RULES[entry.family];
  return {
    id: entry.id,
    displayName: entry.name,
    enemyClass: entry.rank,
    enemyFamily: entry.family,
    threatTier: entry.rank,
    originType: 'KAGEMONO_MEMORY_SHADOW',
    stageAffinity: entry.stageAffinity,
    visualSilhouette: entry.silhouette,
    primaryShapeLanguage: rule.primaryShapeLanguage,
    primaryColor: primaryColor(entry),
    accentColor: accentColor(entry),
    materialFeel: rule.materialFeel,
    faceRule: rule.faceRule,
    limbRule: rule.limbRule,
    scaleRule: rule.scaleRule,
    idleMotion: rule.idleMotion,
    moveMotion: `${rule.moveMotion} Entry motion: ${entry.movement}.`,
    attackMotion: `${rule.attackMotion} Entry cue: ${entry.attackCue}.`,
    deathMotion: rule.deathMotion,
    attackLanguage: `The attack must visually grow from “${entry.attackCue}”; preserve the family motion grammar and avoid adding unrelated magic VFX.`,
    weaknessFantasy: `Read the anticipation and separate the wrong reading from its clue; visual counterplay must come from the cue, spacing, or stage relation rather than an unexplained elemental weakness.`,
    spawnFantasy: rule.spawnFantasy,
    dropFantasy: `${rule.dropFantasy} Current drop hint: ${entry.dropHint}.`,
    loreRole: `${entry.readableRole} Wrong reading: ${entry.wrongReading}. Released clue: ${entry.releasedClue}.`,
    blackInkRelation: 'Kagemono black-ink fixation grammar. This is not automatic Character Kokuyou and must not make every entity a Kokuyou variant.',
    starBeastRelation: 'No default Star Beast relation. Never merge, mutate, or borrow a Character Star Beast silhouette without separate authority.',
    spoilerTier: entry.rank === 'boss' ? 'GUIDE_SPOILER' : 'PUBLIC_SAFE',
    iconRule: rule.iconRule,
    smallScaleReadability: rule.smallScaleReadability,
    goodsPotential: rule.goodsPotential,
    avoid: rule.avoid,
    negativePromptHints: [
      'no text, letters, numbers, logo, watermark',
      'no photoreal monster',
      'no gore or hard horror',
      'no generic RPG crystal/orb reward',
      'no neon cyan/purple AI palette',
      'no giant blurred glow or glassmorphism',
    ],
    generationBriefSeed: generationBriefSeed(entry, rule),
    variants: variantPolicyFor(entry.rank),
    authoritySource: 'src/game/data/enemyProductionDatabase.ts',
    runtimeReady: false,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
  };
});

export const enemyVisualSharedSourceById = new Map(enemyVisualSharedSourceEntries.map((entry) => [entry.id, entry]));

export const enemyBossSharedSourceSummary = {
  total: enemyVisualSharedSourceEntries.length,
  enemies: enemyVisualSharedSourceEntries.filter((entry) => entry.enemyClass !== 'boss').length,
  bosses: enemyVisualSharedSourceEntries.filter((entry) => entry.enemyClass === 'boss').length,
  referenceGenerationReady: enemyVisualSharedSourceEntries.length === enemyProductionEntries.length,
  runtimeReady: false,
  artworkReady: false,
} as const;
