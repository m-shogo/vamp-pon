import type { AttributeSet, NonNeutralAttribute } from './combatAttributeEffectivenessSource.ts';
import { enemyProductionEntries } from './enemyProductionDatabase.ts';
import { stageCombatProfiles } from './combatAffinitySource.ts';

export type EnemyAttributeIdentity = {
  enemyId: string;
  enemyName: string;
  rank: 'small' | 'medium' | 'elite' | 'boss';
  defensiveAttributes: AttributeSet;
  typeCount: 1 | 2 | 3;
  motifReason: string;
  stageReason: string;
  readabilityRule: string;
};

const stageById = new Map(stageCombatProfiles.map((stage) => [stage.stageId, stage]));

function unique<T>(values: readonly T[]): T[] { return [...new Set(values)]; }

function motifAttributes(enemyId: string): NonNeutralAttribute[] {
  const out: NonNeutralAttribute[] = [];
  if (/black|violet|shadow|origami|night/.test(enemyId)) out.push('DARK');
  if (/light|lamp|window|lens|dawn/.test(enemyId)) out.push('LIGHT');
  if (/match|ember|fire|wick/.test(enemyId)) out.push('FIRE');
  if (/blue|dew|water|rain|river/.test(enemyId)) out.push('WATER');
  if (/paper|envelope|ticket|ribbon|wing|wind/.test(enemyId)) out.push('WIND');
  if (/thunder|storm|wire|electric/.test(enemyId)) out.push('THUNDER');
  if (/ice|frost|cold|moon_box|bookmark/.test(enemyId)) out.push('ICE');
  if (/chalk|stone|pavement|ground|ruler/.test(enemyId)) out.push('EARTH');
  if (/metal|needle|key|gate|tool|ruler/.test(enemyId)) out.push('METAL');
  if (/flower|thread|vine|root|petal/.test(enemyId)) out.push('BLOOM');
  if (/dream|sheep|sleep|haze/.test(enemyId)) out.push('DREAM');
  if (/name|label|tag|memory|photo/.test(enemyId)) out.push('MEMORY');
  if (/star|compass|route|owl|eagle/.test(enemyId)) out.push('STAR');
  if (/blank|eraser|margin|empty/.test(enemyId)) out.push('BLANK');
  return unique(out);
}

function fallbackAttributes(stageIds: readonly string[], enemyId: string): NonNeutralAttribute[] {
  const stageValues = stageIds.flatMap((stageId) => stageById.get(stageId)?.favored ?? []);
  const nonNeutral = stageValues.filter((attribute): attribute is NonNeutralAttribute => attribute !== 'NEUTRAL');
  if (nonNeutral.length > 0) return unique(nonNeutral);

  // Family-agnostic fallback: basic ink enemies are DARK only when no stronger motif/stage fact exists.
  return /ombu|omburo|shadow/.test(enemyId) ? ['DARK'] : ['MEMORY'];
}

function desiredTypeCount(rank: EnemyAttributeIdentity['rank'], candidates: readonly NonNeutralAttribute[]): 1 | 2 | 3 {
  if (rank === 'boss') return candidates.length >= 3 ? 3 : candidates.length >= 2 ? 2 : 1;
  if (rank === 'elite') return candidates.length >= 2 ? 2 : 1;
  if (rank === 'medium') return candidates.length >= 2 ? 2 : 1;
  return 1;
}

function toAttributeSet(values: readonly NonNeutralAttribute[], count: 1 | 2 | 3): AttributeSet {
  const safe = unique(values);
  if (count === 3 && safe.length >= 3) return [safe[0], safe[1], safe[2]];
  if (count >= 2 && safe.length >= 2) return [safe[0], safe[1]];
  return [safe[0] ?? 'DARK'];
}

export const enemyAttributeIdentities: readonly EnemyAttributeIdentity[] = enemyProductionEntries.map((enemy) => {
  const motif = motifAttributes(enemy.id);
  const stage = fallbackAttributes(enemy.stageAffinity, enemy.id);
  const candidates = unique([...motif, ...stage]);
  const typeCount = desiredTypeCount(enemy.rank, candidates);
  const defensiveAttributes = toAttributeSet(candidates, typeCount);

  return {
    enemyId: enemy.id,
    enemyName: enemy.name,
    rank: enemy.rank,
    defensiveAttributes,
    typeCount: defensiveAttributes.length as 1 | 2 | 3,
    motifReason: motif.length > 0
      ? `ID/visual motifから ${motif.join(' + ')} を候補化。色だけでなく素材・行動・攻撃cueの意味を優先する。`
      : '固有motifで属性を断定せず、出現stageの戦闘文脈を優先する。',
    stageReason: enemy.stageAffinity.length > 0
      ? `Affinity stage: ${enemy.stageAffinity.join(', ')}。stage favored属性を不足時の補助根拠に使う。`
      : 'stage affinityが薄い個体はfamily/role側の意味を優先する。',
    readabilityRule: typeCount === 1
      ? '単属性。初見でも役割と対策を読みやすくする。'
      : typeCount === 2
        ? '二属性。弱点と耐性が交差する標準複合型。'
        : '三属性。Boss等の複雑個体だけ。三属性すべてに物語/素材/行動上の理由が必要。',
  };
});

export const enemyAttributeIdentitySummary = {
  enemyCount: enemyAttributeIdentities.length,
  singleTypeCount: enemyAttributeIdentities.filter((entry) => entry.typeCount === 1).length,
  dualTypeCount: enemyAttributeIdentities.filter((entry) => entry.typeCount === 2).length,
  tripleTypeCount: enemyAttributeIdentities.filter((entry) => entry.typeCount === 3).length,
  fourPlusTypeCount: 0,
  allEnemiesTyped: enemyAttributeIdentities.every((entry) => entry.defensiveAttributes.length >= 1 && entry.defensiveAttributes.length <= 3),
} as const;
