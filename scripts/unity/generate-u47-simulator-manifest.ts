import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { u47SimulatorCaptures, u47SimulatorCaptureCatalogHash } from './u47-simulator-capture-catalog.ts';
import { normalizeU47SimulatorEvidenceSource, u47SimulatorEvidenceSourceFiles } from './u47-simulator-evidence-sources.ts';

const root = resolve(import.meta.dirname, '../..');
const evidenceRoot = resolve(root, 'docs/design-targets/generated/unity-u47/simulator-smoke');
const sha = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const sourceFingerprint = createHash('sha256');
for (const file of u47SimulatorEvidenceSourceFiles) sourceFingerprint.update(file).update('\0').update(normalizeU47SimulatorEvidenceSource(file, readFileSync(resolve(root, file)))).update('\0');

const entries = u47SimulatorCaptures.map(capture => {
  const screenshot = resolve(evidenceRoot, 'screenshots', `${capture.captureId}.png`);
  const runtime = resolve(evidenceRoot, 'runtime-results', `${capture.captureId}.json`);
  const result = JSON.parse(readFileSync(runtime, 'utf8'));
  if (result.captureId !== capture.captureId || result.baseRouteId !== capture.baseRouteId || result.passed !== true) throw new Error(`Invalid runtime result: ${capture.captureId}`);
  return {
    captureId: capture.captureId,
    baseRouteId: capture.baseRouteId,
    captureKind: capture.captureKind,
    sizeKey: capture.viewport.sizeKey,
    width: capture.viewport.width,
    height: capture.viewport.height,
    screenshotPath: relative(root, screenshot),
    runtimeResultPath: relative(root, runtime),
    screenshotSha256: sha(screenshot),
    runtimeResultSha256: sha(runtime),
    capturedAtUtc: new Date(Math.max(statSync(screenshot).mtimeMs, statSync(runtime).mtimeMs)).toISOString(),
    passed: true,
  };
});

const manifest = {
  schemaVersion: 2,
  generatedAtUtc: new Date().toISOString(),
  sourceHead: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  sourceFingerprint: sourceFingerprint.digest('hex'),
  routeCatalogHash: u47SimulatorCaptureCatalogHash,
  expectedCaptureCount: 23,
  semanticRouteCount: new Set(u47SimulatorCaptures.map(value => value.baseRouteId)).size,
  runStartedAtUtc: entries.map(value => value.capturedAtUtc).sort()[0],
  runCompletedAtUtc: entries.map(value => value.capturedAtUtc).sort().at(-1),
  entries,
};
writeFileSync(resolve(evidenceRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`U47 Simulator manifest written: ${entries.length} entries, source ${manifest.sourceFingerprint}`);
