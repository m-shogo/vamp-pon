# Unity U42 Stage1 QA Handoff Checklist

すべて実機QAで確認する。Editor screenshotは参考証跡であり、mobile metrics測定済みにはしない。

| item | pass criteria | caution criteria | fail criteria | evidence required | screenshot/video/log required |
| --- | --- | --- | --- | --- | --- |
| app launch | cold launchしてStageSelectまで到達 | 初回だけ軽い遅延 | crash / black screen | device, OS, build, launch time note | video + log |
| StageSelect idle | 390x844相当で文字と導線が読める | 小さいが操作可能 | text overlap / wrong unlock | screenshot | screenshot |
| Stage1 start | tapでStage1へ遷移 | 反応が遅い | tap無反応 / wrong scene | touch note | video |
| first 30 seconds | 敵、pickup、攻撃が見える | 密度が薄い/濃い | 操作不能 / unreadable | FPS note, touch note | video + log |
| first LevelUp | cardが読めて選べる | touch targetが狭い | 選択不能 / text overlap | selected card | screenshot/video |
| 2:00 wave | densityが処理可能 | stutter / crowding | freeze / impossible damage | FPS / thermal note | video + log |
| 4:00 wave | 中盤pressureが成立 | pickupしにくい | runaway damage | FPS / memory note | video + log |
| 6:00 climax | climaxが読める | visual/audioが過密 | crash / unreadable | FPS / audio note | video |
| Kokuyou | activationとendingが分かる | SE / hapticが強い | effectで操作不能 | timing note | video + audio |
| Evolution | evolution到達と効果が分かる | 音割れ/表示過密 | 発生しない/壊れる | build state | video |
| Rare | rare取得が分かる | 見落としやすい | reward反映なし | pickup note | video/screenshot |
| Result clear | rank/reward/unlockが読める | 情報量が多い | reward不整合 / button不可 | result values | screenshot |
| Result defeat | participation rewardとretryが自然 | retry圧が強い | reward 0誤表示 / button不可 | result values | screenshot |
| Reward / Unlock | duplicate unlockが出ない | Stage2 placeholderが気になる | duplicate / wrong unlock | unlock ids | screenshot/log |
| StageSelect after run | last result / progressが残る | 表示更新が遅い | progress消失 | saved progress | screenshot |
| Retry | save保持で再開始 | transitionが遅い | crash / progress reset | attempt count | video/log |
| Save persistence after restart | restart後にbest / unlockが残る | 反映が一部遅い | progress消失 / corrupted | before/after values | screenshots + log |
| Audio clipping | speakerで破綻しない | Kokuyou/Evolutionが少し強い | clipping / crackle | device volume | video/audio |
| Audio latency | input / pickup feedbackが遅くない | 少し遅延 | 明確な遅延 | latency note | video/audio |
| Haptic behavior | 過不足なく鳴る | device差が大きい | 鳴らない/強すぎる | device haptic setting | video/note |
| Touch responsiveness | movement / buttonが即応 | occasional miss | repeated miss / stuck | touch scenario | video |
| FPS | target budget内 | temporary dips | sustained low FPS | profiler / FPS log | log |
| Memory | budget内で増え続けない | gradual rise | OOM / crash risk | memory log | log |
| Thermal | sustained runで許容 | warm caution | thermal throttling | thermal note | log/note |
| Battery | 異常消費なし | high drain caution | unacceptable drain | battery before/after | note |
| Crash / freeze | no crash/freeze | recoverable hiccup | crash/freeze | reproduction steps | log + video |
