# Unity U4 LevelUp UI Demo Review

Date: 2026-06-30

## Summary

U4では、U3のbattle feel prototypeの上に、LevelUp UIのdemo overlayを追加した。画像生成を使わず、Unity UI / TMP / procedural shape / Zen Maru Gothicフォントだけで「紙・記憶・小さな光」の入口を目指した。

判定: U5へ進んでよい。

## Environment

- Unity Editor: 6000.5.1f1
- ProjectVersion.txt: `m_EditorVersion: 6000.5.1f1`
- Render Pipeline: 2D URP維持
- URP Asset: `Assets/_Project/Settings/U1UniversalRenderPipelineAsset.asset`
- 2D Renderer Data: `Assets/_Project/Settings/U1Renderer2DData.asset`

## Phase U4-A: Japanese TMP Font Test

- Font: Zen Maru Gothic (Medium weight)
- License: SIL Open Font License 1.1 (OFL-1.1)
- Source: Google Fonts / Homebrew `font-zen-maru-gothic`
- 商用利用: OK
- アプリ同梱: OK
- TMP SDF Font Asset: `ZenMaruGothic-Medium SDF.asset` を生成
- LiberationSans豆腐表示の回避: Zen Maru Gothicで日本語表示可能
- Resources配置: `Assets/_Project/Resources/ZenMaruGothic-Medium SDF.asset`
- License記録: `Assets/_Project/Fonts/ZenMaruGothic/LICENSE.txt`

フォント選定理由: ヨルノシルベの世界観（夜・記憶・紙・温かみ）に合う丸ゴシック系。Noto Sans JPよりも柔らかい印象で、UI文言の可読性と雰囲気を両立。

## Phase U4-B: LevelUp UI Demo

- `U4LevelUpDemoController` を実装
- `U4LevelUpOverlay` を実装
- 3-choice card UIを実装
- 各カードに表示される情報:
  - procedural IconFrame（武器=回転ダイヤ/パッシブ=ティール四角/特殊=紫四角）
  - アイテム名（日本語TMP）
  - 説明文（日本語TMP、折り返し対応）
  - タイプラベル（武器/パッシブ/レア/覚醒）
  - レベル表示
  - レアリティ表示（Normal/Good/Rare）
- 日本語文言: LevelUpタイトル「記憶がよみがえる」、サブタイトル「ひとつ選んでください」
- TMP可読性: Zen Maru Gothic Mediumで日本語が読める
- 候補データ: `U4LevelUpCandidatePool` に8種のdemoアイテム
  - ランタンの灯、墨のまもり、紙扇の風（武器系）
  - 記憶の引力、夜歩きの足、あたたかい外套（パッシブ系）
  - 夜明けの栞、忘れられた鈴（レア系）

## Phase U4-C: Paper UI Components

### PaperCard

- off-white紙色の背景（`0.96, 0.92, 0.86, 0.94`）
- レアリティ別の枠色（Normal=暖茶, Good=緑, Rare=暖金, 覚醒=紫）
- Rare/覚醒カードにlow alpha warm glow pulsing
- hover時のわずかなscale up（1.02x）
- selected時のscale pulse + 1.03x維持
- dimmed状態（未選択カードを0.45 alpha）

### PaperButton

- off-white紙色の背景
- hover時の色変化
- press時の小さなscale pulse（0.04）

### IconFrame

- 暗い半透明背景 + thin border
- アイテムタイプ別の色シンボル
- 武器: 45度回転ダイヤ型
- パッシブ: ティール四角
- 特殊: 紫四角

### 画像不使用

- すべてUnity UIのImage + Color + RectTransformで構成
- text-baked画像なし
- 外部画像素材なし

## Phase U4-D: Interaction / Feedback

- キーボード操作: W/S/↑/↓でカード間移動、Enter/Spaceで選択/決定
- 数字キー: 1/2/3で直接選択
- Escで選択解除
- 選択時: selected cardがscale pulse → 1.03x維持、他カードがdimmed
- 決定ボタン「決定」が出現
- overlay閉じ時: 0.15s fadeout → battle復帰
- demo trigger: Lキーで通常LevelUp、Kキーで覚醒gate付きLevelUp

### U3 VFXとの共存

- LevelUp overlayはScreen Space Overlay Canvas（sortingOrder=100）
- battle VFXはworld space
- overlayは別Canvas、U3のhit stop / camera impulse / lantern pulseとUI層が分離

## Phase U4-E: Rare / Awakening Gate Placeholder

- `dawn_page`（夜明けの栞）: Rareアイテムとして候補poolに含む
- `forgotten_bell`（忘れられた鈴）: Rareアイテムとして候補poolに含む
- `awakening_gate`（覚醒の扉）: placeholder、通常候補には混入しない
- Kキーで覚醒gate付きLevelUpを表示可能
- `dawn_ticket`: 通常候補に含まない（verification confirmed: clean）
- `awakening_material`: 将来のgate表示のみ、抽選ロジックなし

## Time.timeScale管理

### 方針

- LevelUp overlay表示時: `Time.timeScale = 0` でbattle完全停止
- overlay中: `Time.unscaledDeltaTime` でUI animation
- overlay終了時: `Time.timeScale = 1` で復帰

### U4TimeScaleGuard

- `PauseForOverlay()`: timeScale=0、overlayPaused=true
- `ResumeFromOverlay()`: timeScale=1、overlayPaused=false
- `ForceRestore()`: 安全弁、timeScale=1強制復帰
- `U4LevelUpOverlay.OnDisable()`: overlayPaused中ならForceRestore
- `U4LevelUpOverlay.OnDestroy()`: overlayPaused中ならForceRestore

### U3HitStopControllerとの共存

- U3HitStopControllerは `OnDisable()` で `Time.timeScale = 1` に戻す
- LevelUp overlay中は `Time.timeScale = 0` だが、U3HitStopControllerの `remaining` は `Time.unscaledDeltaTime` で減るため、hit stop中にLevelUpが出ても hit stop は正常終了する
- LevelUp overlay終了時に `ResumeFromOverlay()` が `timeScale = 1` に戻す
- hit stopが overlay中に終了していても、overlay終了後にtimeScaleは1に復帰

### Time.timeScale before / during / after

| Phase | Time.timeScale |
| --- | --- |
| Battle通常時 | 1 |
| Hit stop中 | 0.18 |
| Hit stop終了 | 1 |
| LevelUp overlay表示 | 0 |
| LevelUp overlay中 | 0（UIはunscaledDeltaTime） |
| LevelUp overlay終了 | 1 |
| Hit stop中にLevelUp表示 | 0（hit stopの残時間はunscaled tickで消化） |
| Scene reload / Play停止 | OnDisable/OnDestroyでForceRestore → 1 |

## U2BattleController分離確認

- U2BattleControllerに追加したのは2点のみ:
  1. `SetLevelUpNotifier(U4LevelUpDemoController)` メソッド
  2. EXP collect時の `levelUpNotifier?.NotifyExpCollected(expCollected)` 呼び出し
- Card UI生成: なし
- PaperCard/PaperButton/IconFrame組み立て: なし
- 選択演出管理: なし
- LevelUp候補データ保持: なし
- 日本語UI文言: なし
- rare/awakening gate表示ロジック: なし

## Responsive Review

- 文字サイズ: タイトル22px、サブタイトル14px、アイテム名17px、説明12px、ラベル11px
- Canvas Scaler: Scale With Screen Size、reference 390x844、match 0.5
- overlay panel: anchorMin 0.05/0.12、anchorMax 0.95/0.88でSafe Area内
- カード幅290px: 360x800でも余白あり
- 説明文: textWrappingMode=Normalで折り返し対応

注意: batchmodeでは実GameView screenshotが撮れないため、スクリーンショットはEditor GUI操作で撮る必要がある。

## Console

- Compile errors: なし
- Runtime exceptions: なし（batchmode verification通過）
- Warnings: なし（obsolete API修正済み）
- Licensing handshake: Unity固有、コードに影響なし

## Verification Report

```txt
=== U4 LevelUp UI Verification ===
Unity: 6000.5.1f1
Platform: OSXEditor
ProjectVersion: OK
ZenMaruGothic font: found
Font license: found
--- U4 Scripts ---
  U4LevelUpDemoController.cs: OK
  U4LevelUpOverlay.cs: OK
  U4LevelUpData.cs: OK
  U4TimeScaleGuard.cs: OK
  PaperCard.cs: OK
  PaperButton.cs: OK
  IconFrame.cs: OK
--- U2BattleController check ---
  Card UI in BattleController: clean
  LevelUp data in BattleController: clean
  Minimal notifier hook: OK
--- TimeScale guard ---
  ForceRestore method: OK
  OnDisable restore: OK
  OnDestroy restore: OK
--- dawn_ticket check ---
  dawn_ticket in candidates: clean
```

## ファイル一覧

新規追加:

```txt
unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Regular.ttf
unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium.ttf
unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Bold.ttf
unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/LICENSE.txt
unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset
unity/VampPonUnity/Assets/_Project/Resources/ZenMaruGothic-Medium SDF.asset
unity/VampPonUnity/Assets/_Project/Scripts/U4/U4TimeScaleGuard.cs
unity/VampPonUnity/Assets/_Project/Scripts/U4/U4LevelUpData.cs
unity/VampPonUnity/Assets/_Project/Scripts/U4/U4LevelUpOverlay.cs
unity/VampPonUnity/Assets/_Project/Scripts/U4/U4LevelUpDemoController.cs
unity/VampPonUnity/Assets/_Project/Scripts/U4/PaperCard.cs
unity/VampPonUnity/Assets/_Project/Scripts/U4/PaperButton.cs
unity/VampPonUnity/Assets/_Project/Scripts/U4/IconFrame.cs
unity/VampPonUnity/Assets/_Project/Scripts/Editor/U4FontSetup.cs
unity/VampPonUnity/Assets/_Project/Scripts/Editor/U4LevelUpVerification.cs
unity/VampPonUnity/Assets/_Project/Scripts/Editor/U4ScreenshotCapture.cs
docs/design-targets/generated/unity-u4/u4-verification-report.txt
docs/unity-u4-levelup-ui-review-2026-06-30.md
```

変更:

```txt
unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs
unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs
```

## U4未解決の懸念

1. **スクリーンショット未取得**: batchmodeではGameView screenshotが撮れない。Editor GUI操作でLキー押下後にスクリーンショットを撮る必要がある。
2. **TMP Font Assetのグリフ範囲**: demo用の限定的な漢字セットのみ生成。production用にはFallback FontかDynamic SDF生成が必要。
3. **マウス/タッチ操作**: キーボード操作のみ実装。タッチ/クリック選択は未実装。
4. **EXP閾値によるauto trigger**: EXP 5個collectでLevelUpが出るが、production tuningではない。
5. **覚醒gate**: UI placeholderのみ。抽選ロジック・条件判定は未実装。
6. **フォントファイルサイズ**: Regular + Medium + Bold = 約11.4MB。productionではsubset化やDynamic生成で軽量化が必要。

## 次のU5でやるべきこと

1. Editor Game ViewでLevelUp overlayのスクリーンショットを撮る（390x844 / 360x800 / 430x932）
2. マウス/タッチによるカード選択を追加
3. LevelUp選択後のstatus反映（demo表示のみでもよい）
4. Production用TMP Font Assetの最適化（Dynamic SDF / Fallback / subset）
5. Result画面のdemo追加（U5以降）
6. StageSelect画面のdemo追加（U5以降）
7. 黒耀化 / cutin placeholderの方向性確認（U5以降）
8. 実機テスト（touch input / performance / Safe Area）
