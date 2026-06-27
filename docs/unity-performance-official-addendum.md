# Unity性能方針 公式情報補足

`docs/unity-mobile-performance-budget.md` の補足。
2026年時点のUnity公式情報を、Vamp PonのUnity移行判断へ落とし込む。
コード・素材・runtimeは変更しない。

## 参照した公式情報

- Unity Manual: Unity Profiler  
  https://docs.unity3d.com/Manual/Profiler.html
- Unity Manual: Sprite Atlas workflow  
  https://docs.unity3d.com/Manual/SpriteAtlasWorkflow.html
- Unity Manual: Comparison of UI systems in Unity  
  https://docs.unity3d.com/Manual/UI-system-compare.html
- Unity Input System package manual  
  https://docs.unity3d.com/Packages/com.unity.inputsystem@1.14/manual/index.html

## 追加判断

### 1. Profilerを移行判断の必須条件にする

Unity Profilerは、Editor内だけでなく接続デバイスやネットワーク上のデバイスでも性能情報を確認できる。
Vamp Ponはスマホ向けなので、Editorで滑らかでも合格にしない。

Unity 30秒デモで最低限見るもの:

- FPS / frame pacing
- CPU time
- GPU time if available
- GC allocations
- UI Canvas rebuild
- sprite / texture memory
- particle count
- draw calls / batches

合格条件:

- Editorで安定している。
- 実機でも大きな引っかかりがない。
- 重い瞬間がProfilerで説明できる。
- 見た目の強さと負荷の理由が対応している。

### 2. Sprite Atlasは最初から分類だけ決める

Unity公式のSprite Atlas workflowでは、Sprite Atlas assetを作り、packing対象を選び、build inclusionやサイズ最適化を管理できる。
Vamp Ponでは、最初からAtlas分類だけ決める。
ただし、細かい最適化はProfiler後でよい。

推奨分類:

| Atlas | 対象 | 理由 |
|---|---|---|
| `Atlas_UI_Icons` | 武器/パッシブ/レア小アイコン | 同時にUIへ出る |
| `Atlas_UI_Paper` | 紙カード/ボタン/枠 | UI共通素材 |
| `Atlas_Player_Yui` | ユイ関連 | 主人公は差し替え頻度が高い |
| `Atlas_Stage1_Actors` | Stage1画面内キャラ/影 | 同時表示数が多い |
| `Atlas_Stage1_FX` | インク/紙片/光/小粒アイテム | 短命表現をまとめる |
| `Atlas_Stage1_Backgrounds` | Stage1背景 | 大きいので分離 |

禁止:

- 大きい背景をUIアイコンAtlasに混ぜる。
- テスト用画像を本番Atlasへ混ぜる。
- 白フリンジや大きい透明余白のまま投入する。

### 3. Runtime UIはuGUI優先

Unity 6.5のUI比較では、RuntimeはuGUIが推奨、UI Toolkitが代替として整理されている。
Vamp Ponの初期Unity移行では、バトルHUD、レベルアップカード、カットイン、ResultはuGUIで進める。

理由:

- MonoBehaviourから参照しやすい。
- keyframed animationに向く。
- 既存のスマホHUD/カードUIをPrefab化しやすい。
- 手作り紙UIの押し心地を作りやすい。

UI Toolkitは以下に回す:

- 図鑑
- 設定
- Editor tools
- 大量リスト系画面
- 後続の大きいメニュー

### 4. Input Systemは商用MVPで本格採用

Input Systemはdevice / touch / gestureを扱える新しい入力システム。
ただし、30秒BattleDemoでは入力そのものより、戦闘の見た目と反応が重要。

30秒デモ:

- simple touch abstraction
- virtual stick
- right-bottom action button
- pause/home button
- keyboard fallback

商用MVP:

- Input System導入
- Input Action Asset
- touch / gamepad / keyboard fallback
- 必要ならアクセシビリティ対応

### 5. 透明表現は予算化する

Vamp Ponは、黒インク、ランタン光、紙片、小粒アイテム、半透明UIが多い。
透明表現が増えると、可読性と負荷の両方に影響する。

ルール:

- 常時透明レイヤーは少なくする。
- 一瞬の演出だけ強くする。
- 背景霧は控えめにする。
- 小粒アイテムのtrailは必要数だけ。
- 画面全体を覆う演出は短くする。

## Unity 30秒デモの性能合格条件

- 390x844でHUDが読める。
- レベルアップカードが読める。
- 画面内キャラ/影が背景に埋もれない。
- 小粒アイテムが見える。
- 大きい演出で画面が読みにくくならない。
- Editorで滑らか。
- 実機で明確な引っかかりがない。
- Profilerで負荷原因を説明できる。
- UI Canvas rebuildが過剰ではない。
- 戦闘中のGC allocationが多すぎない。

## 停止ルール

以下ならUnity側の機能追加を止める。

- 見た目は派手だが390x844で読みにくい。
- 実機で30fpsを割る。
- Profilerで原因を説明できない。
- AddressablesやInput Systemなど、後でよい仕組みに時間を使いすぎている。
- UIがUnity標準部品っぽくなっている。
- Web版より作業効率が明らかに落ちている。

## 最終判断

Vamp PonのUnity移行は、派手さではなく以下で判断する。

1. Web版より反応が気持ちいい。
2. 390x844で読みやすい。
3. ランタン光と黒インクが世界観を強める。
4. Profilerで性能リスクを説明できる。
5. 素材とPrefabの管理が破綻しない。

この5つが揃えば、Unity移行を進める価値がある。
揃わないなら、Web版で戦闘快感をさらに詰める。
