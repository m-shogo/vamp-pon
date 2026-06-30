# Unity U8 Visual Candidate Expansion Review

作成日: 2026-06-30

1. Scope
   - U8ではResult、StageSelect、LevelUp rare、黒耀化 / cut-in向けに12点の候補素材を追加した。
   - 正式Result、StageSelect、Collection、黒耀化画面実装、Addressables登録、正式Provider接続は未実施。

2. Candidates
   - Result: `result_paper_ledger_panel`, `result_rank_wax_seal`, `result_reward_memory_card`, `result_new_badge`
   - StageSelect: `stageselect_paper_map_base`, `stageselect_route_node`, `stageselect_route_line_ink`, `stageselect_start_marker_lantern`
   - LevelUp rare: `levelup_rare_ink_flare`, `levelup_rare_lantern_pulse_ring`
   - 黒耀化 / cut-in: `kokuyou_fullscreen_ink_shadow_source`, `cutin_black_ink_band`

3. Prompts
   - すべて solid chroma key green 背景、文字なし、ロゴなし、透かしなし、端接触なし、紙・黒インク・灯りの方向で生成した。
   - `ヨルノシルベ` と `黒耀化` の用語ロックを守り、画像には文字を焼き込んでいない。

4. Alpha
   - `docs/design-targets/generated/unity-u8/greenback/` から `docs/design-targets/generated/unity-u8/alpha/` へ透明PNGを生成した。
   - `cutin_black_ink_band` は初回 `edgeTouches=true` だったため、greenback上に余白を追加して再処理した。

5. QA
   - QA report: `docs/design-targets/generated/unity-u8/reports/u8-alpha-report.json`
   - 全12点で `greenSpillRemainingPixels=0`、`edgeTouches=false`。
   - 数値上のspillは0だが、黒耀化系と封蝋周辺の緑味は人間レビューで色味確認が必要。

6. Manifest
   - Manifest: `docs/design-targets/generated/unity-u8/u8-visual-candidate-manifest.json`
   - 全itemは `productionStatus: "candidate"`、`runtimeIncluded: true`、`textBakedRuntimeImage: false`。

7. Checker
   - `scripts/quality/check-unity-u8-asset-intake.ts` を追加した。
   - `pnpm unity:u8-asset-intake:check` でmanifest、QA、runtime path、旧 `public/assets/sprites/` 不使用、manifest外PNGなしを検査する。

8. Import
   - proof-only runtime root: `unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/`
   - Unity import setup: `unity/VampPonUnity/Assets/_Project/Scripts/Editor/U8VisualCandidateImportSetup.cs`
   - Atlas group想定: UI、VFX、FullscreenArt。

9. Screenshot
   - Screenshot capture: `unity/VampPonUnity/Assets/_Project/Scripts/Editor/U8VisualCandidateScreenshotCapture.cs`
   - Output: `docs/design-targets/generated/unity-u8/screenshots/u8-candidates-390x844.png`, `u8-candidates-360x800.png`, `u8-candidates-430x932.png`
   - Contact sheets: `u8-alpha-contact-sheet.png`, `u8-runtime-contact-sheet.png`

10. U5 / U8 Candidate State
    - U5既存素材とU8追加素材はどちらも候補扱い。
    - 今回の変更はU5正式採用判断を変更しない。

11. Proof-only
    - `Resources/U8Candidates/` は検証用の置き場であり、正式画面からの参照は追加していない。
    - U8 screenshotは候補確認用ギャラリーであり、runtime screenではない。

12. Formal Approval Count
    - `productionApprovedCount=0`。
    - 正式承認済みとして扱うmanifest itemは0。

13. No Text Baked
    - 画像内テキスト、数字、ロゴ、透かしは焼き込んでいない。
    - 実画面で必要な文字はTMP overlayで入れる前提。

14. Art Direction
    - 紙、記憶、黒インク、温かい灯りの方向に寄せた。
    - cyber、glossy、rainbow、強いネオン、旧Web実装の直接コピーは避けた。

15. Adoption
    - 採用検討: `result_paper_ledger_panel`, `result_rank_wax_seal`, `result_reward_memory_card`, `stageselect_paper_map_base`, `stageselect_route_node`, `stageselect_route_line_ink`, `stageselect_start_marker_lantern`, `levelup_rare_lantern_pulse_ring`, `cutin_black_ink_band`

16. Fix
    - 修正検討: `result_new_badge` は形がやや一般的で、Result/Collection上の識別性を上げたい。
    - 修正検討: `levelup_rare_ink_flare` は通常VFXとの差別化をさらに強くできる。
    - 修正検討: `kokuyou_fullscreen_ink_shadow_source` は緑味のあるインク表現を人間レビューで確認したい。
    - U8.1で上記3点のrefined candidateを追加した。U8元素材はcandidateのまま維持し、U8.1素材もproduction approvedにはしていない。

17. Reject
    - 現時点で即rejectはなし。
    - ただし正式採用前に、画面上の実寸配置、TMPとの重なり、モバイル視認性を再確認する。

18. Checks
    - 初期確認: `pnpm unity:term-lock:check`, `pnpm unity:asset-intake:check`, `pnpm unity:meta:check`, `pnpm design:review:verify`
    - U8追加後確認: `pnpm unity:term-lock:check`, `pnpm unity:asset-intake:check`, `pnpm unity:u8-asset-intake:check`, `pnpm unity:meta:check`, `pnpm design:review:verify`, `git diff --check`

19. U7.1 Verification
    - U7.1 TimeScaleとAssetProvider検証を最終確認で再実行し、どちらもexit code 0。
    - U8ではAssetProviderの正式経路を追加していないため、既存U7挙動を維持する。

20. U4 / U5 Verification
    - U4 LevelUp検証とU5 Visual Candidate検証を最終確認で再実行し、どちらもexit code 0。
    - U8 rare素材はU4 overlayの正式実装に接続していない。

21. Console
    - U8 screenshot batchmodeでは処理成功。
    - Unity logにはLicense handshake系のエラー行があるが、batchmode exit codeは0でスクリーンショット生成は完了した。

22. Concerns and Next
    - 素の `python3` ではPillow未導入のため、`pnpm greenback:alpha` が失敗した。同梱Pythonでは成功した。今後、Pillow依存の固定方法を決めたい。
    - 黒耀化系の緑味、Result badgeの汎用感、rare flareの差別化は人間レビュー対象。
    - 次は正式画面のレイアウト検討前に、採用候補だけを小さく再仕上げする。
