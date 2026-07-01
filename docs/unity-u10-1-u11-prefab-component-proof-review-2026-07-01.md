# Unity U10.1 Human Review + U11 Prefab Component Proof Review

作成日: 2026-07-01

1. Scope
   - U10.1ではU10 candidate 8点を人間レビュー前提で採用候補 / 再修正候補 / 保留候補 / 却下候補へ整理した。
   - U11では正式Sceneではなく、Result / StageSelectのPrefab-like component proofを作成した。
   - 正式Result Scene、正式StageSelect Scene、報酬ロジック、セーブ処理、Stage解放処理、difficulty処理、黒耀化runtime、黒耀化ゲージ / ボタン、必殺cut-in runtime、Addressables導入、production approved昇格は行っていない。

2. U10.1 candidate人間レビュー結果
   - `result_continue_paper_button`: 採用候補。紙CTAとして自然で、金ピカUIには見えない。
   - `result_stats_ink_strip`: 採用候補。ただしTMPサイズと配置に依存するため、正式Prefab化時に実機可読性を再確認する。
   - `stageselect_route_active_node`: 採用候補。active nodeとしてランタン芯が読みやすい。
   - `stageselect_route_locked_node`: 採用候補。activeとの差は分かるが、状態labelは小さいため正式化時に再調整する。
   - `kokuyou_fullscreen_final_candidate_a`: 保留候補。まとまりはあるが、主軸候補としてはBより弱い。
   - `kokuyou_fullscreen_final_candidate_b`: 採用候補 / 主軸候補。赤黒 / 紫黒の渦が強く、黒耀化らしさが最も明確。
   - `levelup_rare_memory_tear_burst`: 採用候補。通常VFXより特別で、黒耀化より弱い。
   - `cutin_black_ink_band_final_candidate`: 採用候補。TMP文字を載せる余白がある。
   - 既存U8/U8.1素材の黄色/緑寄り粒とU10候補は混同しない。U11 comparisonではU10候補だけを判断対象にした。

3. 再生成した素材
   - 再生成は未実施。
   - 理由: U10素材にcomponent proofを止める明確な破綻はなく、課題は主にTMP配置、実機可読性、人間レビュー判断で解決できる範囲だったため。
   - U11用の `greenback/`, `alpha/`, `reports/`, `u11-visual-refinement-manifest.json`, `Resources/U11Proof` は作成していない。

4. Result component proof内容
   - `ResultRootProof`
   - `ResultPaperLedgerPanelProof`
   - `ResultRewardCardProof`
   - `ResultStatsLineProof`
   - `ResultContinueButtonProof`
   - 仮データ: タイトル `今夜の記録`、ランク `A`、拾った記憶 `3`、拾った欠片 `12`、朝の加護 `+3`、報酬カード `記憶 / 墨 / 灯`、ボタン `次へ`。
   - 報酬ロジック、セーブ処理、正式Result Scene化は行っていない。

5. StageSelect component proof内容
   - `StageSelectRootProof`
   - `StageMapPanelProof`
   - `StageRouteLineProof`
   - `StageRouteNodeProof`
   - `StageLanternMarkerProof`
   - `StageInfoPanelProof`
   - `StageStartButtonProof`
   - 仮データ: タイトル `今夜の行き先`、ステージ名 `はじまりの路地`、難易度 `やさしい`、状態 `選択中 / 未解放`、ボタン `出発`。
   - Stage解放ロジック、difficulty処理、正式StageSelect Scene化は行っていない。

6. 共通component proof内容
   - `PaperLabelProof`: TMP SDF font assetを受け取り、UI文字を画像ではなくTextMeshProで表示する。
   - `PaperButtonProof`: U10紙ボタン候補にTMP labelを載せるCTA候補。
   - `PaperPanelProof`: candidate spriteまたは単色panelをUI Imageとして配置する共通panel候補。

7. 黒耀化 / rare / cut-in review結果
   - 黒耀化はBを主軸候補にする。Bは渦の方向、赤黒 / 紫黒の密度、ランタン芯の読ませ方が強い。
   - Aはまとまりがあるため保留候補。Bが強すぎる場合の代替案として残す。
   - rareは黒耀化より弱く、通常VFXより特別な位置づけとして成立している。
   - cut-in bandは横長で、TMP文字を載せる余白がある。
   - 黒耀化runtime、黒耀化ゲージ / ボタン、必殺cut-in runtimeは作っていない。

8. screenshot結果
   - `docs/design-targets/generated/unity-u11/screenshots/u11-result-component-proof-390x844.png`
   - `docs/design-targets/generated/unity-u11/screenshots/u11-result-component-proof-360x800.png`
   - `docs/design-targets/generated/unity-u11/screenshots/u11-result-component-proof-430x932.png`
   - `docs/design-targets/generated/unity-u11/screenshots/u11-stageselect-component-proof-390x844.png`
   - `docs/design-targets/generated/unity-u11/screenshots/u11-stageselect-component-proof-360x800.png`
   - `docs/design-targets/generated/unity-u11/screenshots/u11-stageselect-component-proof-430x932.png`
   - `docs/design-targets/generated/unity-u11/screenshots/u11-kokuyou-rare-cutin-review-390x844.png`
   - Contact sheets: `u11-result-contact-sheet.png`, `u11-stageselect-contact-sheet.png`, `u11-all-proof-contact-sheet.png`

9. 390x844 / 360x800 / 430x932確認
   - Result: 3解像度で出力済み。stats行は原寸では読めるが、正式Prefab化時に実機輝度で再確認する。
   - StageSelect: 3解像度で出力済み。下部UIはSafe Area想定内に収まる。active / locked node差分は見えるが、node状態labelは小さめ。
   - 黒耀化 / rare / cut-in review: 390x844で出力済み。
   - 実機ではなくEditor batchmode screenshotでの確認。

10. 採用候補 / 再修正候補 / 保留候補 / 却下候補
    - 採用候補: `result_continue_paper_button`, `result_stats_ink_strip`, `stageselect_route_active_node`, `stageselect_route_locked_node`, `kokuyou_fullscreen_final_candidate_b`, `levelup_rare_memory_tear_burst`, `cutin_black_ink_band_final_candidate`
    - 再修正候補: Result stats行のTMP配置、StageSelect node状態label、黒耀化Bの緑/黄色粒の最終人間レビュー。
    - 保留候補: `kokuyou_fullscreen_final_candidate_a`
    - 却下候補: なし。

11. Route A採用方針 / Route B animation候補方針
    - U11でもRoute Aを基本採用した。
    - Route B glowは通常表示には入れていない。
    - Route B glowは将来Animation候補として残す。

12. U5/U8/U8.1/U10/U11素材がcandidateのままか
    - U5素材はcandidateのまま。
    - U8素材はcandidateのまま。
    - U8.1素材はcandidateのまま。
    - U10素材はcandidateのまま。
    - U11では新規画像素材を生成していないため、新しい素材statusは追加していない。

13. productionApproved=0か
    - production approvedへの昇格は行っていない。
    - U5 / U8 / U8.1 / U10 checkerでproductionApproved=0を確認する。

14. Resources系がproof-onlyか
    - `Resources/U5Candidates` はproof-only維持。
    - `Resources/U8Candidates` はproof-only維持。
    - `Resources/U8Refined` はproof-only維持。
    - `Resources/U10Candidates` はproof-only維持。
    - `Resources/U11Proof` は作成していない。

15. text-baked imageがないか
    - U11 component proofではUI文字をTextMeshProで表示した。
    - 画像にタイトル、説明文、数字、UIラベルは焼き込んでいない。

16. 正式Result/StageSelect実装をしていないこと
    - 正式Scene、正式遷移、正式Prefab asset、正式runtime hookは追加していない。
    - U11はEditor screenshot用のPrefab-like component proofのみ。

17. 報酬/セーブ/Stage解放ロジックを作っていないこと
    - 報酬ロジック、セーブ処理、Stage解放処理、difficulty処理は追加していない。
    - 表示は仮データのみ。

18. 黒耀化runtimeを実装していないこと
    - 黒耀化runtime、黒耀化ゲージ、黒耀化ボタン、必殺cut-in runtimeは追加していない。

19. Addressablesを導入していないこと
    - Addressables package、catalog、profile、runtime loading pathは追加していない。

20. ZenMaruGothic SDFの状態
    - `Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset` をU11 screenshotで使用した。
    - U11ではSDF assetの内容変更は行っていない。
    - batchmodeロード時の `glyphTable.Count=0` 表示はU9.2 / U10と同じ既知の表示で、描画は完了している。

21. U7.1 TimeScale / AssetProvider verification結果
   - U7 TimeScale Service Verification: exit code 0。全case OK、`TimeScale final: 1`、`Service final scale: 1`。
   - U7 AssetProvider Verification: exit code 0。provider proof-only、U5 proof sprite load、BattleControllerに `Resources.Load` / `U5Candidates` / U5 asset id / card UI generationなし、Addressables参照なし。

22. U4/U5 verification結果
   - U5 Visual Candidate Verification: exit code 0。AssetsLoaded全OK、Movement/Battle/Feel/VFX pass、390x844 / 360x800 / 430x932で `canvas=True`, `safeHud=True`, `backgroundCover=True`。
   - U4 LevelUp UI Verification: exit code 0。ProjectVersion OK、ZenMaruGothic font / license found、BattleController clean、TimeScale guard OK、`dawn_ticket` clean。

23. term lock / asset intake / meta / design review結果
   - `pnpm unity:term-lock:check`: passed。
   - `pnpm unity:asset-intake:check`: passed、U5 `productionApproved=0`。
   - `pnpm unity:u8-asset-intake:check`: passed、U8 `productionApproved=0`。
   - `pnpm unity:u8-1-asset-intake:check`: passed、U8.1 `productionApproved=0`。
   - `pnpm unity:u9-2-visual-hardening:check`: passed。
   - `pnpm unity:u10-prefab-ready-visual:check`: passed、manifestItems=8、runtimeIncluded=8、productionApproved=0、screenshots=7。
   - `pnpm unity:u11-prefab-component-proof:check`: passed、screenshots=7、components=16、productionApproved=0。
   - `pnpm unity:meta:check`: passed。
   - `pnpm design:review:verify`: passed。
   - `git diff --check`: passed。

24. Console compile/runtime error有無
   - U11 screenshot batchmodeはexit code 0。
   - U7 / U5 / U4 verification batchmodeはいずれもexit code 0。
   - Unity logにはLicense handshake系のError行と一部Curl callback aborted行が出るが、project compile/runtime errorは見つかっていない。

25. 実機確認はまだnot executedか
   - iPhone / Android実機確認はnot executedのまま。
   - 実機確認を実行済みとは扱わない。

26. 残る未解決懸念
   - Result stats行は原寸では読めるが、正式Prefab化時に実機輝度と小型端末で再確認する。
   - StageSelect node状態labelは小さく、正式化時に表示方法を再検討する。
   - 黒耀化Bは主軸候補だが、最終採用前に緑/黄色粒の人間レビューを継続する。
   - U11はPrefab-like component proofであり、正式Prefab asset / Scene / data bindingは未実装。

27. 次にやること
   - 人間レビューでU10.1分類を確定する。
   - Result / StageSelect正式実装前にPrefab asset化、data binding、Safe Area、SE / haptic hookを設計する。
   - 黒耀化Bを主軸にするか、Aを残すかを人間レビューで決める。
   - iPhone / Android実機確認を別途実行する。
