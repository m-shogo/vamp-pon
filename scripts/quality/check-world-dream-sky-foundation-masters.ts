import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { STORY_WORLD_MASTER_SOURCE } from '../../src/game/data/storyWorldMasterSource.ts';
import { DREAM_SOCIAL_WORLD_RULES } from '../../src/game/data/dreamSocialWorldSource.ts';

const DREAM_PATH = 'data/visual/dream-common-daily-life-infrastructure-master-v1.json';
const SKY_PATH = 'data/visual/world-sky-moon-resolution-color-script-master-v1.json';

function readJson(path: string): any {
  return JSON.parse(readFileSync(resolve(process.cwd(), path), 'utf8'));
}
function fail(message: string): never {
  throw new Error(`[world-dream-sky-foundation] ${message}`);
}

const dream = readJson(DREAM_PATH);
const sky = readJson(SKY_PATH);

if (dream.masterId !== 'dream-common-daily-life-infrastructure-master-v1') fail('Dream infrastructure master ID drift');
if (sky.masterId !== 'world-sky-moon-resolution-color-script-master-v1') fail('sky/moon master ID drift');
if (dream.mandatoryRasterImage !== false || sky.mandatoryRasterImage !== false) fail('foundation specs must not require raster images');
if (dream.authorityBoundary?.imageGenerationAuthorized !== false || sky.authorityBoundary?.imageGenerationAuthorized !== false) fail('foundation specs may not authorize image generation');
if (dream.authorityBoundary?.humanReviewRequired !== true || sky.authorityBoundary?.humanReviewRequired !== true) fail('Human review requirement missing');

if (dream.worldBoundary?.survivalSim !== STORY_WORLD_MASTER_SOURCE.dreamLiving.survivalSim) fail('Dream survivalSim drift');
if (dream.worldBoundary?.normalEconomyRequired !== STORY_WORLD_MASTER_SOURCE.dreamLiving.normalEconomyRequired) fail('Dream economy boundary drift');
if (dream.worldBoundary?.physicalMorningExists !== STORY_WORLD_MASTER_SOURCE.yoruNoShirube.physicalMorningExists) fail('Dream physical morning boundary drift');
if (dream.worldBoundary?.returnMode !== STORY_WORLD_MASTER_SOURCE.yoruNoShirube.returnMode) fail('Dream return mode drift');
if (dream.provisioning?.mode !== STORY_WORLD_MASTER_SOURCE.dreamLiving.provisioningMode) fail('Dream provisioning mode drift');
if (dream.provisioning?.directHandOrAirFoodMaterializationAllowed !== STORY_WORLD_MASTER_SOURCE.dreamLiving.directHandOrAirFoodMaterializationAllowed) fail('direct food materialization boundary drift');

const expectedSurfaces = [...STORY_WORLD_MASTER_SOURCE.dreamLiving.provisioningSurfaces];
if (JSON.stringify(dream.provisioning?.surfaces) !== JSON.stringify(expectedSurfaces)) fail('Dream provisioning surface set drift');
const expectedEasy = [...STORY_WORLD_MASTER_SOURCE.dreamLiving.easyProvisioning];
if (JSON.stringify(dream.provisioning?.easyProvisioning) !== JSON.stringify(expectedEasy)) fail('Dream easy provisioning set drift');
if (JSON.stringify(dream.wishCannotOverride) !== JSON.stringify([...STORY_WORLD_MASTER_SOURCE.dreamLiving.wishCannotOverride])) fail('Dream wishCannotOverride set drift');
if (dream.provisioning?.mode !== DREAM_SOCIAL_WORLD_RULES.provisioningMode) fail('Dream derived social source disagrees on provisioning mode');

for (const zoneId of ['food-storage-zone','food-preparation-zone','drink-storage-zone','adult-liquor-storage-zone','rest-zone','basic-living-storage-zone','post-confrontation-social-zone']) {
  if (!(dream.sharedZones ?? []).some((zone: any) => zone.id === zoneId)) fail(`Dream shared zone missing: ${zoneId}`);
}
const openInfrastructure = new Set(dream.notYetAuthorizedAsFixedInfrastructure ?? []);
for (const field of ['exact-bath-or-shower-layout','exact-washing-facility','exact-changing-room','exact-bedroom-count','exact-private-room-assignment']) {
  if (!openInfrastructure.has(field)) fail(`Dream infrastructure OPEN guard missing: ${field}`);
}
for (const field of ['thisMasterCreatesExactArchitecture','thisMasterCreatesPersonalRooms','thisMasterCreatesRelationships','thisMasterCreatesUniqueObjects','thisMasterCreatesIncidentEvidence','thisMasterCreatesCommercialBrands','generatedInfrastructureCreatesCanon']) {
  if (dream.authorityBoundary?.[field] !== false) fail(`Dream authority boundary weakened: ${field}`);
}

if (sky.skyInvariants?.starsVisible !== STORY_WORLD_MASTER_SOURCE.sky.starsVisible) fail('starsVisible drift');
if (sky.skyInvariants?.starsCoreVisualIdentity !== STORY_WORLD_MASTER_SOURCE.sky.starsCoreVisualIdentity) fail('starsCoreVisualIdentity drift');
if (sky.skyInvariants?.constellationSameAcrossErasRequired !== STORY_WORLD_MASTER_SOURCE.sky.constellationSameAcrossErasRequired) fail('cross-era constellation rule drift');
if (sky.skyInvariants?.lostOldConstellationsAllowed !== STORY_WORLD_MASTER_SOURCE.sky.lostOldConstellationsAllowed) fail('lost constellation rule drift');
if (sky.skyInvariants?.newlyCreatedLaterConstellationsAllowed !== STORY_WORLD_MASTER_SOURCE.sky.newlyCreatedLaterConstellationsAllowed) fail('new constellation rule drift');
if (sky.skyInvariants?.finalConstellationChangeCauseFrozen !== STORY_WORLD_MASTER_SOURCE.sky.finalConstellationChangeCauseFrozen) fail('constellation cause OPEN boundary drift');
if (sky.skyInvariants?.realAstronomyIsDreamAbsoluteConstraint !== STORY_WORLD_MASTER_SOURCE.sky.realAstronomyIsDreamAbsoluteConstraint) fail('real astronomy Dream boundary drift');

if (sky.moonInvariants?.meaning !== STORY_WORLD_MASTER_SOURCE.moon.meaning) fail('moon meaning drift');
if (sky.moonInvariants?.elapsedTimeClock !== STORY_WORLD_MASTER_SOURCE.moon.elapsedTimeClock) fail('moon clock boundary drift');
if (sky.moonInvariants?.fixedFiveStageProgression !== STORY_WORLD_MASTER_SOURCE.moon.fixedFiveStageProgression) fail('moon fixed-stage boundary drift');
if (sky.moonInvariants?.deepestPhase !== STORY_WORLD_MASTER_SOURCE.moon.deepestPhase) fail('deepest moon phase drift');
if (sky.moonInvariants?.starsRemainAtSaku !== STORY_WORLD_MASTER_SOURCE.moon.starsRemainAtSaku) fail('stars-at-Saku rule drift');
if (sky.moonInvariants?.fixedEraBossRequiredAtSaku !== STORY_WORLD_MASTER_SOURCE.moon.fixedEraBossRequiredAtSaku) fail('fixed Boss at Saku boundary drift');

if (sky.returnAndResolutionBoundary?.physicalMorningExists !== STORY_WORLD_MASTER_SOURCE.yoruNoShirube.physicalMorningExists) fail('sky physical morning boundary drift');
if (sky.returnAndResolutionBoundary?.physicalSunriseReturnAllowed !== STORY_WORLD_MASTER_SOURCE.yoruNoShirube.physicalSunriseReturnAllowed) fail('physical sunrise return boundary drift');
if (sky.returnAndResolutionBoundary?.returnMode !== STORY_WORLD_MASTER_SOURCE.yoruNoShirube.returnMode) fail('sky return mode drift');
if (sky.returnAndResolutionBoundary?.resolutionWakingMemoryRecoveryDirection !== STORY_WORLD_MASTER_SOURCE.yoruNoShirube.resolutionWakingMemoryRecoveryDirection) fail('resolution waking direction drift');
if (sky.returnAndResolutionBoundary?.exactResolutionSkyPaletteFrozen !== false || sky.returnAndResolutionBoundary?.exactResolutionBrightnessFrozen !== false || sky.returnAndResolutionBoundary?.exactResolutionMoonPhaseFrozen !== false) fail('resolution visual details must remain OPEN');
if (sky.returnAndResolutionBoundary?.resolutionMayBeDepictedAsOrdinaryPhysicalSunriseByDefault !== false) fail('resolution may not default to physical sunrise');

const saku = (sky.stateGraph ?? []).find((state: any) => state.id === 'saku-moonless');
if (!saku || saku.moonState !== 'SAKU_MOONLESS' || saku.stars !== 'VISIBLE') fail('Saku state must remain moonless with visible stars');
const resolution = (sky.stateGraph ?? []).find((state: any) => state.id === 'resolution-transition');
if (!resolution || resolution.palette !== 'OPEN_HUMAN_AUTHORING_REQUIRED') fail('resolution palette must remain Human-authored OPEN');

for (const field of ['thisMasterCreatesExactMoonSequence','thisMasterCreatesConstellationChangeCause','thisMasterCreatesPhysicalSunrise','thisMasterCreatesExactDate','thisMasterCreatesIncidentCanon','generatedSkyCreatesCanon']) {
  if (sky.authorityBoundary?.[field] !== false) fail(`Sky authority boundary weakened: ${field}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  dreamMasterId: dream.masterId,
  provisioningMode: dream.provisioning.mode,
  provisioningSurfaceCount: dream.provisioning.surfaces.length,
  sharedZoneCount: dream.sharedZones.length,
  skyMasterId: sky.masterId,
  starsVisible: sky.skyInvariants.starsVisible,
  deepestMoonPhase: sky.moonInvariants.deepestPhase,
  physicalSunriseReturnAllowed: sky.returnAndResolutionBoundary.physicalSunriseReturnAllowed,
  exactResolutionPaletteFrozen: sky.returnAndResolutionBoundary.exactResolutionSkyPaletteFrozen,
  imageGenerationAuthorized: false,
}, null, 2));
