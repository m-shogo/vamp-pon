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
import {
  STORY_WORLD_MASTER_SOURCE,
  STORY_WORLD_MASTER_OPEN_FIELDS,
  STORY_WORLD_MASTER_SUPERSEDED,
} from '../../src/game/data/storyWorldMasterSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const read = (path: string) => fs.readFileSync(path, 'utf8');
for (const path of [
  'docs/00-current-story-world-master.md',
  'docs/sakuyaza-current-identity-v1.md',
  'docs/sakuyaza-era-incident-stance-matrix-v1.md',
  'docs/season-architecture-cast-matrix-v1.md',
  'docs/era-major-incident-family-lens-atlas-v1.md',
  'src/game/data/sakumeiCandidateSource.ts',
  'src/game/data/sakuyazaEraIncidentStance.ts',
  'src/game/data/seasonArchitecture.ts',
  'src/game/data/storyWorldMasterSource.ts',
]) assert(fs.existsSync(path), `missing Sakuyaza/Season source: ${path}`);

const master = read('docs/00-current-story-world-master.md');
const identityDoc = read('docs/sakuyaza-current-identity-v1.md');
const stanceDoc = read('docs/sakuyaza-era-incident-stance-matrix-v1.md');
const seasonDoc = read('docs/season-architecture-cast-matrix-v1.md');

// S1 identity.
assert(SAKUYAZA_CURRENT_IDENTITY.formalName === '朔夜座', 'S1 team name must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.seasonScope === 'S1', 'Sakuyaza must be S1-scoped');
assert(SAKUYAZA_CURRENT_IDENTITY.currentMemberCount === 8, 'S1 Sakuyaza must remain 8 members');
assert(!SAKUYAZA_CURRENT_IDENTITY.seriesWidePrimaryTeam, 'Sakuyaza cannot be series-wide primary team');
assert(!SAKUYAZA_CURRENT_IDENTITY.laterSeasonPrimaryTeam, 'Sakuyaza cannot be later-Season primary team');
assert(SAKUYAZA_CURRENT_IDENTITY.laterSeasonIndividualsMayReturn, 'individual later returns should remain allowed');
assert(!SAKUYAZA_CURRENT_IDENTITY.laterSeasonFullTeamPrimaryReturnAllowed, 'full team primary return must remain forbidden');
assert(!SAKUYAZA_CURRENT_IDENTITY.season2TeamNameFrozen && !SAKUYAZA_CURRENT_IDENTITY.season2RosterFrozen, 'S2 team/roster must remain Open');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedAbsoluteLeaderRequired, 'fixed absolute leader remains forbidden');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedHierarchyWithGunjoZankyoroKu, 'Sakuyaza/Gunjo hierarchy remains Open');
assert(sakuyazaCurrentSummary.seasonScope === 'S1', 'Sakuyaza summary scope drift');
assert(sakuyazaCurrentSummary.memberCount === 8 && sakuyazaCurrentSummary.uniqueCallNameCount === 8, 'S1 roster must be 8 unique members');
assert(sakuyazaCurrentSummary.uniqueAttachmentLaneCount === 8, '8 members need distinct attachment lanes');
assert(!sakuyazaCurrentSummary.seriesWidePrimaryTeam, 'summary cannot claim series-wide team');
assert(sakuyazaCurrentSummary.allFinalMastersUnapproved, 'final visual masters must remain unapproved');

// Season rotation.
assert(SERIES_SEASON_RULES.seasonAntagonistTeamChangesEachSeason, 'enemy team name must rotate each Season');
assert(SERIES_SEASON_RULES.seasonAntagonistPrimaryRosterChangesEachSeason, 'primary enemy roster must rotate each Season');
assert(SERIES_SEASON_RULES.seasonalTeamNameCosmeticRenameOnlyForbidden, 'rotation cannot be cosmetic rename only');
assert(SERIES_SEASON_RULES.previousSeasonEnemyIndividualsMayReturn, 'individual returns must remain possible');
assert(!SERIES_SEASON_RULES.previousSeasonFullTeamMayRemainPrimaryAntagonist, 'previous full team cannot remain primary');
assert(SERIES_SEASON_RULES.sakuyazaSeasonScope === 'S1' && SERIES_SEASON_RULES.sakuyazaReplacedEachSeason, 'Sakuyaza must rotate out after S1');

const s1 = SEASON_ANTAGONIST_TEAM_ARCHITECTURE.season1;
const s2 = SEASON_ANTAGONIST_TEAM_ARCHITECTURE.season2;
const s3 = SEASON_ANTAGONIST_TEAM_ARCHITECTURE.optionalSeason3;
assert(s1.teamName === '朔夜座' && s1.teamNameFrozen, 'S1 team name drift');
assert(s1.rosterFrozen && s1.rosterCount === 8 && s1.memberNames.length === 8, 'S1 roster drift');
assert(s2.teamName === null && !s2.teamNameFrozen && !s2.rosterFrozen && s2.rosterMustDifferFromPreviousSeason, 'S2 new team/roster must remain Open and different');
assert(s3.teamName === null && !s3.teamNameFrozen && !s3.rosterFrozen && s3.rosterMustDifferFromPreviousSeason, 'S3 candidate team must rotate again');
assert(SEASON_ANTAGONIST_TEAM_ARCHITECTURE.shared.cosmeticRenameOnlyForbidden, 'team rotation must be structural');
assert(SEASON_ANTAGONIST_TEAM_ARCHITECTURE.shared.primaryRosterMustChangeEachSeason, 'primary roster must change');
assert(SEASON_ANTAGONIST_TEAM_ARCHITECTURE.shared.previousSeasonIndividualsMayReturn, 'individual return lane missing');
assert(!SEASON_ANTAGONIST_TEAM_ARCHITECTURE.shared.previousSeasonFullTeamMayRemainPrimary, 'previous full team primary return forbidden');

// Backward compatibility semantics: recurringAllSeasons = individual recurrence only.
assert(SAKUYAZA_SEASON_FOCUS.seasonScope === 'S1', 'legacy focus scope drift');
assert(SAKUYAZA_SEASON_FOCUS.recurringAllSeasons, 'legacy recurrence field must remain compatible');
assert(SAKUYAZA_SEASON_FOCUS.recurringMeaning === 'INDIVIDUAL_RETURN_ALLOWED_NOT_FULL_TEAM_PRIMARY_RETURN', 'legacy recurrence meaning must be explicit');
assert(SAKUYAZA_SEASON_FOCUS.s1Roster.length === 8 && SAKUYAZA_SEASON_FOCUS.s2Heavier.length === 0, 'legacy focus must not split Sakuyaza into S2');
assert(!SAKUYAZA_SEASON_FOCUS.seriesWidePrimaryTeam, 'legacy focus cannot imply series-wide primary team');
assert(!SAKUYAZA_SEASON_FOCUS.permanentSeasonTeams && SAKUYAZA_SEASON_FOCUS.pairMissionRemainsDynamic, 'legacy pair compatibility drift');

// Story World machine authority.
assert(STORY_WORLD_MASTER_SOURCE.sakuyaza.seasonScope === 'S1', 'Story World source must scope Sakuyaza to S1');
assert(!STORY_WORLD_MASTER_SOURCE.sakuyaza.seriesWidePrimaryTeam, 'Story World source cannot make Sakuyaza series-wide');
assert(!STORY_WORLD_MASTER_SOURCE.sakuyaza.season2TeamNameFrozen && !STORY_WORLD_MASTER_SOURCE.sakuyaza.season2PrimaryRosterFrozen, 'Story World source must keep S2 team Open');
assert(STORY_WORLD_MASTER_SOURCE.seasonArchitecture.antagonistTeamNameChangesEachSeason, 'Story World source must rotate antagonist team name');
assert(STORY_WORLD_MASTER_SOURCE.seasonArchitecture.antagonistPrimaryRosterChangesEachSeason, 'Story World source must rotate antagonist roster');
assert(!STORY_WORLD_MASTER_SOURCE.seasonArchitecture.antagonistRotationIsCosmeticRenameOnly, 'Story World source must reject cosmetic rename');
assert(STORY_WORLD_MASTER_OPEN_FIELDS.includes('Season2 antagonist team name / primary roster / count'), 'S2 enemy team must remain Open field');
assert(STORY_WORLD_MASTER_SUPERSEDED.includes('朔夜座 is the series-wide recurring primary antagonist team'), 'series-wide Sakuyaza must remain superseded');
assert(STORY_WORLD_MASTER_SUPERSEDED.includes('the same Sakuyaza eight are split into Season1-heavy and Season2-heavy halves'), 'S1/S2 split Sakuyaza must remain superseded');

// S1 incident stance matrix only.
assert(SAKUYAZA_ERA_INCIDENT_RULES.seasonScope === 'S1', 'stance rules must be S1-only');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.stanceImpliesRealityPresence, 'stance != Reality presence');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.stanceImpliesCombatBoss, 'stance != combat Boss');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.stanceImpliesOfficialMission, 'stance != official mission');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.pairCandidateImpliesPermanentPair && !SAKUYAZA_ERA_INCIDENT_RULES.pairCandidateImpliesRomance, 'pair boundaries drift');
assert(SAKUYAZA_ERA_INCIDENT_RULES.permanentPairCount === 0, 'permanent pair count must remain zero');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.season2UsesSamePrimaryTeam && !SAKUYAZA_ERA_INCIDENT_RULES.season2UsesSamePrimaryRoster, 'S2 must use a new primary team/roster');
assert(!SAKUYAZA_ERA_INCIDENT_RULES.runtimeAutoPromotionAllowed, 'stance source cannot auto-promote runtime');

assert(sakuyazaEraIncidentStanceSummary.seasonScope === 'S1', 'stance summary scope drift');
assert(sakuyazaEraIncidentStanceSummary.incidentCount === 3, 'S1 Sakuyaza must cover 3 primary incident lanes');
assert(sakuyazaEraIncidentStanceSummary.memberCount === 8 && sakuyazaEraIncidentStanceSummary.uniqueMemberCount === 8, 'stance source must retain all 8 members');
assert(sakuyazaEraIncidentStanceSummary.totalStanceCount === 24, 'expected 8 x 3 = 24 S1 stance slots');
assert(sakuyazaEraIncidentStanceSummary.incidentsWithAllEightStances === 3, 'all three S1 lanes need eight stance analyses');
assert(sakuyazaEraIncidentStanceSummary.primaryIncidentPairCandidateCount === 3, 'S1 needs three primary pair candidates');
assert(sakuyazaEraIncidentStanceSummary.permanentPairCount === 0, 'pair candidates may not create permanent pairs');
assert(sakuyazaEraIncidentStanceSummary.allPresenceUnrequired, 'all stance presence must remain optional');
assert(sakuyazaEraIncidentStanceSummary.allS1IncidentsHaveCounterOrMitigation, 'every S1 lane needs counter/mitigation possibility');
assert(!sakuyazaEraIncidentStanceSummary.season2UsesSamePrimaryTeam && !sakuyazaEraIncidentStanceSummary.season2UsesSamePrimaryRoster, 'summary must preserve S2 rotation');

const currentMemberNames = new Set(sakumeiCandidateMembers.map((member) => member.callName));
assert(SAKUYAZA_MEMBER_IDS.length === 8 && new Set(SAKUYAZA_MEMBER_IDS).size === 8, 'Sakuyaza ID projection must be 8 unique names');
for (const member of SAKUYAZA_MEMBER_IDS) assert(currentMemberNames.has(member), `unknown S1 member: ${member}`);

const expectedS1Ids = new Set(['ERA-INC-NAGI-01', 'ERA-INC-YUI-01', 'ERA-INC-ASA-01']);
const allMajorIds = new Set(ERA_MAJOR_INCIDENTS.map((incident) => incident.id));
for (const incident of SAKUYAZA_ERA_INCIDENT_STANCES) {
  assert(allMajorIds.has(incident.incidentId), `unknown incident: ${incident.incidentId}`);
  assert(expectedS1Ids.has(incident.incidentId), `S2 primary incident leaked into S1 Sakuyaza: ${incident.incidentId}`);
  assert(incident.memberStances.length === 8 && new Set(incident.memberStances.map((stance) => stance.member)).size === 8, `8-member stance coverage drift: ${incident.incidentId}`);
  assert(incident.memberStances.every((stance) => !stance.presenceRequired), `S1 stance unexpectedly requires physical presence: ${incident.incidentId}`);
  assert(incident.counterOrMitigationMembers.length >= 1, `counter/mitigation missing: ${incident.incidentId}`);
  assert(!incident.primaryPairCandidate.officialMissionFrozen && !incident.primaryPairCandidate.permanentPair, `pair boundary drift: ${incident.incidentId}`);
}
assert(!SAKUYAZA_ERA_INCIDENT_STANCES.some((entry) => entry.incidentId === 'ERA-INC-TOMORI-01' || entry.incidentId === 'ERA-INC-MICHIRU-01'), 'S2 Tomori/Michiru primaries cannot belong to S1 Sakuyaza matrix');

const expectedPairs = new Map([
  ['ERA-INC-NAGI-01', ['オリネ', 'ペタ']],
  ['ERA-INC-YUI-01', ['ハクマ', 'ペタ']],
  ['ERA-INC-ASA-01', ['ナシロ', 'ツグリ']],
]);
assert(new Set(SAKUYAZA_INCIDENT_PAIR_CANDIDATES.map((pair) => pair.id)).size === 3, 'S1 pair IDs must be unique');
for (const incident of SAKUYAZA_ERA_INCIDENT_STANCES) {
  const pair = expectedPairs.get(incident.incidentId);
  assert(pair && incident.primaryPairCandidate.members[0] === pair[0] && incident.primaryPairCandidate.members[1] === pair[1], `S1 pair drift: ${incident.incidentId}`);
}

const nonLow = new Map<string, number>();
for (const incident of SAKUYAZA_ERA_INCIDENT_STANCES) for (const stance of incident.memberStances) {
  if (stance.resonance !== 'LOW_PRIORITY') nonLow.set(stance.member, (nonLow.get(stance.member) ?? 0) + 1);
}
for (const member of SAKUYAZA_MEMBER_IDS) assert((nonLow.get(member) ?? 0) >= 1, `S1 member lacks meaningful stance: ${member}`);

// Human-readable guards.
assert(master.includes('朔夜座8人をシリーズ全Season共通のprimary antagonist teamへする'), 'highest master must explicitly supersede series-wide Sakuyaza');
assert(master.includes('Season2 / optional Season3') && master.includes('primary antagonist teamはSeasonごとに変更する'), 'highest master must state seasonal enemy rotation');
assert(identityDoc.includes('Season1の主要敵チーム') && identityDoc.includes('S2 primary antagonist team name = **OPEN**'), 'identity doc must scope Sakuyaza to S1');
assert(identityDoc.includes('Season changeを「朔夜座の名前だけ変更」にしない'), 'identity doc must reject rename-only rotation');
assert(stanceDoc.includes('朔夜座はSeason1の主要敵チーム') && stanceDoc.includes('S2 primary antagonist team = OPEN'), 'stance doc must be S1-only');
assert(stanceDoc.includes('別team名 + 別Character群'), 'stance doc must hand off to new S2 cast');
assert(seasonDoc.includes('敵team名 + primary enemy castはSeasonごとに変える'), 'Season doc must state team+cast rotation');
assert(seasonDoc.includes('S1 = 朔夜座 / 8人') && seasonDoc.includes('S2 = 別team名 + 別cast'), 'Season doc must distinguish S1/S2 teams');

console.log(JSON.stringify({
  formalName: SAKUYAZA_CURRENT_IDENTITY.formalName,
  seasonScope: SAKUYAZA_CURRENT_IDENTITY.seasonScope,
  s1Members: sakuyazaEraIncidentStanceSummary.memberCount,
  s1Incidents: sakuyazaEraIncidentStanceSummary.incidentCount,
  stanceSlots: sakuyazaEraIncidentStanceSummary.totalStanceCount,
  s1PairCandidates: sakuyazaEraIncidentStanceSummary.primaryIncidentPairCandidateCount,
  season2TeamNameFrozen: s2.teamNameFrozen,
  season2RosterMustChange: s2.rosterMustDifferFromPreviousSeason,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
