# Unity U14 Stage / Result Scene Flow Proof Review

作成日: 2026-07-01

1. Scope
   - U14ではU13 formal prefab candidateを使い、`StageSelect -> Battle -> Result -> StageSelect` の仮Scene Flow Proofを作成した。
   - 正式Result/StageSelect、本番Battle、production data binding、save、reward反映、Stage解放、difficulty本番計算、黒耀化runtime、Addressables、production approved昇格は行っていない。

2. U13.1 Flow Readiness修正結果
   - Result / StageSelect / Common prefab READMEへ、U14 Scene Flow proofで使う場合もproof-onlyであり、production approvedではないことを追記した。
   - Viewは表示、ViewModelは表示データ、ActionHandlerは押下時の仮動作に留めた。
   - U14 proof router以外へScene遷移責務を広げていない。

3. U14 proof scene構成
   - `Assets/_Project/Scenes/Proof/U14StageSelectFlowProof.unity`
   - `Assets/_Project/Scenes/Proof/U14BattleFlowProof.unity`
   - `Assets/_Project/Scenes/Proof/U14ResultFlowProof.unity`
   - Build Settingsへ正式Sceneとして追加していない。

4. FlowState内容
   - `U14FlowState` は `SelectedStageId`, `SelectedDifficulty`, `LastPlayedStageId`, `LastResultSummary`, `FlowStep` をstatic一時状態として保持する。
   - PlayerPrefs、local file、SaveManagerには保存しない。

5. BattleStartRequestProof内容
   - `SelectedStageId`: `stage_01`
   - `SelectedDifficulty`: `やさしい`
   - `StartTime`: `proof-start`
   - StageSelectからBattleへ渡す仮データであり、production start requestではない。

6. BattleResultSummaryProof内容
   - `ClearState`: `clear`
   - `StageId`: `stage_01`
   - `StageTitle`: `はじまりの路地`
   - `Difficulty`: `やさしい`
   - `ElapsedTime`: `08:00`
   - `DefeatedEnemies`: `128`
   - `Fragments`: `12`
   - `Memories`: `3`
   - `Blessing`: `3`
   - `Rank`: `A`
   - `RewardCards`: `記憶 / 墨 / 灯`

7. StageSelect flow接続内容
   - `U14StageSelectFlowProofController` が `StageSelectViewModel.Sample` を `StageSelectRootView` へ流し込む。
   - `出発` actionで `BattleStartRequestProof` を作り、`U14ProofSceneRouter.GoToBattle` へ渡す。
   - proof log: `U14 StageSelect start requested: stage_01 / やさしい`

8. Battle flow proof内容
   - `U14BattleFlowProofController` と `U14BattleFlowProofView` を追加した。
   - 表示内容は `仮Battle`, `はじまりの路地`, `やさしい`, `仮戦闘結果を作成中`, `08:00 / 討伐128 / 欠片12 / 記憶3`, `Resultへ`。
   - enemy wave、weapon、level up、黒耀化runtime、本番BattleController接続は作っていない。

9. Result flow接続内容
   - `U14ResultFlowProofController` が `BattleResultSummaryProof` から `ResultViewModel` を作る。
   - `ResultRootView` に表示し、`次へ` actionでStageSelectへ戻る。
   - reward persistence、save、Stage unlock、achievement、Collection updateはしていない。

10. Button action / router内容
   - `U14ProofSceneRouter.GoToBattle`, `GoToResult`, `GoToStageSelect` を追加した。
   - `SceneManager.LoadScene` はproof scene名だけを扱うU14 proof routerに限定した。
   - pure controller smoke testでは `loadScenes=false` でSceneManagerを使わず検証した。

11. Flow smoke verification結果
   - U14 Flow Proof Verification: exit code 0。
   - `StageSelect view can bind StageSelectViewModel`: OK
   - `StageSelect start hook creates BattleStartRequestProof`: OK
   - `Router receives GoToBattle`: OK
   - `Battle proof creates BattleResultSummaryProof`: OK
   - `Router receives GoToResult`: OK
   - `Result view can bind ResultViewModel from summary`: OK
   - `Result continue hook routes to StageSelect`: OK
   - `No save/reward/unlock APIs used`: OK
   - `No addressable asset data folder`: OK
   - `productionApproved=0`: OK

12. screenshot結果
   - `docs/design-targets/generated/unity-u14/screenshots/u14-stage-select-flow-proof-390x844.png`
   - `docs/design-targets/generated/unity-u14/screenshots/u14-stage-select-flow-proof-360x800.png`
   - `docs/design-targets/generated/unity-u14/screenshots/u14-stage-select-flow-proof-430x932.png`
   - `docs/design-targets/generated/unity-u14/screenshots/u14-battle-flow-proof-390x844.png`
   - `docs/design-targets/generated/unity-u14/screenshots/u14-battle-flow-proof-360x800.png`
   - `docs/design-targets/generated/unity-u14/screenshots/u14-battle-flow-proof-430x932.png`
   - `docs/design-targets/generated/unity-u14/screenshots/u14-result-flow-proof-390x844.png`
   - `docs/design-targets/generated/unity-u14/screenshots/u14-result-flow-proof-360x800.png`
   - `docs/design-targets/generated/unity-u14/screenshots/u14-result-flow-proof-430x932.png`
   - `docs/design-targets/generated/unity-u14/screenshots/u14-flow-sequence-proof-390x844.png`
   - Contact sheets: `u14-stage-select-contact-sheet.png`, `u14-battle-contact-sheet.png`, `u14-result-contact-sheet.png`, `u14-all-flow-contact-sheet.png`

13. 390x844 / 360x800 / 430x932確認
   - StageSelect、仮Battle、Resultを3解像度でEditor batchmode出力した。
   - 主要UIは画面内に収まり、390x844 mobile viewportでflow proofとして読める状態。
   - 実機確認はnot executed。

14. 採用候補 / 再修正候補 / 保留候補 / 却下候補
   - 採用候補: U14 proof scene flow、U14FlowState、U14ProofSceneRouter、BattleStartRequestProof、BattleResultSummaryProof。
   - 再修正候補: 実機輝度でのResult stats、StageSelect locked nodeの明度差、仮Battle画面の本番置換。
   - 保留候補: 黒耀化A、Route B glow animation。
   - 却下候補: なし。

15. Route A採用方針 / Route B animation候補方針
   - Route Aを通常表示の基本方針として維持。
   - Route B glowは通常表示に使わず、将来animation候補として維持。

16. U5/U8/U8.1/U10/U13/U14素材がcandidateのままか
   - U5 / U8 / U8.1 / U10素材はcandidateのまま。
   - U13 prefab assetはformal prefab candidateのまま。
   - U14 proof scenes / scripts / screenshotsはproof-only / candidateであり、production assetではない。

17. productionApproved=0か
   - productionApproved=0を維持。
   - U14ではapproved昇格なし。

18. Resources系がproof-onlyか
   - `Resources/U5Candidates` はproof-only維持。
   - `Resources/U8Candidates` はproof-only維持。
   - `Resources/U8Refined` はproof-only維持。
   - `Resources/U10Candidates` はproof-only維持。
   - `Resources/U14Proof` は作成していない。

19. text-baked imageがないか
   - U14 scene内のUI文字はTextMeshProで載せている。
   - タイトル、説明文、数字、UI labelを画像に焼き込んでいない。

20. 正式Result/StageSelect実装をしていないこと
   - 正式Result/StageSelect実装をしていない。
   - 正式Scene接続、正式runtime transition、production data source接続は未実装。

21. Battle本番実装をしていないこと
   - Battle本番実装をしていない。
   - U14Battleは固定値を表示し、固定の `BattleResultSummaryProof` を作る仮画面。

22. 報酬/セーブ/Stage解放ロジックを作っていないこと
   - reward persistence、save system、Stage unlock runtime、difficulty本番計算は追加していない。

23. 黒耀化runtimeを実装していないこと
   - 黒耀化runtime、黒耀化ゲージ、黒耀化ボタン、必殺cut-in runtimeは追加していない。

24. Addressablesを導入していないこと
   - Addressables package、catalog、profile、runtime loading pathは追加していない。

25. ZenMaruGothic SDFの状態
   - U14 screenshotでは `Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset` を使用した。
   - Unity batchmodeによるSDF再シリアライズ差分はcommit前に戻す。

26. U7.1 TimeScale / AssetProvider verification結果
   - U7 TimeScale Service Verification: exit code 0。全case OK、`TimeScale final: 1`、`Service final scale: 1`、`Service final reason: force-restore`。
   - U7 AssetProvider Verification: exit code 0。provider proof-only、battle visuals load、BattleControllerに `Resources.Load` / `U5Candidates` / U5 asset id / card UI generationなし、addressable loading referenceなし。

27. U4/U5 verification結果
   - U5 Visual Candidate Verification: exit code 0。AssetsLoaded全OK、Movement/Battle/Feel/VFX pass、390x844 / 360x800 / 430x932で `canvas=True`, `safeHud=True`, `backgroundCover=True`。
   - U4 LevelUp UI Verification: exit code 0。ProjectVersion OK、ZenMaruGothic font / license found、BattleController clean、TimeScale guard OK、`dawn_ticket` clean。

28. term lock / asset intake / meta / design review結果
   - `pnpm unity:term-lock:check`: passed。
   - `pnpm unity:asset-intake:check`: passed。
   - `pnpm unity:u8-asset-intake:check`: passed。
   - `pnpm unity:u8-1-asset-intake:check`: passed。
   - `pnpm unity:u9-2-visual-hardening:check`: passed。
   - `pnpm unity:u10-prefab-ready-visual:check`: passed。
   - `pnpm unity:u11-prefab-component-proof:check`: passed。
   - `pnpm unity:u12-functional-proof:check`: passed。
   - `pnpm unity:u13-prefab-flow:check`: passed。
   - `pnpm unity:u14-scene-flow:check`: passed。
   - `pnpm unity:meta:check`: passed。
   - `pnpm design:review:verify`: passed。
   - `git diff --check`: passed。

29. Console compile/runtime error有無
   - U14 screenshot batchmodeはexit code 0。
   - U14 flow smoke verification batchmodeはexit code 0。
   - U7 / U5 / U4 verification batchmodeはexit code 0。
   - Unity logには既知のLicense handshake系Error行が出るが、C# compile error、U14 runtime exception、project runtime errorは見つかっていない。

30. 実機確認はまだnot executedか
   - iPhone / Android実機確認はnot executed。
   - 実機確認を実行済みとは扱わない。

31. 残る未解決懸念
   - Result stats行は実機輝度と小型端末で再確認。
   - StageSelect locked nodeの明度差と選択誘導は実機で確認。
   - 黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。
   - U14は仮Scene Flow Proofであり、production data source / save / reward / unlockは未実装。
   - Battleは仮画面であり、本番Battle結果ではない。

32. 次にやること
   - U15でproduction data source接続の設計を行う。
   - Battle本番結果からResultへ渡す契約を作る。
   - save / reward / Stage unlock / difficulty計算を別passで追加する。
   - Back / Home / Retry導線、SE / haptic hookを設計する。
   - iPhone / Android実機確認を別途実行する。
