import {
  META_UPGRADE_CURRENCY_ID,
  collectionEconomyResourceById,
} from './collectionEconomyTerminology';

export function currentMetaCurrencyDisplayName(): string {
  const resource = collectionEconomyResourceById.get(META_UPGRADE_CURRENCY_ID);
  const label = resource?.currentDisplayLabels[0]?.trim();
  if (!label) throw new Error('missing current meta currency display label');
  return label;
}

export function formatMetaCurrencyAmount(amount: number): string {
  const normalized = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
  return `${currentMetaCurrencyDisplayName()} ${normalized}`;
}

export function formatMetaCurrencyGain(amount: number, prefix = ''): string {
  const normalized = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
  const lead = prefix.trim() ? `${prefix.trim()} ` : '';
  return `${lead}${currentMetaCurrencyDisplayName()} +${normalized}`;
}

export function formatMetaCurrencyReturn(amount: number): string {
  const normalized = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
  return `${currentMetaCurrencyDisplayName()}が少し戻った +${normalized}`;
}
