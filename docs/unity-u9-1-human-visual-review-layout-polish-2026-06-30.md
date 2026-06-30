# Unity U9.1 Human Visual Review & Layout Polish

作成日: 2026-06-30

1. Scope
   - U9のResult / StageSelect / 黒耀化・rare visual proofをレビューし、TMP文言のヨルノシルベ寄せとレイアウト微調整を行った。
   - AI画像生成は行っていない。外部画像生成APIも使用していない。
   - 正式Result、正式StageSelect、黒耀化runtime、必殺cut-in runtime、Addressablesは導入していない。

2. AI画像生成なしで行ったこと
   - U9スクリーンショット7枚の人間目線レビュー。
   - TMP仮ラベルを英語からヨルノシルベ世界観の日本語に変更。
   - Result proofの封蝋・報酬カード・バッジのサイズと余白を微調整。
   - StageSelect proofのroute line太さ・色・nodeサイズ・lantern markerサイズを視認性向上のため調整。
   - ZenMaruGothic-Medium.ttfからランタイムTMP_FontAssetを生成し、日本語テキスト描画を実現。
   - 3解像度でスクリーンショット再生成。
   - Contact sheet 2枚を生成。

3. U9 screenshots review結果
   - Result proof: 紙の台帳UI・封蝋RANK・ランタン光の構成は良い。「記憶帳」の雰囲気が出ている。安っぽい金ピカUIにはなっていない。
   - StageSelect proof: 紙地図ベースは良い方向。U9時点ではroute lineが薄く、nodeが小さめだった。
   - 黒耀化/rare proof: refined flareは赤紫黒のインク系で、緑味は大幅に抑えられている。pulse ringとflareの差別化は十分。
   - 390x844: 全画面で読める。余白バランスも許容範囲。
   - 360x800: 下部がやや詰まるが破綻なし。
   - 430x932: 間延びは少ない。紙パネルの上下余白がちょうど良い。

4. Result proof polish内容
   - `RESULT PROOF` → `今夜の記録`
   - `TONIGHT'S MEMORY` → `拾った記憶`
   - `CONTINUE` → `次へ`
   - `Recovered fragments 12  Dawn bonus +3` → `拾った欠片 12  朝の加護 +3`
   - reward cardラベル: `MEMORY/INK/LIGHT` → `記憶/墨/灯`
   - 封蝋サイズ: 104x104 → 96x96
   - new badge refined: 68x68 → 58x58
   - reward card: 76x104 → 78x108（余白改善）
   - 紙パネル高さ: 560 → 540（上下バランス改善）
   - 「次へ」ボタン幅: 220 → 200（控えめに）
   - フォント: LiberationSans SDF → ZenMaruGothic-Medium（ランタイム生成）
   - 報酬ロジック・セーブ処理・正式Scene化は行っていない。
   - 画像に文字は焼き込んでいない。

5. StageSelect proof polish内容
   - `STAGE SELECT PROOF` → `今夜の行き先`
   - `NIGHT ROAD` → `夜の路地`
   - `START` → `出発`
   - `quiet route / lantern ready` → `静かな道 / 灯が見える`
   - route line太さ: 22px → 26-28px
   - route line色: 白 → ダークインク茶(0.2, 0.12, 0.08, alpha=0.92)で地図上の視認性向上
   - nodeサイズ: 48x48 → 54x54
   - lantern marker: 70x86 → 78x96、暖色tint(1.0, 0.97, 0.88, 1.0)追加
   - 下部パネル位置: y=-304 → y=-290（safe area余地を確保）
   - ステージ解放ロジック・難易度処理・正式Scene化は行っていない。
   - 画像に地名や文字は焼き込んでいない。

6. 黒耀化 / rare proof review結果
   - `kokuyou_fullscreen_ink_shadow_source_refined`: 全体的に赤紫黒のインク系。上部particleの散りに若干の黄緑系が残る可能性があるが、大幅改善済み。人間レビュー継続が必要。
   - `levelup_rare_ink_flare_refined` と `levelup_rare_lantern_pulse_ring` の差別化: 十分。flareは墨の爆発、ringは暖色の輪で明確に読み分けできる。
   - キャプション: `refined flare` → `墨の爆発 (refined)`、`U8 pulse ring` → `灯の脈動 (U8)`
   - 黒耀化runtime、ゲージ、ボタン、必殺cut-in runtimeは追加していない。
   - 画像加工は行っていない（U8.1で実施済みのdeterministic cleanupの結果をそのまま使用）。

7. screenshot結果
   - `docs/design-targets/generated/unity-u9-1/screenshots/u9-1-result-proof-390x844.png`
   - `docs/design-targets/generated/unity-u9-1/screenshots/u9-1-result-proof-360x800.png`
   - `docs/design-targets/generated/unity-u9-1/screenshots/u9-1-result-proof-430x932.png`
   - `docs/design-targets/generated/unity-u9-1/screenshots/u9-1-stageselect-proof-390x844.png`
   - `docs/design-targets/generated/unity-u9-1/screenshots/u9-1-stageselect-proof-360x800.png`
   - `docs/design-targets/generated/unity-u9-1/screenshots/u9-1-stageselect-proof-430x932.png`
   - `docs/design-targets/generated/unity-u9-1/screenshots/u9-1-kokuyou-rare-proof-390x844.png`
   - Contact sheets: `u9-1-result-proof-contact-sheet.png`, `u9-1-stageselect-proof-contact-sheet.png`

8. 390x844 / 360x800 / 430x932確認
   - Result proof: 3解像度で出力・確認済み。日本語テキストはZenMaruGothicで描画。
   - StageSelect proof: 3解像度で出力・確認済み。route lineの視認性がU9より改善。
   - 黒耀化 / rare proof: 390x844で出力・確認済み。
   - 実機ではなくEditor batchmode screenshotでの確認。

9. 採用候補 / 修正候補 / 却下候補
   - 採用候補: U8採用候補9点 + U8.1 refined 3点（変更なし）。
   - 修正候補: 黒耀化refinedは緑味を抑え済みだが、上部particleの黄緑残りについて人間レビュー継続。
   - 却下候補: なし。

10. U5/U8/U8.1素材がcandidateのままか
    - U5素材8点はcandidateのまま。
    - U8素材12点はcandidateのまま。
    - U8.1素材3点もcandidateのまま。
    - U9.1では素材のproductionStatus変更は行っていない。

11. productionApproved=0か
    - U5/U8/U8.1のmanifestでproduction approved昇格はしていない。
    - `pnpm unity:asset-intake:check`: productionApproved=0。
    - `pnpm unity:u8-asset-intake:check`: productionApproved=0。
    - `pnpm unity:u8-1-asset-intake:check`: productionApproved=0。

12. Resources系がproof-onlyか
    - `Resources/U5Candidates` はproof-only維持。
    - `Resources/U8Candidates` はproof-only維持。
    - `Resources/U8Refined` はproof-only維持。

13. text-baked imageがないか
    - U9.1で画像への文字、数字、ロゴ、透かしの焼き込みは行っていない。
    - すべてのテキストはUnityのTextMeshProで重ねている。

14. 正式Result/StageSelect実装をしていないこと
    - 正式Scene、正式遷移、報酬処理、セーブ処理、Stage解放処理は追加していない。
    - U9.1はEditor screenshot用の一時Canvas proofのみ。

15. 黒耀化runtimeを実装していないこと
    - 黒耀化runtime、ゲージ、ボタン、必殺cut-in runtimeは追加していない。

16. Addressablesを導入していないこと
    - Addressables package、catalog、profile、runtime loading pathは追加していない。

17. U7.1 TimeScale / AssetProvider verification結果
    - U7 TimeScale Service Verification: 前回U9時点で全case OK。U9.1ではTimeScale関連コードに変更なし。
    - U7 AssetProvider Verification: 前回U9時点でprovider proof-only確認済み。U9.1ではAssetProvider関連コードに変更なし。

18. U4/U5 verification結果
    - U5 Visual Candidate Verification: 前回U9時点でexit code 0。U9.1ではU5関連コードに変更なし。
    - U4 LevelUp UI Verification: 前回U9時点でexit code 0。U9.1ではU4関連コードに変更なし。

19. term lock / asset intake / meta check結果
    - `pnpm unity:term-lock:check`: passed。
    - `pnpm unity:asset-intake:check`: passed、productionApproved=0。
    - `pnpm unity:u8-asset-intake:check`: passed、productionApproved=0。
    - `pnpm unity:u8-1-asset-intake:check`: passed、productionApproved=0。
    - `pnpm unity:meta:check`: passed。
    - `pnpm design:review:verify`: passed。
    - `git diff --check`: passed。

20. Console compile/runtime error有無
    - Unity batchmode compile: exit code 0。
    - U9.1 screenshot生成: exit code 0。
    - Unity logにはLicense handshake系のError行が出るが、project compile/runtime errorは見つかっていない。
    - `-nographics`ではURP Renderer2DがサーフェスエラーになるためGPUありで実行した。

21. 実機確認はまだnot executedか
    - iPhone / Android実機確認はnot executedのまま。
    - 実機確認を実行済みとは扱わない。

22. 残る未解決懸念
    - 黒耀化refinedの上部particle散りに黄緑系が若干残る可能性がある。最終採用前に人間レビューが必要。
    - StageSelect route lineはU9より視認性が上がったが、最終UIではさらに太い描線やglow表現を検討する余地がある。
    - Result proofのreward card下のラベル（記憶/墨/灯）はフォントサイズが小さく、実機での可読性を確認したい。
    - U9.1はプルーフ段階であり、Prefab設計や本実装は未着手。
    - ZenMaruGothicのTMP SDF Font Assetをプロジェクトに正式にベイクする作業が残っている（現在はランタイム生成）。

23. 次にやること
    - 人間レビューでU8.1 refined 3点の採用/再修正を最終判断する。
    - ZenMaruGothicのTMP SDF Font Assetを正式にプロジェクトへベイクする。
    - Result / StageSelectを正式実装する前に、Prefab分解とTMP文言を設計する。
    - 実機確認は別途iPhone / Androidで実行する。
