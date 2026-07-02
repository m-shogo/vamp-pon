import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u29-sprite-atlas-performance-mobile-fps-plan-2026-07-03.md',
  'docs/unity-u29-sprite-atlas-performance-mobile-fps-review-2026-07-03.md',
  'docs/unity-u29-stage1-performance-budget-2026-07-03.md',
  'docs/unity-u29-texture-import-policy-2026-07-03.md',
  'docs/unity-u29-ui-performance-policy-2026-07-03.md',
  'docs/unity-u29-mobile-device-verification-checklist-2026-07-03.md',
];
const files = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U29/PerformanceMobile/U29Stage1PerformanceConstants.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U29/PerformanceMobile/U29RuntimeCapPolicy.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U29/PerformanceMobile/U29Stage1PoolBudget.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U29/PerformanceMobile/U29EffectCapGate.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U29/PerformanceMobile/U29AudioPerformanceBudget.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U29/PerformanceMobile/U29HapticPerformanceBudget.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U29/PerformanceMobile/U29FeelPerformanceGuard.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U29/PerformanceMobile/U29SpriteAtlasPolicyModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U29SpriteAtlasPerformanceMobileFpsVerification.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U29SpriteAtlasPerformanceMobileFpsScreenshotCapture.cs',
];
const artifacts = [
  'performance-budget.json',
  'runtime-cap-map.json',
  'sprite-atlas-map.json',
  'texture-import-policy-map.json',
  'audio-haptic-budget-map.json',
];
const screenshots = [
  'stage1-opening-performance-proof.png',
  'stage1-early-wave-performance-proof.png',
  'stage1-mid-wave-performance-proof.png',
  'stage1-kokuyou-performance-proof.png',
  'stage1-evolution-performance-proof.png',
  'stage1-result-performance-proof.png',
  'stageselect-performance-proof.png',
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
for (const artifact of artifacts) check(`artifact exists: ${artifact}`, existsSync(join('docs/design-targets/generated/unity-u29', artifact)));
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u29/screenshots', shot)));

const runtimeText = walk('unity/VampPonUnity/Assets/_Project/Scripts/U29').map(read).join('\n');
const docsText = docs.map(read).join('\n');
const artifactText = artifacts.map((a) => read(join('docs/design-targets/generated/unity-u29', a))).join('\n');
const text = `${docsText}\n${runtimeText}\n${artifactText}`;
for (const value of [
  '390x844',
  '60fps',
  '30fps',
  'Sprite Atlas',
  'texture import',
  'draw call',
  'memory',
  'pooling',
  'MaxActiveEnemies = 38',
  'audio',
  'haptic',
  'not measured on device',
  'mobile実機確認は未確認',
  'productionApproved=0',
  'Addressables未導入',
]) check(`contains ${value}`, text.includes(value));
check('Sprite Atlas policy or map exists', text.includes('U29Characters') && existsSync('docs/design-targets/generated/unity-u29/sprite-atlas-map.json'));
check('Runtime cap files mention cleanup fallback', runtimeText.includes('offscreen cleanup') && runtimeText.includes('spawn throttle') && runtimeText.includes('effect skip'));
check('Audio haptic guard exists', runtimeText.includes('U29AudioPerformanceBudget') && runtimeText.includes('U29HapticPerformanceBudget') && runtimeText.includes('U29FeelPerformanceGuard'));
check('No generated final image runtime paste', !/top-final|kokuyou-cutin-final|generated\/.*\.png/.test(runtimeText));
check('No productionApproved=1 in U29', !/productionApproved\s*=\s*1|ProductionApproved\s*=\s*true/.test(text));
check('No Addressables', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('Mobile real device not completed', !/実機確認完了|deviceMeasurement":\\s*"measured"|production performance guaranteed|本番performance保証済み/i.test(text));
check('Not production performance guarantee', !/本番performance保証です|production performance guaranteed/i.test(text));
check('No forbidden term string', !text.includes('黒曜化'));
if (failures.length > 0) {
  console.error('unity U29 sprite atlas performance mobile FPS check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`unity U29 sprite atlas performance mobile FPS check passed: artifacts=${artifacts.length}, screenshots=${screenshots.length}, productionApproved=0`);
