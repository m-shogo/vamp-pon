# Unity U35 Mobile Metrics Thresholds

Thresholdはdraft。390x844縦画面、60fps目標、30fps下限、low/mid device想定。実測後にU34 release candidate checklistへ反映する。

| metric | pass draft | caution draft | fail draft |
| --- | --- | --- | --- |
| FPS average | 55〜60fps以上 | 45〜54fps | 45fps未満 |
| FPS min | 45fps以上 | 30〜44fps | 30fps未満 |
| frame time | avg 18ms以下 | 18〜33ms | 33ms超が継続 |
| memory | budget内で安定 | 増加傾向 | crash / OS kill |
| peak memory | device余裕あり | warning近い | OS memory warning |
| GC allocation | minute単位で低い | spikeあり | repeated spike |
| draw calls | U29 draft 45付近以下 | 46〜60 | 60超が継続 |
| batches | stable | increased | unstable spike |
| thermal | nominal | warm / elevated | throttle / warning |
| crash | none | recoverable hitch | crash / freeze |
| audio clipping | none | suspected | confirmed |
| audio latency | playable | noticeable | delayed enough to hurt feedback |
| haptic excessive | comfortable | strong | excessive / missing |
| touch latency | responsive | occasional delay | missed/late input |
| save persistence | persisted | unclear | lost progress |
| retry stability | clean retry | minor residue | crash / stale state |

## Notes

本番SE、本番balance、経済バランスは確定しない。Sprite Atlas production packing completionはU36へ残す。
