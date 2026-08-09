import type { NightBoardReward } from '../data/collectionProgress';
import { formatMetaCurrencyReturn } from '../data/metaCurrencyDisplay';

export function nightBoardRewardLabel(reward: NightBoardReward): string {
  switch (reward.type) {
    case 'light_coin': return formatMetaCurrencyReturn(reward.amount ?? 0);
    case 'travel_prep': return reward.amount === 1 ? '旅支度がひとつ整った' : `旅支度が${reward.amount ?? 0}つ整った`;
    case 'memory_text': return '記憶文がひとつ読めるようになった';
    case 'cosmetic': return '小さな見た目の記録が開いた';
    case 'sound': return '夜に残った音が聞こえるようになった';
  }
}
