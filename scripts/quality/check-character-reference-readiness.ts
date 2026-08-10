import { existsSync } from 'node:fs';
import { characterDefinitions } from '../../src/game/data/characterDatabase.ts';
import {
  CHARACTER_REFERENCE_PRODUCTION_POLICY,
  characterReferenceProductionQueue,
} from '../../src/game/data/characterReferenceProductionQueue.ts';
import { goldenReferenceSets } from '../../src/game/data/goldenReferenceRegistry.ts';

let failed = false;
const fail = (message: string) => {
  failed = true;
  console.error(`FAIL: ${message}`);
};

const warn = (message: string) => console.warn(`WARN: ${message}`);

const current20Ids = characterDefinitions.map((entry) => entry.id).sort();
const queueIds = characterReferenceProductionQueue.map((entry) => entry.characterId).sort();

if (characterReferenceProductionQueue.length !== CHARACTER_REFERENCE_PRODUCTION_POLICY.expectedCount) {
  fail(`reference queue must contain ${CHARACTER_REFERENCE_PRODUCTION_POLICY.expectedCount} entries; got ${characterReferenceProductionQueue.length}`);
}
if (new Set(queueIds).size !== queueIds.length) fail('duplicate character id in reference queue');
if (JSON.stringify(current20Ids) !== JSON.stringify(queueIds)) {
  fail(`reference queue Current20 coverage drift: db=${current20Ids.join(',')} queue=${queueIds.join(',')}`);
}
if (queueIds.includes('ren')) fail('Reserve Ren must not auto-enter Current20 reference production queue');

const p0Ids = characterReferenceProductionQueue
  .filter((entry) => entry.priority === 'P0')
  .map((entry) => entry.characterId)
  .sort();
if (JSON.stringify(p0Ids) !== JSON.stringify(['hana', 'kage1'])) {
  fail(`P0 reference queue must remain Hana/Kaname first; got ${p0Ids.join(',')}`);
}

const goldenIdentityBySourceId = new Map(
  goldenReferenceSets
    .filter((set) => set.scope === 'character' && set.sourceId)
    .map((set) => [set.sourceId!, set]),
);

const approvedIdentityIds: string[] = [];
const existingExpectedReferenceIds: string[] = [];
const missingExpectedReferenceIds: string[] = [];

for (const entry of characterReferenceProductionQueue) {
  const goldenSet = goldenIdentityBySourceId.get(entry.characterId);
  const hasApprovedIdentity = Boolean(
    goldenSet
      && goldenSet.status === 'approved-style-reference'
      && goldenSet.assets.some((asset) => asset.role === 'identity' && asset.approvedForReference),
  );
  if (hasApprovedIdentity) approvedIdentityIds.push(entry.characterId);

  if (goldenSet?.assets.some((asset) => asset.approvedForRuntime !== false)) {
    fail(`${entry.characterId}: Golden Reference asset must not imply runtime approval`);
  }
  if (goldenSet?.assets.some((asset) => asset.approvedAsFinal === true)) {
    fail(`${entry.characterId}: Golden Reference asset must not imply final approval`);
  }

  const expectedReferenceExists = existsSync(entry.expectedReferenceOutput);
  (expectedReferenceExists ? existingExpectedReferenceIds : missingExpectedReferenceIds).push(entry.characterId);

  if (entry.evidenceState === 'golden_identity_registered') {
    if (!entry.existingMasterPath || !existsSync(entry.existingMasterPath)) {
      fail(`${entry.characterId}: registered identity requires existing master file`);
    }
    if (!hasApprovedIdentity) fail(`${entry.characterId}: queue says registered identity but Golden Registry disagrees`);
  }

  if (entry.evidenceState === 'core5_master_unregistered') {
    if (!entry.existingMasterPath || !existsSync(entry.existingMasterPath)) {
      fail(`${entry.characterId}: Core5 master review state requires existing master file`);
    }
    if (hasApprovedIdentity) {
      fail(`${entry.characterId}: existing master is now Golden-approved; refresh queue state instead of leaving unregistered`);
    }
  }

  if (entry.evidenceState === 'reference_generation_required' && expectedReferenceExists) {
    fail(`${entry.characterId}: expected reference output now exists; refresh queue to review/register state`);
  }

  if (entry.plusSizeHardLock && !['hana', 'kage1'].includes(entry.characterId)) {
    fail(`${entry.characterId}: unexpected plus-size hard lock in production queue`);
  }
  if (['hana', 'kage1'].includes(entry.characterId) && !entry.plusSizeHardLock) {
    fail(`${entry.characterId}: plus-size hard lock lost from production queue`);
  }
}

const expectedGoldenRegistered = [...CHARACTER_REFERENCE_PRODUCTION_POLICY.goldenIdentityRegisteredIds].sort();
approvedIdentityIds.sort();
if (JSON.stringify(approvedIdentityIds) !== JSON.stringify(expectedGoldenRegistered)) {
  fail(`Golden-approved character identity set changed: expected ${expectedGoldenRegistered.join(',')} got ${approvedIdentityIds.join(',')}`);
}

for (const id of CHARACTER_REFERENCE_PRODUCTION_POLICY.core5MasterReviewIds) {
  const entry = characterReferenceProductionQueue.find((candidate) => candidate.characterId === id);
  if (!entry || entry.evidenceState !== 'core5_master_unregistered') {
    fail(`${id}: Core5 existing-master review routing drift`);
  }
}

for (const id of ['hana', 'kage1']) {
  const entry = characterReferenceProductionQueue.find((candidate) => candidate.characterId === id);
  if (!entry || entry.action !== 'generate_reference_then_review' || entry.priority !== 'P0') {
    fail(`${id}: high-risk reference-first routing drift`);
  }
  if (entry.existingMasterPath !== null) {
    warn(`${id}: queue now has an existing master path; consider review-existing route rather than generation`);
  }
}

console.log('Character reference readiness audit');
console.log(`  Current20 queue: ${characterReferenceProductionQueue.length}/20`);
console.log(`  Golden-approved identity refs: ${approvedIdentityIds.length} (${approvedIdentityIds.join(', ') || 'none'})`);
console.log(`  Expected Asset Factory character_reference outputs present: ${existingExpectedReferenceIds.length} (${existingExpectedReferenceIds.join(', ') || 'none'})`);
console.log(`  Expected Asset Factory character_reference outputs missing: ${missingExpectedReferenceIds.length}`);
console.log('  P0 generation: hana, kage1');
console.log('  P1 existing-master review: asa, nagi, michiru, tomori');
console.log('  P1 hard-anchor generation: gen, shiro');
console.log('  Runtime/final approval remains separate from reference readiness.');

if (failed) process.exit(1);
