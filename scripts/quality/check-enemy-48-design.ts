import { existsSync, readFileSync } from 'node:fs';

type Cell = {
  no: number; id: string; name: string; tier: string; kind: string | null;
  stage: number; family: string | null; palette: string; formOf: string | null;
  role: string; status: string; row: number; column: number;
};
type RecordData = {
  no: number; id: string; name: string; tier: string; kind: string | null;
  stage: number; family: string | null; palette: string; formOf: string | null;
  role: string; status: string;
  visual: { silhouette: string; ratio: string; eyes: string; parts: string[]; occupancy: [number, number]; nativePx: number };
  gameplay: { move: string; attack: string; telegraph: string; counter: string };
  animation: string[]; differentiate: string;
};
type Manifest = {
  schemaVersion: number; status: string;
  canvas: { width: number; height: number; mode: string; alpha: number };
  grid: { columns: number; rows: number; cell: number; count: number; safeBorder: number };
  distribution: { grunt: number; midboss: number; boss: number; bossForm: number };
  gruntComposition: { omb: number; ombro: number; stageUnique: number };
  commonFamilies: Record<string, { count: number }>;
  stagePalettes: Record<string, { paletteKey: string }>;
  designCatalog: string; cells: unknown[][];
};
type Index = { schemaVersion: number; status: string; requiredFields: string[]; designFiles: string[]; expectedRecords: number };
type DesignFile = { schemaVersion: number; status: string; records: RecordData[] };

const MANIFEST_PATH = 'data/enemy-assets/enemy-48-sprite-sheet-cells.json';
const LEGACY = /(pon_shadow|grown_pon_shadow|ポン影|ふくらみポン影)/;

function ok(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}
function json<T>(path: string): T {
  ok(existsSync(path), `missing: ${path}`);
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}
function at(value: unknown, path: string): unknown {
  let current = value;
  for (const key of path.split('.')) {
    if (typeof current !== 'object' || current === null || !(key in current)) return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}
function present(value: unknown): boolean {
  return value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0);
}
function tupleToCell(tuple: unknown[], index: number): Cell {
  const [no,id,name,tier,kind,stage,family,palette,formOf,role,status] = tuple;
  return {
    no: Number(no), id: String(id), name: String(name), tier: String(tier),
    kind: kind === null ? null : String(kind), stage: Number(stage),
    family: family === null ? null : String(family), palette: String(palette),
    formOf: formOf === null ? null : String(formOf), role: String(role), status: String(status),
    row: Math.floor(index / 8) + 1, column: (index % 8) + 1,
  };
}

export function validateEnemy48Design(): { manifest: Manifest; cells: Cell[]; records: RecordData[] } {
  const manifest = json<Manifest>(MANIFEST_PATH);
  const index = json<Index>(manifest.designCatalog);
  ok(manifest.schemaVersion === 4 && manifest.status === 'design-ready', 'invalid enemy manifest version/status');
  ok(index.schemaVersion === 2 && index.status === 'design-ready', 'invalid design index version/status');
  ok(manifest.canvas.width === 1440 && manifest.canvas.height === 1080, 'canvas must be 1440x1080');
  ok(manifest.canvas.mode === 'RGBA' && manifest.canvas.alpha === 0, 'canvas must be transparent RGBA');
  ok(manifest.grid.columns === 8 && manifest.grid.rows === 6 && manifest.grid.cell === 180 && manifest.grid.count === 48, 'grid must be 8x6 / 180 / 48');
  ok(manifest.grid.safeBorder === 4, 'safe border must be 4');
  ok(manifest.distribution.grunt === 25 && manifest.distribution.midboss === 10 && manifest.distribution.boss === 3 && manifest.distribution.bossForm === 10, 'invalid tier distribution');
  ok(manifest.gruntComposition.omb === 5 && manifest.gruntComposition.ombro === 5 && manifest.gruntComposition.stageUnique === 15, 'invalid grunt composition');
  ok(manifest.commonFamilies.omb?.count === 5 && manifest.commonFamilies.ombro?.count === 5, 'invalid common family counts');
  ok(!('pon_shadow' in manifest.commonFamilies) && !('grown_pon_shadow' in manifest.commonFamilies), 'legacy common family exists');

  const records = index.designFiles.flatMap((path) => {
    const file = json<DesignFile>(path);
    ok(file.schemaVersion === 1 && file.status === 'design-ready' && file.records.length > 0, `invalid design file: ${path}`);
    return file.records;
  });
  ok(records.length === index.expectedRecords && records.length === 48, `expected 48 records, got ${records.length}`);
  const cells = manifest.cells.map(tupleToCell);
  ok(cells.length === 48, `expected 48 cells, got ${cells.length}`);

  const byId = new Map<string, RecordData>();
  for (const record of records) {
    ok(!byId.has(record.id), `duplicate design id: ${record.id}`);
    ok(!LEGACY.test(record.id) && !LEGACY.test(record.name), `legacy name: ${record.id}`);
    ok(record.status === 'design-ready', `${record.id}: not design-ready`);
    for (const field of index.requiredFields) ok(present(at(record, field)), `${record.id}: missing ${field}`);
    const [min,max] = record.visual.occupancy;
    ok(min > 0 && min < max && max <= 94, `${record.id}: bad occupancy`);
    ok(record.visual.nativePx >= 32 && record.visual.nativePx <= 160, `${record.id}: bad nativePx`);
    ok(record.animation.length >= 4, `${record.id}: insufficient animation list`);
    byId.set(record.id, record);
  }

  const ids = new Set<string>();
  const tiers = { grunt: 0, midboss: 0, boss: 0, boss_form: 0 };
  cells.forEach((cell, i) => {
    ok(cell.no === i + 1, `${cell.id}: bad order`);
    ok(!ids.has(cell.id), `duplicate cell id: ${cell.id}`);
    ok(!LEGACY.test(cell.id) && !LEGACY.test(cell.name), `legacy cell name: ${cell.id}`);
    ok(cell.status === 'design-ready', `${cell.id}: cell not design-ready`);
    ids.add(cell.id);
    ok(cell.tier in tiers, `${cell.id}: unknown tier`);
    tiers[cell.tier as keyof typeof tiers] += 1;
    const record = byId.get(cell.id);
    ok(record, `${cell.id}: design missing`);
    ok(record.no === cell.no && record.name === cell.name && record.tier === cell.tier, `${cell.id}: identity mismatch`);
    ok(record.kind === cell.kind && record.stage === cell.stage && record.family === cell.family, `${cell.id}: classification mismatch`);
    ok(record.palette === cell.palette && record.formOf === cell.formOf && record.role === cell.role, `${cell.id}: design mismatch`);
  });
  ok(tiers.grunt === 25 && tiers.midboss === 10 && tiers.boss === 3 && tiers.boss_form === 10, 'cell tier counts mismatch');

  const grunts = cells.filter((c) => c.tier === 'grunt');
  ok(grunts.filter((c) => c.family === 'omb').length === 5, 'Omb count mismatch');
  ok(grunts.filter((c) => c.family === 'ombro').length === 5, 'Ombro count mismatch');
  ok(grunts.filter((c) => c.kind === 'stage_unique').length === 15, 'unique grunt count mismatch');
  for (const stage of [1,2,3,4,5]) {
    const stageGrunts = grunts.filter((c) => c.stage === stage);
    ok(stageGrunts.length === 5, `Stage ${stage}: grunt count`);
    ok(stageGrunts.filter((c) => c.family === 'omb').length === 1, `Stage ${stage}: Omb count`);
    ok(stageGrunts.filter((c) => c.family === 'ombro').length === 1, `Stage ${stage}: Ombro count`);
    ok(stageGrunts.filter((c) => c.kind === 'stage_unique').length === 3, `Stage ${stage}: unique count`);
    ok(cells.filter((c) => c.stage === stage && c.tier === 'midboss').length === 2, `Stage ${stage}: midboss count`);
    const palette = manifest.stagePalettes[`stage${stage}`]?.paletteKey;
    ok(stageGrunts.every((c) => c.palette === palette), `Stage ${stage}: palette mismatch`);
  }
  const bosses = new Set(cells.filter((c) => c.tier === 'boss').map((c) => c.id));
  for (const form of cells.filter((c) => c.tier === 'boss_form')) ok(form.formOf !== null && bosses.has(form.formOf), `${form.id}: invalid formOf`);
  ok([...ids].every((id) => byId.has(id)) && [...byId.keys()].every((id) => ids.has(id)), 'manifest/catalog ID set mismatch');
  return { manifest, cells, records };
}

if (process.argv[1]?.endsWith('check-enemy-48-design.ts')) {
  validateEnemy48Design();
  console.log('enemy48 design: ok records=48');
  console.log('distribution: grunt=25 midboss=10 boss=3 bossForm=10');
  console.log('grunt composition: Omb=5 Ombro=5 stageUnique=15');
  console.log('per Stage: Omb=1 Ombro=1 unique=3 midboss=2');
  console.log('legacy Pon Shadow names: 0');
}
