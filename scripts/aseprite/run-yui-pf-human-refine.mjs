import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolveAsepriteCli } from './aseprite-config.mjs';

// Node runner: Yui PF -> HR script-assisted refinement (pass 2) + HR review sheet.
//
// This is the SCRIPT-ASSISTED REFINEMENT route, NOT a GUI hand-finish. The
// output (_hr) is a `human-reviewed-candidate` input — it becomes that status
// via the director's human review, NOT by being hand-finished. The sprite is
// NOT hand-final. Production paths are untouched (also guarded in Lua).

const REFINE = 'scripts/prototypes/refine-yui-52-v2a-pf.lua';
const SHEET = 'scripts/prototypes/build-pixel-finisher-review-sheet.lua';

const INPUT = 'assets/source/prototypes/yui_idle_52_v2a_pf.aseprite';
const OUT_ASE = 'assets/source/prototypes/yui_idle_52_v2a_hr.aseprite';
const OUT_PNG = 'public/assets/prototypes/yui_idle_52_v2a_hr.png';
const PF_PNG = 'public/assets/prototypes/yui_idle_52_v2a_pf.png';
const SHEET_PNG = 'public/assets/prototypes/yui_idle_52_v2a_hr_review_sheet.png';

for (const f of [REFINE, SHEET, INPUT]) {
  if (!existsSync(f)) {
    console.error(`missing required file: ${f}`);
    if (f === INPUT) console.error('Run `pnpm aseprite:pixel-finisher:yui52` first.');
    process.exit(1);
  }
}

const { found, checked } = resolveAsepriteCli();
if (!found) {
  console.error('yui PF->HR refine: no usable Aseprite CLI found.');
  for (const item of checked) console.error(`- ${item.path}: ${item.reason}`);
  process.exit(1);
}

console.log(`yui PF->HR refine: ${found.path} (${found.version})`);
console.log('This is script-assisted refinement (NOT a GUI hand-finish / NOT hand-final).');

function run(args) {
  const r = spawnSync(found.path, args, { stdio: 'inherit' });
  if ((r.status ?? 0) !== 0) process.exit(r.status ?? 1);
}

// 1. refinement: _pf -> _hr
run([
  '-b',
  '--script-param', `input=${INPUT}`,
  '--script-param', `output=${OUT_ASE}`,
  '--script-param', `png=${OUT_PNG}`,
  '--script', REFINE,
]);

// 2. HR review sheet: _pf (before) vs _hr (after)
run([
  '-b',
  '--script-param', `before=${PF_PNG}`,
  '--script-param', `after=${OUT_PNG}`,
  '--script-param', `png=${SHEET_PNG}`,
  '--script', SHEET,
]);

console.log('done: _hr is a human-reviewed-candidate input (still needs human GUI hand-finish for hand-final).');
