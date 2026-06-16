import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';

const overlaysPath = 'src/game/ui/overlays.ts';
let source = readFileSync(overlaysPath, 'utf8');
source = source.replace(
  '16, STORYBOOK_UI.goldLight, true));',
  '16, colorString(STORYBOOK_UI.goldLight), true));',
);
source = source.replace(
  '12, STORYBOOK_UI.goldLight));',
  '12, colorString(STORYBOOK_UI.goldLight)));',
);
writeFileSync(overlaysPath, source);

for (const path of [
  '.github/workflows/debug-storybook-build.yml',
  'reports/storybook-ui-build.log',
  'scripts/patch-storybook-type-fixes.mjs',
  '.github/workflows/patch-storybook-type-fixes.yml',
]) {
  if (existsSync(path)) unlinkSync(path);
}

console.log('storybook type fixes applied');
