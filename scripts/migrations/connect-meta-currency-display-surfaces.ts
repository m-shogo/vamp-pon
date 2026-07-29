import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

export type MetaCurrencyCodemodReplacement = {
  id: string;
  file: string;
  before: string;
  after: string;
  surfaceId?: string;
};

export type MetaCurrencyCodemodReplacementState =
  | 'PENDING'
  | 'MIGRATED'
  | 'INVALID';

export type MetaCurrencyCodemodInspection = {
  overall: 'PENDING' | 'MIGRATED' | 'PARTIAL' | 'INVALID';
  replacements: Array<{
    id: string;
    file: string;
    surfaceId?: string;
    state: MetaCurrencyCodemodReplacementState;
    beforeCount: number;
    afterCount: number;
  }>;
  pendingSurfaceIds: string[];
  migratedSurfaceIds: string[];
  errors: string[];
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countExact(source: string, needle: string): number {
  if (needle === '') return 0;
  return source.match(new RegExp(escapeRegExp(needle), 'g'))?.length ?? 0;
}

export const META_CURRENCY_SURFACE_REPLACEMENTS: MetaCurrencyCodemodReplacement[] = [
  {
    id: 'migration_authority.flag',
    file: 'src/game/data/metaCurrencyDisplayMigration.ts',
    before: 'export const META_CURRENCY_WALLET_SURFACES_FORMATTER_CONNECTED = false;',
    after: 'export const META_CURRENCY_WALLET_SURFACES_FORMATTER_CONNECTED = true;',
  },
  {
    id: 'top.import',
    file: 'src/game/scenes/TopScene.ts',
    before: "import { loadProfile } from '../persistence/profile';\nimport {",
    after: "import { loadProfile } from '../persistence/profile';\nimport { formatMetaCurrencyAmount } from '../data/metaCurrencyDisplay';\nimport {",
  },
  {
    id: 'top.wallet_tag',
    surfaceId: 'top.wallet_tag',
    file: 'src/game/scenes/TopScene.ts',
    before: '`黒曜片 ${currency}`',
    after: 'formatMetaCurrencyAmount(currency)',
  },
  {
    id: 'stage_select.import',
    file: 'src/game/scenes/StageSelectScene.ts',
    before: "import { characters } from '../data/characters';\nimport { nextUnreadBondTalkId } from '../systems/bondTalkUnlocks';",
    after: "import { characters } from '../data/characters';\nimport {\n  formatMetaCurrencyAmount,\n  formatMetaCurrencyGrowthIntro,\n  formatMetaCurrencyInsufficient,\n  formatMetaCurrencyRefund,\n} from '../data/metaCurrencyDisplay';\nimport { nextUnreadBondTalkId } from '../systems/bondTalkUnlocks';",
  },
  {
    id: 'stage_select.wallet_balance',
    surfaceId: 'stage_select.wallet_balance',
    file: 'src/game/scenes/StageSelectScene.ts',
    before: '`黒曜片 ${profile.currency}`',
    after: 'formatMetaCurrencyAmount(profile.currency)',
  },
  {
    id: 'stage_select.growth_intro',
    surfaceId: 'stage_select.growth_intro',
    file: 'src/game/scenes/StageSelectScene.ts',
    before: "'黒曜片で強化して次の夜に備える\\nいつでもリセット可能'",
    after: '`${formatMetaCurrencyGrowthIntro()}\\nいつでもリセット可能`',
  },
  {
    id: 'stage_select.insufficient_funds',
    surfaceId: 'stage_select.insufficient_funds',
    file: 'src/game/scenes/StageSelectScene.ts',
    before: "'黒曜片が足りない — 探索で集めよう'",
    after: 'formatMetaCurrencyInsufficient()',
  },
  {
    id: 'stage_select.reset_refund',
    surfaceId: 'stage_select.reset_refund',
    file: 'src/game/scenes/StageSelectScene.ts',
    before: '`黒曜片 ${refund} を全額返還します。\\nいつでも振り直せます。`',
    after: '`${formatMetaCurrencyRefund(refund)}\\nいつでも振り直せます。`',
  },
  {
    id: 'result.import',
    file: 'src/game/ui/overlays.ts',
    before: "import { recipeForStage } from '../data/waves';\nimport {",
    after: "import { recipeForStage } from '../data/waves';\nimport {\n  currentMetaCurrencyDisplayName,\n  formatMetaCurrencyCarryHome,\n  formatMetaCurrencyUseCta,\n} from '../data/metaCurrencyDisplay';\nimport {",
  },
  {
    id: 'result.currency_reward',
    surfaceId: 'result.currency_reward',
    file: 'src/game/ui/overlays.ts',
    before: "      '黒曜片',\n      `+${settlement.currencyEarned}`",
    after: "      currentMetaCurrencyDisplayName(),\n      `+${settlement.currencyEarned}`",
  },
  {
    id: 'result.growth_cta',
    surfaceId: 'result.growth_cta',
    file: 'src/game/ui/overlays.ts',
    before: "const growthLabel = hasAchReward ? '黒曜片を使う' : '成長へ';",
    after: "const growthLabel = hasAchReward ? formatMetaCurrencyUseCta() : '成長へ';",
  },
  {
    id: 'ready.first_run_carry_home',
    surfaceId: 'ready.first_run_carry_home',
    file: 'src/game/ui/overlays.ts',
    before: "this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, 'やられても黒曜片は持ち帰れる。', 11, STORYBOOK_UI.goldLight)",
    after: 'this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, formatMetaCurrencyCarryHome(), 11, STORYBOOK_UI.goldLight)',
  },
  {
    id: 'profile.import',
    file: 'src/game/persistence/profile.ts',
    before: "import { achievementRewardAmount } from '../data/achievements';\nimport { recordRunEarnedMetaCurrency } from '../data/collectionEconomyTerminology';",
    after: "import { achievementRewardAmount } from '../data/achievements';\nimport {\n  formatMetaCurrencyUpgradeDescription,\n  formatMetaCurrencyUpgradeName,\n} from '../data/metaCurrencyDisplay';\nimport { recordRunEarnedMetaCurrency } from '../data/collectionEconomyTerminology';",
  },
  {
    id: 'profile.currency_gain_upgrade',
    surfaceId: 'profile.currency_gain_upgrade',
    file: 'src/game/persistence/profile.ts',
    before: "currencyGain: { id: 'currencyGain', name: '黒曜片の目印', group: '稼ぎ', maxLevel: 18, baseCost: 55, costStep: 1.28, description: '黒曜片の獲得量が増える' },",
    after: "currencyGain: { id: 'currencyGain', name: formatMetaCurrencyUpgradeName(), group: '稼ぎ', maxLevel: 18, baseCost: 55, costStep: 1.28, description: formatMetaCurrencyUpgradeDescription() },",
  },
];

function readSources(rootDir: string): Map<string, string> {
  const sources = new Map<string, string>();
  for (const file of new Set(META_CURRENCY_SURFACE_REPLACEMENTS.map((entry) => entry.file))) {
    const absolute = join(rootDir, file);
    if (!existsSync(absolute)) throw new Error(`missing codemod target: ${file}`);
    sources.set(file, readFileSync(absolute, 'utf8'));
  }
  return sources;
}

export function inspectMetaCurrencySurfaceMigration(
  rootDir = process.cwd(),
): MetaCurrencyCodemodInspection {
  let sources: Map<string, string>;
  try {
    sources = readSources(rootDir);
  } catch (error) {
    return {
      overall: 'INVALID',
      replacements: [],
      pendingSurfaceIds: [],
      migratedSurfaceIds: [],
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }

  const replacements = META_CURRENCY_SURFACE_REPLACEMENTS.map((entry) => {
    const source = sources.get(entry.file) ?? '';
    const beforeCount = countExact(source, entry.before);
    const afterCount = countExact(source, entry.after);
    const state: MetaCurrencyCodemodReplacementState =
      beforeCount === 1 && afterCount === 0
        ? 'PENDING'
        : beforeCount === 0 && afterCount === 1
          ? 'MIGRATED'
          : 'INVALID';
    return {
      id: entry.id,
      file: entry.file,
      surfaceId: entry.surfaceId,
      state,
      beforeCount,
      afterCount,
    };
  });

  const invalid = replacements.filter((entry) => entry.state === 'INVALID');
  const pending = replacements.filter((entry) => entry.state === 'PENDING');
  const migrated = replacements.filter((entry) => entry.state === 'MIGRATED');
  const overall = invalid.length > 0
    ? 'INVALID'
    : pending.length === replacements.length
      ? 'PENDING'
      : migrated.length === replacements.length
        ? 'MIGRATED'
        : 'PARTIAL';
  const errors = invalid.map(
    (entry) => `${entry.id}: expected exactly one before or after match, got before=${entry.beforeCount}, after=${entry.afterCount}`,
  );
  if (overall === 'PARTIAL') {
    errors.push('wallet display codemod is partially applied; write is blocked until the source is restored to one coherent state');
  }

  return {
    overall,
    replacements,
    pendingSurfaceIds: pending.flatMap((entry) => entry.surfaceId ? [entry.surfaceId] : []),
    migratedSurfaceIds: migrated.flatMap((entry) => entry.surfaceId ? [entry.surfaceId] : []),
    errors,
  };
}

function transformedSources(rootDir: string): Map<string, string> {
  const sources = readSources(rootDir);
  for (const entry of META_CURRENCY_SURFACE_REPLACEMENTS) {
    const source = sources.get(entry.file);
    if (source == null) throw new Error(`missing loaded source: ${entry.file}`);
    const beforeCount = countExact(source, entry.before);
    const afterCount = countExact(source, entry.after);
    if (beforeCount !== 1 || afterCount !== 0) {
      throw new Error(`${entry.id}: guarded replacement refused; before=${beforeCount}, after=${afterCount}`);
    }
    sources.set(entry.file, source.replace(entry.before, entry.after));
  }
  return sources;
}

export function writeMetaCurrencySurfaceMigration(
  rootDir = process.cwd(),
): MetaCurrencyCodemodInspection {
  const before = inspectMetaCurrencySurfaceMigration(rootDir);
  if (before.overall === 'MIGRATED') return before;
  if (before.overall !== 'PENDING') {
    throw new Error(before.errors.join('\n') || `codemod write refused in state ${before.overall}`);
  }

  const originals = readSources(rootDir);
  const transformed = transformedSources(rootDir);
  const tempFiles: Array<{ file: string; absolute: string; temp: string }> = [];

  try {
    for (const [file, content] of transformed) {
      const absolute = join(rootDir, file);
      const temp = `${absolute}.meta-currency-codemod.tmp`;
      mkdirSync(dirname(absolute), { recursive: true });
      writeFileSync(temp, content, 'utf8');
      tempFiles.push({ file, absolute, temp });
    }
    for (const entry of tempFiles) renameSync(entry.temp, entry.absolute);
  } catch (error) {
    for (const [file, content] of originals) {
      writeFileSync(join(rootDir, file), content, 'utf8');
    }
    for (const entry of tempFiles) rmSync(entry.temp, { force: true });
    throw error;
  }

  const after = inspectMetaCurrencySurfaceMigration(rootDir);
  if (after.overall !== 'MIGRATED') {
    for (const [file, content] of originals) writeFileSync(join(rootDir, file), content, 'utf8');
    throw new Error(`post-write verification failed: ${after.overall}\n${after.errors.join('\n')}`);
  }
  return after;
}

function printInspection(inspection: MetaCurrencyCodemodInspection): void {
  console.log(`[meta-currency-codemod] state=${inspection.overall}`);
  for (const entry of inspection.replacements) {
    console.log(
      `[meta-currency-codemod] ${entry.state.padEnd(8)} ${entry.id} ` +
      `(before=${entry.beforeCount}, after=${entry.afterCount})`,
    );
  }
  for (const error of inspection.errors) console.error(`[meta-currency-codemod] ${error}`);
}

function main(): void {
  const mode = process.argv.includes('--write') ? 'write' : 'check';
  if (process.argv.includes('--check') && process.argv.includes('--write')) {
    throw new Error('choose only one of --check or --write');
  }
  const result = mode === 'write'
    ? writeMetaCurrencySurfaceMigration(process.cwd())
    : inspectMetaCurrencySurfaceMigration(process.cwd());
  printInspection(result);
  if (result.overall === 'INVALID' || result.overall === 'PARTIAL') process.exitCode = 1;
}

const entryUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : '';
if (import.meta.url === entryUrl) {
  try {
    main();
  } catch (error) {
    console.error(`[meta-currency-codemod] ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
