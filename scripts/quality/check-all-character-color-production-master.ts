import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { characterThemeColors } from '../../src/game/data/characterThemeColors.ts';

const root = process.cwd();
const masterPath = 'data/visual/all-character-color-production-master-v1.json';
const exporterPath = 'tools/asset-factory/scripts/export-color-aware-character-design-prompt.ts';
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];
const future15 = new Set(['hiyori', 'serika', 'chloe', 'renji', 'touma', 'kuu', 'yomo', 'noa', 'rum', 'maki', 'suzu', 'io', 'kai', 'nao', 'amane']);

function fail(message: string): never {
  throw new Error(`[all-character-color-production] ${message}`);
}

const master = JSON.parse(readFileSync(resolve(root, masterPath), 'utf8'));
if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') fail('master status invalid');
if (master.scopeCount !== 36 || master.current21ExactCount !== 21 || master.future15CandidateDerivedCount !== 15) fail('scope/count policy invalid');
if (master.unknownExactColorMayBeInventedByImageModel !== false) fail('unknown exact color invention guard weakened');
if (master.starBeastColorMayBecomeAutomaticCostumeColor !== false) fail('Star Beast separation guard weakened');
if (master.themeColorMayFloodEntireGarment !== false) fail('theme flood guard weakened');
if (master.nightMayReplaceIdentityPalette !== false) fail('night palette guard weakened');
if (master.generatedColorAccidentCreatesCanon !== false) fail('generated color canon guard weakened');
if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 12) fail('generation gate incomplete');

if (characterThemeColors.length !== 21) fail(`expected 21 exact theme-color records, got ${characterThemeColors.length}`);
const exactIds = characterThemeColors.map((x) => x.characterId);
if (new Set(exactIds).size !== 21) fail('exact theme-color IDs not unique');
for (const id of exactIds) if (future15.has(id)) fail(`${id}: Future15 unexpectedly has exact Current21 theme-color record`);

const ids: string[] = [];
for (const path of profilePaths) {
  const json = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  if (!Array.isArray(json.characters)) fail(`${path}: characters missing`);
  ids.push(...json.characters.map((x: any) => x.id));
}
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique production IDs, got ${ids.length}/${new Set(ids).size}`);

let exactCount = 0;
let derivedCount = 0;
for (const id of ids) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, exporterPath),
    '--character', id,
    '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 36 * 1024 * 1024 });
  const exported = JSON.parse(stdout);
  if (exported.allCharacterColorProductionRequired !== true) fail(`${id}: color master not required`);
  if (exported.unknownExactColorMayBeInventedByImageModel !== false) fail(`${id}: exact-color invention guard weakened`);
  if (exported.starBeastColorMayBecomeAutomaticCostumeColor !== false) fail(`${id}: Star Beast costume guard weakened`);
  if (exported.nightMayReplaceIdentityPalette !== false) fail(`${id}: night palette guard weakened`);
  if (exported.generatedColorAccidentCreatesCanon !== false) fail(`${id}: generated color canon guard weakened`);
  if (!exported.authorityOrder.includes('docs/visual/all-character-color-production-master-v1.md')) fail(`${id}: color authority doc missing`);
  if (!exported.prompt.includes('ALL CHARACTER COLOR PRODUCTION MASTER — REQUIRED COLOR AUTHORITY.')) fail(`${id}: color prompt block missing`);

  const exact = characterThemeColors.find((x) => x.characterId === id);
  if (exact) {
    exactCount += 1;
    if (exported.allCharacterColorAuthorityClass !== 'EXISTING_CANON_SOURCE_LOCKED') fail(`${id}: exact source authority class wrong`);
    if (exported.exactThemeHexResolved !== true || exported.exactAccentHexResolved !== true || exported.exactStarBeastHexResolved !== true) fail(`${id}: exact HEX resolution flags wrong`);
    if (exported.allCharacterColorProfile?.themeColor?.hex !== exact.themeColor.hex) fail(`${id}: theme HEX drift`);
    if (exported.allCharacterColorProfile?.accentColor?.hex !== exact.accentColor.hex) fail(`${id}: accent HEX drift`);
    if (exported.allCharacterColorProfile?.starBeastTheme?.hex !== exact.starBeastTheme.hex) fail(`${id}: Star Beast HEX drift`);
    if (['yui','asa','nagi','michiru','tomori'].includes(id) && !exported.core5ColorApplicationProfile) fail(`${id}: Core5 dedicated color application missing`);
  } else {
    derivedCount += 1;
    if (!future15.has(id)) fail(`${id}: non-Future15 lacks exact color source`);
    if (exported.allCharacterColorAuthorityClass !== 'AUTHOR_CANDIDATE_DERIVED') fail(`${id}: Future15 authority class wrong`);
    if (exported.exactThemeHexResolved !== false || exported.exactAccentHexResolved !== false || exported.exactStarBeastHexResolved !== false) fail(`${id}: Future15 exact HEX must remain unresolved`);
    const unresolved = exported.allCharacterColorProfile?.unresolvedExactPalette;
    if (!unresolved || unresolved.exactThemeHex !== 'UNRESOLVED_DO_NOT_INVENT' || unresolved.exactAccentHex !== 'UNRESOLVED_DO_NOT_INVENT' || unresolved.starBeastHex !== 'UNRESOLVED_DO_NOT_INVENT') fail(`${id}: Future15 unresolved palette guard missing`);
  }
}

if (exactCount !== 21 || derivedCount !== 15) fail(`resolved split wrong: exact=${exactCount}, derived=${derivedCount}`);
console.log(`[all-character-color-production] OK: 36/36; exact Current21=${exactCount}, Future15 candidate-derived=${derivedCount}`);
