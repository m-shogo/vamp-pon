# Unity U27 Save / Reward / Unlock Integration Review

## 変更概要

U27では、U25 / U26のStage1 runtime loopからrun resultを受け取り、save / reward / unlock / Result / StageSelect / Retryへ接続するproduction-adjacent層を追加した。productionApproved=0のまま。

## save data model

`U27SaveDataModel`、`U27StageProgressModel`、`U27StageResultRecord`、`U27SaveVersion`を追加した。stageId、isUnlocked、isCleared、bestClearTime、bestLevel、bestKillCount、bestCollectedCount、bestRank、lastResult、totalAttempts、totalClears、firstClearAt placeholder、lastPlayedAt placeholder、unlockedRewardIds、unlockedKnowledgeIds、versionを持つ。

DateTime相当の値はISO-8601 string placeholder方針で保存する。

## repository設計

`IU27StageProgressRepository`を境界にし、`U27InMemorySaveRepositoryForEditor`と`U27PlayerPrefsStageProgressRepository`を用意した。PlayerPrefs呼び出しはrepository内に閉じ込め、UI / Controllerには散らしていない。

## run resultからsaveへの接続

`U27SaveRewardUnlockIntegrator`が`U25RunResultModel`を`U27StageResultRecord`へ変換し、clear / defeat、attempts、clear count、best値、rank、last result、reward draft、unlock候補を保存へ反映する。

## reward draft calculation

`U27RewardCalculator`はclear bonus、defeat participation reward、time bonus、kill count bonus、collected count bonus、level reached bonus、first clear bonus、rare acquired bonus、evolution achieved bonus、Kokuyou flavor bonus、rank calculationをdraftとして計算する。正式経済バランスではない。

## unlock draft

`U27UnlockDraftResolver`はStage1 clearのStage2 placeholder、初回clearのknowledge line placeholder、level conditionのreward card placeholder、evolution collection entry placeholder、rare memory placeholderを返す。新規unlockと既存unlockを区別できる。

## Result UIへの反映

`U27ResultIntegrationModel`へclear / defeat、rank seal、elapsed time、kill count、level reached、collected count、reward cards相当のdraft、first clear bonus、new unlocks、best updated stamp、retry / stage select actionを集約した。

## StageSelectへの反映

`U27StageSelectIntegrationModel`へStage1 unlocked / cleared、previous result stamp、best rank、best clear time、last played result、Stage2 placeholder locked / unlocked、active lantern、route line、retry / start entry pointを集約した。

## Retry / reset / debug flow

`U27RetryFlowModel`と`ResetProofDebug`を追加した。Retryはsaveを保持してStage1再開始へ戻す。reset debugはverification / Editor安全運用向け。

## corrupted data fallback

repository baseとPlayerPrefs repositoryはversion不一致、欠損、decode失敗時にdefault saveへfallbackする。

## 390x844確認結果

`docs/design-targets/generated/unity-u27/screenshots/`へResult clear / defeat / best updated、StageSelect cleared / Stage2 placeholder、Retry、Save reset debug proofの確認画像を出力する。

## productionApproved=0の理由

正式save、Cloud Save、暗号化、account連携、正式reward economy、Stage2 / Collection本実装、実機確認、production approval gateが未完了のため。

## generated final画像

generated final画像や参照PNGをruntimeへ貼っていない。U27 screenshotsは確認用artifactでありruntime素材ではない。

## Addressables / Cloud Save / economy

Addressablesは未導入。Cloud Saveは未導入。経済バランスは未確定。

## 実行したcheck一覧

- Unity U27 screenshot capture
- Unity U27 verification
- `pnpm unity:u27-save-reward-unlock:check`
- `pnpm unity:u26-stage1-first-playable-balance:check`
- `pnpm unity:u25-stage1-production-battle-loop:check`
- `pnpm unity:u24-climax-polish:check`
- `pnpm unity:u23-ui-visual-polish:check`
- `pnpm unity:u22-battle-visual-polish:check`
- `pnpm unity:meta:check`
- `git diff --check`

## 残リスク

PlayerPrefs保存形式はproof用。正式saveのmigration、暗号化、Cloud Save、実端末のretry導線、正式unlock文言、正式reward economyはU28以降に残る。
