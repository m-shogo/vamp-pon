# U48 Batch B Human Review Ready 2026-07-16

## 判定

U48 Batch Bのground-area三種と黒耀化四phaseは、候補選定の人間レビュー直前まで到達した。

```txt
batchBGroundAreaKokuyouApprovalReady=true
humanReviewStatus=pending
approvedAsFinal=false
runtimeApproved=false
humanApprovedCandidateId=null
productionAssetApprovalPackReady=false
runtimeVisualReady=false
U48=IN_PROGRESS_BLOCKED
```

このcheckpointはproduction承認、production provider接続、U48完了を意味しない。

## Runtime capture

- 7 asset groups / 28 candidates / 各group 4候補
- candidateごとにprocess terminate、verification reinitialize、StartStage commandを実行
- full HP `110/110`、production capacity `weapon=5 / passive=5`、初期weapon `night_pencil`をassert
- Standard 392、Compact 28、Large 28、合計448 live render
- high-density 28
- Standard画像のviewport resize流用0
- Result遷移0、revival発動0、exception 0、assertion failure 0、cleanup failure 0
- Preview build限定。`RuntimeVisualAssetProvider`は未変更

黒耀化はruntime正本のthreshold 100を正規damage APIで`25 + 25 + 25 + 25`に分割した。HPは`110 -> 85 -> 60 -> 35 -> 10`、gaugeは`0 -> 25 -> 50 -> 75 -> 100`。`Idle -> Charging -> Ready -> Activating -> Active -> Ending -> Recovery -> Idle`をmanual activation commandで通過し、direct state/HP mutationと`dawn_ticket`は使用していない。

通常battleの自動enemy spawn、EXP collection、LevelUpだけはbattle pauseで抑制し、その直後に`Stage1GameplayRuntimeCoordinator`を再開した。GroundArea executor、Kokuyou controller、AppFlow Playing、preview presenter、capture coroutineは維持した。

## Runtime contract

| Definition | Radius | DPS | Interval | Final ticks | Duration |
| --- | ---: | ---: | ---: | ---: | ---: |
| `black_ink_bottle` | 0.52 | 8 | 0.25秒 | 9 | 2.3秒 |
| `streetlamp_ring` | 0.64 | 6 | 0.25秒 | 13 | 3.2秒 |
| `dawn_ink_lamp` | 1.28 | 28 | 0.25秒 | 25 | 6.5秒 |

黒耀化はthreshold 100、damage倍率1.5、active 8秒、recovery移動倍率0.75、recovery 2秒を維持した。全448 captureで`gameplayContractUnchanged=true`。

## AI recommendation（承認ではない）

| Group | AI recommendation |
| --- | --- |
| black ink | `ground-area-black-ink-bottle-c-breathing-ink-edge` |
| streetlamp | `ground-area-streetlamp-ring-d-ink-shadow-warm-light` |
| dawn ink lamp | `ground-area-dawn-ink-lamp-d-lamp-wide-dawn-ring` |
| charging | `kokuyou-charging-b-small-ink-wisps` |
| ready | `kokuyou-ready-b-complete-dark-ring` |
| active | `kokuyou-active-b-controlled-black-flame` |
| recovery | `kokuyou-recovery-b-fading-soot` |

人間は7 contact sheetと4 system phase sheetを確認し、候補IDを明示的に選ぶ必要がある。

## Evidence

- `docs/design-targets/generated/unity-u48/batch-b/capture-manifest.json`
- `docs/design-targets/generated/unity-u48/batch-b/verification-summary.json`
- `docs/design-targets/generated/unity-u48/batch-b/ai-recommendations.json`
- `docs/design-targets/generated/unity-u48/batch-b/contact-sheets/`
- `docs/design-targets/generated/unity-u48/batch-b/phase-sequences/`
- `docs/design-targets/generated/unity-u48/readiness.json`

## Remaining blockers

- Batch Bのhuman candidate approval
- approved candidateのproduction provider接続とproduction runtime再検証
- Batch C UI candidate-specific live preview
- physical-device visual/performance review
- U49 audio/haptic、U50 performance、U51 RC
