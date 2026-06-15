import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { PROTOTYPE_ASEPRITE_EXPORTS, resolveAsepriteCli } from './aseprite-config.mjs';

// Reuses the player export lua; its guard allows any target under
// public/assets/sprites/player/ (prototypes/ is under that prefix).
const ASEPRITE_SCRIPT = 'scripts/aseprite/export-vamp-assets.lua';

function assertPrototypeTarget(target) {
  if (!target.startsWith('public/assets/sprites/player/prototypes/') || !target.endsWith('.png')) {
    throw new Error(`Refusing to export outside player prototypes: ${target}`);
  }
}

const { found } = resolveAsepriteCli();
if (!found) {
  console.log('Aseprite prototype export: skipped (usable stable CLI not found)');
  console.log('Run pnpm aseprite:check for install path hints.');
  process.exit(0);
}

let exported = 0;
let skipped = 0;
for (const entry of PROTOTYPE_ASEPRITE_EXPORTS) {
  const { source, target } = entry;
  assertPrototypeTarget(target);
  if (!existsSync(source)) {
    console.log(`source-missing ${entry.id}: ${source}`);
    skipped += 1;
    continue;
  }

  // Aseprite requires --script-param to come before --script.
  const result = spawnSync(found.path, ['-b', source, '--script-param', `out=${target}`, '--script', ASEPRITE_SCRIPT], {
    encoding: 'utf8',
  });
  if (result.stdout.trim()) console.log(result.stdout.trim());
  if (result.stderr.trim()) console.error(result.stderr.trim());
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log(`exported ${entry.id}: ${source} -> ${target}`);
  exported += 1;
}

console.log(`Aseprite prototype export: exported=${exported} source-missing=${skipped}`);
