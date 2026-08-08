import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const generatorRelative = 'scripts/unity/generate-top-living-night-core5-layout-proof.py';
const spriteRelative = 'scripts/unity/generate-top-living-night-core5-sprite-pack.py';
const polishRelative = 'scripts/unity/polish-top-living-night-core5-preproduction.py';
const generatorPath = join(root, generatorRelative);
const spritePath = join(root, spriteRelative);
const polishPath = join(root, polishRelative);
const requirementsPath = join(root, 'requirements.txt');
const gitignorePath = join(root, '.gitignore');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const path of [generatorPath, spritePath, polishPath]) {
  invariant(existsSync(path), `TOP Core5 preproduction generator is missing: ${path}`);
}
const generator = readFileSync(generatorPath, 'utf8');
const sprite = readFileSync(spritePath, 'utf8');
const polish = readFileSync(polishPath, 'utf8');
const requirements = readFileSync(requirementsPath, 'utf8');
const gitignore = readFileSync(gitignorePath, 'utf8');

for (const token of [
  'docs/design-targets/generated/top-living-night-v2/layers',
  'core5-clean-composition-plate-v1.png',
  'core5-reference-manifest.json',
  'core5-layout-proof-v1.png',
  'core5-clean-generation-reference-pack-v1.png',
  '("00-environment-starless.png", 1.00)',
  '("01-stars.png", 0.72)',
  '("01-moon.png", 1.00)',
  '("02-clouds-far.png", 0.78)',
  '("03-clouds-near.png", 0.82)',
  '("09-fire-base.png", 1.00)',
  '("08-animal-robot.png", 1.00)',
  '("14-foreground-accents.png", 1.00)',
  '"05-distant-companion.png"',
  '"06-characters.png"',
  'clean TOP plate accidentally includes a forbidden human/mask layer',
  'clean TOP overlay must contain transparency',
  'generator-facing visuals exclude all bridge humans',
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

invariant(!generator.includes('blur_bridge_human_cluster'), 'TOP generator must not blur bridge humans into model-facing references');
invariant(!generator.includes('with Image.open(BRIDGE)'), 'TOP generator must not render raw bridge pixels into model-facing references');
invariant(
  generator.includes('with Image.open(CLEAN_PLATE) as clean_source:'),
  'TOP Core5 layout proof must start from the human-free clean composition plate',
);
invariant(
  generator.includes('with Image.open(LAYOUT_PROOF) as layout:'),
  'TOP combined generation reference must use Core5-only layout proof instead of raw bridge',
);
invariant(
  generator.includes('canvas.paste(sprite.convert("RGB"), (x, slot_y), sprite.getchannel("A"))'),
  'TOP combined generation reference must render cutouts rather than labeled master boards',
);

for (const token of [
  'generate-top-living-night-core5-layout-proof.py',
  'sprites = module.extract_core5()',
  '{"yui", "asa", "nagi", "michiru", "tomori"}',
  'core5-{character}-fullbody-cutout-v1.png',
  'preproduction generator inputs only',
]) {
  invariant(sprite.includes(token), `TOP Core5 sprite-pack generator contract missing: ${token}`);
}

for (const token of [
  'with Image.open(module.CLEAN_PLATE) as clean_source:',
  'module.make_clean_reference_pack(sprites)',
  'clean composition plate + Core5 only',
]) {
  invariant(polish.includes(token), `TOP Core5 preproduction polish contract missing: ${token}`);
}
invariant(!polish.includes('module.blur_bridge_human_cluster'), 'TOP polish must not restore blurred bridge humans');
invariant(!polish.includes('with Image.open(module.BRIDGE)'), 'TOP polish must not use raw bridge as a pixel source');

invariant(!generator.includes('import numpy'), 'TOP Core5 layout-proof generator must remain Pillow-only');
invariant(!sprite.includes('import numpy'), 'TOP Core5 sprite-pack generator must remain Pillow-only');
invariant(!polish.includes('import numpy'), 'TOP Core5 polish generator must remain Pillow-only');
invariant(requirements.includes('Pillow'), 'TOP Core5 preproduction generators require pinned Pillow dependency');
invariant(
  gitignore.includes('docs/design-targets/generated/top-living-night-v3/preproduction/'),
  'TOP preproduction layout/reference/sprite outputs must remain generated-only',
);
for (const source of [generator, sprite, polish]) {
  invariant(!source.includes('candidateGenerated = True'), 'preproduction generator must not register a final candidate');
  invariant(!source.includes('approvedAsFinal = True'), 'preproduction generator must not approve final art');
  invariant(!source.includes('runtimeApproved = True'), 'preproduction generator must not approve runtime');
}

for (const relative of [generatorRelative, spriteRelative, polishRelative]) {
  const compile = spawnSync('python3', ['-m', 'py_compile', relative], { cwd: root, encoding: 'utf8' });
  invariant(
    compile.status === 0,
    `TOP preproduction generator Python syntax failed (${relative}):\n${compile.stdout}\n${compile.stderr}`,
  );
}

console.log('TOP Core5 preproduction layout/reference/sprite generator contract: PASS');
console.log('human-free V2 layer composition -> Core5-only layout/reference pack + five transparent cutouts; raw bridge stays engineering-only; Pillow-only; no promotion');
