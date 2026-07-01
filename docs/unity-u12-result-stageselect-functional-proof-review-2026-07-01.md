# Unity U12 Result / StageSelect Functional Proof Review

作成日: 2026-07-01

1. Scope
   - U12ではU11のPrefab-like component proofをformal実装前のfunctional proofへ進めた。
   - 正式Result Scene、正式StageSelect Scene、正式Prefab asset、save、reward反映、Stage解放、difficulty本番計算、黒耀化runtime、黒耀化ゲージ / ボタン、必殺cut-in runtime、Addressables、production approved昇格は行っていない。

2. U11残懸念の小修正結果
   - Result stats行は `欠片 12 / 記憶 3 / 加護 +3` の短文3分割へ変更した。
   - Stats背景はU10 stripを薄い装飾に下げ、3つの低濃度chipを追加して360x800で読ませる形にした。
   - StageSelect node上の `選択中 / 未解放` 小文字labelは削除した。
   - active / locked nodeはsprite差分と明度差で読む方針へ寄せ、選択状態はInfoPanel側に移した。
   - 黒耀化Bの緑/黄色粒の人間レビュー継続は未解決懸念として維持した。

3. Result functional proof内容
   - `ResultFunctionalProofController` からU11 Result componentへ仮データを注入した。
   - `ResultRootProof`, `ResultPaperLedgerPanelProof`, `ResultRewardCardProof`, `ResultStatsLineProof`, `ResultContinueButtonProof` のcomponent構成は維持した。
   - Result正式Scene化、報酬ロジック、save、clear/fail本番判定は作っていない。

4. ResultProofData内容
   - Rank: `A`
   - MemoryCount: `3`
   - FragmentCount: `12`
   - BlessingCount: `3`
   - ElapsedTime: `08:00`
   - DefeatedEnemies: `128`
   - RewardCards: `記憶 / 墨 / 灯`
   - 表示値は `ResultProofData` に集約し、UI部品側へ散らさない方針にした。

5. StageSelect functional proof内容
   - `StageSelectFunctionalProofController` からU11 StageSelect componentへ仮ステージデータを注入した。
   - `StageSelectRootProof`, `StageMapPanelProof`, `StageRouteLineProof`, `StageRouteNodeProof`, `StageLanternMarkerProof`, `StageInfoPanelProof`, `StageStartButtonProof` のcomponent構成は維持した。
   - StageSelect正式Scene化、Stage解放ロジック、difficulty本番計算は作っていない。

6. StageProofData内容
   - `stage_01`: `はじまりの路地` / `やさしい` / selected / unlocked
   - `stage_02`: `灯りの曲がり角` / `ふつう` / locked / not unlocked
   - `stage_03`: `黒い橋` / `ふつう` / locked / not unlocked
   - active / locked node状態はこの仮データから反映する。

7. Button押下hook内容
   - `PaperButtonProof` にproof-onlyの `OnClickProof()` とUnity `Button` を追加した。
   - Result buttonは `result_continue` のbutton hook logを出す。
   - StageSelect buttonは `stage_start` のbutton hook logを出す。
   - U12 screenshot batchmode内で各解像度ごとにhookを呼び、`result hook invoked: result_continue` と `stage hook invoked: stage_start` を確認した。
   - 実Scene遷移、save、reward反映、Stage開始、Stage解放APIには接続していない。

8. 黒耀化 / rare / cut-in review継続結果
   - `kokuyou_fullscreen_final_candidate_b`: 主軸候補を維持。
   - `kokuyou_fullscreen_final_candidate_a`: 保留候補を維持。
   - `levelup_rare_memory_tear_burst`: 採用候補を維持。
   - `cutin_black_ink_band_final_candidate`: 採用候補を維持。
   - 黒耀化Bは最終採用前に緑/黄色粒の人間レビューを継続する。
   - U12では画像再生成は未実施。

9. screenshot結果
   - `docs/design-targets/generated/unity-u12/screenshots/u12-result-functional-proof-390x844.png`
   - `docs/design-targets/generated/unity-u12/screenshots/u12-result-functional-proof-360x800.png`
   - `docs/design-targets/generated/unity-u12/screenshots/u12-result-functional-proof-430x932.png`
   - `docs/design-targets/generated/unity-u12/screenshots/u12-stageselect-functional-proof-390x844.png`
   - `docs/design-targets/generated/unity-u12/screenshots/u12-stageselect-functional-proof-360x800.png`
   - `docs/design-targets/generated/unity-u12/screenshots/u12-stageselect-functional-proof-430x932.png`
   - `docs/design-targets/generated/unity-u12/screenshots/u12-kokuyou-rare-cutin-review-390x844.png`
   - Contact sheets: `u12-result-contact-sheet.png`, `u12-stageselect-contact-sheet.png`, `u12-all-proof-contact-sheet.png`

10. 390x844 / 360x800 / 430x932確認
    - Result: 3解像度で出力済み。360x800でstats行の短文3ラベルを読めるように調整した。
    - StageSelect: 3解像度で出力済み。node上の小文字labelを削除し、InfoPanelで `はじまりの路地 / やさしい / 選択中` を読む形にした。
    - 黒耀化 / rare / cut-in review: 390x844で出力済み。
    - 確認はEditor batchmode screenshotであり、実機確認はnot executed。

11. 採用候補 / 再修正候補 / 保留候補 / 却下候補
    - 採用候補: `result_continue_paper_button`, `result_stats_ink_strip`, `stageselect_route_active_node`, `stageselect_route_locked_node`, `kokuyou_fullscreen_final_candidate_b`, `levelup_rare_memory_tear_burst`, `cutin_black_ink_band_final_candidate`
    - 再修正候補: Result stats行は実機輝度で再確認する。StageSelect locked nodeは実機輝度で沈みすぎないか確認する。
    - 保留候補: `kokuyou_fullscreen_final_candidate_a`
    - 却下候補: なし。

12. Route A採用方針 / Route B animation候補方針
    - Route Aを通常表示の採用方針として維持した。
    - Route B glowは通常表示に使わず、将来Animation候補として残す。

13. U5/U8/U8.1/U10/U12素材がcandidateのままか
    - U5 / U8 / U8.1 / U10素材はcandidateのまま。
    - U12では新規画像素材を生成していない。
    - U12用manifestやnew production assetは追加していない。

14. productionApproved=0か
    - productionApproved=0を維持。
    - U5 / U8 / U8.1 / U10 checkerでproduction approved昇格なしを確認する。

15. Resources系がproof-onlyか
    - `Resources/U5Candidates` はproof-only維持。
    - `Resources/U8Candidates` はproof-only維持。
    - `Resources/U8Refined` はproof-only維持。
    - `Resources/U10Candidates` はproof-only維持。
    - `Resources/U12Proof` は作成していない。

16. text-baked imageがないか
    - Result / StageSelect / review screenshotの表示文字はTMPで重ねている。
    - U12でUI文字を画像へ焼き込んでいない。

17. 正式Result/StageSelect実装をしていないこと
    - 正式Result/StageSelect実装をしていない。
    - 正式Scene、正式Prefab asset、正式runtime transition、正式data sourceは追加していない。

18. 報酬/セーブ/Stage解放ロジックを作っていないこと
    - 報酬反映、save、Stage解放、difficulty本番計算は追加していない。
    - `ResultProofData` / `StageProofData` は表示用の仮データである。

19. 黒耀化runtimeを実装していないこと
    - 黒耀化runtime、黒耀化ゲージ、黒耀化ボタン、必殺cut-in runtimeは追加していない。

20. Addressablesを導入していないこと
    - Addressables package、catalog、profile、runtime loading pathは追加していない。

21. ZenMaruGothic SDFの状態
    - U12 screenshotでは `Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset` を使用した。
    - batchmodeロード時の `glyphs=0` 表示はU9.2 / U10 / U11と同じ既知の表示で、描画は完了している。
    - Unity batchmodeがSDF assetを再シリアライズした場合はcommit前に差分を戻す。

22. U7.1 TimeScale / AssetProvider verification結果
    - U7 TimeScale Service Verification: exit code 0。全case OK、`TimeScale final: 1`、`Service final scale: 1`、`Service final reason: force-restore`。
    - U7 AssetProvider Verification: exit code 0。provider proof-only、battle visuals load、BattleControllerに `Resources.Load` / `U5Candidates` / U5 asset id / card UI generationなし、Addressables参照なし。

23. U4/U5 verification結果
    - U5 Visual Candidate Verification: exit code 0。AssetsLoaded全OK、Movement/Battle/Feel/VFX pass、390x844 / 360x800 / 430x932で `canvas=True`, `safeHud=True`, `backgroundCover=True`。
    - U4 LevelUp UI Verification: exit code 0。ProjectVersion OK、ZenMaruGothic font / license found、BattleController clean、TimeScale guard OK、`dawn_ticket` clean。

24. term lock / asset intake / meta / design review結果
    - `pnpm unity:term-lock:check`: passed。
    - `pnpm unity:asset-intake:check`: passed、U5 `productionApproved=0`。
    - `pnpm unity:u8-asset-intake:check`: passed、U8 `productionApproved=0`。
    - `pnpm unity:u8-1-asset-intake:check`: passed、U8.1 `productionApproved=0`。
    - `pnpm unity:u9-2-visual-hardening:check`: passed。
    - `pnpm unity:u10-prefab-ready-visual:check`: passed、U10 `productionApproved=0`。
    - `pnpm unity:u11-prefab-component-proof:check`: passed。
    - `pnpm unity:u12-functional-proof:check`: passed。
    - `pnpm unity:meta:check`: passed。
    - `pnpm design:review:verify`: passed。
    - `git diff --check`: passed。

25. Console compile/runtime error有無
    - U12 screenshot batchmodeはexit code 0。
    - U7 / U5 / U4 verification batchmodeはexit code 0。
    - Unity logには既知のLicense handshake系Error行が出るが、C# compile error、U12 exception、project runtime errorは見つかっていない。

26. 実機確認はまだnot executedか
    - iPhone / Android実機確認はnot executed。
    - 実機確認を実行済みとは扱わない。

27. 残る未解決懸念
    - Result stats行はEditor screenshotでは改善したが、実機輝度と小型端末で再確認する。
    - StageSelect locked nodeはラベルを削ったため、正式化時に明度差と選択誘導を実機で確認する。
    - 黒耀化Bの緑/黄色粒は最終採用前に人間レビューを継続する。
    - U12はfunctional proofであり、正式Prefab asset / Scene / production data bindingは未実装。

28. 次にやること
    - U13以降でResult / StageSelect正式Prefab asset化とScene導線を設計する。
    - production data source、save、reward反映、Stage解放、difficulty計算を別passで実装する。
    - SE / haptic hookを正式操作設計に接続する。
    - 黒耀化runtime、黒耀化ゲージ / ボタン、必殺cut-in runtimeを別passで設計する。
    - iPhone / Android実機確認を別途実行する。
