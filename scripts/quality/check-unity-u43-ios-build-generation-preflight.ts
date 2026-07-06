import { existsSync, readFileSync } from 'node:fs';

const failures: string[] = [];
const docPath = 'docs/unity-u43-ios-build-generation-preflight-2026-07-06.md';
const evidencePath = 'docs/design-targets/generated/unity-u43/ios-build-generation-preflight.json';
const predeviceEvidencePath = 'docs/design-targets/generated/unity-u43/predevice-automated-smoke-readiness.json';
const verdictPath = 'docs/design-targets/generated/unity-u43/u43-readiness-verdict.json';
const outputPath = '/Users/m-shogo/Developer/personal/vamp-pon-builds/ios-u43-predevice-smoke';

function check(label: string, ok: boolean) {
  if (!ok) failures.push(label);
}

function read(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function boolJson(text: string, key: string, value: boolean) {
  return new RegExp(`"${key}"\\s*:\\s*${value}`).test(text);
}

const doc = read(docPath);
const evidenceText = read(evidencePath);
const predeviceEvidence = read(predeviceEvidencePath);
const verdict = read(verdictPath);
const packageJson = read('package.json');
const allText = `${doc}\n${evidenceText}\n${predeviceEvidence}\n${verdict}`;

let evidence: Record<string, unknown> = {};
try {
  evidence = JSON.parse(evidenceText);
} catch {
  failures.push('evidence JSON parses');
}

check(`doc exists: ${docPath}`, existsSync(docPath));
check(`evidence exists: ${evidencePath}`, existsSync(evidencePath));
check('package script exists', packageJson.includes('unity:u43-ios-build-generation-preflight:check'));
check('evidenceKind correct', evidence.evidenceKind === 'iOS build generation preflight');
check('iosBuildGenerationAttempted true', evidence.iosBuildGenerationAttempted === true);
check('iosBuildOutputPath exact', evidence.iosBuildOutputPath === outputPath);
check('device install not attempted', evidence.deviceInstallAttempted === false);
check('device run not confirmed', evidence.deviceRunConfirmed === false);
check('actual device result not provided', evidence.actualDeviceSmokeResultProvided === false);
check('actual device result string not provided', evidence.actualDeviceSmokeResult === 'NOT_PROVIDED');
check('human check needed', evidence.humanCheckNeeded === true);
check('device screenshot not provided', evidence.deviceScreenshot === 'DEVICE_SCREENSHOT_NOT_PROVIDED');

for (const key of [
  'devicePlayableReady',
  'mobileMetricsReady',
  'audioMixerReady',
  'audioLatencyMeasured',
  'hapticMeasured',
  'rcReady',
  'productionApproved',
]) {
  check(`${key} false in evidence`, evidence[key] === false);
}

check('doc separates iOS build from device smoke', doc.includes('not actual device smoke evidence') && doc.includes('deviceRunConfirmed=false'));
check('predevice evidence linked to iOS generation', predeviceEvidence.includes('"iosBuildGenerationAttempted": true'));
check('readiness verdict linked to iOS generation', verdict.includes('"iosBuildGenerationAttempted": true'));
check('no device or release ready true', !/"devicePlayableReady": true|"mobileMetricsReady": true|"audioMixerReady": true|"audioLatencyMeasured": true|"hapticMeasured": true|"rcReady": true|"productionApproved": true/.test(allText));
check('no actual device result true', !/"actualDeviceSmokeResultProvided": true/.test(allText));
check('no device pass claim', !/actual device smoke[^.\n]*(pass|passed|approved|ready)/i.test(allText));

if (evidence.iosBuildGenerationReady === true) {
  check('successful build has null error', evidence.iosBuildGenerationError === null);
  check('successful build result succeeded', evidence.iosBuildResult === 'Succeeded');
} else {
  check('failed build records error', typeof evidence.iosBuildGenerationError === 'string' && evidence.iosBuildGenerationError.length > 0);
  check('failed build not recorded as succeeded', evidence.iosBuildResult !== 'Succeeded');
}

for (const key of [
  'actualDeviceSmokeResultProvided',
  'devicePlayableReady',
  'mobileMetricsReady',
  'audioMixerReady',
  'audioLatencyMeasured',
  'hapticMeasured',
  'rcReady',
  'productionApproved',
]) {
  check(`${key} guarded in predevice evidence`, boolJson(predeviceEvidence, key, false));
  check(`${key} guarded in verdict`, boolJson(verdict, key, false));
}

if (failures.length > 0) {
  console.error('unity U43 iOS build generation preflight check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('unity U43 iOS build generation preflight check passed: device smoke remains NOT_PROVIDED');
