import { attributeDefinitions, attributeReactions, COMBAT_ATTRIBUTES, type CombatAttribute, type StatusKind } from './combatAffinitySource.ts';

export type CombatVfxProfile = {
  attribute: Exclude<CombatAttribute, 'NEUTRAL'>;
  primaryMaterial: string;
  motionLanguage: string;
  hitLanguage: string;
  residueLanguage: string;
  colorRole: string;
  audioTexture: string;
  forbidden: readonly string[];
};

const commonForbidden = [
  'full-screen white flash',
  'rapid repeated global strobe',
  'neon cyan-purple default AI glow',
  'giant bloom that hides enemy silhouettes',
  'same particle preset recolored for every attribute',
] as const;

export const combatAttributeVfxProfiles: readonly CombatVfxProfile[] = [
  { attribute: 'LIGHT', primaryMaterial: 'lantern light on paper / warm reflected edge', motionLanguage: 'short straight reveal rays and soft falloff', hitLanguage: 'one warm rim appears on the struck silhouette', residueLanguage: 'small lit patch or edge, never a permanent aura', colorRole: 'warm amber / pale dawn, low saturation', audioTexture: 'paper-lantern tick + soft glass chime', forbidden: [...commonForbidden, 'holy laser shorthand', 'pure white screen wipe'] },
  { attribute: 'DARK', primaryMaterial: 'matte ink / folded black paper / negative space', motionLanguage: 'fold inward, sink, cover, slide behind', hitLanguage: 'edge contrast drops and ink absorbs outward', residueLanguage: 'dry ink stain / folded shadow edge', colorRole: 'ink black + restrained violet-black', audioTexture: 'paper fold + low room-tone dip', forbidden: [...commonForbidden, 'evil purple smoke cloud', 'screen blackening as primary feedback'] },
  { attribute: 'FIRE', primaryMaterial: 'wick flame / ember / charred paper edge', motionLanguage: 'short rise, flicker, handoff ember', hitLanguage: 'tiny dry spark and localized char', residueLanguage: 'thin burnt seam / ember point', colorRole: 'repair orange + muted ember red', audioTexture: 'match scratch + tiny ember hiss', forbidden: [...commonForbidden, 'large gasoline explosion', 'constant high-brightness flame wall'] },
  { attribute: 'WATER', primaryMaterial: 'dew / night water / reflective paper wetness', motionLanguage: 'ripple, bead, thread, trailing droplet', hitLanguage: 'small ring and surface reflection shift', residueLanguage: 'few wet points / thin reflective path', colorRole: 'blue gray + pale aqua', audioTexture: 'single drop + restrained ripple', forbidden: [...commonForbidden, 'ocean splash covering playfield', 'glossy 3D water simulation'] },
  { attribute: 'WIND', primaryMaterial: 'paper air / cloth movement / dust line', motionLanguage: 'curve, bank, push, spiral', hitLanguage: 'enemy leans/slides before any particle', residueLanguage: 'paper scrap settles in travel direction', colorRole: 'mostly material color; faint cool blue only as guide', audioTexture: 'paper snap + low gust', forbidden: [...commonForbidden, 'opaque tornado funnel', 'constant circular blur'] },
  { attribute: 'THUNDER', primaryMaterial: 'brief electrical branch over metal/paper', motionLanguage: 'jump, fork, instant short chain', hitLanguage: 'one-frame thin branch plus target twitch', residueLanguage: 'tiny vibration ring / fading conductive point', colorRole: 'amber-white with restrained cool accent', audioTexture: 'muted metal ping + electrical tick', forbidden: [...commonForbidden, 'repeating flashbang', 'screen-spanning lightning every hit'] },
  { attribute: 'ICE', primaryMaterial: 'frosted glass / cold paper edge / condensation', motionLanguage: 'creep, frost over, slow expansion', hitLanguage: 'edge frosting and slowed motion', residueLanguage: 'thin frost line / condensation patch', colorRole: 'pale blue-gray + moon silver', audioTexture: 'soft glass frost + dry crystal tick', forbidden: [...commonForbidden, 'giant RPG ice crystal spikes by default', 'white-blue bloom fog'] },
  { attribute: 'EARTH', primaryMaterial: 'stone pavement / chalk dust / compact soil', motionLanguage: 'slam, crack, lift, settle', hitLanguage: 'short displacement and localized chips', residueLanguage: 'readable crack / dust ring', colorRole: 'stone gray / old brass / muted brown', audioTexture: 'dull stone knock + grit scrape', forbidden: [...commonForbidden, 'mountain-sized rocks', 'persistent dust cloud hiding enemies'] },
  { attribute: 'METAL', primaryMaterial: 'dull iron / brass / repaired tool steel', motionLanguage: 'spin, pierce, return, clamp', hitLanguage: 'thin edge glint + one contact spark', residueLanguage: 'small scratch / tool mark', colorRole: 'dull silver / brass; no chrome mirror default', audioTexture: 'tool clink + short metallic scrape', forbidden: [...commonForbidden, 'shiny sci-fi chrome default', 'sparks on every frame'] },
  { attribute: 'BLOOM', primaryMaterial: 'pressed petal / dry stem / thread root', motionLanguage: 'unfold, stitch, root, curl slowly', hitLanguage: 'vein/root catches the target at feet or joints', residueLanguage: 'dry petals / thread marks', colorRole: 'pressed pink / faded green / paper cream', audioTexture: 'dry petal rustle + thread tension', forbidden: [...commonForbidden, 'lush magical jungle explosion', 'flower confetti everywhere'] },
  { attribute: 'DREAM', primaryMaterial: 'page-wave / soft reflection / slight double image', motionLanguage: 'delay, echo, offset, spiral', hitLanguage: 'one delayed afterimage rather than blur spam', residueLanguage: 'faint offset outline fades asynchronously', colorRole: 'soft violet / water blue, low contrast', audioTexture: 'distant soft bell + muffled page turn', forbidden: [...commonForbidden, 'heavy blur that harms readability', 'psychedelic rainbow filter'] },
  { attribute: 'MEMORY', primaryMaterial: 'graphite / tag point / old paper trace', motionLanguage: 'write, connect, record, repeat', hitLanguage: 'tiny record point appears at contact', residueLanguage: 'persistent but short textless line / dot', colorRole: 'graphite + warm record amber', audioTexture: 'pencil drag + paper tap', forbidden: [...commonForbidden, 'readable generated text', 'floating letters/glyph spam'] },
  { attribute: 'STAR', primaryMaterial: 'paper-gold fleck / pin / small reflected point', motionLanguage: 'aim, arc, converge, guide', hitLanguage: 'single pinprick star and direction change', residueLanguage: 'few guiding points, no constellation line by default', colorRole: 'dry gold + night blue', audioTexture: 'small pin click + distant chime', forbidden: [...commonForbidden, 'galaxy nebula', 'zodiac glyphs', 'emoji star shower'] },
  { attribute: 'BLANK', primaryMaterial: 'white paper gap / eraser dust / quiet unprinted surface', motionLanguage: 'wipe, open space, separate, rewrite', hitLanguage: 'effect density reduces rather than exploding', residueLanguage: 'clean gap closes or gets rewritten', colorRole: 'off-white + quiet gold edge', audioTexture: 'dry eraser scrape + paper breath', forbidden: [...commonForbidden, 'pure white flash', 'delete/glitch computer effect default'] },
] as const;

export const reactionVfxProfiles = attributeReactions.map((reaction) => ({
  reactionId: reaction.id,
  name: reaction.name,
  attributes: reaction.requires,
  statusPrerequisites: reaction.statuses,
  vfxRule: `${reaction.requires.map((attribute) => attributeDefinitions[attribute].vfx).join(' + ')}. Keep both source materials readable; reaction must look like an interaction, not a third unrelated magic preset.`,
  intensityRule: 'Reaction may be one tier stronger than a normal hit, but must remain local to affected targets/area and obey photosensitive-safe caps.',
}));

export const statusUiVfxRules: Readonly<Record<StatusKind, string>> = {
  BURN: 'tiny ember at feet/edge + thin char meter; never full-body flames by default',
  SOAK: 'one blue-gray droplet/ripple marker; no glossy wet shader requirement',
  CHILL: 'frosted edge + small cold tick marks',
  FREEZE: 'brief pale outline / movement stop; boss conversion uses a short cold stagger instead of statue freeze',
  SHOCK: 'single small branch marker; no repeated screen flash',
  CONDUCTIVE: 'small metal/amber node showing next thunder interaction',
  EXPOSED: 'subtle broken-outline notch; do not use giant red target icon',
  ROOTED: 'thin root/thread at feet; preserve enemy silhouette',
  DROWSY: 'one offset afterimage or sleepy wave; no vision-obscuring blur',
  SLEEP: 'short soft closed-wave marker; boss uses delayed-action marker instead',
  MARKED: 'tiny textless graphite point/tag notch',
  ILLUMINATED: 'warm rim edge, not full white aura',
  ECLIPSED: 'matte edge darkening local to entity, not screen dimming',
  ERASED: 'small eraser-dust notch where temporary effect was reduced',
  SEALED: 'simple closed seam / paper fold marker; no lock emoji',
  DISORIENTED: 'short bent route-line above/behind movement, no spinning stars cliché',
};

export const combatVfxSummary = {
  attributeProfileCount: combatAttributeVfxProfiles.length,
  expectedAttributeProfileCount: COMBAT_ATTRIBUTES.length - 1,
  reactionProfileCount: reactionVfxProfiles.length,
  recolorOnlyForbidden: true,
  photosensitiveSafetyRequired: true,
  mobileReadabilityRequired: true,
} as const;
