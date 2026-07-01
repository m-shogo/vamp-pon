# Unity U9.2 Font / Prefab / Visual Proof Hardening Review

作成日: 2026-06-30

1. Scope
   - U9.1の画面proofをレビューし、正式実装前の硬化として以下を実施した。
   - ZenMaruGothic TMP SDF Font Assetの正式ベイク。
   - Result proofの可読性改善（reward cardラベル拡大、stats行背景追加、カード間隔調整）。
   - StageSelect proofのroute line 2案比較（A: ダークインク太線、B: インク線+灯のにじみ）。
   - 黒耀化 / rare proofの人間レビュー継続。
   - Prefab分解方針の作成。
   - AI画像生成は行っていない。外部画像生成APIも使用していない。
   - 正式Result、正式StageSelect、黒耀化runtime、必殺cut-in runtime、Addressablesは導入していない。

2. AI画像生成なしで行ったこと
   - U9.1スクリーンショット7枚の再レビュー。
   - ZenMaruGothic-Medium.ttfからTMP SDF Font Assetを正式ベイク（210文字、1024x1024 atlas）。
   - Result proofのreward cardラベルfont size拡大（11→13）、カード間隔拡大（86→90）、stats行に半透明背景追加。
   - StageSelect proofのroute line 2案（A: 太線、B: 太線+glow）を作成し3解像度で比較。
   - nodeの明度差追加（起点100%、序盤85%、後半60%）。
   - lantern marker拡大（78x96→84x102）。
   - 10枚のスクリーンショットと3枚のcontact sheetを生成。
   - U9.2 visual hardening checkerを追加。

3. U9.1 screenshot review結果
   - Result proof: 「記憶帳」の雰囲気は出ている。reward cardラベル「記憶/墨/灯」がfont size 11で小さく実機可読性に不安。stats行「拾った欠片 12  朝の加護 +3」は背景とのコントラストが低め。
   - StageSelect proof: route lineはU9で改善されたが地図テクスチャに溶け込む傾向。nodeのactive/inactive区別がない。lantern markerの起点感がやや弱い。
   - 黒耀化/rare proof: 全体的に赤紫黒のインク系。上部particleの散りに若干黄色寄りが見えるが、明確な緑味ではない。候補維持。
   - 390x844: 全画面で読める。360x800: やや詰まるが破綻なし。430x932: 間延びなし。

4. ZenMaruGothic TMP SDF Font Asset正式ベイク結果
   - ソースフォント: `Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium.ttf`
   - 出力: `Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset`
   - ベイクツール: `ZenMaruGothicSDFBaker.cs`（Editor script、batchmode対応）
   - 文字数: 210文字（U9.1/U9.2 proof文言 + 基本ASCII + 将来のUI文言候補）
   - Atlas: 1024x1024、SamplingPointSize=48、Padding=5、SDFAA
   - Missing glyphs: 0
   - U9.1のランタイムFont生成（`new Font(path)` + `TMP_FontAsset.CreateFontAsset`）から、正式ベイク済みassetの`AssetDatabase.LoadAssetAtPath`に移行。

5. Font license確認結果
   - フォント: Zen Maru Gothic Medium
   - デザイナー: Yoshimichi Ohira
   - ソース: Google Fonts
   - ライセンス: SIL Open Font License 1.1 (OFL-1.1)
   - 商用利用: Yes
   - アプリバンドル: Yes
   - ライセンスファイル: `Assets/_Project/Fonts/ZenMaruGothic/LICENSE.txt`（リポジトリに含まれている）

6. Result proof readability polish内容
   - reward cardラベル「記憶/墨/灯」font size: 11 → 13
   - reward card間隔: 86px → 90px
   - stats行「拾った欠片 12  朝の加護 +3」に半透明背景（rgba 18,15,17,140）を追加
   - stats行font size: 12 → 13
   - 台帳パネル高さ: 540 → 530（カード配置と下部余白のバランス）
   - 封蝋サイズ: 96 → 90（紙パネルとの比率調整）
   - new badge: 58 → 54
   - 「次へ」ボタンfont size: 17 → 18
   - タイトル「今夜の記録」font size: 22 → 24
   - 報酬ロジック・セーブ処理・正式Scene化は行っていない。
   - 画像に文字は焼き込んでいない。

7. StageSelect route line比較結果
   - A案: ダークインク太線
     - route line太さ: 28-32px（U9.1の26-28pxからさらに太く）
     - route line色: rgba(0.16, 0.10, 0.06, 0.95)（より濃い茶インク）
     - 地図上での視認性はU9.1より明確に向上
   - B案: ダークインク太線 + 灯のにじみ
     - A案と同じ太線に加え、route lineに重ねてランタン光glowの半透明矩形（rgba 0.96, 0.70, 0.30, 0.18）を配置
     - 暖かみが加わりヨルノシルベの灯火感が出る
     - ただし紙地図の上品さがやや弱まる
   - 判断: A案を推奨。route lineの視認性は太さと濃さで十分確保できており、glow追加は紙地図の質感を損なう可能性がある。B案は最終Prefab実装時にAnimationでの灯火演出として検討する余地がある。
   - nodeサイズ: 54 → 58px
   - node明度差: 起点node=100%、序盤node=85%、後半node=60%（active/inactive風の区別）
   - lantern marker: 78x96 → 84x102（起点感強化）
   - ステージ解放ロジック・難易度処理・正式Scene化は行っていない。

8. 黒耀化 / rare proof人間レビュー結果
   - `kokuyou_fullscreen_ink_shadow_source_refined`: 全体的に赤紫黒のインク系。上部particleの散りに若干黄色寄りのparticleが見えるが、明確な緑（クロマキー残り）ではない。不穏さは維持されている。候補維持。
   - `levelup_rare_ink_flare_refined`: 墨の爆発感があり、通常VFXとの差別化は十分。候補維持。
   - `levelup_rare_lantern_pulse_ring`: 暖色の輪で、flareとの読み分けは明確。候補維持。
   - 黒耀化refinedは正式採用前に人間が最終レビューすべき（上部particleの黄色寄り）。
   - 可愛いキラキラには見えない。怖すぎもしない。ヨルノシルベの「不穏だが救いがある」方向。
   - 黒耀化runtime、ゲージ、ボタン、cut-in実装はしていない。

9. Prefab分解方針

   Result正式化時のPrefab候補:
   - `ResultRoot`: Result画面全体のルートCanvas
   - `ResultPaperLedgerPanel`: 紙の台帳パネル（9-slice対応）
   - `ResultRankSeal`: 封蝋ランクバッジ（TMPラベル付き）
   - `ResultRewardCard`: 報酬カード（画像+TMPラベル、データバインド可能）
   - `ResultNewBadge`: 新規取得バッジ
   - `ResultStatsLine`: 統計行（TMPテキスト、データバインド可能）
   - `ResultContinueButton`: 「次へ」ボタン（PaperButton共通Prefab候補）

   StageSelect正式化時のPrefab候補:
   - `StageSelectRoot`: StageSelect画面全体のルートCanvas
   - `StageMapPanel`: 紙地図パネル
   - `StageRouteLine`: インク描線（route区間ごとに配置）
   - `StageRouteNode`: ルートノード（active/inactive状態切替）
   - `StageLanternMarker`: ランタン起点マーカー
   - `StageInfoPanel`: 下部情報パネル（ステージ名、難易度、出発ボタン）
   - `StageStartButton`: 「出発」ボタン（PaperButton共通Prefab候補）

   共通Prefab候補:
   - `PaperButton`: 紙テクスチャのCTAボタン（Result「次へ」、StageSelect「出発」で共用）
   - `PaperLabel`: ZenMaruGothic TMPラベル（proof-only設定付き）
   - `PaperPanel`: 紙テクスチャの背景パネル（9-slice対応）
   - `MemoryCard`: 報酬/記憶カード（Result、Collection共用候補）
   - `InkRouteLine`: インク描線（StageSelect用、将来Animation対応）
   - `LanternMarker`: ランタンマーカー（StageSelect起点、将来glow Animation）

   画像candidate使用方針:
   - `result_paper_ledger_panel` → ResultPaperLedgerPanel
   - `result_rank_wax_seal` → ResultRankSeal
   - `result_reward_memory_card` → ResultRewardCard / MemoryCard
   - `result_new_badge_refined` → ResultNewBadge
   - `stageselect_paper_map_base` → StageMapPanel
   - `stageselect_route_node` → StageRouteNode
   - `stageselect_route_line_ink` → StageRouteLine / InkRouteLine
   - `stageselect_start_marker_lantern` → StageLanternMarker / LanternMarker

   TMP label差し替え方針:
   - タイトル、サブタイトル、ボタンラベル、統計値はすべてTMP
   - データバインド可能な値: ランク、報酬数、欠片数、加護数、ステージ名、難易度

   proof-only境界:
   - U9.2まではEditor scriptでの一時Canvas生成（proof-only）
   - 正式化時にPrefabとSceneに移行
   - proof用scriptは正式Prefab化後も残してよい（regression比較用）

10. screenshot結果
    - `docs/design-targets/generated/unity-u9-2/screenshots/u9-2-result-proof-390x844.png`
    - `docs/design-targets/generated/unity-u9-2/screenshots/u9-2-result-proof-360x800.png`
    - `docs/design-targets/generated/unity-u9-2/screenshots/u9-2-result-proof-430x932.png`
    - `docs/design-targets/generated/unity-u9-2/screenshots/u9-2-stageselect-proof-route-a-390x844.png`
    - `docs/design-targets/generated/unity-u9-2/screenshots/u9-2-stageselect-proof-route-a-360x800.png`
    - `docs/design-targets/generated/unity-u9-2/screenshots/u9-2-stageselect-proof-route-a-430x932.png`
    - `docs/design-targets/generated/unity-u9-2/screenshots/u9-2-stageselect-proof-route-b-390x844.png`
    - `docs/design-targets/generated/unity-u9-2/screenshots/u9-2-stageselect-proof-route-b-360x800.png`
    - `docs/design-targets/generated/unity-u9-2/screenshots/u9-2-stageselect-proof-route-b-430x932.png`
    - `docs/design-targets/generated/unity-u9-2/screenshots/u9-2-kokuyou-rare-proof-390x844.png`
    - Contact sheets: `u9-2-result-proof-contact-sheet.png`, `u9-2-stageselect-route-comparison-contact-sheet.png`, `u9-2-all-proof-contact-sheet.png`

11. 390x844 / 360x800 / 430x932確認
    - Result proof: 3解像度で出力・確認済み。reward cardラベルの可読性がU9.1より向上。
    - StageSelect proof Route A: 3解像度で出力・確認済み。route lineの視認性がU9.1より明確に向上。
    - StageSelect proof Route B: 3解像度で出力・確認済み。glow追加で暖かみが加わるが紙質感がやや弱まる。
    - 黒耀化 / rare proof: 390x844で出力・確認済み。
    - 実機ではなくEditor batchmode screenshotでの確認。

12. 採用候補 / 修正候補 / 却下候補
    - 採用候補: U8採用候補9点 + U8.1 refined 3点（変更なし）。
    - 修正候補: 黒耀化refinedの上部particleの黄色寄りについて人間レビュー継続。
    - 却下候補: なし。
    - route line: A案を推奨。B案は将来のAnimation演出として検討余地あり。

13. U5/U8/U8.1素材がcandidateのままか
    - U5素材8点はcandidateのまま。
    - U8素材12点はcandidateのまま。
    - U8.1素材3点もcandidateのまま。

14. productionApproved=0か
    - U5/U8/U8.1のmanifestでproduction approved昇格はしていない。
    - 各checkerでproductionApproved=0を確認済み。

15. Resources系がproof-onlyか
    - `Resources/U5Candidates` はproof-only維持。
    - `Resources/U8Candidates` はproof-only維持。
    - `Resources/U8Refined` はproof-only維持。

16. text-baked imageがないか
    - U9.2で画像への文字、数字、ロゴ、透かしの焼き込みは行っていない。
    - すべてのテキストはUnityのTextMeshProで重ねている。

17. 正式Result/StageSelect実装をしていないこと
    - 正式Scene、正式遷移、報酬処理、セーブ処理、Stage解放処理は追加していない。
    - U9.2はEditor screenshot用の一時Canvas proofのみ。

18. 黒耀化runtimeを実装していないこと
    - 黒耀化runtime、ゲージ、ボタン、必殺cut-in runtimeは追加していない。

19. Addressablesを導入していないこと
    - Addressables package、catalog、profile、runtime loading pathは追加していない。

20. U7.1 TimeScale / AssetProvider verification結果
    - U7 TimeScale Service Verification: 同commit上で再実行。全case OK（force restore, single/multi pause, hit stop, pause over hit stop）。exit code 0。
    - U7 AssetProvider Verification: 同commit上で再実行。provider name, proof-only flag, load battle visuals, 全sprite load OK。exit code 0。

21. U4/U5 verification結果
    - U5 Visual Candidate Verification: 同commit上で再実行。exit code 0。AssetsLoaded全OK、Movement/Battle/Feel/VFXすべてpass。
    - U4 LevelUp UI Verification: 同commit上で再実行。exit code 0。ProjectVersion OK、全controller/overlay/guard OK、TimeScale restore OK。

22. term lock / asset intake / meta / design review結果
    - `pnpm unity:term-lock:check`: passed（7 files）。
    - `pnpm unity:asset-intake:check`: passed、productionApproved=0。
    - `pnpm unity:u8-asset-intake:check`: passed、productionApproved=0。
    - `pnpm unity:u8-1-asset-intake:check`: passed、productionApproved=0。
    - `pnpm unity:meta:check`: passed、163 unique GUIDs。
    - `pnpm design:review:verify`: passed（7 docs）。
    - `git diff --check`: 既存meta fileのUnity正規化によるtrailing whitespace以外なし。

23. U9.2 checker結果
    - `pnpm unity:u9-2-visual-hardening:check`: passed、screenshots=10、sdfFont=true、productionApproved=0。

24. Console compile/runtime error有無
    - ZenMaruGothic SDF bake: exit code 0。
    - U9.2 screenshot生成: exit code 0。
    - Unity logにはLicense handshake系のError行が出るが、project compile/runtime errorは見つかっていない。

25. 実機確認はまだnot executedか
    - iPhone / Android実機確認はnot executedのまま。
    - 実機確認を実行済みとは扱わない。

26. 残る未解決懸念
    - 黒耀化refinedの上部particleの黄色寄りは人間レビュー継続。
    - StageSelect route line B案（glow）は正式Prefab化時にAnimation演出として再検討。
    - TMP SDF Font Assetは現在210文字のproof用subset。正式リリース前にフルsubsetをベイクする必要がある。
    - SDF asset batchmodeロード時の`glyphTable.Count=0`表示（描画には影響なし、TMPのdynamic font fallback挙動）。
    - Result reward cardの実機可読性は実機確認で最終判断。

27. 次にやること
    - 人間レビューでU8.1 refined 3点の採用/再修正を最終判断する。
    - route line A案を正式Prefab化の基本方針として採用する。
    - Result / StageSelectのPrefab分解を実施する。
    - ZenMaruGothicの正式フルsubset SDF Font Assetをベイクする。
    - 実機確認は別途iPhone / Androidで実行する。
