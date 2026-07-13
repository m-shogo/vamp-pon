import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { u47SimulatorCaptures, u47SimulatorCaptureCatalogHash } from '../unity/u47-simulator-capture-catalog.ts';

const root = resolve(import.meta.dirname, '../..');
const fail = (message: string): never => { throw new Error(`U47 capture catalog check failed: ${message}`); };
const check = (value: unknown, message: string): void => { if (!value) fail(message); };
const dataPath = resolve(root, 'data/unity/u47-simulator-route-catalog.json');
const resourcePath = resolve(root, 'unity/VampPonUnity/Assets/_Project/Resources/GameplayData/U47SimulatorRouteCatalog.json');
const dataBytes = readFileSync(dataPath);
const resourceBytes = readFileSync(resourcePath);
const catalog = JSON.parse(dataBytes.toString('utf8'));

check(dataBytes.equals(resourceBytes), 'data and Unity Resources copies differ');
check(catalog.schemaVersion === 2 && catalog.expectedCaptureCount === 23, 'schema/count');
check(catalog.captures.length === 23 && u47SimulatorCaptures.length === 23, 'exact capture count');
check(new Set(catalog.captures.map((value: { captureId: string }) => value.captureId)).size === 23, 'duplicate captureId');
check(catalog.catalogHash === u47SimulatorCaptureCatalogHash, 'catalog hash mismatch');
check(catalog.semanticRouteCount === new Set(catalog.captures.map((value: { baseRouteId: string }) => value.baseRouteId)).size, 'semantic route count is not derived');
check(catalog.semanticRouteCount !== 23, 'captures incorrectly treated as 23 semantic routes');
check(JSON.stringify(catalog.captures) === JSON.stringify(u47SimulatorCaptures), 'generated catalog differs from source');
const compact = catalog.captures.find((value: { captureId: string }) => value.captureId === '22-compact-gameplay');
const large = catalog.captures.find((value: { captureId: string }) => value.captureId === '23-large-gameplay');
check(compact.captureKind === 'viewport-variant' && compact.baseRouteId === 'stage1-gameplay' && compact.viewport.sizeKey === 'compact' && compact.viewport.width === 360 && compact.viewport.height === 800, 'compact variant');
check(large.captureKind === 'viewport-variant' && large.baseRouteId === 'stage1-gameplay' && large.viewport.sizeKey === 'large' && large.viewport.width === 430 && large.viewport.height === 932, 'large variant');
check(catalog.captures.slice(0, 21).every((value: { captureKind: string; viewport: { sizeKey: string; width: number; height: number } }) => value.captureKind === 'state' && value.viewport.sizeKey === 'standard' && value.viewport.width === 390 && value.viewport.height === 844), 'standard captures 1-21');
check(createHash('sha256').update(JSON.stringify(catalog.captures)).digest('hex') === catalog.catalogHash, 'serialized capture hash');
console.log(`U47 capture catalog check passed: 23 captures, ${catalog.semanticRouteCount} semantic routes, no 69-entry expansion.`);
