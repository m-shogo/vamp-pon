import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';

function replaceOnce(source, before, after, label) {
  if (!source.includes(before)) throw new Error(`pattern not found: ${label}`);
  return source.replace(before, after);
}

const overlaysPath = 'src/game/ui/overlays.ts';
let overlays = readFileSync(overlaysPath, 'utf8');
overlays = replaceOnce(overlays, '    color: string,\n    bold = false,', '    color: string | number,\n    bold = false,', 'overlay text color type');
overlays = replaceOnce(overlays, '      color,\n      fontStyle: bold', "      color: typeof color === 'number' ? colorString(color) : color,\n      fontStyle: bold", 'overlay text color normalize');
writeFileSync(overlaysPath, overlays);

const uiPath = 'src/game/ui/storybookUi.ts';
let ui = readFileSync(uiPath, 'utf8');
ui = replaceOnce(ui, '  fill = STORYBOOK_UI.nightPanel,\n  edge = STORYBOOK_UI.gold,\n  alpha = 0.92,', '  fill: number = STORYBOOK_UI.nightPanel,\n  edge: number = STORYBOOK_UI.gold,\n  alpha: number = 0.92,', 'panel parameter types');
ui = replaceOnce(ui, '  paper = STORYBOOK_UI.paper,', '  paper: number = STORYBOOK_UI.paper,', 'paper parameter type');
ui = replaceOnce(ui, '  edge = STORYBOOK_UI.paperEdge,\n  alpha = 1,', '  edge: number = STORYBOOK_UI.paperEdge,\n  alpha: number = 1,', 'star parameter types');
ui = replaceOnce(ui, 'export function drawHeart(g: Phaser.GameObjects.Graphics, x: number, y: number, size = 18)', 'export function drawHeart(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number = 18)', 'heart size type');
ui = replaceOnce(ui, 'export function drawFragment(g: Phaser.GameObjects.Graphics, x: number, y: number, size = 10)', 'export function drawFragment(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number = 10)', 'fragment size type');
ui = replaceOnce(ui, 'export function drawPause(g: Phaser.GameObjects.Graphics, x: number, y: number, size = 34)', 'export function drawPause(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number = 34)', 'pause size type');
ui = replaceOnce(
  ui,
  `  const points = [\n    new Phaser.Geom.Point(x, y - s),\n    new Phaser.Geom.Point(x + s * 0.34, y - s * 0.35),\n    new Phaser.Geom.Point(x + s, y),\n    new Phaser.Geom.Point(x + s * 0.34, y + s * 0.35),\n    new Phaser.Geom.Point(x, y + s),\n    new Phaser.Geom.Point(x - s * 0.34, y + s * 0.35),\n    new Phaser.Geom.Point(x - s, y),\n    new Phaser.Geom.Point(x - s * 0.34, y - s * 0.35),\n  ];`,
  `  const points: Array<{ x: number; y: number }> = [\n    { x, y: y - s },\n    { x: x + s * 0.34, y: y - s * 0.35 },\n    { x: x + s, y },\n    { x: x + s * 0.34, y: y + s * 0.35 },\n    { x, y: y + s },\n    { x: x - s * 0.34, y: y + s * 0.35 },\n    { x: x - s, y },\n    { x: x - s * 0.34, y: y - s * 0.35 },\n  ];`,
  'Phaser 4 point type',
);
writeFileSync(uiPath, ui);

for (const path of [
  '.github/workflows/debug-storybook-build.yml',
  'reports/storybook-ui-build.log',
  'scripts/patch-storybook-type-fixes.mjs',
]) {
  if (existsSync(path)) unlinkSync(path);
}

console.log('storybook type fixes applied');
