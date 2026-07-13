import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { u47SimulatorCaptures, u47SimulatorCaptureCatalogHash } from '../unity/u47-simulator-capture-catalog.ts';
import { u47SimulatorEvidenceSourceFiles } from '../unity/u47-simulator-evidence-sources.ts';

const root = resolve(import.meta.dirname, '../..');
const check = (value: unknown, message: string): void => { if (!value) throw new Error(`U47 manifest check failed: ${message}`); };
const bytes = (path: string) => readFileSync(resolve(root, path));
const sha = (path: string) => createHash('sha256').update(bytes(path)).digest('hex');
const manifest = JSON.parse(readFileSync(resolve(root, 'docs/design-targets/generated/unity-u47/simulator-smoke/manifest.json'), 'utf8'));
const summary = JSON.parse(readFileSync(resolve(root, 'docs/design-targets/generated/unity-u47/simulator-smoke/summary.json'), 'utf8'));
check(manifest.schemaVersion === 2 && manifest.expectedCaptureCount === 23 && manifest.entries.length === 23, 'schema/count');
check(manifest.routeCatalogHash === u47SimulatorCaptureCatalogHash, 'catalog hash');
check(manifest.semanticRouteCount === new Set(u47SimulatorCaptures.map(value => value.baseRouteId)).size && manifest.semanticRouteCount !== 23, 'semantic route derivation');
check(new Set(manifest.entries.map((value: { captureId: string }) => value.captureId)).size === 23, 'duplicate captureId');
const sourceHash = createHash('sha256');
for (const file of u47SimulatorEvidenceSourceFiles) sourceHash.update(file).update('\0').update(readFileSync(resolve(root, file))).update('\0');
check(manifest.sourceFingerprint === sourceHash.digest('hex'), 'stale source fingerprint');
const runStart = Date.parse(manifest.runStartedAtUtc); const runEnd = Date.parse(manifest.runCompletedAtUtc);
check(Number.isFinite(runStart) && Number.isFinite(runEnd) && runEnd >= runStart, 'run timestamp range');
for (const capture of u47SimulatorCaptures) {
  const entry = manifest.entries.find((value: { captureId: string }) => value.captureId === capture.captureId);
  check(entry, `missing ${capture.captureId}`); check(entry.baseRouteId === capture.baseRouteId && entry.captureKind === capture.captureKind, `${capture.captureId} route/kind`); check(entry.sizeKey === capture.viewport.sizeKey && entry.width === capture.viewport.width && entry.height === capture.viewport.height, `${capture.captureId} viewport`);
  check(statSync(resolve(root, entry.screenshotPath)).size > 0 && statSync(resolve(root, entry.runtimeResultPath)).size > 0, `${capture.captureId} empty file`); check(sha(entry.screenshotPath) === entry.screenshotSha256 && sha(entry.runtimeResultPath) === entry.runtimeResultSha256, `${capture.captureId} sha256`);
  const png = bytes(entry.screenshotPath); check(png.readUInt32BE(16) === capture.viewport.width && png.readUInt32BE(20) === capture.viewport.height, `${capture.captureId} PNG dimensions`);
  const result = JSON.parse(bytes(entry.runtimeResultPath).toString('utf8')); check(result.captureId === capture.captureId && result.baseRouteId === capture.baseRouteId && result.catalogHash === manifest.routeCatalogHash, `${capture.captureId} runtime identity`); check(result.passed === true && result.unhandledExceptionCount === 0 && result.assertionFailureCount === 0, `${capture.captureId} runtime pass`); check(capture.requiredAssertions.every(key => result.checks[key] === true), `${capture.captureId} required assertions`);
}
check(summary.passed === true && summary.completedCaptureCount === 23 && summary.unhandledExceptionCount === 0 && summary.assertionFailureCount === 0, 'summary');
for (const id of ['08-black-ink-area','09-streetlamp-area','11-dawn-ink-lamp']) { const result = JSON.parse(bytes(`docs/design-targets/generated/unity-u47/simulator-smoke/runtime-results/${id}.json`).toString()); check(result.details.executorType === 'GroundArea' && result.details.pickupProcessing === false && result.details.damageTickCountFinal > 0 && result.details.durationEndedAndDespawned === true && result.details.duplicateExecutorCount === 0, `${id} DoT evidence`); }
const revival = JSON.parse(bytes('docs/design-targets/generated/unity-u47/simulator-smoke/runtime-results/15-revival-30-percent.json').toString()); check(revival.details.ticketDefinitionId === 'dawn_ticket' && revival.details.actualRevivedHp === revival.details.expectedRevivedHp && revival.details.ticketCountBefore === 1 && revival.details.ticketCountAfter === 0 && revival.details.secondRevivalPrevented === true, 'dawn ticket revival evidence');
console.log('U47 Simulator manifest check passed: 23 current captures, hashes/viewports/runtime assertions match, stale evidence 0.');
