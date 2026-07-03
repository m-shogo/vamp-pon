# Unity U35 Stage1 Runtime Pressure Summary

## Budget / Cap

- enemy cap: 38
- pickup cap: 48
- projectile cap: 24
- hit effect cap: 16
- particles cap: 64
- audio voice cap: 8 total / low priority 4
- haptic cooldown: light 0.08s, damage 0.25s, Kokuyou activation 1.0s

## U33 tuningとの整合

- 2:00: enemy cap 20。実測はNOT_MEASURED。
- 4:00: enemy cap 27。実測はNOT_MEASURED。
- 6:00: enemy cap 34、Kokuyou ready test領域。実測はNOT_MEASURED。
- 7:30: clear push cap 38。U29 enemy capと一致。

## Kokuyou / Evolution中の負荷

Kokuyou / Evolutionは低優先hit effectをskipし、climax effect slotsを優先する方針。実機draw calls、thermal、GC、audio latency、hapticはNOT_MEASURED。

## 予想と実測の分離

このsummaryはU29 budgetとU33 tuningからのpressure整理であり、mobile実測ではない。Editor evidenceはEDITOR_ONLY。実機値はU35 device reportにだけ記録する。

## U36 Sprite Atlasへの影響

Sprite Atlas production packing未完のため、draw calls / batchesはU36で改善余地が残る。U35ではcompletion扱いにしない。
