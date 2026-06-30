import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

type AlphaReportEntry = {
  source: string;
  output: string;
  greenSpillRemainingPixels: number;
  edgeTouches: boolean;
};

type ManifestItem = {
  id: string;
  type: string;
  sourceGreenback: string;
  alphaOutput: string;
  runtimePath: string;
  intendedUse: string;
  runtimeIncluded: boolean;
  productionStatus: string;
  greenSpillRemainingPixels: number;
  edgeTouches: boolean;
  textBakedRuntimeImage?: boolean;
};

type Manifest = {
  sourceAlphaReport: string;
  items: ManifestItem[];
};

const manifestPath = 'docs/design-targets/generated/unity-u5/u5-visual-candidate-manifest.json';
const expectedIds = new Set([
  'u5-yui-battle-candidate',
  'u5-ombu-battle-candidate',
  'u5-exp-fragment',
  'u5-lantern-spark',
  'u5-ink-burst',
  'u5-collect-trail',
  'u5-paper-panel',
  'u5-icon-frame',
]);
const runtimeRoot = 'unity/VampPonUnity/Assets/_Project/Resources/U5Candidates';

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

function walkPng(dir: string): string[] {
  if (!existsSync(dir)) return [];

  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      files.push(...walkPng(path));
      continue;
    }

    if (entry.endsWith('.png')) {
      files.push(relative('.', path));
    }
  }

  return files.sort();
}

const failures: string[] = [];
const manifest = readJson<Manifest>(manifestPath);
const alphaReport = readJson<AlphaReportEntry[]>(manifest.sourceAlphaReport);
const reportByOutput = new Map(alphaReport.map((entry) => [entry.output, entry]));
const ids = new Set<string>();
let runtimeIncludedCount = 0;
let productionApprovedCount = 0;

if (!Array.isArray(manifest.items)) {
  failures.push('manifest.items must be an array');
}

for (const item of manifest.items ?? []) {
  for (const field of ['id', 'type', 'sourceGreenback', 'alphaOutput', 'runtimePath', 'intendedUse', 'runtimeIncluded', 'productionStatus'] as const) {
    if (!(field in item) || item[field] === '' || item[field] == null) {
      failures.push(`${item.id ?? '<unknown>'}: missing ${field}`);
    }
  }

  ids.add(item.id);
  if (item.runtimeIncluded) runtimeIncludedCount += 1;
  if (item.productionStatus === 'approved') productionApprovedCount += 1;

  if (item.productionStatus !== 'candidate') {
    failures.push(`${item.id}: productionStatus must be candidate, got ${item.productionStatus}`);
  }

  if (!existsSync(item.sourceGreenback)) {
    failures.push(`${item.id}: sourceGreenback missing: ${item.sourceGreenback}`);
  }

  if (!existsSync(item.alphaOutput)) {
    failures.push(`${item.id}: alphaOutput missing: ${item.alphaOutput}`);
  }

  if (item.runtimeIncluded && !existsSync(item.runtimePath)) {
    failures.push(`${item.id}: runtimePath missing: ${item.runtimePath}`);
  }

  if (item.runtimePath.includes('public/assets/sprites/')) {
    failures.push(`${item.id}: runtimePath uses retired public/assets/sprites`);
  }

  if (item.textBakedRuntimeImage === true) {
    failures.push(`${item.id}: textBakedRuntimeImage must not be true`);
  }

  const report = reportByOutput.get(item.alphaOutput);
  if (report == null) {
    failures.push(`${item.id}: alphaOutput not found in alpha report: ${item.alphaOutput}`);
  } else {
    if (report.greenSpillRemainingPixels !== item.greenSpillRemainingPixels) {
      failures.push(`${item.id}: greenSpillRemainingPixels mismatch manifest=${item.greenSpillRemainingPixels} report=${report.greenSpillRemainingPixels}`);
    }
    if (report.edgeTouches !== item.edgeTouches) {
      failures.push(`${item.id}: edgeTouches mismatch manifest=${item.edgeTouches} report=${report.edgeTouches}`);
    }
  }

  if (item.greenSpillRemainingPixels !== 0) {
    failures.push(`${item.id}: greenSpillRemainingPixels must be 0`);
  }

  if (item.edgeTouches !== false) {
    failures.push(`${item.id}: edgeTouches must be false`);
  }
}

for (const expectedId of expectedIds) {
  if (!ids.has(expectedId)) {
    failures.push(`missing expected U5 manifest item: ${expectedId}`);
  }
}

for (const item of manifest.items ?? []) {
  if (!expectedIds.has(item.id)) {
    failures.push(`unexpected U5 manifest item: ${item.id}`);
  }
}

const manifestRuntimePaths = new Set((manifest.items ?? []).filter((item) => item.runtimeIncluded).map((item) => item.runtimePath));
for (const runtimePng of walkPng(runtimeRoot)) {
  if (!manifestRuntimePaths.has(runtimePng)) {
    failures.push(`runtime U5Candidates image is not in manifest: ${runtimePng}`);
  }
}

if (failures.length > 0) {
  console.error('unity asset intake check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`unity asset intake check passed: manifestItems=${manifest.items.length}, runtimeIncluded=${runtimeIncludedCount}, productionApproved=${productionApprovedCount}`);
