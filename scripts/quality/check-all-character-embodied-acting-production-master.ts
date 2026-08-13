import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { current21SilhouetteMatrix } from '../../src/game/data/current21SilhouetteMatrix.ts';

const root = process.cwd();
const masterPath = 'data/visual/all-character-embodied-acting-production-master-v1.json';
const exporterPath = 'tools/asset-factory/scripts/export-final-character-design-prompt.ts';
const livingPaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

function fail(message: string): never {
  throw new Error(`[all-character-embodied-acting-production] ${message}`);
}

const master = JSON.parse(readFileSync(resolve(root, masterPath), 'utf8'));
if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') fail('master status must be current');
if (master.scopeCount !== 36) fail('scopeCount must be 36');
if (master.doesNotCreateNewStoryCanon !== true || master.doesNotPromoteCandidates !== true) fail('provenance guards weakened');
if (master.unknownEmbodiedDetailMayBeInventedByImageModel !== false) fail('embodied invention guard weakened');
if (master.generatedPoseCreatesCanon !== false) fail('generated pose canon guard weakened');
if (master.sharedRules?.genericHeroPoseAllowedAsIdentityBase !== false) fail('generic hero stance guard weakened');
if (master.sharedRules?.floatingPropWithoutRelationAllowed !== false) fail('floating prop guard weakened');
if (master.sharedRules?.poseMayInventRelationship !== false) fail('relationship invention guard weakened');
if (master.sharedRules?.mobilityEquipmentMayBeRemovedForComposition !== false) fail('mobility guard weakened');
if (!Array.isArray(master.requiredChannels) || master.requiredChannels.length < 15) fail('required channels incomplete');
if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 14) fail('generation gate incomplete');

const livingDocuments = livingPaths.map((path) => ({ path, doc: JSON.parse(readFileSync(resolve(root, path), 'utf8')) }));
const livingCharacters = livingDocuments.flatMap(({ path, doc }) => (doc.characters ?? []).map((entry: any) => ({ ...entry, __sourcePath: path })));
if (livingCharacters.length !== 36) fail(`expected 36 Living Visual profiles, got ${livingCharacters.length}`);
const livingIds = livingCharacters.map((entry: any) => entry.id);
if (new Set(livingIds).size !== 36) fail('Living Visual IDs are not unique');

if (current21SilhouetteMatrix.length !== 21) fail(`expected 21 Current21 silhouette entries, got ${current21SilhouetteMatrix.length}`);
const current21ById = new Map(current21SilhouetteMatrix.map((entry) => [entry.characterId, entry]));
for (const entry of current21SilhouetteMatrix) {
  for (const field of master.current21RequiredFields ?? []) {
    if (!(field in entry) || !String((entry as any)[field] ?? '').trim()) fail(`${entry.characterId}: Current21 embodied source missing ${field}`);
  }
}

let current21Count = 0;
let future15Count = 0;
for (const living of livingCharacters) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, exporterPath),
    '--character', living.id, '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  const exported = JSON.parse(stdout);

  if (exported.finalCharacterDesignProductionEntrypoint !== true) fail(`${living.id}: final production entrypoint missing`);
  if (exported.allCharacterEmbodiedActingProductionRequired !== true) fail(`${living.id}: embodied acting master not required`);
  if (!exported.embodiedActingProfile) fail(`${living.id}: embodied acting profile missing`);
  if (exported.unknownEmbodiedDetailMayBeInventedByImageModel !== false) fail(`${living.id}: embodied invention guard weakened in output`);
  if (exported.generatedPoseCreatesCanon !== false) fail(`${living.id}: generated-pose canon guard weakened in output`);
  if (!exported.authorityOrder.includes('docs/visual/all-character-embodied-acting-production-master-v1.md')) fail(`${living.id}: embodied master missing from authority order`);
  if (!exported.prompt.includes('ALL CHARACTER EMBODIED ACTING PRODUCTION MASTER — FINAL POSE/PROP/ENVIRONMENT AUTHORITY.')) fail(`${living.id}: embodied prompt block missing`);
  if (!exported.prompt.includes('CHARACTER-SPECIFIC EMBODIED PROFILE — REQUIRED.')) fail(`${living.id}: character-specific embodied block missing`);

  const exact = current21ById.get(living.id);
  if (exact) {
    current21Count += 1;
    if (exported.embodiedActingAuthorityClass !== 'EXISTING_CANON_SOURCE_LOCKED') fail(`${living.id}: Current21 authority class weakened`);
    if (exported.embodiedActingResolution !== 'CURRENT21_EXACT_SILHOUETTE_MATRIX') fail(`${living.id}: Current21 exact resolution missing`);
    if (exported.embodiedActingProfile.posture !== exact.posture) fail(`${living.id}: posture mismatch from exact source`);
    if (exported.embodiedActingProfile.objectAnchor !== exact.objectAnchor) fail(`${living.id}: object anchor mismatch from exact source`);
    if (exported.embodiedActingProfile.motionSignature !== exact.motionSignature) fail(`${living.id}: motion signature mismatch from exact source`);
  } else {
    future15Count += 1;
    if (exported.embodiedActingAuthorityClass !== 'AUTHOR_CANDIDATE_DERIVED') fail(`${living.id}: Future15 authority class must remain candidate-derived`);
    if (exported.embodiedActingResolution !== 'FUTURE15_LIVING_VISUAL_CONSERVATIVE_DERIVATION') fail(`${living.id}: Future15 conservative derivation missing`);
    if (exported.embodiedActingProfile.species !== living.species) fail(`${living.id}: Future15 species drift in embodied profile`);
    if (exported.embodiedActingProfile.bodyComfort !== living.bodyComfort) fail(`${living.id}: Future15 bodyComfort drift in embodied profile`);
    if (!String(exported.embodiedActingProfile.unresolvedPolicy ?? '').includes('Do not invent exact gesture')) fail(`${living.id}: Future15 unresolved policy missing`);
  }
}

if (current21Count !== 21) fail(`expected 21 exact Current21 embodied exports, got ${current21Count}`);
if (future15Count !== 15) fail(`expected 15 candidate-derived Future15 embodied exports, got ${future15Count}`);

console.log(`[all-character-embodied-acting-production] OK: 36/36 final prompts; ${current21Count} exact Current21 + ${future15Count} conservative Future15`);
