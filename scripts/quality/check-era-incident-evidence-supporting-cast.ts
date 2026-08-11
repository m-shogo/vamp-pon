import fs from 'node:fs';
import {
  ERA_INCIDENT_SUPPORT_RULES,
  ERA_INCIDENT_EVIDENCE_CAST,
  CURRENT21_INCIDENT_SUPPORT_IDS,
  FUTURE15_INCIDENT_SUPPORT_IDS,
  eraIncidentEvidenceSupportingCastSummary,
} from '../../src/game/data/eraIncidentEvidenceSupportingCast.ts';
import { ERA_MAJOR_INCIDENTS } from '../../src/game/data/eraMajorIncidentFamilyLens.ts';
import {
  currentRelationshipInventoryById,
  currentRelationshipInventorySummary,
} from '../../src/game/data/currentRelationshipInventory.ts';
import {
  CURRENT21_SEASON_ASSIGNMENTS,
  FUTURE15_SEASON_ASSIGNMENTS,
  seasonArchitectureSummary,
} from '../../src/game/data/seasonArchitecture.ts';
import {
  CHARACTER_REALITY_ROOTS,
  characterRealityRootSummary,
} from '../../src/game/data/characterRealityRootRegistry.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const read = (path: string) => fs.readFileSync(path, 'utf8');
const mustExist = (path: string) => assert(fs.existsSync(path), `missing evidence/cast source: ${path}`);

const required = [
  'docs/era-incident-evidence-supporting-cast-matrix-v1.md',
  'docs/era-major-incident-family-lens-atlas-v1.md',
  'docs/world-historical-incident-ledger-v1.md',
  'docs/character-reality-root-registry-v1.md',
  'docs/cross-era-lineage-reveal-map-v1.md',
  'src/game/data/eraIncidentEvidenceSupportingCast.ts',
  'src/game/data/eraMajorIncidentFamilyLens.ts',
  'src/game/data/currentRelationshipInventory.ts',
  'src/game/data/seasonArchitecture.ts',
] as const;
required.forEach(mustExist);

const matrix = read('docs/era-incident-evidence-supporting-cast-matrix-v1.md');
const incidentAtlas = read('docs/era-major-incident-family-lens-atlas-v1.md');
const ledger = read('docs/world-historical-incident-ledger-v1.md');
const lineageReveal = read('docs/cross-era-lineage-reveal-map-v1.md');

assert(ERA_INCIDENT_SUPPORT_RULES.namedRealityDirectCastFrozenCount === 5, 'named Reality direct cast count must remain 5');
assert(ERA_INCIDENT_SUPPORT_RULES.namedRealityDirectCastMustBeCore5LeadsOnlyAtCurrentCertainty, 'only Core5 leads may be named Reality-direct cast at current certainty');
assert(!ERA_INCIDENT_SUPPORT_RULES.supportingCastAssignmentFreezesRealityEra, 'support assignment may not freeze Reality Era');
assert(!ERA_INCIDENT_SUPPORT_RULES.supportingCastAssignmentFreezesVictimhood, 'support assignment may not freeze victimhood');
assert(!ERA_INCIDENT_SUPPORT_RULES.supportingCastAssignmentFreezesOccupation, 'support assignment may not freeze occupation');
assert(!ERA_INCIDENT_SUPPORT_RULES.relationshipHookFreezesExactIncident, 'relationship hook may not freeze exact incident');
assert(!ERA_INCIDENT_SUPPORT_RULES.future15AssignmentPromotesRoster, 'Future15 incident assignment may not promote roster');
assert(ERA_INCIDENT_SUPPORT_RULES.everyIncidentRequiresOfficialEvidence, 'official evidence layer required');
assert(ERA_INCIDENT_SUPPORT_RULES.everyIncidentRequiresWitnessEvidence, 'witness evidence layer required');
assert(ERA_INCIDENT_SUPPORT_RULES.everyIncidentRequiresPhysicalOrDigitalEvidence, 'physical/digital evidence layer required');
assert(ERA_INCIDENT_SUPPORT_RULES.everyIncidentRequiresLaterInterpretation, 'later interpretation layer required');
assert(!ERA_INCIDENT_SUPPORT_RULES.oneEvidenceItemMayConfirmBloodline, 'single evidence may not confirm bloodline');
assert(!ERA_INCIDENT_SUPPORT_RULES.onePhotoOrSurnameMayConfirmBloodline, 'single photo/surname may not confirm bloodline');
assert(!ERA_INCIDENT_SUPPORT_RULES.gunjoAdmissionFrozenByEvidenceMatrix, 'evidence matrix may not freeze Gunjo admission');
assert(!ERA_INCIDENT_SUPPORT_RULES.sakuyazaExactIncidentPositionsFrozen, 'evidence matrix may not freeze Sakuyaza incident positions');
assert(!ERA_INCIDENT_SUPPORT_RULES.evidenceRoleEqualsCombatBoss, 'evidence role may not equal combat Boss');
assert(!ERA_INCIDENT_SUPPORT_RULES.wholeCastMayShareOneRealityIncidentSite, 'whole cast may not share one Reality incident site');
assert(!ERA_INCIDENT_SUPPORT_RULES.runtimeAutoPromotionAllowed, 'evidence/cast matrix may not auto-promote runtime');

assert(eraIncidentEvidenceSupportingCastSummary.incidentCount === 5, 'evidence/cast source must cover five major incidents');
assert(eraIncidentEvidenceSupportingCastSummary.namedRealityLeadCount === 5, 'evidence/cast source must contain five named Reality leads');
assert(eraIncidentEvidenceSupportingCastSummary.uniqueRealityLeadCount === 5, 'Reality leads must be five unique characters');
assert(eraIncidentEvidenceSupportingCastSummary.current21CoveredCount === 21, `Current21 incident coverage must be 21/21, got ${eraIncidentEvidenceSupportingCastSummary.current21CoveredCount}`);
assert(eraIncidentEvidenceSupportingCastSummary.future15CoveredCount === 15, `Future15 candidate coverage must be 15/15, got ${eraIncidentEvidenceSupportingCastSummary.future15CoveredCount}`);
assert(eraIncidentEvidenceSupportingCastSummary.evidenceIdCount === eraIncidentEvidenceSupportingCastSummary.uniqueEvidenceIdCount, 'evidence IDs must be globally unique');
assert(eraIncidentEvidenceSupportingCastSummary.allIncidentsHaveFourEvidenceLayers, 'all incidents must preserve four evidence layers');
assert(eraIncidentEvidenceSupportingCastSummary.allSupportingRealityRolesUnfrozen, 'Core5 exact Reality incident roles must remain unfrozen');
assert(!eraIncidentEvidenceSupportingCastSummary.runtimeAutoPromotionAllowed, 'evidence/cast summary may not auto-promote runtime');

assert(CURRENT21_INCIDENT_SUPPORT_IDS.length === 21 && new Set(CURRENT21_INCIDENT_SUPPORT_IDS).size === 21, 'Current21 support ID registry must be 21 unique IDs');
assert(FUTURE15_INCIDENT_SUPPORT_IDS.length === 15 && new Set(FUTURE15_INCIDENT_SUPPORT_IDS).size === 15, 'Future15 support ID registry must be 15 unique IDs');
assert(new Set(CURRENT21_SEASON_ASSIGNMENTS.map((entry) => entry.id)).size === 21, 'Season architecture Current21 IDs drifted');
assert(new Set(FUTURE15_SEASON_ASSIGNMENTS.map((entry) => entry.id)).size === 15, 'Season architecture Future15 IDs drifted');
for (const id of CURRENT21_INCIDENT_SUPPORT_IDS) {
  assert(CURRENT21_SEASON_ASSIGNMENTS.some((entry) => entry.id === id), `incident support Current21 ID missing from Season architecture: ${id}`);
}
for (const id of FUTURE15_INCIDENT_SUPPORT_IDS) {
  assert(FUTURE15_SEASON_ASSIGNMENTS.some((entry) => entry.id === id), `incident support Future15 ID missing from Season architecture: ${id}`);
}
assert(seasonArchitectureSummary.future15AutoPromotionCount === 0, 'Future15 support use must not promote roster');

const expectedIncidentLeadById = new Map(ERA_MAJOR_INCIDENTS.map((incident) => [incident.id, incident.core5Id]));
for (const incident of ERA_INCIDENT_EVIDENCE_CAST) {
  assert(expectedIncidentLeadById.get(incident.incidentId) === incident.core5LeadId, `incident lead mismatch: ${incident.incidentId}`);
  assert(incident.realityLead.characterId === incident.core5LeadId, `named Reality lead must match Core5 lead: ${incident.incidentId}`);
  assert(incident.realityLead.role === 'REALITY_ERA_LEAD', `Reality lead role drift: ${incident.incidentId}`);
  assert(!incident.realityLead.exactRealityRoleFrozen, `exact Reality role frozen prematurely: ${incident.incidentId}`);
  assert(incident.current21Support.every((entry) => entry.role !== 'REALITY_ERA_LEAD'), `supporting Current21 accidentally became Reality lead: ${incident.incidentId}`);
  assert(incident.future15Support.every((entry) => entry.role === 'FUTURE_SERIES_CANDIDATE'), `Future15 support role drift: ${incident.incidentId}`);
  assert(incident.evidence.official.length >= 3, `official evidence too thin: ${incident.incidentId}`);
  assert(incident.evidence.witness.length >= 3, `witness evidence too thin: ${incident.incidentId}`);
  assert(incident.evidence.physicalOrDigital.length >= 3, `physical/digital evidence too thin: ${incident.incidentId}`);
  assert(incident.evidence.laterInterpretation.length >= 3, `later interpretation too thin: ${incident.incidentId}`);

  for (const support of incident.current21Support) {
    for (const relationId of support.relationshipHooks) {
      assert(currentRelationshipInventoryById.has(relationId), `unknown relationship hook ${relationId} in ${incident.incidentId}/${support.characterId}`);
    }
  }
}

assert(currentRelationshipInventorySummary.total === 24, 'relationship inventory total drifted from 24');
assert(currentRelationshipInventorySummary.exactIncidentFrozenCount === 0, 'relationship inventory may not have exact incident frozen by support matrix');
assert(currentRelationshipInventorySummary.bloodRelationFrozenByInventoryCount === 0, 'relationship inventory may not freeze blood relation');
assert(currentRelationshipInventorySummary.mainMysteryFrozenByInventoryCount === 0, 'relationship inventory may not freeze Main Mystery');

assert(characterRealityRootSummary.total === 36, 'Reality root registry must remain 36/36');
const rootIds = new Set(CHARACTER_REALITY_ROOTS.map((entry) => entry.id));
for (const id of CURRENT21_INCIDENT_SUPPORT_IDS) assert(rootIds.has(id), `Current21 support character missing Reality root: ${id}`);
for (const id of FUTURE15_INCIDENT_SUPPORT_IDS) assert(rootIds.has(id), `Future15 support character missing Reality root: ${id}`);

const tomori = ERA_INCIDENT_EVIDENCE_CAST.find((entry) => entry.incidentId === 'ERA-INC-TOMORI-01');
const michiru = ERA_INCIDENT_EVIDENCE_CAST.find((entry) => entry.incidentId === 'ERA-INC-MICHIRU-01');
const nagi = ERA_INCIDENT_EVIDENCE_CAST.find((entry) => entry.incidentId === 'ERA-INC-NAGI-01');
const yui = ERA_INCIDENT_EVIDENCE_CAST.find((entry) => entry.incidentId === 'ERA-INC-YUI-01');
const asa = ERA_INCIDENT_EVIDENCE_CAST.find((entry) => entry.incidentId === 'ERA-INC-ASA-01');
assert(tomori?.realityLead.characterId === 'tomori', 'Tomori Reality lead drift');
assert(michiru?.realityLead.characterId === 'michiru', 'Michiru Reality lead drift');
assert(nagi?.realityLead.characterId === 'nagi', 'Nagi Reality lead drift');
assert(yui?.realityLead.characterId === 'yui', 'Yui Reality lead drift');
assert(asa?.realityLead.characterId === 'asa', 'Asa Reality lead drift');
assert(tomori?.evidence.laterInterpretation.includes('E-TOMORI-L3_LANTERN_HISTORY_SEPARATE_NON_BLOOD_CHAIN'), 'Tomori/Yui lantern must remain separate non-blood chain');
assert(nagi?.evidence.laterInterpretation.includes('E-NAGI-L2_YUI_FAMILY_PHRASE_CLUE_ONLY'), 'Nagi/Yui lineage must remain clue-only in S1 evidence');
assert(nagi?.evidence.laterInterpretation.includes('E-NAGI-L3_NO_FACE_OR_SURNAME_ONLY_BLOOD_CONFIRMATION'), 'face/surname alone may not confirm Nagi/Yui bloodline');
assert(yui?.evidence.laterInterpretation.includes('E-YUI-L3_S1_LEGIBILITY_PATTERN_WITHOUT_MAIN_MYSTERY_ANSWER'), 'Yui S1 evidence may not answer Main Mystery');
assert(asa?.future15Support.some((entry) => entry.characterId === 'noa'), 'Asa future personhood lane must retain Noa candidate');
assert(asa?.future15Support.some((entry) => entry.characterId === 'rum'), 'Asa future collective-identity lane must retain Rum candidate');

assert(matrix.includes('直接Reality当事者として確定してよいのは、まず**各Era leadのCore5本人だけ**'), 'human matrix must preserve direct-Reality cast boundary');
assert(matrix.includes('Current21 21/21') && matrix.includes('Future15 15/15'), 'human matrix must state full support coverage');
assert(matrix.includes('OFFICIAL RECORD') && matrix.includes('WITNESS VERSION') && matrix.includes('PHYSICAL / DIGITAL EVIDENCE') && matrix.includes('LATER INTERPRETATION'), 'human matrix must preserve four evidence layers');
assert(matrix.includes('Tomori↔Yui lantern history remains **separate object chain**') || matrix.includes('ランタンchain'), 'human matrix must preserve Tomori/Yui object-chain separation');
assert(matrix.includes('exact Nagi→Yui blood reveal = 0'), 'human matrix must preserve S1 Nagi/Yui no-reveal boundary');
assert(matrix.includes('does not promote any Future15 to Current21'), 'human matrix must preserve Future15 non-promotion');
assert(incidentAtlas.includes('combat Bossは別role') || incidentAtlas.includes('Combat Bossは別role'), 'incident Atlas must preserve Boss separation');
assert(ledger.includes('official record') && ledger.includes('witness memory') && ledger.includes('physical evidence') && ledger.includes('later interpretation'), 'historical ledger must preserve evidence separation');
assert(lineageReveal.includes('One object / one photo / one surname is insufficient'), 'lineage reveal map must preserve multi-evidence requirement');

console.log(JSON.stringify({
  incidents: eraIncidentEvidenceSupportingCastSummary.incidentCount,
  current21Covered: eraIncidentEvidenceSupportingCastSummary.current21CoveredCount,
  future15Covered: eraIncidentEvidenceSupportingCastSummary.future15CoveredCount,
  namedRealityLeads: eraIncidentEvidenceSupportingCastSummary.namedRealityLeadCount,
  evidenceIds: eraIncidentEvidenceSupportingCastSummary.evidenceIdCount,
  relationshipHooksValidatedAgainst: currentRelationshipInventorySummary.total,
  future15RosterPromotion: seasonArchitectureSummary.future15AutoPromotionCount,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
