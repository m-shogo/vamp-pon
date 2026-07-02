import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u28-se-haptic-feel-integration-plan-2026-07-03.md',
  'docs/unity-u28-se-haptic-feel-integration-review-2026-07-03.md',
];
const files = [
  'scripts/audio/generate-u28-draft-se.mjs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U28/FeelIntegration/U28AudioEventId.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U28/FeelIntegration/U28AudioEventRegistry.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U28/FeelIntegration/U28AudioRouter.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U28/FeelIntegration/U28HapticEventId.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U28/FeelIntegration/U28HapticRegistry.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U28/FeelIntegration/U28HapticRouter.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U28/FeelIntegration/U28EditorNoopHapticAdapter.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U28/FeelIntegration/U28MobileHapticPlaceholderAdapter.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U28/FeelIntegration/U28FeelSettingsDraft.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U28/FeelIntegration/U28InMemoryFeelSettingsRepository.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U28/FeelIntegration/U28Stage1FeelRuntimeConnector.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U28SeHapticFeelIntegrationVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U28SeHapticFeelIntegrationScreenshotCapture.cs',
];
const seFiles = [
  'vp_battle_start_soft.wav',
  'vp_pickup_xp_soft.wav',
  'vp_pickup_heal_warm.wav',
  'vp_pickup_rare_seal.wav',
  'vp_levelup_open_paper.wav',
  'vp_card_select_ink.wav',
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
  'vp_retry_confirm.wav',
];
const screenshots = [
  'stage1-pickup-audio-haptic-proof.png',
  'stage1-levelup-audio-haptic-proof.png',
  'stage1-rare-seal-audio-haptic-proof.png',
  'stage1-evolution-audio-haptic-proof.png',
  'stage1-kokuyou-audio-haptic-proof.png',
  'stage1-result-stamp-audio-haptic-proof.png',
  'stageselect-lantern-audio-haptic-proof.png',
];
function check(label: string, ok: boolean) { if (!ok) failures.push(label); }
function read(path: string) { return existsSync(path) ? readFileSync(path, 'utf8') : ''; }
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
for (const file of files) check(`required file exists: ${file}`, existsSync(file));
for (const file of seFiles) check(`draft SE exists: ${file}`, existsSync(join('unity/VampPonUnity/Assets/_Project/Audio/U28DraftSe', file)));
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u28/screenshots', shot)));
for (const artifact of ['audio-event-map.json', 'haptic-event-map.json', 'se-asset-list.json']) check(`artifact exists: ${artifact}`, existsSync(join('docs/design-targets/generated/unity-u28', artifact)));

const runtimeText = walk('unity/VampPonUnity/Assets/_Project/Scripts/U28').map(read).join('\n');
const docsText = docs.map(read).join('\n');
const generatedText = ['audio-event-map.json', 'haptic-event-map.json', 'se-asset-list.json'].map((f) => read(join('docs/design-targets/generated/unity-u28', f))).join('\n');
const text = `${docsText}\n${runtimeText}\n${read('scripts/audio/generate-u28-draft-se.mjs')}\n${generatedText}`;
for (const value of [
  'AudioEvent',
  'Haptic',
  'draft-placeholder-not-final',
  'original placeholder',
  'Play(',
  'PlayAt',
  'SetCategoryVolume',
  'Mute',
  'polyphony',
  'EditorNoop',
  'U25',
  'U27',
  'Result',
  'StageSelect',
  'Retry',
  'haptic実機確認は未確認',
  'productionApproved=0',
]) check(`contains ${value}`, text.includes(value));
for (const eventName of ['LevelupOpen', 'CardSelect', 'PickupXp', 'PlayerDamage', 'RareSealPulse', 'EvolutionComplete', 'KokuyouActivation', 'ResultStamp', 'StageSelectLantern', 'RetryConfirm']) {
  check(`event mapped: ${eventName}`, runtimeText.includes(eventName));
}
check('SE is generated in repo, not external', text.includes('no external material') && !/download|freesound|pixabay|効果音ラボ|external素材/.test(text));
check('No generated final image runtime paste', !/top-final|kokuyou-cutin-final|generated\/.*\.png/.test(runtimeText));
check('No productionApproved=1 in U28', !/productionApproved\s*=\s*1|ProductionApproved\s*=\s*true/.test(text));
check('No Addressables', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('Not final SE', !/本番SE確定|production SE complete|final SE approved/i.test(runtimeText));
check('Haptic real device not completed', !/HapticRealDeviceVerified\s*=\s*true|実機確認完了|haptic.*completed/i.test(text));
check('No forbidden term string', !text.includes('黒曜化'));
if (failures.length > 0) {
  console.error('unity U28 se haptic feel integration check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`unity U28 se haptic feel integration check passed: se=${seFiles.length}, screenshots=${screenshots.length}, productionApproved=0`);
