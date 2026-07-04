# Unity U41 Economy Reward Unlock Hardening Review

## 変更概要

U41としてeconomy baseline audit、reward constants hardening、rank draft hardening、unlock draft hardening、Result reward display hardening、retry motivation hardening、save / economy safety、economy readiness verdict、U34/U40 gate addendumを追加した。

## economy baseline audit

U27 draftのclear、defeat、first clear、time、kill、collected、level、rare、evolution、Kokuyou、rank、best updated、unlock、reward card、StageSelect stampを再確認した。

## reward constants hardening

clear reward 12、defeat reward 4、first clear bonus 10、rare memory 4、evolution memory 5、max fragment cap 36、minimum fragment 4をRC candidateとして定義した。本番経済未確定。

## rank draft hardening

S/A/B/C/Dのcriteria、rank reason、rank reward bandを追加した。Sは狙い要素、A/Bは初回Stage1でも嬉しい範囲、defeatはC/Dで進捗感を出す。

## unlock draft hardening

Stage2 placeholder、first clear knowledge placeholder、reward card placeholder、evolution collection placeholder、rare memory placeholderをpriority / duplicate guard付きで整理した。Stage2本体やCollection本実装は作っていない。

## Result reward display hardening

rank seal、reward cards、bonus breakdown、new unlocks、best updated stamp、retry / stage select buttonの表示順とmax displayed reward cardsを整理した。

## retry motivation hardening

Defeat後もparticipation rewardとnext rank hintを出し、clear後はbest updateやrank chaseを軽く見せる。押し付けやガチャ圧は避ける。

## save / economy safety

first clear bonus二重取り防止、attempts / clears、best値、lastResult、unlocked id duplicate guard、corrupted data fallback、reset debug safetyを確認した。Cloud Save未導入。

## economy readiness verdict

- economyReadyForRc: true
- rewardReadyForRc: true
- unlockReadyForRc: true
- saveEconomySafe: true
- rcReady: false
- productionApproved: false

## U34/U40 gate addendum

U34のreward economy blockerはRC candidateまで改善。U40 assetReplacementReady=trueには影響なし。

## safety

本番経済未確定。generated final画像をruntimeへ貼っていない。`docs/design-targets/generated` runtime参照なし。Cloud Save未導入。Addressables未導入。mobile metrics NOT_MEASURED。audioMixer未確定。haptic未測定。

## 実行したcheck一覧

U41 checker、U40、U39、U34、U36、U35、U33、U32、U31、U30、U29、U28、U27、U26、U25、U24、U23、U22、Unity meta、Unity Editor verification一式を実行した。

## 残リスク

実機retry率、reward amountの納得感、clear率、AudioMixer final、haptic device behavior、本番balance、本番経済判断。

## 次に残る作業

実機測定、U37 final mobile tuning after device metrics、U38 production approval re-check、U42 release notes / known issues pass。
