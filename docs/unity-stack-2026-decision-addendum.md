# Unity技術選定 2026年版補足

`docs/unity-pro-tech-stack.md` の方針を、2026年時点のUnity公式情報ベースで補強する補足メモ。
コード・素材・runtimeには触らず、Unity移行時に迷わないための決定事項だけを残す。

## 参照した公式情報

- Unity Manual: 2D lighting in URP  
  https://docs.unity3d.com/Manual/urp/2d-index.html
- Unity Manual: Unity Profiler  
  https://docs.unity3d.com/Manual/Profiler.html
- Unity Manual: Introduction to batching meshes  
  https://docs.unity3d.com/Manual/DrawCallBatching.html
- Unity Manual: Sprite Atlas workflow  
  https://docs.unity3d.com/Manual/SpriteAtlasWorkflow.html
- Unity Manual: Comparison of UI systems in Unity  
  https://docs.unity3d.com/Manual/UI-system-compare.html
- Unity Addressables package manual 3.1  
  https://docs.unity3d.com/Packages/com.unity.addressables@3.1/manual/index.html
- Unity Input System package manual 1.14  
  https://docs.unity3d.com/Packages/com.unity.inputsystem@1.14/manual/index.html

## 最終推奨スタック

### Stage1 Unity縦スライス

```txt
Unity 6.x stable line
URP 2D Renderer
uGUI / Unity UI
TextMeshPro
SpriteRenderer
Sprite Atlas
Particle System
TrailRenderer or custom curve tween
ObjectPool<T>
ScriptableObject data
Simple touch abstraction
Custom tween helper or DOTween-equivalent layer
Profiler-based performance gates
Addressablesはまだ最小/保留
```

### 商用MVP候補

```txt
Unity 6.x LTS/stable line
URP 2D Renderer + selective Light2D
uGUI for runtime HUD / battle UI
UI Toolkit only for editor tooling or later large menu screens
TextMeshPro
Sprite Atlas by feature group
ObjectPool<T>
ScriptableObject data registry
Input System
Cinemachine or small custom CameraFX
Versioned JSON save
Addressables for expanding characters/stages/events
Automated smoke scenes
Device profiling on iOS/Android
```

## 決定事項

### 1. Renderer: URP 2D Rendererを第一候補にする

Vamp Ponは夜・ランタン・黒インク・紙片・小さな光が核になるため、URP 2D Rendererと2D Lightは相性が良い。
ただしLight2Dを常時多用しない。

採用:

- ランタン周辺の局所光
- 進化/覚醒/カットイン時の短い光
- ResultやLevelUpの暖色アクセント

避ける:

- 背景全体を2D Lightで暗くする
- 常時大量の2D Light
- 敵ごとに常時Lightを付ける
- 暗さを強くしすぎて視認性を落とす

### 2. UI: runtimeはuGUI優先

Unity 6.5のUI比較では、runtimeの推奨はuGUI、代替がUI Toolkit。
Vamp PonはバトルHUD、カード選択、押し心地、CanvasGroup、Prefab化、アニメーションが重要なので、初期Unity移行ではuGUIを採用する。

採用:

- uGUI / Canvas / RectTransform
- TextMeshPro
- CanvasGroup
- 手動配置中心の390x844 UI
- 紙カード・ボタン・HUDパーツのPrefab化

保留:

- UI Toolkitの全面採用
- 複雑なUSS/UIDocument構成

将来候補:

- 図鑑や設定など、バトル外の大きめメニューでUI Toolkitを検討
- Editor toolはUI Toolkit候補

### 3. Sprite Atlas: 最初から分類だけ決める

UnityのSprite Atlas workflowでは、Sprite Atlas assetを作り、packing対象を選び、build inclusionやサイズ最適化を管理できる。
Vamp Ponでは、Atlasの分類を最初に決めておく。

推奨Atlas:

| Atlas名 | 対象 | 備考 |
|---|---|---|
| `Atlas_UI_Icons` | 武器/パッシブ/レア小アイコン | 32/64px可読性重視 |
| `Atlas_Player_Yui` | ユイ通常/暴走/カットイン関連 | 主人公は分離 |
| `Atlas_Stage1_Enemies` | Stage1敵 | 同時表示数が多い |
| `Atlas_Stage1_FX` | インク/紙片/XP/光 | 短命FX |
| `Atlas_Stage1_Backgrounds` | Stage1背景 | 大きいので分離 |
| `Atlas_UI_Paper` | 紙カード/ボタン/枠 | UI共通素材 |

ルール:

- UI文字は画像に焼き込まない。
- 同時に出る素材は同じAtlasに寄せる。
- 大きい背景は小物Atlasに混ぜない。
- 透明余白が大きすぎる素材はUnity投入前に整える。

### 4. Addressables: 初日から重く使わない

Addressablesは、Editor上でassetを管理し、runtime APIでロード/リリースできる。依存関係、asset location、memory allocationをAssetBundleより自動で扱える。
ただしStage1縦スライスでは、複雑さが勝ちやすい。

Stage1縦スライス:

- 必須素材はビルド同梱でOK。
- Addressablesは導入しない、または最小検証のみ。
- まずはID/パス/データ構造を安定させる。

商用MVP:

- 追加キャラ
- 追加ステージ
- イベント素材
- 大きいカットイン
- 将来差し替えたい素材

これらからAddressables化を検討する。

### 5. Input: 最初は薄い抽象化、商用MVPでInput System

Input Systemはtouchやgestureを含むデバイス入力を扱える新しい仕組み。
ただしStage1縦スライスでは、まず画面上の仮想スティックと右下ボタンが正しく動くことを優先する。

Stage1縦スライス:

- `IBattleInput` のような薄い抽象インターフェース
- Virtual stick
- Right-bottom action button
- Pause/Home button
- Editor keyboard fallback

商用MVP:

- Input System導入
- Touchscreen / Gamepad / Keyboard fallback整理
- Input Action Asset化
- リマップやアクセシビリティは後続

### 6. Performance: Profiler前提で決める

Unity ProfilerはEditor内だけでなく、ネットワーク上や接続された実機でアプリの性能情報を確認できる。
Vamp Ponはスマホ向けなので、Editor上だけでOKにしない。

見るもの:

- CPU: enemy update / projectile update / pickup update
- GPU: transparent overdraw / particles / UI overlay
- Memory: texture memory / pooled object count
- UI: Canvas rebuild / text update
- GC: allocations per frame

ルール:

- 最適化は計測前にやりすぎない。
- ObjectPoolは最初から入れる。
- 生成破棄が多いものは全部pool対象。
- 画面全体の半透明overlayを重ねすぎない。
- 連続hit FXは間引く。

### 7. Batching: 透明物の並びに注意する

Unityのbatchingは同じmaterialのmeshをまとめ、render state更新を減らしてCPU負荷とframe rateを改善する。ただし透明オブジェクトはback-to-front sortがあり、batchingが制限される可能性がある。

Vamp Ponでの注意:

- 黒インク、光、紙片、XP、UI overlayは透明物が多い。
- 常時透明レイヤーを増やさない。
- FX素材は同じmaterial/Atlasに寄せる。
- 背景、敵、pickup、player、FX、HUDのSorting Layerを固定する。
- 透明FXは短命・少数・意味のあるタイミングに限定する。

## Scene構成案

### 初回Unity移行

```txt
Boot.unity
BattleDemo.unity
```

まずは2sceneだけでよい。

`Boot.unity`:

- Resolution / SafeArea setup
- DataRegistry load
- App services init
- BattleDemoへ遷移

`BattleDemo.unity`:

- 390x844 camera framing
- Stage1 background
- Yui
- Stage1 enemy spawner
- Auto weapon
- XP pickup
- LevelUp panel
- Cutin layer
- Result panel

### 商用MVP

```txt
Boot.unity
Top.unity
StageSelect.unity
Battle.unity
Result.unity
Collection.unity
Upgrade.unity
```

増やすのはStage1縦スライス再現後でよい。

## Sorting Layer案

```txt
Background
GroundDecor
EnemyShadow
Enemy
Pickup
Projectile
Player
CombatFX
DamageText
HUD
Overlay
Modal
Cutin
Debug
```

ルール:

- HUDより上に戦闘FXを出さない。
- CutinはModalより上。
- Debugは最上位。
- Pickupは敵より上、playerより下。
- Projectileはplayerより下か上かを武器ごとに決める。

## Data移行方針

Web版のTypeScript dataをUnityでそのまま手入力しない。
まずは変換しやすい中間構造を意識する。

### ScriptableObject候補

```txt
SO_CharacterDefinition
SO_WeaponDefinition
SO_PassiveDefinition
SO_RareItemDefinition
SO_EvolutionDefinition
SO_EnemyDefinition
SO_StageDefinition
SO_WaveDefinition
SO_AchievementDefinition
```

### JSON候補

```txt
characters.json
weapons.json
passives.json
rare_items.json
evolutions.json
enemies.json
stages.json
waves_stage1.json
```

判断:

- 初期Unity移行はScriptableObjectでよい。
- 大量データ化するならJSON→ScriptableObject生成ツールを作る。
- IDは英語snake_case維持。
- 表示名は日本語可。
- 画像ファイル名は英語固定。

## Object Pool対象

```txt
Enemy
Projectile
XP pickup
Damage number
Hit spark
Ink burst
Paper scrap FX
Lantern pulse
Floating UI pips
Trail segments
```

生成破棄しないもの:

- 敵
- projectile
- XP
- damage number
- 短命FX

## 30秒Unityデモの合格条件

30秒デモは「全機能」ではなく、Unityで行く価値があるかの検証。

合格条件:

- Web版より敵撃破が気持ちいい。
- XP回収がWeb版より気持ちいい。
- ランタン光が世界観を強めている。
- 390x844でUIが読める。
- UIがUnity標準っぽく見えない。
- Sprite/FX/Canvasの管理が破綻していない。
- 実機で極端に重くない。

不合格条件:

- UnityにしたのにWeb版より安っぽい。
- UI作業が遅すぎる。
- Light/particleで視認性が落ちる。
- 生成素材の準備コストが増えすぎる。
- 30秒デモ時点で管理が複雑すぎる。

## 先に決めること / 後で決めること

### 先に決める

- 390x844基準
- URP 2D Renderer
- uGUI runtime UI
- TextMeshPro
- Sprite Atlas分類
- Object Pool前提
- Sorting Layer
- ScriptableObject中心
- Stage1必須素材は同梱

### 後で決める

- Addressables全面採用
- UI Toolkit採用範囲
- DOTween導入有無
- Cinemachine採用有無
- 課金/広告SDK
- Cloud save
- Analytics/Remote Config
- Localization package

## 最終判断

Vamp PonのUnity移行で最も重要なのは、Unityらしい派手さではなく、以下の4つ。

1. 390x844で読めること。
2. 敵撃破とXP回収が気持ちいいこと。
3. ランタン光と黒インクが世界観を強めること。
4. 素材管理と実装管理が破綻しないこと。

この4つを満たせないなら、Unity移行は急がない。
この4つがWeb版より良くなるなら、Unityへ進む価値がある。
