import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const TAXONOMY_PATH = 'data/visual/gunjo-record-taxonomy-system-master-v1.json';
const EVIDENCE_PATH = 'data/visual/gunjo-record-medium-evidence-master-v1.json';
const OVERLAY_PATH = 'data/character-assets/manifests/visual-current-group-record-master.v1.json';
const CURRENT_DOC_PATH = 'docs/gunjo-zankyoroku-current-v1.md';

function readJson(path: string): any {
  return JSON.parse(readFileSync(resolve(process.cwd(), path), 'utf8'));
}
function fail(message: string): never {
  throw new Error(`[gunjo-record-foundation] ${message}`);
}

const taxonomy = readJson(TAXONOMY_PATH);
const evidence = readJson(EVIDENCE_PATH);
const overlay = readJson(OVERLAY_PATH);
const currentDoc = readFileSync(resolve(process.cwd(), CURRENT_DOC_PATH), 'utf8');

if (taxonomy.masterId !== 'gunjo-record-taxonomy-system-master-v1') fail('taxonomy master ID drift');
if (evidence.masterId !== 'gunjo-record-medium-evidence-master-v1') fail('evidence master ID drift');
if (taxonomy.mandatoryRasterImage !== false || evidence.mandatoryRasterImage !== false) fail('Gunjo foundation Masters must not force raster generation');
if (taxonomy.authorityBoundary?.imageGenerationAuthorized !== false || evidence.authorityBoundary?.imageGenerationAuthorized !== false) fail('foundation Master specs may not authorize image generation');
if (taxonomy.authorityBoundary?.humanReviewRequired !== true || evidence.authorityBoundary?.humanReviewRequired !== true) fail('Human review boundary missing');

for (const [label, value] of [
  ['taxonomy.isOrganization', taxonomy.currentDefinition?.isOrganization],
  ['taxonomy.isAntagonistTeam', taxonomy.currentDefinition?.isAntagonistTeam],
  ['taxonomy.isFixedBossRoster', taxonomy.currentDefinition?.isFixedBossRoster],
]) {
  if (value !== false) fail(`${label} must remain false`);
}
if (taxonomy.currentDefinition?.fixedMemberCount !== null) fail('formal member count must remain OPEN/null');
if (taxonomy.currentDefinition?.formalMembersFrozen !== false || taxonomy.currentDefinition?.exactIncidentsFrozen !== false || taxonomy.currentDefinition?.exactYearsFrozen !== false) fail('members/incidents/years must remain open');

const requiredCategories = ['central-person', 'central-people', 'institution-system', 'social-pressure'];
const categoryIds = (taxonomy.taxonomy?.centralSubjectCategories ?? []).map((entry: any) => entry.id);
for (const id of requiredCategories) if (!categoryIds.includes(id)) fail(`taxonomy category missing: ${id}`);

const relationValues = taxonomy.taxonomy?.sakuyazaRelation?.values ?? [];
for (const value of ['COOPERATED','USED_SAKUYAZA','WAS_USED_BY_SAKUYAZA','OPPOSED','WAS_STOPPED_BY','TRIED_TO_STOP','TEMPORARY_ALIGNMENT','NO_DIRECT_CONTACT','UNKNOWN']) {
  if (!relationValues.includes(value)) fail(`Sakuyaza relation value missing: ${value}`);
}
if (taxonomy.taxonomy?.sakuyazaRelation?.doesNotImplyHierarchy !== true) fail('Sakuyaza relation may not imply hierarchy');

if (taxonomy.combatBoundary?.incidentCentralSubjectEqualsCombatBossByDefault !== false) fail('incident central subject may not default to combat Boss');
if (taxonomy.combatBoundary?.defeatingBossMayImplySocialProblemSolved !== false) fail('Boss defeat may not imply social problem resolution');
if ((taxonomy.formalAdmissionGate ?? []).length !== 10) fail('formal admission gate must preserve ten Current checks');

const openFields = new Set(taxonomy.openFields ?? []);
for (const field of ['formal-member-count','formal-members','full-names','exact-years','exact-incidents','exact-victim-counts','exact-places','combat-boss-assignments','final-salvation-or-ending-per-subject']) {
  if (!openFields.has(field)) fail(`taxonomy OPEN field missing: ${field}`);
}

const mediumIds = (evidence.recordMediumFamilies ?? []).map((entry: any) => entry.id);
for (const id of ['newspaper-or-periodical','photograph','minutes-or-organizational-document','register-or-name-record','book-or-archival-volume','digital-record','incident-file-or-evidence-bundle']) {
  if (!mediumIds.includes(id)) fail(`record medium family missing: ${id}`);
}
const evidenceStates = new Set((evidence.evidenceStates ?? []).map((entry: any) => entry.id));
for (const id of ['confirmed-current-source','candidate','source-disagreement','redacted','missing','later-corrected','unknown']) {
  if (!evidenceStates.has(id)) fail(`evidence state missing: ${id}`);
}
if (evidence.identityReveal?.eachStepRequiresAdmittedEvidence !== true) fail('identity reveal must require admitted evidence');
if (evidence.identityReveal?.candidateFullNameMayRenderAsFact !== false || evidence.identityReveal?.generatedDocumentMayCreateName !== false) fail('candidate/generated record may not create full-name fact');
if (evidence.provenanceModel?.correctionHistoryAppendOnlyByDefault !== true || evidence.provenanceModel?.silentReplacementForbidden !== true) fail('record correction provenance boundary weakened');
if (evidence.guideLorebookReuse?.longReadableTextBakedIntoRaster !== false) fail('long readable record text may not be baked into raster');
if (evidence.guideLorebookReuse?.sameEvidenceAssetReusedByReference !== true) fail('same evidence asset should be reused by reference');

for (const field of ['thisMasterCreatesDocuments','thisMasterCreatesEvidence','thisMasterCreatesIncidents','thisMasterCreatesNames','thisMasterCreatesDates','thisMasterCreatesPlaces','thisMasterCreatesInstitutions','generatedRecordArtCreatesCanon']) {
  if (evidence.authorityBoundary?.[field] !== false) fail(`evidence authority boundary weakened: ${field}`);
}
for (const field of ['thisMasterCreatesIncidentCanon','thisMasterCreatesMembers','thisMasterCreatesFullNames','thisMasterCreatesExactYears','thisMasterCreatesCombatBossAssignments','generatedGraphicsCreateCanon']) {
  if (taxonomy.authorityBoundary?.[field] !== false) fail(`taxonomy authority boundary weakened: ${field}`);
}

const foundationIds = (overlay.gunjoZankyoroku?.foundationMasters ?? []).map((entry: any) => entry.masterId);
if (JSON.stringify(foundationIds) !== JSON.stringify([taxonomy.masterId, evidence.masterId])) fail(`overlay foundation IDs must equal structured Master IDs: ${foundationIds.join(', ')}`);
if (overlay.gunjoZankyoroku?.foundationMasterIdMigration?.canonicalRecordMediumMasterId !== evidence.masterId) fail('overlay canonical evidence ID mismatch');
if (overlay.gunjoZankyoroku?.foundationMasterIdMigration?.supersededPlanningIdMayReceiveNewAssets !== false) fail('superseded Gunjo planning ID may not receive assets');

for (const phrase of ['record taxonomy', 'formal member count', 'formal members', 'exact incidents']) {
  if (!currentDoc.includes(phrase)) fail(`Current Gunjo authority no longer exposes expected OPEN/taxonomy boundary: ${phrase}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  taxonomyMasterId: taxonomy.masterId,
  evidenceMasterId: evidence.masterId,
  rasterGenerationRequired: false,
  centralSubjectCategories: requiredCategories.length,
  recordMediumFamilies: mediumIds.length,
  evidenceStates: evidenceStates.size,
  fixedMemberCount: taxonomy.currentDefinition.fixedMemberCount,
  imageGenerationAuthorized: false,
}, null, 2));
