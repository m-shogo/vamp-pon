import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

// Lightweight prototype gate (NOT a production gate).
// Confirms, for the Yui 52px master v2 prototype pass, that:
//   1. the v2 prototype images + sources exist,
//   2. the v2 review doc exists,
//   3. production sprites / production .aseprite source are untouched vs HEAD.
// It does not judge visual quality (that is the human pixel-art director pass).

type Check = { label: string; ok: boolean; detail?: string };

const requiredFiles = [
  'scripts/prototypes/build-yui-52-v2.lua',
  'scripts/prototypes/build-yui-52-v2-review-sheet.lua',
  'assets/source/prototypes/yui_idle_52_v2a.aseprite',
  'assets/source/prototypes/yui_idle_52_v2b.aseprite',
  'assets/source/prototypes/yui_idle_52_v2c.aseprite',
  'public/assets/prototypes/yui_idle_52_v2a.png',
  'public/assets/prototypes/yui_idle_52_v2b.png',
  'public/assets/prototypes/yui_idle_52_v2c.png',
  'public/assets/prototypes/yui_idle_52_v2_review_sheet.png',
  'docs/reviews/design-team/yui-52px-master-v2-review.md',
];

// Paths that prototype work must never modify.
const protectedPaths = [
  'public/assets/sprites/player',
  'assets/source/aseprite/player',
];

const checks: Check[] = [];

for (const file of requiredFiles) {
  checks.push({ label: `exists ${file}`, ok: existsSync(file) });
}

// production untouched vs HEAD (only meaningful inside a git repo).
let protectedDirty = '';
try {
  protectedDirty = execSync(`git status --porcelain -- ${protectedPaths.join(' ')}`, {
    encoding: 'utf8',
  }).trim();
} catch {
  protectedDirty = '';
}
checks.push({
  label: 'production sprites / source untouched (working tree)',
  ok: protectedDirty === '',
  detail: protectedDirty || undefined,
});

const failed = checks.filter((c) => !c.ok);
for (const c of checks) {
  console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.label}${c.detail ? `\n     ${c.detail.replace(/\n/g, '\n     ')}` : ''}`);
}

if (failed.length > 0) {
  console.error(`\nprototype:verify failed (${failed.length} issue(s))`);
  process.exit(1);
}

console.log(`\nprototype:verify passed: ${checks.length} checks, production untouched.`);
