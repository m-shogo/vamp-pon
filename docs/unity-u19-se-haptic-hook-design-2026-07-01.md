# Unity U19 SE / Haptic Hook Design

作成日: 2026-07-01

U19では音源や実端末hapticを完成させず、将来差し込むためのhook名と強弱だけを決める。

- `OnExpCollect`: 小さく明るいcollect。hapticなし、または極小。
- `OnLevelUpOpen`: 紙UIが開く柔らかい音。hapticなし。
- `OnLevelUpSelect`: 選択確定の短い紙音。軽いhaptic候補。
- `OnRareAppear`: 通常より少し重いslow感。hapticは短く。
- `OnEvolutionReady`: 低い灯りの立ち上がり。hapticなし。
- `OnEvolutionTrigger`: 合体確定の中程度pulse。
- `OnKokuyouReady`: ゲージ満タンの暗い灯り。軽いhaptic候補。
- `OnKokuyouActivate`: 黒耀化だけ少し重くする。
- `OnKokuyouEnd`: 反動の短い沈み込み。
- `OnHealingDropCollect`: 回復の小さい安心感。

今はlogだけでよい。AudioManager大改造、音源大量追加、実端末haptic実装済み扱いはしない。
