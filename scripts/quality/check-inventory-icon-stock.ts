import { existsSync, readFileSync } from 'node:fs';
import { weapons } from '../../src/game/data/weapons.ts';
import { passives } from '../../src/game/data/passives.ts';
import { rareItems } from '../../src/game/data/rareItems.ts';

type Category = 'weapon' | 'passive' | 'rare';
type Entry = {
  category: Category;
  itemId: string;
  name: string;
  assetId: string;
  path: string;
  status: 'planned' | 'draft' | 'ready';
  priority: 'P0' | 'P1';
  fallbackGlyph: string;
  interimAssetId?: string;
  visualBrief: string;
};

type Stock = {
  target: { canvasPx: number; safeAreaPx: number; format: string; background: string; outputRoot: string };
  icons: Entry[];
};

const STOCK_PATH = 'data/ui-assets/inventory-icon-requirements.json';
const stock = JSON.parse(readFileSync(STOCK_PATH, 'utf8')) as Stock;
const errors: string[] = [];

if (stock.target.canvasPx !== 32) errors.push(`canvasPx must be 32, got ${stock.target.canvasPx}`);
if (stock.target.safeAreaPx > stock.target.canvasPx) errors.push('safeAreaPx must not exceed canvasPx');

const expected = [
  ...weapons.map((item) => ({ category: 'weapon' as const, itemId: item.id })),
  ...passives.map((item) => ({ category: 'passive' as const, itemId: item.id })),
  ...rareItems.map((item) => ({ category: 'rare' as const, itemId: item.id })),
];

const byKey = new Map<string, Entry>();
const assetIds = new Set<string>();
const paths = new Set<string>();

for (const icon of stock.icons) {
  const key = `${icon.category}:${icon.itemId}`;
  if (byKey.has(key)) errors.push(`duplicate key: ${key}`);
  byKey.set(key, icon);
  if (assetIds.has(icon.assetId)) errors.push(`duplicate assetId: ${icon.assetId}`);
  assetIds.add(icon.assetId);
  if (paths.has(icon.path)) errors.push(`duplicate path: ${icon.path}`);
  paths.add(icon.path);
  if (!icon.fallbackGlyph.trim()) errors.push(`fallbackGlyph missing: ${key}`);
  if (!icon.visualBrief.trim()) errors.push(`visualBrief missing: ${key}`);

  const publicPath = `public/${icon.path}`;
  if (icon.status === 'ready' && !existsSync(publicPath)) {
    errors.push(`ready icon file missing: ${publicPath}`);
  }
}

for (const item of expected) {
  const key = `${item.category}:${item.itemId}`;
  if (!byKey.has(key)) errors.push(`icon stock missing: ${key}`);
}

for (const key of byKey.keys()) {
  if (!expected.some((item) => `${item.category}:${item.itemId}` === key)) {
    errors.push(`orphan icon stock entry: ${key}`);
  }
}

if (errors.length > 0) {
  console.error('inventory-icon-stock: failed');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const counts = stock.icons.reduce<Record<string, number>>((result, icon) => {
  result[icon.status] = (result[icon.status] ?? 0) + 1;
  return result;
}, {});
console.log('inventory-icon-stock: ok');
console.log(`total=${stock.icons.length} weapon=${weapons.length} passive=${passives.length} rare=${rareItems.length}`);
console.log(`planned=${counts.planned ?? 0} draft=${counts.draft ?? 0} ready=${counts.ready ?? 0}`);
