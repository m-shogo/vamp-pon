import fs from 'node:fs';
import {
  SAKUYAZA_CURRENT_IDENTITY,
  sakumeiCandidateMembers,
  sakuyazaCurrentSummary,
} from '../../src/game/data/sakumeiCandidateSource.ts';
import {
  SAKUYAZA_ERA_INCIDENT_RULES,
  SAKUYAZA_MEMBER_IDS,
  SAKUYAZA_ERA_INCIDENT_STANCES,
  SAKUYAZA_INCIDENT_PAIR_CANDIDATES,
  sakuyazaEraIncidentStanceSummary,
} from '../../src/game/data/sakuyazaEraIncidentStance.ts';
import { ERA_MAJOR_INCIDENTS } from '../../src/game/data/eraMajorIncidentFamilyLens.ts';
import { SAKUYAZA_SEASON_FOCUS } from '../../src/game/data/seasonArchitecture.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const read = (path: string) => fs.readFileSync(path, 'utf8');
const mustExist = (path: string) => assert(fs.existsSync(path), `missing Sakuyaza stance source: ${path}`);

const required = [
  'docs/sakuyaza-current-identity-v1.md',
  'docs/sakuyaza-era-incident-stance-matrix-v1.md',
  'docs/era-major-incident-family-lens-atlas-v1.md',
  'docs/era-incident-evidence-supporting-cast-matrix-v1.md',
  'src/game/data/sakumeiCandidateSource.ts',
  'src/game/data/sakuyazaEraIncidentStance.ts',
  'src/game/data/seasonArchitecture.ts',
] as const;
required.forEach(mustExist);

const identityDoc = read('docs/sakuyaza-current-identity-v1.md');
const stanceDoc = read('docs/sakuyaza-era-incident-stance-matrix-v1.md');
const incidentDoc = read('docs/era-major-incident-family-lens-atlas-v1.md');

assert(SAKUYAZA_CURRENT_IDENTITY.formalName === '朔夜座', 'Current formal identity must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.currentMemberCount === 8, 'Sakuyaza Current member count must remain 8');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedAbsoluteLeaderRequired, 'Sakuyaza must not require a fixed absolute leader');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedHierarchyWithGunjoZankyoroKu, 'Sakuyaza/Gunjo hierarchy must remain unfrozen');
assert(sakuyazaCurrentSummary.memberCount === 8 && sakuyazaCurrentSummary.uniqueCallNameCount === 8, 'Sakuyaza source must retain 8 unique members');
assert(sakuyazaCurrentSummary.uniqueAttachmentLaneCount === 8, 'all eight Sakuyaza members must retain distinct attachment lanes');
assert(sakuyazaCurrentSummary.allFinalMastersUnapproved, 'Sakuyaza final visual masters must remain unapproved');

assert(!SAKUYAZA_ERA_INCIDENT_RULES.stanceImpliesRealityPresence, 'stance may not imply Reality presence');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.stanceImpliesCombatBoss, 'stance may not imply combat Boss');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.stanceImpliesOfficialMission, 'stance may not imply official mission');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.pairCandidateImpliesPermanentPair, 'incident pair candidate may not imply permanent pair');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.pairCandidateImpliesRomance, 'incident pair candidate may not imply romance');
assert(SAKUYAZA_ERA_INCIDENT_RULES.oneMemberMayActPersonallyWithoutOfficialMission, 'personal action lane must remain available');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.allMembersMustShareOneIncidentPosition, 'Sakuyaza may not become one ideological block');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.fixedAbsoluteLeaderRequired, 'stance source may not create an absolute leader');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.gunjoMembershipFrozenByStance, 'stance may not freeze Gunjo membership');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.exactRealityPresenceFrozen, 'exact Reality presence must remain Open');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.officialMissionCountFrozen, 'official mission count must remain Open');
assert(SAKUYAZA_ERA_INCIDENT_RULES.permanentPairCountFrozen && SAKUYAZA_ERA_INCIDENT_RULES.permanentPairCount === 0, 'permanent pair count must remain zero');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.runtimeAutoPromotionAllowed, 'Sakuyaza stance source may not auto-promote runtime');

assert(sakuyazaEraIncidentStanceSummary.incidentCount === 5, 'Sakuyaza stance matrix must cover five Era incidents');
assert(sakuyazaEraIncidentStanceSummary.memberCount === 8 && sakuyazaEraIncidentStanceSummary.uniqueMemberCount === 8, 'Sakuyaza stance matrix must retain eight members');
assert(sakuyazaEraIncidentStanceSummary.totalStanceCount === 40, 'expected 8 x 5 = 40 philosophical stance slots');
assert(sakuyazaEraIncidentStanceSummary.uniqueStanceMemberCount === 8, 'all eight members must appear in stance slots');
assert(sakuyazaEraIncidentStanceSummary.incidentsWithAllEightStances === 5, 'all five incidents need eight stance analyses');
assert(sakuyazaEraIncidentStanceSummary.primaryIncidentPairCandidateCount === 5, 'each incident needs one primary pair candidate');
assert(sakuyazaEraIncidentStanceSummary.permanentPairCount === 0, 'incident pair candidates may not create permanent pairs');
assert(!sakuyazaEraIncidentStanceSummary.exactOfficialMissionCountFrozen, 'official mission count must remain Open');
assert(!sakuyazaEraIncidentStanceSummary.exactRealityPresenceFrozen, 'Reality presence count must remain Open');
assert(sakuyazaEraIncidentStanceSummary.allPresenceUnrequired, 'all stance slots must keep presenceRequired=false');
assert(sakuyazaEraIncidentStanceSummary.allIncidentsHaveCounterOrMitigation, 'every incident must have a Sakuyaza counter/mitigation possibility');
assert(!sakuyazaEraIncidentStanceSummary.runtimeAutoPromotionAllowed, 'stance summary may not auto-promote runtime');

const currentMemberNames = new Set(sakumeiCandidateMembers.map((member) => member.callName));
assert(SAKUYAZA_MEMBER_IDS.length === 8 && new Set(SAKUYAZA_MEMBER_IDS).size === 8, 'Sakuyaza member ID projection must remain 8 unique names');
for (const member of SAKUYAZA_MEMBER_IDS) assert(currentMemberNames.has(member), `unknown Sakuyaza member in stance source: ${member}`);

const expectedIncidentIds = new Set(ERA_MAJOR_INCIDENTS.map((incident) => incident.id));
for (const incident of SAKUYAZA_ERA_INCIDENT_STANCES) {
  assert(expectedIncidentIds.has(incident.incidentId), `unknown Era incident in Sakuyaza stance matrix: ${incident.incidentId}`);
  assert(incident.memberStances.length === 8, `incident must analyze all eight member stances: ${incident.incidentId}`);
  assert(new Set(incident.memberStances.map((stance) => stance.member)).size === 8, `duplicate/missing member stance: ${incident.incidentId}`);
  for (const stance of incident.memberStances) {
    assert(currentMemberNames.has(stance.member), `unknown member ${stance.member} in ${incident.incidentId}`);
    assert(!stance.presenceRequired, `stance unexpectedly requires presence: ${incident.incidentId}/${stance.member}`);
    assert(stance.direction.length > 10, `stance direction too weak: ${incident.incidentId}/${stance.member}`);
  }
  assert(incident.counterOrMitigationMembers.length >= 1, `incident lacks counter/mitigation member: ${incident.incidentId}`);
  for (const member of incident.counterOrMitigationMembers) assert(currentMemberNames.has(member), `unknown counter member ${member}`);
  assert(incident.primaryPairCandidate.members.length === 2, `pair candidate must contain two members: ${incident.incidentId}`);
  assert(new Set(incident.primaryPairCandidate.members).size === 2, `pair candidate cannot duplicate member: ${incident.incidentId}`);
  assert(!incident.primaryPairCandidate.officialMissionFrozen, `pair candidate may not freeze official mission: ${incident.incidentId}`);
  assert(!incident.primaryPairCandidate.permanentPair, `pair candidate may not become permanent: ${incident.incidentId}`);
}

assert(new Set(SAKUYAZA_INCIDENT_PAIR_CANDIDATES.map((pair) => pair.id)).size === 5, 'primary incident pair IDs must be unique');
const expectedPairs = new Map([
  ['ERA-INC-TOMORI-01', ['アサトジ', 'ツグリ']],
  ['ERA-INC-MICHIRU-01', ['ミチグレ', 'ツグリ']],
  ['ERA-INC-NAGI-01', ['オリネ', 'ペタ']],
  ['ERA-INC-YUI-01', ['ハクマ', 'ペタ']],
  ['ERA-INC-ASA-01', ['ナシロ', 'ツグリ']],
]);
for (const incident of SAKUYAZA_ERA_INCIDENT_STANCES) {
  const expectedPair = expectedPairs.get(incident.incidentId);
  assert(expectedPair, `missing expected pair fixture: ${incident.incidentId}`);
  assert(incident.primaryPairCandidate.members[0] === expectedPair[0] && incident.primaryPairCandidate.members[1] === expectedPair[1], `primary pair candidate drift: ${incident.incidentId}`);
}

const primaryOrCounterCounts = new Map<string, number>();
for (const incident of SAKUYAZA_ERA_INCIDENT_STANCES) {
  for (const stance of incident.memberStances) {
    if (stance.resonance === 'PRIMARY_RESONANCE' || stance.resonance === 'COUNTER_RESONANCE' || stance.resonance === 'AMBIVALENT') {
      primaryOrCounterCounts.set(stance.member, (primaryOrCounterCounts.get(stance.member) ?? 0) + 1);
    }
  }
}
for (const member of SAKUYAZA_MEMBER_IDS) assert((primaryOrCounterCounts.get(member) ?? 0) >= 1, `member lacks meaningful primary/counter stance: ${member}`);

const s1Focus = new Set(SAKUYAZA_SEASON_FOCUS.season1HeavierMembers);
const s2Focus = new Set(SAKUYAZA_SEASON_FOCUS.season2HeavierMembers);
assert(s1Focus.size === 4 && ['ナシロ', 'ハクマ', 'ペタ', 'オリネ'].every((name) => s1Focus.has(name)), 'S1 Sakuyaza focus drift');
assert(s2Focus.size === 4 && ['アサトジ', 'ミチグレ', 'ツグリ', 'ユラネ'].every((name) => s2Focus.has(name)), 'S2 Sakuyaza focus drift');
for (const member of [...s1Focus, ...s2Focus]) assert(currentMemberNames.has(member), `Season focus references unknown member: ${member}`);

const nagi = SAKUYAZA_ERA_INCIDENT_STANCES.find((entry) => entry.incidentId === 'ERA-INC-NAGI-01');
const yui = SAKUYAZA_ERA_INCIDENT_STANCES.find((entry) => entry.incidentId === 'ERA-INC-YUI-01');
const asa = SAKUYAZA_ERA_INCIDENT_STANCES.find((entry) => entry.incidentId === 'ERA-INC-ASA-01');
const michiru = SAKUYAZA_ERA_INCIDENT_STANCES.find((entry) => entry.incidentId === 'ERA-INC-MICHIRU-01');
const tomori = SAKUYAZA_ERA_INCIDENT_STANCES.find((entry) => entry.incidentId === 'ERA-INC-TOMORI-01');
assert(nagi?.memberStances.find((stance) => stance.member === 'オリネ')?.resonance === 'PRIMARY_RESONANCE', 'Orine must strongly resonate with Nagi hidden-context incident');
assert(nagi?.memberStances.find((stance) => stance.member === 'ペタ')?.resonance === 'PRIMARY_RESONANCE', 'Petta must strongly resonate with Nagi label propagation incident');
assert(yui?.memberStances.find((stance) => stance.member === 'ハクマ')?.resonance === 'PRIMARY_RESONANCE', 'Hakuma must strongly resonate with Yui blanked uncertainty incident');
assert(yui?.memberStances.find((stance) => stance.member === 'ユラネ')?.resonance === 'COUNTER_RESONANCE', 'Yurane must retain counter/care potential in Yui incident');
assert(asa?.memberStances.find((stance) => stance.member === 'ナシロ')?.resonance === 'PRIMARY_RESONANCE', 'Nashiro must strongly resonate with Asa identity continuity incident');
assert(michiru?.memberStances.find((stance) => stance.member === 'ミチグレ')?.resonance === 'PRIMARY_RESONANCE', 'Michigure must strongly resonate with Michiru route incident');
assert(tomori?.memberStances.find((stance) => stance.member === 'ツグリ')?.resonance === 'PRIMARY_RESONANCE', 'Tsuguri must strongly resonate with Tomori repair/record incident');

assert(identityDoc.includes('Current 8member assets') && identityDoc.includes('全員を同じ黒服'), 'Current identity must preserve eight-member distinctness');
assert(identityDoc.includes('固定上下関係はない'), 'Sakuyaza/Gunjo fixed hierarchy must remain forbidden');
assert(stanceDoc.includes('Presence != stance'), 'human stance matrix must distinguish presence from stance');
assert(stanceDoc.includes('pair candidate` != `permanent pair'), 'human stance matrix must distinguish incident pair from permanent pair');
assert(stanceDoc.includes('アサトジ × ツグリ') && stanceDoc.includes('ミチグレ × ツグリ') && stanceDoc.includes('オリネ × ペタ') && stanceDoc.includes('ハクマ × ペタ') && stanceDoc.includes('ナシロ × ツグリ'), 'human stance matrix must preserve five primary incident pair candidates');
assert(stanceDoc.includes('all five incidents have at least one member who can **oppose or mitigate**') || stanceDoc.includes('all five incidents have at least one member'), 'human stance matrix must preserve counter/mitigation rule');
assert(stanceDoc.includes('permanent pair count stays 0'), 'human stance matrix must preserve zero permanent pairs');
assert(incidentDoc.includes('SakuyazaRelation') && incidentDoc.includes('MULTIPLE_MEMBERS_DIFFER'), 'Era incident Atlas must preserve multi-member disagreement');

console.log(JSON.stringify({
  formalName: SAKUYAZA_CURRENT_IDENTITY.formalName,
  members: sakuyazaEraIncidentStanceSummary.memberCount,
  incidents: sakuyazaEraIncidentStanceSummary.incidentCount,
  stanceSlots: sakuyazaEraIncidentStanceSummary.totalStanceCount,
  incidentPairCandidates: sakuyazaEraIncidentStanceSummary.primaryIncidentPairCandidateCount,
  permanentPairs: sakuyazaEraIncidentStanceSummary.permanentPairCount,
  allHaveCounterOrMitigation: sakuyazaEraIncidentStanceSummary.allIncidentsHaveCounterOrMitigation,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
