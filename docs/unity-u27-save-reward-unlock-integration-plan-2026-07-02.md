# Unity U27 Save / Reward / Unlock Integration Plan

## U27でやること

- U25 / U26のStage1 runtime loopからrun resultを受け取り、save / reward / unlock / stage progressへ接続する。
- Stage1のclear / defeat、best更新、attempts、clear count、last result、unlock draftを保存モデルへ反映する。
- Resultにreward / unlock / best updated / retry / stage select actionを渡せるview modelを用意する。
- StageSelectに前回結果、clear状態、best rank / time、Stage2 placeholder unlock、active lanternを渡せるview modelを用意する。
- Retry / StageSelect return / reset debug / corrupted data fallbackをverificationで確認できる形にする。

## U27でやらないこと

- production approvalへの昇格。
- 正式経済バランス確定。
- Cloud Save、暗号化、account連携。
- Addressables本導入。
- generated final画像や参照PNGのruntime直貼り。
- Stage2本体、Collection本実装、課金経済のような複雑な報酬設計。

## productionApproved

U27はproduction-adjacentな接続proofであり、productionApproved=0のまま進める。正式save、正式経済、実機確認、production approval gateは未完了。

## Save方針

PlayerPrefsを使う場合は`U27PlayerPrefsStageProgressRepository`に閉じ込める。Controller / UIから直接PlayerPrefsへ触らず、後でJSON / Cloud Save / encrypted saveへ置き換えられるrepository interfaceを維持する。DateTime相当の値はISO-8601文字列placeholderとして保存し、versionを必ず持たせる。

## U25 / U26 runtime loopとの接続

U25の`U25RunResultModel`をU27の`U27StageResultRecord`へ変換し、U26 balance draftは報酬やrankの前提値ではなく、first playableとして別責務に置く。U27はrun result後の保存・表示接続に限定する。

## StageSelect / Result / Retry接続方針

- Result: U27 reward draft、unlock draft、best updated stamp、retry / stage select actionを`U27ResultIntegrationModel`へ集約する。
- StageSelect: repositoryからprogressを読み、Stage1 / Stage2 placeholder状態を`U27StageSelectIntegrationModel`へ集約する。
- Retry: saveを消さずにStage1再開始状態を作る。reset debugはverification / Editor安全運用向けに限定する。

## U28以降に残すこと

- U28 SEファイル実装 / haptic実機確認。
- U29 Sprite Atlas / performance / mobile実機FPS。
- U30 production approval gate / Stage1 vertical slice判定。
- Cloud Save / encrypted save / account連携。
- 正式reward economy、正式unlock文言、Stage2 / Collection本実装。
