import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
  CHARACTER_ASSET_PROMPT_KINDS,
  getCharacterAssetPrompt,
  type CharacterAssetPromptKind,
} from '../../../src/game/data/assetFactoryCharacterPrompts.ts';

const CORE5_IDS = new Set(['yui', 'asa', 'nagi', 'michiru', 'tomori']);
const CURRENT21_EXTENDED_IDS = new Set([
  'sen','ritsu','koyori','gen','hana','yubi','madoka','shiro','tobari','nemu','kuroori','kage1','kage2','kage3','kage4','ren',
]);

const COUNCIL_DOC = 'docs/visual/world-character-scenario-design-council-master-v1.md';
const COUNCIL_JSON = 'data/visual/world-character-scenario-design-council-master-v1.json';
const WORLD_MASTER = 'docs/00-current-story-world-master.md';
const ERA_LIFE_DOC = 'docs/visual/core5-era-life-design-master-v1.md';
const ERA_LIFE_JSON = 'data/visual/core5-era-life-design-master-v1.json';
const RELATIONSHIP_DOC = 'docs/visual/relationship-embodied-daily-life-contract-v1.md';
const RELATIONSHIP_JSON = 'data/visual/relationship-embodied-daily-life-contract-v1.json';

type CliOptions = {
  characterId: string;
  kind: CharacterAssetPromptKind;
  output: string | null;
  format: 'markdown' | 'json';
};

type LivingVisualProfile = Record<string, unknown> & { id: string; name?: string };
type EraLifeProfile = Record<string, unknown> & { id: string; name?: string };

function parseArgs(args: string[]): CliOptions {
  let characterId = '';
  let kind: CharacterAssetPromptKind = 'character_reference';
  let output: string | null = null;
  let format: 'markdown' | 'json' = 'markdown';

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--') continue;
    if (arg === '--character') {
      characterId = args[++index] ?? '';
      continue;
    }
    if (arg === '--kind') {
      const value = args[++index] as CharacterAssetPromptKind | undefined;
      if (!value || !CHARACTER_ASSET_PROMPT_KINDS.includes(value)) throw new Error(`Invalid --kind: ${value ?? '(missing)'}`);
      kind = value;
      continue;
    }
    if (arg === '--output') {
      output = args[++index] ?? null;
      if (!output) throw new Error('--output requires a path');
      continue;
    }
    if (arg === '--format') {
      const value = args[++index];
      if (value !== 'markdown' && value !== 'json') throw new Error('--format requires markdown or json');
      format = value;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!characterId) throw new Error('--character is required');
  return { characterId, kind, output, format };
}

function livingVisualProfilePath(characterId: string): string {
  if (CORE5_IDS.has(characterId)) return 'data/visual/core5-living-visual-profiles-v1.json';
  if (CURRENT21_EXTENDED_IDS.has(characterId)) return 'data/visual/current21-extended-living-visual-profiles-v1.json';
  return 'data/visual/future15-living-visual-profiles-v1.json';
}

function loadProfile(characterId: string): { path: string; status: string | null; profile: LivingVisualProfile } {
  const path = livingVisualProfilePath(characterId);
  const document = JSON.parse(readFileSync(resolve(process.cwd(), path), 'utf8'));
  const profile = (document.characters ?? []).find((entry: LivingVisualProfile) => entry.id === characterId);
  if (!profile) throw new Error(`Living Visual Profile missing for ${characterId} in ${path}; export blocked.`);
  return { path, status: typeof document.status === 'string' ? document.status : null, profile };
}

function loadEraLifeProfile(characterId: string): EraLifeProfile | null {
  if (!CORE5_IDS.has(characterId)) return null;
  const document = JSON.parse(readFileSync(resolve(process.cwd(), ERA_LIFE_JSON), 'utf8'));
  const profile = (document.characters ?? []).find((entry: EraLifeProfile) => entry.id === characterId);
  if (!profile) throw new Error(`Core5 Era Life Profile missing for ${characterId} in ${ERA_LIFE_JSON}; export blocked.`);
  return profile;
}

function loadCouncil() {
  const council = JSON.parse(readFileSync(resolve(process.cwd(), COUNCIL_JSON), 'utf8'));
  if (council.status !== 'CURRENT_CROSS_DISCIPLINE_AUTHORITY') {
    throw new Error(`Design Council is not current authority: ${COUNCIL_JSON}`);
  }
  if (!Array.isArray(council.productionGates?.characterAsset)) {
    throw new Error(`Design Council character asset gate missing: ${COUNCIL_JSON}`);
  }
  return council;
}

function loadRelationshipContract() {
  const contract = JSON.parse(readFileSync(resolve(process.cwd(), RELATIONSHIP_JSON), 'utf8'));
  if (contract.status !== 'CURRENT_AUTHORING_CONTRACT_EXTENDS_EXISTING_RELATIONSHIP_AUTHORITIES') {
    throw new Error(`Relationship embodiment contract is not current: ${RELATIONSHIP_JSON}`);
  }
  if (contract.doesNotCreateNewRelationshipEdges !== true) {
    throw new Error(`Relationship embodiment contract must not create new edges: ${RELATIONSHIP_JSON}`);
  }
  return contract;
}

function resolvedPromptBlock(
  profilePath: string,
  profile: LivingVisualProfile,
  council: any,
  eraLife: EraLifeProfile | null,
  relationship: any,
): string {
  return [
    'WORLD / CHARACTER / SCENARIO DESIGN COUNCIL — REQUIRED CROSS-DISCIPLINE AUTHORITY.',
    `World authority: ${WORLD_MASTER}.`,
    `Council authority: ${COUNCIL_DOC}.`,
    `Council machine rules: ${COUNCIL_JSON}.`,
    `Council final question: ${council.finalQuestion}`,
    'Before decoration, ask what world/era/life function requires the element and what this person would choose or tolerate.',
    'For character assets, world context, ordinary physical use, relationship history, and scenario role must not be overridden by beauty/coolness/premium rendering.',
    ...(eraLife
      ? [
          'CORE5 ERA LIFE PROFILE — REQUIRED ERA/LIFE AUTHORITY.',
          `Era authority: ${ERA_LIFE_DOC}.`,
          `Era machine rules: ${ERA_LIFE_JSON}.`,
          'Do not express era only through costume styling. Preserve ordinary-system assumptions: communication, money/payment, transport/navigation, shopping/availability, repair/replacement, food/packaging, waiting, privacy/records, work/institution, household comfort, carried objects, and conversational assumptions.',
          'Dream translation may stylize the character, but must preserve some Reality-era habits in storage, repair, movement, object handling, posture, or acting.',
          JSON.stringify(eraLife, null, 2),
        ]
      : []),
    'RELATIONSHIP EMBODIMENT MASTER — REQUIRED BOUNDARY AUTHORITY.',
    `Relationship authority: ${RELATIONSHIP_DOC}.`,
    `Relationship machine rules: ${RELATIONSHIP_JSON}.`,
    'Do not invent relationship history, romance, gifts, matching accessories, touch permission, borrowed objects, or appearance intervention that are not backed by existing relationship authorities.',
    'Relationship depth is multi-axis. High trust does not automatically mean closer body distance, more touch, casual speech, matching accessories, or more skin exposure.',
    'If a relationship trace affects clothing, repair, object placement, grooming, or pose, it must have an existing relationship source. Otherwise omit it.',
    JSON.stringify({
      antiShortcut: relationship.antiShortcut,
      appearanceInterventionNeverAutomatic: relationship.appearanceInterventionNeverAutomatic,
      bodyActingFields: relationship.bodyActingFields,
      unknownPairPolicy: relationship.unknownPairPolicy,
      positiveTarget: relationship.positiveTarget,
    }, null, 2),
    'LIVING VISUAL PROFILE — REQUIRED CHARACTER AUTHORITY.',
    `Source: ${profilePath}.`,
    'The person is already designed. Do not redesign them from genre defaults.',
    'Preserve body, age, posture, clothing construction, exposure boundaries, body-modification policy, grooming, wear habits, absoluteNever, and positivePreference.',
    'Do not add unspecified piercing, tattoo, scar, mole, freckles, jewelry, gemstone, gold trim, belts, harness, makeup, nail art, skin exposure, or decorative asymmetry.',
    'Do not increase ornament merely because this is a premium/high-resolution/dynamic asset.',
    'Do not replace established clothing construction with generic fantasy or generic gacha clothing.',
    'AUTHOR_CANDIDATE is not USER_CONFIRMED, but it remains an active constraint for this candidate until human review changes it.',
    'If an unresolved required field exists, stop and return to authoring; do not invent a model default.',
    JSON.stringify(profile, null, 2),
  ].join('\n');
}

function authorityOrder(characterId: string, profilePath: string): string[] {
  return [
    WORLD_MASTER,
    ...(CORE5_IDS.has(characterId) ? [ERA_LIFE_DOC, ERA_LIFE_JSON] : []),
    'docs/visual/character-living-visual-master-v1.md',
    profilePath,
    'docs/character-appearance-source-book-v1.md',
    'docs/character-appearance-distinction-generation-contract-v1.md',
    'docs/visual/character-designer-philosophy-master-v1.md',
    'data/visual/character-designer-philosophy-master-v1.json',
    'docs/visual/character-designer-craft-master-v1.md',
    'data/visual/character-designer-craft-master-v1.json',
    'docs/visual/character-designer-precedent-master-v1.md',
    'data/visual/character-designer-precedent-master-v1.json',
    COUNCIL_DOC,
    COUNCIL_JSON,
    RELATIONSHIP_DOC,
    RELATIONSHIP_JSON,
    'data/visual/character-designer-ai-brain.json',
  ];
}

function renderMarkdown(options: CliOptions) {
  const prompt = getCharacterAssetPrompt(options.characterId, options.kind);
  if (!prompt) throw new Error(`Character asset prompt not found: ${options.characterId} / ${options.kind}`);
  const living = loadProfile(options.characterId);
  const eraLife = loadEraLifeProfile(options.characterId);
  const council = loadCouncil();
  const relationship = loadRelationshipContract();
  const resolvedPrompt = [prompt.prompt, '', resolvedPromptBlock(living.path, living.profile, council, eraLife, relationship)].join('\n');
  return [
    '# Yoru no Shirube — Resolved Character Asset Prompt',
    '',
    `Character: ${prompt.characterName} / ${prompt.characterId}`,
    `Kind: ${prompt.kind}`,
    `Output: ${prompt.outputPathHint}`,
    `Size: ${prompt.sizeSpec}`,
    `Living Visual Profile: ${living.path}`,
    `Living Visual Source Status: ${living.status ?? 'unknown'}`,
    `Design Council: ${COUNCIL_DOC}`,
    `Relationship Embodiment Master: ${RELATIONSHIP_DOC}`,
    ...(eraLife ? [`Core5 Era Life Profile: ${ERA_LIFE_JSON}#${options.characterId}`] : []),
    '',
    '## Mandatory authority order',
    '',
    ...authorityOrder(options.characterId, living.path).map((entry, index) => `${index + 1}. ${entry}`),
    '',
    '## Resolved Prompt',
    '',
    '```text',
    resolvedPrompt,
    '```',
    '',
    '## Negative Prompt',
    '',
    '```text',
    prompt.negativePrompt,
    '```',
    '',
    '## Review Checklist',
    '',
    '- World / Character / Relationship / Scenario Councilの必要性テストに通る',
    '- Relationship Authorityにないgift / matching accessory / touch / exposure changeを発明していない',
    ...(eraLife
      ? [
          '- Core5のEra差が衣装だけでなく、収納・修繕・持ち物・移動・所作へ反映されている',
          '- generic period costume / generic future fashionへ落ちていない',
        ]
      : []),
    '- Living Visual ProfileのabsoluteNever違反がない',
    '- positivePreferenceが少なくとも複数、自然な形で見た目に反映されている',
    '- Era / location / ordinary actionで衣装と小物が実際に使える',
    '- dynamic / premium assetでもbody・age・exposure・body modificationが勝手に変わっていない',
    '- generic fantasy/gachaの装飾で設定の空白を埋めていない',
    ...prompt.reviewChecklist.map((item) => `- ${item}`),
    '',
  ].join('\n');
}

function renderJson(options: CliOptions) {
  const prompt = getCharacterAssetPrompt(options.characterId, options.kind);
  if (!prompt) throw new Error(`Character asset prompt not found: ${options.characterId} / ${options.kind}`);
  const living = loadProfile(options.characterId);
  const eraLife = loadEraLifeProfile(options.characterId);
  const council = loadCouncil();
  const relationship = loadRelationshipContract();
  return `${JSON.stringify({
    schemaVersion: 4,
    generatedBy: 'tools/asset-factory/scripts/export-character-asset-prompt.ts',
    characterId: options.characterId,
    kind: options.kind,
    worldMasterPath: WORLD_MASTER,
    designCouncilPath: COUNCIL_DOC,
    designCouncilDataPath: COUNCIL_JSON,
    designCouncilFinalQuestion: council.finalQuestion,
    designCouncilCharacterAssetGates: council.productionGates.characterAsset,
    relationshipEmbodimentPath: RELATIONSHIP_DOC,
    relationshipEmbodimentDataPath: RELATIONSHIP_JSON,
    relationshipUnknownPairPolicy: relationship.unknownPairPolicy,
    eraLifeMasterPath: eraLife ? ERA_LIFE_JSON : null,
    eraLifeProfile: eraLife,
    livingVisualProfilePath: living.path,
    livingVisualProfileSourceStatus: living.status,
    livingVisualProfile: living.profile,
    unknownLifePreferenceMayBeInventedByImageModel: false,
    unknownRelationshipPreferenceMayBeInventedByImageModel: false,
    authorityOrder: authorityOrder(options.characterId, living.path),
    prompt: `${prompt.prompt}\n\n${resolvedPromptBlock(living.path, living.profile, council, eraLife, relationship)}`,
    negativePrompt: prompt.negativePrompt,
    reviewChecklist: [
      'World / Character / Relationship / Scenario Councilの必要性テストに通る',
      'Relationship Authorityにないgift / matching accessory / touch / exposure changeを発明していない',
      ...(eraLife
        ? [
            'Core5のEra差が衣装だけでなく収納・修繕・持ち物・移動・所作へ反映されている',
            'generic period costume / generic future fashionへ落ちていない',
          ]
        : []),
      'Living Visual ProfileのabsoluteNever違反がない',
      'positivePreferenceが自然に反映されている',
      'Era / location / ordinary actionで衣装と小物が実際に使える',
      'dynamic/premium assetでもbody・age・exposure・body modificationが変わっていない',
      'generic fantasy/gacha装飾で空白を補っていない',
      ...prompt.reviewChecklist,
    ],
    outputPathHint: prompt.outputPathHint,
    sizeSpec: prompt.sizeSpec,
  }, null, 2)}\n`;
}

const options = parseArgs(process.argv.slice(2));
const output = options.format === 'json' ? renderJson(options) : renderMarkdown(options);
if (options.output) {
  mkdirSync(dirname(options.output), { recursive: true });
  writeFileSync(options.output, output);
  console.log(`resolved character asset prompt exported: ${options.output}`);
} else {
  process.stdout.write(output);
}
