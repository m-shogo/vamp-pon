import type { CharacterDatabaseEntry } from './characterDatabase.ts';
import { characterDefinitions, characterDefinitionById } from './characterDatabase.ts';
import { EMBLEM_PHASE_RULES } from './emblemCanon.ts';

export type CharacterAssetPromptKind =
  | 'sprite_sheet_180'
  | 'character_reference'
  | 'normal_cutin'
  | 'dawn_cutin'
  | 'kokuyou_cutin'
  | 'emblem_blank'
  | 'emblem_normal'
  | 'emblem_dawn'
  | 'emblem_kokuyou';

export type CharacterAssetPrompt = {
  characterId: string;
  characterName: string;
  kind: CharacterAssetPromptKind;
  title: string;
  outputPathHint: string;
  sizeSpec: string;
  prompt: string;
  negativePrompt: string;
  reviewChecklist: string[];
};

export type CharacterAssetPromptPack = {
  characterId: string;
  characterName: string;
  azCode: string;
  promptSeed: string;
  prompts: CharacterAssetPrompt[];
};

export const CHARACTER_ASSET_PROMPT_KINDS: CharacterAssetPromptKind[] = [
  'sprite_sheet_180',
  'character_reference',
  'normal_cutin',
  'dawn_cutin',
  'kokuyou_cutin',
  'emblem_blank',
  'emblem_normal',
  'emblem_dawn',
  'emblem_kokuyou',
];

const COMMON_CHARACTER_STYLE = [
  'Vamp Pon character asset',
  'storybook pixel-art flavor',
  'paper fragments, memory, black ink, small light, warm night mood',
  'mobile game readable silhouette',
  'charming but not baby-like',
  'dark but not horror',
  'textless production asset',
].join(', ');

const COMMON_NEGATIVE_PROMPT = [
  'no text',
  'no letters',
  'no numbers',
  'no logo',
  'no watermark',
  'no UI frame labels',
  'no checkerboard',
  'no white background',
  'no white fringe',
  'no glossy plastic',
  'no realistic human',
  'no gore',
].join(', ');

const SPRITE_SHEET_SPEC = '1440x1080 PNG RGBA, 8 columns x 6 rows, 48 cells, 180x180 per cell, transparent background, character fully inside every cell, no edge contact.';
const REFERENCE_SPEC = '1024x1024 PNG RGBA, full body, front 3/4 view, transparent background, centered, no baked text.';
const CUTIN_SPEC = '1440x360 PNG RGBA, horizontal wide cutin, transparent background, no baked text, no logo, no frame, no checkerboard.';
const EMBLEM_SPEC = '512x512 PNG source, one emblem only, centered, pure #00FF00 chroma key background for UI processing, no text, no letters, no numbers.';

function keywordLine(definition: CharacterDatabaseEntry): string {
  return [
    definition.identity.vessel,
    definition.identity.lineage,
    definition.combat.role,
    definition.combat.starterGear,
    definition.combat.passiveItem,
    definition.combat.rareItem,
    definition.arts.lampArt,
    definition.arts.inheritedLight,
    definition.arts.dawnLight,
    definition.kokuyou.subtitle,
    definition.emblem.azCode,
    definition.emblem.emblemName,
    ...definition.assetFactory.spriteKeywords,
    ...definition.assetFactory.emblemKeywords,
  ].join(', ');
}

function baseCharacterBrief(definition: CharacterDatabaseEntry): string {
  return [
    `${COMMON_CHARACTER_STYLE}.`,
    `Character: ${definition.name} (${definition.id}).`,
    `Core vessel: ${definition.identity.vessel}.`,
    `Lineage: ${definition.identity.lineage}.`,
    `Combat role: ${definition.combat.role}.`,
    `Play feel: ${definition.combat.playFeel}.`,
    `Starter gear: ${definition.combat.starterGear}.`,
    `Passive item: ${definition.combat.passiveItem}.`,
    `Rare item: ${definition.combat.rareItem}.`,
    `Art names: ${definition.arts.lampArt} / ${definition.arts.inheritedLight} / ${definition.arts.dawnLight}.`,
    `Visual keywords: ${keywordLine(definition)}.`,
  ].join('\n');
}

function outputBase(definition: CharacterDatabaseEntry): string {
  return `public/assets/prototypes/characters/${definition.id}`;
}

function checklistBase(definition: CharacterDatabaseEntry): string[] {
  return [
    `${definition.name}の持ち物・光・シルエットが他キャラと被っていない`,
    '390x844のスマホ画面で読める',
    '文字・ロゴ・AZコードを画像へ焼き込んでいない',
    '白フリンジ、市松模様、余計な背景がない',
    '黒耀化は怖すぎず、煤・にじみ・欠けで表現している',
  ];
}

function makePrompt(
  definition: CharacterDatabaseEntry,
  kind: CharacterAssetPromptKind,
  title: string,
  outputPathHint: string,
  sizeSpec: string,
  focus: string,
  reviewChecklist: string[],
): CharacterAssetPrompt {
  return {
    characterId: definition.id,
    characterName: definition.name,
    kind,
    title,
    outputPathHint,
    sizeSpec,
    prompt: [baseCharacterBrief(definition), `Asset focus: ${focus}`, `Output spec: ${sizeSpec}`].join('\n'),
    negativePrompt: COMMON_NEGATIVE_PROMPT,
    reviewChecklist: [...checklistBase(definition), ...reviewChecklist],
  };
}

function buildSpriteSheetPrompt(definition: CharacterDatabaseEntry): CharacterAssetPrompt {
  return makePrompt(
    definition,
    'sprite_sheet_180',
    `${definition.name} 180セルスプライトシート`,
    `${outputBase(definition)}/sprite-sheets/${definition.id}-character-sheet-v1.png`,
    SPRITE_SHEET_SPEC,
    [
      'Create a 48-frame character sprite sheet for gameplay prototype.',
      'Frames should cover idle, walk, hurt, attack/skill, dawn light pose, and kokuyou pose variations.',
      `Keep the starter gear readable: ${definition.combat.starterGear}.`,
      `Keep the vessel readable: ${definition.identity.vessel}.`,
      'Use simple readable poses; do not over-detail the face.',
    ].join(' '),
    [
      '48セルすべてが180x180内に収まっている',
      '歩き・被弾・技・黒耀化差分の見分けがつく',
      '初期灯具が小さくても読める',
    ],
  );
}

function buildReferencePrompt(definition: CharacterDatabaseEntry): CharacterAssetPrompt {
  return makePrompt(
    definition,
    'character_reference',
    `${definition.name} キャラ基準立ち絵`,
    `${outputBase(definition)}/references/${definition.id}-reference-v1.png`,
    REFERENCE_SPEC,
    [
      'Create a single full-body reference image for design review.',
      `Emphasize vessel: ${definition.identity.vessel}.`,
      `Show starter gear clearly: ${definition.combat.starterGear}.`,
      `Mood should match: ${definition.identity.firstAction}.`,
      `Include no text; this is not a character card, only the character artwork.`,
    ].join(' '),
    [
      '全身のシルエットが1枚で分かる',
      '髪型・頭装備・持ち物・光の形が次の素材制作に使える',
      'スプライト化したときに情報量が多すぎない',
    ],
  );
}

function buildNormalCutinPrompt(definition: CharacterDatabaseEntry): CharacterAssetPrompt {
  return makePrompt(
    definition,
    'normal_cutin',
    `${definition.name} 通常暁灯カットイン`,
    `${outputBase(definition)}/cutins/${definition.id}-cutin-dawn-light-normal-v1.png`,
    CUTIN_SPEC,
    [
      'Create a horizontal character cutin for the decisive dawn light moment.',
      `Cutin direction: ${definition.assetFactory.normalCutinBrief}.`,
      `The art name is ${definition.arts.dawnLight}, but do not draw any text in the image.`,
      `Show the emotional answer of the character: ${definition.identity.blank}.`,
      'Wide composition, strong diagonal light, game-feel readable burst, not a portrait card.',
    ].join(' '),
    [
      '横長カットインとして画面を横切る勢いがある',
      '暁灯名を画像へ焼いていない',
      'キャラ固有の持ち物と光が1秒で伝わる',
    ],
  );
}

function buildDawnCutinPrompt(definition: CharacterDatabaseEntry): CharacterAssetPrompt {
  return makePrompt(
    definition,
    'dawn_cutin',
    `${definition.name} 暁開きカットイン`,
    `${outputBase(definition)}/cutins/${definition.id}-cutin-akatsuki-biraki-v1.png`,
    CUTIN_SPEC,
    [
      'Create a more resolved dawn-awakening cutin, warmer and clearer than the normal cutin.',
      `Akatsuki biraki: ${definition.combat.akatsukiBiraki}.`,
      `Emblem dawn change: ${definition.emblem.dawnChange}.`,
      'The night is not erased by violence; it is repaired, named, guided, stored, or returned.',
      'No text, no title, no UI, only artwork.',
    ].join(' '),
    [
      '通常カットインより朝へ近い印象になっている',
      '黒い欠けが少し修復されて見える',
      '強すぎる白飛びでキャラが読めなくなっていない',
    ],
  );
}

function buildKokuyouCutinPrompt(definition: CharacterDatabaseEntry): CharacterAssetPrompt {
  return makePrompt(
    definition,
    'kokuyou_cutin',
    `${definition.name} 黒耀化カットイン`,
    `${outputBase(definition)}/cutins/${definition.id}-cutin-kokuyou-v1.png`,
    CUTIN_SPEC,
    [
      'Create a horizontal kokuyou transformation cutin.',
      `Kokuyou subtitle: ${definition.kokuyou.subtitle}.`,
      `Distortion: ${definition.kokuyou.distortedTrait}.`,
      `Cutin direction: ${definition.assetFactory.kokuyouCutinBrief}.`,
      `Kokuyou emblem scar: ${definition.emblem.kokuyouScar}.`,
      'The character is strained and dangerous, but not evil and not horror.',
      'No text, no title, no UI, only artwork.',
    ].join(' '),
    [
      '黒耀化副題の歪みが絵だけで伝わる',
      '怖すぎず、Vamp Ponの絵本紙片感を保っている',
      '通常カットインとの差分が明確',
    ],
  );
}

function buildEmblemPrompt(definition: CharacterDatabaseEntry, kind: CharacterAssetPromptKind): CharacterAssetPrompt {
  const phase = kind.replace('emblem_', '') as 'blank' | 'normal' | 'dawn' | 'kokuyou';
  const phaseLabel = {
    blank: '無紋',
    normal: '灯紋',
    dawn: '暁紋',
    kokuyou: '黒紋',
  }[phase];
  const focusByPhase = {
    blank: `Unopened blank phase. ${EMBLEM_PHASE_RULES.blank}`,
    normal: `Normal character emblem. Shape: ${definition.emblem.crestShape}. Symbols: ${definition.emblem.coreSymbols.join(', ')}. Light: ${definition.emblem.normalLight}.`,
    dawn: `Dawn emblem phase. ${definition.emblem.dawnChange}. ${EMBLEM_PHASE_RULES.dawn}`,
    kokuyou: `Kokuyou emblem phase. ${definition.emblem.kokuyouScar}. ${EMBLEM_PHASE_RULES.kokuyou}`,
  }[phase];

  return makePrompt(
    definition,
    kind,
    `${definition.name} ${phaseLabel} / ${definition.emblem.azCode}`,
    `${outputBase(definition)}/emblems/emblem-${definition.id}-${definition.emblem.azCode.toLowerCase().replace('-', '')}-${phase}-v1.png`,
    EMBLEM_SPEC,
    [
      'Create a single A-Z灯紋 emblem icon for mobile game UI and merch pin use.',
      `Emblem name: ${definition.emblem.emblemName}.`,
      `AZ code: ${definition.emblem.azCode}; do not draw the code in the image.`,
      `Constellation animal hint: ${definition.emblem.constellationAnimal}; keep it subtle, not an animal portrait.`,
      `Phase focus: ${focusByPhase}.`,
      `Merch hook: ${definition.emblem.merchHook}.`,
      'Centered front view, simple readable silhouette, no letters, no numbers.',
    ].join(' '),
    [
      '64pxでも灯紋の形が読める',
      'AZコードやキャラ名を画像へ焼いていない',
      '星座動物が主役になりすぎていない',
      '同じキャラの4相で基本シルエットが揃っている',
    ],
  );
}

function buildCharacterAssetPromptPack(definition: CharacterDatabaseEntry): CharacterAssetPromptPack {
  return {
    characterId: definition.id,
    characterName: definition.name,
    azCode: definition.emblem.azCode,
    promptSeed: definition.assetFactory.promptSeed,
    prompts: [
      buildSpriteSheetPrompt(definition),
      buildReferencePrompt(definition),
      buildNormalCutinPrompt(definition),
      buildDawnCutinPrompt(definition),
      buildKokuyouCutinPrompt(definition),
      buildEmblemPrompt(definition, 'emblem_blank'),
      buildEmblemPrompt(definition, 'emblem_normal'),
      buildEmblemPrompt(definition, 'emblem_dawn'),
      buildEmblemPrompt(definition, 'emblem_kokuyou'),
    ],
  };
}

export const characterAssetPromptPacks: CharacterAssetPromptPack[] = characterDefinitions.map(buildCharacterAssetPromptPack);

export const characterAssetPromptPackById = new Map(characterAssetPromptPacks.map((pack) => [pack.characterId, pack]));

export const characterAssetPrompts: CharacterAssetPrompt[] = characterAssetPromptPacks.flatMap((pack) => pack.prompts);

export function getCharacterAssetPromptPack(characterId: string): CharacterAssetPromptPack | undefined {
  if (!characterDefinitionById.has(characterId)) return undefined;
  return characterAssetPromptPackById.get(characterId);
}

export function getCharacterAssetPrompt(characterId: string, kind: CharacterAssetPromptKind): CharacterAssetPrompt | undefined {
  return getCharacterAssetPromptPack(characterId)?.prompts.find((prompt) => prompt.kind === kind);
}
