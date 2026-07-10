import { existsSync, readFileSync } from 'node:fs';

const failures: string[] = [];
const docPath = 'docs/unity-u45-ios-build-generation-preflight-2026-07-07.md';
const evidencePath = 'docs/design-targets/generated/unity-u45/ios-build-generation-preflight.json';
const readinessPath = 'docs/design-targets/generated/unity-u45/u45-app-quality-readiness.json';
const outputPath = '/Users/m-shogo/Developer/personal/vamp-pon-builds/ios-u45-app-quality-smoke';

function check(label: string, ok: boolean) {
  if (!ok) failures.push(label);
}

function read(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

const doc = read(docPath);
const evidenceText = read(evidencePath);
const readinessText = read(readinessPath);
const packageJson = read('package.json');
const combined = `${doc}\n${evidenceText}\n${readinessText}`;

let evidence: Record<string, unknown> = {};
let readiness: Record<string, unknown> = {};
try {
  evidence = JSON.parse(evidenceText);
} catch {
  failures.push('evidence JSON parses');
}
try {
  readiness = JSON.parse(readinessText);
} catch {
  failures.push('readiness JSON parses');
}

check(`doc exists: ${docPath}`, existsSync(docPath));
check(`evidence exists: ${evidencePath}`, existsSync(evidencePath));
check('package script exists', packageJson.includes('unity:u45-ios-build-generation-preflight:check'));
check('phase is U45', evidence.phase === 'U45');
check('evidenceKind correct', evidence.evidenceKind === 'U45 iOS build generation preflight');
check('iOS build attempted', evidence.iosBuildGenerationAttempted === true);
check('iOS output path exact', evidence.iosBuildOutputPath === outputPath);
check('device install not attempted', evidence.deviceInstallAttempted === false);
check('device run not confirmed', evidence.deviceRunConfirmed === false);
check('actual device smoke not provided', evidence.actualDeviceSmokeResultProvided === false);
check('actual device smoke result is NOT_PROVIDED', evidence.actualDeviceSmokeResult === 'NOT_PROVIDED');
check('human check needed', evidence.humanCheckNeeded === true);
check('device screenshot not provided', evidence.deviceScreenshot === 'DEVICE_SCREENSHOT_NOT_PROVIDED');

for (const key of [
  'candidateAssetsApprovedAsFinal',
  'devicePlayableReady',
  'mobileMetricsReady',
  'audioMixerReady',
  'audioLatencyMeasured',
  'hapticMeasured',
  'rcReady',
  'productionApproved',
]) {
  check(`${key} false in evidence`, evidence[key] === false);
  check(`${key} false in readiness`, readiness[key] === false);
}

check('doc separates build generation from device smoke',
  doc.includes('not actual device smoke evidence') && doc.includes('deviceRunConfirmed=false'));
check('candidate assets remain candidate-only',
  doc.includes('candidate-only') && readinessText.includes('Generated assets are candidates only'));
check('no actual device smoke pass claim',
  !/actual device smoke[^.\n]*(pass|passed|approved|ready)/i.test(combined));
check('no guarded READY true',
  !/"(candidateAssetsApprovedAsFinal|devicePlayableReady|mobileMetricsReady|audioMixerReady|audioLatencyMeasured|hapticMeasured|rcReady|productionApproved)"\s*:\s*true/.test(combined));

if (evidence.iosBuildGenerationReady === true) {
  check('successful generation result succeeded', evidence.iosBuildResult === 'Succeeded');
  check('successful generation has no errors', evidence.iosBuildTotalErrors === 0);
  check('successful generation has null error', evidence.iosBuildGenerationError === null);
} else {
  check('failed generation records error',
    typeof evidence.iosBuildGenerationError === 'string' && evidence.iosBuildGenerationError.length > 0);
  check('failed generation not marked succeeded', evidence.iosBuildResult !== 'Succeeded');
}

if (failures.length > 0) {
  console.error('unity U45 iOS build generation preflight check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('unity U45 iOS build generation preflight check passed: device smoke remains NOT_PROVIDED');
