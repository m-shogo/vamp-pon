import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { extname, join, relative } from 'node:path';

type CoverageContract = {
  schemaVersion: number;
  sourceFontPath: string;
  fontAssetPath: string;
  scanRoots: string[];
  includedExtensions: string[];
  excludedPathFragments: string[];
  currentFontAssetFacts: {
    atlasPopulationMode: string;
    serializedGlyphTableEmpty: boolean;
    serializedCharacterTableEmpty: boolean;
    sourceFontBound: boolean;
    multiAtlasEnabled: boolean;
    clearDynamicDataOnBuild: boolean;
  };
};

type Format12Group = {
  start: number;
  end: number;
  startGlyph: number;
};

type CmapSupport = (codePoint: number) => boolean;

const contractPath = 'docs/design-targets/generated/design-production/font-glyph-coverage-contract.json';
const outputPath = 'Logs/design-font-source-coverage.json';

function fail(message: string): never {
  throw new Error(`Font source coverage check failed: ${message}`);
}

function normalizePath(path: string): string {
  return path.replaceAll('\\', '/');
}

function collectFiles(root: string, extensions: Set<string>, excludedFragments: string[], output: string[]): void {
  if (!existsSync(root)) return;
  const stat = statSync(root);
  if (!stat.isDirectory()) return;

  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    const normalized = `/${normalizePath(path)}/`;
    if (excludedFragments.some((fragment) => normalized.includes(fragment))) continue;

    const entryStat = statSync(path);
    if (entryStat.isDirectory()) {
      collectFiles(path, extensions, excludedFragments, output);
      continue;
    }
    if (entryStat.isFile() && extensions.has(extname(path).toLowerCase())) {
      output.push(path);
    }
  }
}

function addTextCodePoints(target: Set<number>, value: string): void {
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined || codePoint < 0x20 || codePoint === 0x7f) continue;
    target.add(codePoint);
  }
}

function decodeRegularEscape(source: string, slashIndex: number): { value: string; nextIndex: number } {
  const marker = source[slashIndex + 1];
  if (marker === undefined) return { value: '', nextIndex: slashIndex + 1 };

  const common: Record<string, string> = {
    '0': '\0',
    a: '\x07',
    b: '\b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t',
    v: '\v',
    '\\': '\\',
    '"': '"',
    "'": "'",
  };
  if (marker in common) return { value: common[marker], nextIndex: slashIndex + 2 };

  if (marker === 'u' || marker === 'U') {
    const count = marker === 'u' ? 4 : 8;
    const hex = source.slice(slashIndex + 2, slashIndex + 2 + count);
    if (/^[0-9a-fA-F]+$/.test(hex) && hex.length === count) {
      const codePoint = Number.parseInt(hex, 16);
      if (codePoint <= 0x10ffff) {
        return { value: String.fromCodePoint(codePoint), nextIndex: slashIndex + 2 + count };
      }
    }
  }

  if (marker === 'x') {
    const match = source.slice(slashIndex + 2, slashIndex + 6).match(/^[0-9a-fA-F]{1,4}/);
    if (match) {
      return {
        value: String.fromCodePoint(Number.parseInt(match[0], 16)),
        nextIndex: slashIndex + 2 + match[0].length,
      };
    }
  }

  return { value: marker, nextIndex: slashIndex + 2 };
}

function extractCSharpStringCodePoints(source: string): Set<number> {
  const result = new Set<number>();
  let index = 0;
  let state: 'normal' | 'line-comment' | 'block-comment' | 'char' = 'normal';

  while (index < source.length) {
    const current = source[index];
    const next = source[index + 1];

    if (state === 'line-comment') {
      if (current === '\n') state = 'normal';
      index += 1;
      continue;
    }
    if (state === 'block-comment') {
      if (current === '*' && next === '/') {
        state = 'normal';
        index += 2;
      } else {
        index += 1;
      }
      continue;
    }
    if (state === 'char') {
      if (current === '\\') {
        index += 2;
      } else if (current === "'") {
        state = 'normal';
        index += 1;
      } else {
        index += 1;
      }
      continue;
    }

    if (current === '/' && next === '/') {
      state = 'line-comment';
      index += 2;
      continue;
    }
    if (current === '/' && next === '*') {
      state = 'block-comment';
      index += 2;
      continue;
    }
    if (current === "'") {
      state = 'char';
      index += 1;
      continue;
    }
    if (current !== '"') {
      index += 1;
      continue;
    }

    const verbatim = source[index - 1] === '@' || (source[index - 2] === '@' && source[index - 1] === '$');
    index += 1;
    let literal = '';

    while (index < source.length) {
      const character = source[index];
      if (verbatim) {
        if (character === '"' && source[index + 1] === '"') {
          literal += '"';
          index += 2;
          continue;
        }
        if (character === '"') {
          index += 1;
          break;
        }
        literal += character;
        index += 1;
        continue;
      }

      if (character === '"') {
        index += 1;
        break;
      }
      if (character === '\\') {
        const decoded = decodeRegularEscape(source, index);
        literal += decoded.value;
        index = decoded.nextIndex;
        continue;
      }
      literal += character;
      index += 1;
    }

    addTextCodePoints(result, literal);
  }

  return result;
}

function collectJsonStrings(value: unknown, target: Set<number>): void {
  if (typeof value === 'string') {
    addTextCodePoints(target, value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectJsonStrings(item, target);
    return;
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value as Record<string, unknown>)) {
      collectJsonStrings(item, target);
    }
  }
}

function readUInt16(buffer: Buffer, offset: number): number {
  if (offset < 0 || offset + 2 > buffer.length) fail(`TTF readUInt16 out of bounds at ${offset}`);
  return buffer.readUInt16BE(offset);
}

function readInt16(buffer: Buffer, offset: number): number {
  if (offset < 0 || offset + 2 > buffer.length) fail(`TTF readInt16 out of bounds at ${offset}`);
  return buffer.readInt16BE(offset);
}

function readUInt32(buffer: Buffer, offset: number): number {
  if (offset < 0 || offset + 4 > buffer.length) fail(`TTF readUInt32 out of bounds at ${offset}`);
  return buffer.readUInt32BE(offset);
}

function parseFormat12(buffer: Buffer, offset: number): CmapSupport {
  const length = readUInt32(buffer, offset + 4);
  const groupCount = readUInt32(buffer, offset + 12);
  if (offset + length > buffer.length) fail('format 12 cmap exceeds TTF length');

  const groups: Format12Group[] = [];
  let cursor = offset + 16;
  for (let index = 0; index < groupCount; index += 1) {
    groups.push({
      start: readUInt32(buffer, cursor),
      end: readUInt32(buffer, cursor + 4),
      startGlyph: readUInt32(buffer, cursor + 8),
    });
    cursor += 12;
  }

  return (codePoint: number): boolean => {
    let low = 0;
    let high = groups.length - 1;
    while (low <= high) {
      const middle = Math.floor((low + high) / 2);
      const group = groups[middle];
      if (codePoint < group.start) high = middle - 1;
      else if (codePoint > group.end) low = middle + 1;
      else return group.startGlyph + (codePoint - group.start) !== 0;
    }
    return false;
  };
}

function parseFormat4(buffer: Buffer, offset: number): CmapSupport {
  const length = readUInt16(buffer, offset + 2);
  const end = offset + length;
  if (end > buffer.length) fail('format 4 cmap exceeds TTF length');

  const segmentCount = readUInt16(buffer, offset + 6) / 2;
  const endCodeStart = offset + 14;
  const startCodeStart = endCodeStart + segmentCount * 2 + 2;
  const idDeltaStart = startCodeStart + segmentCount * 2;
  const idRangeOffsetStart = idDeltaStart + segmentCount * 2;

  return (codePoint: number): boolean => {
    if (codePoint > 0xffff) return false;
    for (let index = 0; index < segmentCount; index += 1) {
      const segmentEnd = readUInt16(buffer, endCodeStart + index * 2);
      if (codePoint > segmentEnd) continue;
      const segmentStart = readUInt16(buffer, startCodeStart + index * 2);
      if (codePoint < segmentStart) return false;

      const delta = readInt16(buffer, idDeltaStart + index * 2);
      const rangeOffsetAddress = idRangeOffsetStart + index * 2;
      const rangeOffset = readUInt16(buffer, rangeOffsetAddress);
      if (rangeOffset === 0) return ((codePoint + delta) & 0xffff) !== 0;

      const glyphAddress = rangeOffsetAddress + rangeOffset + (codePoint - segmentStart) * 2;
      if (glyphAddress + 2 > end) return false;
      let glyph = readUInt16(buffer, glyphAddress);
      if (glyph === 0) return false;
      glyph = (glyph + delta) & 0xffff;
      return glyph !== 0;
    }
    return false;
  };
}

function parseTtfCmap(buffer: Buffer): CmapSupport {
  const tableCount = readUInt16(buffer, 4);
  let cmapOffset = -1;
  for (let index = 0; index < tableCount; index += 1) {
    const recordOffset = 12 + index * 16;
    const tag = buffer.toString('ascii', recordOffset, recordOffset + 4);
    if (tag === 'cmap') {
      cmapOffset = readUInt32(buffer, recordOffset + 8);
      break;
    }
  }
  if (cmapOffset < 0) fail('TTF cmap table not found');

  const subtableCount = readUInt16(buffer, cmapOffset + 2);
  const supports: CmapSupport[] = [];
  for (let index = 0; index < subtableCount; index += 1) {
    const recordOffset = cmapOffset + 4 + index * 8;
    const platformId = readUInt16(buffer, recordOffset);
    const encodingId = readUInt16(buffer, recordOffset + 2);
    const subtableOffset = cmapOffset + readUInt32(buffer, recordOffset + 4);
    const format = readUInt16(buffer, subtableOffset);
    const unicodeCompatible = platformId === 0 || (platformId === 3 && (encodingId === 1 || encodingId === 10));
    if (!unicodeCompatible) continue;
    if (format === 12) supports.push(parseFormat12(buffer, subtableOffset));
    else if (format === 4) supports.push(parseFormat4(buffer, subtableOffset));
  }
  if (supports.length === 0) fail('No supported Unicode cmap format 4 or 12 found');
  return (codePoint: number): boolean => supports.some((support) => support(codePoint));
}

if (!existsSync(contractPath)) fail(`contract missing: ${contractPath}`);
const contract = JSON.parse(readFileSync(contractPath, 'utf8')) as CoverageContract;
if (contract.schemaVersion !== 1) fail(`unsupported contract schema: ${contract.schemaVersion}`);
if (!existsSync(contract.sourceFontPath)) fail(`source font missing: ${contract.sourceFontPath}`);
if (!existsSync(contract.fontAssetPath)) fail(`TMP font asset missing: ${contract.fontAssetPath}`);

const extensions = new Set(contract.includedExtensions.map((extension) => extension.toLowerCase()));
const excludedFragments = contract.excludedPathFragments.map((fragment) => fragment.replaceAll('\\', '/'));
const files: string[] = [];
for (const root of contract.scanRoots) collectFiles(root, extensions, excludedFragments, files);
files.sort();
if (files.length === 0) fail('no runtime source files were discovered');

const requiredCodePoints = new Set<number>();
const scannedFiles: string[] = [];
const parseErrors: string[] = [];

for (const file of files) {
  const extension = extname(file).toLowerCase();
  const source = readFileSync(file, 'utf8');
  try {
    if (extension === '.cs') {
      for (const codePoint of extractCSharpStringCodePoints(source)) requiredCodePoints.add(codePoint);
    } else if (extension === '.json') {
      collectJsonStrings(JSON.parse(source), requiredCodePoints);
    }
    scannedFiles.push(normalizePath(relative('.', file)));
  } catch (error) {
    parseErrors.push(`${normalizePath(relative('.', file))}: ${String(error)}`);
  }
}

if (parseErrors.length > 0) fail(`runtime source parsing failed:\n${parseErrors.join('\n')}`);

const fontBuffer = readFileSync(contract.sourceFontPath);
const supportsCodePoint = parseTtfCmap(fontBuffer);
const required = [...requiredCodePoints].sort((left, right) => left - right);
const missing = required.filter((codePoint) => !supportsCodePoint(codePoint));

const fontAssetSource = readFileSync(contract.fontAssetPath, 'utf8');
const actualFacts = {
  atlasPopulationMode: /m_AtlasPopulationMode:\s*1\b/.test(fontAssetSource) ? 'DYNAMIC' : 'NOT_DYNAMIC_OR_UNKNOWN',
  serializedGlyphTableEmpty: /m_GlyphTable:\s*\[\]/.test(fontAssetSource),
  serializedCharacterTableEmpty: /m_CharacterTable:\s*\[\]/.test(fontAssetSource),
  sourceFontBound: /m_SourceFontFile:\s*\{fileID:\s*12800000,\s*guid:\s*[0-9a-f]+,\s*type:\s*3\}/.test(fontAssetSource),
  multiAtlasEnabled: /m_IsMultiAtlasTexturesEnabled:\s*1\b/.test(fontAssetSource),
  clearDynamicDataOnBuild: /m_ClearDynamicDataOnBuild:\s*1\b/.test(fontAssetSource),
};

for (const [key, expected] of Object.entries(contract.currentFontAssetFacts)) {
  const actual = actualFacts[key as keyof typeof actualFacts];
  if (actual !== expected) fail(`TMP font asset fact mismatch: ${key} expected=${String(expected)} actual=${String(actual)}`);
}

const result = {
  schemaVersion: 1,
  sourceFontPath: contract.sourceFontPath,
  fontAssetPath: contract.fontAssetPath,
  scannedSourcePaths: contract.scanRoots,
  scannedFileCount: scannedFiles.length,
  scannedFiles,
  requiredCodepointCount: required.length,
  requiredCodepoints: required.map((codePoint) => `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`),
  requiredCharacters: required.map((codePoint) => String.fromCodePoint(codePoint)).join(''),
  missingFromSourceFont: missing.map((codePoint) => `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`),
  missingCharacters: missing.map((codePoint) => String.fromCodePoint(codePoint)).join(''),
  currentFontAssetFacts: actualFacts,
  sourceFontCoverageResult: missing.length === 0 ? 'PASS' : 'FAIL',
  staticAtlasCoverageResult: 'NOT_EXECUTED',
  deviceBuildVerified: false,
  fullProductGlyphCoverageComplete: false,
};

mkdirSync('Logs', { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

if (missing.length > 0) {
  fail(`source TTF is missing ${missing.length} required codepoint(s): ${result.missingFromSourceFont.join(', ')}`);
}

console.log(
  `Font source coverage check passed: files=${scannedFiles.length}, requiredCodepoints=${required.length}, missingFromSourceFont=0, staticAtlasCoverage=NOT_EXECUTED.`,
);
