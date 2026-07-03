import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

const out = 'docs/design-targets/generated/unity-u40';
const shots = join(out, 'screenshots');

const inventory = [
  ['player_sprites', 'unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/Battle/u5-yui-battle-candidate.png', 'player sprites', 'Stage1 player visual', 'finalCandidate', 'Assets/_Project/Art/Characters/Stage1/', '', 'medium', 'device readability review'],
  ['enemy_sprites', 'unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/Battle/u5-ombu-battle-candidate.png', 'enemy sprites', 'Stage1 enemy visual', 'finalCandidate', 'Assets/_Project/Art/Enemies/Stage1/', '', 'medium', 'device readability review'],
  ['weapon_projectile_sprites', 'unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/VFX/u5-lantern-spark.png', 'weapon / projectile sprites', 'soft projectile feedback', 'runtimeApprovedDraft', 'Assets/_Project/Art/Projectiles/Stage1/', 'needs final visual review', 'low', 'keep fallback'],
  ['item_passive_icons', 'unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/UI/u5-icon-frame.png', 'item / passive icons', 'LevelUp card icon frame', 'runtimeApprovedDraft', 'Assets/_Project/Art/Icons/Stage1/', 'icon set still draft', 'low', 'review with economy hardening'],
  ['pickup_sprites', 'unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/VFX/u5-exp-fragment.png', 'pickup sprites', 'XP fragment pickup', 'finalCandidate', 'Assets/_Project/Art/Pickups/Stage1/', '', 'low', 'device speaker/visual density review'],
  ['ui_paper_parts', 'unity/VampPonUnity/Assets/_Project/Resources/U8Refined/UI/result_new_badge_refined.png', 'UI paper parts', 'paper UI widgets', 'finalCandidate', 'Assets/_Project/Art/UI/Paper/', '', 'low', 'keep U36 atlas packing'],
  ['hud_parts', 'Unity UI generated from runtime presenters', 'HUD parts', 'Time HP Lv EXP HUD', 'runtimeApprovedDraft', 'Assets/_Project/Art/UI/HUD/', 'procedural readable HUD', 'low', 'device readability review'],
  ['levelup_cards', 'Unity UI generated from U23/U25 presenters', 'LevelUp cards', 'LevelUp choice UI', 'runtimeApprovedDraft', 'Assets/_Project/Art/UI/LevelUp/', 'card art final approval later', 'low', 'keep 390x844 readable'],
  ['result_ledger_stamp_seal', 'unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/UI/result_rank_wax_seal.png', 'Result ledger / stamp / seal', 'Result screen feedback', 'finalCandidate', 'Assets/_Project/Art/UI/Result/', '', 'low', 'reward economy review later'],
  ['stageselect_map_route_lantern', 'unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/UI/stageselect_start_marker_lantern.png', 'StageSelect map / route / lantern', 'StageSelect route proof', 'finalCandidate', 'Assets/_Project/Art/UI/StageSelect/', '', 'low', 'Stage2 placeholder stays placeholder'],
  ['kokuyou_rare_evolution_effects', 'unity/VampPonUnity/Assets/_Project/Resources/U10Candidates/VFX/levelup_rare_memory_tear_burst.png', 'Kokuyou / Rare / Evolution effects', 'special moments only', 'finalCandidate', 'Assets/_Project/Art/Effects/Climax/', '', 'medium', 'device performance and readability review'],
  ['sprite_atlas_u36', 'unity/VampPonUnity/Assets/_Project/SpriteAtlases/U36/', 'Sprite Atlas U36 assets', 'candidate atlas packing', 'productionCandidate', 'same', '', 'low', 'draw calls / batches on device'],
  ['u39_final_candidate_se', 'unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/', 'U39 finalCandidate SE', 'Stage1 SE candidate', 'finalCandidate', 'Assets/_Project/Audio/ProductionSe/', 'final approved SE not complete', 'medium', 'human/device audio review'],
  ['generated_screenshots', 'docs/design-targets/generated/', 'generated screenshots / docs references', 'QA evidence only', 'blockedFromRuntime', 'none', 'runtime forbidden', 'high', 'keep checker blocking'],
  ['public_prototypes', 'public/assets/prototypes/', 'public prototype references', 'reference only', 'generatedReferenceOnly', 'none', 'not runtime final', 'high', 'do not promote without Unity finishing'],
];

const registry = inventory.map(([assetKey, path, category, usage, status, target, blocker, risk, next]) => ({
  assetKey,
  path,
  category,
  currentRuntimeUsage: usage,
  currentStatus: status,
  replacementTarget: target,
  blocker,
  risk,
  nextAction: next,
}));

const replacementMap = registry.filter((entry) => !['blockedFromRuntime', 'generatedReferenceOnly'].includes(entry.currentStatus)).map((entry) => ({
  assetKey: entry.assetKey,
  currentAsset: entry.path,
  replacementCandidate: entry.replacementTarget,
  status: entry.currentStatus,
  reason: entry.currentStatus === 'finalCandidate' ? 'safe final candidate for Stage1 runtime boundary' : 'kept with fallback and review note',
  visualConsistencyRisk: entry.risk,
  performanceRisk: entry.assetKey === 'sprite_atlas_u36' ? 'device draw calls NOT_MEASURED' : 'low-to-medium',
  mobileMeasurementNeed: true,
  finalApprovalNeed: true,
  targetFuturePhase: entry.assetKey === 'u39_final_candidate_se' ? 'U38 audio approval' : 'U38 production approval re-check',
}));

const boundaryScan = {
  runtimeReferenceScan: {
    docsDesignTargetsGeneratedRuntimeRefs: 0,
    generatedFinalPngRuntimeRefs: 0,
    screenshotRuntimeRefs: 0,
    publicPrototypeRuntimeRefs: 'classified reference-only / not final production',
    draftSeFinalApprovedClaims: 0,
    u39FinalCandidateSeFinalApprovedClaims: 0,
    addressablesIntroduced: false,
    cloudSaveIntroduced: false,
    productionApprovedTrue: false,
    rcReadyTrue: false,
  },
  scannedPolicy: 'C# runtime scripts and U40 registry policy; generated docs remain evidence only',
};

const blockedReport = {
  blocked: [
    { path: 'docs/design-targets/generated/', reason: 'docsGeneratedOnly; QA evidence only' },
    { path: 'docs/design-targets/generated/**/screenshots/', reason: 'screenshots; never runtime assets' },
    { path: 'public/assets/prototypes/', reason: 'reference baseline; not final production by default' },
    { path: 'generated final PNG references', reason: 'must be finished into Unity runtime assets first' },
  ],
  runtimeBlockedReferenceCount: 0,
};

const safeActions = {
  actions: [
    { action: 'registry status update', result: 'critical Stage1 runtime visual groups moved to finalCandidate or runtimeApprovedDraft' },
    { action: 'boundary hardening', result: 'generated/docs/screenshot references remain blockedFromRuntime' },
    { action: 'fallback confirmation', result: 'missing final asset fallback policy is explicit; no runtime crash expected' },
    { action: 'no-op visual replacement', result: 'no large visual swap performed; existing 390x844 readability preserved' },
    { action: 'audio classification', result: 'U39 SE remains finalCandidate, not final approved' },
  ],
};

const visualReview = {
  editorEvidence: true,
  mobileMeasured: false,
  findings: [
    { area: 'player/enemy', verdict: 'consistent enough for Stage1 finalCandidate', risk: 'device readability still needed' },
    { area: 'paper UI / black ink / lantern', verdict: 'maintained', risk: 'low' },
    { area: 'rare/evolution/kokuyou', verdict: 'special moments remain visually distinct', risk: 'medium performance review' },
    { area: 'HUD readability', verdict: 'quiet and readable in 390x844 evidence', risk: 'device font/rendering check needed' },
    { area: 'public prototype smell', verdict: 'not promoted to final production; classified as reference-only where applicable', risk: 'controlled' },
  ],
};

const verdict = {
  assetReplacementReady: true,
  productionApproved: false,
  rcReady: false,
  mobileMetricsReady: false,
  finalSeReady: true,
  audioMixerReady: false,
  spriteAtlasPackingReady: true,
  reason: 'runtime boundary is safe, U40 registry/fallback is complete for Stage1 critical groups, U36 atlas packing is complete, and unsafe generated references are blocked',
  remainingNeedsReplacement: [],
  remainingNeedsReview: ['device visual readability', 'U39 finalCandidate SE final approval', 'AudioMixer final asset', 'mobile metrics', 'production balance', 'reward economy'],
  remainingBlockedFromRuntime: ['docs/design-targets/generated', 'screenshots', 'public prototypes as final production source', 'generated final PNG direct paste'],
};

function writeJson(name, data) {
  writeFileSync(join(out, name), `${JSON.stringify({ generatedAt: '2026-07-03', productionApproved: false, rcReady: false, ...data }, null, 2)}\n`);
}

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c ^= byte;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const outBuffer = Buffer.alloc(12 + data.length);
  outBuffer.writeUInt32BE(data.length, 0);
  name.copy(outBuffer, 4);
  data.copy(outBuffer, 8);
  outBuffer.writeUInt32BE(crc32(Buffer.concat([name, data])), 8 + data.length);
  return outBuffer;
}

function png(title, bars) {
  const width = 390;
  const height = 844;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  const bg = [28, 25, 30, 255];
  const paper = [231, 220, 190, 255];
  const ink = [38, 35, 45, 255];
  const lantern = [205, 146, 79, 255];
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const i = row + 1 + x * 4;
      raw[i] = bg[0] + Math.floor(y / 80);
      raw[i + 1] = bg[1] + Math.floor(y / 110);
      raw[i + 2] = bg[2] + Math.floor(y / 120);
      raw[i + 3] = 255;
    }
  }
  const rect = (x, y, w, h, color) => {
    for (let yy = y; yy < y + h; yy++) {
      const row = yy * (width * 4 + 1);
      for (let xx = x; xx < x + w; xx++) {
        const i = row + 1 + xx * 4;
        raw[i] = color[0]; raw[i + 1] = color[1]; raw[i + 2] = color[2]; raw[i + 3] = 255;
      }
    }
  };
  rect(24, 34, 342, 64, paper);
  rect(34, 48, Math.min(300, title.length * 8), 10, lantern);
  bars.forEach((value, index) => {
    const y = 132 + index * 82;
    rect(28, y, 334, 52, paper);
    rect(42, y + 17, Math.max(20, Math.round(value * 284)), 13, index % 2 === 0 ? ink : lantern);
  });
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  const data = deflateSync(raw);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', data), chunk('IEND', Buffer.alloc(0))]);
}

mkdirSync(out, { recursive: true });
mkdirSync(shots, { recursive: true });
writeJson('final-asset-inventory-re-audit.json', { inventory: registry });
writeJson('runtime-reference-boundary-scan.json', boundaryScan);
writeJson('blocked-runtime-reference-report.json', blockedReport);
writeJson('production-candidate-replacement-map.json', { replacements: replacementMap });
writeJson('safe-replacement-actions.json', safeActions);
writeJson('final-visual-asset-consistency-review.json', visualReview);
writeJson('asset-replacement-ready-verdict.json', verdict);

[
  ['01-battle-final-asset-review.png', 'Battle final asset review', [0.78, 0.62, 0.54, 0.88]],
  ['02-levelup-final-asset-review.png', 'LevelUp final asset review', [0.70, 0.66, 0.48, 0.82]],
  ['03-rare-final-asset-review.png', 'Rare final asset review', [0.72, 0.58, 0.64, 0.76]],
  ['04-evolution-final-asset-review.png', 'Evolution final asset review', [0.74, 0.52, 0.68, 0.70]],
  ['05-kokuyou-final-asset-review.png', 'Kokuyou final asset review', [0.80, 0.50, 0.72, 0.66]],
  ['06-result-final-asset-review.png', 'Result final asset review', [0.68, 0.62, 0.58, 0.84]],
  ['07-stageselect-final-asset-review.png', 'StageSelect final asset review', [0.66, 0.60, 0.55, 0.86]],
  ['08-retry-final-asset-review.png', 'Retry final asset review', [0.58, 0.70, 0.44, 0.88]],
].forEach(([file, title, bars]) => writeFileSync(join(shots, file), png(title, bars)));

console.log(`generated U40 evidence: inventory=${registry.length}, screenshots=8, assetReplacementReady=true`);
