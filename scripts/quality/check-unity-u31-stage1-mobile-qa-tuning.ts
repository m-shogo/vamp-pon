import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u31-stage1-mobile-qa-tuning-plan-2026-07-03.md',
  'docs/unity-u31-stage1-qa-scenarios-2026-07-03.md',
  'docs/unity-u31-stage1-mobile-qa-report-2026-07-03.md',
  'docs/unity-u31-u30-gate-addendum-2026-07-03.md',
  'docs/unity-u31-stage1-mobile-qa-tuning-review-2026-07-03.md',
];
const files = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U31/MobileQa/U31QaSessionModel.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U31/MobileQa/U31QaDeviceProfile.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U31/MobileQa/U31QaMeasurementRecord.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U31/MobileQa/U31QaFinding.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U31/MobileQa/U31QaFindingSeverity.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U31/MobileQa/U31QaTuningAction.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U31/MobileQa/U31QaVerdict.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U31/MobileQa/U31QaScenarioResult.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U31/MobileQa/U31Stage1QaSessionFactory.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U31Stage1MobileQaScreenshotCapture.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U31Stage1MobileQaVerification.cs',
];
const artifacts = [
  'stage1-qa-session-editor.json',
  'stage1-qa-findings.json',
  'stage1-tuning-actions.json',
  'stage1-measurement-summary.json',
  'stage1-not-measured-list.json',
];
const screenshots = [
  '01-stageselect-before-run-qa.png',
  '02-stage1-opening-qa.png',
  '03-first-30-seconds-qa.png',
  '04-first-levelup-qa.png',
  '05-mid-wave-qa.png',
  '06-rare-qa.png',
  '07-evolution-qa.png',
  '08-kokuyou-qa.png',
  '09-result-clear-qa.png',
  '10-result-reward-unlock-qa.png',
  '11-stageselect-after-clear-qa.png',
  '12-retry-qa.png',
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
for (const file of files) check(`required file exists: ${file}`, existsSync(file));
for (const artifact of artifacts) check(`artifact exists: ${artifact}`, existsSync(join('docs/design-targets/generated/unity-u31', artifact)));
for (const shot of screenshots) check(`screenshot exists: ${shot}`, existsSync(join('docs/design-targets/generated/unity-u31/screenshots', shot)));

const docsText = docs.map(read).join('\n');
const runtimeText = walk('unity/VampPonUnity/Assets/_Project/Scripts/U31').map(read).join('\n');
const editorText = [
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U31Stage1MobileQaScreenshotCapture.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/U31Stage1MobileQaVerification.cs',
].map(read).join('\n');
const artifactText = artifacts.map((artifact) => read(join('docs/design-targets/generated/unity-u31', artifact))).join('\n');
const u26Text = [
  'unity/VampPonUnity/Assets/_Project/Scripts/U26/FirstPlayableBalance/U26Stage1BalanceConstants.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U26/FirstPlayableBalance/U26Stage1WaveDraft.cs',
].map(read).join('\n');
const allUnityRuntime = walk('unity/VampPonUnity/Assets/_Project/Scripts')
  .filter((path) => !path.includes('/Editor/'))
  .map(read)
  .join('\n');
const text = `${docsText}\n${runtimeText}\n${editorText}\n${artifactText}\n${u26Text}`;
const session = read('docs/design-targets/generated/unity-u31/stage1-qa-session-editor.json');
const notMeasured = read('docs/design-targets/generated/unity-u31/stage1-not-measured-list.json');
const tuning = read('docs/design-targets/generated/unity-u31/stage1-tuning-actions.json');

for (const value of [
  'productionApproved',
  'NOT_MEASURED',
  'Unity Editor 390x844',
  'first 30 seconds',
  'Kokuyou',
  'audio',
  'haptic',
  'save persistence',
  'Addressables',
  'Cloud Save',
]) {
  check(`contains ${value}`, text.includes(value));
}

check('session production approval false', /"productionApproved": false/.test(session));
check('session editor environment', /"environment": "Unity Editor 390x844"/.test(session));
check('20 scenario results', (session.match(/"verdict":/g) ?? []).length === 20);
check('not measured is not pass', /"verdict": "NOT_MEASURED"/.test(session) && !/"verdict": "PASS"[\s\S]{0,80}NOT_MEASURED/.test(session));
check('not measured list exists', /"notPass": true/.test(notMeasured));
check('tuning actions exist', /PickupRadius 1\.75/.test(tuning) && /BasicWeaponCooldownMs 900/.test(tuning));
check('U26 pickup radius tuned', /PickupRadius = 1\.75f/.test(u26Text));
check('U26 weapon cooldown tuned', /BasicWeaponCooldownMs = 900/.test(u26Text));
check('U26 opening wave tuned', /new Wave\(0, 30, "opening", 2\.6f, 1, 7, 5f\)/.test(u26Text));
check('U26 first pressure tuned', /new Wave\(30, 120, "first_levelup_pressure", 2\.1f, 2, 12, 6f\)/.test(u26Text));
check('No U31 runtime true approval', !/ProductionApproved\s*=\s*true|"productionApproved": true/.test(runtimeText));
check('No U31 artifact true approval', !/"productionApproved": true/.test(artifactText));
check('No generated final image runtime paste', !/docs\/design-targets\/generated|top-final|kokuyou-cutin-final|completed screen image/i.test(allUnityRuntime));
check('No Addressables folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('Cloud Save API not introduced', !/CloudSaveService|Unity\.Services\.CloudSave|CloudSave\.Models/i.test(allUnityRuntime));
check('Final SE not approved', /final SE[^.\n]*(not approved|未承認|未確定)|本番SE未確定/.test(text));
check('Production balance not finalized', /productionBalanceFinal": false|本番balance未確定|not production balanced/.test(text));
check('No forbidden term string', !text.includes('黒曜化'));

if (failures.length > 0) {
  console.error('unity U31 stage1 mobile QA tuning check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U31 stage1 mobile QA tuning check passed: artifacts=${artifacts.length}, screenshots=${screenshots.length}, productionApproved=false`);
