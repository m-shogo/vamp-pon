# Unity U42 Release Notes / Known Issues Plan

## U42でやること

U25〜U41で作ったStage1 playable vertical sliceを、internal preview / 実機QA / RC再判定へ渡すための参照セットとして整理する。release notes、known issues、QA handoff、remaining blocker、roadmap、readiness summary、U34/U35/U39/U40/U41 addendum、generated evidenceを作る。

## U42でやらないこと

- production approvalはしない。
- rcReady=trueにはしない。
- productionApproved=1にはしない。
- mobile metrics、audio latency、haptic実機挙動を測定済みにしない。
- AudioMixer未確定を無視しない。
- 本番balance確定、本番経済確定とは書かない。
- Cloud Save、Addressables、大きな新機能、Stage2本実装は入れない。
- generated final画像や参照PNGをruntimeへ直貼りしない。
- `docs/design-targets/generated` をruntime参照しない。

## approval / RC stance

U42はinternal preview / QA handoff用の文書passであり、正式リリースノートではない。`productionApproved=false`、`rcReady=false`のまま進める。known issuesを隠さず、未測定項目はNOT_MEASUREDとして扱う。

## 渡す項目

- U37: 実機metrics取得後のfinal mobile tuning。
- U39後続: AudioMixer final / device speaker pass / audio latency確認。
- Haptic device pass: iOS / Android端末で強度、cooldown、過不足を確認。
- U38: unresolved blockerを反映したproduction approval re-check。
- Final release notes refresh: 実機測定とapproval再判定後に更新。
