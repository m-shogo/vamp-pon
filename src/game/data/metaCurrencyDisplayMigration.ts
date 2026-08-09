import { META_UPGRADE_CURRENCY_ID } from './collectionEconomyTerminology.ts';
import { currentMetaCurrencyDisplayName } from './metaCurrencyDisplay.ts';

export type MetaCurrencyDisplaySurfaceStatus =
  | 'FORMATTER_CONNECTED'
  | 'DIRECT_CURRENT_LABEL'
  | 'SEPARATE_NON_WALLET_REVIEW';

export type MetaCurrencyDisplaySurface = {
  id: string;
  sourceFile: string;
  surface: string;
  status: MetaCurrencyDisplaySurfaceStatus;
  walletSurface: boolean;
  formatterFunction?: string;
  currentTextHint: string;
  notes: string[];
};

export const META_CURRENCY_WALLET_SURFACES_FORMATTER_CONNECTED = true;

const pendingWalletStatus: MetaCurrencyDisplaySurfaceStatus =
  META_CURRENCY_WALLET_SURFACES_FORMATTER_CONNECTED
    ? 'FORMATTER_CONNECTED'
    : 'DIRECT_CURRENT_LABEL';

export const metaCurrencyDisplayMigrationAuthority = {
  conceptId: META_UPGRADE_CURRENCY_ID,
  currentDisplay: '黒曜片',
  candidateDisplay: '灯貨',
  candidateStatus: 'HIGH_VALUE_CANDIDATE_NOT_CURRENT' as const,
  humanNamingApproved: false,
  saveFieldsPreserved: [
    'PlayerProfile.currency',
    'PlayerProfile.totalCurrencyEarned',
  ],
  internalIdsPreserved: [
    'NightBoardReward.type:light_coin',
    'UpgradeId:currencyGain',
  ],
  futureLegacyAliasesAfterPromotion: ['黒曜片'],
  atomicMigrationRequired: true,
} as const;

export const metaCurrencyDisplaySurfaces: MetaCurrencyDisplaySurface[] = [
  {
    id: 'collection.clear_getter_reward',
    sourceFile: 'src/game/ui/collectionAtlasLabels.ts',
    surface: 'Clear Getter light_coin reward text',
    status: 'FORMATTER_CONNECTED',
    walletSurface: true,
    formatterFunction: 'formatMetaCurrencyReturn',
    currentTextHint: '黒曜片が少し戻った +N',
    notes: ['Current表示は維持し、label sourceだけを共通化した。'],
  },
  {
    id: 'collection.achievement_description',
    sourceFile: 'src/game/data/collectionSections.ts',
    surface: 'Collection achievement section description',
    status: 'FORMATTER_CONNECTED',
    walletSurface: true,
    formatterFunction: 'currentMetaCurrencyDisplayName',
    currentTextHint: '達成すると黒曜片が戻る。',
    notes: ['data層からformatterを参照する。'],
  },
  {
    id: 'top.wallet_tag',
    sourceFile: 'src/game/scenes/TopScene.ts',
    surface: 'TOP wallet balance tag',
    status: pendingWalletStatus,
    walletSurface: true,
    formatterFunction: 'formatMetaCurrencyAmount',
    currentTextHint: '黒曜片 N',
    notes: ['guarded codemodで限定接続する。'],
  },
  {
    id: 'stage_select.wallet_balance',
    sourceFile: 'src/game/scenes/StageSelectScene.ts',
    surface: 'StageSelect wallet balance',
    status: pendingWalletStatus,
    walletSurface: true,
    formatterFunction: 'formatMetaCurrencyAmount',
    currentTextHint: '黒曜片 N',
    notes: ['guarded codemodでScene全置換を避ける。'],
  },
  {
    id: 'stage_select.growth_intro',
    sourceFile: 'src/game/scenes/StageSelectScene.ts',
    surface: 'Growth onboarding hint',
    status: pendingWalletStatus,
    walletSurface: true,
    formatterFunction: 'formatMetaCurrencyGrowthIntro',
    currentTextHint: '黒曜片で強化して次の夜に備える',
    notes: ['display rename時も同じformatter authorityを使う。'],
  },
  {
    id: 'stage_select.insufficient_funds',
    sourceFile: 'src/game/scenes/StageSelectScene.ts',
    surface: 'Insufficient-funds message',
    status: pendingWalletStatus,
    walletSurface: true,
    formatterFunction: 'formatMetaCurrencyInsufficient',
    currentTextHint: '黒曜片が足りない',
    notes: ['購入判定そのものはPlayerProfile.currencyを維持する。'],
  },
  {
    id: 'stage_select.reset_refund',
    sourceFile: 'src/game/scenes/StageSelectScene.ts',
    surface: 'Upgrade reset/refund confirmation',
    status: pendingWalletStatus,
    walletSurface: true,
    formatterFunction: 'formatMetaCurrencyRefund',
    currentTextHint: '黒曜片 N を全額返還します。',
    notes: ['refund amountとsave fieldは変更しない。'],
  },
  {
    id: 'result.currency_reward',
    sourceFile: 'src/game/ui/overlays.ts',
    surface: 'Result currency reward card title',
    status: pendingWalletStatus,
    walletSurface: true,
    formatterFunction: 'currentMetaCurrencyDisplayName',
    currentTextHint: '黒曜片',
    notes: ['RunSettlement.currencyEarnedの数値契約は変更しない。'],
  },
  {
    id: 'result.growth_cta',
    sourceFile: 'src/game/ui/overlays.ts',
    surface: 'Result growth CTA after achievement reward',
    status: pendingWalletStatus,
    walletSurface: true,
    formatterFunction: 'formatMetaCurrencyUseCta',
    currentTextHint: '黒曜片を使う',
    notes: ['CTA文だけをformatter-backed phraseへ移す。'],
  },
  {
    id: 'ready.first_run_carry_home',
    sourceFile: 'src/game/ui/overlays.ts',
    surface: 'First-run carry-home guidance',
    status: pendingWalletStatus,
    walletSurface: true,
    formatterFunction: 'formatMetaCurrencyCarryHome',
    currentTextHint: 'やられても黒曜片は持ち帰れる。',
    notes: ['敗北時も獲得できるruntime仕様は維持する。'],
  },
  {
    id: 'profile.currency_gain_upgrade',
    sourceFile: 'src/game/persistence/profile.ts',
    surface: 'Currency-gain upgrade name and description',
    status: pendingWalletStatus,
    walletSurface: true,
    formatterFunction: 'formatMetaCurrencyUpgradeName + formatMetaCurrencyUpgradeDescription',
    currentTextHint: '黒曜片の目印 / 黒曜片の獲得量が増える',
    notes: ['UpgradeId、cost、multiplierを変えない。'],
  },
  {
    id: 'facility.black_obsidian_lab',
    sourceFile: 'src/game/scenes/StageSelectScene.ts',
    surface: 'Growth facility title',
    status: 'SEPARATE_NON_WALLET_REVIEW',
    walletSurface: false,
    currentTextHint: '黒曜研究所',
    notes: ['通貨表示ではないため、灯貨migrationへ混ぜない。'],
  },
  {
    id: 'result.black_youka_bonus',
    sourceFile: 'src/game/ui/overlays.ts',
    surface: 'No-黒耀化 result bonus label',
    status: 'SEPARATE_NON_WALLET_REVIEW',
    walletSurface: false,
    currentTextHint: '黒曜なし',
    notes: ['経済名ではなく黒耀化用語修正として別patchで扱う。'],
  },
];

export type MetaCurrencyDisplayMigrationValidation = {
  errors: string[];
  warnings: string[];
  formatterConnected: number;
  walletSurfaceTotal: number;
  walletSurfaceRemaining: number;
  readyForHumanApproval: boolean;
};

export function validateMetaCurrencyDisplayMigration(): MetaCurrencyDisplayMigrationValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = new Set<string>();
  const walletSurfaces = metaCurrencyDisplaySurfaces.filter((surface) => surface.walletSurface);
  const connected = walletSurfaces.filter((surface) => surface.status === 'FORMATTER_CONNECTED');

  if (currentMetaCurrencyDisplayName() !== metaCurrencyDisplayMigrationAuthority.currentDisplay) {
    errors.push('formatter current display does not match migration authority');
  }
  if (
    String(metaCurrencyDisplayMigrationAuthority.currentDisplay) ===
    String(metaCurrencyDisplayMigrationAuthority.candidateDisplay)
  ) {
    errors.push('current and candidate display names must remain distinct before approval');
  }
  if (metaCurrencyDisplayMigrationAuthority.humanNamingApproved) {
    errors.push('Human naming approval must remain false until an explicit user decision');
  }

  for (const surface of metaCurrencyDisplaySurfaces) {
    if (ids.has(surface.id)) errors.push(`duplicate meta currency display surface id: ${surface.id}`);
    ids.add(surface.id);
    if (surface.walletSurface && !surface.formatterFunction) {
      errors.push(`${surface.id} wallet surface is missing its formatter plan`);
    }
    if (!surface.walletSurface && surface.status !== 'SEPARATE_NON_WALLET_REVIEW') {
      errors.push(`${surface.id} non-wallet surface must stay outside wallet migration`);
    }
    if (surface.currentTextHint.includes(metaCurrencyDisplayMigrationAuthority.candidateDisplay)) {
      errors.push(`${surface.id} must not display the candidate name before approval`);
    }
  }

  const remaining = walletSurfaces.length - connected.length;
  const expectedConnected = META_CURRENCY_WALLET_SURFACES_FORMATTER_CONNECTED ? 11 : 2;
  if (connected.length !== expectedConnected) {
    errors.push(`wallet formatter flag expects ${expectedConnected} connected surfaces, got ${connected.length}`);
  }
  if (remaining > 0) warnings.push(`${remaining} wallet display surface(s) are not formatter-connected`);
  warnings.push('灯貨 remains a candidate and must not be promoted automatically');

  return {
    errors,
    warnings,
    formatterConnected: connected.length,
    walletSurfaceTotal: walletSurfaces.length,
    walletSurfaceRemaining: remaining,
    readyForHumanApproval:
      remaining === 0 &&
      metaCurrencyDisplayMigrationAuthority.humanNamingApproved,
  };
}
