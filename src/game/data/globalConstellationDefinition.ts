import { forgottenStreetNightBoardCompatibility } from './collectionProgressCompatibility';
import {
  characterObjectLineages,
  namedObjectRegistry,
} from './namedObjectRegistry';

export type ConstellationGroupId =
  | 'night_roads'
  | 'keepers'
  | 'item_lineages'
  | 'kagemono'
  | 'bonds'
  | 'night_margin';

export type ConstellationNodeKind =
  | 'group_root'
  | 'stage_root'
  | 'character_root'
  | 'lineage_root'
  | 'achievement'
  | 'cross_link'
  | 'decorative';

export type ConstellationNodeDefinition = {
  id: string;
  groupId: ConstellationGroupId;
  kind: ConstellationNodeKind;
  displayName: string;
  sourceId?: string;
  activeCompletionNode: boolean;
  runtimeConnected: false;
};

export type NamedObjectConstellationLink = {
  objectId: string;
  characterNodeId: string;
  lineageNodeId: string;
  stageNodeIds: string[];
  relationshipCharacterNodeIds: string[];
};

export const constellationGroupRoots: ConstellationNodeDefinition[] = [
  { id: 'constellation-group:night-roads', groupId: 'night_roads', kind: 'group_root', displayName: '夜路', activeCompletionNode: false, runtimeConnected: false },
  { id: 'constellation-group:keepers', groupId: 'keepers', kind: 'group_root', displayName: '灯し手', activeCompletionNode: false, runtimeConnected: false },
  { id: 'constellation-group:item-lineages', groupId: 'item_lineages', kind: 'group_root', displayName: '灯具', activeCompletionNode: false, runtimeConnected: false },
  { id: 'constellation-group:kagemono', groupId: 'kagemono', kind: 'group_root', displayName: 'カゲモノ', activeCompletionNode: false, runtimeConnected: false },
  { id: 'constellation-group:bonds', groupId: 'bonds', kind: 'group_root', displayName: '結び', activeCompletionNode: false, runtimeConnected: false },
  { id: 'constellation-group:night-margin', groupId: 'night_margin', kind: 'group_root', displayName: '夜の余白', activeCompletionNode: false, runtimeConnected: false },
];

export const stageConstellationRoots: ConstellationNodeDefinition[] = Array.from(
  { length: 20 },
  (_, index) => {
    const stageNo = index + 1;
    return {
      id: `constellation-stage:${stageNo}`,
      groupId: 'night_roads' as const,
      kind: 'stage_root' as const,
      displayName: `Stage ${stageNo}`,
      sourceId: `stage:${stageNo}`,
      activeCompletionNode: false,
      runtimeConnected: false as const,
    };
  },
);

export const characterConstellationRoots: ConstellationNodeDefinition[] =
  characterObjectLineages.map((lineage) => ({
    id: `constellation-character:${lineage.characterId}`,
    groupId: 'keepers' as const,
    kind: 'character_root' as const,
    displayName: lineage.characterDisplayName,
    sourceId: `character:${lineage.characterId}`,
    activeCompletionNode: false,
    runtimeConnected: false as const,
  }));

export const itemLineageConstellationRoots: ConstellationNodeDefinition[] =
  characterObjectLineages.map((lineage) => ({
    id: `constellation-lineage:${lineage.characterId}`,
    groupId: 'item_lineages' as const,
    kind: 'lineage_root' as const,
    displayName: `${lineage.characterDisplayName}の灯具線`,
    sourceId: `character-lineage:${lineage.characterId}`,
    activeCompletionNode: false,
    runtimeConnected: false as const,
  }));

export const forgottenStreetConstellationNodes: ConstellationNodeDefinition[] =
  forgottenStreetNightBoardCompatibility.cells.map((cell) => ({
    id: `constellation-achievement:stage1:${cell.id}`,
    groupId: 'night_roads' as const,
    kind: 'achievement' as const,
    displayName: cell.currentDisplayTitle,
    sourceId: cell.id,
    activeCompletionNode:
      cell.completionEligibility === 'ACTIVE_CURRENT_OR_DUAL_READ',
    runtimeConnected: false as const,
  }));

export const activeForgottenStreetConstellationNodes =
  forgottenStreetConstellationNodes.filter((node) => node.activeCompletionNode);

const lineageByCharacterId = new Map(
  characterObjectLineages.map((lineage) => [lineage.characterId, lineage]),
);

export const namedObjectConstellationLinks: NamedObjectConstellationLink[] =
  namedObjectRegistry.map((object) => {
    const lineage = lineageByCharacterId.get(object.characterId);
    if (!lineage) {
      throw new Error(`missing object lineage for ${object.characterId}`);
    }
    return {
      objectId: object.id,
      characterNodeId: `constellation-character:${object.characterId}`,
      lineageNodeId: `constellation-lineage:${object.characterId}`,
      stageNodeIds: lineage.stageIds.map((stageId) => `constellation-stage:${stageId}`),
      relationshipCharacterNodeIds: lineage.relationshipCharacterIds.map(
        (characterId) => `constellation-character:${characterId}`,
      ),
    };
  });

export const globalConstellationDefinition = {
  version: 'design-v1',
  runtimeConnected: false,
  runtimeDenominatorFrozen: false,
  groupRoots: constellationGroupRoots,
  stageRoots: stageConstellationRoots,
  characterRoots: characterConstellationRoots,
  itemLineageRoots: itemLineageConstellationRoots,
  migratedStage1Nodes: forgottenStreetConstellationNodes,
  activeStage1CompletionNodes: activeForgottenStreetConstellationNodes,
  namedObjectLinks: namedObjectConstellationLinks,
} as const;

export type GlobalConstellationValidationResult = {
  errors: string[];
};

export function validateGlobalConstellationDefinition(): GlobalConstellationValidationResult {
  const errors: string[] = [];
  const nodes = [
    ...constellationGroupRoots,
    ...stageConstellationRoots,
    ...characterConstellationRoots,
    ...itemLineageConstellationRoots,
    ...forgottenStreetConstellationNodes,
  ];
  const nodeIds = new Set<string>();
  for (const node of nodes) {
    if (nodeIds.has(node.id)) {
      errors.push(`duplicate constellation node id: ${node.id}`);
    }
    nodeIds.add(node.id);
    if (node.runtimeConnected) {
      errors.push(`${node.id} must not claim runtime connection in design-v1`);
    }
  }

  if (constellationGroupRoots.length !== 6) {
    errors.push(`constellation group root count must be 6, got ${constellationGroupRoots.length}`);
  }
  if (stageConstellationRoots.length !== 20) {
    errors.push(`stage root count must be 20, got ${stageConstellationRoots.length}`);
  }
  if (characterConstellationRoots.length !== 21) {
    errors.push(`character root count must be 21, got ${characterConstellationRoots.length}`);
  }
  if (itemLineageConstellationRoots.length !== 21) {
    errors.push(`item lineage root count must be 21, got ${itemLineageConstellationRoots.length}`);
  }
  if (
    forgottenStreetConstellationNodes.length !==
    forgottenStreetNightBoardCompatibility.cells.length
  ) {
    errors.push('Stage1 compatibility nodes must preserve every existing cell');
  }

  const expectedActiveStage1SourceIds = forgottenStreetNightBoardCompatibility.cells
    .filter((cell) => cell.completionEligibility === 'ACTIVE_CURRENT_OR_DUAL_READ')
    .map((cell) => cell.id);
  const actualActiveStage1SourceIds = activeForgottenStreetConstellationNodes
    .map((node) => node.sourceId)
    .filter((sourceId): sourceId is string => typeof sourceId === 'string');
  if (
    JSON.stringify(actualActiveStage1SourceIds) !==
    JSON.stringify(expectedActiveStage1SourceIds)
  ) {
    errors.push('Stage1 active completion nodes must match compatibility eligibility');
  }

  const archiveOnlySourceIds = new Set(
    forgottenStreetNightBoardCompatibility.cells
      .filter((cell) => cell.completionEligibility === 'LEGACY_ARCHIVE_ONLY')
      .map((cell) => cell.id),
  );
  for (const node of forgottenStreetConstellationNodes) {
    if (node.sourceId && archiveOnlySourceIds.has(node.sourceId) && node.activeCompletionNode) {
      errors.push(`${node.id} is legacy archive-only but remains an active completion node`);
    }
  }

  if (namedObjectConstellationLinks.length !== namedObjectRegistry.length) {
    errors.push('every named object must have a constellation link');
  }

  for (const link of namedObjectConstellationLinks) {
    if (!nodeIds.has(link.characterNodeId)) {
      errors.push(`${link.objectId} references missing character node ${link.characterNodeId}`);
    }
    if (!nodeIds.has(link.lineageNodeId)) {
      errors.push(`${link.objectId} references missing lineage node ${link.lineageNodeId}`);
    }
    for (const stageNodeId of link.stageNodeIds) {
      if (!nodeIds.has(stageNodeId)) {
        errors.push(`${link.objectId} references missing stage node ${stageNodeId}`);
      }
    }
    for (const characterNodeId of link.relationshipCharacterNodeIds) {
      if (!nodeIds.has(characterNodeId)) {
        errors.push(`${link.objectId} references missing relationship node ${characterNodeId}`);
      }
    }
  }

  if (globalConstellationDefinition.runtimeConnected) {
    errors.push('design-v1 global constellation must not claim runtime connection');
  }
  if (globalConstellationDefinition.runtimeDenominatorFrozen) {
    errors.push('design-v1 global constellation must not freeze runtime denominator');
  }

  return { errors };
}
