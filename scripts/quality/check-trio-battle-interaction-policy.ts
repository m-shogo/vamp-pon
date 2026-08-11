import { trioBattleInteractionPolicy, trioBattleInteractionPolicySummary } from '../../src/game/data/trioBattleInteractionPolicySource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(trioBattleInteractionPolicy.partyMemberCount === 3, 'party member count must remain 3');
assert(trioBattleInteractionPolicy.pairEdgesPerParty === 3, 'trio must expose 3 pair edges');
assert(trioBattleInteractionPolicy.directedAffinityEdgesPerParty === 6, 'trio must expose 6 directed affinity edges');
assert(!trioBattleInteractionPolicy.formationUi.showTeamAffectionPercent, 'team affection % must not replace pair state');
assert(trioBattleInteractionPolicy.formationUi.showPairEdges, 'formation UI should expose pair edges');
assert(!trioBattleInteractionPolicy.banterRules.highestBondAlwaysWins, 'highest Bond may not monopolize banter');
assert(!trioBattleInteractionPolicy.banterRules.featuredPairAlwaysWins, 'Featured pair may not monopolize banter');
assert(trioBattleInteractionPolicy.banterRules.globalBanterCooldownRequired, 'global banter cooldown required');
assert(trioBattleInteractionPolicy.banterRules.recentSpotlightLedgerRequired, 'recent pair spotlight ledger required');
assert(!trioBattleInteractionPolicy.pairAssistArbitration.highestBondAutoWins, 'highest Bond may not auto-win Assist arbitration');
assert(!trioBattleInteractionPolicy.pairAssistArbitration.lowBondDisablesAssist, 'low Bond may not disable Assist');
assert(!trioBattleInteractionPolicy.threeMemberMoment.storedTrioBondCreated, 'three-way scene may not create trio Bond');
assert(trioBattleInteractionPolicy.derivedPresentationShapes.length >= 5, 'trio relationship presentation needs several non-persisted shapes');
assert(trioBattleInteractionPolicy.derivedPresentationShapes.every((shape) => !shape.persistedState), 'derived trio shapes must never become persisted affection state');
assert(!trioBattleInteractionPolicy.antiAbuse.dialogueReadingAddsPower, 'dialogue reading may not add power');
assert(!trioBattleInteractionPolicy.antiAbuse.partyRotationRequiredForProgression, 'party rotation may not be mandatory progression');
assert(!trioBattleInteractionPolicy.antiAbuse.lowBondStatPenaltyAllowed, 'low Bond stat penalty forbidden');
assert(!trioBattleInteractionPolicy.antiAbuse.favoriteCharacterLockoutAllowed, 'favorite Character lockout forbidden');
assert(trioBattleInteractionPolicySummary.possibleTrioCombinationCount === 1330, 'trio combination count drift');
assert(!trioBattleInteractionPolicySummary.storedTrioBondExists, 'summary must keep trio Bond absent');
assert(!trioBattleInteractionPolicySummary.runtimeAutoPromotionAllowed, 'content policy may not auto-promote runtime');

console.log(JSON.stringify({ status: 'PASS', ...trioBattleInteractionPolicySummary }, null, 2));
