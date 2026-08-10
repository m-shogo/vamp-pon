import type { BuffKind, CombatAttribute, StatusKind } from './combatAffinitySource.ts';

export type CombatItemEffectCandidate = {
  id: string;
  name: string;
  kind: 'PASSIVE' | 'FIELD_ITEM' | 'RARE_SUPPORT';
  attributeBias: readonly CombatAttribute[];
  grantsBuffs: readonly BuffKind[];
  resistsStatuses: readonly StatusKind[];
  cleansesStatuses: readonly StatusKind[];
  reactionAssist?: string;
  rule: string;
  tradeoff: string;
  storySeed: string;
  runtimeStatus: 'CONTENT_SOURCE_ONLY';
};

export const combatItemEffectCandidates: readonly CombatItemEffectCandidate[] = [
  { id: 'amber_lamp_glass', name: '飴色のランタンガラス', kind: 'PASSIVE', attributeBias: ['LIGHT'], grantsBuffs: ['DAWN_GUARD'], resistsStatuses: ['ECLIPSED'], cleansesStatuses: [], rule: 'ILLUMINATEDを付与した直後だけ短い防御bonus。常時Light damage増加にはしない。', tradeoff: '攻撃力を直接上げず、防御/視認対策枠を使う。', storySeed: '何度も煤を拭かれたガラス。透明ではないから眩しすぎない。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'black_fold_cloth', name: '黒折りの包み布', kind: 'PASSIVE', attributeBias: ['DARK'], grantsBuffs: ['FOCUS'], resistsStatuses: ['ILLUMINATED'], cleansesStatuses: [], rule: 'DARK weaponの最初のhitだけstatus buildupを少し上げる。', tradeoff: '連打では伸びず、攻撃間隔を作るbuild向け。', storySeed: '隠すために包んだのか、守るために包んだのか分からない布。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'charred_wick', name: '焦げた長灯芯', kind: 'PASSIVE', attributeBias: ['FIRE'], grantsBuffs: ['WARMTH'], resistsStatuses: ['CHILL', 'FREEZE'], cleansesStatuses: [], rule: 'BURN durationを少し伸ばし、WARMTH中は凍結蓄積を抑える。', tradeoff: '瞬間damageは増えない。', storySeed: '燃え切らず残った芯。短く切るか、そのまま継ぐか迷った跡。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'dew_handkerchief', name: '朝露のハンカチ', kind: 'PASSIVE', attributeBias: ['WATER'], grantsBuffs: ['FLOW'], resistsStatuses: ['BURN'], cleansesStatuses: [], reactionAssist: 'arc_chain', rule: 'SOAK付与率を少し上げ、BURN durationを短縮。', tradeoff: 'THUNDER reactionを狙わないbuildでは火力貢献が低い。', storySeed: '朝になる前だけ冷たい布。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'wind_knot', name: '追い風結び', kind: 'PASSIVE', attributeBias: ['WIND'], grantsBuffs: ['TAILWIND'], resistsStatuses: ['DISORIENTED'], cleansesStatuses: [], rule: '一定距離を移動すると短いTAILWIND。停止連打で維持できない。', tradeoff: '立ち止まる防御buildでは効果が薄い。', storySeed: 'ほどけない結び方ではなく、走ると締まる結び方。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'copper_clip', name: '銅の留め具', kind: 'PASSIVE', attributeBias: ['THUNDER', 'METAL'], grantsBuffs: ['OVERCHARGE'], resistsStatuses: ['SHOCK'], cleansesStatuses: [], reactionAssist: 'metal_overload', rule: 'CONDUCTIVE対象への最初のTHUNDER hitだけchain効率を上げる。', tradeoff: 'chain上限自体は増やさない。', storySeed: '壊れた配線を一晩だけ持たせる留め具。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'wool_page_scarf', name: '頁織りの襟巻き', kind: 'PASSIVE', attributeBias: ['ICE'], grantsBuffs: ['WARMTH', 'FORTIFY'], resistsStatuses: ['CHILL', 'FREEZE'], cleansesStatuses: [], rule: '低HP時だけ凍結/冷え耐性と小FORTIFY。', tradeoff: '高HP維持中はほぼ働かない。', storySeed: '古い頁を細く裂いて織り込んだ襟巻き。文字はもう読めない。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'stone_sole', name: '石畳の靴底', kind: 'PASSIVE', attributeBias: ['EARTH'], grantsBuffs: ['FORTIFY'], resistsStatuses: ['DISORIENTED', 'ROOTED'], cleansesStatuses: [], rule: 'knockback/forced movementを軽減。完全無効にはしない。', tradeoff: '移動速度bonusは持たず、軽快buildとは競合。', storySeed: '歩いた場所の石粉が何層も残る靴底。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'tool_magnet', name: '工具箱の磁石', kind: 'PASSIVE', attributeBias: ['METAL'], grantsBuffs: ['REPAIR'], resistsStatuses: ['EXPOSED'], cleansesStatuses: [], rule: '設置物/returning toolの寿命を少し延長し、REPAIRを周期付与。', tradeoff: 'projectile数や直接damageは上げない。', storySeed: '失くしたネジだけはよく見つけてくれる。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'pressed_seed', name: '押花の種袋', kind: 'PASSIVE', attributeBias: ['BLOOM'], grantsBuffs: ['REPAIR'], resistsStatuses: ['ROOTED'], cleansesStatuses: [], reactionAssist: 'regrowth', rule: 'ROOTED敵撃破時に低確率で小回復。回復量と頻度に上限。', tradeoff: 'Boss単体戦では発動機会が少ない。', storySeed: '咲かなかった種も、袋の中ではまだ名前を持っている。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'dream_page_corner', name: '夢頁の折れ角', kind: 'PASSIVE', attributeBias: ['DREAM'], grantsBuffs: ['FLOW'], resistsStatuses: ['DROWSY', 'SLEEP'], cleansesStatuses: [], rule: 'DROWSY中のpenaltyを軽減し、解除後に短いFLOW。', tradeoff: '平常時の恩恵は小さい。', storySeed: '起きた直後に折ったページ。なぜ折ったかだけ思い出せない。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'old_name_tag', name: '擦れた名前札', kind: 'PASSIVE', attributeBias: ['MEMORY'], grantsBuffs: ['REMEMBER'], resistsStatuses: ['ERASED'], cleansesStatuses: [], reactionAssist: 'lucid_recall', rule: 'MARKEDの最大stackを増やさず、stackが切れるまでの猶予だけ少し伸ばす。', tradeoff: '瞬間burstには直結しない。', storySeed: '読めないのに捨てられない名前札。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'small_star_needle', name: '星留めの針', kind: 'PASSIVE', attributeBias: ['STAR'], grantsBuffs: ['STAR_GUIDE'], resistsStatuses: ['DISORIENTED'], cleansesStatuses: [], reactionAssist: 'beacon', rule: '遠距離hitが続くと短いSTAR_GUIDE。近距離では発動しない。', tradeoff: 'close-range buildでは枠効率が低い。', storySeed: '地図へ星を留めるためだけの小さな針。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'blank_patch', name: '白い当て布', kind: 'PASSIVE', attributeBias: ['BLANK'], grantsBuffs: ['DAWN_GUARD'], resistsStatuses: ['ERASED', 'SEALED'], cleansesStatuses: [], rule: 'Debuff durationを広く少し短縮。ただしhard controlを無効化しない。', tradeoff: '属性damage補正なし。', storySeed: '穴を隠す布ではなく、あとで何を縫うか決めるための当て布。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'repair_tape_roll', name: '継ぎ目テープ', kind: 'FIELD_ITEM', attributeBias: ['NEUTRAL', 'METAL'], grantsBuffs: ['REPAIR'], resistsStatuses: [], cleansesStatuses: ['EXPOSED'], rule: '拾うとEXPOSEDを一段だけ解除し、短時間REPAIR。', tradeoff: '複数Debuff一括解除はしない。', storySeed: '何でも直せるわけではない。でも今夜だけ持たせられる。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'warm_tea_flask', name: 'ぬるいお茶', kind: 'FIELD_ITEM', attributeBias: ['FIRE', 'WATER'], grantsBuffs: ['WARMTH'], resistsStatuses: [], cleansesStatuses: ['CHILL'], rule: 'CHILLを解除しWARMTH。FREEZE状態そのものを即解除する万能薬にはしない。', tradeoff: '回復量は小さく、主用途は状態対策。', storySeed: '誰かが少し前まで持っていた温度。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'lost_bell_charm', name: '迷子の鈴守り', kind: 'RARE_SUPPORT', attributeBias: ['MEMORY', 'STAR'], grantsBuffs: ['REMEMBER', 'STAR_GUIDE'], resistsStatuses: ['DISORIENTED'], cleansesStatuses: ['DROWSY'], rule: '一定時間に一度、方向/眠り系Debuffを一つだけ軽減し、MARKED対象へ照準補助。', tradeoff: '発動間隔が長く連続対策はできない。', storySeed: '呼ぶためではなく、帰る時に音を聞くための鈴。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
  { id: 'dawn_ticket_stub', name: '朝側の半券', kind: 'RARE_SUPPORT', attributeBias: ['LIGHT', 'BLANK'], grantsBuffs: ['DAWN_GUARD'], resistsStatuses: ['ECLIPSED', 'ERASED'], cleansesStatuses: ['ECLIPSED'], rule: 'run中一度だけ強いECLIPSEDを軽減し、その後はduration resistanceとして残る。', tradeoff: '一回性が強く、通常火力には寄与しない。', storySeed: '片道ではない切符の、朝側だけ残った半券。', runtimeStatus: 'CONTENT_SOURCE_ONLY' },
] as const;

export const combatItemEffectSummary = {
  candidateCount: combatItemEffectCandidates.length,
  passiveCount: combatItemEffectCandidates.filter((item) => item.kind === 'PASSIVE').length,
  fieldItemCount: combatItemEffectCandidates.filter((item) => item.kind === 'FIELD_ITEM').length,
  rareSupportCount: combatItemEffectCandidates.filter((item) => item.kind === 'RARE_SUPPORT').length,
  hasCounterplayForEveryStatusFamily: true,
  autoPromoteToRuntime: false,
} as const;
