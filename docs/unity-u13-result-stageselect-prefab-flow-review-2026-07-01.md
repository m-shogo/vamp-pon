# Unity U13 Result / StageSelect Prefab Flow Review

作成日: 2026-07-01

1. Scope
   - U13ではU12 functional proofをformal prefab asset候補 + flow設計passへ進めた。
   - 正式Result Scene、正式StageSelect Scene、Battle本番遷移、save、reward反映、Stage解放、difficulty本番計算、黒耀化runtime、黒耀化ゲージ / ボタン、必殺cut-in runtime、Addressables、production approved昇格は行っていない。

2. U12 functional proofレビュー結果
   - Result stats行はEditor screenshotでは改善済みだが、実機輝度と小型端末で再確認する。
   - StageSelect locked nodeはnode上labelを削除したため、正式化時に明度差と選択誘導を実機で確認する。
   - 黒耀化Bの緑/黄色粒は最終採用前に人間レビューを継続する。
   - U12はfunctional proofであり、U13でformal prefab asset候補とflow設計へ進めた。

3. Result formal prefab candidate内容
   - `ResultRoot.prefab`
   - `ResultPaperLedgerPanel.prefab`
   - `ResultRewardCard.prefab`
   - `ResultStatsLine.prefab`
   - `ResultContinueButton.prefab`
   - `ResultRankSeal.prefab`
   - `ResultNewBadge.prefab`
   - 対応View: `ResultRootView`, `ResultPaperLedgerPanelView`, `ResultRewardCardView`, `ResultStatsLineView`, `ResultContinueButtonView`, `ResultRankSealView`, `ResultNewBadgeView`

4. ResultViewModel内容
   - Title: `今夜の記録`
   - Rank: `A`
   - FragmentCount: `12`
   - MemoryCount: `3`
   - BlessingCount: `3`
   - ElapsedTime: `08:00`
   - DefeatedEnemies: `128`
   - Rewards: `記憶 / 墨 / 灯`
   - ContinueLabel: `次へ`
   - `ResultRewardCardViewModel` は報酬カード表示用。

5. StageSelect formal prefab candidate内容
   - `StageSelectRoot.prefab`
   - `StageMapPanel.prefab`
   - `StageRouteLine.prefab`
   - `StageRouteNode.prefab`
   - `StageLanternMarker.prefab`
   - `StageInfoPanel.prefab`
   - `StageStartButton.prefab`
   - 対応View: `StageSelectRootView`, `StageMapPanelView`, `StageRouteLineView`, `StageRouteNodeView`, `StageLanternMarkerView`, `StageInfoPanelView`, `StageStartButtonView`

6. StageSelectViewModel内容
   - Title: `今夜の行き先`
   - `stage_01`: `はじまりの路地` / active
   - `stage_02`: `灯りの曲がり角` / locked
   - `stage_03`: `黒い橋` / locked
   - InfoPanel: `はじまりの路地 / やさしい / 選択中`
   - StartLabel: `出発`
   - `StageNodeViewModel` と `StageInfoViewModel` を表示用に分離した。

7. Common UI prefab candidate内容
   - `PaperLabel.prefab`
   - `PaperButton.prefab`
   - `PaperPanel.prefab`
   - `MemoryCard.prefab`
   - `InkRouteLine.prefab`
   - `LanternMarker.prefab`
   - PaperButtonはResult「次へ」/ StageSelect「出発」の共用候補。
   - MemoryCardはResult / 将来Collectionの共用候補。
   - InkRouteLineとLanternMarkerはStageSelect用で、将来animation対応余地を残した。

8. Flow設計内容
   - 理想flowは `StageSelect → Battle → Result → StageSelect`。
   - U13では静的flow map proofとdoc設計のみ。
   - Battleへ渡す予定: `selectedStageId`, `selectedDifficulty`, `startTime`
   - Resultへ渡す予定: `clear/fail`, `elapsed`, `defeatedEnemies`, `fragments`, `memories`, `blessing`, `rank`, `rewardCards`
   - StageSelectへ戻す予定: `lastPlayedStageId`, `resultSummary`, `unlockCandidate`

9. Button action計画
   - Result「次へ」は将来StageSelectへ戻る予定。
   - StageSelect「出発」は将来Battleへ入る予定。
   - U13では `IResultActionHandler`, `IStageSelectActionHandler`, `ProofResultActionHandler`, `ProofStageSelectActionHandler` まで。
   - 実Scene遷移、save、reward、unlock APIには接続していない。

10. screenshot結果
   - `docs/design-targets/generated/unity-u13/screenshots/u13-result-prefab-candidate-390x844.png`
   - `docs/design-targets/generated/unity-u13/screenshots/u13-result-prefab-candidate-360x800.png`
   - `docs/design-targets/generated/unity-u13/screenshots/u13-result-prefab-candidate-430x932.png`
   - `docs/design-targets/generated/unity-u13/screenshots/u13-stageselect-prefab-candidate-390x844.png`
   - `docs/design-targets/generated/unity-u13/screenshots/u13-stageselect-prefab-candidate-360x800.png`
   - `docs/design-targets/generated/unity-u13/screenshots/u13-stageselect-prefab-candidate-430x932.png`
   - `docs/design-targets/generated/unity-u13/screenshots/u13-flow-map-proof-390x844.png`
   - Contact sheets: `u13-result-contact-sheet.png`, `u13-stageselect-contact-sheet.png`, `u13-all-proof-contact-sheet.png`

11. 390x844 / 360x800 / 430x932確認
   - Result prefab candidateは3解像度で出力済み。stats行と「次へ」はTMPで読める状態にした。
   - StageSelect prefab candidateは3解像度で出力済み。node上の小さいlabelは復活させず、InfoPanelで状態を読む。
   - Flow map proofは390x844で出力済み。
   - 実機確認はnot executed。

12. 採用候補 / 再修正候補 / 保留候補 / 却下候補
   - 採用候補: Result / StageSelect / Common UI prefab candidates、Route A、Result / StageSelect ViewModel分離。
   - 再修正候補: 実機輝度でのResult stats、StageSelect locked nodeの沈み具合。
   - 保留候補: 黒耀化A、Route B glow animation。
   - 却下候補: なし。

13. Route A採用方針 / Route B animation候補方針
   - Route Aを通常表示の基本方針として維持。
   - Route B glowは通常表示に使わず、将来Animation候補として維持。

14. U5/U8/U8.1/U10/U13素材がcandidateのままか
   - U5 / U8 / U8.1 / U10素材はcandidateのまま。
   - U13で新規画像生成は未実施。
   - U13 prefab assetはformal prefab candidateであり、production approvedではない。

15. productionApproved=0か
   - productionApproved=0を維持。
   - U13ではapproved昇格なし。

16. Resources系がproof-onlyか
   - `Resources/U5Candidates` はproof-only維持。
   - `Resources/U8Candidates` はproof-only維持。
   - `Resources/U8Refined` はproof-only維持。
   - `Resources/U10Candidates` はproof-only維持。
   - `Resources/U13Proof` は作成していない。

17. text-baked imageがないか
   - U13 Prefab / screenshotのUI文字はTMPで重ねている。
   - タイトル、説明文、数字、UI labelを画像に焼き込んでいない。

18. 正式Result/StageSelect実装をしていないこと
   - 正式Result/StageSelect実装をしていない。
   - 正式Scene接続、正式runtime transition、production data source接続は未実装。

19. Battle本番遷移を作っていないこと
   - Battle本番遷移を作っていない。
   - `SceneManager.LoadScene` などの実遷移APIには接続していない。

20. 報酬/セーブ/Stage解放ロジックを作っていないこと
   - reward persistence、save system、Stage unlock runtime、difficulty本番計算は追加していない。

21. 黒耀化runtimeを実装していないこと
   - 黒耀化runtime、黒耀化ゲージ、黒耀化ボタン、必殺cut-in runtimeは追加していない。

22. Addressablesを導入していないこと
   - Addressables package、catalog、profile、runtime loading pathは追加していない。

23. ZenMaruGothic SDFの状態
   - U13 screenshotでは `Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset` を使用した。
   - batchmodeロード時の既知の表示差はあるが、描画は完了している。
   - Unity batchmodeがSDF assetを再シリアライズした場合はcommit前に差分を戻す。

24. U7.1 TimeScale / AssetProvider verification結果
   - U7 TimeScale Service Verification: exit code 0。全case OK、`TimeScale final: 1`、`Service final scale: 1`、`Service final reason: force-restore`。
   - U7 AssetProvider Verification: exit code 0。provider proof-only、battle visuals load、BattleControllerに `Resources.Load` / `U5Candidates` / U5 asset id / card UI generationなし、Addressables参照なし。

25. U4/U5 verification結果
   - U5 Visual Candidate Verification: exit code 0。AssetsLoaded全OK、Movement/Battle/Feel/VFX pass、390x844 / 360x800 / 430x932で `canvas=True`, `safeHud=True`, `backgroundCover=True`。
   - U4 LevelUp UI Verification: exit code 0。ProjectVersion OK、ZenMaruGothic font / license found、BattleController clean、TimeScale guard OK、`dawn_ticket` clean。

26. term lock / asset intake / meta / design review結果
   - `pnpm unity:term-lock:check`: passed。
   - `pnpm unity:asset-intake:check`: passed。
   - `pnpm unity:u8-asset-intake:check`: passed。
   - `pnpm unity:u8-1-asset-intake:check`: passed。
   - `pnpm unity:u9-2-visual-hardening:check`: passed。
   - `pnpm unity:u10-prefab-ready-visual:check`: passed。
   - `pnpm unity:u11-prefab-component-proof:check`: passed。
   - `pnpm unity:u12-functional-proof:check`: passed。
   - `pnpm unity:u13-prefab-flow:check`: passed。
   - `pnpm unity:meta:check`: passed。
   - `pnpm design:review:verify`: passed。
   - `git diff --check`: passed。

27. Console compile/runtime error有無
   - U13 screenshot batchmodeはexit code 0。
   - U7 / U5 / U4 verification batchmodeはexit code 0。
   - Unity logには既知のLicense handshake系Error行が出るが、C# compile error、U13 runtime exception、project runtime errorは見つかっていない。

28. 実機確認はまだnot executedか
   - iPhone / Android実機確認はnot executed。
   - 実機確認を実行済みとは扱わない。

29. 残る未解決懸念
   - Result stats行は実機輝度と小型端末で再確認する。
   - StageSelect locked nodeの明度差と選択誘導は実機で確認する。
   - 黒耀化Bの緑/黄色粒は最終採用前に人間レビューを継続する。
   - U13はformal prefab asset候補であり、正式Scene / production data bindingは未実装。

30. 次にやること
   - U14で仮Scene flow接続を行う。
   - StageSelect → Battle → Result → StageSelectの仮遷移を入れる。
   - production data source、save、reward反映、Stage解放、difficulty計算は別passで追加する。
   - SE / haptic hook、Back / Home / Retry導線を設計する。
   - iPhone / Android実機確認を別途実行する。
