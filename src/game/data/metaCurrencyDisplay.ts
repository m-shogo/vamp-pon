import {
  META_UPGRADE_CURRENCY_ID,
  collectionEconomyResourceById,
} from './collectionEconomyTerminology';

function normalizeMetaCurrencyAmount(amount: number): number {
  return Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
}

export function currentMetaCurrencyDisplayName(): string {
  const resource = collectionEconomyResourceById.get(META_UPGRADE_CURRENCY_ID);
  const label = resource?.currentDisplayLabels[0]?.trim();
  if (!label) throw new Error('missing current meta currency display label');
  return label;
}

export function formatMetaCurrencyAmount(amount: number): string {
  return `${currentMetaCurrencyDisplayName()} ${normalizeMetaCurrencyAmount(amount)}`;
}

export function formatMetaCurrencyGain(amount: number, prefix = ''): string {
  const lead = prefix.trim() ? `${prefix.trim()} ` : '';
  return `${lead}${currentMetaCurrencyDisplayName()} +${normalizeMetaCurrencyAmount(amount)}`;
}

export function formatMetaCurrencyReturn(amount: number): string {
  return `${currentMetaCurrencyDisplayName()}が少し戻った +${normalizeMetaCurrencyAmount(amount)}`;
}

export function formatMetaCurrencyGrowthIntro(): string {
  return `${currentMetaCurrencyDisplayName()}で強化して次の夜に備える`;
}

export function formatMetaCurrencyInsufficient(): string {
  return `${currentMetaCurrencyDisplayName()}が足りない — 探索で集めよう`;
}

export function formatMetaCurrencyRefund(amount: number): string {
  return `${formatMetaCurrencyAmount(amount)} を全額返還します。`;
}

export function formatMetaCurrencyCarryHome(): string {
  return `${currentMetaCurrencyDisplayName()}は持ち帰れる。`;
}

export function formatMetaCurrencyUseCta(): string {
  return `${currentMetaCurrencyDisplayName()}を使う`;
}

export function formatMetaCurrencyUpgradeName(): string {
  return `${currentMetaCurrencyDisplayName()}の目印`;
}

export function formatMetaCurrencyUpgradeDescription(): string {
  return `${currentMetaCurrencyDisplayName()}の獲得量が増える`;
}
