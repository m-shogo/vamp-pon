import fs from 'node:fs';
import { CURRENT21_SEASON_ASSIGNMENTS } from '../../src/game/data/seasonArchitecture.ts';
import { S2_ANTAGONIST_WORKING_MEMBERS } from '../../src/game/data/s2AntagonistTeamCandidate.ts';
import { S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES } from '../../src/game/data/s2AntagonistEnsembleDepthCandidate.ts';
import { sakumeiCandidateMembers } from '../../src/game/data/sakumeiCandidateSource.ts';
import { S1_S2_REUNION_CANDIDATES } from '../../src/game/data/seasonAntagonistReturnPolicy.ts';
import {
  S2_ANTAGONIST_SCENE_CHEMISTRY_RULES,
  S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES,
  S2_ANTAGONIST_INTERNAL_RELATIONSHIP_ARCS,
  s2AntagonistSceneChemistrySummary,
} from '../../src/game/data/s2AntagonistSceneChemistryCandidate.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const requiredFiles = [
  'docs/s2-antagonist-team-candidate-v1.md',
  'docs/s2-antagonist-ensemble-depth-candidate-v1.md',
  'docs/s2-antagonist-scene-chemistry-candidate-v1.md',
  'docs/s2-antagonist-micro-scene-reservoir-v1.md',
  'docs/season-antagonist-return-policy-v1.md',
  'docs/season-2-3-overseas-culture-constellation-memory.md',
  'docs/00-current-story-world-master-yui-profile-amendment.md',
  'src/game/data/s2AntagonistSceneChemistryCandidate.ts',
];
for (const path of requiredFiles) assert(fs.existsSync(path), `missing S2 chemistry source: ${path}`);

assert(S2_ANTAGONIST_SCENE_CHEMISTRY_RULES.status === 'CANDIDATE_NOT_CANON', 'scene chemistry must remain Candidate');
assert(!S2_ANTAGONIST_SCENE_CHEMISTRY_RULES.finalFirstAppearanceOrderFrozen, 'first appearance order must remain Open');
assert(!S2_ANTAGONIST_SCENE_CHEMISTRY_RULES.exactAllianceOutcomesFrozen, 'alliance outcomes must remain Open');
assert(!S2_ANTAGONIST_SCENE_CHEMISTRY_RULES.exactFamilyRelationsFrozen, 'family relations must remain Open');
assert(!S2_ANTAGONIST_SCENE_CHEMISTRY_RULES.exactRomanceRelationsFrozen, 'romance relations must remain Open');
assert(!S2_ANTAGONIST_SCENE_CHEMISTRY_RULES.exactRealityOriginsFrozen, 'Reality origins must remain Open');
assert(!S2_ANTAGONIST_SCENE_CHEMISTRY_RULES.exactCountriesFrozen, 'countries must remain Open');
assert(!S2_ANTAGONIST_SCENE_CHEMISTRY_RULES.exactNationalitiesFrozen, 'nationalities must remain Open');
assert(!S2_ANTAGONIST_SCENE_CHEMISTRY_RULES.exactLanguagesFrozen, 'languages must remain Open');
assert(!S2_ANTAGONIST_SCENE_CHEMISTRY_RULES.exactOccupationsFrozen, 'occupations must remain Open');
assert(!S2_ANTAGONIST_SCENE_CHEMISTRY_RULES.exactGenderIdentitiesFrozen, 'gender identities must remain Open');
assert(!S2_ANTAGONIST_SCENE_CHEMISTRY_RULES.s1JapanIncidentRequiresJapaneseOrigin, 'Japan incident must not imply Japanese origin');
assert(S2_ANTAGONIST_SCENE_CHEMISTRY_RULES.overseasOrMultiCountryRootsAllowedInS2, 'S2 overseas/multi-country roots must remain possible');
assert(S2_ANTAGONIST_SCENE_CHEMISTRY_RULES.originMustComeFromLifeHistoryNotAppearance, 'origin must derive from life history, not appearance');
assert(!S2_ANTAGONIST_SCENE_CHEMISTRY_RULES.runtimeAutoPromotionAllowed, 'scene reservoir may not auto-promote runtime');

const teamById = new Map(S2_ANTAGONIST_WORKING_MEMBERS.map((entry) => [entry.id, entry.callName]));
const depthById = new Map(S2_ANTAGONIST_ENSEMBLE_DEPTH_CANDIDATES.map((entry) => [entry.id, entry.callName]));
assert(teamById.size === 8 && depthById.size === 8, 'upstream S2 working roster must remain 8 comparison candidates');
assert(S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.length === 8, 'scene chemistry must cover all 8 working candidates');

for (const entry of S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES) {
  assert(teamById.get(entry.id) === entry.callName, `scene candidate drift from team source: ${entry.id}`);
  assert(depthById.get(entry.id) === entry.callName, `scene candidate drift from ensemble depth: ${entry.id}`);
  assert(entry.core5.length === 2 && new Set(entry.core5).size === 2, `each S2 member needs two distinct Core5 chemistry lanes: ${entry.callName}`);
  assert(entry.scene.startsWith('S2-SCENE-'), `invalid first encounter scene id: ${entry.callName}`);
  assert(entry.party.startsWith('S2-PARTY-'), `invalid party beat id: ${entry.callName}`);
  assert(entry.fracture.startsWith('S2-FRACTURE-'), `invalid trust fracture id: ${entry.callName}`);
  assert(entry.tell.startsWith('S2-TELL-'), `invalid vulnerable tell id: ${entry.callName}`);
  assert(entry.humanHook.startsWith('S2-HOOK-'), `invalid recurring human hook id: ${entry.callName}`);
  assert(entry.lifeShape.length > 20, `life-shape reservoir too thin: ${entry.callName}`);
}

const core5Ids = new Set(CURRENT21_SEASON_ASSIGNMENTS.slice(0, 5).map((entry) => entry.id));
const coveredCore5 = new Set(S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.flatMap((entry) => entry.core5));
assert(coveredCore5.size === 5, 'scene chemistry must cover all Core5');
for (const id of core5Ids) assert(coveredCore5.has(id as never), `missing Core5 chemistry coverage: ${id}`);

assert(s2AntagonistSceneChemistrySummary.uniqueIdCount === 8, 'scene candidate IDs must remain unique');
assert(s2AntagonistSceneChemistrySummary.uniqueSceneCount === 8, 'first encounter scenes must remain distinct');
assert(s2AntagonistSceneChemistrySummary.uniquePartyCount === 8, 'party beats must remain distinct');
assert(s2AntagonistSceneChemistrySummary.coveredCore5Count === 5, 'summary Core5 coverage drift');
assert(s2AntagonistSceneChemistrySummary.uniqueFormerS1Count === 8, 'all Sakuyaza members need distinct first S2 echo anchors');
assert(s2AntagonistSceneChemistrySummary.internalRelationshipArcCount >= 6, 'need at least six strong internal relationship arcs');
assert(!s2AntagonistSceneChemistrySummary.runtimeAutoPromotionAllowed, 'scene chemistry summary may not auto-promote runtime');

const sakuyazaNames = new Set(sakumeiCandidateMembers.map((entry) => entry.callName));
for (const entry of S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES) {
  assert(sakuyazaNames.has(entry.formerS1), `unknown former S1 echo member: ${entry.formerS1}`);
}

const reunionPairs = new Set(S1_S2_REUNION_CANDIDATES.map((entry) => `${entry.s2Candidate}/${entry.s1Member}`));
for (const entry of S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES) {
  assert(reunionPairs.has(`${entry.callName}/${entry.formerS1}`), `scene former-S1 echo drift from return policy: ${entry.callName}/${entry.formerS1}`);
}

const knownIds = new Set(S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.map((entry) => entry.id));
const relationIds = new Set<string>();
for (const relation of S2_ANTAGONIST_INTERNAL_RELATIONSHIP_ARCS) {
  assert(!relationIds.has(relation.id), `duplicate S2 relationship arc id: ${relation.id}`);
  relationIds.add(relation.id);
  assert(relation.members[0] !== relation.members[1], `self relationship arc: ${relation.id}`);
  assert(knownIds.has(relation.members[0]) && knownIds.has(relation.members[1]), `unknown relationship endpoint: ${relation.id}`);
  assert(!relation.resolutionFrozen, `relationship resolution frozen prematurely: ${relation.id}`);
}

const sceneDoc = fs.readFileSync('docs/s2-antagonist-scene-chemistry-candidate-v1.md', 'utf8');
const reservoirDoc = fs.readFileSync('docs/s2-antagonist-micro-scene-reservoir-v1.md', 'utf8');
assert(sceneDoc.includes('HIGH-VALUE CANDIDATE / NOT CANON / OVERWRITE-FRIENDLY'), 'scene doc must advertise overwrite-friendly Candidate status');
assert(sceneDoc.includes('設定は多めに残す。Canonは少なくする。'), 'scene doc must preserve accumulation philosophy');
assert(reservoirDoc.includes('RESERVOIR / NON-CANON / FREE TO REPLACE'), 'micro-scene doc must remain reservoir');
assert(reservoirDoc.includes('Backup antagonist function lanes'), 'micro-scene reservoir needs backup antagonist functions');
assert(reservoirDoc.includes('設定を捨てない。設定を固定しすぎない。'), 'reservoir must preserve overwrite guidance');

console.log(JSON.stringify({
  s2Candidates: S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.length,
  core5Covered: coveredCore5.size,
  uniqueScenes: s2AntagonistSceneChemistrySummary.uniqueSceneCount,
  uniquePartyBeats: s2AntagonistSceneChemistrySummary.uniquePartyCount,
  internalRelationshipArcs: S2_ANTAGONIST_INTERNAL_RELATIONSHIP_ARCS.length,
  formerS1Echoes: s2AntagonistSceneChemistrySummary.uniqueFormerS1Count,
  candidateNotCanon: true,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
