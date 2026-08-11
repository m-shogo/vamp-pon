import {
  weaponAwakeningCandidates,
  weaponFusionCandidates,
  weaponSynthesisCandidates,
  type WeaponTransformationCandidate,
  type WeaponTransformationKind,
} from './weaponTransformationSource.ts';
import { currentBaseWeaponIds } from './weaponExpansionSource.ts';
import {
  heldBaseWeaponCandidates,
  selectedTitle1BaseWeaponCandidates,
} from './baseWeaponSelectionSource.ts';
import { currentCharacterCombatKitEntries } from './currentCharacterCombatKitSource.ts';

export type WeaponTransformationSelectionDecision =
  | 'TITLE1_SELECTED'
  | 'HOLD_BLOCKED_BY_BASE_WEAPON';

export type WeaponTransformationSelectionEntry = {
  transformationId: string;
  transformationName: string;
  kind: WeaponTransformationKind;
  inputWeaponIds: readonly string[];
  blockedByHeldBaseWeaponIds: readonly string[];
  decision: WeaponTransformationSelectionDecision;
  selectedForTitle1: boolean;
  selectionReason: string;
  candidate: WeaponTransformationCandidate;
  keepInCandidateReservoir: true;
  runtimeStatus: 'CONTENT_SOURCE_ONLY';
  runtimeAutoPromotionAllowed: false;
};

const allTransformationCandidates: readonly WeaponTransformationCandidate[] = [
  ...weaponFusionCandidates,
  ...weaponSynthesisCandidates,
  ...weaponAwakeningCandidates,
];

const currentBaseIds = new Set<string>(currentBaseWeaponIds);
const selectedCandidateBaseIds = new Set<string>(selectedTitle1BaseWeaponCandidates.map((entry) => entry.weaponId));
const heldCandidateBaseIds = new Set<string>(heldBaseWeaponCandidates.map((entry) => entry.weaponId));
const knownBaseIds = new Set<string>([
  ...currentBaseIds,
  ...selectedCandidateBaseIds,
  ...heldCandidateBaseIds,
]);

function selectedReason(kind: WeaponTransformationKind): string {
  if (kind === 'FUSION') {
    return '入力WeaponがすべてCurrent8またはTitle1 Selected16に含まれ、二武器以上の組み合わせをTitle1内で成立させられる。';
  }
  if (kind === 'SYNTHESIS') {
    return '入力WeaponがTitle1 Base24内にあり、同じBase Weaponを別のattack shape/役割へ曲げる分岐として成立する。';
  }
  return '入力WeaponがTitle1 Base24内にあり、Character/story条件を満たした後の個別覚醒候補として残せる。';
}

export const weaponTransformationSelectionEntries: readonly WeaponTransformationSelectionEntry[] =
  allTransformationCandidates.map((candidate) => {
    const unknownInputIds = candidate.inputWeaponIds.filter((weaponId) => !knownBaseIds.has(weaponId));
    if (unknownInputIds.length > 0) {
      throw new Error(`Transformation ${candidate.id} references unknown Base Weapon input(s): ${unknownInputIds.join(',')}`);
    }

    const blockedByHeldBaseWeaponIds = candidate.inputWeaponIds.filter((weaponId) => heldCandidateBaseIds.has(weaponId));
    const selectedForTitle1 = blockedByHeldBaseWeaponIds.length === 0;

    return {
      transformationId: candidate.id,
      transformationName: candidate.name,
      kind: candidate.kind,
      inputWeaponIds: candidate.inputWeaponIds,
      blockedByHeldBaseWeaponIds,
      decision: selectedForTitle1 ? 'TITLE1_SELECTED' : 'HOLD_BLOCKED_BY_BASE_WEAPON',
      selectedForTitle1,
      selectionReason: selectedForTitle1
        ? selectedReason(candidate.kind)
        : `Base Weapon ${blockedByHeldBaseWeaponIds.join(', ')} がTitle1 Hold4のため、上流Baseが再選定されるまでTransformationも候補reservoirへ保持する。`,
      candidate,
      keepInCandidateReservoir: true,
      runtimeStatus: 'CONTENT_SOURCE_ONLY',
      runtimeAutoPromotionAllowed: false,
    };
  });

export const selectedTitle1WeaponTransformations = weaponTransformationSelectionEntries.filter((entry) => entry.selectedForTitle1);
export const heldTitle1WeaponTransformations = weaponTransformationSelectionEntries.filter((entry) => !entry.selectedForTitle1);

const selectedByKind = (kind: WeaponTransformationKind) => selectedTitle1WeaponTransformations.filter((entry) => entry.kind === kind).length;
const heldByKind = (kind: WeaponTransformationKind) => heldTitle1WeaponTransformations.filter((entry) => entry.kind === kind).length;
const linkedCurrentAwakeningIds = new Set<string>(
  currentCharacterCombatKitEntries
    .map((entry) => entry.awakening.linkedCandidateId)
    .filter((id): id is string => Boolean(id)),
);
const selectedTransformationIds = new Set<string>(selectedTitle1WeaponTransformations.map((entry) => entry.transformationId));
const heldTransformationIds = new Set<string>(heldTitle1WeaponTransformations.map((entry) => entry.transformationId));

export const weaponTransformationSelectionSummary = {
  authorityCount: weaponTransformationSelectionEntries.length,
  selectedCount: selectedTitle1WeaponTransformations.length,
  heldCount: heldTitle1WeaponTransformations.length,
  selectedFusionCount: selectedByKind('FUSION'),
  heldFusionCount: heldByKind('FUSION'),
  selectedSynthesisCount: selectedByKind('SYNTHESIS'),
  heldSynthesisCount: heldByKind('SYNTHESIS'),
  selectedAwakeningCount: selectedByKind('AWAKENING'),
  heldAwakeningCount: heldByKind('AWAKENING'),
  heldTransformationIds: [...heldTransformationIds],
  currentKitLinkedAwakeningCount: linkedCurrentAwakeningIds.size,
  currentKitLinkedAwakeningSelectedCount: [...linkedCurrentAwakeningIds].filter((id) => selectedTransformationIds.has(id)).length,
  currentKitLinkedAwakeningHeldIds: [...linkedCurrentAwakeningIds].filter((id) => heldTransformationIds.has(id)),
  runtimeAutoPromotionAllowed: false,
  heldTransformationsDeleted: false,
} as const;
