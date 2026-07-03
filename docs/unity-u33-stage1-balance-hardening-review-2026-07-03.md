# Unity U33 Stage1 Balance Hardening Review

## 変更概要

U33としてStage1 8分縦スラのbalance hardeningを追加した。productionApproved=falseのまま、Editor 390x844 evidenceとcheckerを追加し、本番balance未確定、mobile実機metrics未測定として扱う。

## Balance baseline audit

`docs/unity-u33-stage1-balance-baseline-audit-2026-07-03.md`に現在値、体験意図、問題候補、U33変更候補、U35確認項目を記録した。

## Stage1 8min timeline

0:00〜0:30導入、0:30〜2:00初回成長、2:00〜4:00選択、4:00〜6:00中盤圧、6:00〜7:30climax準備、7:30〜8:00clear pushとして整理した。

## First 30 Seconds Hardening

opening waveを2.45s/max8、first pressureを2.0s/max13、PickupRadiusを1.8、BasicWeaponCooldownMsを880、BasicWeaponDamageを13にした。

## XP / LevelUp cadence

XP thresholdを`0/7/18/34/56/84/120/162`に浅くし、XP drop chanceを0.9にした。30〜45秒Lv2、2分Lv3〜Lv4、Lv5までの選択頻度を改善する狙い。

## Enemy wave / damage

2〜6分のspawn intervalとcapを少し前倒しし、中盤以降のcontact damageを8 / 9.5へ少し丸めた。clear push cap 38は維持。

## Drop / pickup / heal

XP pickupは少し出やすくし、healは0.04へ抑えた。Rareは0.04へ上げた。heal pickupは吸い寄せ無効方針を維持。

## Weapon / passive / evolution

初期攻撃感を軽く上げ、EvolutionEarliestSecondsを195へ前倒しした。新武器大量追加やStage2作り込みはしていない。

## Kokuyou / Rare

KokuyouReadySecondsを330へ前倒しし、RareDropDraftChanceを0.04にした。hapticは実機未確認なのでNOT_MEASURED。

## Result / Reward / Retry

U27 reward draftとretry導線を維持した。経済バランス確定扱いにしない。

## Changed constants / tuning actions

`docs/design-targets/generated/unity-u33/stage1-balance-before-after.json`と`stage1-tuning-actions.json`にbefore / after / reason / expected impact / risk / next measurement needed / related gate / related fileを記録した。

## 390x844 evidence

`docs/design-targets/generated/unity-u33/screenshots/`に10枚のEditor-style evidenceを追加した。screenshotはevidenceであり、generated final画像をruntimeへ貼っていない。

## Gate addendum / verdict

balanceHardeningReady: true。U30 / U31 / U32 gateのcritical blockerは解除しない。productionApproved=false、assetReplacementReady=false、mobileMetricsReady=false。

## Boundary

docs/design-targets/generated runtime参照なし。Addressables未導入。Cloud Save未導入。本番SE未確定。本番balance未確定。mobile実機metrics未測定。

## 実行したcheck一覧

U33 checker、U32〜U22 checker、unity:meta:check、git diff --check、既存Unity verification一式を実行対象にする。

## 残リスク

実機FPS、memory、thermal、draw call、GC、audio latency、haptic、restart persistence、Sprite Atlas production packing、final SE、reward economy、本番balance。

## 次に残る作業

U35 mobile device metrics pass、U34 release candidate checklist、U36 Sprite Atlas production packing completion。
