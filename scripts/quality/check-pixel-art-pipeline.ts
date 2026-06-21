import { execSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';

// Vamp Pon Pixel Art Pipeline v1 gate (NOT a production gate).
//
// Confirms the pipeline base is in place and consistent:
//   1. pipeline doc, recipe schema, yui/asa/nagi recipes exist (+ parse),
//   2. the procedural finisher script + Aseprite extension skeleton exist,
//   3. the Yui V2a procedural-finish (PF) outputs + review sheet + review doc exist,
//   4. production protected paths are untouched in the working tree.
//
// It does NOT judge visual quality (that is the human review pass) and it does
// NOT treat any script output as hand-final.

type Check = { label: string; ok: boolean; detail?: string };
const checks: Check[] = [];

const requiredFiles = [
  // 1. design + recipes
  'docs/pixel-art/vamp-pon-pixel-art-pipeline-v1.md',
  'data/pixel-art/character-recipes.schema.json',
  'data/pixel-art/character-recipes/yui.json',
  'data/pixel-art/character-recipes/asa.json',
  'data/pixel-art/character-recipes/nagi.json',
  // 2. finisher + extension skeleton
  'scripts/aseprite/vamp-pon-pixel-finisher.lua',
  'scripts/aseprite/run-pixel-finisher.mjs',
  'tools/aseprite-extension/vamp-pon-pixel-finisher/package.json',
  'tools/aseprite-extension/vamp-pon-pixel-finisher/scripts/vamp-pon-pixel-finisher.lua',
  'tools/aseprite-extension/README.md',
  // 3. PF outputs + review
  'assets/source/prototypes/yui_idle_52_v2a_pf.aseprite',
  'public/assets/prototypes/yui_idle_52_v2a_pf.png',
  'scripts/prototypes/build-pixel-finisher-review-sheet.lua',
  'public/assets/prototypes/yui_idle_52_v2a_pf_review_sheet.png',
  'docs/reviews/design-team/yui-52px-v2a-procedural-finish-review.md',
  // 4. human-review-candidate (HR) refinement step
  'scripts/prototypes/refine-yui-52-v2a-pf.lua',
  'assets/source/prototypes/yui_idle_52_v2a_hr.aseprite',
  'public/assets/prototypes/yui_idle_52_v2a_hr.png',
  'public/assets/prototypes/yui_idle_52_v2a_hr_review_sheet.png',
  'docs/reviews/design-team/yui-52px-v2a-human-review-candidate.md',
];

for (const file of requiredFiles) {
  const ok = existsSync(file) && statSync(file).size > 0;
  checks.push({ label: `exists ${file}`, ok });
}

// recipes must be valid JSON with the required identity fields, and the schema
// must parse. (Light structural check — not full JSON-Schema validation.)
const requiredRecipeKeys = [
  'id', 'name', 'role', 'importance', 'canvasSize', 'palette',
  'mustKeep', 'mustAvoid', 'reviewPriority', 'humanReviewRequired',
];
function parseJson(file: string): unknown | null {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    checks.push({ label: `valid JSON ${file}`, ok: false, detail: String(error) });
    return null;
  }
}

parseJson('data/pixel-art/character-recipes.schema.json');

const expectImportance: Record<string, string[]> = {
  yui: ['player'],
  asa: ['main'],
  nagi: ['main', 'side'],
};
const expectHumanReview: Record<string, boolean> = { yui: true, asa: true };

for (const id of ['yui', 'asa', 'nagi']) {
  const file = `data/pixel-art/character-recipes/${id}.json`;
  const data = parseJson(file) as Record<string, unknown> | null;
  if (!data) continue;
  const missing = requiredRecipeKeys.filter((k) => !(k in data));
  checks.push({ label: `recipe ${id} has required keys`, ok: missing.length === 0, detail: missing.join(', ') || undefined });
  const importance = String(data.importance ?? '');
  checks.push({
    label: `recipe ${id} importance is ${expectImportance[id].join('|')}`,
    ok: expectImportance[id].includes(importance),
    detail: importance || undefined,
  });
  if (id in expectHumanReview) {
    checks.push({
      label: `recipe ${id} humanReviewRequired=${expectHumanReview[id]}`,
      ok: data.humanReviewRequired === expectHumanReview[id],
    });
  }
  // nagi: either value allowed, but a reason must be recorded.
  if (id === 'nagi') {
    checks.push({
      label: 'recipe nagi records humanReviewReason',
      ok: typeof data.humanReviewReason === 'string' && (data.humanReviewReason as string).length > 0,
    });
  }
}

// the PF review doc must stay honest: not call the script output hand-final.
const reviewDoc = 'docs/reviews/design-team/yui-52px-v2a-procedural-finish-review.md';
if (existsSync(reviewDoc)) {
  const text = readFileSync(reviewDoc, 'utf8');
  checks.push({
    label: 'PF review states script-assisted-candidate (not hand-final)',
    ok: text.includes('script-assisted-candidate') && text.includes('hand-final ではない'),
  });
  checks.push({
    label: 'PF review records Production touched: no',
    ok: /Production touched:\s*\*\*no\*\*/i.test(text) || /Production touched:\s*no/i.test(text),
  });
}

// the HR review doc must stay honest: human-reviewed-candidate, explicitly NOT
// a GUI hand-finish and NOT hand-final.
const hrDoc = 'docs/reviews/design-team/yui-52px-v2a-human-review-candidate.md';
if (existsSync(hrDoc)) {
  const text = readFileSync(hrDoc, 'utf8');
  checks.push({
    label: 'HR review states human-reviewed-candidate (not GUI hand-finish / not hand-final)',
    ok: text.includes('human-reviewed-candidate')
      && text.includes('GUI hand-finish ではない')
      && text.includes('hand-final ではない'),
  });
  checks.push({
    label: 'HR review records Production touched: no',
    ok: /Production touched:\s*\*\*no\*\*/i.test(text) || /Production touched:\s*no/i.test(text),
  });
}

// production protected paths untouched in the working tree.
const protectedPaths = [
  'public/assets/sprites/player',
  'assets/source/aseprite/player',
  'src/game/domain/constants.ts',
];
let protectedDirty = '';
try {
  protectedDirty = execSync(`git status --porcelain -- ${protectedPaths.join(' ')}`, { encoding: 'utf8' }).trim();
} catch {
  protectedDirty = '';
}
checks.push({
  label: 'production protected paths untouched (working tree)',
  ok: protectedDirty === '',
  detail: protectedDirty || undefined,
});

const failed = checks.filter((c) => !c.ok);
for (const c of checks) {
  const detail = !c.ok && c.detail ? `\n     ${c.detail.replace(/\n/g, '\n     ')}` : '';
  console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.label}${detail}`);
}

if (failed.length > 0) {
  console.error(`\npixel-art:pipeline:verify failed (${failed.length} issue(s))`);
  process.exit(1);
}

console.log(`\npixel-art:pipeline:verify passed: ${checks.length} checks, production untouched.`);
