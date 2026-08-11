import fs from 'node:fs';
import { CHARACTER_REALITY_ROOTS, REALITY_ROOT_RULES, characterRealityRootSummary } from '../../src/game/data/characterRealityRootRegistry.ts';
import {
  REALITY_ROOT_LIVING_PLACE_RULES,
  REALITY_ROOT_LIVING_PLACE_RESERVOIR,
  realityRootLivingPlaceSummary,
} from '../../src/game/data/realityRootLivingPlaceReservoir.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const path of [
  'docs/00-current-story-world-master.md',
  'docs/character-reality-root-registry-v1.md',
  'docs/character-ordinary-life-reservoir-v1.md',
  'docs/reality-root-living-place-reservoir-v1.md',
  'src/game/data/characterRealityRootRegistry.ts',
  'src/game/data/realityRootLivingPlaceReservoir.ts',
]) assert(fs.existsSync(path), `missing living-place source: ${path}`);

assert(REALITY_ROOT_LIVING_PLACE_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'living-place layer must remain reservoir');
assert(REALITY_ROOT_LIVING_PLACE_RULES.characterCoverageRequired === 36, 'living-place character target drift');
assert(REALITY_ROOT_LIVING_PLACE_RULES.anchorsPerCharacterRequired === 4, 'living-place anchors-per-character target drift');
assert(REALITY_ROOT_LIVING_PLACE_RULES.totalAnchorSeedsRequired === 144, 'living-place total anchor target drift');
assert(!REALITY_ROOT_LIVING_PLACE_RULES.exactVenueFrozenHere, 'exact venue may not be frozen here');
assert(!REALITY_ROOT_LIVING_PLACE_RULES.exactHomeAddressFrozenHere, 'exact home address may not be frozen here');
assert(!REALITY_ROOT_LIVING_PLACE_RULES.exactBusinessFrozenHere, 'exact business may not be frozen here');
assert(!REALITY_ROOT_LIVING_PLACE_RULES.exactPilgrimageRouteFrozenHere, 'exact pilgrimage route may not be frozen here');
assert(!REALITY_ROOT_LIVING_PLACE_RULES.upstreamRootStatusMayBePromotedHere, 'living-place reservoir may not promote root status');
assert(!REALITY_ROOT_LIVING_PLACE_RULES.tourismPopularityDefinesStoryValue, 'tourism popularity cannot define story value');
assert(!REALITY_ROOT_LIVING_PLACE_RULES.realBusinessNegativePlotUseAllowedWithoutReview, 'real business negative plot use requires separate review');
assert(REALITY_ROOT_LIVING_PLACE_RULES.ordinaryLifeBeforePilgrimageBranding, 'ordinary life must precede pilgrimage branding');
assert(REALITY_ROOT_LIVING_PLACE_RULES.repeatedStoryUseBeforePilgrimagePromotionRequired, 'repeated story use must precede pilgrimage promotion');
assert(!REALITY_ROOT_LIVING_PLACE_RULES.appearanceDeterminesOrigin, 'appearance cannot determine origin');
assert(!REALITY_ROOT_LIVING_PLACE_RULES.runtimeAutoPromotionAllowed, 'living-place reservoir may not auto-promote runtime');

assert(REALITY_ROOT_RULES.pilgrimageValueMustFollowStoryFit, 'upstream pilgrimage story-fit rule drift');
assert(REALITY_ROOT_RULES.realBusinessNegativePlotUseRequiresSeparateReview, 'upstream real-business review rule drift');
assert(!REALITY_ROOT_RULES.exactHomeAddressPublic, 'upstream exact-home-address rule drift');
assert(!REALITY_ROOT_RULES.prefectureStereotypeDefinesPersonality, 'upstream prefecture stereotype rule drift');
assert(!REALITY_ROOT_RULES.skinToneDeterminesNationalityOrOrigin, 'upstream skin-tone/origin rule drift');
assert(!REALITY_ROOT_RULES.yuiShinjukuAllowed && REALITY_ROOT_RULES.yuiArakawaCurrent, 'Yui Arakawa/Shinjuku boundary drift');

assert(characterRealityRootSummary.total === 36, 'upstream Reality Root registry must remain 36');
assert(characterRealityRootSummary.current21 === 21, 'upstream Current21 root count drift');
assert(characterRealityRootSummary.future15 === 15, 'upstream Future15 root count drift');
assert(characterRealityRootSummary.uniqueIds === 36, 'upstream Reality Root IDs must remain unique');
assert(characterRealityRootSummary.yuiArakawaCount === 1 && characterRealityRootSummary.yuiShinjukuCount === 0, 'Yui root must remain Arakawa only');
assert(characterRealityRootSummary.shinjukuPresentCandidateCount >= 1, 'Shinjuku Present character must remain represented');

assert(realityRootLivingPlaceSummary.characterCount === 36, 'living-place reservoir must cover 36/36');
assert(realityRootLivingPlaceSummary.uniqueCharacterIds === 36, 'living-place character IDs must be unique');
assert(realityRootLivingPlaceSummary.totalAnchorSeeds === 144, `living-place anchor total drift: ${realityRootLivingPlaceSummary.totalAnchorSeeds}`);
assert(realityRootLivingPlaceSummary.uniqueAnchorSeeds === 144, 'all living-place anchor seeds must be unique');
assert(realityRootLivingPlaceSummary.allHaveFourKinds, 'every character must have all four living-place anchor kinds');
assert(!realityRootLivingPlaceSummary.exactVenueFrozenHere, 'summary may not freeze exact venue');
assert(!realityRootLivingPlaceSummary.runtimeAutoPromotionAllowed, 'summary may not auto-promote runtime');

const rootById = new Map(CHARACTER_REALITY_ROOTS.map((entry) => [entry.id, entry]));
assert(rootById.size === 36, 'Reality Root registry ID map drift');
const expectedKinds = new Set(['DAILY_ERRAND', 'ROUTE_THRESHOLD', 'FOOD_REST', 'MEMORY_OBJECT']);
for (const entry of REALITY_ROOT_LIVING_PLACE_RESERVOIR) {
  const root = rootById.get(entry.id);
  assert(root, `living-place character missing upstream Reality Root: ${entry.id}`);
  assert(root.name === entry.name, `living-place character name drift: ${entry.id}`);
  assert(entry.anchors.length === 4, `living-place anchor count drift: ${entry.id}`);
  const kinds = new Set(entry.anchors.map((anchor) => anchor.kind));
  assert(kinds.size === 4 && [...expectedKinds].every((kind) => kinds.has(kind as never)), `living-place anchor kinds drift: ${entry.id}`);
  assert(new Set(entry.anchors.map((anchor) => anchor.seed)).size === 4, `duplicate living-place anchor seed: ${entry.id}`);
  assert(entry.anchors.every((anchor) => anchor.seed.length > 24), `living-place anchor seed too thin: ${entry.id}`);
}

const doc = fs.readFileSync('docs/reality-root-living-place-reservoir-v1.md', 'utf8');
assert(doc.includes('AUTHOR RESERVOIR / NON-CANON / ROOT STATUS INHERITED / EXACT VENUES OPEN / FREE TO OVERWRITE'), 'living-place doc status drift');
assert(doc.includes('好きなCharacterが何度も普通にそこで買い、待ち、休み、直し、帰ったから歩いてみたくなる場所'), 'pilgrimage ordinary-life principle missing');
assert(doc.includes('exact home addressを公開しない'), 'exact home address guard missing');
assert(doc.includes('実在店舗を無断で悪役企業 / 事故現場 / 犯罪拠点にしない'), 'real business negative-use guard missing');
assert(doc.includes('Yui = 東京都荒川区の下町育ち') || doc.includes('ユイ — 東京都荒川区 DECIDED'), 'Yui Arakawa living-place authority missing');
assert(doc.includes('トバリ — 東京都新宿区 HIGH-VALUE CURRENT_DERIVED'), 'Tobari Shinjuku living-place authority missing');
assert(doc.includes('クロエ — exact birthplace OPEN_HIGH_VALUE'), 'Chloe open birthplace guard missing');
assert(doc.includes('褐色肌を地域originの証拠にしない'), 'Hiyori skin-tone/origin guard missing');
assert(doc.includes('褐色肌 != 川口/海外origin explanation'), 'Touma skin-tone/origin guard missing');
assert(doc.includes('観光cat mascot化しない'), 'Yomo tourism-mascot guard missing');
assert(doc.includes('Cure narrative禁止'), 'Amane cure-narrative guard missing');
assert(doc.includes('36 characters\n× 4 living-place anchor kinds\n= 144 anchor seeds'), '144-anchor completion formula missing');
assert(doc.includes('「ここに住んでいた」を有名地名ではなく、繰り返す生活の行動で感じさせる。'), 'living-place author principle missing');

console.log(JSON.stringify({
  characters: realityRootLivingPlaceSummary.characterCount,
  livingPlaceAnchorSeeds: realityRootLivingPlaceSummary.totalAnchorSeeds,
  uniqueAnchorSeeds: realityRootLivingPlaceSummary.uniqueAnchorSeeds,
  yuiArakawa: characterRealityRootSummary.yuiArakawaCount,
  yuiShinjuku: characterRealityRootSummary.yuiShinjukuCount,
  exactVenueFrozen: false,
  rootStatusPromoted: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
