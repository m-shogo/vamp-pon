# Unity U1 Implementation Brief

目的: Unity移行の最初の実装単位を、迷わず小さく開始するための実装ブリーフ。

---

## Scope

U1は全移植ではない。

U1で作るのは、Unity projectがこのゲームに向いているか確認するための最小technical spike。

---

## Target

```txt
unity/VampPonUnity/
```

Editor:

```txt
Unity 6 LTS系
2D URP
Portrait / Mobile想定
Reference Resolution: 390 x 844
```

---

## Must read before work

- `docs/unity-current-doc-index-2026-06-30.md`
- `docs/unity-u1-current-handoff-2026-06-30.md`
- `docs/unity-u0-project-setup-plan.md`
- `docs/final-screen-comparison-review-2026-06-29.md`

---

## Build only these scenes

```txt
Boot.unity
Stage1.unity
```

Boot:

- initial loading placeholder
- debug flag placeholder
- transition to Stage1

Stage1:

- MainCamera orthographic
- StageRoot
- PlayerRoot
- EnemyRoot
- PickupRoot
- ProjectileRoot
- PoolRoot
- SafeAreaCanvas
- HudRoot
- OverlayRoot

---

## Minimal visual target

U1の画面は完成画面でなくてよい。
ただし、以下は見えるようにする。

- dark paper / night background
- Yui placeholder
- Ombu placeholder
- warm lantern glow
- one EXP fragment pickup curve
- minimal HUD placeholder inside Safe Area

---

## Minimal scripts

最初に作るC#候補:

```txt
Assets/_Project/Scripts/Core/GameManager.cs
Assets/_Project/Scripts/Runtime/RunController.cs
Assets/_Project/Scripts/UI/SafeAreaFitter.cs
Assets/_Project/Scripts/Player/PlayerController.cs
Assets/_Project/Scripts/Enemies/EnemyPlaceholder.cs
Assets/_Project/Scripts/Pickups/ExpFragmentPlaceholder.cs
Assets/_Project/Scripts/Data/GameFeelConfig.cs
Assets/_Project/Scripts/Data/StageDefinition.cs
Assets/_Project/Scripts/Data/EnemyDefinition.cs
Assets/_Project/Scripts/Data/WeaponDefinition.cs
```

U1ではScriptableObjectの中身を作り込みすぎない。
型と最小サンプルだけでよい。

---

## Asset import in U1

最初にコピーしてよい素材:

- Yui: `public/assets/prototypes/sprite-sheets/core5-original-frames/yui/`
- Background: `public/assets/prototypes/backgrounds/`
- Enemy sample: `public/assets/prototypes/sprite-sheets/enemies-original/`

最初は全量コピーしない。
Yui / Ombu / 背景1枚 / icon数点でよい。

---

## Import settings guide

Sprite / UI icons:

```txt
Texture Type: Sprite (2D and UI)
Alpha Is Transparency: true
Generate Mip Maps: false
Compression: None for QA
```

Pixel-like sprites:

```txt
Filter Mode: Point or Bilinear comparison
PPU: 180 initial
```

Background:

```txt
Filter Mode: Bilinear
Compression: Normal Quality
```

---

## Hard rules

- Web/Phaser側の `src/` をU1では原則変更しない。
- `public/assets/sprites/` はretiredなのでコピーしない。
- UnityからWebの `public/` を直接参照しない。
- 生成参照画像をそのままruntime UIに貼らない。
- 文字入り画像をUI素材として使わない。
- `Library/`, `Logs/`, `UserSettings/`, `.sln`, `.csproj` をcommitしない。
- U1でSave / Collection / Achievement / Full LevelUp / Full Resultは作らない。

---

## First acceptance check

U1初回完了時に確認すること:

```txt
- Unity Editorで再生できる
- Game Viewを390x844相当にしてUIが欠けない
- Boot -> Stage1へ遷移する
- SafeAreaCanvasがある
- Yui placeholderが見える
- Ombu placeholderが見える
- lantern glowが見える
- EXP fragmentがプレイヤーへ吸い込まれる
- git status --short にUnity生成物が混ざっていない
```

---

## U2へ進む条件

- U1のEditor再生が安定している
- 画面がWeb版より悪くなっても、Unityで良くできる余地が見える
- ランタン光/黒インク/EXP吸引の演出改善余地がある
- git管理が安全

U2では、Yui movement / enemy spawn / auto attack / damage-death / pooled ink burstに進む。
