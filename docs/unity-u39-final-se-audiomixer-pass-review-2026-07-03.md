# Unity U39 Final SE / AudioMixer Pass Review

## 変更概要

U39として、Stage1向けfinal-candidate SE、AudioMixer routing draft、clipping / polyphony / cooldown guard、audio readiness verdict、U34 gate addendumを追加した。productionApproved=false、rcReady=falseのまま。

## SE inventory

`docs/unity-u39-se-inventory-status-2026-07-03.md`に22個のSEを棚卸しした。全て`finalCandidate`で、U28 draftをfinal approved扱いしていない。

## finalCandidate SE生成 / normalization

`scripts/audio/generate-u39-final-candidate-se.mjs`でrepo内生成したoriginal wavを`unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/`へ出力した。外部素材、著作権素材、Web downloadは使っていない。`se-normalization-report.json`でduration、peak estimate、click/pop guard、clipping riskを記録した。

## AudioMixer draft / routing

Unity `.mixer` assetはU39では作成していない。理由は本番mixとdevice speaker reviewが未完で、`.mixer`を作って確定扱いに見せるriskがあるため。代わりに`U39AudioMixerRoutingMap`と`audio-mixer-routing-map.json`でMaster / UI / Battle / Pickup / Climax / Result / StageSelectのrouting draftを定義した。missing mixer fallbackとfuture user settings hookを持つため、Editorでmixer未接続でも落ちない。AudioMixerReady=false、routingDraftReady=true。

## clipping / polyphony / cooldown guard

`U39AudioClippingGuard`でU29のmax active voices 8、low priority voices 4を維持した。low priority連打はguardされ、pickup / hit / defeat / damage / card / climax / result / unlockのcooldown方針を`audio-polyphony-cooldown-map.json`へ記録した。

## runtime接続更新

`U39Stage1AudioReadinessConnector`で既存U28 event idを変えず、U39 final-candidate clip rootとrouting draftへ接続確認できるようにした。gameplay state、Stage1 loop、save、reward、unlock、balanceは変更していない。

## audio readiness verdict

- audioReadyForRc: false
- finalSeReady: true
- audioMixerReady: false
- audioLatencyMeasured: false
- hapticMeasured: false
- rcReady: false
- productionApproved: false

finalCandidate SEとAudioMixer routing draftは追加済み。ただし実機audio latency、device speaker clipping、haptic device behaviorがNOT_MEASUREDなのでRC完全passにはしない。

## U34 gate addendum

U34のfinal SE / AudioMixer blockerは軽減したが解除しない。audio latency、haptic、mobile metrics、assetReplacementReady、productionApprovedは残る。

## safety

generated final画像をruntimeへ貼っていない。`docs/design-targets/generated` runtime参照なし。Addressables未導入。Cloud Save未導入。経済バランス未確定。mobile metrics NOT_MEASURED。本番SE最終承認は未実施。

## 実行したcheck一覧

U39 checker、U34、U36、U35、U33、U32、U31、U30、U29、U28、U27、U26、U25、U24、U23、U22、Unity meta、Unity Editor verification一式を実行した。

## 残リスク

スマホ実機でのspeaker clipping、audio latency、haptic intensity、thermal、実機スピーカーの聞き分け、Kokuyou / Evolutionの過大音量。

## 次に残る作業

U40 final production asset replacement pass、実機測定、U37 final mobile tuning after device metrics、U38 production approval re-check。
