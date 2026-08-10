import { commercialProductionProfiles } from './commercialProductionProfile.ts';
import { characterThemeColorById } from './characterThemeColors.ts';
import type { ArtworkApprovalState } from './sharedSourceContracts.ts';

export type StarBeastScope = 'CURRENT20' | 'OFFICIAL_RESERVE';
export type StarBeastBodyFamily = 'FELINE' | 'CANINE' | 'URSINE' | 'UNGULATE' | 'CRUSTACEAN' | 'BIRD' | 'AQUATIC' | 'REPTILE' | 'LAGOMORPH';

export type StarBeastMorphologyRule = {
  bodyFamily: StarBeastBodyFamily;
  frontSilhouette: string;
  sideSilhouette: string;
  sitPose: string;
  restPose: string;
  sleepPose: string;
  faceRule: string;
  pawFinWingMark: string;
  materialFeel: string;
  oneColorRule: string;
  plushSewingRule: string;
  commonAvoid: readonly string[];
};

export type StarBeastVisualSharedSourceEntry = {
  id: string;
  idOrigin: 'DERIVED_STABLE_ADAPTER_ID';
  characterId: string;
  characterDisplayName: string;
  scope: StarBeastScope;
  launchEligible: boolean;
  constellationKey: string;
  favoriteConstellation: string;
  species: string;
  themeHex: `#${string}`;
  paletteFamilyKey: string | null;
  sharedColorReason: string | null;
  frontSilhouette: string;
  sideSilhouette: string;
  sitPose: string;
  restPose: string;
  sleepPose: string;
  faceRule: string;
  pawFinWingMark: string;
  sizeRelation: string;
  materialFeel: string;
  oneColorRule: string;
  plushSewingRule: string;
  toumonTagPosition: string;
  duplicateConstellationDifference: string;
  commercialRecognitionHook: string;
  posePriority: readonly string[];
  avoid: readonly string[];
  negativePromptHints: readonly string[];
  generationBriefSeed: string;
  authoritySources: readonly [
    'src/game/data/characterThemeColors.ts',
    'src/game/data/commercialProductionProfile.ts',
    'docs/design-targets/generated/character-star-beast-constellation-canon-v1.json',
  ];
  referenceGenerationReady: true;
  runtimeReady: false;
  artworkReady: false;
  artworkState: ArtworkApprovalState;
};

const COMMON_AVOID = [
  'Character本人のミニ人形化',
  'human clothes or job costume as permanent species identity',
  'literal zodiac glyph branded on the body',
  'Toumon geometry used as fur/feather/scale marking before final vector approval',
  'generic cute mascot normalization that erases species silhouette',
  'neon cyan/purple AI glow, galaxy fog, giant aura',
  'photoreal animal rendering',
  'baked text, letters, numbers, logo, watermark',
  'body size used to imply Character HP, hitbox, speed or moral role',
] as const;

export const STAR_BEAST_MORPHOLOGY_RULES: Readonly<Record<string, StarBeastMorphologyRule>> = {
  leo: {
    bodyFamily: 'FELINE',
    frontSilhouette: 'compact lion body with round forepaws, visible chest and a short mane boundary; ears remain visible outside the mane',
    sideSilhouette: 'low feline back line, short muzzle, round forepaw and a tail with one restrained tuft; mane volume never becomes a giant halo',
    sitPose: 'upright feline sit with forepaws parallel and tail resting beside the body',
    restPose: 'sternum-low sphinx rest with forepaws forward and mane compressed rather than flared',
    sleepPose: 'curled feline sleep with tail following the back curve and mane still readable as a separate mass',
    faceRule: 'short muzzle, small triangular nose, calm oval eyes; no human eyebrows, smile mascot mouth or aggressive fangs',
    pawFinWingMark: 'one simple warm paw-pad grouping may be used; no zodiac/Toumon symbol inside the paw',
    materialFeel: 'matte short plush/fur with a slightly rough paper-fiber mane edge',
    oneColorRule: 'mane + ear + tail tuft must identify the lion in one ink without interior gradients',
    plushSewingRule: 'mane is a separate shallow fabric layer; avoid long pile that hides ears/face, keep tail tuft as one safe sewn piece',
    commonAvoid: [...COMMON_AVOID, 'adult male lion grandeur', 'battle lion armor'],
  },
  aries: {
    bodyFamily: 'UNGULATE',
    frontSilhouette: 'young ram with compact body, narrow chest and two small symmetrical horn arcs kept close to the head',
    sideSilhouette: 'slender young sheep body with short muzzle, small horn arc and light forward-leaning stance',
    sitPose: 'folded-leg lamb rest rather than a dog-like literal sit',
    restPose: 'legs tucked under chest, head slightly forward as if ready to move',
    sleepPose: 'side curl with small horns remaining outside the face silhouette',
    faceRule: 'soft sheep muzzle, horizontal ear read, alert eyes; no demon/goat skull shorthand',
    pawFinWingMark: 'small hoof split is the only extremity mark; no star glyph on hoof',
    materialFeel: 'short wool clumps with dry paper-fiber softness, not cloud-fluff overload',
    oneColorRule: 'small horn arcs + sheep muzzle + hoof stance remain readable in one ink',
    plushSewingRule: 'horns use short soft stuffed arcs with no hard insert; wool texture must not erase face/leg separation',
    commonAvoid: [...COMMON_AVOID, 'giant spiral battle horns', 'demon goat cues'],
  },
  cancer: {
    bodyFamily: 'CRUSTACEAN',
    frontSilhouette: 'small low crab with broad oval shell, two modest claws and four simplified leg pairs kept close to the body',
    sideSilhouette: 'low shell dome with one readable claw projection and tucked walking legs',
    sitPose: 'not applicable as mammal sitting; use a settled low stance with both claws resting forward',
    restPose: 'claws folded inward and legs tucked under the shell edge',
    sleepPose: 'very low shell posture with claws crossed loosely in front, eyes lowered',
    faceRule: 'tiny eye stalks or shell-edge eyes only; no human mouth, eyebrows or aggressive mandibles',
    pawFinWingMark: 'claw tips can carry one simple pale edge; never a zodiac/Toumon glyph',
    materialFeel: 'matte soft-shell plush interpretation with lightly segmented paper-like shell panels',
    oneColorRule: 'oval shell + two claws + low leg rhythm must read without interior shell decoration',
    plushSewingRule: 'claws and eye stalks are soft short pieces; legs use broad sewn tabs rather than thin loose appendages',
    commonAvoid: [...COMMON_AVOID, 'giant armored tank crab', 'realistic spiny shell'],
  },
  'ursa-minor': {
    bodyFamily: 'URSINE',
    frontSilhouette: 'small bear with round ears, short limbs and compact torso; exploratory lean keeps it lighter than the Ursa Major beast',
    sideSilhouette: 'short bear muzzle, round ear, compact belly and small paws with a slightly forward searching posture',
    sitPose: 'small bear sit with rear body low and forepaws resting close together',
    restPose: 'belly-down exploratory rest with head still raised',
    sleepPose: 'tight curl with one round ear visible above the forepaw',
    faceRule: 'short muzzle, round ears, small eyes; no teddy-bear bow/patch stereotype',
    pawFinWingMark: 'one simple four-pad paw cue may be used without symbol engraving',
    materialFeel: 'short matte plush/fur with cool northern-night softness',
    oneColorRule: 'round ears + compact bear muzzle + short paw mass identify it in one ink',
    plushSewingRule: 'ears and paws stay broad; avoid oversized teddy proportions that erase the exploratory posture',
    commonAvoid: [...COMMON_AVOID, 'teddy bear accessory stereotype', 'same size/proportion as Ursa Major beast'],
  },
  corvus: {
    bodyFamily: 'BIRD',
    frontSilhouette: 'small crow with narrow chest, short folded wings and a slightly tilted head; beak remains modest',
    sideSilhouette: 'compact bird body, short wedge tail and small straight beak; neck tilt is a recognition hook',
    sitPose: 'perched upright on both feet with wings fully folded',
    restPose: 'low perch with neck shortened and feathers settled',
    sleepPose: 'head tucked lightly toward one shoulder under a folded wing edge',
    faceRule: 'small bead eyes and clean beak line; no sinister red eye or human expression',
    pawFinWingMark: 'one restrained blue-gray wing-edge panel can distinguish wing direction; no written marks',
    materialFeel: 'matte blue-gray feather blocks with paper-cut edges instead of glossy black feathers',
    oneColorRule: 'beak + folded wing + wedge tail + head tilt read in one ink',
    plushSewingRule: 'wing is a flat attached panel; tail uses one broad wedge, not many loose feathers',
    commonAvoid: [...COMMON_AVOID, 'omen/horror crow symbolism', 'wizard familiar costume'],
  },
  'canes-venatici': {
    bodyFamily: 'CANINE',
    frontSilhouette: 'hound with long but soft leg read, open chest and drooped/half-drooped ears; size is owner-specific while breed language remains shared',
    sideSilhouette: 'hound profile with long nose, chest-to-waist taper and relaxed tail; never wolf-shaped',
    sitPose: 'hound sit with straight forelegs and tail curving beside one rear leg',
    restPose: 'chest-down hound rest with long forelegs extended',
    sleepPose: 'side curl with nose near forepaw and ear shape still readable',
    faceRule: 'gentle hound muzzle and soft ears; no wolf snarl or puppy baby-face normalization',
    pawFinWingMark: 'simple shared paw-pad rhythm may identify sibling set, but no names or Toumon marks',
    materialFeel: 'short matte plush/fur with warm brown paper-fiber undertone',
    oneColorRule: 'hound muzzle + ear fall + leg/chest proportion survive in one ink; owner size difference must remain',
    plushSewingRule: 'ears are soft attached flaps; leg length difference between the two sibling beasts must survive stuffing',
    commonAvoid: [...COMMON_AVOID, 'wolf conversion', 'identical-size sibling pair', 'puppy-only infantilization'],
  },
  'ursa-major': {
    bodyFamily: 'URSINE',
    frontSilhouette: 'large bear with broad shoulder mass, large paws and calm grounded stance; distinct from the smaller Ursa Minor beast',
    sideSilhouette: 'heavy shoulder-to-rump line, clear bear muzzle and broad paw base without fantasy armor',
    sitPose: 'large grounded bear sit with forepaws apart and torso weight visible',
    restPose: 'broad chest-down rest with head lowered but awake',
    sleepPose: 'large loose curl rather than compact ball, keeping shoulder mass readable',
    faceRule: 'mature calm bear face with small round ears; no old-man eyebrows or mascot grin',
    pawFinWingMark: 'broad paw-pad cue only, no compass or route symbol stamped into paw',
    materialFeel: 'dense short matte fur/plush with earthy paper-fiber softness',
    oneColorRule: 'broad shoulders + bear muzzle + large paw base distinguish it from Ursa Minor in one ink',
    plushSewingRule: 'use torso/shoulder volume rather than oversized head; paws stay broad enough to hold silhouette after stuffing',
    commonAvoid: [...COMMON_AVOID, 'wizard bear', 'same compact size as Ursa Minor'],
  },
  cygnus: {
    bodyFamily: 'BIRD',
    frontSilhouette: 'warm-white swan with full rounded body, long neck rising from a broad chest and wings kept close',
    sideSilhouette: 'full rounded body, long S-curve neck and short tail; preserve the deliberately plump body',
    sitPose: 'water/ground settled pose with full body supported and neck upright; not a mammal sit',
    restPose: 'neck lowered into a relaxed shallow S while body remains round and stable',
    sleepPose: 'head tucked beside/under one wing with the broad rounded body still dominant',
    faceRule: 'small calm eye and clean swan bill; no eyelashes, lipstick or regal crown cues',
    pawFinWingMark: 'one subtle feather-edge rhythm on the wing; no literal flower/Toumon symbol',
    materialFeel: 'warm off-white matte feather/plush surface, closer to paper and cloth than glossy pure white',
    oneColorRule: 'rounded body + long neck + bill must read in one ink without feather detailing',
    plushSewingRule: 'neck uses broad safe curve and internal soft support; body fullness must not be slimmed for elegance',
    commonAvoid: [...COMMON_AVOID, 'slimming the plump swan', 'food/glutton joke', 'princess/crown swan stereotype'],
  },
  columba: {
    bodyFamily: 'BIRD',
    frontSilhouette: 'small dove with compact chest, short neck and tidy folded wings',
    sideSilhouette: 'small rounded dove profile with short beak, folded wing and modest fan tail',
    sitPose: 'upright perch with feet close and chest slightly forward',
    restPose: 'low perch with chest settling over feet and head slightly drawn in',
    sleepPose: 'head tucked toward shoulder with wing still readable as a separate soft panel',
    faceRule: 'small bead eye and short beak; no postal uniform, cap or human smile',
    pawFinWingMark: 'one muted lavender wing-edge panel can support recognition, no stamp/postal logo',
    materialFeel: 'soft matte feather blocks with pale paper-fiber edges',
    oneColorRule: 'small rounded chest + short beak + folded wing identify the dove in one ink',
    plushSewingRule: 'wing is one flat side panel and tail one broad fan; avoid many thin feathers',
    commonAvoid: [...COMMON_AVOID, 'postal worker costume', 'peace-symbol cliché'],
  },
  aquila: {
    bodyFamily: 'BIRD',
    frontSilhouette: 'small eagle with slightly broader shoulder/wing line than the dove/crow, but still juvenile and compact',
    sideSilhouette: 'compact raptor body with small hooked beak, clear folded wing and alert upright neck',
    sitPose: 'upright perch with talons simplified and wings folded tightly',
    restPose: 'low perch with wing mass relaxed and head turned to observe distance',
    sleepPose: 'head angled back toward shoulder; hooked beak remains visible without predatory aggression',
    faceRule: 'focused eye and small hooked beak; no angry eyebrow graphic or military eagle pose',
    pawFinWingMark: 'one fine warm-gold wing-edge mark may be used, never heraldic spread-wing badge',
    materialFeel: 'matte feather panels with restrained dry-gold edge',
    oneColorRule: 'hooked beak + broader folded wing + upright raptor posture read in one ink',
    plushSewingRule: 'keep beak/feet short and soft; wing shape carries identity instead of hard talons',
    commonAvoid: [...COMMON_AVOID, 'heraldic eagle', 'military crest', 'giant spread-wing pose as default'],
  },
  lynx: {
    bodyFamily: 'FELINE',
    frontSilhouette: 'medium cat body with tall tufted ears, compact muzzle and slightly long forelegs',
    sideSilhouette: 'cat profile with ear tufts, short tail and alert shoulder line',
    sitPose: 'upright cat sit with ears tall and short tail visible beside the body',
    restPose: 'sphinx-like rest with ears independently angled as if listening',
    sleepPose: 'cat curl with one tufted ear left visible above the back line',
    faceRule: 'quiet cat eyes, short muzzle, clear ear tufts; no glasses, archive label or human scholarly expression',
    pawFinWingMark: 'small muted green paw-pad/ear-edge cue only; no classification symbol',
    materialFeel: 'short matte fur with slightly rough ear-tuft fibers',
    oneColorRule: 'ear tufts + short tail + feline chest must identify lynx in one ink',
    plushSewingRule: 'ear tufts use short sewn triangles rather than loose thread; preserve short tail',
    commonAvoid: [...COMMON_AVOID, 'domestic housecat normalization that removes lynx ear tufts'],
  },
  'canis-major': {
    bodyFamily: 'CANINE',
    frontSilhouette: 'large guardian dog with broad chest, steady legs and ears that read attentive rather than aggressive',
    sideSilhouette: 'large dog body with stable back line, broad chest and relaxed downward/neutral tail',
    sitPose: 'large guard-dog sit with forepaws planted and head level, welcoming return rather than blocking passage',
    restPose: 'chest-down gate-side rest with head raised enough to notice arrivals',
    sleepPose: 'loose curl near an implied boundary, no chain/kennel imagery',
    faceRule: 'calm attentive dog face; closed or relaxed mouth, no guard-dog snarl',
    pawFinWingMark: 'one pale blue-gray paw/ear edge cue; no station/company mark',
    materialFeel: 'short-to-medium matte plush/fur with cool blue-gray night edge',
    oneColorRule: 'large dog chest + attentive ear + relaxed tail read without collar/logo',
    plushSewingRule: 'body volume carries size; no hard collar, chain, spike or badge accessory',
    commonAvoid: [...COMMON_AVOID, 'police/guard-dog uniform', 'spiked collar', 'aggressive gatekeeper stereotype'],
  },
  delphinus: {
    bodyFamily: 'AQUATIC',
    frontSilhouette: 'small dolphin with rounded forehead, short beak and two pectoral fins opening gently from the body',
    sideSilhouette: 'clean dolphin curve with dorsal fin, small beak and crescent tail flukes',
    sitPose: 'not literal sitting; use a near-surface upright curl with tail tucked below the body',
    restPose: 'horizontal slow-float pose with fins relaxed and body slightly curved',
    sleepPose: 'quiet side-float curve with one eye line lowered; no human pillow pose',
    faceRule: 'small eye and natural dolphin beak line; no permanent cartoon grin',
    pawFinWingMark: 'one pale fin-edge/waterline cue, no dream glyph or moon symbol',
    materialFeel: 'matte smooth cloth/plush surface with soft water-paper highlight, never wet photoreal skin',
    oneColorRule: 'dorsal fin + beak + tail flukes identify dolphin in one ink',
    plushSewingRule: 'fins and flukes are broad soft pieces with short projection; avoid thin unsupported beak',
    commonAvoid: [...COMMON_AVOID, 'cartoon aquarium grin', 'magical mermaid accessories'],
  },
  chamaeleon: {
    bodyFamily: 'REPTILE',
    frontSilhouette: 'small chameleon with compact body, separate curled tail read and mitt-like feet; head crest remains subtle',
    sideSilhouette: 'arched small reptile body with curled tail, modest head crest and gripping feet',
    sitPose: 'branch-hold pose with all feet close to the body; no mammal sit',
    restPose: 'low branch/body rest with tail partially curled and head lowered',
    sleepPose: 'compact branch curl with tail forming a quiet spiral beside the body',
    faceRule: 'small turret-eye silhouette without comic googly-eye exaggeration; mouth line minimal',
    pawFinWingMark: 'black-paper fold edge can mark the flank/tail as material cue, never Toumon geometry',
    materialFeel: 'matte black-paper/scaled cloth hybrid; black paper identity is more important than realistic reptile skin',
    oneColorRule: 'curled tail + chameleon head/feet must read as silhouette even when black-paper material detail disappears',
    plushSewingRule: 'tail is one broad stitched curl attached safely to body; eyes stay small and integrated rather than protruding hard spheres',
    commonAvoid: [...COMMON_AVOID, 'rainbow color-changing gimmick as default', 'generic dragon/lizard conversion'],
  },
  lupus: {
    bodyFamily: 'CANINE',
    frontSilhouette: 'large gray wolf with broad chest and thick soft limb masses, but still natural canine rather than bodybuilder/beastman',
    sideSilhouette: 'longer wolf muzzle, thick neck-to-shoulder transition and full tail kept low/neutral',
    sitPose: 'large wolf sit with heavy soft torso and forelegs planted; posture can react quickly despite body mass',
    restPose: 'chest-down protective rest with head turned outward and hind body relaxed',
    sleepPose: 'large loose curl with tail covering part of forepaws, retaining broad torso read',
    faceRule: 'calm wolf eyes and long muzzle; no alpha snarl, scars or dominance eyebrows',
    pawFinWingMark: 'simple gray paw/ear value difference only; no shield/protection emblem on body',
    materialFeel: 'dense soft gray matte fur/plush with broad value masses',
    oneColorRule: 'wolf muzzle + full tail + broad soft torso must read without armor or bodybuilder anatomy',
    plushSewingRule: 'torso/limbs keep substantial soft volume; do not slim the wolf or add hard muscle seams/spikes',
    commonAvoid: [...COMMON_AVOID, 'bodybuilder wolf', 'alpha-wolf stereotype', 'slimming because owner is a young male', 'body size = slow/HP/hitbox shorthand'],
  },
  vulpecula: {
    bodyFamily: 'CANINE',
    frontSilhouette: 'small pale fox with large ears, narrow chest and a soft tail visible behind one side',
    sideSilhouette: 'small fox profile with pointed muzzle, large ear and full tail; edges stay pale/soft rather than fiery',
    sitPose: 'fox sit with tail wrapped loosely around one side without hiding paws completely',
    restPose: 'low alert rest with ears independently angled and tail beside body',
    sleepPose: 'compact curl with tail covering flank but one ear/muzzle still readable',
    faceRule: 'quiet narrow muzzle and large ears; no sly eyebrow, smirk or trickster stereotype',
    pawFinWingMark: 'one faint erased-edge value on tail/ear, no literal eraser/icon glyph',
    materialFeel: 'pale matte fur/plush with soft erased-paper edge texture',
    oneColorRule: 'large ears + pointed muzzle + full fox tail read in one ink',
    plushSewingRule: 'tail broad and attached close enough for durability; ears keep silhouette without hard inserts',
    commonAvoid: [...COMMON_AVOID, 'kitsune shrine accessories', 'trickster/sly-face stereotype'],
  },
  grus: {
    bodyFamily: 'BIRD',
    frontSilhouette: 'slender crane with long legs, narrow body and long neck rising cleanly without ornamental fan shapes',
    sideSilhouette: 'thin crane profile with long neck/legs, small head and folded wing; posture uses measured spacing',
    sitPose: 'not mammal sitting; use a controlled low crouch with legs folded under the body',
    restPose: 'standing rest with one leg lightly raised or both legs close, neck in restrained S curve',
    sleepPose: 'head tucked toward shoulder with long neck compressed, legs kept as one safe silhouette mass',
    faceRule: 'small eye, long straight beak and clean head; no professor glasses or ruler accessory',
    pawFinWingMark: 'one thin muted-blue wing/leg measure-like spacing cue, but no literal ruler ticks or numbers',
    materialFeel: 'matte feather panels with crisp paper-like long lines',
    oneColorRule: 'long neck + long leg + straight beak read at one-color small scale; no extra geometry needed',
    plushSewingRule: 'legs cannot be thin dangling cords; use wider soft folded-leg solution or display support for plush',
    commonAvoid: [...COMMON_AVOID, 'Japanese auspicious crest imitation', 'literal ruler ticks/numbers'],
  },
  lepus: {
    bodyFamily: 'LAGOMORPH',
    frontSilhouette: 'white-gray hare with long upright ears, narrow chest and larger rear-body mass; not a tiny pet rabbit',
    sideSilhouette: 'hare profile with long ears, long rear feet and slightly forward ready-to-move body',
    sitPose: 'hare sit with rear legs folded under and forepaws close, ears independently angled',
    restPose: 'low loaf-like rest but with long ears and hare rear-foot length still readable',
    sleepPose: 'side curl with ears laid back along the body rather than disappearing',
    faceRule: 'small calm eye and natural hare muzzle; no buck teeth, blush or baby-rabbit face',
    pawFinWingMark: 'one subtle thread-like gray edge along ear/rear foot may echo mending without literal stitch glyph',
    materialFeel: 'soft white-gray matte fur/plush with thread-paper edge texture',
    oneColorRule: 'long ears + rear feet + hare body angle must distinguish it from a generic round rabbit',
    plushSewingRule: 'ears are wide enough to hold shape without wire; keep rear-foot length and white-gray value relation',
    commonAvoid: [...COMMON_AVOID, 'baby bunny normalization', 'sewing costume/tool accessories as permanent identity'],
  },
  'canis-minor': {
    bodyFamily: 'CANINE',
    frontSilhouette: 'small observant dog with compact body, alert ears and one slightly offset gaze direction; no detective costume',
    sideSilhouette: 'small dog profile with light legs, moderate muzzle and alert tail/ear line',
    sitPose: 'small dog sit with head turned slightly off-axis as if comparing two focal points',
    restPose: 'chest-down observation rest with ears angled to different directions',
    sleepPose: 'compact curl with one ear still slightly lifted, avoiding gadget props',
    faceRule: 'small focused eyes and natural dog muzzle; no monocle, magnifying glass or detective eyebrows',
    pawFinWingMark: 'one pale aqua ear/paw edge may aid recognition; no lens glyph branded on body',
    materialFeel: 'short soft matte plush/fur with pale aqua paper-light edge',
    oneColorRule: 'small dog body + alert ear/gaze posture identify it without accessories',
    plushSewingRule: 'ears/legs stay broad and simple; reserve status means no production SKU approval by implication',
    commonAvoid: [...COMMON_AVOID, 'detective hat', 'magnifying glass', 'automatic Current20 merchandise inclusion'],
  },
};

function sizeRelationFromHook(hook: string): string {
  return `${hook} Size must be communicated by body proportion and paired-reference comparison, never by UI rarity frame or combat stat implication.`;
}

function duplicateDifference(characterId: string, constellationKey: string, recognitionHook: string): string {
  if (constellationKey === 'leo') {
    return characterId === 'yui'
      ? `Shared Leo with tomori. Keep Yui beast distinctly younger/smaller: ${recognitionHook}`
      : `Shared Leo with yui. Keep Tomori beast one maturity step older/larger and soot-touched: ${recognitionHook}`;
  }
  if (constellationKey === 'canes-venatici') {
    return characterId === 'ritsu'
      ? `Shared sibling hounds with koyori. Ritsu-side beast is the larger hound: ${recognitionHook}`
      : `Shared sibling hounds with ritsu. Koyori-side beast is the smaller hound but not an infant accessory: ${recognitionHook}`;
  }
  return 'Unique Current assignment; no duplicated constellation differentiation required.';
}

export const starBeastVisualSharedSourceEntries: readonly StarBeastVisualSharedSourceEntry[] = commercialProductionProfiles.map((profile) => {
  const colors = characterThemeColorById.get(profile.characterId);
  if (!colors) throw new Error(`Missing Character theme/Star Beast source: ${profile.characterId}`);
  const constellationKey = colors.starBeastTheme.constellationKey;
  const morphology = STAR_BEAST_MORPHOLOGY_RULES[constellationKey];
  if (!morphology) throw new Error(`Missing Star Beast morphology rule: ${constellationKey}`);

  return {
    id: `star-beast:${profile.characterId}`,
    idOrigin: 'DERIVED_STABLE_ADAPTER_ID',
    characterId: profile.characterId,
    characterDisplayName: profile.displayName,
    scope: profile.scope === 'official_reserve' ? 'OFFICIAL_RESERVE' : 'CURRENT20',
    launchEligible: profile.launchEligible,
    constellationKey,
    favoriteConstellation: colors.starBeastTheme.favoriteConstellation,
    species: colors.starBeastTheme.starBeast,
    themeHex: colors.starBeastTheme.hex,
    paletteFamilyKey: colors.starBeastTheme.paletteFamilyKey,
    sharedColorReason: colors.starBeastTheme.sharedColorReason,
    frontSilhouette: `${morphology.frontSilhouette}. Owner-specific recognition: ${profile.plushReadability.recognitionHook}`,
    sideSilhouette: `${morphology.sideSilhouette}. Owner-specific recognition: ${profile.plushReadability.recognitionHook}`,
    sitPose: morphology.sitPose,
    restPose: morphology.restPose,
    sleepPose: morphology.sleepPose,
    faceRule: morphology.faceRule,
    pawFinWingMark: morphology.pawFinWingMark,
    sizeRelation: sizeRelationFromHook(profile.plushReadability.recognitionHook),
    materialFeel: morphology.materialFeel,
    oneColorRule: morphology.oneColorRule,
    plushSewingRule: morphology.plushSewingRule,
    toumonTagPosition: 'Toumon may appear only on a separate removable/embroidered goods tag after final Toumon vector approval; never use unfinished Toumon geometry as a permanent body marking.',
    duplicateConstellationDifference: duplicateDifference(profile.characterId, constellationKey, profile.plushReadability.recognitionHook),
    commercialRecognitionHook: profile.plushReadability.recognitionHook,
    posePriority: profile.plushReadability.posePriority,
    avoid: [...morphology.commonAvoid, ...profile.plushReadability.avoid, ...profile.commercialNoGo],
    negativePromptHints: [
      'no human clothes or occupation costume',
      'no zodiac glyph on body',
      'no Toumon geometry on body before vector approval',
      'no neon cyan/purple galaxy aura',
      'no photoreal animal',
      'no text, letters, numbers, logo, watermark',
    ],
    generationBriefSeed: [
      `${profile.displayName} Star Beast (${`star-beast:${profile.characterId}`}) — ${colors.starBeastTheme.starBeast}.`,
      `Constellation: ${colors.starBeastTheme.favoriteConstellation}; key=${constellationKey}.`,
      `Palette anchor: ${colors.starBeastTheme.hex}.`,
      `Front: ${morphology.frontSilhouette}`,
      `Side: ${morphology.sideSilhouette}`,
      `Recognition: ${profile.plushReadability.recognitionHook}`,
      `Material: ${morphology.materialFeel}`,
      `Face: ${morphology.faceRule}`,
      `Rest/sleep: ${morphology.restPose} / ${morphology.sleepPose}`,
      `Duplicate rule: ${duplicateDifference(profile.characterId, constellationKey, profile.plushReadability.recognitionHook)}`,
      `Keep species identity in one-color silhouette and plush form. Toumon is a separate tag only after vector approval.`,
    ].join('\n'),
    authoritySources: [
      'src/game/data/characterThemeColors.ts',
      'src/game/data/commercialProductionProfile.ts',
      'docs/design-targets/generated/character-star-beast-constellation-canon-v1.json',
    ],
    referenceGenerationReady: true,
    runtimeReady: false,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
  };
});

export const starBeastVisualSharedSourceById = new Map(starBeastVisualSharedSourceEntries.map((entry) => [entry.id, entry]));
export const starBeastVisualSharedSourceByCharacterId = new Map(starBeastVisualSharedSourceEntries.map((entry) => [entry.characterId, entry]));

export const starBeastVisualSharedSourceSummary = {
  total: starBeastVisualSharedSourceEntries.length,
  current20: starBeastVisualSharedSourceEntries.filter((entry) => entry.scope === 'CURRENT20').length,
  officialReserve: starBeastVisualSharedSourceEntries.filter((entry) => entry.scope === 'OFFICIAL_RESERVE').length,
  duplicateConstellations: ['leo', 'canes-venatici'],
  referenceGenerationReady: true,
  runtimeReady: false,
  artworkReady: false,
} as const;
