# Unity U10 Prefab-ready Visual Asset & Proof Pass Review

作成日: 2026-06-30

実行確認日: 2026-07-01 JST

1. Scope
   - U10ではResult / StageSelect / 黒耀化 / rare / cut-in向けのPrefab-ready proof-only候補を追加した。
   - 正式Result実装、正式StageSelect実装、報酬ロジック、セーブ処理、Stage解放処理、黒耀化runtime、黒耀化ゲージ / ボタン、必殺cut-in runtime、Addressables導入、production approved昇格は行っていない。

2. U9.2 review doc修正結果
   - `docs/unity-u9-2-font-prefab-visual-hardening-review-2026-06-30.md` の `git diff --check` 記述を修正した。
   - 修正後は `git diff --check: passed。whitespace errorなし。Unityによる既存meta file正規化は発生したが、diff check上の問題はなし。` の意味に揃えた。

3. Codex画像生成で作ったcandidate素材一覧
   - Result: `result_continue_paper_button`, `result_stats_ink_strip`
   - StageSelect: `stageselect_route_active_node`, `stageselect_route_locked_node`
   - 黒耀化: `kokuyou_fullscreen_final_candidate_a`, `kokuyou_fullscreen_final_candidate_b`
   - LevelUp rare: `levelup_rare_memory_tear_burst`
   - Cut-in: `cutin_black_ink_band_final_candidate`
   - 合計8点。すべてcandidateでありproduction approvedではない。

4. 生成prompt方針
   - すべてsolid chroma key green背景、文字なし、数字なし、ロゴなし、透かしなしで生成した。
   - 紙UI、黒インク、ランタン光、記憶、静かな報酬感を軸にした。
   - 黒耀化は緑味、黄色particle、可愛いsparkle、ホラー過剰、キャラ顔の混入を避ける方針にした。

5. greenback to alpha結果
   - Source: `docs/design-targets/generated/unity-u10/greenback/`
   - Alpha: `docs/design-targets/generated/unity-u10/alpha/`
   - Report: `docs/design-targets/generated/unity-u10/reports/u10-alpha-report.json`
   - 全8点で `greenSpillRemainingPixels=0`、`edgeTouches=false`。
   - `kokuyou_fullscreen_final_candidate_a` は上端余白が小さかったため、greenback上に余白を追加して再処理した。

6. QA結果
   - 全8点でreal alpha channelを確認した。
   - 画像内の文字、数字、ロゴ、透かしは見つけていない。
   - U10生成物はdeterministic hue cleanup後、`remainingGreenHuePixels=0`。
   - Cleanup report: `docs/design-targets/generated/unity-u10/reports/u10-green-tint-cleanup-report.json`
   - 比較用に置いた既存U8/U8.1素材には緑/黄色寄りの点が残って見えるため、人間レビュー時はU10生成物と既存baselineを分けて判断する。

7. U10 manifest結果
   - Manifest: `docs/design-targets/generated/unity-u10/u10-prefab-ready-visual-candidate-manifest.json`
   - manifest item数は8。
   - `productionApprovedCount=0`。
   - 全itemは `productionStatus: "candidate"`、`runtimeIncluded: true`、`textBakedRuntimeImage: false`。

8. U10 checker結果
   - `pnpm unity:u10-prefab-ready-visual:check`: passed。
   - manifest、QA report、runtime path、screenshots、productionApproved=0、text-bakedなし、Addressablesなし、正式Result / StageSelect / 黒耀化runtime hookなしを検査した。

9. Result prefab-ready proof内容
   - U9.2構成を維持し、`result_continue_paper_button` と `result_stats_ink_strip` を追加した。
   - ResultRoot / ResultPaperLedgerPanel / ResultRewardCard / ResultStatsLine / ResultContinueButton / PaperLabel相当の分解を意識したEditor screenshot proof。
   - 報酬ロジック、セーブ処理、正式Scene化は行っていない。

10. StageSelect prefab-ready proof内容
    - U9.2 Route Aを基本採用し、`stageselect_route_active_node` と `stageselect_route_locked_node` で状態差分を強めた。
    - StageSelectRoot / StageMapPanel / StageRouteLine / StageRouteNode active/inactive/locked / StageLanternMarker / StageInfoPanel / StageStartButton相当の分解を意識したEditor screenshot proof。
    - Route B glowは通常表示には採用せず、将来Animation候補として残す。
    - Stage解放ロジック、難易度処理、正式Scene化は行っていない。

11. 黒耀化 / rare / cut-in比較結果
    - `kokuyou_fullscreen_final_candidate_a` と `kokuyou_fullscreen_final_candidate_b` はU8.1 refinedより赤黒 / 紫黒の方向が明確になった。
    - rareの `levelup_rare_memory_tear_burst` は通常VFXより特別だが、黒耀化より弱い位置づけとして候補維持。
    - `cutin_black_ink_band_final_candidate` は横長bandとしてTMPを載せる余白がある。
    - 比較用の既存U8/U8.1素材は黄色/緑寄りの粒が残るため、U10候補側を優先レビュー対象にする。

12. screenshot結果
    - `docs/design-targets/generated/unity-u10/screenshots/u10-result-prefab-ready-proof-390x844.png`
    - `docs/design-targets/generated/unity-u10/screenshots/u10-result-prefab-ready-proof-360x800.png`
    - `docs/design-targets/generated/unity-u10/screenshots/u10-result-prefab-ready-proof-430x932.png`
    - `docs/design-targets/generated/unity-u10/screenshots/u10-stageselect-prefab-ready-proof-390x844.png`
    - `docs/design-targets/generated/unity-u10/screenshots/u10-stageselect-prefab-ready-proof-360x800.png`
    - `docs/design-targets/generated/unity-u10/screenshots/u10-stageselect-prefab-ready-proof-430x932.png`
    - `docs/design-targets/generated/unity-u10/screenshots/u10-kokuyou-rare-cutin-comparison-390x844.png`
    - Contact sheets: `u10-result-contact-sheet.png`, `u10-stageselect-contact-sheet.png`, `u10-all-proof-contact-sheet.png`, `u10-alpha-contact-sheet.png`

13. 390x844 / 360x800 / 430x932確認
    - Result proofは3解像度で出力済み。下部stats行と「次へ」ボタンは表示されるが、stats行テキストは正式実装前に実機で再確認する。
    - StageSelect proofは3解像度で出力済み。active / locked nodeの差分は出ている。
    - 黒耀化 / rare / cut-in比較は390x844で出力済み。
    - 実機ではなくEditor batchmode screenshotでの確認。

14. 採用候補 / 修正候補 / 却下候補
    - 採用候補: `result_continue_paper_button`, `result_stats_ink_strip`, `stageselect_route_active_node`, `stageselect_route_locked_node`, `kokuyou_fullscreen_final_candidate_a`, `kokuyou_fullscreen_final_candidate_b`, `levelup_rare_memory_tear_burst`, `cutin_black_ink_band_final_candidate`
    - 修正候補: Result stats行はTMP文字が小さく見えるため正式Prefab時にサイズと背景濃度を再調整する。
    - 却下候補: 現時点で即rejectはなし。

15. Route A採用方針 / Route B animation候補方針
    - U10でもRoute Aを基本方針として維持した。
    - Route Bのglowは通常表示に採用せず、将来の灯火Animation候補としてdoc上に残す。

16. U5/U8/U8.1/U10素材がcandidateのままか
    - U5素材8点はcandidateのまま。
    - U8素材12点はcandidateのまま。
    - U8.1素材3点はcandidateのまま。
    - U10素材8点もcandidateのまま。

17. productionApproved=0か
    - U5 / U8 / U8.1 / U10いずれもproduction approvedへ昇格していない。
    - U10 manifestの `productionApprovedCount` は0。

18. Resources系がproof-onlyか
    - `Resources/U5Candidates` はproof-only維持。
    - `Resources/U8Candidates` はproof-only維持。
    - `Resources/U8Refined` はproof-only維持。
    - `Resources/U10Candidates` はproof-onlyとして追加した。

19. text-baked imageがないか
    - U10生成画像には文字、数字、ロゴ、透かしを焼き込んでいない。
    - Result / StageSelect / comparison screenshotの表示文字はUnity TextMeshProで重ねている。

20. 正式Result/StageSelect実装をしていないこと
    - 正式Scene、正式遷移、報酬処理、セーブ処理、Stage解放処理は追加していない。
    - U10はEditor screenshot用の一時Canvas proofのみ。

21. 黒耀化runtimeを実装していないこと
    - 黒耀化runtime、黒耀化ゲージ、黒耀化ボタン、必殺cut-in runtimeは追加していない。

22. Addressablesを導入していないこと
    - Addressables package、catalog、profile、runtime loading pathは追加していない。

23. ZenMaruGothic SDFの状態
    - U9.2の正式ベイク済み `ZenMaruGothic-Medium SDF.asset` を使用した。
    - U10ではSDF assetの内容変更は行っていない。
    - batchmodeロード時の `glyphTable.Count=0` 表示はU9.2と同じ既知の表示で、スクリーンショット描画は完了している。

24. U7.1 TimeScale / AssetProvider verification結果
    - U7 TimeScale Service Verification: exit code 0。全case OK、`TimeScale final: 1`、`Service final scale: 1`。
    - U7 AssetProvider Verification: exit code 0。provider proof-only、U5 proof sprite load、BattleControllerに `Resources.Load` / `U5Candidates` / U5 asset id / card UI generationなし、Addressables参照なし。

25. U4/U5 verification結果
    - U5 Visual Candidate Verification: exit code 0。AssetsLoaded全OK、Movement/Battle/Feel/VFX pass、390x844 / 360x800 / 430x932で `canvas=True`, `safeHud=True`, `backgroundCover=True`。
    - U4 LevelUp UI Verification: exit code 0。ProjectVersion OK、ZenMaruGothic font / license found、BattleController clean、TimeScale guard OK、`dawn_ticket` clean。

26. term lock / asset intake / meta / design review結果
    - `pnpm unity:term-lock:check`: passed。
    - `pnpm unity:asset-intake:check`: passed、U5 `productionApproved=0`。
    - `pnpm unity:u8-asset-intake:check`: passed、U8 `productionApproved=0`。
    - `pnpm unity:u8-1-asset-intake:check`: passed、U8.1 `productionApproved=0`。
    - `pnpm unity:u9-2-visual-hardening:check`: passed。
    - `pnpm unity:u10-prefab-ready-visual:check`: passed、manifestItems=8、runtimeIncluded=8、productionApproved=0、screenshots=7。
    - `pnpm unity:meta:check`: passed。
    - `pnpm design:review:verify`: passed。
    - `git diff --check`: passed。

27. Console compile/runtime error有無
    - U10 screenshot batchmodeはexit code 0。
    - U7 / U5 / U4 verification batchmodeはいずれもexit code 0。
    - Unity logにはLicense handshake系のError行と一部Curl callback aborted行が出るが、project compile/runtime errorは見つかっていない。

28. 実機確認はまだnot executedか
    - iPhone / Android実機確認はnot executedのまま。
    - 実機確認を実行済みとは扱わない。

29. 残る未解決懸念
    - Result stats行のTMP可読性は正式Prefab化時に再調整する。
    - 既存U8/U8.1比較素材には黄色/緑寄りの粒が残って見えるため、U10候補と混同しない。
    - U10はPrefab-ready proofであり、正式Prefab asset / Scene / data bindingは未実装。
    - 実機Safe Area、端末輝度、端末上の文字可読性は未確認。

30. 次にやること
    - 人間レビューでU10候補8点の採用 / 再修正を決める。
    - Result / StageSelect正式実装に入る前にPrefab設計、TMP文言、data binding、Safe Area確認を切り分ける。
    - 黒耀化runtime、rare演出runtime、cut-in runtimeは別passで設計する。
    - iPhone / Android実機確認を別途実行する。
