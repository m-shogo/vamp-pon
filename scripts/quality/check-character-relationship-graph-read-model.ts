import fs from 'node:fs';
import {
  CHARACTER_RELATIONSHIP_GRAPH_RULES,
  CHARACTER_RELATIONSHIP_GRAPH_NODES,
  CHARACTER_RELATIONSHIP_GRAPH_EDGES,
  CHARACTER_RELATIONSHIP_GRAPH_ADJACENCY,
  characterRelationshipGraphSummary,
} from '../../src/game/data/characterRelationshipGraphReadModel.ts';
import { currentRelationshipInventory } from '../../src/game/data/currentRelationshipInventory.ts';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

assert(CHARACTER_RELATIONSHIP_GRAPH_RULES.status==='AUTHORING_READ_MODEL_CURRENT21_SOURCE_AWARE_NO_RELATION_SCORE','relationship graph status drift');
assert(CHARACTER_RELATIONSHIP_GRAPH_RULES.authorFacingOnly,'relationship graph must remain author-facing');
assert(CHARACTER_RELATIONSHIP_GRAPH_RULES.current21Only,'relationship graph v1 must remain Current21 only');
assert(!CHARACTER_RELATIONSHIP_GRAPH_RULES.future15EdgesInvented,'Future15 edges may not be invented');
assert(CHARACTER_RELATIONSHIP_GRAPH_RULES.nodeCountRequired===21,'relationship graph node target drift');
assert(CHARACTER_RELATIONSHIP_GRAPH_RULES.edgeCountRequired===24,'relationship graph edge target drift');
assert(CHARACTER_RELATIONSHIP_GRAPH_RULES.graphIsUndirected,'relationship graph v1 edges must remain undirected navigation lanes');
assert(!CHARACTER_RELATIONSHIP_GRAPH_RULES.edgeMeansCanonIncident,'edge may not mean Canon incident');
assert(!CHARACTER_RELATIONSHIP_GRAPH_RULES.edgeMeansRomance,'edge may not mean romance');
assert(!CHARACTER_RELATIONSHIP_GRAPH_RULES.edgeMeansBloodRelation,'edge may not mean blood relation');
assert(!CHARACTER_RELATIONSHIP_GRAPH_RULES.edgeThicknessMayRepresentAffection,'edge thickness may not represent affection');
assert(!CHARACTER_RELATIONSHIP_GRAPH_RULES.edgeColorMayRepresentMorality,'edge color may not represent morality');
assert(CHARACTER_RELATIONSHIP_GRAPH_RULES.sourceAuthorityMustRemainVisible,'edge source authority must remain visible');
assert(CHARACTER_RELATIONSHIP_GRAPH_RULES.detailStatusMustRemainVisible,'edge detail status must remain visible');
assert(CHARACTER_RELATIONSHIP_GRAPH_RULES.reserveStatusMustRemainVisible,'edge reserve status must remain visible');
assert(!CHARACTER_RELATIONSHIP_GRAPH_RULES.exactIncidentMayBeInferred,'exact incidents may not be inferred');
assert(!CHARACTER_RELATIONSHIP_GRAPH_RULES.missingEdgeMeansNoRelationship,'missing edge may not mean no relationship');
assert(CHARACTER_RELATIONSHIP_GRAPH_RULES.stableProfileIdIsGraphNodeId,'stable profile ID must remain graph node ID');
assert(CHARACTER_RELATIONSHIP_GRAPH_RULES.authorIdIsProfileRouteSlug,'author ID must remain profile route slug');
assert(!CHARACTER_RELATIONSHIP_GRAPH_RULES.runtimeAutoPromotionAllowed,'relationship graph may not auto-promote runtime');

assert(characterRelationshipGraphSummary.nodeCount===21,'relationship graph node count drift');
assert(characterRelationshipGraphSummary.edgeCount===24,'relationship graph edge count drift');
assert(characterRelationshipGraphSummary.uniqueNodeCount===21,'relationship graph node IDs must be unique');
assert(characterRelationshipGraphSummary.uniqueRouteSlugCount===21,'relationship graph routes must be unique');
assert(characterRelationshipGraphSummary.uniqueEdgeCount===24,'relationship graph edge IDs must be unique');
assert(characterRelationshipGraphSummary.sourceInventoryTotal===24,'relationship graph source inventory total drift');
assert(characterRelationshipGraphSummary.adjacencyDegreeSum===48,'undirected adjacency degree sum must equal 2*edges');
assert(characterRelationshipGraphSummary.minimumDistinctiveLanes>=1,'every Current21 graph node must have at least one source-backed lane');
assert(!characterRelationshipGraphSummary.future15EdgesInvented,'relationship graph summary may not invent Future15 edges');
assert(!characterRelationshipGraphSummary.runtimeAutoPromotionAllowed,'relationship graph summary may not auto-promote runtime');
assert(CHARACTER_RELATIONSHIP_GRAPH_ADJACENCY.length===21,'relationship graph adjacency must cover every node');
assert(CHARACTER_RELATIONSHIP_GRAPH_EDGES.length===currentRelationshipInventory.length,'relationship graph must mirror inventory edge count');

const nodeIds=new Set(CHARACTER_RELATIONSHIP_GRAPH_NODES.map((node)=>node.graphNodeId));
for(const node of CHARACTER_RELATIONSHIP_GRAPH_NODES){
  assert(node.rosterLayer==='CURRENT21',`non-Current21 node leaked into graph: ${node.graphNodeId}`);
  assert(node.graphNodeId===node.stableProfileId,`graph node ID must equal stable profile ID: ${node.graphNodeId}`);
  assert(node.routeSlug===node.authorId,`profile route must use author ID: ${node.graphNodeId}`);
}
for(const edge of CHARACTER_RELATIONSHIP_GRAPH_EDGES){
  assert(edge.sourceNodeId!==edge.targetNodeId,`relationship self-loop not allowed: ${edge.edgeId}`);
  assert(nodeIds.has(edge.sourceNodeId)&&nodeIds.has(edge.targetNodeId),`relationship edge references unknown node: ${edge.edgeId}`);
  assert(edge.source==='docs/RELATIONSHIPS.md',`relationship edge source drift: ${edge.edgeId}`);
  assert(!edge.exactIncidentFrozen,`relationship graph may not freeze incident: ${edge.edgeId}`);
  assert(!edge.romanceFrozenByInventory,`relationship graph may not freeze romance: ${edge.edgeId}`);
  assert(!edge.bloodRelationFrozenByInventory,`relationship graph may not freeze blood relation: ${edge.edgeId}`);
  assert(!edge.mainMysteryFrozenByInventory,`relationship graph may not freeze Main Mystery: ${edge.edgeId}`);
  if(edge.detailedMachineArcAvailable) assert(edge.detailedSource==='docs/design-targets/generated/character-relationship-arc-map-v1.json',`detailed relationship source missing: ${edge.edgeId}`);
}

const routeByGraphNode=new Map(CHARACTER_RELATIONSHIP_GRAPH_NODES.map((node)=>[node.graphNodeId,node.routeSlug]));
for(const [graphNodeId,routeSlug] of [['yubi','yuubi'],['kage1','kaname'],['kage2','kasumi'],['kage3','toki'],['kage4','tsumugi']] as const){
  assert(routeByGraphNode.get(graphNodeId)===routeSlug,`relationship graph alias route drift: ${graphNodeId}`);
}

const doc=fs.readFileSync('docs/character-relationship-graph-read-model-v1.md','utf8');
for(const token of [
  'CURRENT21 AUTHORING GRAPH / 21 NODES / 24 SOURCE-BACKED EDGES / NO RELATIONSHIP SCORE',
  'Future15 relationships are not invented to make the graph look full.',
  'There is a source-backed Current relationship lane worth navigating.',
  'A missing edge also does **not** mean two characters have no relationship.',
  'line thickness = affection',
  'red line = hate / pink line = romance',
  'graph node `kage1` → profile route `/characters/kaname`',
  '人間関係図の線は「仲良し度」ではなく、今どのSourceを読めば二人の関係を深掘りできるかを示す道にする。',
]) assert(doc.includes(token),`relationship graph doc guard missing: ${token}`);

console.log(JSON.stringify({nodes:21,edges:24,adjacencyDegreeSum:48,current21Only:true,future15EdgesInvented:false,romanceInferred:false,runtimeAutoPromotionAllowed:false},null,2));
