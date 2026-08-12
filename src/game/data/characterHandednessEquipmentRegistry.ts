import { CHARACTER_AUTHOR_DB_IDENTITIES } from './characterAuthorDbCoverageManifest.ts';

export const CHARACTER_HANDEDNESS_EQUIPMENT_RULES = {
  status: 'CURRENT_STRUCTURE_WITH_EXPLICIT_UNKNOWN_VALUES',
  characterCountRequired: 36,
  bodyRelativeCoordinatesOnly: true,
  heldItemHandMayNotInferDominantHand: true,
  poseMayNotInferDominantHand: true,
  screenSideMayNotInferBodySide: true,
  asymmetricAssetMayNotBeMirroredWithoutCorrection: true,
  missingValueMeansOpen: true,
  missingValueMeansRightHanded: false,
  visualApprovalMayNotPromoteStoryAuthority: true,
} as const;

export type BodySide = 'BODY_LEFT' | 'BODY_RIGHT' | 'CENTER' | 'OPEN';
export type HandAuthorityStatus = 'CURRENT_VISUAL_CONTINUITY' | 'OPEN_NO_SOURCE';

export type CharacterEquipmentPlacement = Readonly<{
  itemId: string;
  itemLabel: string;
  anchor: 'HAND' | 'SHOULDER_TO_HIP' | 'HIP' | 'BODY' | 'OPEN';
  bodySide: BodySide;
  fromBodySide: BodySide | null;
  toBodySide: BodySide | null;
  status: HandAuthorityStatus;
  source: string | null;
  notes: string;
}>;

export type CharacterHandednessEquipmentEntry = Readonly<{
  id: string;
  authorId: string;
  stableProfileId: string;
  displayName: string;
  dominantHand: Readonly<{
    value: 'LEFT' | 'RIGHT' | 'AMBIDEXTROUS' | null;
    status: 'OPEN_NO_SOURCE';
    source: null;
  }>;
  equipmentPlacements: readonly CharacterEquipmentPlacement[];
  mirrorPolicy: 'NO_UNCORRECTED_MIRROR_FOR_ASYMMETRIC_ASSETS';
  frontViewProjection: Readonly<{
    bodyLeftAppearsOnScreenRight: true;
    bodyRightAppearsOnScreenLeft: true;
  }>;
  notes: string;
}>;

const yuiPlacements: readonly CharacterEquipmentPlacement[] = [
  {
    itemId: 'yui-lantern',
    itemLabel: 'ランタン',
    anchor: 'HAND',
    bodySide: 'BODY_RIGHT',
    fromBodySide: null,
    toBodySide: null,
    status: 'CURRENT_VISUAL_CONTINUITY',
    source: 'src/game/data/goldenReferenceRegistry.ts',
    notes: '保持手のみを固定する。身体右手で保持することから利き腕は推論しない。',
  },
  {
    itemId: 'yui-bag-strap',
    itemLabel: 'バッグの肩紐',
    anchor: 'SHOULDER_TO_HIP',
    bodySide: 'OPEN',
    fromBodySide: 'BODY_RIGHT',
    toBodySide: 'BODY_LEFT',
    status: 'CURRENT_VISUAL_CONTINUITY',
    source: 'src/game/data/goldenReferenceRegistry.ts',
    notes: '身体右肩から身体左腰へ渡す。正面では画面左上から画面右下へ見える。',
  },
  {
    itemId: 'yui-bag',
    itemLabel: '小型バッグ',
    anchor: 'HIP',
    bodySide: 'BODY_LEFT',
    fromBodySide: null,
    toBodySide: null,
    status: 'CURRENT_VISUAL_CONTINUITY',
    source: 'src/game/data/goldenReferenceRegistry.ts',
    notes: '身体左腰。正面では画面右側に見える。',
  },
];

export const CHARACTER_HANDEDNESS_EQUIPMENT_REGISTRY: readonly CharacterHandednessEquipmentEntry[] =
  CHARACTER_AUTHOR_DB_IDENTITIES.map((identity) => ({
    id: `${identity.authorId}-handedness-equipment-v1`,
    authorId: identity.authorId,
    stableProfileId: identity.stableProfileId,
    displayName: identity.name,
    dominantHand: {
      value: null,
      status: 'OPEN_NO_SOURCE',
      source: null,
    },
    equipmentPlacements: identity.authorId === 'yui' ? yuiPlacements : [],
    mirrorPolicy: 'NO_UNCORRECTED_MIRROR_FOR_ASYMMETRIC_ASSETS',
    frontViewProjection: {
      bodyLeftAppearsOnScreenRight: true,
      bodyRightAppearsOnScreenLeft: true,
    },
    notes: identity.authorId === 'yui'
      ? 'ランタン保持手とバッグ配置はCurrent visual continuity。利き腕はOPEN。'
      : '利き腕・固定保持手・非対称装備位置は、根拠Sourceが接続されるまでOPEN。右利きの既定値を置かない。',
  }));

export const characterHandednessEquipmentByAuthorId = new Map(
  CHARACTER_HANDEDNESS_EQUIPMENT_REGISTRY.map((entry) => [entry.authorId, entry]),
);

export const characterHandednessEquipmentSummary = {
  characterCount: CHARACTER_HANDEDNESS_EQUIPMENT_REGISTRY.length,
  uniqueAuthorIds: new Set(CHARACTER_HANDEDNESS_EQUIPMENT_REGISTRY.map((entry) => entry.authorId)).size,
  dominantHandCurrentCount: CHARACTER_HANDEDNESS_EQUIPMENT_REGISTRY.filter((entry) => entry.dominantHand.value !== null).length,
  dominantHandOpenCount: CHARACTER_HANDEDNESS_EQUIPMENT_REGISTRY.filter((entry) => entry.dominantHand.value === null).length,
  placementCurrentCount: CHARACTER_HANDEDNESS_EQUIPMENT_REGISTRY.flatMap((entry) => entry.equipmentPlacements)
    .filter((placement) => placement.status === 'CURRENT_VISUAL_CONTINUITY').length,
  heldItemHandMayNotInferDominantHand: true,
  asymmetricAssetMayNotBeMirroredWithoutCorrection: true,
} as const;
