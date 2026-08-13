import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { characterThemeColors } from '../../../src/game/data/characterThemeColors.ts';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-feedback-aware-character-design-prompt.ts';
const COLOR_DOC = 'docs/visual/all-character-color-production-master-v1.md';
const COLOR_JSON = 'data/visual/all-character-color-production-master-v1.json';
const CURRENT21_SOURCE = 'src/game/data/characterThemeColors.ts';
const CORE5_IDS = new Set(['yui', 'asa', 'nagi', 'michiru', 'tomori']);
const FUTURE15_IDS = new Set(['hiyori', 'serika', 'chloe', 'renji', 'touma', 'kuu', 'yomo', 'noa', 'rum', 'maki', 'suzu', 'io', 'kai', 'nao', 'amane']);

type Options = { characterId: string; kind: string; output: string | null };

function parseArgs(args: string[]): Options {
  let characterId = '';
  let kind = 'character_reference';
  let output: string | null = null;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--') continue;
    if (arg === '--character') { characterId = args[++i] ?? ''; continue; }
    if (arg === '--kind') { kind = args[++i] ?? ''; continue; }
    if (arg === '--output') { output = args[++i] ?? null; continue; }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (!characterId) throw new Error('--character is required');
  if (!kind) throw new Error('--kind is required');
  return { characterId, kind, output };
}

function loadMaster() {
  const master = JSON.parse(readFileSync(resolve(process.cwd(), COLOR_JSON), 'utf8'));
  if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') throw new Error(`Color Production Master is not current: ${COLOR_JSON}`);
  if (master.scopeCount !== 36 || master.current21ExactCount !== 21 || master.future15CandidateDerivedCount !== 15) throw new Error('Color Production scope/count policy invalid');
  if (master.unknownExactColorMayBeInventedByImageModel !== false) throw new Error('Unknown exact color invention guard weakened');
  if (master.starBeastColorMayBecomeAutomaticCostumeColor !== false) throw new Error('Star Beast color separation guard weakened');
  if (master.nightMayReplaceIdentityPalette !== false) throw new Error('Night palette overwrite guard weakened');
  if (master.generatedColorAccidentCreatesCanon !== false) throw new Error('Generated color canon guard weakened');
  return master;
}

function runBase(characterId: string, kind: string) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
    '--character', characterId,
    '--kind', kind,
  ], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 34 * 1024 * 1024 });
  return JSON.parse(stdout);
}

function isHex(value: unknown): boolean {
  return typeof value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(value);
}

function resolveColorProfile(characterId: string, base: any, master: any) {
  const exact = characterThemeColors.find((entry) => entry.characterId === characterId) ?? null;
  if (exact) {
    for (const field of master.current21RequiredFields ?? []) {
      if (!(field in exact)) throw new Error(`${characterId}: exact color source missing field ${field}`);
    }
    if (!isHex(exact.themeColor?.hex) || !isHex(exact.accentColor?.hex) || !isHex(exact.starBeastTheme?.hex)) {
      throw new Error(`${characterId}: exact color source contains invalid HEX`);
    }
    if (CORE5_IDS.has(characterId) && !base.core5ColorApplicationProfile) {
      throw new Error(`${characterId}: Core5 dedicated Color Application Profile missing`);
    }
    return {
      authorityClass: master.current21AuthorityClass,
      resolution: CORE5_IDS.has(characterId) ? 'CURRENT21_EXACT_WITH_CORE5_DEDICATED_OVERRIDE' : 'CURRENT21_EXACT_THEME_COLOR_SOURCE',
      source: CURRENT21_SOURCE,
      profile: exact,
      core5DedicatedApplication: CORE5_IDS.has(characterId) ? base.core5ColorApplicationProfile : null,
      exactThemeHexResolved: true,
      exactAccentHexResolved: true,
      exactStarBeastHexResolved: true,
    };
  }

  if (!FUTURE15_IDS.has(characterId)) throw new Error(`${characterId}: missing exact Current21 color record and not recognized as Future15`);
  const living = base?.livingVisualProfile;
  if (!living) throw new Error(`${characterId}: Living Visual Profile missing for Future15 color derivation`);
  for (const field of master.future15DerivedFields ?? []) {
    if (!(field in living)) throw new Error(`${characterId}: Future15 color source missing field ${field}`);
  }
  return {
    authorityClass: master.future15AuthorityClass,
    resolution: 'FUTURE15_LIVING_VISUAL_COLOR_BOUNDARY_ONLY',
    source: base.livingVisualProfilePath ?? master.future15Source,
    profile: {
      id: characterId,
      name: living.name ?? living.displayName ?? null,
      species: living.species ?? null,
      bodyComfort: living.bodyComfort ?? null,
      bodyColorIdentityPolicy: 'Preserve source-backed skin/fur/shell/hair/body identity exactly where specified. Never harmonize body identity to an invented theme palette.',
      clothingSilhouette: living.clothing?.silhouette ?? [],
      clothingMaterials: living.clothing?.materials ?? null,
      clothingPatterns: living.clothing?.patterns ?? [],
      socialPresentation: living.socialPresentation ?? null,
      positivePreference: living.positivePreference ?? [],
      absoluteNever: living.absoluteNever ?? [],
      unresolvedExactPalette: master.future15UnresolvedPolicy,
    },
    core5DedicatedApplication: null,
    exactThemeHexResolved: false,
    exactAccentHexResolved: false,
    exactStarBeastHexResolved: false,
  };
}

function colorPromptBlock(master: any, resolved: any) {
  return [
    'ALL CHARACTER COLOR PRODUCTION MASTER — REQUIRED COLOR AUTHORITY.',
    `Authority: ${COLOR_DOC}.`,
    `Machine policy: ${COLOR_JSON}.`,
    `Color authority class: ${resolved.authorityClass}.`,
    `Color resolution: ${resolved.resolution}.`,
    `Color source: ${resolved.source}.`,
    'Keep body identity color, garment base/support, character theme, accent, Star Beast color, prop material, emitted light, reflected light and wear/repair coloration as separate channels.',
    'Do not flood the garment with theme color. Do not turn accent into universal piping/rim/glow. Do not turn Star Beast color into a third main costume color, eye glow, hair streak or aura unless another higher authority explicitly requires it.',
    'Night/world lighting may alter local perceived value and temperature physically, but may not replace identity palette, lighten dark skin for readability, make pale material self-luminous, or impose universal cyan/violet rim.',
    'High resolution may reveal existing weave/fade/repair/material response; it may not add new color concepts.',
    'CURRENT CHARACTER COLOR PROFILE — REQUIRED.',
    JSON.stringify(resolved.profile, null, 2),
    ...(resolved.core5DedicatedApplication ? [
      'CORE5 DEDICATED COLOR APPLICATION — STRONGER APPLICATION AUTHORITY.',
      JSON.stringify(resolved.core5DedicatedApplication, null, 2),
    ] : []),
    `Color channels: ${JSON.stringify(master.colorChannels)}.`,
    `Grayscale checks: ${JSON.stringify(master.grayscaleChecks)}.`,
    `Color generation gate: ${JSON.stringify(master.imageGenerationGate)}.`,
    `Color hard prohibitions: ${JSON.stringify(master.hardProhibitions)}.`,
  ].join('\n');
}

const options = parseArgs(process.argv.slice(2));
const master = loadMaster();
const base = runBase(options.characterId, options.kind);
if (base.feedbackRecurrenceGenerationEntrypoint !== true) throw new Error(`${options.characterId}: feedback-aware base exporter missing`);
if (base.imageGenerationReadinessState !== 'READY_FOR_CANDIDATE_GENERATION') throw new Error(`${options.characterId}: base prompt not READY`);
const resolved = resolveColorProfile(options.characterId, base, master);
const block = colorPromptBlock(master, resolved);
const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [COLOR_DOC, COLOR_JSON, resolved.source]) {
  if (!authorityOrder.includes(path)) authorityOrder.push(path);
}

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 18),
  generatedBy: 'tools/asset-factory/scripts/export-color-aware-character-design-prompt.ts',
  allCharacterColorProductionRequired: true,
  allCharacterColorProductionMasterPath: COLOR_JSON,
  allCharacterColorProductionAuthorityDocument: COLOR_DOC,
  allCharacterColorAuthorityClass: resolved.authorityClass,
  allCharacterColorResolution: resolved.resolution,
  allCharacterColorSource: resolved.source,
  allCharacterColorProfile: resolved.profile,
  exactThemeHexResolved: resolved.exactThemeHexResolved,
  exactAccentHexResolved: resolved.exactAccentHexResolved,
  exactStarBeastHexResolved: resolved.exactStarBeastHexResolved,
  unknownExactColorMayBeInventedByImageModel: false,
  starBeastColorMayBecomeAutomaticCostumeColor: false,
  themeColorMayFloodEntireGarment: false,
  nightMayReplaceIdentityPalette: false,
  generatedColorAccidentCreatesCanon: false,
  authorityOrder,
  prompt: `${base.prompt}\n\n${block}`,
  reviewChecklist: [
    'Current21はcharacterThemeColors.tsのexact theme/accent/Star Beast HEXを維持する',
    'Core5はdedicated Color Application Masterをstronger application authorityとして維持する',
    'Future15はexact theme/accent/Star Beast HEXを発明せずLiving Visualの色境界だけを守る',
    'skin/fur/shell/body identityをtheme paletteへ調和させて変色しない',
    'Star Beast colorを第三主色・trim・glow・eye/hair accentへ自動転用しない',
    'night/world lightingでidentity paletteを上書きしない',
    'grayscaleでもbody / clothing / prop / silhouetteが読める',
    ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
  ],
};

const serialized = `${JSON.stringify(result, null, 2)}\n`;
if (options.output) {
  mkdirSync(dirname(options.output), { recursive: true });
  writeFileSync(options.output, serialized);
  console.log(`color-aware character design prompt exported: ${options.output}`);
} else {
  process.stdout.write(serialized);
}
