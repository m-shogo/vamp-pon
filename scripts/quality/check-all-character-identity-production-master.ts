import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { characterAppearanceGenerationContracts } from '../../src/game/data/characterAppearanceGenerationContracts.ts';

const root = process.cwd();
const masterPath = 'data/visual/all-character-identity-production-master-v1.json';
const exporterPath = 'tools/asset-factory/scripts/export-final-character-design-prompt.ts';
const livingPaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

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
if (new Set(characterAppearanceGenerationContracts.map((x) => x.id)).size !== 36) fail('appearance contract IDs are not unique');

for (const contract of characterAppearanceGenerationContracts) {
  for (const field of master.requiredFields) if (!(field in contract)) fail(`${contract.id}: missing required source field ${field}`);
  if (!contract.faceSignatureId) fail(`${contract.id}: faceSignatureId missing`);
  if (!contract.bodyShape) fail(`${contract.id}: bodyShape missing`);
  if (!Array.isArray(contract.forbiddenDrift) || contract.forbiddenDrift.length < 1) fail(`${contract.id}: forbiddenDrift missing`);
  if (contract.nearestExistingFace && !contract.differenceFromNearest) fail(`${contract.id}: nearest-face difference missing`);
}

const livingProfiles: any[] = [];
for (const path of livingPaths) {
  const doc = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  for (const profile of doc.characters ?? []) livingProfiles.push({ ...profile, __path: path });
}
if (livingProfiles.length !== 36 || new Set(livingProfiles.map((p) => p.id)).size !== 36) fail('expected 36 unique production Living Visual IDs');

const usedContractIds = new Set<string>();
for (const profile of livingProfiles) {
  const direct = characterAppearanceGenerationContracts.find((entry) => entry.id === profile.id);
  const byName = characterAppearanceGenerationContracts.filter((entry) => entry.displayName === profile.name);
  if (!direct && byName.length !== 1) fail(`${profile.id}: expected one Appearance Contract by displayName ${profile.name}, got ${byName.length}`);
  const expected = direct ?? byName[0];
  if (!expected) fail(`${profile.id}: expected appearance contract missing`);
  usedContractIds.add(expected.id);

  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, exporterPath),
    '--character', profile.id, '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 24 * 1024 * 1024 });
  const exported = JSON.parse(stdout);
  if (exported.finalCharacterDesignProductionEntrypoint !== true) fail(`${profile.id}: final production entrypoint missing`);
  if (exported.allCharacterIdentityProductionRequired !== true) fail(`${profile.id}: identity master not required`);
  if (!exported.appearanceGenerationContract || exported.appearanceGenerationContract.id !== expected.id) fail(`${profile.id}: exact appearance contract mismatch`);
  if (exported.appearanceGenerationContractProductionId !== profile.id) fail(`${profile.id}: production ID bridge missing`);
  if (exported.appearanceGenerationContract.faceSignatureId !== expected.faceSignatureId) fail(`${profile.id}: face signature mismatch`);
  const expectedResolution = direct ? 'DIRECT_ID' : 'LIVING_DISPLAY_NAME_BRIDGE';
  if (exported.appearanceGenerationContractResolution !== expectedResolution) fail(`${profile.id}: contract resolution mismatch`);
  if (exported.unknownIdentityGeometryMayBeInventedByImageModel !== false) fail(`${profile.id}: identity invention guard weakened in output`);
  if (exported.candidateAppearanceDetailCreatesCanon !== false) fail(`${profile.id}: candidate canon guard weakened`);
  if (!exported.authorityOrder.includes('docs/visual/all-character-identity-production-master-v1.md')) fail(`${profile.id}: identity master missing from authority order`);
  if (!exported.prompt.includes('ALL CHARACTER IDENTITY PRODUCTION MASTER — FINAL FACE/BODY AUTHORITY.')) fail(`${profile.id}: identity prompt block missing`);
  if (!exported.prompt.includes('CHARACTER-SPECIFIC APPEARANCE GENERATION CONTRACT — REQUIRED EXACT SOURCE.')) fail(`${profile.id}: exact source prompt block missing`);
}

if (usedContractIds.size !== 36) fail(`production bridge covers ${usedContractIds.size}/36 appearance contracts`);
console.log(`[all-character-identity-production] OK: 36/36 production IDs bridge to exact Appearance Generation Contracts`);
