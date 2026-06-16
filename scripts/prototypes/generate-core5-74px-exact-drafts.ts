import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { prepareCell, type Bounds } from './core5-image/cell-cleanup.ts';
import { cropImage, pasteImage } from './core5-image/image-copy.ts';
import { blankImage, decodePng, encodePng, type RgbaImage } from './core5-image/png-rgba.ts';

type CharacterAsset = { id: string; spriteSheetPath: string; exactSpriteSheetPath: string };
type Manifest = { productionTouched: boolean; characters: CharacterAsset[] };
type Layout = { width: number; height: number; x: number; y: number; scale: number; mode: string };

const SOURCE_CELL_SIZE = 181;
const TARGET_CELL_SIZE = 74;
const COLUMNS = 8;
const ROWS = 6;
const SOURCE_WIDTH = COLUMNS * SOURCE_CELL_SIZE;
const SOURCE_HEIGHT = ROWS * SOURCE_CELL_SIZE;
const TARGET_WIDTH = COLUMNS * TARGET_CELL_SIZE;
const TARGET_HEIGHT = ROWS * TARGET_CELL_SIZE;

function percentile(values: number[], ratio: number): number {
  if (values.length === 0) return 1;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * ratio))];
}

function fit(bounds: Bounds, maxWidth: number, maxHeight: number): number {
  return Math.min(maxWidth / Math.max(1, bounds.width), maxHeight / Math.max(1, bounds.height), 1);
}

function layoutCell(index: number, content: Bounds, anchor: Bounds, commonScale: number): Layout {
  const center = TARGET_CELL_SIZE / 2;
  const bottom = TARGET_CELL_SIZE - 5;

  if (index >= 40) {
    const scale = fit(content, TARGET_CELL_SIZE - 12, TARGET_CELL_SIZE - 12);
    const width = Math.max(1, Math.round(content.width * scale));
    const height = Math.max(1, Math.round(content.height * scale));
    return {
      width,
      height,
      x: Math.round(center - width / 2),
      y: Math.round(center - height / 2),
      scale,
      mode: 'icon-center',
    };
  }

  if (index === 36) {
    const scale = fit(content, TARGET_CELL_SIZE - 8, TARGET_CELL_SIZE - 26);
    const width = Math.max(1, Math.round(content.width * scale));
    const height = Math.max(1, Math.round(content.height * scale));
    return {
      width,
      height,
      x: Math.round(center - width / 2),
      y: Math.round(bottom - height),
      scale,
      mode: 'downed-bottom',
    };
  }

  const scale = Math.min(commonScale, fit(content, TARGET_CELL_SIZE - 4, TARGET_CELL_SIZE - 6));
  const width = Math.max(1, Math.round(content.width * scale));
  const height = Math.max(1, Math.round(content.height * scale));
  const anchorX = (anchor.x + anchor.width / 2 - content.x) * scale;
  const anchorY = (anchor.y + anchor.height - content.y) * scale;
  return {
    width,
    height,
    x: Math.round(center - anchorX),
    y: Math.round(bottom - anchorY),
    scale,
    mode: 'body-bottom-anchor',
  };
}

function resizeWithSips(image: RgbaImage, width: number, height: number, temp: string, key: string): RgbaImage {
  const input = join(temp, `${key}-in.png`);
  const output = join(temp, `${key}-out.png`);
  writeFileSync(input, encodePng(image));
  const result = spawnSync(
    'sips',
    ['--resampleHeightWidth', String(height), String(width), input, '--out', output],
    { encoding: 'utf8' },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `sips failed: ${key}`);
  return decodePng(readFileSync(output));
}

if (process.platform !== 'darwin') throw new Error('Core5 cell resize uses macOS sips');
const manifest = JSON.parse(readFileSync('data/character-assets/core5-character-master-assets.json', 'utf8')) as Manifest;
if (manifest.productionTouched !== false) throw new Error('productionTouched must remain false');

const temp = mkdtempSync(join(tmpdir(), 'vamp-pon-core5-'));
const reports: Array<Record<string, unknown>> = [];

try {
  for (const character of manifest.characters) {
    if (!existsSync(character.spriteSheetPath)) throw new Error(`${character.id}: missing ${character.spriteSheetPath}`);
    const source = decodePng(readFileSync(character.spriteSheetPath));
    if (source.width !== SOURCE_WIDTH || source.height !== SOURCE_HEIGHT) {
      throw new Error(`${character.id}: expected ${SOURCE_WIDTH}x${SOURCE_HEIGHT}, got ${source.width}x${source.height}`);
    }

    const cells = Array.from({ length: COLUMNS * ROWS }, (_, index) =>
      prepareCell(source, index, COLUMNS, SOURCE_CELL_SIZE));
    const anchors = cells
      .filter((cell) => cell.index < 40 && cell.index !== 36 && cell.anchorBounds)
      .map((cell) => cell.anchorBounds as Bounds);
    const commonScale = Math.min(
      62 / percentile(anchors.map((bounds) => bounds.width), 0.9),
      61 / percentile(anchors.map((bounds) => bounds.height), 0.9),
      1,
    );
    const output = blankImage(TARGET_WIDTH, TARGET_HEIGHT);
    const cellReports: Array<Record<string, unknown>> = [];

    for (const cell of cells) {
      if (!cell.contentBounds || !cell.anchorBounds) continue;
      const layout = layoutCell(cell.index, cell.contentBounds, cell.anchorBounds, commonScale);
      const cropped = cropImage(cell.image, cell.contentBounds);
      const resized = resizeWithSips(cropped, layout.width, layout.height, temp, `${character.id}-${cell.index}`);
      const x = (cell.index % COLUMNS) * TARGET_CELL_SIZE + layout.x;
      const y = Math.floor(cell.index / COLUMNS) * TARGET_CELL_SIZE + layout.y;
      pasteImage(output, resized, x, y);
      cellReports.push({
        index: cell.index,
        ...layout,
        contentBounds: cell.contentBounds,
        anchorBounds: cell.anchorBounds,
      });
    }

    mkdirSync(dirname(character.exactSpriteSheetPath), { recursive: true });
    writeFileSync(character.exactSpriteSheetPath, encodePng(output));
    reports.push({ id: character.id, commonScale, cells: cellReports });
    console.log(`cleaned ${character.id}: 48 x 181px -> transparent, aligned 48 x 74px`);
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}

const reportPath = join(dirname(manifest.characters[0].exactSpriteSheetPath), 'cleanup-report.json');
writeFileSync(reportPath, `${JSON.stringify({ productionTouched: false, characters: reports }, null, 2)}\n`);
console.log(`Core5 74px drafts complete. Original ${SOURCE_WIDTH}x${SOURCE_HEIGHT} boards were not modified.`);
