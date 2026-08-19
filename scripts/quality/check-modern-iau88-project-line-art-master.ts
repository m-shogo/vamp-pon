import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { STORY_WORLD_MASTER_SOURCE } from '../../src/game/data/storyWorldMasterSource.ts';

const MASTER_PATH = 'data/visual/modern-iau88-project-line-art-vector-master-v1.json';
const master = JSON.parse(readFileSync(resolve(process.cwd(), MASTER_PATH), 'utf8'));

function fail(message: string): never {
  throw new Error(`[modern-iau88-project-line-art] ${message}`);
}

if (master.schemaVersion !== 1) fail('schemaVersion must be 1');
if (master.masterId !== 'modern-iau88-project-line-art-vector-master-v1') fail('master ID drift');
if (master.status !== 'CURRENT_VECTOR_SYSTEM_SPEC_GEOMETRY_NOT_YET_AUTHORED_HUMAN_REVIEW_REQUIRED') fail('Master must remain a vector system spec until all 88 geometries are source-bound and reviewed');
if (master.format !== 'SVG_VECTOR_SYSTEM_SPEC') fail('authority format must remain SVG vector system spec');
if (master.mandatoryRasterImage !== false) fail('modern constellation Master must not require raster art');
if (master.constellationCount !== 88) fail(`modern standard constellation count must remain 88, got ${master.constellationCount}`);

if (master.authority?.externalResearchBoundary?.standardIdentityAndBoundaryAuthority !== 'INTERNATIONAL_ASTRONOMICAL_UNION_88_CONSTELLATIONS') fail('IAU88 identity/boundary research boundary missing');
if (master.authority?.externalResearchBoundary?.projectLineGeometryAuthority !== 'YORUNO_SHIRUBE_PROJECT_OWNED_NOT_IAU_OFFICIAL_LINE_ART') fail('project-owned line geometry boundary missing');
if (master.authority?.externalResearchBoundary?.historicalFigureAuthority !== 'SEPARATE_SOURCE_BACKED_HISTORICAL_ATLAS_OVERLAY') fail('historical figure overlay boundary missing');

for (const [field, expected] of Object.entries({
  all88LinePathsAuthored: false,
  all88LinePathsHumanReviewed: false,
  generationMayInventMissingLinePaths: false,
  placeholderGeometryMayShipAsFinal: false,
  exactStarCoordinateDatasetBound: false,
})) {
  if (master.geometryState?.[field] !== expected) fail(`geometryState.${field} must be ${String(expected)}`);
}

if (master.identityModel?.stableModernConstellationSet !== 'IAU_88') fail('stable modern set must be IAU_88');
if (master.identityModel?.constellationBoundaryReferenceIsSeparateFromLinePath !== true) fail('boundary reference must remain separate from line path');
if (master.identityModel?.projectLinePathMayNotChangeConstellationMembership !== true) fail('project line path may not change membership');
if (master.identityModel?.projectLinePathMayNotBeCalledIAUOfficialFigure !== true) fail('project line path may not be called IAU official figure');
if (master.identityModel?.historicalFigureMayNotOverwriteModernProjectLinePath !== true) fail('historical figure may not overwrite modern project geometry');
if (master.identityModel?.zodiacGlyphIsNotModernLinePath !== true) fail('zodiac glyph may not substitute for line art');

if (master.svgSystem?.background !== 'TRANSPARENT') fail('vector authority background must be transparent');
if (master.svgSystem?.embeddedRaster !== false) fail('vector authority must not embed raster');
if (master.svgSystem?.decorativeGlowInAuthorityGeometry !== false) fail('vector authority may not bake decorative glow');
if (master.svgSystem?.fillForLineGeometry !== 'none') fail('line geometry fill must remain none');
if (master.svgSystem?.geometryTransformPolicy !== 'NO_NON_UNIFORM_STRETCH_AFTER_APPROVAL') fail('approved geometry may not be non-uniformly stretched');

const requiredRecordFields = new Set(master.requiredPerConstellationRecord ?? []);
for (const field of ['iau-identity-key','project-stable-id','localized-display-name','source-star-identifiers','normalized-star-node-positions','project-line-segments','geometry-version','source-reference','human-review-state','historical-overlay-links']) {
  if (!requiredRecordFields.has(field)) fail(`per-constellation record field missing: ${field}`);
}
if ((master.lineAuthoringRules ?? []).length < 8) fail('line authoring rules are too weak');

if (master.smallScaleDerivatives?.sourceMustBeApprovedVectorMaster !== true) fail('small-scale derivatives must originate from approved vector Master');
for (const forbidden of ['move-star-node','invent-new-star-node','change-constellation-membership','replace-with-zodiac-glyph','replace-with-Star-Beast-silhouette','add-decorative-stars-to-fill-space']) {
  if (!(master.smallScaleDerivatives?.forbidden ?? []).includes(forbidden)) fail(`small-scale forbidden rule missing: ${forbidden}`);
}
if (master.smallScaleDerivatives?.tinyDerivativeCreatesNewMaster !== false) fail('tiny derivative may not create a new Master');

if (master.historicalArchiveBoundary?.modernProjectGeometryIsStableReference !== true) fail('modern project geometry must be stable reference');
if (master.historicalArchiveBoundary?.historicalConstellationSetMayDifferByEra !== true) fail('historical constellation set must be allowed to differ by era');
if (master.historicalArchiveBoundary?.historicalFiguresRequireSourceCitation !== true) fail('historical figures must require source citation');
if (master.historicalArchiveBoundary?.historicalOverlayMayBeCalledIAUOfficialModernLineArt !== false) fail('historical overlay may not be called IAU official modern line art');
if (master.historicalArchiveBoundary?.projectModernLinePathMayBePresentedAsHistoricalFact !== false) fail('project line geometry may not be presented as historical fact');

if (STORY_WORLD_MASTER_SOURCE.sky.constellationSameAcrossErasRequired !== false) fail('Story world no longer allows constellation differences across eras; review Master needed');
if (STORY_WORLD_MASTER_SOURCE.sky.lostOldConstellationsAllowed !== true || STORY_WORLD_MASTER_SOURCE.sky.newlyCreatedLaterConstellationsAllowed !== true) fail('Story world historical constellation change boundary drift');
if (STORY_WORLD_MASTER_SOURCE.sky.finalConstellationChangeCauseFrozen !== false) fail('constellation change cause must remain OPEN');

for (const field of ['thisMasterClaimsIAUOfficialLineFigures','thisMasterCreatesHistoricalFacts','thisMasterCreatesConstellationMembership','thisMasterCreatesStarCoordinates','thisMasterCreatesStarBeastCanon','generatedLineArtCreatesCanon','imageGenerationAuthorized','vectorGeometryAuthoringAuthorizedBeforeDatasetBinding']) {
  if (master.authorityBoundary?.[field] !== false) fail(`authority boundary weakened: ${field}`);
}
if (master.authorityBoundary?.humanReviewRequired !== true) fail('Human review must remain required');

console.log(JSON.stringify({
  status: 'PASS',
  masterId: master.masterId,
  constellationCount: master.constellationCount,
  geometryAuthored: master.geometryState.all88LinePathsAuthored,
  coordinateDatasetBound: master.geometryState.exactStarCoordinateDatasetBound,
  historicalConstellationSetMayDifferByEra: master.historicalArchiveBoundary.historicalConstellationSetMayDifferByEra,
  claimsIAUOfficialLineFigures: master.authorityBoundary.thisMasterClaimsIAUOfficialLineFigures,
  vectorGeometryAuthoringAuthorized: master.authorityBoundary.vectorGeometryAuthoringAuthorizedBeforeDatasetBinding,
  imageGenerationAuthorized: master.authorityBoundary.imageGenerationAuthorized,
}, null, 2));
