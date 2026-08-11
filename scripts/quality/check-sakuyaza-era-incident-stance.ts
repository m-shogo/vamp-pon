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
import {
  SERIES_SEASON_RULES,
  SEASON_ANTAGONIST_TEAM_ARCHITECTURE,
  SAKUYAZA_SEASON_FOCUS,
} from '../../src/game/data/seasonArchitecture.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const read = (path: string) => fs.readFileSync(path, 'utf8');
const mustExist = (path: string) => assert(fs.existsSync(path), `missing Sakuyaza stance source: ${path}`);

const required = [
  'docs/sakuyaza-current-identity-v1.md',
  'docs/sakuyaza-era-incident-stance-matrix-v1.md',
  'docs/season-architecture-cast-matrix-v1.md',
  'docs/era-major-incident-family-lens-atlas-v1.md',
  'src/game/data/sakumeiCandidateSource.ts',
  'src/game/data/sakuyazaEraIncidentStance.ts',
  'src/game/data/seasonArchitecture.ts',
] as const;
required.forEach(mustExist);

const identityDoc = read('docs/sakuyaza-current-identity-v1.md');
const stanceDoc = read('docs/sakuyaza-era-incident-stance-matrix-v1.md');
const seasonDoc = read('docs/season-architecture-cast-matrix-v1.md');

assert(SAKUYAZA_CURRENT_IDENTITY.formalName === '朔夜座', 'Season1 formal antagonist team name must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.seasonScope === 'S1', 'Sakuyaza must be scoped to Season1');
assert(SAKUYAZA_CURRENT_IDENTITY.currentMemberCount === 8, 'Season1 Sakuyaza member count must remain 8');
assert(!SAKUYAZA_CURRENT_IDENTITY.seriesWidePrimaryTeam, 'Sakuyaza may not become the series-wide primary antagonist team');
assert(!SAKUYAZA_CURRENT_IDENTITY.laterSeasonPrimaryTeam, 'Sakuyaza may not remain the later-Season primary team');
assert(SAKUYAZA_CURRENT_IDENTITY.laterSeasonIndividualsMayReturn, 'individual Sakuyaza returns should remain possible');
assert(!SAKUYAZA_CURRENT_IDENTITY.laterSeasonFullTeamPrimaryReturnAllowed, 'full Sakuyaza team may not remain primary after S1');
assert(!SAKUYAZA_CURRENT_IDENTITY.season2TeamNameFrozen && !SAKUYAZA_CURRENT_IDENTITY.season2RosterFrozen, 'S2 team name/roster must remain Open');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedAbsoluteLeaderRequired, 'Sakuyaza must not require a fixed absolute leader');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedHierarchyWithGunjoZankyoroKu, 'Sakuyaza/Gunjo hierarchy must remain unfrozen');

assert(sakuyazaCurrentSummary.seasonScope === 'S1', 'Sakuyaza summary must report S1 scope');
assert(sakuyazaCurrentSummary.memberCount === 8 && sakuyazaCurrentSummary.uniqueCallNameCount === 8, 'Sakuyaza source must retain 8 unique members');
assert(sakuyazaCurrentSummary.uniqueAttachmentLaneCount === 8, 'all eight Sakuyaza members must retain distinct attachment lanes');
assert(!sakuyazaCurrentSummary.seriesWidePrimaryTeam, 'summary may not promote Sakuyaza to series-wide team');
assert(!sakuyazaCurrentSummary.laterSeasonFullTeamPrimaryReturnAllowed, 'summary may not allow full-team primary return');
assert(sakuyazaCurrentSummary.allFinalMastersUnapproved, 'Sakuyaza final visual masters must remain unapproved');

assert(SERIES_SEASON_RULES.seasonAntagonistTeamChangesEachSeason, 'primary antagonist team name must change each Season');
assert(SERIES_SEASON_RULES.seasonAntagonistPrimaryRosterChangesEachSeason, 'primary antagonist roster must change each Season');
assert(SERIES_SEASON_RULES.seasonalTeamNameCosmeticRenameOnlyForbidden, 'Season rotation may not be cosmetic rename only');
assert(SERIES_SEASON_RULES.previousSeasonEnemyIndividualsMayReturn, 'previous enemy individuals may return');
assert(!SERIES_SEASON_RULES.previousSeasonFullTeamMayRemainPrimaryAntagonist, 'previous full enemy team may not remain primary');
assert(SERIES_SEASON_RULES.sakuyazaSeasonScope === 'S1', 'Season architecture must scope Sakuyaza to S1');
assert(SERIES_SEASON_RULES.sakuyazaReplacedEachSeason, 'Sakuyaza must rotate out as primary after S1');

const season1Team = SEASON_ANTAGONIST_TEAM_ARCHITECTURE.season1;
const season2Team = SEASON_ANTAGONIST_TEAM_ARCHITECTURE.season2;
assert(season1Team.teamName === '朔夜座' && season1Team.teamNameFrozen, 'S1 team name must be fixed as 朔夜座');
assert(season1Team.rosterFrozen && season1Team.rosterCount === 8 && season1Team.memberNames.length === 8, 'S1 Sakuyaza roster must be fixed at 8');
assert(season2Team.teamName === null && !season2Team.teamNameFrozen, 'S2 team name must remain Open');
assert(!season2Team.rosterFrozen && !season2Team.rosterCountFrozen && season2Team.rosterMustDifferFromPreviousSeason, 'S2 primary roster must be new and Open');
assert(SEASON_ANTAGONIST_TEAM_ARCHITECTURE.shared.cosmeticRenameOnlyForbidden, 'team rotation may not be rename-only');
assert(SEASON_ANTAGONIST_TEAM_ARCHITECTURE.shared.primaryRosterMustChangeEachSeason, 'primary roster must rotate each Season');
assert(SEASON_ANTAGONIST_TEAM_ARCHITECTURE.shared.previousSeasonIndividualsMayReturn, 'individual returns must remain possible');
assert(!SEASON_ANTAGONIST_TEAM_ARCHITECTURE.shared.previousSeasonFullTeamMayRemainPrimary, 'previous full team may not remain primary');

assert(SAKUYAZA_SEASON_FOCUS.seasonScope === 'S1' && !SAKUYAZA_SEASON_FOCUS.recurringAllSeasons, 'legacy Sakuyaza Season export must reflect S1-only scope');
assert(SAKUYAZA_SEASON_FOCUS.s1Roster.length === 8 && SAKUYAZA_SEASON_FOCUS.s2Heavier.length === 0, 'legacy Sakuyaza Season export must not split roster into S2');
assert(!SAKUYAZA_SEASON_FOCUS.seriesWidePrimaryTeam, 'legacy Sakuyaza export may not claim series-wide primary status');

assert(SAKUYAZA_ERA_INCIDENT_RULES.seasonScope === 'S1', 'stance rules must be S1-only');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.stanceImpliesRealityPresence, 'stance may not imply Reality presence');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.stanceImpliesCombatBoss, 'stance may not imply combat Boss');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.stanceImpliesOfficialMission, 'stance may not imply official mission');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.pairCandidateImpliesPermanentPair, 'incident pair candidate may not imply permanent pair');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.pairCandidateImpliesRomance, 'incident pair candidate may not imply romance');
assert(SAKUYAZA_ERA_INCIDENT_RULES.oneMemberMayActPersonallyWithoutOfficialMission, 'personal action lane must remain available');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.allMembersMustShareOneIncidentPosition, 'Sakuyaza may not become one ideological block');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.gunjoMembershipFrozenByStance, 'stance may not freeze Gunjo membership');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.exactRealityPresenceFrozen, 'exact Reality presence must remain Open');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.officialMissionCountFrozen, 'official mission count must remain Open');
assert(SAKUYAZA_ERA_INCIDENT_RULES.permanentPairCountFrozen && SAKUYAZA_ERA_INCIDENT_RULES.permanentPairCount === 0, 'permanent pair count must remain zero');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.season2UsesSamePrimaryTeam && !SAKUYAZA_ERA_INCIDENT_RULES.season2UsesSamePrimaryRoster, 'S2 must use a different primary team/roster');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.season2TeamNameFrozen && !SAKUYAZA_ERA_INCIDENT_RULES.season2RosterFrozen, 'S2 primary team remains Open');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.runtimeAutoPromotionAllowed, 'Sakuyaza stance source may not auto-promote runtime');

assert(sakuyazaEraIncidentStanceSummary.seasonScope === 'S1', 'stance summary must report S1 scope');
assert(sakuyazaEraIncidentStanceSummary.incidentCount === 3, 'Sakuyaza stance matrix must cover the three S1 primary incident lanes');
assert(sakuyazaEraIncidentStanceSummary.memberCount === 8 && sakuyazaEraIncidentStanceSummary.uniqueMemberCount === 8, 'Sakuyaza stance matrix must retain eight members');
assert(sakuyazaEraIncidentStanceSummary.totalStanceCount === 24, 'expected 8 x 3 = 24 S1 stance slots');
assert(sakuyazaEraIncidentStanceSummary.uniqueStanceMemberCount === 8, 'all eight members must appear in S1 stance slots');
assert(sakuyazaEraIncidentStanceSummary.incidentsWithAllEightStances === 3, 'all three S1 incidents need eight stance analyses');
assert(sakuyazaEraIncidentStanceSummary.primaryIncidentPairCandidateCount === 3, 'S1 must have three primary incident pair candidates');
assert(sakuyazaEraIncidentStanceSummary.permanentPairCount === 0, 'incident pair candidates may not create permanent pairs');
assert(sakuyazaEraIncidentStanceSummary.allPresenceUnrequired, 'all stance slots must keep presenceRequired=false');
assert(sakuyazaEraIncidentStanceSummary.allS1IncidentsHaveCounterOrMitigation, 'every S1 incident must have a counter/mitigation possibility');
assert(!sakuyazaEraIncidentStanceSummary.season2UsesSamePrimaryTeam && !sakuyazaEraIncidentStanceSummary.season2UsesSamePrimaryRoster, 'summary must preserve S2 antagonist rotation');
assert(!sakuyazaEraIncidentStanceSummary.runtimeAutoPromotionAllowed, 'stance summary may not auto-promote runtime');

const currentMemberNames = new Set(sakumeiCandidateMembers.map((member) => member.callName));
assert(SAKUYAZA_MEMBER_IDS.length === 8 && new Set(SAKUYAZA_MEMBER_IDS).size === 8, 'Sakuyaza member ID projection must remain 8 unique names');
for (const member of SAKUYAZA_MEMBER_IDS) assert(currentMemberNames.has(member), `unknown Sakuyaza member in stance source: ${member}`);

const expectedS1IncidentIds = new Set(['ERA-INC-NAGI-01', 'ERA-INC-YUI-01', 'ERA-INC-ASA-01']);
const allMajorIncidentIds = new Set(ERA_MAJOR_INCIDENTS.map((incident) => incident.id));
for (const incident of SAKUYAZA_ERA_INCIDENT_STANCES) {
  assert(allMajorIncidentIds.has(incident.incidentId), `unknown Era incident in Sakuyaza stance matrix: ${incident.incidentId}`);
  assert(expectedS1IncidentIds.has(incident.incidentId), `S2 primary incident leaked into S1 Sakuyaza stance matrix: ${incident.incidentId}`);
  assert(incident.memberStances.length === 8, `incident must analyze all eight member stances: ${incident.incidentId}`);
  assert(new Set(incident.memberStances.map((stance) => stance.member)).size === 8, `duplicate/missing member stance: ${incident.incidentId}`);
  for (const stance of incident.memberStances) {
    assert(currentMemberNames.has(stance.member), `unknown member ${stance.member} in ${incident.incidentId}`);
    assert(!stance.presenceRequired, `stance unexpectedly requires presence: ${incident.incidentId}/${stance.member}`);
    assert(stance.direction.length > 10, `stance direction too weak: ${incident.incidentId}/${stance.member}`);
  }
  assert(incident.counterOrMitigationMembers.length >= 1, `incident lacks counter/mitigation member: ${incident.incidentId}`);
  assert(!incident.primaryPairCandidate.officialMissionFrozen && !incident.primaryPairCandidate.permanentPair, `pair candidate boundary drift: ${incident.incidentId}`);
}
assert(!expectedS1IncidentIds.has('ERA-INC-TOMORI-01') && !expectedS1IncidentIds.has('ERA-INC-MICHIRU-01'), 'Tomori/Michiru S2 primaries may not be assigned to S1 Sakuyaza');

assert(new Set(SAKUYAZA_INCIDENT_PAIR_CANDIDATES.map((pair) => pair.id)).size === 3, 'S1 primary incident pair IDs must be three unique IDs');
const expectedPairs = new Map([
  ['ERA-INC-NAGI-01', ['オリネ', 'ペタ']],
  ['ERA-INC-YUI-01', ['ハクマ', 'ペタ']],
  ['ERA-INC-ASA-01', ['ナシロ', 'ツグリ']],
]);
for (const incident of SAKUYAZA_ERA_INCIDENT_STANCES) {
  const expectedPair = expectedPairs.get(incident.incidentId);
  assert(expectedPair, `missing expected S1 pair fixture: ${incident.incidentId}`);
  assert(incident.primaryPairCandidate.members[0] === expectedPair[0] && incident.primaryPairCandidate.members[1] === expectedPair[1], `primary pair candidate drift: ${incident.incidentId}`);
}

const nonLowCounts = new Map<string, number>();
for (const incident of SAKUYAZA_ERA_INCIDENT_STANCES) {
  for (const stance of incident.memberStances) {
    if (stance.resonance !== 'LOW_PRIORITY') nonLowCounts.set(stance.member, (nonLowCounts.get(stance.member) ?? 0) + 1);
  }
}
for (const member of SAKUYAZA_MEMBER_IDS) assert((nonLowCounts.get(member) ?? 0) >= 1, `member lacks meaningful S1 stance: ${member}`);

const nagi = SAKUYAZA_ERA_INCIDENT_STANCES.find((entry) => entry.incidentId === 'ERA-INC-NAGI-01');
const yui = SAKUYAZA_ERA_INCIDENT_STANCES.find((entry) => entry.incidentId === 'ERA-INC-YUI-01');
const asa = SAKUYAZA_ERA_INCIDENT_STANCES.find((entry) => entry.incidentId === 'ERA-INC-ASA-01');
assert(nagi?.memberStances.find((stance) => stance.member === 'オリネ')?.resonance === 'PRIMARY_RESONANCE', 'Orine must strongly resonate with Nagi hidden-context incident');
assert(nagi?.memberStances.find((stance) => stance.member === 'ペタ')?.resonance === 'PRIMARY_RESONANCE', 'Petta must strongly resonate with Nagi label propagation incident');
assert(yui?.memberStances.find((stance) => stance.member === 'ハクマ')?.resonance === 'PRIMARY_RESONANCE', 'Hakuma must strongly resonate with Yui blanked uncertainty incident');
assert(yui?.memberStances.find((stance) => stance.member === 'ユラネ')?.resonance === 'COUNTER_RESONANCE', 'Yurane must retain counter/care potential in Yui incident');
assert(asa?.memberStances.find((stance) => stance.member === 'ナシロ')?.resonance === 'PRIMARY_RESONANCE', 'Nashiro must strongly resonate with Asa identity incident');

assert(identityDoc.includes('Season1の主要敵チーム') && identityDoc.includes('S2 primary antagonist team name = **OPEN**'), 'Sakuyaza identity doc must preserve Season rotation');
assert(identityDoc.includes('Season changeを「朔夜座の名前だけ変更」にしない'), 'Sakuyaza identity doc must reject cosmetic rename');
assert(stanceDoc.includes('朔夜座はSeason1の主要敵チーム') && stanceDoc.includes('S2 primary antagonist team = OPEN'), 'stance doc must preserve S1-only Sakuyaza scope');
assert(stanceDoc.includes('S2 primary antagonistは') && stanceDoc.includes('別team名 + 別Character群'), 'stance doc must hand off to a new S2 team/cast');
assert(stanceDoc.includes('permanent pair count = 0'), 'stance doc must preserve zero permanent pairs');
assert(seasonDoc.includes('Seasonごとに敵team名 + primary enemy castを変える'), 'Season human source must preserve antagonist rotation');
assert(seasonDoc.includes('S1 = 朔夜座') && seasonDoc.includes('S2 = 別team名 + 別cast'), 'Season human source must state S1/S2 team separation');

console.log(JSON.stringify({
  formalName: SAKUYAZA_CURRENT_IDENTITY.formalName,
  seasonScope: SAKUYAZA_CURRENT_IDENTITY.seasonScope,
  members: sakuyazaEraIncidentStanceSummary.memberCount,
  s1Incidents: sakuyazaEraIncidentStanceSummary.incidentCount,
  stanceSlots: sakuyazaEraIncidentStanceSummary.totalStanceCount,
  incidentPairCandidates: sakuyazaEraIncidentStanceSummary.primaryIncidentPairCandidateCount,
  permanentPairs: sakuyazaEraIncidentStanceSummary.permanentPairCount,
  season2TeamNameFrozen: SEASON_ANTAGONIST_TEAM_ARCHITECTURE.season2.teamNameFrozen,
  season2RosterMustChange: SEASON_ANTAGONIST_TEAM_ARCHITECTURE.season2.rosterMustDifferFromPreviousSeason,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
