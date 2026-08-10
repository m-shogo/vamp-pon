import { series1StageCampaignContentEntries } from './series1StageCampaignContentSource.ts';
import {
  selectedTitle1BaseWeaponCandidates,
  heldBaseWeaponCandidates,
} from './baseWeaponSelectionSource.ts';
import { title1UnlockLearningProgressionEntries } from './title1UnlockLearningProgressionSource.ts';

export type CampaignUnlockDisposition =
  | 'ALIGNED_SELECTED_CANDIDATE'
  | 'DEFERRED_HELD_CANDIDATE'
  | 'NON_WEAPON_CONTENT_HOOK';

const selectedIds = new Set(selectedTitle1BaseWeaponCandidates.map((entry) => entry.weaponId));
const heldIds = new Set(heldBaseWeaponCandidates.map((entry) => entry.weaponId));
const campaignByStage = new Map(series1StageCampaignContentEntries.map((entry) => [entry.stageId, entry]));

export const title1UnlockResolutionEntries = title1UnlockLearningProgressionEntries.map((learning) => {
  const campaign = campaignByStage.get(learning.stageId);
  if (!campaign) throw new Error(`missing campaign stage for unlock resolution: ${learning.stageId}`);

  const campaignUnlock = campaign.progression.unlock;
  let campaignUnlockDisposition: CampaignUnlockDisposition = 'NON_WEAPON_CONTENT_HOOK';
  if (campaignUnlock.kind === 'BASE_WEAPON_CANDIDATE') {
    if (selectedIds.has(campaignUnlock.targetId)) campaignUnlockDisposition = 'ALIGNED_SELECTED_CANDIDATE';
    else if (heldIds.has(campaignUnlock.targetId)) campaignUnlockDisposition = 'DEFERRED_HELD_CANDIDATE';
    else throw new Error(`campaign unlock references Base Weapon outside Selected/Hold decision: ${campaignUnlock.targetId}`);
  }

  return {
    stageNo: learning.stageNo,
    stageId: learning.stageId,
    stageName: learning.stageName,
    campaignUnlock,
    campaignUnlockDisposition,
    resolvedCandidateWeaponRevealIds: learning.candidateWeaponRevealIds,
    heldCandidateIdsExplicitlyDeferred: campaignUnlockDisposition === 'DEFERRED_HELD_CANDIDATE'
      ? [campaignUnlock.targetId]
      : [],
    systemKnowledgeUnlocked: [
      ...learning.introducedAttributes.map((id) => `ATTRIBUTE:${id}`),
      ...learning.introducedStatuses.map((id) => `STATUS:${id}`),
      ...learning.introducedReactionIds.map((id) => `REACTION:${id}`),
    ],
    candidateRevealMeansRuntimeOwned: false,
    campaignUnlockMeansRuntimeOwned: false,
    readingRequiredForGameplayPower: false,
    authority: 'TITLE1_UNLOCK_CONTENT_AUTHORITY' as const,
    runtimeAutoPromotionAllowed: false as const,
  };
});

export const title1UnlockResolutionSummary = {
  stageCount: title1UnlockResolutionEntries.length,
  deferredHeldCampaignUnlocks: title1UnlockResolutionEntries
    .flatMap((entry) => entry.heldCandidateIdsExplicitlyDeferred),
  deferredHeldCampaignUnlockCount: title1UnlockResolutionEntries
    .filter((entry) => entry.campaignUnlockDisposition === 'DEFERRED_HELD_CANDIDATE').length,
  selectedCandidateRevealIds: [...new Set(title1UnlockResolutionEntries.flatMap((entry) => entry.resolvedCandidateWeaponRevealIds))],
  heldCandidatesExposedAsGameplayAccess: title1UnlockResolutionEntries
    .flatMap((entry) => entry.resolvedCandidateWeaponRevealIds)
    .filter((id) => heldIds.has(id)),
  candidateRevealMeansRuntimeOwned: false,
  campaignUnlockMeansRuntimeOwned: false,
  runtimeAutoPromotionAllowed: false,
} as const;
