import { describe, expect, it } from 'vitest';
import {
  META_CURRENCY_WALLET_SURFACES_FORMATTER_CONNECTED,
  metaCurrencyDisplayMigrationAuthority,
  metaCurrencyDisplaySurfaces,
  validateMetaCurrencyDisplayMigration,
} from './metaCurrencyDisplayMigration';

describe('meta currency display migration authority', () => {
  it('Current表示と候補表示をHuman承認前は分離する', () => {
    expect(metaCurrencyDisplayMigrationAuthority.currentDisplay).toBe('黒曜片');
    expect(metaCurrencyDisplayMigrationAuthority.candidateDisplay).toBe('灯貨');
    expect(metaCurrencyDisplayMigrationAuthority.humanNamingApproved).toBe(false);
    expect(metaCurrencyDisplayMigrationAuthority.atomicMigrationRequired).toBe(true);
  });

  it('save fieldと内部IDを表示改名から分離して保持する', () => {
    expect(metaCurrencyDisplayMigrationAuthority.saveFieldsPreserved).toEqual([
      'PlayerProfile.currency',
      'PlayerProfile.totalCurrencyEarned',
    ]);
    expect(metaCurrencyDisplayMigrationAuthority.internalIdsPreserved).toContain(
      'NightBoardReward.type:light_coin',
    );
    expect(metaCurrencyDisplayMigrationAuthority.futureLegacyAliasesAfterPromotion).toEqual(['黒曜片']);
  });

  it('wallet表示11面のcoverageを単一migration flagと同期する', () => {
    const result = validateMetaCurrencyDisplayMigration();
    const expectedConnected = META_CURRENCY_WALLET_SURFACES_FORMATTER_CONNECTED ? 11 : 2;
    expect(result.errors).toEqual([]);
    expect(result.walletSurfaceTotal).toBe(11);
    expect(result.formatterConnected).toBe(expectedConnected);
    expect(result.walletSurfaceRemaining).toBe(11 - expectedConnected);
    expect(result.readyForHumanApproval).toBe(false);
  });

  it('全wallet surfaceに将来のformatter functionを先に割り当てる', () => {
    const walletSurfaces = metaCurrencyDisplaySurfaces.filter((surface) => surface.walletSurface);
    expect(walletSurfaces).toHaveLength(11);
    expect(walletSurfaces.every((surface) => Boolean(surface.formatterFunction))).toBe(true);
  });

  it('黒曜研究所と黒耀化bonusをwallet改名へ混ぜない', () => {
    const separate = metaCurrencyDisplaySurfaces.filter(
      (surface) => surface.status === 'SEPARATE_NON_WALLET_REVIEW',
    );
    expect(separate.map((surface) => surface.id)).toEqual([
      'facility.black_obsidian_lab',
      'result.black_youka_bonus',
    ]);
    expect(separate.every((surface) => !surface.walletSurface)).toBe(true);
  });

  it('候補の灯貨を現役surfaceへ先行表示しない', () => {
    expect(
      metaCurrencyDisplaySurfaces.some((surface) => surface.currentTextHint.includes('灯貨')),
    ).toBe(false);
  });
});
