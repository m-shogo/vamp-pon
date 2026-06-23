export type AchievementCategory = 'stage' | 'combat' | 'build' | 'challenge';

export type AchievementDef = {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  reward: number;
  hidden?: boolean;
};

export const ACHIEVEMENT_DEFS: readonly AchievementDef[] = [
  { id: 'clear:s1:shallow', title: '初めての夜明け', description: 'Stage1（浅層）をクリア', category: 'stage', reward: 40 },
  { id: 'clear:s1:middle', title: '中層の夜明け', description: 'Stage1（中層）をクリア', category: 'stage', reward: 50 },
  { id: 'clear:s1:deep', title: '深層の夜明け', description: 'Stage1（深層）をクリア', category: 'stage', reward: 60 },
  { id: 'clear:s2:shallow', title: '二夜目の夜明け', description: 'Stage2（浅層）をクリア', category: 'stage', reward: 50 },
  { id: 'clear:s2:middle', title: '雨にじむ中層', description: 'Stage2（中層）をクリア', category: 'stage', reward: 60 },
  { id: 'clear:s2:deep', title: '雨にじむ深層', description: 'Stage2（深層）をクリア', category: 'stage', reward: 70 },
  { id: 'no-berserk:s1:shallow', title: '黒に頼らない', description: 'Stage1を黒耀化なしでクリア', category: 'challenge', reward: 25 },
  { id: 'no-berserk:s1:middle', title: '黒に頼らない（中層）', description: 'Stage1中層を黒耀化なしでクリア', category: 'challenge', reward: 30 },
  { id: 'no-berserk:s1:deep', title: '黒に頼らない（深層）', description: 'Stage1深層を黒耀化なしでクリア', category: 'challenge', reward: 35 },
  { id: 'no-berserk:s2:shallow', title: '雨に頼らない', description: 'Stage2を黒耀化なしでクリア', category: 'challenge', reward: 30 },
  { id: 'elite.defeat.first', title: '大きな影を越えた', description: 'エリートを初めて倒した', category: 'combat', reward: 20 },
  { id: 'evolution.first', title: '記憶が重なった', description: '初めて進化/合体した', category: 'build', reward: 25 },
  { id: 'capsule.first', title: '忘れ物を拾った', description: '初めてカプセルを開けた', category: 'build', reward: 15 },
  { id: 'stage.unlock.2', title: '新しい夜路', description: 'Stage2を解放した', category: 'stage', reward: 30 },
] as const;

const achievementMap = new Map(ACHIEVEMENT_DEFS.map((def) => [def.id, def]));

export function getAchievementDef(id: string): AchievementDef | undefined {
  return achievementMap.get(id);
}

export function achievementRewardAmount(id: string): number {
  return achievementMap.get(id)?.reward ?? 0;
}
