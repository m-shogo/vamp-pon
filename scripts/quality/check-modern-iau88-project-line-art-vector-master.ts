import { readFileSync } from 'node:fs';
import { CONSTELLATION_STORY_CLUE_RULES } from '../../src/game/data/constellationStoryClueReservoir.ts';
import { STORY_WORLD_MASTER_SOURCE } from '../../src/game/data/storyWorldMasterSource.ts';

const PATH = 'data/visual/modern-iau88-project-line-art-vector-master-v1.json';
const master = JSON.parse(readFileSync(PATH, 'utf8'));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(master.schemaVersion === 1, 'IAU88 vector-system schemaVersion drift');
assert(master.masterId === 'modern-iau88-project-line-art-vector-master-v1', 'IAU88 master ID drift');
assert(master.status === 'CURRENT_VECTOR_SYSTEM_SPEC_GEOMETRY_NOT_YET_AUTHORED_HUMAN_REVIEW_REQUIRED', 'IAU88 status must preserve geometry-pending Human-review boundary');
assert(master.format === 'SVG_VECTOR_SYSTEM_SPEC', 'IAU88 master must remain a vector-system spec');
assert(master.mandatoryRasterImage === false, 'IAU88 system may not require a raster authority image');
assert(master.constellationCount === 88, 'modern project constellation set count must remain 88');

assert(master.authority?.projectStorySource === CONSTELLATION_STORY_CLUE_RULES.authority.replace('docs/constellation-story-clue-reservoir-v1.md', 'src/game/data/constellationStoryClueReservoir.ts') || master.authority?.projectStorySource === 'src/game/data/constellationStoryClueReservoir.ts', 'IAU88 project Story source drift');
assert(master.authority?.worldMaster === 'src/game/data/storyWorldMasterSource.ts', 'IAU88 world-master source drift');
assert(master.authority?.externalResearchBoundary?.standardIdentityAndBoundaryAuthority === 'INTERNATIONAL_ASTRONOMICAL_UNION_88_CONSTELLATIONS', 'IAU88 standard identity/boundary authority drift');
assert(master.authority?.externalResearchBoundary?.projectLineGeometryAuthority === 'YORUNO_SHIRUBE_PROJECT_OWNED_NOT_IAU_OFFICIAL_LINE_ART', 'project line geometry must remain project-owned and non-IAU-official');
assert(master.authority?.externalResearchBoundary?.historicalFigureAuthority === 'SEPARATE_SOURCE_BACKED_HISTORICAL_ATLAS_OVERLAY', 'historical atlas overlay boundary drift');

assert(master.geometryState?.all88LinePathsAuthored === false, 'must not claim all 88 line paths authored');
assert(master.geometryState?.all88LinePathsHumanReviewed === false, 'must not claim all 88 line paths Human-reviewed');
assert(master.geometryState?.generationMayInventMissingLinePaths === false, 'generation may not invent missing constellation geometry');
assert(master.geometryState?.placeholderGeometryMayShipAsFinal === false, 'placeholder constellation geometry may not ship as final');
assert(master.geometryState?.exactStarCoordinateDatasetBound === false, 'star-coordinate dataset must remain explicitly unbound until source-backed binding work');
assert(typeof master.geometryState?.nextGate === 'string' && master.geometryState.nextGate.includes('source-backed'), 'IAU88 next gate must require source-backed dataset binding');

assert(master.identityModel?.stableModernConstellationSet === 'IAU_88', 'modern constellation identity set drift');
assert(master.identityModel?.constellationBoundaryReferenceIsSeparateFromLinePath === true, 'constellation boundary and project line path must remain separate');
assert(master.identityModel?.projectLinePathMayNotChangeConstellationMembership === true, 'project line path may not redefine constellation membership');
assert(master.identityModel?.projectLinePathMayNotBeCalledIAUOfficialFigure === true, 'project line path may not be called an IAU official figure');
assert(master.identityModel?.historicalFigureMayNotOverwriteModernProjectLinePath === true, 'historical figure may not overwrite modern project geometry');
assert(master.identityModel?.zodiacGlyphIsNotModernLinePath === true, 'zodiac glyph may not substitute for modern project line path');

assert(master.svgSystem?.background === 'TRANSPARENT', 'IAU88 vector authority background must stay transparent');
assert(master.svgSystem?.embeddedRaster === false, 'IAU88 vector authority may not embed raster');
assert(master.svgSystem?.decorativeGlowInAuthorityGeometry === false, 'authority geometry may not bake decorative glow');
assert(master.svgSystem?.textInsideGeometry === false, 'authority geometry may not bake labels/text into the path system');
assert(master.svgSystem?.geometryTransformPolicy === 'NO_NON_UNIFORM_STRETCH_AFTER_APPROVAL', 'approved star geometry may not be non-uniformly stretched');

for (const required of [
  'iau-identity-key',
  'project-stable-id',
  'localized-display-name',
  'source-star-identifiers',
  'normalized-star-node-positions',
  'project-line-segments',
  'geometry-version',
  'source-reference',
  'human-review-state',
  'historical-overlay-links',
]) {
  assert(Array.isArray(master.requiredPerConstellationRecord) && master.requiredPerConstellationRecord.includes(required), `IAU88 per-constellation record requirement missing: ${required}`);
}

for (const forbidden of [
  'move-star-node',
  'invent-new-star-node',
  'change-constellation-membership',
  'replace-with-zodiac-glyph',
  'replace-with-Star-Beast-silhouette',
  'add-decorative-stars-to-fill-space',
]) {
  assert(master.smallScaleDerivatives?.forbidden?.includes(forbidden), `IAU88 tiny-derivative guard missing: ${forbidden}`);
}
assert(master.smallScaleDerivatives?.sourceMustBeApprovedVectorMaster === true, 'small-scale derivative must parent from approved vector master');
assert(master.smallScaleDerivatives?.tinyDerivativeCreatesNewMaster === false, 'tiny derivative may not create competing Master authority');

assert(master.historicalArchiveBoundary?.modernProjectGeometryIsStableReference === true, 'modern project geometry must remain stable reference after approval');
assert(master.historicalArchiveBoundary?.historicalConstellationSetMayDifferByEra === STORY_WORLD_MASTER_SOURCE.sky.constellationSameAcrossErasRequired === false ? true : master.historicalArchiveBoundary?.historicalConstellationSetMayDifferByEra, 'historical constellation-set era boundary drift');
assert(master.historicalArchiveBoundary?.historicalFiguresRequireSourceCitation === true, 'historical figures require source citation');
assert(master.historicalArchiveBoundary?.historicalOverlayMayBeCalledIAUOfficialModernLineArt === false, 'historical overlay may not be called IAU modern official line art');
assert(master.historicalArchiveBoundary?.projectModernLinePathMayBePresentedAsHistoricalFact === false, 'project modern line path may not be presented as historical fact');

for (const forbiddenClaim of [
  'claim-project-connect-the-stars-geometry-is-IAU-official-line-art',
  'claim-historical-atlas-figure-is-modern-IAU-standard-line-art',
  'generate-missing-line-paths-without-source-backed-star-dataset',
  'let-Star-Beast-art-create-constellation-geometry',
]) {
  assert(master.forbiddenClaimsAndShortcuts?.includes(forbiddenClaim), `IAU88 forbidden claim missing: ${forbiddenClaim}`);
}

assert(master.authorityBoundary?.thisMasterClaimsIAUOfficialLineFigures === false, 'system spec may not claim IAU official line figures');
assert(master.authorityBoundary?.thisMasterCreatesHistoricalFacts === false, 'system spec may not create historical facts');
assert(master.authorityBoundary?.thisMasterCreatesConstellationMembership === false, 'system spec may not create constellation membership');
assert(master.authorityBoundary?.thisMasterCreatesStarCoordinates === false, 'system spec may not create star coordinates');
assert(master.authorityBoundary?.thisMasterCreatesStarBeastCanon === false, 'system spec may not create Star Beast Canon');
assert(master.authorityBoundary?.generatedLineArtCreatesCanon === false, 'generated line art may not create Canon');
assert(master.authorityBoundary?.humanReviewRequired === true, 'IAU88 vector geometry requires Human review');
assert(master.authorityBoundary?.imageGenerationAuthorized === false, 'IAU88 system spec may not authorize image generation');
assert(master.authorityBoundary?.vectorGeometryAuthoringAuthorizedBeforeDatasetBinding === false, 'vector geometry authoring must remain blocked before dataset binding');

assert(STORY_WORLD_MASTER_SOURCE.sky.constellationSameAcrossErasRequired === false, 'Story World must allow constellation-set differences across eras');
assert(STORY_WORLD_MASTER_SOURCE.sky.lostOldConstellationsAllowed === true, 'Story World historical sky must preserve lost constellation possibility');
assert(CONSTELLATION_STORY_CLUE_RULES.clueMayPromoteObsoleteConstellationToModernOfficial === false, 'historical clue may not promote obsolete constellation to modern official status');
assert(CONSTELLATION_STORY_CLUE_RULES.dreamCanUseArchiveLayerWithoutRealityRetcon === true, 'archive layer must remain usable without Reality retcon');

console.log(JSON.stringify({
  status: 'PASS',
  masterId: master.masterId,
  constellationCount: master.constellationCount,
  format: master.format,
  all88LinePathsAuthored: master.geometryState.all88LinePathsAuthored,
  exactStarCoordinateDatasetBound: master.geometryState.exactStarCoordinateDatasetBound,
  claimsIAUOfficialLineFigures: master.authorityBoundary.thisMasterClaimsIAUOfficialLineFigures,
  historicalFiguresRequireSourceCitation: master.historicalArchiveBoundary.historicalFiguresRequireSourceCitation,
  humanReviewRequired: master.authorityBoundary.humanReviewRequired,
  imageGenerationAuthorized: master.authorityBoundary.imageGenerationAuthorized,
}, null, 2));
