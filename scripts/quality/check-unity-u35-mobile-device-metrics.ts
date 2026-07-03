import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u35-mobile-device-metrics-pass-plan-2026-07-03.md',
  'docs/unity-u35-mobile-device-metrics-pass-review-2026-07-03.md',
  'docs/unity-u35-mobile-metrics-scenarios-2026-07-03.md',
  'docs/unity-u35-mobile-device-report-template-2026-07-03.md',
  'docs/unity-u35-mobile-metrics-thresholds-2026-07-03.md',
  'docs/unity-u35-stage1-runtime-pressure-summary-2026-07-03.md',
  'docs/unity-u35-mobile-qa-build-notes-2026-07-03.md',
  'docs/unity-u35-mobile-metrics-verdict-2026-07-03.md',
  'docs/unity-u35-u30-u31-u32-u33-gate-addendum-2026-07-03.md',
];
const modelFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35MobileMetricsSession.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35MobileDeviceProfile.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35MetricStatus.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35MetricSample.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35PerformanceMeasurement.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35AudioMeasurement.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35HapticMeasurement.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35TouchMeasurement.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35PersistenceMeasurement.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35MobileMetricsVerdict.cs',
];
const hookFiles = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35MobileMetricsCapture.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35FrameMetricsSampler.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35RuntimeCountSampler.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35AudioMetricsSampler.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35HapticMetricsSampler.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35MetricsScenarioMarker.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U35/MobileMetrics/U35MetricsJsonExporter.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U35MobileDeviceMetricsVerification.cs',
];
const artifacts = [
  'stage1-mobile-metrics-session-editor.json',
  'stage1-runtime-counts-editor.json',
  'stage1-audio-haptic-counts-editor.json',
  'stage1-not-measured-mobile-metrics.json',
  'stage1-mobile-metrics-verdict.json',
];
const screenshots = [
  '01-stageselect-metrics-editor.png',
  '02-stage1-opening-metrics-editor.png',
  '03-first-30-seconds-metrics-editor.png',
  '04-two-minute-wave-metrics-editor.png',
  '05-four-minute-wave-metrics-editor.png',
  '06-six-minute-climax-metrics-editor.png',
  '07-kokuyou-metrics-editor.png',
  '08-evolution-metrics-editor.png',
  '09-result-metrics-editor.png',
  '10-retry-metrics-editor.png',
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
for (const file of [...modelFiles, ...hookFiles]) check(`required file exists: ${file}`, existsSync(file));
for (const artifact of artifacts) check(`artifact exists: ${artifact}`, existsSync(join('docs/design-targets/generated/unity-u35', artifact)));
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u35/screenshots', shot)));

const docsText = docs.map(read).join('\n');
const modelText = modelFiles.map(read).join('\n');
const hookText = hookFiles.map(read).join('\n');
const artifactText = artifacts.map((artifact) => read(join('docs/design-targets/generated/unity-u35', artifact))).join('\n');
const allUnityRuntime = walk('unity/VampPonUnity/Assets/_Project/Scripts')
  .filter((path) => !path.includes('/Editor/'))
  .map(read)
  .join('\n');
const text = `${docsText}\n${modelText}\n${hookText}\n${artifactText}`;
const session = read('docs/design-targets/generated/unity-u35/stage1-mobile-metrics-session-editor.json');
const notMeasured = read('docs/design-targets/generated/unity-u35/stage1-not-measured-mobile-metrics.json');
const verdict = read('docs/design-targets/generated/unity-u35/stage1-mobile-metrics-verdict.json');

for (const value of [
  'productionApproved=false',
  'mobileMetricsReady=false',
  'NOT_MEASURED',
  'EDITOR_ONLY',
  'MEASURED',
  'FPS',
  'memory',
  'thermal',
  'GC allocation',
  'draw calls',
  'audio latency',
  'haptic',
  'touch',
  'save persistence',
  'retry stability',
  'Sprite Atlas production packing',
  'U36',
  'U34',
  'Addressables',
  'Cloud Save',
]) {
  check(`contains ${value}`, text.includes(value));
}

check('metric enum statuses exist', /Measured/.test(modelText) && /NotMeasured/.test(modelText) && /EditorOnly/.test(modelText) && /Failed/.test(modelText) && /Blocked/.test(modelText));
check('capture hook exports editor session', /BuildEditorSession/.test(hookText) && /U35MetricsJsonExporter/.test(hookText));
check('runtime counts sample U29 caps', /MaxActiveEnemies/.test(hookText) && /MaxActiveAudioVoices/.test(hookText));
check('session is editor only', /"sessionStatus": "EDITOR_ONLY"/.test(session));
check('session mobile metrics false', /"mobileMetricsReady": false/.test(session));
check('session mobile measurements not measured', /"fps": "NOT_MEASURED"/.test(session) && /"savePersistence": "NOT_MEASURED"/.test(session));
check('not measured is not pass', /"notPass": true/.test(notMeasured) && !/"pass": true/.test(notMeasured));
check('verdict false', /"mobileMetricsReady": false/.test(verdict));
check('no measured items claimed', /"measuredItems": \[\]/.test(verdict));
check('sprite atlas not complete', /"spriteAtlasProductionPackingComplete": false/.test(verdict));
check('No production approval true', !/productionApproved\s*=\s*1|ProductionApproved\s*=\s*true|"productionApproved": true/.test(text));
check('No runtime docs generated refs', !/docs\/design-targets\/generated/.test(allUnityRuntime));
check('No generated final image runtime paste', !/top-final|kokuyou-cutin-final|generated\/.*\.png|completed screen image/i.test(allUnityRuntime));
check('No Addressables folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('Cloud Save API not introduced', !/CloudSaveService|Unity\.Services\.CloudSave|CloudSave\.Models/i.test(allUnityRuntime));
check('Final SE not approved', /本番SE未確定|final SE[^.\n]*(not approved|not finalized)|finalSeApproved": false/.test(text));
check('Economy not final', /経済バランス確定|reward economy.*draft|productionBalanceFinal": false|本番balance未確定/.test(text));
check('No forbidden term string', !text.includes('黒曜化'));

if (failures.length > 0) {
  console.error('unity U35 mobile device metrics check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U35 mobile device metrics check passed: docs=${docs.length}, artifacts=${artifacts.length}, screenshots=${screenshots.length}, mobileMetricsReady=false`);
