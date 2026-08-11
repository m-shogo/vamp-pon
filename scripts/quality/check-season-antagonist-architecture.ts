import fs from 'node:fs';
import {
  SERIES_SEASON_RULES,
  SEASON_ANTAGONIST_TEAM_ARCHITECTURE,
  SAKUYAZA_SEASON_FOCUS,
} from '../../src/game/data/seasonArchitecture.ts';
import {
  SAKUYAZA_CURRENT_IDENTITY,
  sakumeiCandidateMembers,
} from '../../src/game/data/sakumeiCandidateSource.ts';
import {
  S2_ANTAGONIST_TEAM_CANDIDATE,
  S2_ANTAGONIST_TEAM_NAME_CANDIDATES,
  S2_ANTAGONIST_WORKING_MEMBERS,
  s2AntagonistTeamCandidateSummary,
} from '../../src/game/data/s2AntagonistTeamCandidate.ts';
import {
  SEASON_ANTAGONIST_RETURN_RULES,
  SEASON_ANTAGONIST_RETURN_ROLES,
  SAKUYAZA_LATER_RETURN_CANDIDATES,
  S1_S2_REUNION_CANDIDATES,
  seasonAntagonistReturnSummary,
} from '../../src/game/data/seasonAntagonistReturnPolicy.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const path of [
  'docs/00-current-story-world-master.md',
  'docs/season-architecture-cast-matrix-v1.md',
  'docs/sakuyaza-current-identity-v1.md',
  'docs/s2-antagonist-team-candidate-v1.md',
  'docs/season-antagonist-return-policy-v1.md',
  'src/game/data/seasonArchitecture.ts',
  'src/game/data/sakumeiCandidateSource.ts',
  'src/game/data/s2AntagonistTeamCandidate.ts',
  'src/game/data/seasonAntagonistReturnPolicy.ts',
]) assert(fs.existsSync(path), `missing seasonal antagonist source: ${path}`);

const s2Doc = fs.readFileSync('docs/s2-antagonist-team-candidate-v1.md', 'utf8');
const returnDoc = fs.readFileSync('docs/season-antagonist-return-policy-v1.md', 'utf8');

// Current seasonal rotation.
assert(SERIES_SEASON_RULES.seasonAntagonistTeamChangesEachSeason, 'antagonist team must rotate each Season');
assert(SERIES_SEASON_RULES.seasonAntagonistPrimaryRosterChangesEachSeason, 'primary antagonist roster must rotate');
assert(SERIES_SEASON_RULES.seasonalTeamNameCosmeticRenameOnlyForbidden, 'rotation may not be rename-only');
assert(SERIES_SEASON_RULES.previousSeasonEnemyIndividualsMayReturn, 'previous antagonist individuals must be allowed to return');
assert(!SERIES_SEASON_RULES.previousSeasonFullTeamMayRemainPrimaryAntagonist, 'previous full team cannot remain next primary team');
assert(SERIES_SEASON_RULES.sakuyazaSeasonScope === 'S1', 'Sakuyaza must remain S1-scoped');
assert(SERIES_SEASON_RULES.sakuyazaReplacedEachSeason, 'Sakuyaza must rotate out as primary team after S1');

assert(SEASON_ANTAGONIST_TEAM_ARCHITECTURE.season1.teamName === '朔夜座', 'S1 team name must remain 朔夜座');
assert(SEASON_ANTAGONIST_TEAM_ARCHITECTURE.season1.rosterCount === 8, 'S1 Sakuyaza roster must remain 8');
assert(SEASON_ANTAGONIST_TEAM_ARCHITECTURE.season2.teamName === null, 'S2 final team name must remain Open');
assert(!SEASON_ANTAGONIST_TEAM_ARCHITECTURE.season2.teamNameFrozen, 'S2 team name may not be frozen');
assert(!SEASON_ANTAGONIST_TEAM_ARCHITECTURE.season2.rosterFrozen, 'S2 final roster may not be frozen');
assert(SEASON_ANTAGONIST_TEAM_ARCHITECTURE.season2.rosterMustDifferFromPreviousSeason, 'S2 primary roster must differ from S1');
assert(!SAKUYAZA_SEASON_FOCUS.seriesWidePrimaryTeam, 'Sakuyaza cannot become series-wide primary team');
assert(SAKUYAZA_SEASON_FOCUS.s2Heavier.length === 0, 'Sakuyaza may not be split into an S2-heavy half');

// S2 working candidate remains candidate only.
assert(S2_ANTAGONIST_TEAM_CANDIDATE.status === 'HIGH_VALUE_CANDIDATE_NOT_CANON', 'S2 team must remain Candidate');
assert(S2_ANTAGONIST_TEAM_CANDIDATE.seasonId === 'S2', 'S2 candidate season drift');
assert(!S2_ANTAGONIST_TEAM_CANDIDATE.finalTeamNameFrozen, 'S2 final name unexpectedly frozen');
assert(!S2_ANTAGONIST_TEAM_CANDIDATE.finalMemberCountFrozen, 'S2 final member count unexpectedly frozen');
assert(!S2_ANTAGONIST_TEAM_CANDIDATE.finalRosterFrozen, 'S2 final roster unexpectedly frozen');
assert(!S2_ANTAGONIST_TEAM_CANDIDATE.exactLeaderFrozen && !S2_ANTAGONIST_TEAM_CANDIDATE.exactFounderFrozen, 'S2 leader/founder unexpectedly frozen');
assert(!S2_ANTAGONIST_TEAM_CANDIDATE.isSakuyazaRename, 'S2 cannot be a Sakuyaza rename');
assert(!S2_ANTAGONIST_TEAM_CANDIDATE.isSakuyazaRosterReskin, 'S2 cannot be a Sakuyaza roster reskin');
assert(!S2_ANTAGONIST_TEAM_CANDIDATE.reusesSakuyazaZaBrand, 'S2 should not reuse Sakuyaza 座 brand by default');
assert(!S2_ANTAGONIST_TEAM_CANDIDATE.reusesSakuyazaBrokenCircleByDefault, 'S2 should not reuse Sakuyaza broken-circle motif by default');
assert(!S2_ANTAGONIST_TEAM_CANDIDATE.runtimeAutoPromotionAllowed, 'S2 candidate may not auto-promote runtime');

assert(s2AntagonistTeamCandidateSummary.workingMemberCount === 8, 'working S2 comparison roster should contain 8 new candidates');
assert(s2AntagonistTeamCandidateSummary.uniqueWorkingIdCount === 8, 'S2 working IDs must be unique');
assert(s2AntagonistTeamCandidateSummary.uniqueWorkingNameCount === 8, 'S2 working call names must be unique');
assert(s2AntagonistTeamCandidateSummary.uniqueLaneCount === 8, 'S2 candidates must have 8 distinct attachment lanes');
assert(s2AntagonistTeamCandidateSummary.nameCandidateCount >= 3, 'S2 needs multiple team-name candidates');
assert(s2AntagonistTeamCandidateSummary.allRealityOpen, 'S2 Reality identities must remain Open');
assert(s2AntagonistTeamCandidateSummary.allFinalCharactersUnapproved, 'S2 final character masters must remain unapproved');
assert(!s2AntagonistTeamCandidateSummary.finalTeamNameFrozen && !s2AntagonistTeamCandidateSummary.finalRosterFrozen, 'S2 summary may not freeze name/roster');

const sakuyazaNames = new Set(sakumeiCandidateMembers.map((entry) => entry.callName));
for (const entry of S2_ANTAGONIST_WORKING_MEMBERS) {
  assert(!sakuyazaNames.has(entry.callName), `S2 candidate reuses Sakuyaza call name: ${entry.callName}`);
  assert(!entry.exactRealityFrozen, `S2 candidate Reality frozen: ${entry.callName}`);
  assert(!entry.finalCharacterApproved, `S2 candidate final master approved prematurely: ${entry.callName}`);
}
assert(S2_ANTAGONIST_TEAM_NAME_CANDIDATES.every((entry) => !entry.name.endsWith('座')), 'S2 candidate names should not reuse 座 brand');

// Return policy: enemy and ally both possible.
assert(SEASON_ANTAGONIST_RETURN_RULES.previousSeasonIndividualsMayReturn, 'previous antagonist return must be allowed');
assert(SEASON_ANTAGONIST_RETURN_RULES.enemySideReturnAllowed, 'enemy-side return must be allowed');
assert(SEASON_ANTAGONIST_RETURN_RULES.allySideReturnAllowed, 'ally-side return must be allowed');
assert(SEASON_ANTAGONIST_RETURN_RULES.temporaryAllianceAllowed, 'temporary alliance must be allowed');
assert(SEASON_ANTAGONIST_RETURN_RULES.rivalReturnAllowed, 'rival return must be allowed');
assert(SEASON_ANTAGONIST_RETURN_RULES.partyGuestReturnAllowed, 'party guest return must be allowed');
assert(!SEASON_ANTAGONIST_RETURN_RULES.alignmentPermanentlyFrozenAfterOneSeason, 'alignment may not freeze permanently after one Season');
assert(!SEASON_ANTAGONIST_RETURN_RULES.allyReturnErasesPastHarm, 'ally return may not erase past harm');
assert(!SEASON_ANTAGONIST_RETURN_RULES.bossDefeatMeansImmediateRedemption, 'Boss defeat may not equal immediate redemption');
assert(!SEASON_ANTAGONIST_RETURN_RULES.protagonistSideMembershipRequiredForGrowth, 'joining protagonists may not be required for growth');
assert(!SEASON_ANTAGONIST_RETURN_RULES.previousFullTeamMayBecomeNextSeasonPrimaryTeam, 'full previous team cannot become next primary team');
assert(SEASON_ANTAGONIST_RETURN_RULES.newSeasonPrimaryCastMustRemainPrimary, 'new Season primary cast must retain focus');
assert(SEASON_ANTAGONIST_RETURN_RULES.relationshipHistoryCarriesForward, 'relationship history must carry forward');
assert(!SEASON_ANTAGONIST_RETURN_RULES.characterGrowthResetsBetweenSeasons, 'character growth may not reset');
assert(!SEASON_ANTAGONIST_RETURN_RULES.defeatEqualsDeath, 'defeat may not equal death');
assert(!SEASON_ANTAGONIST_RETURN_RULES.permanentDeathDefaultAntagonistClosure, 'permanent death cannot be default antagonist closure');
assert(!SEASON_ANTAGONIST_RETURN_RULES.exactReturnAssignmentsFrozen && !SEASON_ANTAGONIST_RETURN_RULES.exactReturnCountFrozen, 'exact return assignments/count must remain Open');
assert(!SEASON_ANTAGONIST_RETURN_RULES.runtimeAutoPromotionAllowed, 'return policy may not auto-promote runtime');

assert(SEASON_ANTAGONIST_RETURN_ROLES.length === 9, 'return role vocabulary drift');
assert(seasonAntagonistReturnSummary.sakuyazaCandidateCount === 8, 'all 8 Sakuyaza members need return lanes');
assert(seasonAntagonistReturnSummary.everySakuyazaMemberHasEnemyAndAllyLane, 'every Sakuyaza member needs both enemy/ally return candidates');
assert(seasonAntagonistReturnSummary.reunionCandidateCount === 8, 'need eight S1/S2 contrast reunion candidates');
assert(!seasonAntagonistReturnSummary.exactReturnAssignmentsFrozen, 'return assignments must remain Open');
assert(!seasonAntagonistReturnSummary.runtimeAutoPromotionAllowed, 'return summary may not auto-promote runtime');

assert(new Set(SAKUYAZA_LATER_RETURN_CANDIDATES.map((entry) => entry.member)).size === 8, 'Sakuyaza return candidate members must be unique');
for (const entry of SAKUYAZA_LATER_RETURN_CANDIDATES) {
  assert(sakuyazaNames.has(entry.member), `unknown Sakuyaza return member: ${entry.member}`);
  assert(entry.enemySide.length > 10 && entry.allySide.length > 10, `return lanes too thin: ${entry.member}`);
}
const s2Names = new Set(S2_ANTAGONIST_WORKING_MEMBERS.map((entry) => entry.callName));
for (const reunion of S1_S2_REUNION_CANDIDATES) {
  assert(sakuyazaNames.has(reunion.s1Member), `unknown S1 reunion member: ${reunion.s1Member}`);
  assert(s2Names.has(reunion.s2Candidate), `unknown S2 reunion candidate: ${reunion.s2Candidate}`);
  assert(reunion.contrast.length > 10, `reunion contrast too thin: ${reunion.s1Member}/${reunion.s2Candidate}`);
}

// Human-readable boundary checks.
assert(s2Doc.includes('HIGH-VALUE CANDIDATE') && s2Doc.includes('TEAM NAME + ROSTER NOT CANON'), 'S2 doc must clearly remain Candidate');
assert(s2Doc.includes('S1 / Sakuyaza') && s2Doc.includes('S2 / new team'), 'S2 doc must distinguish S1/S2 philosophies');
assert(s2Doc.includes('working roster — 8 NEW enemy characters'), 'S2 doc must contain a new working roster');
assert(s2Doc.includes('no Sakuyaza member automatically joins the S2 team'), 'S2 doc must block automatic Sakuyaza transfer');
assert(returnDoc.includes('ENEMY_RETURN') && returnDoc.includes('ALLY_RETURN') && returnDoc.includes('TEMPORARY_ALLY'), 'return doc must support enemy/ally/temp ally roles');
assert(returnDoc.includes('敵だったから次も敵') && returnDoc.includes('一度allyになったら永久ally'), 'return doc must reject permanent binary alignment');
assert(returnDoc.includes('Party参加 = forgivenessではない'), 'return doc must separate Party from forgiveness');
assert(returnDoc.includes('S1 primary team = 朔夜座') && returnDoc.includes('S2 primary team = new team / new primary cast'), 'return doc must preserve team rotation');

assert(SAKUYAZA_CURRENT_IDENTITY.seasonScope === 'S1' && !SAKUYAZA_CURRENT_IDENTITY.seriesWidePrimaryTeam, 'Sakuyaza Current identity drift');

console.log(JSON.stringify({
  s1Team: SEASON_ANTAGONIST_TEAM_ARCHITECTURE.season1.teamName,
  s2PreferredWorkingCandidate: S2_ANTAGONIST_TEAM_CANDIDATE.preferredWorkingName,
  s2WorkingMembers: s2AntagonistTeamCandidateSummary.workingMemberCount,
  s2FinalNameFrozen: s2AntagonistTeamCandidateSummary.finalTeamNameFrozen,
  returnRoles: seasonAntagonistReturnSummary.returnRoleCount,
  sakuyazaReturnLanes: seasonAntagonistReturnSummary.sakuyazaCandidateCount,
  reunionCandidates: seasonAntagonistReturnSummary.reunionCandidateCount,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
