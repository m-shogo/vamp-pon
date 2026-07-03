# Unity U33 Stage1 8min Timeline

U33はEditor 390x844向けのbalance hardeningであり、本番8分balance確定ではない。

| 時間 | 役割 | spawn cadence | enemy cap | enemy bucket | expected level | pickup count | reward direction |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0:00〜0:30 | 導入。敵は少なすぎず理不尽に囲まれない | 2.45s / pack1 | 8 | opening | Lv1〜Lv2 | 4〜7 | 初回Lv2導線 |
| 0:30〜2:00 | 初回成長。Lv2〜Lv3が見える | 2.0s / pack2 | 13 | first_levelup_pressure | Lv2〜Lv4 | 10〜24 | weapon/passive選択 |
| 2:00〜4:00 | 選択の意味。複数武器/パッシブが揃う | 1.75s / pack2 | 20 | multi_choice_pressure | Lv4〜Lv5 | 28〜54 | build方向が見える |
| 4:00〜6:00 | 中盤圧。密度上昇だが読みやすい | 1.4s / pack3 | 27 | wave_intensity | Lv5〜Lv6 | 58〜90 | Evolution準備 |
| 6:00〜7:30 | climax準備。Rare / Evolution / Kokuyou検証 | 1.15s / pack3 | 34 | kokuyou_ready | Lv6〜Lv7 | 92〜130 | Kokuyou / Rare到達 |
| 7:30〜8:00 | clear push。勝利に向けて盛り上げる | 0.95s / pack4 | 38 | clear_push | Lv7〜Lv8 | 132〜150 | clear reward draft |

## Enemy bucket table

- opening: low HP / low speed / contact 5。
- first_levelup_pressure: low HP中心 / contact 6。
- multi_choice_pressure: low-mid HP混在 / contact 7。
- wave_intensity: mid HP中心 / contact 8。
- kokuyou_ready: mid density / contact 9.5。
- clear_push: cap 38、contact 12。U29 runtime capと矛盾しない。

## Climax reachability note

Kokuyouは330s以降、Evolutionは195s以降にテスト可能にする。Stage1は簡単でよく、難しくするより「気持ちいい初回クリア」を優先する。
