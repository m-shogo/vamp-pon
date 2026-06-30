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
  replacesCandidate: string;
  category: string;
  screen: string;
  productionStatus: string;
  runtimeIncluded: boolean;
  sourceGreenbackPath: string;
  alphaOutputPath: string;
  runtimePath: string;
  qaReportPath: string;
  atlasGroup: string;
  owner: string;
  textBakedRuntimeImage: boolean;
  visualArtDirectionCheck: string;
  greenSpillRemainingPixels: number;
  edgeTouches: boolean;
};

type Manifest = {
  productionApprovedCount: number;
  sourceAlphaReport: string;
  runtimeRoot: string;
  items: ManifestItem[];
};

const manifestPath = 'docs/design-targets/generated/unity-u8-1/u8-1-visual-refinement-manifest.json';
const runtimeRoot = 'unity/VampPonUnity/Assets/_Project/Resources/U8Refined';
const expectedIds = new Set([
  'result_new_badge_refined',
  'levelup_rare_ink_flare_refined',
  'kokuyou_fullscreen_ink_shadow_source_refined',
]);
const expectedReplacements = new Set([
  'result_new_badge',
  'levelup_rare_ink_flare',
  'kokuyou_fullscreen_ink_shadow_source',
]);
const allowedArtChecks = new Set(['pending-human-review', 'needs-refine']);

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
if (!existsSync(manifestPath)) {
  failures.push(`manifest missing: ${manifestPath}`);
}

const manifest = failures.length === 0 ? readJson<Manifest>(manifestPath) : null;
const alphaReportPath = manifest?.sourceAlphaReport ?? '';
const alphaReport = alphaReportPath !== '' && existsSync(alphaReportPath)
  ? readJson<AlphaReportEntry[]>(alphaReportPath)
  : [];
const reportByOutput = new Map(alphaReport.map((entry) => [entry.output, entry]));
const ids = new Set<string>();
let runtimeIncludedCount = 0;
let productionApprovedCount = 0;

if (manifest != null) {
  if (manifest.runtimeRoot !== runtimeRoot) {
    failures.push(`runtimeRoot must be ${runtimeRoot}, got ${manifest.runtimeRoot}`);
  }

  if (manifest.productionApprovedCount !== 0) {
    failures.push(`productionApprovedCount must be 0, got ${manifest.productionApprovedCount}`);
  }

  if (!existsSync(alphaReportPath)) {
    failures.push(`sourceAlphaReport missing: ${alphaReportPath}`);
  }

  for (const item of manifest.items ?? []) {
    for (const field of [
      'id',
      'replacesCandidate',
      'category',
      'screen',
      'productionStatus',
      'runtimeIncluded',
      'sourceGreenbackPath',
      'alphaOutputPath',
      'runtimePath',
      'qaReportPath',
      'atlasGroup',
      'owner',
      'textBakedRuntimeImage',
      'visualArtDirectionCheck',
    ] as const) {
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

    if (!expectedReplacements.has(item.replacesCandidate)) {
      failures.push(`${item.id}: unexpected replacesCandidate ${item.replacesCandidate}`);
    }

    if (item.runtimeIncluded !== true) {
      failures.push(`${item.id}: runtimeIncluded must be true`);
    }

    if (!existsSync(item.sourceGreenbackPath)) {
      failures.push(`${item.id}: sourceGreenbackPath missing: ${item.sourceGreenbackPath}`);
    }

    if (!existsSync(item.alphaOutputPath)) {
      failures.push(`${item.id}: alphaOutputPath missing: ${item.alphaOutputPath}`);
    }

    if (item.runtimeIncluded && !existsSync(item.runtimePath)) {
      failures.push(`${item.id}: runtimePath missing: ${item.runtimePath}`);
    }

    if (!existsSync(item.qaReportPath)) {
      failures.push(`${item.id}: qaReportPath missing: ${item.qaReportPath}`);
    }

    if (!item.runtimePath.startsWith(`${runtimeRoot}/`)) {
      failures.push(`${item.id}: runtimePath must be under ${runtimeRoot}`);
    }

    if (item.runtimePath.includes('public/assets/sprites/') ||
        item.sourceGreenbackPath.includes('public/assets/sprites/') ||
        item.alphaOutputPath.includes('public/assets/sprites/')) {
      failures.push(`${item.id}: path uses retired public/assets/sprites`);
    }

    if (item.textBakedRuntimeImage !== false) {
      failures.push(`${item.id}: textBakedRuntimeImage must be false`);
    }

    if (!allowedArtChecks.has(item.visualArtDirectionCheck)) {
      failures.push(`${item.id}: visualArtDirectionCheck must be pending-human-review or needs-refine`);
    }

    const report = reportByOutput.get(item.alphaOutputPath);
    if (report == null) {
      failures.push(`${item.id}: alphaOutputPath not found in alpha report: ${item.alphaOutputPath}`);
    } else {
      if (report.source !== item.sourceGreenbackPath) {
        failures.push(`${item.id}: sourceGreenbackPath mismatch report=${report.source}`);
      }
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
      failures.push(`missing expected U8.1 manifest item: ${expectedId}`);
    }
  }

  for (const item of manifest.items ?? []) {
    if (!expectedIds.has(item.id)) {
      failures.push(`unexpected U8.1 manifest item: ${item.id}`);
    }
  }

  const manifestRuntimePaths = new Set((manifest.items ?? []).filter((item) => item.runtimeIncluded).map((item) => item.runtimePath));
  for (const runtimePng of walkPng(runtimeRoot)) {
    if (!manifestRuntimePaths.has(runtimePng)) {
      failures.push(`runtime U8Refined image is not in manifest: ${runtimePng}`);
    }
  }
}

if (productionApprovedCount !== 0) {
  failures.push(`productionApprovedCount from items must be 0, got ${productionApprovedCount}`);
}

if (failures.length > 0) {
  console.error('unity U8.1 asset intake check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`unity U8.1 asset intake check passed: manifestItems=${manifest?.items.length ?? 0}, runtimeIncluded=${runtimeIncludedCount}, productionApproved=${productionApprovedCount}`);
