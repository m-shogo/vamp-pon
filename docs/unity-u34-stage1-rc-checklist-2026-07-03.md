# Unity U34 Stage1 RC Checklist

判定値: PASS / CAUTION / BLOCKED / NOT_MEASURED / NOT_APPLICABLE。U34ではRC合格扱いにしない。

| # | item | pass criteria | current status | evidence | status | owner/future phase | next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Runtime loop | Stage1 clear/defeat/result loop works | U25接続済み | U25 screenshots / checker | PASS | U38 | regression monitor |
| 2 | Battle feel | device inputで気持ちよい | Editor proof中心 | U25/U31 | CAUTION | U37 | device tuning |
| 3 | First 30 seconds | 初回で寂しくない | U33 hardening済み | U33 review | CAUTION | U37 | device feel確認 |
| 4 | 8min timeline | 8分縦スラが破綻しない | Editor設計済み | U33 timeline | CAUTION | U37 | clear rate測定 |
| 5 | XP / LevelUp cadence | Lv2/3/4 cadenceが安定 | U33 hardening済み | U33 XP review | CAUTION | U37 | distribution測定 |
| 6 | Enemy wave / damage | 密度と接触damageが理不尽でない | Editor調整済み | U33 wave review | CAUTION | U37 | device playtest |
| 7 | Drop / pickup / heal | pickup feelが良い | Editor調整済み | U33 pickup review | CAUTION | U37 | touch回収率測定 |
| 8 | Weapon / passive / evolution | buildが見える | Editor調整済み | U33 evolution review | CAUTION | U40 | final assets後確認 |
| 9 | Kokuyou / Rare | 特別感と到達性 | Editor到達性改善 | U33 verdict | CAUTION | U37 | device performance確認 |
| 10 | Result / Reward / Unlock | 報酬が読める、進行が保存される | reward economy draft | U27/U33 | BLOCKED | U41 | economy hardening |
| 11 | StageSelect / Retry | retry導線が自然 | Editor evidence | U27/U31 | CAUTION | U37 | device restart/retry |
| 12 | Save safety | restart persistence confirmed | 実機未測定 | U35 not measured | NOT_MEASURED | U37 | device restart test |
| 13 | Audio / haptic | final SE / device haptic approved | draft SE / haptic未測定 | U28/U35 | BLOCKED | U39 | final SE / AudioMixer |
| 14 | Sprite Atlas / texture | atlas packing complete | U36 complete | U36 JSON | PASS | U38 | draw calls確認 |
| 15 | Runtime asset boundary | generated混入なし | U32/U36 guard済み | boundary JSON | PASS | U38 | keep checker |
| 16 | 390x844 readability | mobile viewportで可読 | Editor evidence | U31/U35/U36 | CAUTION | U37 | actual device screenshot |
| 17 | Mobile metrics | FPS/memory/thermal等測定済み | NOT_MEASURED | U35 verdict | NOT_MEASURED | U37 | collect metrics |
| 18 | Performance budget | deviceでbudget内 | NOT_MEASURED | U29/U35 | NOT_MEASURED | U37 | profiler pass |
| 19 | Production asset replacement | final assets approved | assetReplacementReady=false | U36 re-eval | BLOCKED | U40 | final replacement pass |
| 20 | Regression verification | U22-U36 checks pass | pass | checker logs | PASS | U38 | continue checks |
| 21 | Release notes / known issues | known issues ready | not yet | U34 plan | BLOCKED | U42 | release notes pass |
