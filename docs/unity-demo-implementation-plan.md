# Unity Demo Implementation Plan

`docs/unity-vertical-slice-spec.md` を実装へ落とすための作業順。

## Purpose

Unityでいきなり本移行しない。まず30秒〜60秒のBattleDemoを作り、Web版より明確に気持ちよくなるかを比較する。

## Build Order

### 1. Project Foundation

- Unity 6 LTS以降。
- 2D URP。
- Portrait fixed。
- Reference Resolution: 390 x 844。
- SafeArea root。
- TextMeshPro import。
- Input System enable。

### 2. Folder Structure

```txt
Assets/
  _Project/
    Art/
    Audio/
    Data/
      ScriptableObjects/
        Characters/
        Weapons/
        Enemies/
        Stages/
    Prefabs/
      Player/
      Enemies/
      Weapons/
      Pickups/
      UI/
      Effects/
    Scenes/
    Scripts/
      Core/
      Player/
      Enemy/
      Combat/
      Pickups/
      UI/
      Effects/
      Data/
```

### 3. First Scene

`BattleDemo.unity` だけを先に作る。

最初からTitleやStageSelectを作り込まない。Battleの手触りを最優先にする。

### 4. Minimal Loop

```txt
Player moves
↓
Enemies approach
↓
Weapon hits
↓
Enemy clears
↓
EXP drops
↓
EXP absorbs
↓
LevelUp opens
↓
Card selected
↓
Kokuyou/Ultimate preview
↓
Result Lite
```

## First Scripts

| Script | 役割 |
|---|---|
| BattleDemoController | demo全体進行 |
| YuiDemoController | 移動 / 状態 |
| EnemySpawnerDemo | 敵出現 |
| EnemyChaseDemo | プレイヤーへ接近 |
| EnemyHealthDemo | HP / clear処理 |
| SimpleWeaponEmitter | 自動攻撃 |
| MemoryFragmentPickup | EXP取得 |
| LevelSystemDemo | レベル / EXP |
| LevelUpPanelDemo | 3択表示 |
| KokuyouDemoController | 黒曜化演出 |
| ResultLitePanel | 結果表示 |

## First Prefabs

| Prefab | 必須コンポーネント |
|---|---|
| PlayerYuiDemo | SpriteRenderer / Rigidbody2D / Collider2D / YuiDemoController |
| EnemyOmbuDemo | SpriteRenderer / Rigidbody2D / Collider2D / EnemyChaseDemo / EnemyHealthDemo |
| EnemyOmburoDemo | EnemyOmbuDemoの大型版 |
| WeaponLanternBolt | SpriteRenderer / Collider2D / lifetime |
| PickupMemoryFragment | SpriteRenderer / Collider2D / trail |
| FxInkBurst | Particle System |
| FxLanternPulse | Light2D / Particle System |
| LevelUpPanel | Canvas group / 3 cards |
| ResultLitePanel | Paper page / reward row |

## ScriptableObject Minimum

### Character

- yui

### Weapons

- north-star-lantern
- black-ink-bottle
- lamp-post-ring
- ink-lamp-ring

### Enemies

- ombu-small
- omburo-mid

### Stage

- stage-1-forgotten-street-demo

## Demo Tuning Defaults

| Parameter | Initial Value | Reason |
|---|---:|---|
| player hp | 100 | Stage1基準 |
| player speed | 4.2 | スマホ操作で遅く感じない |
| pickup range | 2.2 | EXP吸引を早めに楽しくする |
| ombu hp | 10 | 序盤はすぐ倒れる |
| ombu speed | 2.0 | 囲まれる感を出す |
| omburo hp | 160 | 中ボス演出確認用 |
| weapon cooldown | 0.9 | LvUp前でも寂しくしない |
| exp per ombu | 1 | LvUp確認用 |
| demo level threshold | 6 | 30秒内にLvUpを出す |

## Visual Priority

1. EXP吸引の気持ちよさ。
2. 敵クリア時の黒インク。
3. ランタンcoreの暖色。
4. 黒曜化の画面端侵食。
5. Resultの記憶ページ感。

## Android Check

最初の実機確認は以下だけ見る。

- 起動できる。
- 390x844基準が崩れない。
- タッチ移動が不快でない。
- 敵が増えても重くない。
- EXP吸引が見える。
- LevelUp文字が読める。

## Do Not Overbuild

- Titleを作り込まない。
- StageSelectを作り込まない。
- Growthを作り込まない。
- 全素材をUnityへ持ち込まない。
- Addressablesは本移行判断後でよい。
- 課金 / 広告は不要。

## Commit Strategy

### Commit 1

Unity project foundation / folder structure / BattleDemo scene。

### Commit 2

Player movement / enemy spawn / simple weapon。

### Commit 3

EXP drop / absorb / LevelUp panel。

### Commit 4

Kokuyou / Ultimate preview / Result Lite。

### Commit 5

Android device tuning / comparison report。

## Comparison Report

Unityデモ完了時は、以下でWeb版と比較する。

| 項目 | Web | Unity | 勝ち |
|---|---|---|---|
| 撃破感 |  |  |  |
| EXP吸引 |  |  |  |
| ランタン光 |  |  |  |
| 黒インク |  |  |  |
| UI可読性 |  |  |  |
| 作業速度 |  |  |  |
| 実機負荷 |  |  |  |

## Decision

Unityが勝つ条件:

- 撃破感、EXP吸引、黒曜化が明確に上。
- Android実機で重くない。
- Prefab追加で量産できそう。

Unityが勝たない場合:

- Web版を継続して磨く。
- Unityは演出検証だけに戻す。