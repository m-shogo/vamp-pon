import { readFileSync } from 'node:fs';

const PLAN = 'data/visual/modern-iau88-dataset-binding-plan-v1.json';
const MASTER = 'data/visual/modern-iau88-project-line-art-vector-master-v1.json';
const plan = JSON.parse(readFileSync(PLAN, 'utf8'));
const master = JSON.parse(readFileSync(MASTER, 'utf8'));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(plan.schemaVersion === 1, 'IAU88 binding plan schema drift');
assert(plan.status === 'SOURCE_SELECTION_DEFINED_DATA_NOT_YET_VENDORED_OR_BOUND', 'IAU88 binding plan state drift');
assert(plan.targetMaster === MASTER, 'IAU88 binding target Master drift');
assert(plan.sourceRoles?.constellationIdentityAndBoundary?.authority === 'INTERNATIONAL_ASTRONOMICAL_UNION', 'IAU must remain boundary/identity authority');
assert(plan.sourceRoles?.constellationIdentityAndBoundary?.coordinateFrame === 'J2000_AS_PUBLISHED_BY_IAU_BOUNDARY_TXT', 'IAU boundary frame must remain J2000');
assert(plan.sourceRoles?.constellationIdentityAndBoundary?.mayDefineProjectLineSegments === false, 'IAU boundary source may not define project line segments');
assert(plan.sourceRoles?.starIdentifierAndPosition?.authority === 'ESA_HIPPARCOS_CATALOGUE', 'Hipparcos must remain selected star identifier/position source');
assert(plan.sourceRoles?.starIdentifierAndPosition?.stableIdentifier === 'HIP', 'HIP must remain stable star identifier');
assert(plan.sourceRoles?.starIdentifierAndPosition?.catalogueEpoch === 'J1991.25_NATIVE_HIPPARCOS', 'Hipparcos native epoch drift');
assert(plan.sourceRoles?.starIdentifierAndPosition?.requiresFrameEpochNormalizationBeforeBoundaryOrSVGUse === true, 'Hipparcos positions must be normalized before J2000 boundary/SVG use');
assert(plan.sourceRoles?.machineReadableBoundaryCrossCheck?.authority === 'CDS_VI_49_DAVENHALL_LEGGETT_CONSTELLATION_BOUNDARY_DATA', 'CDS VI/49 cross-check source drift');
assert(plan.sourceRoles?.machineReadableBoundaryCrossCheck?.mayReplaceIAUAuthority === false, 'CDS may not replace IAU boundary authority');
assert(plan.sourceRoles?.projectLineGeometry?.authority === 'YORUNO_SHIRUBE_PROJECT', 'project line geometry authority drift');
assert(plan.sourceRoles?.projectLineGeometry?.mayBeCalledIAUOfficialLineArt === false, 'project line geometry may never be called IAU official line-art');
assert(plan.sourceRoles?.projectLineGeometry?.mustPreserveSourceStarPositions === true, 'project line graph must preserve source star positions');

for (const key of [
  'licenseRedistributionReviewComplete',
  'sourceFilesVendored',
  'sourceChecksumsRecorded',
  'coordinateNormalizationImplemented',
  'exactStarCoordinateDatasetBound',
  'all88ConstellationMembershipResolved',
  'all88LinePathsAuthored',
  'imageGenerationAuthorized',
  'vectorGeometryAuthoringAuthorized',
]) {
  assert(plan.currentState?.[key] === false, `IAU88 pre-binding boundary must remain false: ${key}`);
}
assert(plan.currentState?.sourceAuthoritiesSelected === true, 'IAU88 source authorities must be selected');
assert(plan.currentState?.iauBoundarySourceSelected === true, 'IAU boundary source must be selected');
assert(plan.currentState?.hipparcosStarSourceSelected === true, 'Hipparcos source must be selected');
assert(plan.currentState?.machineReadableBoundaryCrossCheckSelected === true, 'CDS VI/49 cross-check must be selected');
assert(Array.isArray(plan.hardVetoes) && plan.hardVetoes.length >= 8, 'IAU88 binding plan hard-veto coverage missing');
assert(Array.isArray(plan.requiredBindingManifestFields) && plan.requiredBindingManifestFields.length >= 10, 'IAU88 binding manifest contract incomplete');

assert(master.geometryState?.exactStarCoordinateDatasetBound === false, 'IAU88 Master may not claim star dataset bound yet');
assert(master.geometryState?.all88LinePathsAuthored === false, 'IAU88 Master may not claim line paths authored yet');
assert(master.authorityBoundary?.vectorGeometryAuthoringAuthorizedBeforeDatasetBinding === false, 'IAU88 Master may not allow geometry before dataset binding');
assert(master.authorityBoundary?.imageGenerationAuthorized === false, 'IAU88 Master may not authorize image generation');

console.log(JSON.stringify({
  status: 'PASS',
  boundaryAuthority: plan.sourceRoles.constellationIdentityAndBoundary.authority,
  starCoordinateAuthority: plan.sourceRoles.starIdentifierAndPosition.authority,
  machineReadableBoundaryCrossCheck: plan.sourceRoles.machineReadableBoundaryCrossCheck.authority,
  projectLineGeometryAuthority: plan.sourceRoles.projectLineGeometry.authority,
  exactStarCoordinateDatasetBound: false,
  all88LinePathsAuthored: false,
  imageGenerationAuthorized: false,
}, null, 2));
