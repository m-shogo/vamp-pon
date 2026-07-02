# Unity U28 SE / Haptic / Feel Integration Plan

## U28でやること

- Stage1 playable vertical sliceにdraft SE、audio event routing、haptic routing、feel verificationを追加する。
- U22 Battle feedback、U23 Result / StageSelect UI、U24 Climax hook、U25 runtime feedback facade、U26 balance draft、U27 Result / StageSelect / Retry connectionを壊さず、adapter層からaudio + haptic pairingを接続する。
- repo内で再生成可能なoriginal placeholder / draft SEを追加する。
- 390x844確認画像、audio-event-map、haptic-event-map、se-asset-listを生成する。

## U28でやらないこと

- production approvalへの昇格。
- 本番SE確定。
- 外部著作権素材やWeb上のフリー素材の導入。
- Addressables本導入。
- AudioMixerの本番確定。
- iOS / Android haptic実装の完成扱い。
- settings UIの作り込み。

## draft SE方針

追加するSEはすべてこのrepo内scriptで生成するoriginal placeholder / draft SEとして扱う。紙、インク、小さな灯り、柔らかいhit、暗いが割れないclimax感を目標にするが、本番採用音源ではない。

## productionApproved

U28はfeel integration proofであり、productionApproved=0のまま進める。実機確認、正式SE、正式AudioMixer、正式platform haptic、performance / mobile FPS、production approval gateは未完了。

## haptic方針

Editorではsafe no-op。iOS / Androidは将来adapter差し替え前提のplaceholderに留める。実機確認できない場合は未確認としてreviewに明記する。連打hapticを避けるためcooldownを持つ。

## U22〜U27との接続方針

- U22: hit / pickup / damageなどBattle feedback eventへmappingする。
- U23: Result / StageSelectのreward、unlock、lantern、route eventへmappingする。
- U24: rare / evolution / Kokuyou hook名をU28 event registryへmappingする。
- U25: `U25Stage1FeedbackHooks`のevent名をadapterで受け取り、runtime stateは変更しない。
- U26: balance valuesは変更せず、first playableのfeel eventだけ検証する。
- U27: Result / StageSelect / Retry modelからresult_open、result_stamp、reward_card、unlock_reveal、stage_select_lantern、retry_confirmを鳴らせるようにする。

## U29に残すこと

- Sprite Atlas / performance / mobile実機FPS。
- AudioMixer本番設計、clip compression、platform別latency確認。
- iOS / Android haptic実機確認。
- production approval gate前の音量・連打・アクセシビリティ調整。
