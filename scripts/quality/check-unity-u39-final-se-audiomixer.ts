import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u39-final-se-audiomixer-pass-plan-2026-07-03.md',
  'docs/unity-u39-final-se-audiomixer-pass-review-2026-07-03.md',
  'docs/unity-u39-se-inventory-status-2026-07-03.md',
  'docs/unity-u39-audio-readiness-verdict-2026-07-03.md',
  'docs/unity-u39-u34-gate-addendum-2026-07-03.md',
];
const artifacts = [
  'se-inventory-status.json',
  'se-final-candidate-list.json',
  'se-normalization-report.json',
  'audio-mixer-routing-map.json',
  'audio-clipping-risk-map.json',
  'audio-polyphony-cooldown-map.json',
  'audio-readiness-verdict.json',
];
const screenshots = [
  '01-battle-audio-readiness.png',
  '02-pickup-audio-readiness.png',
  '03-levelup-audio-readiness.png',
  '04-climax-audio-readiness.png',
  '05-result-audio-readiness.png',
  '06-stageselect-audio-readiness.png',
];
const modelFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U39/AudioReadiness/U39SeReadinessStatus.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U39/AudioReadiness/U39SeInventoryItem.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U39/AudioReadiness/U39AudioMixerRoutingMap.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U39/AudioReadiness/U39AudioClippingGuard.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U39/AudioReadiness/U39FinalCandidateClipLibrary.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U39/AudioReadiness/U39AudioReadinessReport.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U39/AudioReadiness/U39AudioReadinessFactory.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U39/AudioReadiness/U39Stage1AudioReadinessConnector.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U39FinalSeAudioMixerVerification.cs',
];
const finalCandidateSe = [
  'vp_battle_start_soft.wav',
  'vp_pickup_xp_soft.wav',
  'vp_pickup_heal_warm.wav',
  'vp_pickup_rare_seal.wav',
  'vp_levelup_open_paper.wav',
  'vp_card_select_ink.wav',
  'vp_card_confirm.wav',
  'vp_weapon_fire_soft.wav',
  'vp_enemy_hit_soft.wav',
  'vp_enemy_defeat_ink.wav',
  'vp_player_damage_mute.wav',
  'vp_evolution_convergence.wav',
  'vp_evolution_complete.wav',
  'vp_kokuyou_ready.wav',
  'vp_kokuyou_activation.wav',
  'vp_kokuyou_ending.wav',
  'vp_result_stamp.wav',
  'vp_reward_card.wav',
  'vp_unlock_reveal.wav',
  'vp_stage_lantern.wav',
  'vp_stage_route_unlock.wav',
  'vp_retry_confirm.wav',
];

function check(label: string, ok: boolean) {
  if (!ok) failures.push(label);
}
function read(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}
function walk(root: string): string[] {
  if (!existsSync(root)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) out.push(...walk(path));
    if (stat.isFile()) out.push(path);
  }
  return out;
}

for (const doc of docs) check(`doc exists: ${doc}`, existsSync(doc));
for (const file of modelFiles) check(`model exists: ${file}`, existsSync(file));
for (const artifact of artifacts) check(`artifact exists: ${artifact}`, existsSync(join('docs/design-targets/generated/unity-u39', artifact)));
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u39/screenshots', shot)));
for (const se of finalCandidateSe) check(`final candidate SE exists: ${se}`, existsSync(join('unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe', se)));
check('generation script exists', existsSync('scripts/audio/generate-u39-final-candidate-se.mjs'));

const docsText = docs.map(read).join('\n');
const artifactText = artifacts.map((artifact) => read(join('docs/design-targets/generated/unity-u39', artifact))).join('\n');
const modelText = modelFiles.map(read).join('\n');
const text = `${docsText}\n${artifactText}\n${modelText}`;
const verdict = read('docs/design-targets/generated/unity-u39/audio-readiness-verdict.json');
const inventory = read('docs/design-targets/generated/unity-u39/se-inventory-status.json');
const candidateList = read('docs/design-targets/generated/unity-u39/se-final-candidate-list.json');
const mixer = read('docs/design-targets/generated/unity-u39/audio-mixer-routing-map.json');
const runtime = walk('unity/VampPonUnity/Assets/_Project/Scripts')
  .filter((path) => !path.includes('/Editor/'))
  .map(read)
  .join('\n');

for (const value of [
  'audioReadyForRc: false',
  'finalSeReady: true',
  'audioMixerReady: false',
  'routingDraftReady',
  'audioLatencyMeasured: false',
  'hapticMeasured: false',
  'rcReady: false',
  'productionApproved: false',
  'NOT_MEASURED',
  'finalCandidate',
  'final approvedではない',
  'Addressables未導入',
  'Cloud Save未導入',
  '経済バランス未確定',
  'mobile metrics NOT_MEASURED',
]) {
  check(`contains ${value}`, text.includes(value));
}

check('verdict audioReadyForRc false', /"audioReadyForRc": false/.test(verdict));
check('verdict finalSeReady true', /"finalSeReady": true/.test(verdict));
check('verdict audioMixerReady false', /"audioMixerReady": false/.test(verdict));
check('verdict routing draft true', /"routingDraftReady": true/.test(verdict));
check('verdict latency false', /"audioLatencyMeasured": false/.test(verdict));
check('verdict haptic false', /"hapticMeasured": false/.test(verdict));
check('verdict rc false', /"rcReady": false/.test(verdict));
check('verdict production false', /"productionApproved": false/.test(verdict));
check('inventory has 22 assets', (inventory.match(/"eventId":/g) ?? []).length === 22);
check('candidate list has 22 assets', (candidateList.match(/"eventId":/g) ?? []).length === 22);
check('mixer fallback documented', /"missingMixerFallback": true/.test(mixer));
check('mixer asset not created', /"audioMixerReady": false/.test(mixer) && mixer.includes('Unity .mixer asset not created'));
check('mixer groups documented', /"Climax"/.test(mixer) && /"StageSelect"/.test(mixer));
check('No productionApproved true', !/ProductionApproved\s*=\s*true|"productionApproved": true|productionApproved=1/.test(`${artifactText}\n${modelText}`));
check('No rcReady true', !/RcReady\s*=\s*true|"rcReady": true/.test(`${artifactText}\n${modelText}`));
check('No final-approved draft SE claim', !/draft SE[^.\n]*(is final approved|本番承認済み|最終承認済み)/i.test(text));
check('No runtime docs generated refs', !/docs\/design-targets\/generated/.test(runtime));
check('No generated final image runtime paste', !/top-final|kokuyou-cutin-final|generated\/.*\.png|completed screen image/i.test(runtime));
check('No Addressables folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('Cloud Save API not introduced', !/CloudSaveService|Unity\.Services\.CloudSave|CloudSave\.Models/i.test(runtime));
check('Economy not final', /経済バランス未確定|reward economy/.test(text));
check('No forbidden term string', !text.includes('黒曜化'));

if (failures.length > 0) {
  console.error('unity U39 final SE AudioMixer check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U39 final SE AudioMixer check passed: se=${finalCandidateSe.length}, artifacts=${artifacts.length}, screenshots=${screenshots.length}, audioReadyForRc=false, audioMixerReady=false`);
