import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validateMetaCurrencyDisplayMigration } from './metaCurrencyDisplayMigration';

function source(relativeUrl: string): string {
  return readFileSync(new URL(relativeUrl, import.meta.url), 'utf8');
}

describe('meta currency display surface source contract', () => {
  it('接続済み2面が実際に共通formatterを参照する', () => {
    const atlasLabels = source('../ui/collectionAtlasLabels.ts');
    const collectionSections = source('./collectionSections.ts');

    expect(atlasLabels).toContain("import { formatMetaCurrencyReturn } from '../data/metaCurrencyDisplay';");
    expect(atlasLabels).toContain('formatMetaCurrencyReturn(reward.amount ?? 0)');
    expect(collectionSections).toContain("import { currentMetaCurrencyDisplayName } from './metaCurrencyDisplay';");
    expect(collectionSections).toContain('達成すると${currentMetaCurrencyDisplayName()}が戻る。');
  });

  it('未接続9面を漏れなく台帳化したまま保持する', () => {
    const top = source('../scenes/TopScene.ts');
    const stageSelect = source('../scenes/StageSelectScene.ts');
    const overlays = source('../ui/overlays.ts');
    const profile = source('../persistence/profile.ts');

    expect(top).toContain('`黒曜片 ${currency}`');

    expect(stageSelect).toContain('`黒曜片 ${profile.currency}`');
    expect(stageSelect).toContain('黒曜片で強化して次の夜に備える');
    expect(stageSelect).toContain('黒曜片が足りない — 探索で集めよう');
    expect(stageSelect).toContain('`黒曜片 ${refund} を全額返還します。');

    expect(overlays).toContain("'黒曜片',");
    expect(overlays).toContain("'黒曜片を使う'");
    expect(overlays).toContain('やられても黒曜片は持ち帰れる。');

    expect(profile).toContain("name: '黒曜片の目印'");
    expect(profile).toContain("description: '黒曜片の獲得量が増える'");

    const result = validateMetaCurrencyDisplayMigration();
    expect(result.walletSurfaceRemaining).toBe(9);
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
      expect(activeSource).not.toContain('currentDisplayLabels: [\'灯貨\']');
    }
  });
});
