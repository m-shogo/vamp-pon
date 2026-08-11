import { weapons } from './weapons.ts';
import { selectedBaseWeaponGameplayProfiles } from './baseWeaponSelectionGameplaySource.ts';
import { isCurrentRuntimeWeaponEffectType } from '../domain/weaponRuntimeCapabilities.ts';

export type SelectedBaseWeaponRuntimeAdmissionState =
  | 'BLOCKED_RUNTIME_HOOK'
  | 'BLOCKED_LIVE_CATALOG'
  | 'BLOCKED_STATUS_RUNTIME'
  | 'READY_FOR_CONTENT_ADMISSION_REVIEW';

const liveWeaponIds = new Set<string>(weapons.map((weapon) => weapon.id));

export const selectedBaseWeaponRuntimeAdmissionEntries = selectedBaseWeaponGameplayProfiles.map((profile) => {
  const liveDefinition = weapons.find((weapon) => weapon.id === profile.weaponId);
  const liveEffectType = liveDefinition?.levels[0]?.effect.type;
  const liveEffectSupported = liveDefinition ? isCurrentRuntimeWeaponEffectType(liveEffectType) : false;
  const statusRuntimeRequired = profile.statuses.length > 0;
  const requiredRuntimeHookImplemented = liveDefinition != null && liveEffectSupported;
  const liveCatalogPresent = liveWeaponIds.has(profile.weaponId);

  const blockers = [
    ...(requiredRuntimeHookImplemented ? [] : ['RUNTIME_HOOK'] as const),
    ...(statusRuntimeRequired ? ['STATUS_RUNTIME'] as const : []),
    ...(liveCatalogPresent ? [] : ['LIVE_CATALOG'] as const),
  ];

  const admissionState: SelectedBaseWeaponRuntimeAdmissionState = !requiredRuntimeHookImplemented
    ? 'BLOCKED_RUNTIME_HOOK'
    : statusRuntimeRequired
      ? 'BLOCKED_STATUS_RUNTIME'
      : !liveCatalogPresent
        ? 'BLOCKED_LIVE_CATALOG'
        : 'READY_FOR_CONTENT_ADMISSION_REVIEW';

  return {
    weaponId: profile.weaponId,
    weaponName: profile.weaponName,
    archetype: profile.archetype,
    attributes: profile.attributes,
    statuses: profile.statuses,
    requiredRuntimeHook: profile.requiredRuntimeHook,
    statusRuntimeRequired,
    requiredRuntimeHookImplemented,
    liveCatalogPresent,
    liveEffectType: typeof liveEffectType === 'string' ? liveEffectType : null,
    liveEffectSupported,
    transformationHookCount: profile.transformationHookCount,
    admissionState,
    blockers,
    numericalTuningFrozen: false,
    runtimeVisualQaRequired: true,
    runtimeAutoPromotionAllowed: false,
  } as const;
});

export const selectedBaseWeaponRuntimeAdmissionSummary = {
  candidateCount: selectedBaseWeaponRuntimeAdmissionEntries.length,
  liveCatalogCount: selectedBaseWeaponRuntimeAdmissionEntries.filter((entry) => entry.liveCatalogPresent).length,
  runtimeHookImplementedCount: selectedBaseWeaponRuntimeAdmissionEntries.filter((entry) => entry.requiredRuntimeHookImplemented).length,
  statusRuntimeRequiredCount: selectedBaseWeaponRuntimeAdmissionEntries.filter((entry) => entry.statusRuntimeRequired).length,
  readyForAdmissionReviewCount: selectedBaseWeaponRuntimeAdmissionEntries.filter((entry) => entry.admissionState === 'READY_FOR_CONTENT_ADMISSION_REVIEW').length,
  candidatesBlockedByRuntimeHook: selectedBaseWeaponRuntimeAdmissionEntries.filter((entry) => entry.blockers.includes('RUNTIME_HOOK')).map((entry) => entry.weaponId),
  candidatesBlockedByStatusRuntime: selectedBaseWeaponRuntimeAdmissionEntries.filter((entry) => entry.blockers.includes('STATUS_RUNTIME')).map((entry) => entry.weaponId),
  candidatesMissingLiveCatalog: selectedBaseWeaponRuntimeAdmissionEntries.filter((entry) => entry.blockers.includes('LIVE_CATALOG')).map((entry) => entry.weaponId),
  numericalTuningFrozenCount: 0,
  runtimeAutoPromotionAllowed: false,
} as const;
