import fs from 'node:fs';
import {
  CURRENT21_SEASON_ASSIGNMENTS,
  FUTURE15_SEASON_ASSIGNMENTS,
} from '../../src/game/data/seasonArchitecture.ts';
import { sakumeiCandidateMembers } from '../../src/game/data/sakumeiCandidateSource.ts';
import { S2_ANTAGONIST_WORKING_MEMBERS } from '../../src/game/data/s2AntagonistTeamCandidate.ts';
import {
  S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES,
  S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES,
  s2AntagonistEnsembleDepthSummary,
} from '../../src/game/data/s2AntagonistEnsembleDepthCandidate.ts';
import { S1_S2_REUNION_CANDIDATES } from '../../src/game/data/seasonAntagonistReturnPolicy.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function normalizeCallName(value: string): string {
  return value.normalize('NFKC').replace(/[\s・･]/gu, '').toLocaleLowerCase('ja-JP');
}

for (const path of [
  'docs/s2-antagonist-team-candidate-v1.md',
  'docs/s2-antagonist-ensemble-depth-candidate-v1.md',
  'docs/season-antagonist-return-policy-v1.md',
  'src/game/data/seasonArchitecture.ts',
  'src/game/data/sakumeiCandidateSource.ts',
  'src/game/data/s2AntagonistTeamCandidate.ts',
  'src/game/data/s2AntagonistEnsembleDepthCandidate.ts',
  'src/game/data/seasonAntagonistReturnPolicy.ts',
]) {
  assert(fs.existsSync(path), `missing S2 ensemble depth source: ${path}`);
}

const depthDoc = fs.readFileSync('docs/s2-antagonist-ensemble-depth-candidate-v1.md', 'utf8');

assert(S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.status === 'CANDIDATE_NOT_CANON', 'S2 ensemble depth must remain Candidate');
assert(!S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.exactAgeFrozen, 'S2 exact age unexpectedly frozen');
assert(!S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.exactGenderIdentityFrozen, 'S2 exact gender identity unexpectedly frozen');
assert(!S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.exactRealityEraFrozen, 'S2 exact Reality Era unexpectedly frozen');
assert(!S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.exactBirthplaceFrozen, 'S2 exact birthplace unexpectedly frozen');
assert(!S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.exactHometownFrozen, 'S2 exact hometown unexpectedly frozen');
assert(!S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.exactOccupationFrozen, 'S2 exact occupation unexpectedly frozen');
assert(!S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.exactDialectLexiconFrozen, 'S2 exact dialect lexicon unexpectedly frozen');
assert(!S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.exactFamilyRelationsFrozen, 'S2 exact family relations unexpectedly frozen');
assert(!S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.exactRomanceRelationsFrozen, 'S2 exact romance relations unexpectedly frozen');
assert(!S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.finalVisualMasterApproved, 'S2 final visual master unexpectedly approved');
assert(!S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.rootCandidateExplainsPersonalityByStereotype, 'regional root may not stereotype personality');
assert(!S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.bodyTypeEncodesMorality, 'body type may not encode morality');
assert(!S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.roleAutomaticallyDeterminesOccupation, 'antagonist lane may not auto-determine occupation');
assert(S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.dialectRequiresRootAndEraResearchBeforeLexiconLock, 'dialect must wait for root + Era research');
assert(!S2_ANTAGONIST_ENSEMBLE_DEPTH_RULES.runtimeAutoPromotionAllowed, 'S2 ensemble depth may not auto-promote runtime');

assert(s2AntagonistEnsembleDepthSummary.candidateCount === 8, 'S2 ensemble depth candidate count drift');
assert(s2AntagonistEnsembleDepthSummary.uniqueIdCount === 8, 'S2 ensemble depth IDs must remain unique');
assert(s2AntagonistEnsembleDepthSummary.uniqueCallNameCount === 8, 'S2 ensemble depth names must remain unique');
assert(s2AntagonistEnsembleDepthSummary.uniqueSilhouetteCount === 8, 'S2 ensemble needs eight distinct silhouette lanes');
assert(s2AntagonistEnsembleDepthSummary.uniqueFormerS1ContrastCount === 8, 'S2 ensemble should distribute first S1 contrasts across all eight Sakuyaza members');
assert(s2AntagonistEnsembleDepthSummary.regionalRootCandidateCount >= 12, 'S2 ensemble regional root alternatives are too concentrated');
assert(s2AntagonistEnsembleDepthSummary.everyMemberHasTwoRelationshipSeeds, 'every S2 ensemble candidate needs exactly two internal relationship seeds');
assert(s2AntagonistEnsembleDepthSummary.everyMemberHasFoodPartyHook, 'every S2 ensemble candidate needs an ordinary food/Party hook');
assert(s2AntagonistEnsembleDepthSummary.everyDialectLexiconOpen, 'dialect lexicon must remain Open until root + Era research');
assert(s2AntagonistEnsembleDepthSummary.everyExactIdentityOpen, 'exact S2 identity fields must remain Open');
assert(!s2AntagonistEnsembleDepthSummary.runtimeAutoPromotionAllowed, 'S2 ensemble summary may not auto-promote runtime');

const workingById = new Map(S2_ANTAGONIST_WORKING_MEMBERS.map((entry) => [entry.id, entry]));
const depthById = new Map(S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES.map((entry) => [entry.id, entry]));
assert(workingById.size === depthById.size, 'S2 basic roster and ensemble depth roster size drift');
for (const [id, working] of workingById) {
  const depth = depthById.get(id);
  assert(depth, `missing ensemble depth candidate for ${id}`);
  assert(depth.callName === working.callName, `S2 ensemble depth call-name drift for ${id}`);
}
for (const id of depthById.keys()) {
  assert(workingById.has(id), `ensemble depth introduced unknown S2 member ${id}`);
}

const current21Names = CURRENT21_SEASON_ASSIGNMENTS.map((entry) => entry.name);
const future15Names = FUTURE15_SEASON_ASSIGNMENTS.map((entry) => entry.name);
const sakuyazaNames = sakumeiCandidateMembers.map((entry) => entry.callName);
assert(CURRENT21_SEASON_ASSIGNMENTS.length === 21, 'Current21 roster count drift');
assert(FUTURE15_SEASON_ASSIGNMENTS.length === 15, 'Future15 roster count drift');
assert(sakumeiCandidateMembers.length === 8, 'Sakuyaza roster count drift');

const protectedNormalizedNames = new Map<string, string>();
for (const name of [...current21Names, ...future15Names, ...sakuyazaNames]) {
  const normalized = normalizeCallName(name);
  assert(!protectedNormalizedNames.has(normalized), `protected roster normalized call-name collision: ${name} / ${protectedNormalizedNames.get(normalized)}`);
  protectedNormalizedNames.set(normalized, name);
}

const seenS2NormalizedNames = new Set<string>();
for (const entry of S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES) {
  const normalized = normalizeCallName(entry.callName);
  assert(!protectedNormalizedNames.has(normalized), `S2 call name collides with Current21/Future15/Sakuyaza after normalization: ${entry.callName}`);
  assert(!seenS2NormalizedNames.has(normalized), `S2 normalized call-name collision: ${entry.callName}`);
  seenS2NormalizedNames.add(normalized);

  assert(entry.regionalRootCandidates.length === 2, `S2 candidate needs two regional-root alternatives: ${entry.callName}`);
  assert(entry.regionalRootCandidates[0] !== entry.regionalRootCandidates[1], `regional-root alternatives must differ: ${entry.callName}`);
  assert(entry.dialectLeakTriggers.length === 3, `S2 candidate needs three dialect-leak triggers: ${entry.callName}`);
  assert(!entry.exactDialectLexiconFrozen, `dialect lexicon frozen prematurely: ${entry.callName}`);
  assert(!entry.exactAgeFrozen && !entry.exactGenderIdentityFrozen && !entry.exactRealityEraFrozen && !entry.exactHometownFrozen, `exact identity frozen prematurely: ${entry.callName}`);
  assert(entry.foodPartyHook.length > 20, `food/Party hook too thin: ${entry.callName}`);
  assert(entry.internalRelationshipSeeds.length === 2, `internal relationship seed count drift: ${entry.callName}`);
}

const allS2Ids = new Set(S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES.map((entry) => entry.id));
const relationshipEdges = new Set(
  S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES.flatMap((entry) =>
    entry.internalRelationshipSeeds.map((seed) => `${entry.id}->${seed.withId}`),
  ),
);
for (const entry of S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES) {
  for (const seed of entry.internalRelationshipSeeds) {
    assert(allS2Ids.has(seed.withId), `unknown internal relationship target: ${entry.callName} -> ${seed.withId}`);
    assert(seed.withId !== entry.id, `self relationship seed forbidden: ${entry.callName}`);
    assert(seed.lane.length > 10, `relationship lane too thin: ${entry.callName} -> ${seed.withId}`);
    assert(relationshipEdges.has(`${seed.withId}->${entry.id}`), `relationship seed must currently be reciprocal for review clarity: ${entry.id} -> ${seed.withId}`);
  }
}

const sakuyazaNameSet = new Set(sakuyazaNames);
const formerContrastNames = new Set<string>();
for (const entry of S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES) {
  assert(sakuyazaNameSet.has(entry.formerS1ContrastMember), `unknown former S1 contrast member: ${entry.callName}/${entry.formerS1ContrastMember}`);
  assert(!formerContrastNames.has(entry.formerS1ContrastMember), `former S1 contrast reused as first anchor: ${entry.formerS1ContrastMember}`);
  formerContrastNames.add(entry.formerS1ContrastMember);
}

const returnPairs = new Set(S1_S2_REUNION_CANDIDATES.map((entry) => `${entry.s1Member}->${entry.s2Candidate}`));
for (const entry of S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES) {
  assert(returnPairs.has(`${entry.formerS1ContrastMember}->${entry.callName}`), `ensemble-depth former contrast drifted from return-policy pair: ${entry.formerS1ContrastMember}/${entry.callName}`);
}

assert(depthDoc.includes('NOT CANON') && depthDoc.includes('HUMAN REVIEW REQUIRED'), 'ensemble depth doc must clearly remain non-Canon');
assert(depthDoc.includes('Current21 = 21') && depthDoc.includes('Future15 = 15') && depthDoc.includes('S1 朔夜座 = 8'), 'ensemble depth doc must document collision-audit scope');
assert(depthDoc.includes('exact call-name collisionなし'), 'ensemble depth doc must record current collision result');
assert(depthDoc.includes('body type != morality'), 'ensemble depth doc must guard body-type morality coding');
assert(depthDoc.includes('方言') && depthDoc.includes('一次資料 / 方言資料'), 'ensemble depth doc must defer exact dialect wording to source research');
assert(depthDoc.includes('Former Sakuyaza return matrix'), 'ensemble depth doc must carry former-enemy contrast anchors');
assert(depthDoc.includes('Party appearance != forgiveness'), 'ensemble depth doc must preserve return != forgiveness boundary');

console.log(JSON.stringify({
  current21: CURRENT21_SEASON_ASSIGNMENTS.length,
  future15: FUTURE15_SEASON_ASSIGNMENTS.length,
  sakuyaza: sakumeiCandidateMembers.length,
  s2Candidates: s2AntagonistEnsembleDepthSummary.candidateCount,
  normalizedNameCollisions: 0,
  uniqueSilhouettes: s2AntagonistEnsembleDepthSummary.uniqueSilhouetteCount,
  regionalRootCandidateCount: s2AntagonistEnsembleDepthSummary.regionalRootCandidateCount,
  relationshipSeedEdges: relationshipEdges.size,
  formerS1ContrastCount: formerContrastNames.size,
  exactIdentityFrozen: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
