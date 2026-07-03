# Unity U35 Mobile Metrics Scenarios

U35 scenarioは実機metrics pass用の測定導線であり、Editor evidenceだけではmobile measured扱いにしない。

| # | scenario | expected behavior | metric to collect | pass threshold draft | caution threshold draft | fail threshold draft | evidence | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | app launch / StageSelect idle | StageSelectが読める | FPS, memory, touch | avg 60 / min 45 | min 30〜44 | min 30未満 | screenshot/video/log | launch timeは別pass |
| 2 | Stage1 start | start後に入力可能 | frame time, audio | no freeze | small hitch | freeze/crash | screen recording | BattleStart SEはdraft |
| 3 | first 30 seconds | 敵が少なすぎず囲まれない | FPS, touch, enemies | min 45+ | min 30+ | crash/min<30 | video/metrics json | U33 opening cap 8 |
| 4 | first LevelUp | UIが読める | touch, frame time | card tap reliable | tap miss occasional | unreadable/unresponsive | screenshot/video | 390x844 |
| 5 | 2:00 wave | Lv3〜Lv4が見える | enemies, pickups, FPS | avg 60 | avg 45〜59 | avg<45 | metrics json | cap 20 |
| 6 | 4:00 wave | 中盤圧が読める | FPS, memory, draw calls | min 45+ | min 30〜44 | min<30 | metrics json | cap 27 |
| 7 | 6:00 climax準備 | Rare/Evolution/Kokuyou準備 | FPS, audio voices | stable | minor dips | repeated stalls | video/log | cap 34 |
| 8 | Kokuyou ready / activation / active | 特別感と操作継続 | FPS, haptic, audio | no long hitch | short hitch | crash/input loss | video/haptic note | hapticは実機のみ |
| 9 | Evolution moment | 合体演出が読める | frame time, draw calls | no blocking hitch | brief hitch | screen clutter/freeze | screenshot/video | final effect not approved |
| 10 | Rare / reward moment | 通常報酬と差がある | audio, frame time | no clipping | possible clipping | clipping confirmed | video/audio note | 本番SE未確定 |
| 11 | 7:30 clear push | 敵密度が破綻しない | enemies, FPS, memory | cap 38 stable | min 30〜44 | cap overflow/crash | metrics json | U29 cap 38 |
| 12 | Result clear | resultが読める | touch, memory | readable | dense | unreadable | screenshot | reward economy draft |
| 13 | Result reward / unlock | 報酬が読める | save, touch | no freeze | delay | lost progress | video/log | Cloud Saveなし |
| 14 | StageSelect after clear | stamp反映 | save, readability | updated | delayed | missing | screenshot | restartは別scenario |
| 15 | Retry | 再戦で状態が崩れない | memory, counts | counts reset | minor residue | crash/leak | video/log | pool cleanup |
| 16 | save persistence after restart | 再起動後もprogress維持 | persistence | persisted | unclear | lost | device restart evidence | U35未実測ならNOT_MEASURED |
| 17 | audio stress: pickup / hit連打 | うるさすぎず割れない | voices, clipping | no clipping | dense | clipping | video/audio note | voices cap 8 |
| 18 | haptic check | 過剰でない | event count, feel | comfortable | strong | excessive/missing | tester note | device only |
| 19 | thermal / sustained play | 継続で熱暴走しない | thermal, battery | no warning | warm | throttle/warning | device metrics | sustained run |
| 20 | 390x844 readability | HUDが邪魔しない | screenshot | readable | tight | overlap | screenshots | Editor evidence allowed |
