import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

type Asset = {
  id: string;
  season: string;
  file: string;
  width: number;
  height: number;
  bytes: number;
  sha256: string;
  usage: string;
  sourceStatus: string;
};

type Manifest = {
  schemaVersion: string;
  usageDecision: string;
  topPrimaryBackground: boolean;
  humanReview: { explicitlySelected: boolean };
  generationRecord: { exactPromptAvailable: boolean };
  approval: {
    status: string;
    humanSelectedForDirection: boolean;
    approvedAsFinal: boolean;
    runtimeApproved: boolean;
    runtimeConnected: boolean;
    finalApprovalBlocked: boolean;
  };
  assets: Asset[];
};

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(SCRIPT_DIR, '..', '..');
const ASSET_DIR = join(
  REPO_ROOT,
  'docs',
  'design-targets',
  'generated',
  'seasonal-loading-key-art-2026-08-01',
);
const MANIFEST_PATH = join(ASSET_DIR, 'manifest.json');
const EXPECTED_SEASONS = ['spring', 'summer', 'autumn', 'winter'];
const TARGET_ASPECT = 390 / 844;
const MAX_ASPECT_DELTA = 0.002;

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function inspectPng(path: string): { width: number; height: number; colorType: number } {
  const data = readFileSync(path);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  invariant(data.subarray(0, 8).equals(signature), `${path}: invalid PNG signature`);
  invariant(data.subarray(12, 16).toString('ascii') === 'IHDR', `${path}: missing IHDR`);
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
    colorType: data.readUInt8(25),
  };
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as Manifest;

invariant(manifest.schemaVersion === 'seasonal-loading-key-art.0.1', 'unexpected schemaVersion');
invariant(manifest.usageDecision === 'LOADING_KEY_ART', 'usage must remain LOADING_KEY_ART');
invariant(manifest.topPrimaryBackground === false, 'TOP primary background must remain false');
invariant(manifest.humanReview.explicitlySelected === true, 'human selection must be recorded');
invariant(manifest.generationRecord.exactPromptAvailable === false, 'missing exact prompt must remain explicit');
invariant(manifest.approval.status === 'candidate', 'assets must remain candidate');
invariant(manifest.approval.humanSelectedForDirection === true, 'direction selection must remain true');
invariant(manifest.approval.approvedAsFinal === false, 'approvedAsFinal must remain false');
invariant(manifest.approval.runtimeApproved === false, 'runtimeApproved must remain false');
invariant(manifest.approval.runtimeConnected === false, 'runtimeConnected must remain false');
invariant(manifest.approval.finalApprovalBlocked === true, 'finalApprovalBlocked must remain true');
invariant(manifest.assets.length === 4, `expected 4 assets, got ${manifest.assets.length}`);

const ids = new Set<string>();
const seasons = new Set<string>();

for (const asset of manifest.assets) {
  invariant(!ids.has(asset.id), `duplicate id: ${asset.id}`);
  invariant(!seasons.has(asset.season), `duplicate season: ${asset.season}`);
  ids.add(asset.id);
  seasons.add(asset.season);
  invariant(asset.usage === 'loading_key_art', `${asset.id}: invalid usage`);
  invariant(asset.sourceStatus === 'human_selected_candidate', `${asset.id}: invalid sourceStatus`);

  const path = join(ASSET_DIR, asset.file);
  const data = readFileSync(path);
  const png = inspectPng(path);
  const digest = createHash('sha256').update(data).digest('hex');
  const bytes = statSync(path).size;
  const aspectDelta = Math.abs(png.width / png.height - TARGET_ASPECT);

  invariant(png.width === asset.width, `${asset.id}: width mismatch`);
  invariant(png.height === asset.height, `${asset.id}: height mismatch`);
  invariant(png.colorType === 2, `${asset.id}: expected RGB PNG color type 2`);
  invariant(bytes === asset.bytes, `${asset.id}: byte size mismatch`);
  invariant(digest === asset.sha256, `${asset.id}: sha256 mismatch`);
  invariant(aspectDelta <= MAX_ASPECT_DELTA, `${asset.id}: portrait aspect is outside tolerance`);
}

for (const season of EXPECTED_SEASONS) {
  invariant(seasons.has(season), `missing season: ${season}`);
}

console.log('seasonal loading key art: PASS');
console.log(`assets: ${manifest.assets.length}/4`);
console.log('decision: LOADING_KEY_ART / TOP primary background=false');
console.log('approval: human-selected direction / candidate / runtime not connected');

