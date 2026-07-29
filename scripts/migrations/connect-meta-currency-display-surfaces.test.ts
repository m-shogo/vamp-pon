import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  META_CURRENCY_SURFACE_REPLACEMENTS,
  inspectMetaCurrencySurfaceMigration,
  writeMetaCurrencySurfaceMigration,
} from './connect-meta-currency-display-surfaces';

const roots: string[] = [];

function makeRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'vamp-pon-meta-currency-codemod-'));
  roots.push(root);
  return root;
}

function writeFixture(root: string, state: 'before' | 'after'): void {
  const byFile = new Map<string, string[]>();
  for (const replacement of META_CURRENCY_SURFACE_REPLACEMENTS) {
    const values = byFile.get(replacement.file) ?? [];
    values.push(state === 'before' ? replacement.before : replacement.after);
    byFile.set(replacement.file, values);
  }
  for (const [file, values] of byFile) {
    const absolute = join(root, file);
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, `${values.join('\n\n')}\n`, 'utf8');
  }
}

function replaceFixtureEntry(root: string, replacementIndex: number): void {
  const replacement = META_CURRENCY_SURFACE_REPLACEMENTS[replacementIndex];
  const absolute = join(root, replacement.file);
  const source = readFileSync(absolute, 'utf8');
  writeFileSync(absolute, source.replace(replacement.before, replacement.after), 'utf8');
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('guarded meta currency surface codemod', () => {
  it('全旧状態をPENDINGとして認識し、9 wallet surfaceを列挙する', () => {
    const root = makeRoot();
    writeFixture(root, 'before');

    const result = inspectMetaCurrencySurfaceMigration(root);
    expect(result.overall).toBe('PENDING');
    expect(result.errors).toEqual([]);
    expect(result.replacements).toHaveLength(18);
    expect(new Set(result.replacements.map((entry) => entry.file))).toHaveLength(6);
    expect(result.pendingSurfaceIds).toHaveLength(9);
    expect(result.migratedSurfaceIds).toEqual([]);
  });

  it('全契約が一致する場合だけ6ファイルを一括移行する', () => {
    const root = makeRoot();
    writeFixture(root, 'before');

    const result = writeMetaCurrencySurfaceMigration(root);
    expect(result.overall).toBe('MIGRATED');
    expect(result.migratedSurfaceIds).toHaveLength(9);
    expect(result.pendingSurfaceIds).toEqual([]);

    for (const replacement of META_CURRENCY_SURFACE_REPLACEMENTS) {
      const source = readFileSync(join(root, replacement.file), 'utf8');
      expect(source).toContain(replacement.after);
      expect(source).not.toContain(replacement.before);
    }
  });

  it('移行済み状態への再実行はno-opになる', () => {
    const root = makeRoot();
    writeFixture(root, 'after');
    const before = new Map(
      [...new Set(META_CURRENCY_SURFACE_REPLACEMENTS.map((entry) => entry.file))].map(
        (file) => [file, readFileSync(join(root, file), 'utf8')] as const,
      ),
    );

    const result = writeMetaCurrencySurfaceMigration(root);
    expect(result.overall).toBe('MIGRATED');
    for (const [file, content] of before) {
      expect(readFileSync(join(root, file), 'utf8')).toBe(content);
    }
  });

  it('1件でも先に移行された部分状態では書き込みを拒否する', () => {
    const root = makeRoot();
    writeFixture(root, 'before');
    replaceFixtureEntry(root, 1);

    const inspection = inspectMetaCurrencySurfaceMigration(root);
    expect(inspection.overall).toBe('PARTIAL');
    expect(inspection.errors.join('\n')).toContain('partially applied');
    expect(() => writeMetaCurrencySurfaceMigration(root)).toThrow(/partially applied/);
  });

  it('needleが重複した不正状態を検出して書き込まない', () => {
    const root = makeRoot();
    writeFixture(root, 'before');
    const replacement = META_CURRENCY_SURFACE_REPLACEMENTS[1];
    const absolute = join(root, replacement.file);
    writeFileSync(
      absolute,
      `${readFileSync(absolute, 'utf8')}\n${replacement.before}\n`,
      'utf8',
    );

    const inspection = inspectMetaCurrencySurfaceMigration(root);
    expect(inspection.overall).toBe('INVALID');
    expect(inspection.errors.join('\n')).toContain('before=2');
    expect(() => writeMetaCurrencySurfaceMigration(root)).toThrow(/before=2/);
  });
});
