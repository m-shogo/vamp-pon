import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(
  join(
    process.cwd(),
    'unity/VampPonUnity/Assets/_Project/Scripts/Editor/LoadingTopAutomatedCapture.cs',
  ),
  'utf8',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const token of [
  'new Vector2Int(360, 800)',
  'new Vector2Int(390, 844)',
  'new Vector2Int(430, 932)',
  'var seasons = new[] { "spring", "summer", "autumn", "winter" };',
  'for (var artIndex = 0; artIndex < seasons.Length; artIndex++)',
  'foreach (var resolution in resolutions)',
  'id = $"loading-{seasons[artIndex]}-{resolution.x}x{resolution.y}"',
  'kind = "loading"',
  'artIndex = artIndex',
  'id = $"top-{resolution.x}x{resolution.y}"',
  'kind = "top"',
  'season = string.Empty',
  'artIndex = -1',
  'expectedCaptureCount = Captures.Length',
]) {
  invariant(source.includes(token), `capture matrix source contract missing: ${token}`);
}

const resolutionCount = (source.match(/new Vector2Int\(\d+, \d+\)/g) ?? []).filter(value =>
  ['new Vector2Int(360, 800)', 'new Vector2Int(390, 844)', 'new Vector2Int(430, 932)'].includes(value),
).length;
invariant(resolutionCount === 3, 'capture matrix must contain exactly the three target resolutions');

const buildStart = source.indexOf('private static CaptureDefinition[] BuildCaptures()');
const buildEnd = source.indexOf('private static void AppendRecord', buildStart);
invariant(buildStart >= 0 && buildEnd > buildStart, 'BuildCaptures source block is missing');
const build = source.slice(buildStart, buildEnd);
invariant((build.match(/kind = "loading"/g) ?? []).length === 1, 'BuildCaptures must define one Loading family');
invariant((build.match(/kind = "top"/g) ?? []).length === 1, 'BuildCaptures must define one TOP family');
invariant(build.includes('return values.ToArray();'), 'BuildCaptures must return the complete matrix');

console.log('Loading/TOP capture matrix source: PASS');
console.log('matrix source locked: 4 seasons x 3 resolutions + TOP x 3 = 15');
