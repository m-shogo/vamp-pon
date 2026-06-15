import { existsSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolveAsepriteCli } from './aseprite-config.mjs';

const PRODUCTION_TARGETS = new Set([
  'public/assets/sprites/player/yui_idle_42.png',
  'public/assets/sprites/player/yui_move_42.png',
  'public/assets/sprites/player/yui_hurt_42.png',
  'public/assets/sprites/player/yui_ultimate_42.png',
]);

function parseArgs(argv) {
  const parsed = {
    source: '',
    outDir: 'public/assets/sprites/player/prototypes/reviews/character',
  };
  for (const arg of argv) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) parsed[match[1]] = match[2];
  }
  return parsed;
}

const args = parseArgs(process.argv.slice(2));

if (!args.source) {
  console.error('Missing required --source=path/to/source.aseprite');
  process.exit(1);
}

if (!existsSync(args.source)) {
  console.error(`Source not found: ${args.source}`);
  process.exit(1);
}

if (PRODUCTION_TARGETS.has(args.outDir) || [...PRODUCTION_TARGETS].some((target) => args.outDir.startsWith(`${target}/`))) {
  console.error(`Refusing to export previews to production path: ${args.outDir}`);
  process.exit(1);
}

const { found } = resolveAsepriteCli();
if (!found) {
  console.log('Aseprite CLI: usable stable not found; skipping optional preview export.');
  console.log('Set ASEPRITE_BIN or install stable Aseprite 1.3.17.x to export previews.');
  process.exit(0);
}

mkdirSync(args.outDir, { recursive: true });

const result = spawnSync(
  found.path,
  [
    '-b',
    args.source,
    '--script-param', `outDir=${args.outDir}`,
    '--script', 'scripts/aseprite/export-character-previews.lua',
  ],
  { encoding: 'utf8' },
);

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);

if (result.status !== 0) {
  console.error(`Aseprite preview export failed with status ${result.status ?? 1}`);
  process.exit(result.status ?? 1);
}

console.log(`Exported Aseprite review previews from ${args.source} to ${args.outDir}`);
