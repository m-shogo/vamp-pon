import { CURRENT_RUNTIME_WEAPON_EFFECT_TYPES } from '../domain/weaponRuntimeCapabilities.ts';
import {
  selectedBaseWeaponRuntimeAdmissionEntries,
  selectedBaseWeaponRuntimeAdmissionSummary,
} from './selectedBaseWeaponRuntimeAdmissionSource.ts';
import type { WeaponAttackArchetype } from './weaponExpansionSource.ts';

export type UnityWeaponRuntimeCapability =
  | 'NEAREST_TARGET_PROJECTILE'
  | 'MULTI_PROJECTILE_LOOP'
  | 'CIRCULAR_GROUND_AREA'
  | 'STATUS_APPLICATION'
  | 'MULTI_TARGET_PROJECTILE_SELECTION'
  | 'TWO_TARGET_TETHER'
  | 'CONE_QUERY'
  | 'KNOCKBACK_VECTOR'
  | 'TARGET_CHAIN_SELECTION'
  | 'SLAM_WAVE_QUERY'
  | 'RETURNING_PROJECTILE'
  | 'TRAP_PERSISTENCE'
  | 'DELAYED_TRIGGER'
  | 'HOMING_PRIORITY_SELECTION'
  | 'SWEEP_QUERY'
  | 'REFLECT_WINDOW'
  | 'VEIL_TRACKING_FRICTION'
  | 'LINE_PIERCE_RESIDUE'
  | 'ORBIT_LINK'
  | 'SPIRAL_FIELD'
  | 'LANE_BOUNDARY_TRIGGER';

export type RuntimeCapabilityState = 'IMPLEMENTED' | 'MISSING';

export type UnityBaseWeaponAdmissionDecision =
  | 'BLOCKED_MISSING_UNITY_PRIMITIVES'
  | 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW';

/**
 * Unity U47 evidence overlay.
 *
 * `selectedBaseWeaponRuntimeAdmissionSource.ts` remains the Selected16 live/Web admission authority.
 * This source adds only Unity executor evidence so Web runtime support can never be mistaken for
 * Unity implementation readiness.
 */
export const currentUnityWeaponRuntimeCapabilities: Readonly<Record<UnityWeaponRuntimeCapability, RuntimeCapabilityState>> = {
  NEAREST_TARGET_PROJECTILE: 'IMPLEMENTED',
  MULTI_PROJECTILE_LOOP: 'IMPLEMENTED',
  CIRCULAR_GROUND_AREA: 'IMPLEMENTED',
  STATUS_APPLICATION: 'MISSING',
  MULTI_TARGET_PROJECTILE_SELECTION: 'MISSING',
  TWO_TARGET_TETHER: 'MISSING',
  CONE_QUERY: 'MISSING',
  KNOCKBACK_VECTOR: 'MISSING',
  TARGET_CHAIN_SELECTION: 'MISSING',
  SLAM_WAVE_QUERY: 'MISSING',
  RETURNING_PROJECTILE: 'MISSING',
  TRAP_PERSISTENCE: 'MISSING',
  DELAYED_TRIGGER: 'MISSING',
  HOMING_PRIORITY_SELECTION: 'MISSING',
  SWEEP_QUERY: 'MISSING',
  REFLECT_WINDOW: 'MISSING',
  VEIL_TRACKING_FRICTION: 'MISSING',
  LINE_PIERCE_RESIDUE: 'MISSING',
  ORBIT_LINK: 'MISSING',
  SPIRAL_FIELD: 'MISSING',
  LANE_BOUNDARY_TRIGGER: 'MISSING',
} as const;

const archetypeCapabilities: Readonly<Record<WeaponAttackArchetype, readonly UnityWeaponRuntimeCapability[]>> = {
  SCATTER_PROJECTILE: ['MULTI_TARGET_PROJECTILE_SELECTION'],
  TETHER: ['TWO_TARGET_TETHER'],
  CONE_PUSH: ['CONE_QUERY', 'KNOCKBACK_VECTOR'],
  PULSE_CHAIN: ['TARGET_CHAIN_SELECTION'],
  LANE_WALL: ['LANE_BOUNDARY_TRIGGER'],
  SLAM_WAVE: ['SLAM_WAVE_QUERY', 'KNOCKBACK_VECTOR'],
  RETURNING_THROW: ['RETURNING_PROJECTILE'],
  TRAP_FIELD: ['TRAP_PERSISTENCE'],
  DELAYED_PULSE: ['DELAYED_TRIGGER'],
  LINK_CHAIN: ['TWO_TARGET_TETHER'],
  HOMING_SNIPE: ['HOMING_PRIORITY_SELECTION'],
  SWEEP_CLEANSE: ['SWEEP_QUERY'],
  REFLECT_COUNTER: ['REFLECT_WINDOW'],
  CONE_VEIL: ['CONE_QUERY', 'VEIL_TRACKING_FRICTION'],
  TRAIL_DROP: ['TRAP_PERSISTENCE'],
  LINE_STITCH: ['LINE_PIERCE_RESIDUE'],
  RETURN_HOMING: ['RETURNING_PROJECTILE', 'HOMING_PRIORITY_SELECTION'],
  ORBIT_STITCH: ['ORBIT_LINK'],
  SPIRAL_CONTROL: ['SPIRAL_FIELD'],
  LANE_BOUNDARY: ['LANE_BOUNDARY_TRIGGER'],
} as const;

export type UnityBaseWeaponRuntimeAdmissionEntry = {
  weaponId: string;
  weaponName: string;
  archetype: WeaponAttackArchetype;
  webAdmissionState: (typeof selectedBaseWeaponRuntimeAdmissionEntries)[number]['admissionState'];
  webBlockers: readonly string[];
  requiredUnityCapabilities: readonly UnityWeaponRuntimeCapability[];
  implementedUnityCapabilities: readonly UnityWeaponRuntimeCapability[];
  missingUnityCapabilities: readonly UnityWeaponRuntimeCapability[];
  unityDecision: UnityBaseWeaponAdmissionDecision;
  mayEnterUnityRuntimeRegistry: boolean;
  contentSelectionPreserved: true;
  runtimeStatus: 'NOT_IMPLEMENTED';
};

export const title1BaseWeaponRuntimeAdmissionEntries: readonly UnityBaseWeaponRuntimeAdmissionEntry[] =
  selectedBaseWeaponRuntimeAdmissionEntries.map((entry) => {
    const archetypeRequirements = archetypeCapabilities[entry.archetype];
    const requiredUnityCapabilities = [
      ...archetypeRequirements,
      ...(entry.statusRuntimeRequired ? ['STATUS_APPLICATION' as const] : []),
    ];
    const implementedUnityCapabilities = requiredUnityCapabilities.filter(
      (capability) => currentUnityWeaponRuntimeCapabilities[capability] === 'IMPLEMENTED',
    );
    const missingUnityCapabilities = requiredUnityCapabilities.filter(
      (capability) => currentUnityWeaponRuntimeCapabilities[capability] === 'MISSING',
    );
    const mayEnterUnityRuntimeRegistry = missingUnityCapabilities.length === 0;

    return {
      weaponId: entry.weaponId,
      weaponName: entry.weaponName,
      archetype: entry.archetype,
      webAdmissionState: entry.admissionState,
      webBlockers: entry.blockers,
      requiredUnityCapabilities,
      implementedUnityCapabilities,
      missingUnityCapabilities,
      unityDecision: mayEnterUnityRuntimeRegistry
        ? 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW'
        : 'BLOCKED_MISSING_UNITY_PRIMITIVES',
      mayEnterUnityRuntimeRegistry,
      contentSelectionPreserved: true,
      runtimeStatus: 'NOT_IMPLEMENTED',
    };
  });

const missingCapabilityFrequency = new Map<UnityWeaponRuntimeCapability, number>();
for (const entry of title1BaseWeaponRuntimeAdmissionEntries) {
  for (const capability of entry.missingUnityCapabilities) {
    missingCapabilityFrequency.set(capability, (missingCapabilityFrequency.get(capability) ?? 0) + 1);
  }
}

export const title1BaseWeaponRuntimeAdmissionSummary = {
  selectedContentWeaponCount: selectedBaseWeaponRuntimeAdmissionSummary.candidateCount,
  webLiveCatalogCount: selectedBaseWeaponRuntimeAdmissionSummary.liveCatalogCount,
  webRuntimeHookImplementedCount: selectedBaseWeaponRuntimeAdmissionSummary.runtimeHookImplementedCount,
  webReadyForAdmissionReviewCount: selectedBaseWeaponRuntimeAdmissionSummary.readyForAdmissionReviewCount,
  unityAdmittedRuntimeCount: title1BaseWeaponRuntimeAdmissionEntries.filter((entry) => entry.mayEnterUnityRuntimeRegistry).length,
  unityBlockedRuntimeCount: title1BaseWeaponRuntimeAdmissionEntries.filter((entry) => !entry.mayEnterUnityRuntimeRegistry).length,
  currentWebRuntimeEffectTypes: CURRENT_RUNTIME_WEAPON_EFFECT_TYPES,
  currentWebRuntimeEffectTypeCount: CURRENT_RUNTIME_WEAPON_EFFECT_TYPES.length,
  currentUnityWeaponExecutorTypes: ['Projectile', 'GroundArea'] as const,
  currentUnityWeaponExecutorTypeCount: 2,
  currentImplementedUnityPrimitiveCount: Object.values(currentUnityWeaponRuntimeCapabilities).filter((state) => state === 'IMPLEMENTED').length,
  currentMissingUnityPrimitiveCount: Object.values(currentUnityWeaponRuntimeCapabilities).filter((state) => state === 'MISSING').length,
  missingCapabilityFrequency: [...missingCapabilityFrequency.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([capability, blockedWeaponCount]) => ({ capability, blockedWeaponCount })),
  statusApplicationBlockedWeaponCount: title1BaseWeaponRuntimeAdmissionEntries.filter((entry) => entry.missingUnityCapabilities.includes('STATUS_APPLICATION')).length,
  selected16WebAdmissionAuthorityDuplicated: false,
  webRuntimeSupportEqualsUnityRuntimeSupport: false,
  fakeProjectileFallbackAllowed: false,
  contentSelectionMayBeDowngradedToFitRuntime: false,
  runtimeAutoPromotionAllowed: false,
} as const;
