import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

type Check = { label: string; ok: boolean; detail?: string };
const checks: Check[] = [];

const MANIFEST = 'data/character-assets/core5-character-master-assets.json';
const CELLS = 'data/character-assets/core5-52px-sprite-sheet-cells.json';

// --- manifest existence ---
checks.push({ label: `manifest exists: ${MANIFEST}`, ok: existsSync(MANIFEST) });
checks.push({ label: `cell def exists: ${CELLS}`, ok: existsSync(CELLS) });

if (!existsSync(MANIFEST) || !existsSync(CELLS)) {
  for (const c of checks) console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.label}`);
  console.error('\ncharacter-assets:verify failed (missing base files)');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const cells = JSON.parse(readFileSync(CELLS, 'utf8'));

// --- manifest-level checks ---
checks.push({
  label: 'manifest productionTouched is false',
  ok: manifest.productionTouched === false,
});

const chars = manifest.characters as Array<Record<string, unknown>>;
const expectedIds = ['yui', 'asa', 'nagi', 'michiru', 'tomori'];

checks.push({
  label: `manifest has all 5 characters`,
  ok: expectedIds.every((id) => chars.some((c) => c.id === id)),
  detail: chars.map((c) => c.id).join(', '),
});

for (const ch of chars) {
  const id = String(ch.id);

  checks.push({
    label: `${id} gameUseStatus is prototype-sheet-only`,
    ok: ch.gameUseStatus === 'prototype-sheet-only',
    detail: String(ch.gameUseStatus ?? ''),
  });

  const mbp = String(ch.masterBoardPath ?? '');
  checks.push({
    label: `${id} masterBoardPath exists`,
    ok: existsSync(mbp),
    detail: mbp,
  });

  const ssp = String(ch.spriteSheetPath ?? '');
  const sspExists = existsSync(ssp);
  checks.push({
    label: `${id} spriteSheetPath exists (or is placeholder)`,
    ok: sspExists || ssp.includes('sprite-sheets/core5-52px/'),
    detail: sspExists ? ssp : `${ssp} (not yet placed)`,
  });
}

// --- cell definition checks ---
checks.push({
  label: 'cell def totalCells is 48',
  ok: cells.totalCells === 48,
  detail: String(cells.totalCells),
});

const cellArr = cells.cells as Array<{ index: number }>;
checks.push({
  label: 'cell def has 48 entries',
  ok: cellArr.length === 48,
  detail: String(cellArr.length),
});

const indices = cellArr.map((c) => c.index).sort((a, b) => a - b);
const expectedIndices = Array.from({ length: 48 }, (_, i) => i);
checks.push({
  label: 'cell indices 0-47 no duplicates',
  ok: JSON.stringify(indices) === JSON.stringify(expectedIndices),
});

// --- production contamination check ---
let contamination = '';
try {
  contamination = execSync(
    'find public/assets/sprites/player -type f -name "*core5*" -o -name "*sprite-sheet*" 2>/dev/null',
    { encoding: 'utf8' },
  ).trim();
} catch {
  contamination = '';
}
checks.push({
  label: 'no Core5 prototype in production player sprites',
  ok: contamination === '',
  detail: contamination || undefined,
});

// --- report ---
const failed = checks.filter((c) => !c.ok);
for (const c of checks) {
  const detail = !c.ok && c.detail ? `\n     ${c.detail}` : '';
  console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.label}${detail}`);
}

if (failed.length > 0) {
  console.error(`\ncharacter-assets:verify failed (${failed.length} issue(s))`);
  process.exit(1);
}

console.log(`\ncharacter-assets:verify passed: ${checks.length} checks.`);
