import fs from 'node:fs';
import {
  CONSTELLATION_STORY_CLUE_RULES,
  CONSTELLATION_STORY_CLUE_CANDIDATES,
  constellationStoryClueSummary,
} from '../../src/game/data/constellationStoryClueReservoir.ts';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

assert(CONSTELLATION_STORY_CLUE_RULES.status === 'AUTHOR_RESERVOIR_RESEARCH_BACKED_NON_CANON', 'constellation clue status drift');
assert(CONSTELLATION_STORY_CLUE_RULES.clueCountRequired === 8, 'constellation clue target drift');
assert(!CONSTELLATION_STORY_CLUE_RULES.historicallyFalseTomoriYuiOfficialListDiffAllowed, 'false Tomori/Yui official-list difference may not return');
assert(!CONSTELLATION_STORY_CLUE_RULES.clueMayRewriteCore5EraAutomatically, 'constellation clue may not rewrite Core5 eras');
assert(!CONSTELLATION_STORY_CLUE_RULES.clueMayPromoteObsoleteConstellationToModernOfficial, 'obsolete constellation may not auto-promote to modern official');
assert(!CONSTELLATION_STORY_CLUE_RULES.obsoleteMeansEvil, 'obsolete may not mean evil');
assert(!CONSTELLATION_STORY_CLUE_RULES.characterMerchIdentityDependsOnObsoleteSetByDefault, 'main Character merch identity may not depend on obsolete set');
assert(CONSTELLATION_STORY_CLUE_RULES.dreamCanUseArchiveLayerWithoutRealityRetcon, 'Dream archive layer must remain usable without Reality retcon');
assert(!CONSTELLATION_STORY_CLUE_RULES.runtimeAutoPromotionAllowed, 'constellation clue reservoir may not auto-promote runtime');

assert(CONSTELLATION_STORY_CLUE_CANDIDATES.length === 8, `constellation clue count drift: ${CONSTELLATION_STORY_CLUE_CANDIDATES.length}`);
assert(constellationStoryClueSummary.clueCount === 8, 'constellation clue summary count drift');
assert(constellationStoryClueSummary.uniqueIds === 8, 'constellation clue IDs must be unique');
assert(constellationStoryClueSummary.sTierCount === 2, 'constellation S-tier count drift');
assert(constellationStoryClueSummary.aTierCount === 4, 'constellation A-tier count drift');
assert(constellationStoryClueSummary.bTierCount === 2, 'constellation B-tier count drift');
assert(!constellationStoryClueSummary.runtimeAutoPromotionAllowed, 'constellation clue summary may not auto-promote runtime');

const byId = new Map(CONSTELLATION_STORY_CLUE_CANDIDATES.map((entry) => [entry.id, entry]));
for (const id of [
  'quadrantid-name-fossil','tomori-inherited-old-atlas','argo-one-to-many','machina-electrica-era-mirror',
  'officina-typographica-record-medium','robur-authority-sky-map','antinous-absorbed-name','felis-secret-archive',
]) assert(byId.has(id), `constellation clue missing: ${id}`);

assert(byId.get('quadrantid-name-fossil')?.strength === 'S', 'Quadrantid clue priority drift');
assert(byId.get('tomori-inherited-old-atlas')?.strength === 'S', 'Tomori old-atlas clue priority drift');
assert(byId.get('quadrantid-name-fossil')?.forbiddenShortcut.includes('different official postwar constellation list'), 'Tomori postwar false-list guard missing');
assert(byId.get('tomori-inherited-old-atlas')?.forbiddenShortcut.includes('exact antique edition or provenance'), 'Tomori atlas provenance guard missing');
assert(byId.get('argo-one-to-many')?.forbiddenShortcut.includes('Robot/twin identity'), 'Argo personhood shortcut guard missing');
assert(byId.get('machina-electrica-era-mirror')?.forbiddenShortcut.includes('artificial characters'), 'Machina artificial-body shortcut guard missing');
assert(byId.get('felis-secret-archive')?.forbiddenShortcut.includes('obsolete != evil'), 'Felis obsolete/evil guard missing');

for (const entry of CONSTELLATION_STORY_CLUE_CANDIDATES) {
  assert(entry.status === 'AUTHOR_CANDIDATE_NON_CANON', `constellation clue unexpectedly promoted: ${entry.id}`);
  assert(entry.historicalAnchorIds.length > 0, `constellation clue lacks historical anchor: ${entry.id}`);
  assert(entry.characterHooks.length > 0, `constellation clue lacks Character hook: ${entry.id}`);
  assert(entry.requiredEvidenceBeforeCanon.length > 0, `constellation clue lacks evidence gate: ${entry.id}`);
  assert(entry.merchPolicy.length > 20, `constellation clue merch policy too thin: ${entry.id}`);
  assert(entry.forbiddenShortcut.length > 20, `constellation clue shortcut guard too thin: ${entry.id}`);
}

const doc = fs.readFileSync('docs/constellation-story-clue-reservoir-v1.md', 'utf8');
for (const token of [
  'AUTHOR RESERVOIR / RESEARCH-BACKED / NON-CANON / 8 CLUES',
  'Tomoriの現役時代の公式IAU 88星座一覧とPresent Yuiの公式一覧が年代だけで違う、という仕掛けは使わない。',
  'S1 — Quadrantid name fossil',
  'S2 — Tomori inherited old atlas',
  'A1 — Argo Navis one → many',
  'Main Character identity',
  '星図から外れたこと and 敵になったこと are separate causes.',
  '史実は答えを固定するためではなく、嘘の伏線を避けながら「本当にあった変化」だけを物語の反響板にする。',
]) assert(doc.includes(token), `constellation clue doc guard missing: ${token}`);

console.log(JSON.stringify({
  clues: 8,
  sTier: 2,
  aTier: 4,
  bTier: 2,
  tomoriYuiFalseOfficialListDiffAllowed: false,
  obsoleteMeansEvil: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));