import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const generatorRelative = 'scripts/unity/generate-top-living-night-core5-layout-proof.py';
const generatorPath = join(root, generatorRelative);
const requirementsPath = join(root, 'requirements.txt');
const gitignorePath = join(root, '.gitignore');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(generatorPath), 'TOP Core5 layout-proof generator is missing');
const generator = readFileSync(generatorPath, 'utf8');
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

invariant(!generator.includes('import numpy'), 'TOP Core5 layout-proof generator must remain Pillow-only');
invariant(requirements.includes('Pillow'), 'TOP Core5 layout proof requires pinned Pillow dependency');
invariant(
  gitignore.includes('docs/design-targets/generated/top-living-night-v3/preproduction/'),
  'TOP preproduction layout/reference outputs must remain generated-only',
);
invariant(!generator.includes('candidateGenerated = True'), 'layout proof generator must not register a final candidate');
invariant(!generator.includes('approvedAsFinal = True'), 'layout proof generator must not approve final art');
invariant(!generator.includes('runtimeApproved = True'), 'layout proof generator must not approve runtime');

const compile = spawnSync('python3', ['-m', 'py_compile', generatorRelative], { cwd: root, encoding: 'utf8' });
invariant(
  compile.status === 0,
  `TOP Core5 layout-proof generator Python syntax failed:\n${compile.stdout}\n${compile.stderr}`,
);

console.log('TOP Core5 preproduction layout-proof generator contract: PASS');
console.log('locked Core5 + bridge -> generated-only layered layout proof/reference pack; Pillow-only; no candidate/review/runtime promotion');
