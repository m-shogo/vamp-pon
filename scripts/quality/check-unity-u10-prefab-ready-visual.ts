import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

type AlphaReportEntry = {
  id: string;
  source: string;
  output: string;
  greenSpillRemainingPixels: number;
  edgeTouches: boolean;
  hasAlphaChannel: boolean;
};

type ManifestItem = {
  id: string;
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
  hasAlphaChannel: boolean;
  remainingGreenHuePixels: number;
};

type Manifest = {
  productionApprovedCount: number;
  sourceAlphaReport: string;
  runtimeRoot: string;
  proofOnly: boolean;
  formalResultImplementation: boolean;
  formalStageSelectImplementation: boolean;
  kokuyouRuntimeImplemented: boolean;
  addressablesIntroduced: boolean;
  items: ManifestItem[];
};

const manifestPath = 'docs/design-targets/generated/unity-u10/u10-prefab-ready-visual-candidate-manifest.json';
const runtimeRoot = 'unity/VampPonUnity/Assets/_Project/Resources/U10Candidates';
const screenshotsRoot = 'docs/design-targets/generated/unity-u10/screenshots';
const expectedIds = new Set([
  'result_continue_paper_button',
  'result_stats_ink_strip',
  'stageselect_route_active_node',
  'stageselect_route_locked_node',
  'kokuyou_fullscreen_final_candidate_a',
  'kokuyou_fullscreen_final_candidate_b',
  'levelup_rare_memory_tear_burst',
  'cutin_black_ink_band_final_candidate',
]);
const requiredScreenshots = [
  'u10-result-prefab-ready-proof-390x844.png',
  'u10-result-prefab-ready-proof-360x800.png',
  'u10-result-prefab-ready-proof-430x932.png',
  'u10-stageselect-prefab-ready-proof-390x844.png',
  'u10-stageselect-prefab-ready-proof-360x800.png',
  'u10-stageselect-prefab-ready-proof-430x932.png',
  'u10-kokuyou-rare-cutin-comparison-390x844.png',
];
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

function searchFiles(dir: string, pattern: RegExp): boolean {
  if (!existsSync(dir)) return false;
  for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.cs') || entry.name.includes('Editor')) continue;
    const path = join(entry.parentPath, entry.name);
    if (path.includes('/Editor/')) continue;
    if (path.includes('/U14/')) continue;
    if (path.includes('/U18/')) continue;
    if (path.includes('/U19/')) continue;
    if (path.includes('/U20/')) continue;
    if (path.includes('/U21/')) continue;
    if (path.includes('/U22/')) continue;
    if (pattern.test(readFileSync(path, 'utf8'))) return true;
  }
  return false;
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
  if (manifest.runtimeRoot !== runtimeRoot) failures.push(`runtimeRoot must be ${runtimeRoot}, got ${manifest.runtimeRoot}`);
  if (manifest.productionApprovedCount !== 0) failures.push(`productionApprovedCount must be 0, got ${manifest.productionApprovedCount}`);
  if (manifest.proofOnly !== true) failures.push('manifest proofOnly must be true');
  if (manifest.formalResultImplementation !== false) failures.push('formalResultImplementation must be false');
  if (manifest.formalStageSelectImplementation !== false) failures.push('formalStageSelectImplementation must be false');
  if (manifest.kokuyouRuntimeImplemented !== false) failures.push('kokuyouRuntimeImplemented must be false');
  if (manifest.addressablesIntroduced !== false) failures.push('addressablesIntroduced must be false');
  if (!existsSync(alphaReportPath)) failures.push(`sourceAlphaReport missing: ${alphaReportPath}`);

  for (const item of manifest.items ?? []) {
    for (const field of [
      'id',
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
    if (item.productionStatus !== 'candidate') failures.push(`${item.id}: productionStatus must be candidate`);
    if (item.runtimeIncluded !== true) failures.push(`${item.id}: runtimeIncluded must be true`);
    if (!existsSync(item.sourceGreenbackPath)) failures.push(`${item.id}: sourceGreenbackPath missing`);
    if (!existsSync(item.alphaOutputPath)) failures.push(`${item.id}: alphaOutputPath missing`);
    if (item.runtimeIncluded && !existsSync(item.runtimePath)) failures.push(`${item.id}: runtimePath missing`);
    if (!existsSync(item.qaReportPath)) failures.push(`${item.id}: qaReportPath missing`);
    if (!item.runtimePath.startsWith(`${runtimeRoot}/`)) failures.push(`${item.id}: runtimePath must be under ${runtimeRoot}`);
    if (item.runtimePath.includes('public/assets/sprites/') || item.sourceGreenbackPath.includes('public/assets/sprites/') || item.alphaOutputPath.includes('public/assets/sprites/')) {
      failures.push(`${item.id}: path uses retired public/assets/sprites`);
    }
    if (item.textBakedRuntimeImage !== false) failures.push(`${item.id}: textBakedRuntimeImage must be false`);
    if (!allowedArtChecks.has(item.visualArtDirectionCheck)) failures.push(`${item.id}: invalid visualArtDirectionCheck`);
    if (item.greenSpillRemainingPixels !== 0) failures.push(`${item.id}: greenSpillRemainingPixels must be 0`);
    if (item.edgeTouches !== false) failures.push(`${item.id}: edgeTouches must be false`);
    if (item.hasAlphaChannel !== true) failures.push(`${item.id}: hasAlphaChannel must be true`);
    if (item.remainingGreenHuePixels !== 0) failures.push(`${item.id}: remainingGreenHuePixels must be 0`);

    const report = reportByOutput.get(item.alphaOutputPath);
    if (report == null) {
      failures.push(`${item.id}: alphaOutputPath not found in source alpha report`);
    } else {
      if (report.source !== item.sourceGreenbackPath) failures.push(`${item.id}: sourceGreenbackPath mismatch report=${report.source}`);
      if (report.greenSpillRemainingPixels !== item.greenSpillRemainingPixels) failures.push(`${item.id}: greenSpillRemainingPixels mismatch`);
      if (report.edgeTouches !== item.edgeTouches) failures.push(`${item.id}: edgeTouches mismatch`);
      if (report.hasAlphaChannel !== item.hasAlphaChannel) failures.push(`${item.id}: hasAlphaChannel mismatch`);
    }
  }

  for (const expectedId of expectedIds) {
    if (!ids.has(expectedId)) failures.push(`missing expected U10 manifest item: ${expectedId}`);
  }
  for (const item of manifest.items ?? []) {
    if (!expectedIds.has(item.id)) failures.push(`unexpected U10 manifest item: ${item.id}`);
  }

  const manifestRuntimePaths = new Set((manifest.items ?? []).filter((item) => item.runtimeIncluded).map((item) => item.runtimePath));
  for (const runtimePng of walkPng(runtimeRoot)) {
    if (!manifestRuntimePaths.has(runtimePng)) failures.push(`runtime U10Candidates image is not in manifest: ${runtimePng}`);
  }
}

for (const screenshot of requiredScreenshots) {
  if (!existsSync(join(screenshotsRoot, screenshot))) failures.push(`screenshot missing: ${screenshot}`);
}

if (existsSync('unity/VampPonUnity/Assets/AddressableAssetsData')) failures.push('Addressables data must not exist');
if (searchFiles('unity/VampPonUnity/Assets/_Project/Scripts', /ResultScene|ResultManager|ResultController/)) failures.push('formal Result runtime hook detected');
if (searchFiles('unity/VampPonUnity/Assets/_Project/Scripts', /StageSelectScene|StageSelectManager|StageSelectController/)) failures.push('formal StageSelect runtime hook detected');
if (searchFiles('unity/VampPonUnity/Assets/_Project/Scripts', /KokuyouRuntime|KokuyouGauge|KokuyouButton/)) failures.push('kokuyou runtime hook detected');

if (productionApprovedCount !== 0) failures.push(`productionApprovedCount from items must be 0, got ${productionApprovedCount}`);

if (failures.length > 0) {
  console.error('unity U10 prefab-ready visual check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`unity U10 prefab-ready visual check passed: manifestItems=${manifest?.items.length ?? 0}, runtimeIncluded=${runtimeIncludedCount}, productionApproved=${productionApprovedCount}, screenshots=${requiredScreenshots.length}`);
