import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const generatorRelative = 'scripts/unity/generate-top-living-night-core5-layout-proof.py';
const spriteRelative = 'scripts/unity/generate-top-living-night-core5-sprite-pack.py';
const generatorPath = join(root, generatorRelative);
const spritePath = join(root, spriteRelative);
const requirementsPath = join(root, 'requirements.txt');
const gitignorePath = join(root, '.gitignore');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(generatorPath), 'TOP Core5 layout-proof generator is missing');
invariant(existsSync(spritePath), 'TOP Core5 sprite-pack generator is missing');
const generator = readFileSync(generatorPath, 'utf8');
const sprite = readFileSync(spritePath, 'utf8');
const requirements = readFileSync(requirementsPath, 'utf8');
const gitignore = readFileSync(gitignorePath, 'utf8');

for (const token of [
  'top-living-night-layered-candidate-430x932.png',
  'core5-reference-manifest.json',
  'core5-layout-proof-v1.png',
  'core5-clean-generation-reference-pack-v1.png',
  '"yui": (0.11, 0.16, 0.40, 0.78)',
  '"asa": (0.11, 0.17, 0.40, 0.79)',
  '"nagi": (0.11, 0.18, 0.40, 0.80)',
  '"michiru": (0.11, 0.18, 0.42, 0.81)',
  '"tomori": (0.11, 0.20, 0.42, 0.81)',
  '("michiru", 38, 370, 140)',
  '("nagi", 266, 356, 144)',
  '("asa", 90, 386, 170)',
  '("tomori", 318, 400, 168)',
  '("yui", 171, 346, 186)',
  'layout proof requires exactly five locked Core5 masters',
  'never set candidateGenerated or any approval flag',
]) {
  invariant(generator.includes(token), `TOP Core5 layout-proof generator contract missing: ${token}`);
}

for (const token of [
  'generate-top-living-night-core5-layout-proof.py',
  'sprites = module.extract_core5()',
  '{"yui", "asa", "nagi", "michiru", "tomori"}',
  'core5-{character}-fullbody-cutout-v1.png',
  'preproduction generator inputs only',
]) {
  invariant(sprite.includes(token), `TOP Core5 sprite-pack generator contract missing: ${token}`);
}

invariant(!generator.includes('import numpy'), 'TOP Core5 layout-proof generator must remain Pillow-only');
invariant(!sprite.includes('import numpy'), 'TOP Core5 sprite-pack generator must remain Pillow-only');
invariant(requirements.includes('Pillow'), 'TOP Core5 preproduction generators require pinned Pillow dependency');
invariant(
  gitignore.includes('docs/design-targets/generated/top-living-night-v3/preproduction/'),
  'TOP preproduction layout/reference/sprite outputs must remain generated-only',
);
invariant(!generator.includes('candidateGenerated = True'), 'layout proof generator must not register a final candidate');
invariant(!generator.includes('approvedAsFinal = True'), 'layout proof generator must not approve final art');
invariant(!generator.includes('runtimeApproved = True'), 'layout proof generator must not approve runtime');
invariant(!sprite.includes('candidateGenerated = True'), 'sprite-pack generator must not register a final candidate');
invariant(!sprite.includes('approvedAsFinal = True'), 'sprite-pack generator must not approve final art');
invariant(!sprite.includes('runtimeApproved = True'), 'sprite-pack generator must not approve runtime');

for (const relative of [generatorRelative, spriteRelative]) {
  const compile = spawnSync('python3', ['-m', 'py_compile', relative], { cwd: root, encoding: 'utf8' });
  invariant(
    compile.status === 0,
    `TOP preproduction generator Python syntax failed (${relative}):\n${compile.stdout}\n${compile.stderr}`,
  );
}

console.log('TOP Core5 preproduction layout/reference/sprite generator contract: PASS');
console.log('locked Core5 + bridge -> generated-only layered proof + clean reference pack + five transparent cutouts; Pillow-only; no promotion');
