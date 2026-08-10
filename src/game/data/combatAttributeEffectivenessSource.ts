import type { CombatAttribute } from './combatAffinitySource.ts';

export type NonNeutralAttribute = Exclude<CombatAttribute, 'NEUTRAL'>;
export type AttributeSet =
  | readonly [NonNeutralAttribute]
  | readonly [NonNeutralAttribute, NonNeutralAttribute]
  | readonly [NonNeutralAttribute, NonNeutralAttribute, NonNeutralAttribute];

export type AttributeDamageShare = readonly [NonNeutralAttribute, number];
export type EffectivenessLabel = 'SUPER_EFFECTIVE' | 'EFFECTIVE' | 'NEUTRAL' | 'RESISTED' | 'STRONGLY_RESISTED';

export const EFFECTIVENESS_MULTIPLIERS = {
  SUPER_EFFECTIVE: 1.25,
  EFFECTIVE: 1.12,
  NEUTRAL: 1.0,
  RESISTED: 0.85,
  STRONGLY_RESISTED: 0.72,
} as const;

export type AttributeEffectivenessRule = {
  attack: NonNeutralAttribute;
  superEffectiveAgainst: readonly NonNeutralAttribute[];
  effectiveAgainst: readonly NonNeutralAttribute[];
  resistedBy: readonly NonNeutralAttribute[];
  stronglyResistedBy: readonly NonNeutralAttribute[];
  designReason: string;
};

/** Original Yoruno Shirube matchup chart. No hard immunity. */
export const attributeEffectivenessRules: readonly AttributeEffectivenessRule[] = [
  { attack: 'LIGHT', superEffectiveAgainst: ['DARK'], effectiveAgainst: ['DREAM'], resistedBy: ['STAR'], stronglyResistedBy: ['BLANK'], designReason: '光は隠れた輪郭を暴くが、余白そのものは照らしても答えにならない。' },
  { attack: 'DARK', superEffectiveAgainst: ['LIGHT'], effectiveAgainst: ['MEMORY'], resistedBy: ['DREAM'], stronglyResistedBy: ['STAR'], designReason: '闇は照明と記録を沈めるが、星の導きは暗さだけでは失われにくい。' },
  { attack: 'FIRE', superEffectiveAgainst: ['BLOOM'], effectiveAgainst: ['ICE'], resistedBy: ['EARTH'], stronglyResistedBy: ['WATER'], designReason: '火は乾いた花や冷えを崩すが、水には明確に弱い。' },
  { attack: 'WATER', superEffectiveAgainst: ['FIRE'], effectiveAgainst: ['EARTH'], resistedBy: ['BLOOM'], stronglyResistedBy: ['ICE'], designReason: '水は火を鎮め土を崩すが、花には利用され、氷には流れを止められる。' },
  { attack: 'WIND', superEffectiveAgainst: ['DREAM'], effectiveAgainst: ['BLOOM'], resistedBy: ['METAL'], stronglyResistedBy: ['EARTH'], designReason: '風は夢の停滞や軽い根を散らすが、重い地面には通りにくい。' },
  { attack: 'THUNDER', superEffectiveAgainst: ['WATER'], effectiveAgainst: ['METAL'], resistedBy: ['BLANK'], stronglyResistedBy: ['EARTH'], designReason: '雷は濡れと導電体へ伸びるが、地面へ逃げ、余白には連鎖先を失う。' },
  { attack: 'ICE', superEffectiveAgainst: ['WIND'], effectiveAgainst: ['WATER'], resistedBy: ['METAL'], stronglyResistedBy: ['FIRE'], designReason: '氷は流れと風を固めるが、熱にはほどかれる。' },
  { attack: 'EARTH', superEffectiveAgainst: ['THUNDER'], effectiveAgainst: ['FIRE'], resistedBy: ['BLOOM'], stronglyResistedBy: ['WATER'], designReason: '地は雷を逃がし火を塞ぐが、水と根に時間をかけて崩される。' },
  { attack: 'METAL', superEffectiveAgainst: ['ICE'], effectiveAgainst: ['STAR'], resistedBy: ['EARTH'], stronglyResistedBy: ['THUNDER'], designReason: '鉄は氷や精密な星軌道を切るが、雷には導電して逆に危険。' },
  { attack: 'BLOOM', superEffectiveAgainst: ['EARTH'], effectiveAgainst: ['WATER'], resistedBy: ['WIND'], stronglyResistedBy: ['FIRE'], designReason: '根は土を割り水を使うが、火と強い風には崩されやすい。' },
  { attack: 'DREAM', superEffectiveAgainst: ['MEMORY'], effectiveAgainst: ['LIGHT'], resistedBy: ['DARK'], stronglyResistedBy: ['STAR'], designReason: '夢は記憶の確かさを揺らし光景を歪めるが、星は夢の中でも基準点になる。' },
  { attack: 'MEMORY', superEffectiveAgainst: ['BLANK'], effectiveAgainst: ['DREAM'], resistedBy: ['LIGHT'], stronglyResistedBy: ['DARK'], designReason: '記録は余白へ意味を書き戻し夢を固定するが、深い闇では手掛かりを失う。' },
  { attack: 'STAR', superEffectiveAgainst: ['DREAM'], effectiveAgainst: ['DARK'], resistedBy: ['METAL'], stronglyResistedBy: ['BLANK'], designReason: '星は夢と闇の中で方向を示すが、余白では座標自体が定まらない。' },
  { attack: 'BLANK', superEffectiveAgainst: ['MEMORY'], effectiveAgainst: ['LIGHT'], resistedBy: ['BLOOM'], stronglyResistedBy: ['DARK'], designReason: '余白は記録や照明をいったん弱めて書き直せるが、深い闇そのものを消去はできない。' },
] as const;

const ruleByAttack = new Map(attributeEffectivenessRules.map((rule) => [rule.attack, rule]));

export function singleAttributeEffectiveness(attack: NonNeutralAttribute, defense: NonNeutralAttribute): number {
  const rule = ruleByAttack.get(attack)!;
  if (rule.superEffectiveAgainst.includes(defense)) return EFFECTIVENESS_MULTIPLIERS.SUPER_EFFECTIVE;
  if (rule.effectiveAgainst.includes(defense)) return EFFECTIVENESS_MULTIPLIERS.EFFECTIVE;
  if (rule.stronglyResistedBy.includes(defense)) return EFFECTIVENESS_MULTIPLIERS.STRONGLY_RESISTED;
  if (rule.resistedBy.includes(defense)) return EFFECTIVENESS_MULTIPLIERS.RESISTED;
  return EFFECTIVENESS_MULTIPLIERS.NEUTRAL;
}

/** Defense can carry 1-3 attributes. Multiplication creates intersecting strengths/weaknesses, then clamps for favorite-character viability. */
export function effectivenessAgainstAttributeSet(attack: NonNeutralAttribute, defenses: AttributeSet): number {
  const raw = defenses.reduce((value, defense) => value * singleAttributeEffectiveness(attack, defense), 1);
  return Math.max(0.72, Math.min(1.45, raw));
}

export function labelEffectiveness(multiplier: number): EffectivenessLabel {
  if (multiplier >= 1.35) return 'SUPER_EFFECTIVE';
  if (multiplier >= 1.10) return 'EFFECTIVE';
  if (multiplier > 0.90) return 'NEUTRAL';
  if (multiplier > 0.76) return 'RESISTED';
  return 'STRONGLY_RESISTED';
}

export function defaultDamageShares(attributes: AttributeSet): readonly AttributeDamageShare[] {
  if (attributes.length === 1) return [[attributes[0], 1]];
  if (attributes.length === 2) return [[attributes[0], 0.5], [attributes[1], 0.5]];
  return [[attributes[0], 0.5], [attributes[1], 0.3], [attributes[2], 0.2]];
}

/** Multi-attribute attacks split damage. They never multiply every favorable attack attribute together. */
export function multiAttributeAttackEffectiveness(
  attackShares: readonly AttributeDamageShare[],
  defenses: AttributeSet,
): number {
  const normalizedTotal = attackShares.reduce((sum, [, share]) => sum + share, 0) || 1;
  const weighted = attackShares.reduce(
    (sum, [attribute, share]) => sum + effectivenessAgainstAttributeSet(attribute, defenses) * (share / normalizedTotal),
    0,
  );
  return Math.max(0.72, Math.min(1.45, weighted));
}

export const multiAttributeRules = {
  allowedAttributeCounts: [1, 2, 3] as const,
  fourOrMoreAttributesForbidden: true,
  singleAttributeIdentity: '専門家。読みやすく、尖ったbuildを作る。',
  dualAttributeIdentity: '標準的な複合型。相性の交差とReactionを作る。',
  tripleAttributeIdentity: '少数のElite/Boss/Awakening/Fusionのみ。物語・素材・個体理由が必要。',
  attackMultiTypeUsesDamageSplit: true,
  defenseMultiTypeUsesStackedMatchups: true,
  hardImmunityAllowed: false,
  finalAdvantageCap: 1.45,
  finalDisadvantageFloor: 0.72,
} as const;
