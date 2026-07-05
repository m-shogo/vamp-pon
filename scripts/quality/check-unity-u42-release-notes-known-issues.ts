import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const failures: string[] = [];
const docs = [
  'docs/unity-u42-release-notes-known-issues-plan-2026-07-03.md',
  'docs/unity-u42-stage1-internal-preview-release-notes-2026-07-03.md',
  'docs/unity-u42-stage1-known-issues-register-2026-07-03.md',
  'docs/unity-u42-stage1-qa-handoff-checklist-2026-07-03.md',
  'docs/unity-u42-remaining-blocker-matrix-2026-07-03.md',
  'docs/unity-u42-stage1-remaining-roadmap-2026-07-03.md',
  'docs/unity-u42-u34-u35-u39-u40-u41-addendum-2026-07-03.md',
  'docs/unity-u42-readiness-summary-2026-07-03.md',
  'docs/unity-u42-release-notes-known-issues-review-2026-07-03.md',
];
const artifacts = [
  'stage1-internal-preview-release-notes.json',
  'stage1-known-issues-register.json',
  'stage1-qa-handoff-checklist.json',
  'stage1-remaining-blocker-matrix.json',
  'stage1-remaining-roadmap.json',
  'stage1-u42-readiness-summary.json',
];
const screenshots = [
  '01-release-notes-stageselect.png',
  '02-release-notes-battle.png',
  '03-release-notes-levelup.png',
  '04-release-notes-climax.png',
  '05-release-notes-result.png',
  '06-release-notes-known-issues.png',
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
function pngSize(path: string) {
  const data = readFileSync(path);
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}
function hasPositiveLine(pattern: RegExp) {
  return text.split('\n').some((line) => pattern.test(line) && !/(未|ない|しない|ではない|でない|not|false|NOT_MEASURED)/i.test(line));
}

for (const doc of docs) check(`doc exists: ${doc}`, existsSync(doc));
for (const artifact of artifacts) check(`artifact exists: ${artifact}`, existsSync(join('docs/design-targets/generated/unity-u42', artifact)));
for (const shot of screenshots) {
  const path = join('docs/design-targets/generated/unity-u42/screenshots', shot);
  check(`screenshot exists: ${shot}`, existsSync(path));
  if (existsSync(path)) {
    const size = pngSize(path);
    check(`screenshot is 390x844: ${shot}`, size.width === 390 && size.height === 844);
  }
}
check('evidence generator exists', existsSync('scripts/assets/generate-u42-release-notes-evidence.mjs'));

const docsText = docs.map(read).join('\n');
const artifactText = artifacts.map((artifact) => read(join('docs/design-targets/generated/unity-u42', artifact))).join('\n');
const text = `${docsText}\n${artifactText}`;
const runtime = walk('unity/VampPonUnity/Assets/_Project/Scripts')
  .filter((path) => !path.includes('/Editor/'))
  .map(read)
  .join('\n');
const packageJson = read('package.json');

for (const value of [
  'internalPreviewReady',
  'mobileQaReady',
  'balanceHardeningReady',
  'spriteAtlasPackingReady',
  'assetReplacementReady',
  'finalSeReady',
  'economyReadyForRc',
  'rewardReadyForRc',
  'unlockReadyForRc',
  'saveEconomySafe',
  'mobileMetricsReady',
  'audioMixerReady',
  'audioLatencyMeasured',
  'hapticMeasured',
  'rcReady',
  'productionApproved',
  'mobile metrics NOT_MEASURED',
  'audio latency未測定',
  'haptic未測定',
  'AudioMixer',
  '本番balance未確定',
  '本番経済未確定',
  'Cloud Save未導入',
  'Addressables未導入',
  'Stage2 placeholder',
  'generated final画像をruntimeへ貼っていない',
  'docs/design-targets/generated',
]) {
  check(`contains ${value}`, text.includes(value));
}

check('package script exists', packageJson.includes('unity:u42-release-notes-known-issues:check'));
check('readiness internal preview true', /"internalPreviewReady": true/.test(artifactText));
check('readiness mobile QA true', /"mobileQaReady": true/.test(artifactText));
check('readiness mobile false', /"mobileMetricsReady": false/.test(artifactText) && /mobileMetricsReady \| false/.test(docsText));
check('readiness audio mixer false', /"audioMixerReady": false/.test(artifactText) && /audioMixerReady \| false/.test(docsText));
check('readiness audio latency false', /"audioLatencyMeasured": false/.test(artifactText) && /audioLatencyMeasured \| false/.test(docsText));
check('readiness haptic false', /"hapticMeasured": false/.test(artifactText) && /hapticMeasured \| false/.test(docsText));
check('readiness rc false', /"rcReady": false/.test(artifactText) && /rcReady \| false/.test(docsText));
check('readiness production false', /"productionApproved": false/.test(artifactText) && /productionApproved \| false/.test(docsText));

check('No rcReady true in generated evidence', !/"rcReady": true|rcReady=true|RcReady\s*=\s*true/.test(artifactText));
check('No productionApproved true in generated evidence', !/"productionApproved": true|productionApproved=1|productionApproved\s*=\s*1|ProductionApproved\s*=\s*true/.test(artifactText));
check('No measured mobile metrics claim', !/"mobileMetricsReady": true/.test(artifactText) && !hasPositiveLine(/mobileMetricsReady[^\n|]*(true)|mobile metrics測定済み|mobile metrics measured/i));
check('No measured audio latency claim', !/"audioLatencyMeasured": true|audioLatencyMeasured[^\n|]*(true)|audio latency測定済み|audio latency measured/i.test(text));
check('No measured haptic claim', !/"hapticMeasured": true|hapticMeasured[^\n|]*(true)|haptic測定済み|haptic measured/i.test(text));
check('No final AudioMixer claim', !/"audioMixerReady": true|AudioMixerReady[^\n]*(true)|audioMixerReady[^\n|]*(true)|AudioMixer確定|AudioMixerReady=true/.test(text));
check('No production balance final claim', !hasPositiveLine(/本番balance確定|production balance final approved/i));
check('No production economy final claim', !hasPositiveLine(/本番経済確定|production economy final approved/i));
check('No runtime docs generated refs', !/docs\/design-targets\/generated/.test(runtime));
check('No generated final image runtime paste', !/top-final|kokuyou-cutin-final|generated\/.*\.png|completed screen image/i.test(runtime));
check('No Addressables folder', !existsSync('unity/VampPonUnity/Assets/AddressableAssetsData'));
check('Cloud Save API not introduced', !/CloudSaveService|Unity\.Services\.CloudSave|CloudSave\.Models/i.test(runtime));
check('No forbidden term string', !text.includes('黒曜化'));

if (failures.length > 0) {
  console.error('unity U42 release notes known issues check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U42 release notes known issues check passed: docs=${docs.length}, artifacts=${artifacts.length}, screenshots=${screenshots.length}, rcReady=false`);
