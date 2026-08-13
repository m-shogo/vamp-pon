import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { characterAppearanceGenerationContracts } from '../../src/game/data/characterAppearanceGenerationContracts.ts';

const root = process.cwd();
const masterPath = 'data/visual/all-character-identity-production-master-v1.json';
const exporterPath = 'tools/asset-factory/scripts/export-final-character-design-prompt.ts';

function fail(message: string): never {
  throw new Error(`[all-character-identity-production] ${message}`);
}

const master = JSON.parse(readFileSync(resolve(root, masterPath), 'utf8'));
if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION') fail('master status must be current');
if (master.scopeCount !== 36) fail('scopeCount must be 36');
if (master.doesNotCreateNewStoryCanon !== true || master.doesNotPromoteCandidates !== true) fail('provenance guards weakened');
if (master.unknownIdentityGeometryMayBeInventedByImageModel !== false) fail('identity invention guard weakened');
if (master.sharedRules?.sameAttractiveFaceBaseAllowed !== false) fail('same-face guard weakened');
if (master.sharedRules?.renderingMayNormalizeBody !== false) fail('body normalization guard weakened');
if (master.sharedRules?.genderAmbiguityMayBeResolvedByModel !== false) fail('gender ambiguity guard weakened');
if (!Array.isArray(master.requiredFields) || master.requiredFields.length < 20) fail('required fields incomplete');
if (!Array.isArray(master.neutralRecognitionTests) || master.neutralRecognitionTests.length < 7) fail('neutral recognition tests incomplete');

if (characterAppearanceGenerationContracts.length !== 36) fail(`expected 36 appearance contracts, got ${characterAppearanceGenerationContracts.length}`);
const ids = characterAppearanceGenerationContracts.map((x) => x.id);
if (new Set(ids).size !== 36) fail('appearance contract IDs are not unique');

for (const contract of characterAppearanceGenerationContracts) {
  for (const field of master.requiredFields) {
    if (!(field in contract)) fail(`${contract.id}: missing required source field ${field}`);
  }
  if (!contract.faceSignatureId) fail(`${contract.id}: faceSignatureId missing`);
  if (!contract.bodyShape) fail(`${contract.id}: bodyShape missing`);
  if (!Array.isArray(contract.forbiddenDrift) || contract.forbiddenDrift.length < 1) fail(`${contract.id}: forbiddenDrift missing`);
  if (contract.nearestExistingFace && !contract.differenceFromNearest) fail(`${contract.id}: nearest-face difference missing`);

  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, exporterPath),
    '--character', contract.id, '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 24 * 1024 * 1024 });
  const exported = JSON.parse(stdout);
  if (exported.finalCharacterDesignProductionEntrypoint !== true) fail(`${contract.id}: final production entrypoint missing`);
  if (exported.allCharacterIdentityProductionRequired !== true) fail(`${contract.id}: identity master not required`);
  if (!exported.appearanceGenerationContract || exported.appearanceGenerationContract.id !== contract.id) fail(`${contract.id}: exact appearance contract missing`);
  if (exported.appearanceGenerationContract.faceSignatureId !== contract.faceSignatureId) fail(`${contract.id}: face signature mismatch`);
  if (exported.unknownIdentityGeometryMayBeInventedByImageModel !== false) fail(`${contract.id}: identity invention guard weakened in output`);
  if (exported.candidateAppearanceDetailCreatesCanon !== false) fail(`${contract.id}: candidate canon guard weakened`);
  if (!exported.authorityOrder.includes('docs/visual/all-character-identity-production-master-v1.md')) fail(`${contract.id}: identity master missing from authority order`);
  if (!exported.prompt.includes('ALL CHARACTER IDENTITY PRODUCTION MASTER — FINAL FACE/BODY AUTHORITY.')) fail(`${contract.id}: identity prompt block missing`);
  if (!exported.prompt.includes('CHARACTER-SPECIFIC APPEARANCE GENERATION CONTRACT — REQUIRED EXACT SOURCE.')) fail(`${contract.id}: exact source prompt block missing`);
}

console.log(`[all-character-identity-production] OK: ${characterAppearanceGenerationContracts.length}/36 exact appearance contracts embedded in final production prompts`);
