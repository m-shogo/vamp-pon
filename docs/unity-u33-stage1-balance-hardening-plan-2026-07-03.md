# Unity U33 Stage1 Balance Hardening Plan

## U33でやること

- U26 / U31 tuningを引き継ぎ、Stage1 8分縦スラのfirst 30 seconds、XP / LevelUp、enemy wave / damage、drop / pickup / heal、weapon / passive / evolution、Kokuyou / Rare、Result / Reward / Retryを軽く硬化する。
- Editor 390x844 evidenceとJSON記録を追加する。
- U30 / U31 / U32 gateにbalance hardening addendumを足す。

## U33でやらないこと

- productionApproved=falseのまま進める。production approvalをtrueにしない。
- 本番balance未確定。本番SE未確定。経済バランス確定扱いにしない。
- mobile実機metrics未測定のまま扱う。
- generated final画像や参照PNGをruntimeへ直貼りしない。
- docs/design-targets/generatedをruntime参照しない。
- Addressables、Cloud Save、Stage2作り込み、新キャラ、新武器大量追加はしない。

## U26 / U31 tuningから引き継ぐ内容

- StageClearSeconds 480、ChoiceCount 3、PlayerMaxHp 100、PlayerMoveSpeed 4.4、clear / defeat / result draft構造は維持。
- U31のPickupRadius 1.75、BasicWeaponCooldownMs 900、opening wave 2.6s/max7、first pressure 2.1s/max12をU33のbefore値として扱う。
- U29 max active enemies 38、pickups 48、projectiles 24、audio voices 8を超えない。

## U33で調整する対象

- PickupRadius 1.8、XpDropChance 0.9、RecoveryDropChance 0.04、RareDropDraftChance 0.04。
- BasicWeaponCooldownMs 880、BasicWeaponDamage 13。
- XP thresholdを少し浅くし、30〜45秒以内のLv2、2分前後のLv3〜Lv4、3〜4分の方向性を見えやすくする。
- opening / first pressure / mid / climax準備のspawn intervalとcapを小幅に前倒しする。
- KokuyouReadySeconds 330、EvolutionEarliestSeconds 195にしてテスト到達性を上げる。

## U33で調整しない対象

- PlayerMaxHp、move speed、StageClearSeconds、ChoiceCount、Kokuyou duration / cooldown、clear / defeat条件、reward draft式。
- U28 audio / haptic routing、U29 runtime cap、U30 gate、U32 asset boundary。

## U35 mobile device metrics passへ渡す項目

- FPS、memory、thermal、GC allocation、draw call、audio latency、haptic device behavior。
- 30〜45秒Lv2到達率、2分Lv3〜Lv4率、8分clear率、defeat理由、pickup回収率、Kokuyou / Rare / Evolution到達率。

## U34 release candidate checklistへ渡す項目

- productionApproved=false解除条件。
- Sprite Atlas production packing completion。
- final SE承認、reward economy承認、mobile実機metrics pass、assetReplacementReady再判定。
