import {
  CURRENT_RELATIONSHIP_CHARACTER_IDS,
  currentRelationshipInventory,
  currentRelationshipInventorySummary,
  type CurrentRelationCharacterId,
} from './currentRelationshipInventory.ts';
import { CHARACTER_AUTHOR_DB_COVERAGE } from './characterAuthorDbCoverageManifest.ts';

export const CHARACTER_RELATIONSHIP_GRAPH_RULES = {
  authority: 'docs/character-relationship-graph-read-model-v1.md',
  status: 'AUTHORING_READ_MODEL_CURRENT21_SOURCE_AWARE_NO_RELATION_SCORE',
  authorFacingOnly: true,
  current21Only: true,
  future15EdgesInvented: false,
  nodeCountRequired: 21,
  edgeCountRequired: 24,
  graphIsUndirected: true,
  edgeMeansCanonIncident: false,
  edgeMeansRomance: false,
  edgeMeansBloodRelation: false,
  edgeThicknessMayRepresentAffection: false,
  edgeColorMayRepresentMorality: false,
  sourceAuthorityMustRemainVisible: true,
  detailStatusMustRemainVisible: true,
  reserveStatusMustRemainVisible: true,
  exactIncidentMayBeInferred: false,
  missingEdgeMeansNoRelationship: false,
  stableProfileIdIsGraphNodeId: true,
  authorIdIsProfileRouteSlug: true,
  runtimeAutoPromotionAllowed: false,
} as const;

export type CharacterRelationshipGraphNode = Readonly<{
  graphNodeId: CurrentRelationCharacterId;
  authorId: string;
  routeSlug: string;
  stableProfileId: string;
  name: string;
  rosterLayer: 'CURRENT21';
}>;

const authorDbByStableId = new Map(CHARACTER_AUTHOR_DB_COVERAGE.map((entry) => [entry.stableProfileId, entry]));

export const CHARACTER_RELATIONSHIP_GRAPH_NODES: readonly CharacterRelationshipGraphNode[] = CURRENT_RELATIONSHIP_CHARACTER_IDS.map((graphNodeId) => {
  const profile = authorDbByStableId.get(graphNodeId);
  if (!profile || profile.rosterLayer !== 'CURRENT21') {
    throw new Error(`relationship graph node missing Current21 profile: ${graphNodeId}`);
  }
  return {
    graphNodeId,
    authorId: profile.authorId,
    routeSlug: profile.authorId,
    stableProfileId: profile.stableProfileId,
    name: profile.name,
    rosterLayer: 'CURRENT21',
  } as const;
});

export type CharacterRelationshipGraphEdge = Readonly<{
  edgeId: string;
  order: number;
  sourceNodeId: CurrentRelationCharacterId;
  targetNodeId: CurrentRelationCharacterId;
  displayLabel: string;
  authority: 'DETAILED_MACHINE_ARC' | 'CURRENT_HUB_COVERAGE_ARC';
  detailStatus: 'CURRENT_STRONG_RELATIONSHIP' | 'CURRENT_DIRECTION' | 'CURRENT_DIRECTION_WITH_CANDIDATE_FACTS' | 'CURRENT_RESERVE_DIRECTION';
  detailedMachineArcAvailable: boolean;
  reserveInvolved: boolean;
  source: 'docs/RELATIONSHIPS.md';
  detailedSource?: 'docs/design-targets/generated/character-relationship-arc-map-v1.json';
  exactIncidentFrozen: false;
  romanceFrozenByInventory: false;
  bloodRelationFrozenByInventory: false;
  mainMysteryFrozenByInventory: false;
}>;

export const CHARACTER_RELATIONSHIP_GRAPH_EDGES: readonly CharacterRelationshipGraphEdge[] = currentRelationshipInventory.map((entry) => ({
  edgeId: entry.id,
  order: entry.order,
  sourceNodeId: entry.participants[0],
  targetNodeId: entry.participants[1],
  displayLabel: entry.displayLabel,
  authority: entry.authority,
  detailStatus: entry.detailStatus,
  detailedMachineArcAvailable: entry.detailedMachineArcAvailable,
  reserveInvolved: entry.reserveInvolved,
  source: entry.source,
  ...(entry.detailedSource ? { detailedSource: entry.detailedSource } : {}),
  exactIncidentFrozen: entry.exactIncidentFrozen,
  romanceFrozenByInventory: entry.romanceFrozenByInventory,
  bloodRelationFrozenByInventory: entry.bloodRelationFrozenByInventory,
  mainMysteryFrozenByInventory: entry.mainMysteryFrozenByInventory,
}));

export type CharacterRelationshipGraphAdjacency = Readonly<{
  graphNodeId: CurrentRelationCharacterId;
  routeSlug: string;
  relationCount: number;
  edgeIds: readonly string[];
  neighborNodeIds: readonly CurrentRelationCharacterId[];
}>;

const nodeById = new Map(CHARACTER_RELATIONSHIP_GRAPH_NODES.map((node) => [node.graphNodeId, node]));

export const CHARACTER_RELATIONSHIP_GRAPH_ADJACENCY: readonly CharacterRelationshipGraphAdjacency[] = CHARACTER_RELATIONSHIP_GRAPH_NODES.map((node) => {
  const edges = CHARACTER_RELATIONSHIP_GRAPH_EDGES.filter((edge) => edge.sourceNodeId === node.graphNodeId || edge.targetNodeId === node.graphNodeId);
  return {
    graphNodeId: node.graphNodeId,
    routeSlug: node.routeSlug,
    relationCount: edges.length,
    edgeIds: edges.map((edge) => edge.edgeId),
    neighborNodeIds: edges.map((edge) => edge.sourceNodeId === node.graphNodeId ? edge.targetNodeId : edge.sourceNodeId),
  } as const;
});

export const characterRelationshipGraphSummary = {
  nodeCount: CHARACTER_RELATIONSHIP_GRAPH_NODES.length,
  edgeCount: CHARACTER_RELATIONSHIP_GRAPH_EDGES.length,
  uniqueNodeCount: new Set(CHARACTER_RELATIONSHIP_GRAPH_NODES.map((node) => node.graphNodeId)).size,
  uniqueRouteSlugCount: new Set(CHARACTER_RELATIONSHIP_GRAPH_NODES.map((node) => node.routeSlug)).size,
  uniqueEdgeCount: new Set(CHARACTER_RELATIONSHIP_GRAPH_EDGES.map((edge) => edge.edgeId)).size,
  detailedMachineArcCount: CHARACTER_RELATIONSHIP_GRAPH_EDGES.filter((edge) => edge.detailedMachineArcAvailable).length,
  currentHubCoverageArcCount: CHARACTER_RELATIONSHIP_GRAPH_EDGES.filter((edge) => !edge.detailedMachineArcAvailable).length,
  reserveInvolvedArcCount: CHARACTER_RELATIONSHIP_GRAPH_EDGES.filter((edge) => edge.reserveInvolved).length,
  adjacencyDegreeSum: CHARACTER_RELATIONSHIP_GRAPH_ADJACENCY.reduce((sum, entry) => sum + entry.relationCount, 0),
  minimumDistinctiveLanes: Math.min(...CHARACTER_RELATIONSHIP_GRAPH_ADJACENCY.map((entry) => entry.relationCount)),
  sourceInventoryTotal: currentRelationshipInventorySummary.total,
  future15EdgesInvented: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export const getCharacterRelationshipGraphNode = (graphNodeId: CurrentRelationCharacterId) => nodeById.get(graphNodeId);
