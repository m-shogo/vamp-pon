# Unity U41 U34 / U40 Gate Addendum

## U34 blocker / cautionへの影響

`rc-block-economy`と`rc-caution-economy`は、U41でdraft proofからRC candidate economyへ改善した。Result / Reward / Unlock / Retryの読みやすさ、duplicate guard、first clear bonus、defeat participation rewardを整理した。

## reward / unlock economy draftの改善

- rewardReadyForRc=true。
- unlockReadyForRc=true。
- saveEconomySafe=true。
- Stage2 placeholder unlockはplaceholderのまま明記。

## U40 assetReplacementReadyへの影響

U40 assetReplacementReady=trueは維持。U41はasset boundaryを変更しない。

## flags

- rcReady=false。
- productionApproved=false。
- economyReadyForRc=true。
- mobileMetricsReady=false。
- audioMixerReady=false。

## U37 / U38へ送る項目

U37: mobile metrics後のreward / rank / retry導線調整。U38: production approval re-checkと本番経済判断。
