import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  META_CURRENCY_WALLET_SURFACES_FORMATTER_CONNECTED,
  validateMetaCurrencyDisplayMigration,
} from './metaCurrencyDisplayMigration';
import {
  META_CURRENCY_SURFACE_REPLACEMENTS,
} from '../../../scripts/migrations/connect-meta-currency-display-surfaces';

function source(relativeUrl: string): string {
  return readFileSync(new URL(relativeUrl, import.meta.url), 'utf8');
}

function repositorySource(file: string): string {
  return readFileSync(file, 'utf8');
}

describe('meta currency display surface source contract', () => {
  it('既存接続済み2面が実際に共通formatterを参照する', () => {
    const atlasLabels = source('../ui/collectionAtlasLabels.ts');
    const collectionSections = source('./collectionSections.ts');

    expect(atlasLabels).toContain("import { formatMetaCurrencyReturn } from '../data/metaCurrencyDisplay';");
    expect(atlasLabels).toContain('formatMetaCurrencyReturn(reward.amount ?? 0)');
    expect(collectionSections).toContain("import { currentMetaCurrencyDisplayName } from './metaCurrencyDisplay';");
    expect(collectionSections).toContain('達成すると${currentMetaCurrencyDisplayName()}が戻る。');
  });

  it('guarded codemodの全needleが単一migration flagと一致する', () => {
    for (const replacement of META_CURRENCY_SURFACE_REPLACEMENTS) {
      const activeSource = repositorySource(replacement.file);
      if (META_CURRENCY_WALLET_SURFACES_FORMATTER_CONNECTED) {
        expect(activeSource, replacement.id).toContain(replacement.after);
        expect(activeSource, replacement.id).not.toContain(replacement.before);
      } else {
        expect(activeSource, replacement.id).toContain(replacement.before);
        expect(activeSource, replacement.id).not.toContain(replacement.after);
      }
    }

    const result = validateMetaCurrencyDisplayMigration();
    const expectedConnected = META_CURRENCY_WALLET_SURFACES_FORMATTER_CONNECTED ? 11 : 2;
    expect(result.formatterConnected).toBe(expectedConnected);
    expect(result.walletSurfaceRemaining).toBe(11 - expectedConnected);
    expect(result.readyForHumanApproval).toBe(false);
  });

  it('facility名と黒耀化bonusの旧略称をwallet migrationへ混ぜない', () => {
    const stageSelect = source('../scenes/StageSelectScene.ts');
    const overlays = source('../ui/overlays.ts');

    expect(stageSelect).toContain("'黒曜研究所'");
    expect(overlays).toContain('黒曜なし×');
  });

  it('候補表示の灯貨をactive wallet surfaceへ先行導入しない', () => {
    const activeWalletSources = [
      source('../scenes/TopScene.ts'),
      source('../scenes/StageSelectScene.ts'),
      source('../ui/overlays.ts'),
      source('../persistence/profile.ts'),
      source('../ui/collectionAtlasLabels.ts'),
      source('./collectionSections.ts'),
    ];

    for (const activeSource of activeWalletSources) {
      expect(activeSource).not.toContain("currentDisplayLabels: ['灯貨']");
    }
  });
});
