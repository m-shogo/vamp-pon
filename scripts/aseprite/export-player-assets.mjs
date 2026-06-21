import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { PLAYER_ASEPRITE_EXPORTS, resolveAsepriteCli } from './aseprite-config.mjs';

const ASEPRITE_SCRIPT = 'scripts/aseprite/export-vamp-assets.lua';

function assertPlayerTarget(target) {
  if (!target.startsWith('public/assets/sprites/player/') || !target.endsWith('.png')) {
    throw new Error(`Refusing to export outside player sprites: ${target}`);
  }
}

const { found } = resolveAsepriteCli();
if (!found) {
  console.log('Aseprite export: skipped (usable stable CLI not found)');
  console.log('Run pnpm aseprite:check for install path hints.');
  process.exit(0);
}

let exported = 0;
let skipped = 0;
for (const entry of PLAYER_ASEPRITE_EXPORTS) {
  const { source, target } = entry;
  assertPlayerTarget(target);
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

console.log(`Aseprite player export: exported=${exported} source-missing=${skipped}`);
