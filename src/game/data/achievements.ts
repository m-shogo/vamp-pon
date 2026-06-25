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
  { id: 'clear:s1:shallow', title: '初めての夜明け', description: '最初の夜を越え、浅い地図に灯りを戻す。', category: 'stage', reward: 40 },
  { id: 'clear:s1:middle', title: '中層の夜明け', description: 'もう一歩深い夜路を越え、星図の線を取り戻す。', category: 'stage', reward: 50 },
  { id: 'clear:s1:deep', title: '深層の夜明け', description: '深い黒インクの先で、朝の輪郭を見つける。', category: 'stage', reward: 60 },
  { id: 'clear:s2:shallow', title: '二夜目の夜明け', description: '雨ににじむ地図を開き、次の夜を越える。', category: 'stage', reward: 50 },
  { id: 'clear:s2:middle', title: '雨にじむ中層', description: '濡れた線をたどり、中層の灯りを戻す。', category: 'stage', reward: 60 },
  { id: 'clear:s2:deep', title: '雨にじむ深層', description: '雨と黒インクの奥で、消えかけた道を読む。', category: 'stage', reward: 70 },
  { id: 'no-berserk:s1:shallow', title: '黒に頼らない', description: '黒曜化せずに、最初の夜明けへたどり着く。', category: 'challenge', reward: 25 },
  { id: 'no-berserk:s1:middle', title: '黒に頼らない（中層）', description: '黒曜化せずに、中層の夜路を越える。', category: 'challenge', reward: 30 },
  { id: 'no-berserk:s1:deep', title: '黒に頼らない（深層）', description: '黒曜化せずに、深層の夜明けを迎える。', category: 'challenge', reward: 35 },
  { id: 'no-berserk:s2:shallow', title: '雨に頼らない', description: '黒曜化せずに、雨ににじむ二夜目を越える。', category: 'challenge', reward: 30 },
  { id: 'elite.defeat.first', title: '大きな影を越えた', description: '大きなカゲモノを初めてほどく。', category: 'combat', reward: 20 },
  { id: 'evolution.first', title: '記憶が重なった', description: '武器の記憶を初めて進化/合体させる。', category: 'build', reward: 25 },
  { id: 'capsule.first', title: '忘れ物を拾った', description: '記憶カプセルを初めて開き、夜の置き土産を受け取る。', category: 'build', reward: 15 },
  { id: 'stage.unlock.2', title: '新しい夜路', description: '二夜目の地図が開き、雨の路地へ進めるようになる。', category: 'stage', reward: 30 },
] as const;

const achievementMap = new Map(ACHIEVEMENT_DEFS.map((def) => [def.id, def]));

export function getAchievementDef(id: string): AchievementDef | undefined {
  return achievementMap.get(id);
}

export function achievementRewardAmount(id: string): number {
  return achievementMap.get(id)?.reward ?? 0;
}
