import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { resolveAsepriteCli } from './aseprite-config.mjs';

function parseArgs(argv) {
  const parsed = {
    out: 'assets/source/aseprite/player/prototypes/character_template.aseprite',
    size: '52',
    name: 'character_template',
  };
  for (const arg of argv) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) parsed[match[1]] = match[2];
  }
  return parsed;
}

const args = parseArgs(process.argv.slice(2));
const { found } = resolveAsepriteCli();

if (!found) {
  console.log('Aseprite CLI: usable stable not found; skipping optional template generation.');
  console.log('Set ASEPRITE_BIN or install stable Aseprite 1.3.17.x to generate templates.');
  process.exit(0);
}

if (!args.out.endsWith('.aseprite')) {
  console.error(`Expected --out to end with .aseprite, got: ${args.out}`);
  process.exit(1);
}

mkdirSync(dirname(args.out), { recursive: true });

const result = spawnSync(
  found.path,
  [
    '-b',
    '--script-param', `out=${args.out}`,
    '--script-param', `size=${args.size}`,
    '--script-param', `name=${args.name}`,
    '--script', 'scripts/aseprite/create-character-template.lua',
  ],
  { encoding: 'utf8' },
);

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);

if (result.status !== 0) {
  console.error(`Aseprite template generation failed with status ${result.status ?? 1}`);
  process.exit(result.status ?? 1);
}

console.log(`Created Aseprite character template: ${args.out}`);
