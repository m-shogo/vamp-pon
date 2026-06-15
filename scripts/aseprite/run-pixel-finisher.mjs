import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolveAsepriteCli } from './aseprite-config.mjs';

// Node runner for the Vamp Pon procedural pixel finisher.
//
// Wraps scripts/aseprite/vamp-pon-pixel-finisher.lua so the finishing pass can
// be invoked via pnpm. This is the SCRIPT-ASSISTED route (pipeline doc route
// B), not a GUI hand-finish: the output is `script-assisted-candidate`, never
// `hand-final`. player / main characters still require a human review pass.
//
// Output / png paths are also guarded inside the Lua script (prototype-only,
// never production), so this stays safe even if args are wrong.

const SCRIPT = 'scripts/aseprite/vamp-pon-pixel-finisher.lua';

// Built-in jobs (extend as more finisher modes land).
const JOBS = {
  yui52: {
    mode: 'yui52-v2a',
    input: 'assets/source/prototypes/yui_idle_52_v2a.aseprite',
    output: 'assets/source/prototypes/yui_idle_52_v2a_pf.aseprite',
    png: 'public/assets/prototypes/yui_idle_52_v2a_pf.png',
    recipe: 'data/pixel-art/character-recipes/yui.json',
  },
};

const jobName = process.argv[2] ?? 'yui52';
const job = JOBS[jobName];
if (!job) {
  console.error(`unknown finisher job: ${jobName}`);
  console.error(`known jobs: ${Object.keys(JOBS).join(', ')}`);
  process.exit(1);
}

if (!existsSync(SCRIPT)) {
  console.error(`missing finisher script: ${SCRIPT}`);
  process.exit(1);
}
if (!existsSync(job.input)) {
  console.error(`missing input prototype: ${job.input}`);
  console.error('Generate or restore the prototype before running the finisher.');
  process.exit(1);
}

const { found, checked } = resolveAsepriteCli();
if (!found) {
  console.error('pixel finisher: no usable Aseprite CLI found.');
  for (const item of checked) console.error(`- ${item.path}: ${item.reason}`);
  console.error('Set ASEPRITE_BIN="/path/to/Aseprite" or run pnpm aseprite:check for hints.');
  process.exit(1);
}

console.log(`pixel finisher: ${found.path} (${found.version})`);
console.log(`job=${jobName} mode=${job.mode}`);
console.log('This is the script-assisted route (NOT a GUI hand-finish / NOT hand-final).');

const result = spawnSync(
  found.path,
  [
    '-b',
    '--script-param', `input=${job.input}`,
    '--script-param', `output=${job.output}`,
    '--script-param', `png=${job.png}`,
    '--script-param', `recipe=${job.recipe}`,
    '--script-param', `mode=${job.mode}`,
    '--script', SCRIPT,
  ],
  { stdio: 'inherit' },
);

process.exit(result.status ?? 0);
