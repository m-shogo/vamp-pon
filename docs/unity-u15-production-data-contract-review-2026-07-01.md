# Unity U15 Production Data Contract Review

作成日: 2026-07-01

1. Scope
   - U15ではU14 proof flowからproduction data contractへ進むためのcontract proofを追加した。
   - production-ready namingだが、production data source、save、reward反映、Stage unlock確定、difficulty本番計算、本番Battle、黒耀化runtime、Addressablesには未接続。

2. U14.1 Flow Risk Cleanup結果
   - `Assets/_Project/Scripts/U14/README.md` と `Assets/_Project/Scenes/Proof/README.md` を追加し、U14 scenes / scripts がproof-onlyであることを明記した。
   - `U14ProofSceneRouter` は本番Scene transition serviceではない。
   - `BattleResultSummaryProof` は本番Battle結果ではない。
   - `U14FlowState` は保存状態ではない。
   - 既存checkerはU14 proof codeを本番hookとして誤検出しない範囲を維持している。

3. U15 contract配置
   - `Assets/_Project/Scripts/U15/Contracts/`
   - `Assets/_Project/Scripts/U15/Mappers/`
   - U15配下に閉じ、全production namespaceへ混ぜていない。

4. StageStartRequest内容
   - `StageId`: `stage_01`
   - `StageTitle`: `はじまりの路地`
   - `DifficultyId`: `easy`
   - `DifficultyLabel`: `やさしい`
   - `RequestedAt`: `proof-start`
   - `Source`: `stage_select`

5. BattleResultSummary内容
   - `ClearState`: `clear`
   - `StageId`: `stage_01`
   - `StageTitle`: `はじまりの路地`
   - `DifficultyId`: `easy`
   - `DifficultyLabel`: `やさしい`
   - `ElapsedSeconds`: `480`
   - `ElapsedLabel`: `08:00`
   - `DefeatedEnemies`: `128`
   - `Fragments`: `12`
   - `Memories`: `3`
   - `Blessing`: `3`
   - `Rank`: `A`
   - `RewardSummary`: `記憶 / 墨 / 灯`
   - `UnlockCandidate`: none

6. RewardSummary内容
   - `RewardCards`: `記憶 / 墨 / 灯`
   - `Fragments`: `12`
   - `Memories`: `3`
   - `Blessing`: `3`
   - `DisplayLabels`: `欠片 12 / 記憶 3 / 加護 +3`
   - 表示用summaryであり、永続反映していない。

7. UnlockCandidate内容
   - `HasCandidate`: `false`
   - `StageId`: empty
   - `StageTitle`: empty
   - `Reason`: `U15ではunlock確定しない`
   - Stage解放を確定しない。

8. ResultPresentationModel内容
   - `Title`: `今夜の記録`
   - `Rank`: `A`
   - `FragmentLabel`: `欠片 12`
   - `MemoryLabel`: `記憶 3`
   - `BlessingLabel`: `加護 +3`
   - `ElapsedLabel`: `時間 08:00`
   - `DefeatedEnemiesLabel`: `討伐 128`
   - `RewardCardLabels`: `記憶 / 墨 / 灯`
   - `ContinueLabel`: `次へ`

9. StageSelectPresentationModel内容
   - `Title`: `今夜の行き先`
   - Nodes: `stage_01 / active / unlocked`, `stage_02 / locked / locked`, `stage_03 / locked / locked`
   - Info: `はじまりの路地 / やさしい / 選択中`
   - `StartLabel`: `出発`
   - `LastResultLabel`: `前回: Rank A / 欠片 12`

10. Contract mapper / adapter内容
   - `U14ToU15ContractMapper`: `BattleStartRequestProof -> StageStartRequest`, `BattleResultSummaryProof -> BattleResultSummary`
   - `BattleResultToPresentationMapper`: `BattleResultSummary -> ResultPresentationModel`, U13 `ResultViewModel` adapter
   - `StageSelectPresentationMapper`: sample stage data + optional last result -> `StageSelectPresentationModel`, U13 `StageSelectViewModel` adapter

11. U14 flowへのU15 contract proof接続内容
   - StageSelect start時に `StageStartRequest` へ変換し、`U15 contract mapped StageStartRequest: stage_01 / easy` をlog出力する。
   - Battle result時に `BattleResultSummary` と `ResultPresentationModel` へ変換し、contract / presentation logを出力する。
   - Result continue時に `StageSelectPresentationModel` へ変換し、`前回: Rank A / 欠片 12` をlog出力する。
   - save / reward / unlockには接続していない。

12. Contract smoke verification結果
   - U15 Contract Verification: exit code 0。
   - `BattleStartRequestProof -> StageStartRequest mapping OK`: OK
   - `BattleResultSummaryProof -> BattleResultSummary mapping OK`: OK
   - `BattleResultSummary -> ResultPresentationModel mapping OK`: OK
   - `BattleResultSummary -> StageSelectPresentationModel mapping OK`: OK
   - `RewardSummary labels OK`: OK
   - `UnlockCandidate does not unlock anything`: OK
   - `RewardCards empty safe`: OK
   - `UnlockCandidate none safe`: OK
   - `ElapsedSeconds from ElapsedLabel`: OK
   - `DifficultyLabel empty fallback`: OK
   - `No SaveManager / RewardManager / UnlockManager added`: OK
   - `No reward persistence`: OK
   - `No stage unlock runtime logic`: OK
   - `No addressable asset data folder`: OK
   - `productionApproved=0`: OK

13. screenshot結果
   - `docs/design-targets/generated/unity-u15/screenshots/u15-contract-flow-proof-390x844.png`
   - `docs/design-targets/generated/unity-u15/screenshots/u15-contract-flow-proof-360x800.png`
   - `docs/design-targets/generated/unity-u15/screenshots/u15-contract-flow-proof-430x932.png`
   - `docs/design-targets/generated/unity-u15/screenshots/u15-result-presentation-proof-390x844.png`
   - `docs/design-targets/generated/unity-u15/screenshots/u15-result-presentation-proof-360x800.png`
   - `docs/design-targets/generated/unity-u15/screenshots/u15-result-presentation-proof-430x932.png`
   - `docs/design-targets/generated/unity-u15/screenshots/u15-stageselect-presentation-proof-390x844.png`
   - `docs/design-targets/generated/unity-u15/screenshots/u15-stageselect-presentation-proof-360x800.png`
   - `docs/design-targets/generated/unity-u15/screenshots/u15-stageselect-presentation-proof-430x932.png`
   - Contact sheet: `u15-all-contract-contact-sheet.png`

14. 390x844 / 360x800 / 430x932確認
   - U15 contract flow、ResultPresentation、StageSelectPresentationを3解像度でEditor batchmode出力済み。
   - 3解像度ともcontract proofとして主要テキストとパネルが画面内に収まっている。
   - 実機確認はnot executed。

15. 採用候補 / 再修正候補 / 保留候補 / 却下候補
   - 採用候補: U15 contracts、mapper / adapter、U14からU15 contractへの変換proof。
   - 再修正候補: 本番Battle resultからの生成契約、production stage catalog接続、実機輝度。
   - 保留候補: 黒耀化A、Route B glow animation。
   - 却下候補: なし。

16. Route A採用方針 / Route B animation候補方針
   - Route Aを通常表示の基本方針として維持。
   - Route B glowは通常表示に使わず、将来animation候補として維持。

17. U5/U8/U8.1/U10/U13/U14/U15素材がcandidateのままか
   - U5 / U8 / U8.1 / U10素材はcandidateのまま。
   - U13 prefab assetはformal prefab candidateのまま。
   - U14 proof scenes / scripts / screenshotsはproof-only / candidateのまま。
   - U15 contract / mapper / adapter / screenshotsはproof段階。

18. productionApproved=0か
   - productionApproved=0を維持。
   - U15ではapproved昇格なし。

19. Resources系がproof-onlyか
   - `Resources/U5Candidates` はproof-only維持。
   - `Resources/U8Candidates` はproof-only維持。
   - `Resources/U8Refined` はproof-only維持。
   - `Resources/U10Candidates` はproof-only維持。
   - `Resources/U15Proof` は作成していない。

20. text-baked imageがないか
   - U15 screenshotのUI文字はTextMeshProで載せている。
   - タイトル、説明文、数字、UI labelを画像に焼き込んでいない。

21. 正式Result/StageSelect実装をしていないこと
   - 正式Result/StageSelect実装をしていない。
   - production data source接続は未実装。

22. Battle本番実装をしていないこと
   - Battle本番実装をしていない。
   - `BattleResultSummary` は本番Battle結果からはまだ生成されていない。

23. 報酬/セーブ/Stage解放ロジックを作っていないこと
   - reward persistence、save system、Stage unlock runtime、difficulty本番計算は追加していない。

24. 黒耀化runtimeを実装していないこと
   - 黒耀化runtime、黒耀化ゲージ、黒耀化ボタン、必殺cut-in runtimeは追加していない。

25. Addressablesを導入していないこと
   - Addressables package、catalog、profile、runtime loading pathは追加していない。

26. ZenMaruGothic SDFの状態
   - U15 screenshotでは `Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset` を使用する。
   - Unity batchmodeによるSDF再シリアライズ差分はcommit前に戻す。

27. U14 Flow Proof Verification結果
   - U14 Flow Proof Verification: exit code 0。
   - StageSelect view bind、start hook、router GoToBattle、BattleResultSummaryProof生成、router GoToResult、ResultViewModel bind、Result continue、no save/reward/unlock、addressable asset data folderなし、productionApproved=0がOK。

28. U7.1 TimeScale / AssetProvider verification結果
   - U7 TimeScale Service Verification: exit code 0。全case OK、`TimeScale final: 1`、`Service final scale: 1`、`Service final reason: force-restore`。
   - U7 AssetProvider Verification: exit code 0。provider proof-only、battle visuals load、BattleControllerに `Resources.Load` / `U5Candidates` / U5 asset id / card UI generationなし、addressable loading referenceなし。

29. U4/U5 verification結果
   - U5 Visual Candidate Verification: exit code 0。AssetsLoaded全OK、Movement/Battle/Feel/VFX pass、390x844 / 360x800 / 430x932で `canvas=True`, `safeHud=True`, `backgroundCover=True`。
   - U4 LevelUp UI Verification: exit code 0。ProjectVersion OK、ZenMaruGothic font / license found、BattleController clean、TimeScale guard OK、`dawn_ticket` clean。

30. term lock / asset intake / meta / design review結果
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
   - `pnpm unity:u15-contracts:check`: passed。
   - `pnpm unity:meta:check`: passed。
   - `pnpm design:review:verify`: passed。
   - `git diff --check`: passed。

31. Console compile/runtime error有無
   - U15 Contract Verification batchmodeはexit code 0。
   - U15 screenshot batchmodeはexit code 0。
   - U14 / U7 / U5 / U4 verification batchmodeはexit code 0。
   - Unity logには既知のLicense handshake系Error行が出るが、C# compile error、U15 runtime exception、project runtime errorは見つかっていない。

32. 実機確認はまだnot executedか
   - iPhone / Android実機確認はnot executed。
   - 実機確認を実行済みとは扱わない。

33. 残る未解決懸念
   - Result stats行は実機輝度と小型端末で再確認。
   - StageSelect locked nodeの明度差と選択誘導は実機で確認。
   - 黒耀化Bの緑/黄色粒は最終採用前に人間レビュー継続。
   - U15はcontract proofであり、production data source / save / reward / unlockは未実装。
   - BattleResultSummaryは本番Battle結果からはまだ生成されていない。
   - RewardSummaryは表示用であり、永続反映していない。
   - UnlockCandidateは候補であり、Stage解放を確定しない。

34. 次にやること
   - U16で本番Battle resultから `BattleResultSummary` を生成する境界を設計する。
   - production stage catalog / unlock stateの読み込み境界を設計する。
   - save / reward反映 / Stage unlock確定 / difficulty計算を別passで接続する。
   - 実機Safe Area、輝度、小型端末確認を別途実行する。
