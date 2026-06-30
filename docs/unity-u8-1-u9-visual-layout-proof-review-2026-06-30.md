# Unity U8.1 / U9 Visual Layout Proof Review

作成日: 2026-06-30

1. Scope
   - U8.1ではU8修正候補3点を再仕上げし、U9ではResult / StageSelect / 黒耀化・rareのvisual proofをUnity Editorで生成した。
   - 正式Result、正式StageSelect、Collection本実装、黒耀化runtime本実装、必殺cut-in runtime本実装、Addressables導入は行っていない。

2. Python/Pillow環境固定結果
   - `requirements.txt` は `Pillow>=12.0.0,<13`。
   - 通常の `python3` はPillow未導入、`.venv/bin/python` はPillow 12.2.0。
   - `package.json` に `python:setup`, `greenback:alpha`, `greenback:alpha:venv` を追加/更新し、`pnpm greenback:alpha` は `.venv/bin/python` 経由で動くようにした。
   - `docs/greenback-to-alpha-tool.md` も `.venv` 運用に更新した。

3. U8 candidate 12点レビュー結果
   - 採用候補: `result_paper_ledger_panel`, `result_rank_wax_seal`, `result_reward_memory_card`, `stageselect_paper_map_base`, `stageselect_route_node`, `stageselect_route_line_ink`, `stageselect_start_marker_lantern`, `levelup_rare_lantern_pulse_ring`, `cutin_black_ink_band`
   - 修正候補: `result_new_badge`, `levelup_rare_ink_flare`, `kokuyou_fullscreen_ink_shadow_source`
   - 却下候補: なし。

4. U8.1で再生成/再仕上げした素材一覧
   - `result_new_badge_refined`
   - `levelup_rare_ink_flare_refined`
   - `kokuyou_fullscreen_ink_shadow_source_refined`
   - 生成数は各1案、合計3点に抑えた。

5. greenback to alpha結果
   - Source: `docs/design-targets/generated/unity-u8-1/greenback/`
   - Alpha: `docs/design-targets/generated/unity-u8-1/alpha/`
   - Report: `docs/design-targets/generated/unity-u8-1/reports/u8-1-alpha-report.json`

6. QA結果
   - 全3点で `greenSpillRemainingPixels=0`、`edgeTouches=false`。
   - `kokuyou_fullscreen_ink_shadow_source_refined` は見た目の緑味を抑えるため、追加のdeterministic hue cleanupを行った。
   - Cleanup report: `docs/design-targets/generated/unity-u8-1/reports/u8-1-kokuyou-green-tint-cleanup-report.json`

7. U8.1 manifest結果
   - Manifest: `docs/design-targets/generated/unity-u8-1/u8-1-visual-refinement-manifest.json`
   - manifest item数は3。
   - 全itemは `productionStatus: "candidate"`、`runtimeIncluded: true`、`textBakedRuntimeImage: false`。

8. U8.1 checker結果
   - `pnpm unity:u8-1-asset-intake:check` を追加した。
   - manifest、source、alpha、runtime、QA、旧 `public/assets/sprites/` 不使用、manifest外 `U8Refined` PNGなしを検査する。

9. U9 Result proof内容
   - Unity Editor一時CanvasでResult proofを生成した。
   - 使用素材: `result_paper_ledger_panel`, `result_rank_wax_seal`, `result_reward_memory_card`, `result_new_badge_refined`
   - TMP仮ラベル: `RESULT PROOF`, `RANK`, `TONIGHT'S MEMORY`, reward labels, 仮数値, `CONTINUE`
   - セーブ/報酬処理や正式Resultロジックは追加していない。

10. U9 StageSelect proof内容
    - Unity Editor一時CanvasでStageSelect proofを生成した。
    - 使用素材: `stageselect_paper_map_base`, `stageselect_route_node`, `stageselect_route_line_ink`, `stageselect_start_marker_lantern`
    - TMP仮ラベル: `STAGE SELECT PROOF`, `NIGHT ROAD`, difficulty仮label, `START`
    - ステージ解放、難易度処理、正式StageSelectロジックは追加していない。

11. U9 黒耀化 / rare proof内容
    - `kokuyou_fullscreen_ink_shadow_source_refined` を単独previewし、`levelup_rare_ink_flare_refined` と `levelup_rare_lantern_pulse_ring` を比較配置した。
    - 黒耀化runtime、黒耀化ボタン、ゲージ、必殺cut-in runtimeは追加していない。

12. screenshot結果
    - `docs/design-targets/generated/unity-u9/screenshots/u9-result-proof-390x844.png`
    - `docs/design-targets/generated/unity-u9/screenshots/u9-result-proof-360x800.png`
    - `docs/design-targets/generated/unity-u9/screenshots/u9-result-proof-430x932.png`
    - `docs/design-targets/generated/unity-u9/screenshots/u9-stageselect-proof-390x844.png`
    - `docs/design-targets/generated/unity-u9/screenshots/u9-stageselect-proof-360x800.png`
    - `docs/design-targets/generated/unity-u9/screenshots/u9-stageselect-proof-430x932.png`
    - `docs/design-targets/generated/unity-u9/screenshots/u9-kokuyou-rare-proof-390x844.png`
    - Contact sheets: `u9-result-proof-contact-sheet.png`, `u9-stageselect-proof-contact-sheet.png`

13. 390x844 / 360x800 / 430x932確認
    - Result proofは3解像度で出力済み。
    - StageSelect proofは3解像度で出力済み。
    - 黒耀化 / rare proofは390x844で出力済み。
    - 実機ではなくEditor batchmode screenshotでの確認。

14. 採用候補 / 修正候補 / 却下候補
    - 採用候補: U8採用候補9点 + U8.1 refined 3点。
    - 修正候補: 黒耀化refinedは緑味を抑えたが、最終採用前に人間レビュー継続。
    - 却下候補: なし。

15. U5/U8/U8.1素材がcandidateのままか
    - U5素材8点はcandidateのまま。
    - U8素材12点はcandidateのまま。
    - U8.1素材3点もcandidateのまま。

16. productionApproved=0か
    - U5/U8/U8.1のmanifestでproduction approved昇格はしていない。
    - U8.1 manifestの `productionApprovedCount` は0。

17. Resources/U5Candidates / U8Candidates / U8Refined がproof-onlyか
    - `Resources/U5Candidates` はproof-only維持。
    - `Resources/U8Candidates` はproof-only維持。
    - `Resources/U8Refined` はU8.1 proof-onlyとして追加した。

18. text-baked imageがないか
    - U8.1画像には文字、数字、ロゴ、透かしを焼き込んでいない。
    - U9 proofの文字はUnityのTextMeshProで重ねている。

19. 正式Result/StageSelect実装をしていないこと
    - 正式Scene、正式遷移、報酬処理、セーブ処理、Stage解放処理は追加していない。
    - U9はEditor screenshot用の一時Canvas proofのみ。

20. 黒耀化runtimeを実装していないこと
    - 黒耀化runtime、ゲージ、ボタン、必殺cut-in runtimeは追加していない。

21. Addressablesを導入していないこと
    - Addressables package、catalog、profile、runtime loading pathは追加していない。

22. U7.1 TimeScale / AssetProvider verification結果
    - U7 TimeScale Service Verification: 全case OK、`TimeScale final: 1`、`Service final scale: 1`。
    - U7 AssetProvider Verification: provider proof-only、U5 proof sprite load、`BattleController` に `Resources.Load` / `U5Candidates` / U5 asset id / card UI generationなし、Addressables参照なし。

23. U4/U5 verification結果
    - U5 Visual Candidate Verification: exit code 0。390x844 / 360x800 / 430x932で `canvas=True`, `safeHud=True`, `backgroundCover=True`。
    - U4 LevelUp UI Verification: exit code 0。ZenMaruGothic font / license found、BattleController card UI clean、TimeScale guard OK、`dawn_ticket` clean。

24. term lock / asset intake / meta check結果
    - `pnpm unity:term-lock:check`: passed。
    - `pnpm unity:asset-intake:check`: passed、U5 `productionApproved=0`。
    - `pnpm unity:u8-asset-intake:check`: passed、U8 `productionApproved=0`。
    - `pnpm unity:u8-1-asset-intake:check`: passed、U8.1 `productionApproved=0`。
    - `pnpm unity:meta:check`: passed、159 unique GUIDs。
    - `pnpm design:review:verify`: passed。
    - `git diff --check`: passed。

25. Console compile/runtime error有無
    - Unity batchmode compile、U7、U5、U4、U8 screenshot、U9 screenshotはいずれもexit code 0。
    - Unity logにはLicense handshake系のError行が出るが、project compile/runtime errorは見つかっていない。

26. 実機確認はまだnot executedか
    - iPhone / Android実機確認はnot executedのまま。
    - 実機確認を実行済みとは扱わない。

27. 残る未解決懸念
    - 黒耀化refinedの緑味はdeterministic cleanupで抑えたが、最終採用前に人間レビューが必要。
    - StageSelect route lineは静かで上品だが、最終UIではもう少し視認性を上げる余地がある。
    - U9 proofは売れる見た目へのlayout proofであり、Prefab設計や本実装は未着手。

28. 次にやること
    - 人間レビューでU8.1 refined 3点の採用/再修正を決める。
    - Result / StageSelectを正式実装する前に、Prefab分解とTMP文言を設計する。
    - 実機確認は別途iPhone / Androidで実行する。
