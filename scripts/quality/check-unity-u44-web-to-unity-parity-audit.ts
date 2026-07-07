import { existsSync, readFileSync } from 'node:fs';

const failures: string[] = [];

const requiredPaths = [
  'docs/unity-u44-web-to-unity-parity-audit-2026-07-06.md',
  'docs/design-targets/generated/unity-u44/web-unity-parity-audit.json',
  'docs/unity-u44-design-target-reference-map-2026-07-06.md',
  'docs/design-targets/generated/unity-u44/design-target-reference-map.json',
  'docs/unity-u44-app-quality-ui-rules-2026-07-06.md',
  'docs/unity-u44-new-design-and-asset-request-list-2026-07-06.md',
  'docs/design-targets/generated/unity-u44/new-design-and-asset-requests.json',
  'docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md',
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/AppQualityStyleTokens.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/AppQualityStyleTokens.cs.meta',
];

function read(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function check(label: string, ok: boolean) {
  if (!ok) failures.push(label);
}

function hasJsonBool(text: string, key: string, value: boolean) {
  return new RegExp(`"${key}"\\s*:\\s*${value}`).test(text);
}

for (const path of requiredPaths) {
  check(`exists: ${path}`, existsSync(path));
}

const auditDoc = read(requiredPaths[0]);
const auditJson = read(requiredPaths[1]);
const referenceDoc = read(requiredPaths[2]);
const referenceJson = read(requiredPaths[3]);
const rulesDoc = read(requiredPaths[4]);
const requestDoc = read(requiredPaths[5]);
const requestJson = read(requiredPaths[6]);
const roadmapDoc = read(requiredPaths[7]);
const tokens = read(requiredPaths[8]);
const predevice = read('docs/design-targets/generated/unity-u43/predevice-automated-smoke-readiness.json');
const iosPreflight = read('docs/design-targets/generated/unity-u43/ios-build-generation-preflight.json');
const packageJson = read('package.json');
const allText = `${auditDoc}\n${auditJson}\n${referenceDoc}\n${referenceJson}\n${rulesDoc}\n${requestDoc}\n${requestJson}\n${roadmapDoc}\n${predevice}\n${iosPreflight}\n${tokens}`;

check('package script exists', packageJson.includes('unity:u44-web-to-unity-parity-audit:check'));
check('devicePlayableReady false remains', !/"devicePlayableReady": true/.test(allText) && hasJsonBool(auditJson, 'devicePlayableReady', false));
check('actualDeviceSmokeResultProvided false remains', !/"actualDeviceSmokeResultProvided": true/.test(allText) && hasJsonBool(auditJson, 'actualDeviceSmokeResultProvided', false));
check('actualDeviceSmokeResult NOT_PROVIDED remains', /"actualDeviceSmokeResult": "NOT_PROVIDED"/.test(allText));
check('rcReady false remains', !/"rcReady": true/.test(allText) && hasJsonBool(auditJson, 'rcReady', false));
check('productionApproved false remains', !/"productionApproved": true/.test(allText) && hasJsonBool(auditJson, 'productionApproved', false));
check('generated image boundary exists', allText.includes('Generated images are references only') && allText.includes('not runtime assets'));
check('generated images not final runtime assets', /"generatedImagesAreFinalRuntimeAssets": false/.test(referenceJson) || /"generatedImagesRuntimeBoundary"/.test(requestJson));
check('U43 predevice remains valid', /"evidenceKind": "Editor automated pre-device smoke"/.test(predevice) && /"actualDeviceSmokeResult": "NOT_PROVIDED"/.test(predevice));
check('U43 iOS preflight remains valid', /"evidenceKind": "iOS build generation preflight"/.test(iosPreflight) && /"iosBuildGenerationReady": true/.test(iosPreflight) && /"deviceRunConfirmed": false/.test(iosPreflight));

for (const phrase of ['readability', 'Safe Area', 'mobile tap', 'Paper UI', 'black ink', 'lantern light', 'Generated images']) {
  check(`app quality rules include ${phrase}`, rulesDoc.toLowerCase().includes(phrase.toLowerCase()));
}

for (const phrase of ['Web-only', 'Unity-only', 'Missing in Unity', 'Needs Asset', 'Needs Runtime', 'Later Phase']) {
  check(`parity audit includes ${phrase}`, auditDoc.includes(phrase) || auditJson.includes(phrase));
}

for (const phase of ['U44', 'U45', 'U46', 'U47', 'U48', 'U49', 'U50', 'U51']) {
  check(`roadmap includes ${phase}`, roadmapDoc.includes(phase));
}

check('asset requests include priorities', requestJson.includes('"priority": "P0"') && requestDoc.includes('assetId'));
check('design reference map includes runtimeConnected false', referenceJson.includes('"runtimeConnected": false'));
check('style tokens include 390x844 and tap target', tokens.includes('ReferenceWidth = 390f') && tokens.includes('ReferenceHeight = 844f') && tokens.includes('MinimumTapTarget = 44f'));
check('Unity settings listed as not mixed', auditDoc.includes('DefaultVolumeProfile.asset') && auditDoc.includes('were not mixed'));

if (failures.length > 0) {
  console.error('unity U44 Web to Unity parity audit check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('unity U44 Web to Unity parity audit check passed: actual device smoke remains NOT_PROVIDED');
