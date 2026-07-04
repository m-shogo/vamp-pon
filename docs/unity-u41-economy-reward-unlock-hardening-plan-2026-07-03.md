# Unity U41 Economy / Reward / Unlock Hardening Plan

## U41でやること

- U27 reward / unlock / save draftとU33 result/retry reviewを再確認し、Stage1 RC candidate economyとして整理する。
- clear reward、defeat participation reward、first clear bonus、best updated、rank、unlock、reward display、retry motivationをhardeningする。
- U27 repository境界を守り、first clear bonus二重取り防止、attempts / clears / best / lastResult / unlock id重複を確認する。
- U34のreward economy blocker / cautionへ、U41の改善結果をaddendumとして渡す。

## U41でやらないこと

- productionApproved=true / productionApproved=1にしない。
- rcReady=trueにしない。
- 本番経済バランス確定扱いをしない。
- 課金経済や複雑な通貨設計を入れない。
- Cloud Save、Addressables、Stage2本体、Collection本実装、新規コンテンツ大量追加を導入しない。
- generated final画像や`docs/design-targets/generated`をruntime参照しない。

## approval flags

productionApproved=false、rcReady=falseを維持する。U41はRC candidate economy hardeningであり、production approvalではない。

## 本番経済確定ではないこと

U41の報酬値、rank、unlock表示は「Stage1 playable vertical sliceが破綻しない」ためのcandidateであり、本番経済ではない。mobile実機metrics、retention、clear率、retry率を見てU37 / U38で再判定する。

## Cloud Save / Stage2

Cloud Saveは導入しない。Stage2 placeholder unlockはResult / StageSelectの表示だけを整理し、Stage2本体は作らない。

## U34 RC blocker / cautionへの影響

reward economy draft blockerはU41でRC candidateへ改善する。ただしmobile metrics、AudioMixer、haptic、production balance、production approvalが残るためrcReady=false。

## U37 / U38へ渡す項目

- U37: device metrics後のreward amount / rank / retry導線の最終調整。
- U38: production approval re-checkで本番経済、known issues、release readinessを再判定。
