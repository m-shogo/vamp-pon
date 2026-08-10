import { evolutions } from './evolutions.ts';
import { namedObjectRegistry } from './namedObjectRegistry.ts';
import { weapons } from './weapons.ts';
import type { ArtworkApprovalState } from './sharedSourceContracts.ts';

export type WeaponVisualClass = 'PROJECTILE' | 'BOUNCE' | 'ORBIT' | 'GROUND_AREA' | 'RADIAL';
export type WeaponFormKind = 'BASE' | 'UPGRADE' | 'AWAKENING' | 'FUSION';

export type WeaponVisualOverride = {
  shapeLanguage: string;
  silhouette: string;
  material: string;
  idleLook: string;
  attackLook: string;
  effectLanguage: string;
  projectileLanguage: string;
  impactLanguage: string;
  themeHex: `#${string}`;
  accentHex: `#${string}`;
  iconRule: string;
  smallScaleReadability: string;
  goodsPotential: readonly string[];
  avoid: readonly string[];
};

export type WeaponVisualSharedSourceEntry = {
  id: string;
  displayName: string;
  weaponClass: WeaponVisualClass;
  ownerBiasCharacterIds: readonly string[];
  starterCandidate: boolean;
  combatFantasy: string;
  shapeLanguage: string;
  silhouette: string;
  material: string;
  idleLook: string;
  attackLook: string;
  effectLanguage: string;
  projectileLanguage: string;
  impactLanguage: string;
  themeHex: `#${string}`;
  accentHex: `#${string}`;
  namedObjectRelationIds: readonly string[];
  starBeastRelation: 'NONE_BY_DEFAULT';
  toumonRelation: 'NONE_BY_DEFAULT';
  baseFormId: string;
  formKind: WeaponFormKind;
  evolutionIds: readonly string[];
  evolutionTargetIds: readonly string[];
  kokuyouVariantRule: 'NO_AUTOMATIC_VARIANT';
  dawnVariantRule: 'EVOLUTION_AUTHORITY_ONLY';
  iconRule: string;
  smallScaleReadability: string;
  animationHooks: readonly string[];
  vfxHooks: readonly string[];
  sfxFantasy: string;
  goodsPotential: readonly string[];
  avoid: readonly string[];
  negativePromptHints: readonly string[];
  generationBriefSeed: string;
  authoritySources: readonly ['src/game/data/weapons.ts', 'src/game/data/evolutions.ts'];
  runtimeReady: true;
  artworkReady: false;
  artworkState: ArtworkApprovalState;
};

const COMMON_AVOID = [
  'generic fantasy sword/staff/gun normalization',
  'generic RPG crystal or floating magic orb',
  'neon cyan/purple AI palette',
  'giant blurred glow hiding the object silhouette',
  'baked text, letters, numbers, logo, rarity frame, watermark',
  'photorealistic or glossy 3D prop rendering',
] as const;

export const WEAPON_VISUAL_OVERRIDES: Record<string, WeaponVisualOverride> = {
  night_pencil: {
    shapeLanguage: 'short worn pencil + one strong graphite line; ordinary stationery first, magic second',
    silhouette: 'stubby pencil with a clearly shortened graphite tip and one asymmetric worn edge',
    material: 'matte painted wood, exposed graphite, paper dust',
    idleLook: 'small pencil held still with a faint loose graphite trace, no aura halo',
    attackLook: 'a straight hand-drawn graphite stroke leaves the pencil tip and becomes the projectile',
    effectLanguage: 'drawn line, pressure variation, erased graphite crumbs',
    projectileLanguage: 'thin dark-blue/graphite line segment with paper-fiber edge',
    impactLanguage: 'one short cross-hatch mark and 2-3 graphite crumbs',
    themeHex: '#264A86', accentHex: '#F6B44B',
    iconRule: 'pencil diagonal + exposed graphite tip; no notebook, letters, or UI frame',
    smallScaleReadability: 'short diagonal body and dark tip must survive at 16-24px',
    goodsPotential: ['miniature pencil charm', 'stationery set', 'bookmark motif'],
    avoid: [...COMMON_AVOID, 'luxury fountain pen', 'oversized magic quill'],
  },
  marble: {
    shapeLanguage: 'one imperfect glass sphere containing a tiny reflected night scene; simple round read',
    silhouette: 'clean small sphere with one off-center reflected glint',
    material: 'slightly cloudy old glass, tiny internal wear, never glossy CGI glass',
    idleLook: 'rests with a restrained moving reflection rather than emitting light',
    attackLook: 'rolls and ricochets with one thin reflected streak that changes direction on bounce',
    effectLanguage: 'glass reflection, curved night streak, tiny contact sparkle',
    projectileLanguage: 'small round glass bead with one readable highlight and long physical arc',
    impactLanguage: 'brief ring reflection at the actual bounce point; no explosion',
    themeHex: '#2E5C6E', accentHex: '#CFE6F0',
    iconRule: 'single sphere + one crescent reflection; keep background transparent',
    smallScaleReadability: 'circle and crescent highlight must remain distinct at 16px',
    goodsPotential: ['glass marble replica', 'clear acrylic charm'],
    avoid: [...COMMON_AVOID, 'jewel/gem cut', 'planet icon', 'energy ball'],
  },
  moon_bookmark: {
    shapeLanguage: 'thin paper bookmark with a restrained crescent cut/notch; long narrow rectangle drives the read',
    silhouette: 'slender bookmark strip with one moon-shaped negative-space notch',
    material: 'fibrous paper with worn silver-gray edge',
    idleLook: 'hangs almost still, turning a few degrees like a page marker',
    attackLook: 'orbits edge-first; the paper edge is the hit surface, not a glowing blade',
    effectLanguage: 'paper arc + pale moon edge, restrained motion trail',
    projectileLanguage: 'none; physical orbiting bookmark is primary',
    impactLanguage: 'small paper-swish crescent and one page-dust fleck',
    themeHex: '#7B90D2', accentHex: '#C7B78B',
    iconRule: 'long bookmark silhouette + crescent notch; never literal full moon disc',
    smallScaleReadability: 'vertical strip plus notch must read at 16px',
    goodsPotential: ['functional bookmark', 'metal bookmark', 'paper stationery'],
    avoid: [...COMMON_AVOID, 'crescent sword', 'floating moon planet'],
  },
  black_ink_bottle: {
    shapeLanguage: 'small old squat ink bottle with paper label area left blank and a dark stain at the lip',
    silhouette: 'short rectangular bottle, narrow neck, slightly uneven cork/stopper',
    material: 'smoked glass, dried matte ink, worn paper/cork',
    idleLook: 'ink level barely moves; one dried stain remains fixed on the outer glass',
    attackLook: 'a small black drop falls first, then spreads into a paper-edged ground stain',
    effectLanguage: 'capillary ink spread and paper absorption; not liquid slime',
    projectileLanguage: 'one heavy drop or short thrown splash only when needed to seed the area',
    impactLanguage: 'matte ink bloom expands along irregular paper fibers',
    themeHex: '#8F2E14', accentHex: '#FAD689',
    iconRule: 'bottle neck + dark internal fill + one lip stain; no skull/poison symbol',
    smallScaleReadability: 'bottle body/neck ratio must remain readable at 16px',
    goodsPotential: ['mini bottle replica', 'ink-themed stationery prop'],
    avoid: [...COMMON_AVOID, 'poison potion bottle', 'wet tar/slime effect'],
  },
  stardust_shot: {
    shapeLanguage: 'a few irregular paper-gold star flecks, deliberately not a zodiac glyph or perfect emoji star',
    silhouette: 'small uneven four/five-point flecks with varied paper-cut edges',
    material: 'paper foil / dry gold pigment rather than neon plasma',
    idleLook: '2-3 flecks drift close together with low brightness',
    attackLook: 'flecks separate radially and travel as small physical light scraps',
    effectLanguage: 'paper-gold specks with short warm trails',
    projectileLanguage: 'tiny irregular star-paper fragments, multi-shot readability over detail',
    impactLanguage: 'one pinprick warm flash under photosensitive-safe limits',
    themeHex: '#2E5C6E', accentHex: '#FFD45E',
    iconRule: 'three irregular flecks forming a loose triangle; no constellation line or zodiac symbol',
    smallScaleReadability: 'three-point cluster must remain recognizable at 16px',
    goodsPotential: ['foil sticker', 'paper confetti motif'],
    avoid: [...COMMON_AVOID, 'emoji star', 'galaxy nebula', 'zodiac glyph'],
  },
  postcard_blade: {
    shapeLanguage: 'old postcard rectangle with one sharpened torn edge; travel paper remains primary',
    silhouette: 'postcard rectangle, clipped/torn diagonal edge, no weapon hilt',
    material: 'thick matte postcard stock with worn printed-color traces but no readable text',
    idleLook: 'paper tilts slightly as if caught by a weak night breeze',
    attackLook: 'flies edge-first in a straight line; one paper-cut streak shows pierce direction',
    effectLanguage: 'paper cut, stamp-edge perforation rhythm, restrained travel-color trace',
    projectileLanguage: 'flat rectangular paper blade, never metal kunai',
    impactLanguage: 'thin diagonal paper tear and tiny fibers',
    themeHex: '#F4A7B9', accentHex: '#F7D94C',
    iconRule: 'postcard rectangle + one cut corner/perforated edge; no readable address',
    smallScaleReadability: 'rectangle and cut corner must read at 16-24px',
    goodsPotential: ['real postcard set', 'paper charm'],
    avoid: [...COMMON_AVOID, 'metal knife', 'readable postal text/address'],
  },
  paper_airplane: {
    shapeLanguage: 'simple hand-folded paper plane with visible asymmetry in folds',
    silhouette: 'classic triangular folded plane with one slightly bent wing tip',
    material: 'soft off-white paper, visible fold memory, no glossy coating',
    idleLook: 'rests nose-up with a subtle wing flutter',
    attackLook: 'travels in long shallow curves and rebounds by banking rather than teleporting',
    effectLanguage: 'thin wind line following fold direction, paper dust only at sharp turns',
    projectileLanguage: 'physical folded plane with long readable path',
    impactLanguage: 'small fold-line flash and a change of flight direction rather than an explosion',
    themeHex: '#89C3EB', accentHex: '#FFF1CF',
    iconRule: 'top/3-quarter folded plane silhouette; no airline logo or text',
    smallScaleReadability: 'triangular nose and two wings must remain distinct at 16px',
    goodsPotential: ['origami paper set', 'folded-paper charm'],
    avoid: [...COMMON_AVOID, 'fighter jet', 'airline branding'],
  },
  streetlamp_ring: {
    shapeLanguage: 'pool of streetlamp light rendered as an imperfect ground ring with one implied lamp-post shadow, not a magic circle',
    silhouette: 'flat oval/ring of warm light with one broken edge and short shadow notch',
    material: 'light on asphalt/paper ground; no physical metal ring',
    idleLook: 'a faint pool of light appears as if cast from outside the frame',
    attackLook: 'ring drops/opens on the ground, then remains as a quiet lit safe-zone area',
    effectLanguage: 'warm streetlight falloff, paper-grain edge, restrained dust motes',
    projectileLanguage: 'none; placement marker is a dim falling ellipse if needed',
    impactLanguage: 'soft warm arrival, no shockwave',
    themeHex: '#2E5C6E', accentHex: '#D7C447',
    iconRule: 'broken warm oval + one shadow notch; never occult/magic-circle geometry',
    smallScaleReadability: 'broken oval and shadow notch must read at 16-24px',
    goodsPotential: ['route-stamp motif', 'reflective sticker'],
    avoid: [...COMMON_AVOID, 'magic circle runes', 'neon ring'],
  },
  unfinished_line: {
    shapeLanguage: 'night pencil lineage abstracted into one unfinished hand-drawn graphite sentence-line without letters',
    silhouette: 'long slightly uneven stroke ending abruptly before completion',
    material: 'dense graphite and paper grain',
    idleLook: 'one line hovers unfinished with a dry graphite end',
    attackLook: 'multiple parallel hand-drawn strokes extend forward and pierce through enemies',
    effectLanguage: 'graphite pressure bands and incomplete line endings',
    projectileLanguage: 'thick straight graphite strokes, no glyphs or handwriting',
    impactLanguage: 'brief cross-hatch intersection',
    themeHex: '#264A86', accentHex: '#F6B44B',
    iconRule: 'three uneven parallel strokes with one intentionally unfinished end',
    smallScaleReadability: 'dominant unfinished stroke survives at 16px',
    goodsPotential: ['line-art stationery', 'bookmark pattern'],
    avoid: [...COMMON_AVOID, 'readable writing', 'laser beam'],
  },
  north_star_lantern: {
    shapeLanguage: 'small lantern logic + radial star flecks; lantern remains ordinary and star field remains paper-like',
    silhouette: 'compact lantern body surrounded by a sparse uneven radial fleck ring',
    material: 'aged metal/paper lantern with dry gold flecks',
    idleLook: 'lantern is dim; a few flecks orbit slowly without giant aura',
    attackLook: 'many small flecks leave in all directions from the lantern light source',
    effectLanguage: 'warm radial paper-star trails, no galaxy fog',
    projectileLanguage: 'many small irregular gold paper flecks',
    impactLanguage: 'tiny warm pinprick with short decay',
    themeHex: '#264A86', accentHex: '#FFD45E',
    iconRule: 'small lantern + three uneven star flecks; no compass/zodiac glyph',
    smallScaleReadability: 'lantern body remains primary at 24px',
    goodsPotential: ['lantern charm', 'foil stationery'],
    avoid: [...COMMON_AVOID, 'galaxy orb', 'literal North Star text/glyph'],
  },
  dawn_ink_lamp: {
    shapeLanguage: 'black ink ground stain and warm streetlight pool overlap into a broken dawn ring; neither becomes a generic magic circle',
    silhouette: 'large imperfect ring split between matte ink edge and warm light edge',
    material: 'dry ink on paper/asphalt plus diffused streetlamp light',
    idleLook: 'overlap boundary slowly settles from black toward muted dawn',
    attackLook: 'ink area spreads first, then a warm ring reveals readable safe/attack space inside it',
    effectLanguage: 'black-to-dawn material transition, restrained opacity and no full-screen flash',
    projectileLanguage: 'none; placement/readable ground area',
    impactLanguage: 'broad but soft ground reveal with no shockwave',
    themeHex: '#8F2E14', accentHex: '#F3C9A0',
    iconRule: 'broken two-material ring, black edge + dawn edge; no rune geometry',
    smallScaleReadability: 'two-tone broken ring remains distinct at 16-24px',
    goodsPotential: ['two-ink print', 'route-stamp motif'],
    avoid: [...COMMON_AVOID, 'magic circle', 'white-out dawn flash'],
  },
  unforgotten_name: {
    shapeLanguage: 'night-pencil graphite line becomes a durable name-line concept without ever drawing readable letters',
    silhouette: 'one long line with a small tag-like terminal notch, intentionally textless',
    material: 'graphite, paper fiber, restrained warm-gold fixation point',
    idleLook: 'line remains continuous while a tiny terminal point glows softly',
    attackLook: 'several long lines pierce in parallel and remain visible just long enough to feel recorded',
    effectLanguage: 'persistent graphite line + small warm record point',
    projectileLanguage: 'long textless line strokes',
    impactLanguage: 'one tiny record-dot at each first contact, not a burst',
    themeHex: '#264A86', accentHex: '#F6B44B',
    iconRule: 'single continuous line + tiny terminal node; no letters/name text',
    smallScaleReadability: 'line and terminal node must survive at 16px',
    goodsPotential: ['minimal line pin', 'stationery motif'],
    avoid: [...COMMON_AVOID, 'actual written name', 'signature/calligraphy text'],
  },
  memory_marble: {
    shapeLanguage: 'marble lineage enlarged slightly with a cracked reflected-memory layer inside, never a gemstone',
    silhouette: 'round sphere with one internal offset fracture/reflection crescent',
    material: 'old cloudy glass, internal reflection, restrained pale aqua',
    idleLook: 'internal reflected scene shifts slowly behind the crack',
    attackLook: 'several larger marbles ricochet with long curved reflection trails',
    effectLanguage: 'glass reflection and memory-image distortion, no prismatic rainbow spam',
    projectileLanguage: 'large bouncing glass spheres with one stable internal crack cue',
    impactLanguage: 'brief circular reflection ripple',
    themeHex: '#2E5C6E', accentHex: '#CFE6F0',
    iconRule: 'sphere + internal offset crack/crescent; no gem facets',
    smallScaleReadability: 'circle and one internal fracture cue survive at 16px',
    goodsPotential: ['special glass marble replica', 'clear acrylic'],
    avoid: [...COMMON_AVOID, 'crystal ball', 'gem facets', 'rainbow prism'],
  },
  addressless_blade: {
    shapeLanguage: 'postcard blade lineage after the sealed edge opens; paper envelope cut and route direction replace metal weapon language',
    silhouette: 'slender paper rectangle/triangle hybrid with opened-envelope notch',
    material: 'postcard/envelope paper, dry edge fibers, muted travel color',
    idleLook: 'several paper pieces align as if waiting for an address that never appears',
    attackLook: 'rapid paper blades leave opened-envelope edge traces in a single direction',
    effectLanguage: 'paper perforation, opened seal, straight delivery line',
    projectileLanguage: 'textless paper blades with envelope-edge notch',
    impactLanguage: 'small diagonal tear + opened seal mark without letters',
    themeHex: '#F4A7B9', accentHex: '#F7D94C',
    iconRule: 'opened-envelope notch + sharp paper edge; no address text',
    smallScaleReadability: 'paper wedge and envelope notch survive at 16-24px',
    goodsPotential: ['letter-paper set', 'envelope charm'],
    avoid: [...COMMON_AVOID, 'metal dagger', 'postal text/address'],
  },
  tailwind_plane: {
    shapeLanguage: 'paper-airplane lineage with longer stretched wing fold and one visible tailwind paper ribbon, not an aircraft upgrade',
    silhouette: 'large folded plane with swept paper wings and one thin trailing fold-ribbon',
    material: 'soft folded paper with warm dawn edge',
    idleLook: 'plane banks gently while the trailing paper fold follows with delay',
    attackLook: 'multiple planes cross the screen on broad curved paths; turn direction reads before speed',
    effectLanguage: 'paper wind arcs and delayed fold ribbon',
    projectileLanguage: 'larger folded-paper planes, never jets',
    impactLanguage: 'banking turn + tiny paper-fiber scatter',
    themeHex: '#89C3EB', accentHex: '#F6D9A8',
    iconRule: 'swept folded plane + one trailing fold line; no speed logo',
    smallScaleReadability: 'plane nose/wings stay primary at 16px',
    goodsPotential: ['origami kit', 'paper mobile'],
    avoid: [...COMMON_AVOID, 'fighter aircraft', 'jet contrail'],
  },
};

function weaponClassFor(tags: readonly string[]): WeaponVisualClass {
  if (tags.includes('orbit')) return 'ORBIT';
  if (tags.includes('area') || tags.includes('damage_over_time')) return 'GROUND_AREA';
  if (tags.includes('bounce')) return 'BOUNCE';
  if (tags.includes('random_direction') || tags.includes('multi_shot')) return 'RADIAL';
  return 'PROJECTILE';
}

const evolutionByTargetId = new Map(evolutions.map((entry) => [entry.evolvedWeaponId, entry]));
const evolutionsByBaseId = new Map<string, typeof evolutions>();
for (const evolution of evolutions) {
  const list = evolutionsByBaseId.get(evolution.fromWeaponId) ?? [];
  list.push(evolution);
  evolutionsByBaseId.set(evolution.fromWeaponId, list);
}

function namedObjectRelations(displayName: string) {
  return namedObjectRegistry.filter((entry) => entry.displayName === displayName);
}

function formKind(id: string): WeaponFormKind {
  const evolution = evolutionByTargetId.get(id);
  if (!evolution) return 'BASE';
  if (evolution.kind === 'fusion') return 'FUSION';
  if (evolution.kind === 'awakening') return 'AWAKENING';
  return 'UPGRADE';
}

function baseFormId(id: string): string {
  return evolutionByTargetId.get(id)?.fromWeaponId ?? id;
}

export const weaponVisualSharedSourceEntries: readonly WeaponVisualSharedSourceEntry[] = weapons.map((weapon) => {
  const visual = WEAPON_VISUAL_OVERRIDES[weapon.id];
  if (!visual) throw new Error(`Missing Weapon visual Shared Source override: ${weapon.id}`);

  const namedObjects = namedObjectRelations(weapon.name);
  const baseEvolutions = evolutionsByBaseId.get(weapon.id) ?? [];
  const ownerBiasCharacterIds = [...new Set(namedObjects.map((entry) => entry.characterId))];
  const starterCandidate = weapon.tags.includes('starter') || namedObjects.some((entry) => entry.phase === 'starter_gear');
  const form = formKind(weapon.id);

  return {
    id: weapon.id,
    displayName: weapon.name,
    weaponClass: weaponClassFor(weapon.tags),
    ownerBiasCharacterIds,
    starterCandidate,
    combatFantasy: `${weapon.description} ${weapon.lore}`,
    shapeLanguage: visual.shapeLanguage,
    silhouette: visual.silhouette,
    material: visual.material,
    idleLook: visual.idleLook,
    attackLook: visual.attackLook,
    effectLanguage: visual.effectLanguage,
    projectileLanguage: visual.projectileLanguage,
    impactLanguage: visual.impactLanguage,
    themeHex: visual.themeHex,
    accentHex: visual.accentHex,
    namedObjectRelationIds: namedObjects.map((entry) => entry.id),
    starBeastRelation: 'NONE_BY_DEFAULT',
    toumonRelation: 'NONE_BY_DEFAULT',
    baseFormId: baseFormId(weapon.id),
    formKind: form,
    evolutionIds: baseEvolutions.map((entry) => entry.id),
    evolutionTargetIds: baseEvolutions.map((entry) => entry.evolvedWeaponId),
    kokuyouVariantRule: 'NO_AUTOMATIC_VARIANT',
    dawnVariantRule: 'EVOLUTION_AUTHORITY_ONLY',
    iconRule: visual.iconRule,
    smallScaleReadability: visual.smallScaleReadability,
    animationHooks: [weaponClassFor(weapon.tags).toLowerCase(), 'idle', 'attack', 'impact'],
    vfxHooks: [visual.effectLanguage, visual.impactLanguage],
    sfxFantasy: form === 'BASE' ? 'small physical object sound + restrained paper/night accent' : 'preserve the base-object sound, then add one short dawn/memory layer',
    goodsPotential: visual.goodsPotential,
    avoid: visual.avoid,
    negativePromptHints: [
      'no text, letters, numbers, logo, watermark',
      'no generic RPG weapon silhouette',
      'no neon cyan/purple glow',
      'no glossy 3D game prop',
      'no baked UI frame or rarity badge',
    ],
    generationBriefSeed: [
      `${weapon.name} (${weapon.id}) — ${form}/${weaponClassFor(weapon.tags)}.`,
      `Combat: ${weapon.description}`,
      `Lore: ${weapon.lore}`,
      `Shape: ${visual.shapeLanguage}`,
      `Silhouette: ${visual.silhouette}`,
      `Material: ${visual.material}`,
      `Attack: ${visual.attackLook}`,
      `Effect/projectile/impact: ${visual.effectLanguage} / ${visual.projectileLanguage} / ${visual.impactLanguage}`,
      `Palette: ${visual.themeHex} + ${visual.accentHex}`,
      `Icon: ${visual.iconRule}`,
      `Keep the everyday object identity; evolution must remain visibly descended from base ${baseFormId(weapon.id)}.`,
    ].join('\n'),
    authoritySources: ['src/game/data/weapons.ts', 'src/game/data/evolutions.ts'],
    runtimeReady: true,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
  };
});

export const weaponVisualSharedSourceById = new Map(weaponVisualSharedSourceEntries.map((entry) => [entry.id, entry]));

export const weaponVisualSharedSourceSummary = {
  total: weaponVisualSharedSourceEntries.length,
  base: weaponVisualSharedSourceEntries.filter((entry) => entry.formKind === 'BASE').length,
  evolved: weaponVisualSharedSourceEntries.filter((entry) => entry.formKind !== 'BASE').length,
  starterCandidates: weaponVisualSharedSourceEntries.filter((entry) => entry.starterCandidate).map((entry) => entry.id),
  runtimeReady: true,
  artworkReady: false,
} as const;
