import { accessSync, constants, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const ASEPRITE_SCRIPT = 'scripts/aseprite/export-vamp-assets.lua';
const PLAYER_EXPORTS = [
  ['assets/source/aseprite/player/yui_idle.aseprite', 'public/assets/sprites/player/yui_idle_32.png'],
  ['assets/source/aseprite/player/yui_move.aseprite', 'public/assets/sprites/player/yui_move_32.png'],
  ['assets/source/aseprite/player/yui_hurt.aseprite', 'public/assets/sprites/player/yui_hurt_32.png'],
  ['assets/source/aseprite/player/yui_ultimate.aseprite', 'public/assets/sprites/player/yui_ultimate_32.png'],
];

const candidates = [
  process.env.ASEPRITE_BIN,
  '/Applications/Aseprite.app/Contents/MacOS/aseprite',
  `${process.env.HOME}/Library/Application Support/Steam/steamapps/common/Aseprite/Aseprite.app/Contents/MacOS/aseprite`,
  findOnPath('aseprite'),
].filter(Boolean);

function findOnPath(bin) {
  const result = spawnSync('command', ['-v', bin], { encoding: 'utf8', shell: true });
  return result.status === 0 ? result.stdout.trim() : '';
}

function canExecute(path) {
  try {
    accessSync(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function assertPlayerTarget(target) {
  if (!target.startsWith('public/assets/sprites/player/') || !target.endsWith('.png')) {
    throw new Error(`Refusing to export outside player sprites: ${target}`);
  }
}

const aseprite = candidates.find(canExecute);
if (!aseprite) {
  console.log('Aseprite export: skipped (CLI not found)');
  console.log('Run pnpm aseprite:check for install path hints.');
  process.exit(0);
}

let exported = 0;
let skipped = 0;
for (const [source, target] of PLAYER_EXPORTS) {
  assertPlayerTarget(target);
  if (!existsSync(source)) {
    console.log(`skip missing source: ${source}`);
    skipped += 1;
    continue;
  }

  const result = spawnSync(aseprite, ['-b', source, '--script', ASEPRITE_SCRIPT, '--script-param', `out=${target}`], {
    encoding: 'utf8',
  });
  if (result.stdout.trim()) console.log(result.stdout.trim());
  if (result.stderr.trim()) console.error(result.stderr.trim());
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log(`exported ${source} -> ${target}`);
  exported += 1;
}

console.log(`Aseprite player export: exported=${exported} skipped=${skipped}`);
