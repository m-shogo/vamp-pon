# デザイン保留・非デザイン領域プリ実装パック

## 目的

デザインは大事なので保留する。

このドキュメントでは、デザイン以外で先に進められる仕様を固める。

対象:

```txt
ゲーム状態
データ構造
シーン遷移
システム責務
保存データ
デバッグ機能
バランス調整手順
テスト観点
実装順
```

扱わないもの:

```txt
キャラ見た目
敵見た目
背景デザイン
UIの色
フォント
アニメーションの美術方向
本素材制作
```

---

# 1. ゲーム状態設計

## GameState

ゲーム中に持つべき状態。

```ts
type GameStatus = 'ready' | 'playing' | 'levelUp' | 'capsule' | 'paused' | 'cleared' | 'gameOver';

type GameState = {
  status: GameStatus;
  elapsedSec: number;
  durationSec: number;
  player: PlayerRuntime;
  inventory: InventoryRuntime;
  enemies: EnemyRuntime[];
  pickups: PickupRuntime[];
  waves: WaveRuntime;
  runStats: RunStats;
  rngSeed?: string;
};
```

## PlayerRuntime

```ts
type PlayerRuntime = {
  characterId: string;
  hp: number;
  maxHp: number;
  position: Vec2;
  velocity: Vec2;
  moveSpeed: number;
  level: number;
  xp: number;
  xpToNext: number;
  ultimateCharge: number;
  ultimateReady: boolean;
  temporaryBuffs: BuffRuntime[];
};
```

## InventoryRuntime

```ts
type InventoryRuntime = {
  weapons: RuntimeWeapon[];
  passives: RuntimePassive[];
  evolvedWeaponIds: string[];
  weaponSlots: number;
  passiveSlots: number;
};
```

## RunStats

```ts
type RunStats = {
  kills: number;
  elitesKilled: number;
  xpCollected: number;
  memoryFragmentsCollected: number;
  capsulesOpened: number;
  evolutions: string[];
  ultimateUses: number;
  damageTaken: number;
  levelUps: number;
  survivedSec: number;
  newCodexEntries: string[];
  unlockedAchievements: string[];
};
```

## 状態遷移

```txt
ready
↓
playing
↓
levelUp ← XP満タン
↓
playing
↓
capsule ← 記憶カプセル取得
↓
playing
↓
cleared / gameOver
↓
result
```

MVPでは `result` を Scene として分けてもよい。

---

# 2. シーン構成

## 必須シーン

```txt
BootScene
TitleScene
CharacterSelectScene
MainScene
LevelUpScene
CapsuleScene
ResultScene
```

## MVP最小シーン

最短で動かす場合:

```txt
BootScene
MainScene
ResultScene
```

LevelUp と Capsule は MainScene 内の overlay でもよい。

## 推奨構成

### BootScene

責務:

```txt
ゲーム設定読み込み
データ定義読み込み
仮素材生成/読み込み
TitleSceneへ遷移
```

### TitleScene

責務:

```txt
ゲーム開始
図鑑/強化/設定への入口
```

デザイン未定なので、MVPではテキストボタンだけでよい。

### CharacterSelectScene

責務:

```txt
キャラ選択
初期武器/必殺技の確認
```

MVPでユイ1人だけなら省略可能。

### MainScene

責務:

```txt
プレイヤー移動
敵スポーン
武器発射
当たり判定
経験値/欠片
レベルアップ発火
カプセル取得
時間管理
クリア/ゲームオーバー判定
```

### LevelUpScene / Overlay

責務:

```txt
3択候補表示
選択反映
ゲーム再開
```

### CapsuleScene / Overlay

責務:

```txt
カプセル演出
進化/強化/報酬反映
ゲーム再開
```

### ResultScene

責務:

```txt
リザルト表示
通貨保存
実績/図鑑更新
もう一度/強化/図鑑への導線
```

---

# 3. システム責務

## MovementSystem

責務:

```txt
入力取得
プレイヤー移動
画面/ワールド境界処理
速度バフ反映
```

MVP:

```txt
キーボードのみ
WASD/矢印対応
```

## EnemySpawnSystem

責務:

```txt
wavesデータ参照
時間に応じた敵生成
最大生存数制御
出現方向制御
エリート出現
```

## EnemyAISystem

責務:

```txt
chase
slow_chase
offset_chase
swarm_chase
elite_chase
```

MVPでは複雑AI不要。

## WeaponSystem

責務:

```txt
武器クールタイム管理
発射/設置/回転生成
パッシブ補正反映
進化武器処理
```

## ProjectileSystem

責務:

```txt
弾移動
寿命管理
貫通管理
反射管理
敵ヒット判定
```

## CollisionSystem

責務:

```txt
プレイヤー vs 敵
弾/範囲 vs 敵
プレイヤー vs 欠片
プレイヤー vs カプセル
```

## XpSystem

責務:

```txt
欠片生成
欠片吸引
XP加算
レベルアップ判定
```

## LevelUpSystem

責務:

```txt
候補抽選
枠制限
MAX除外
HP低下時の回復候補
選択反映
```

## EvolutionSystem

責務:

```txt
進化条件判定
カプセル取得時の進化優先
武器差し替え
進化演出データ生成
```

## UltimateSystem

責務:

```txt
ゲージ蓄積
発動可否
発動効果
クールダウン/再チャージ
```

MVPでは時間経過チャージ。

## SaveSystem

責務:

```txt
永続強化
実績
図鑑
通貨
設定
```

MVPでは localStorage でよい。

## ResultSystem

責務:

```txt
RunStats集計
報酬計算
新発見/実績算出
リザルト表示用データ作成
```

---

# 4. データファイル構成

## 推奨

```txt
src/game/data/characters.ts
src/game/data/weapons.ts
src/game/data/passives.ts
src/game/data/enemies.ts
src/game/data/waves.ts
src/game/data/evolutions.ts
src/game/data/achievements.ts
src/game/data/codex.ts
src/game/data/powerups.ts
```

MVPでは `.json` より `.ts` が扱いやすい。

理由:

```txt
型チェックできる
コメントを書ける
importしやすい
補完が効く
```

ただし、データ形はJSON互換にする。

## 型定義

```txt
src/game/domain/types.ts
```

に集約。

最低限の型:

```ts
type Id = string;

type Vec2 = {
  x: number;
  y: number;
};

type WeaponDefinition = {
  id: Id;
  name: string;
  maxLevel: number;
  tags: string[];
  description: string;
  lore?: string;
  levels: WeaponLevelDefinition[];
};

type PassiveDefinition = {
  id: Id;
  name: string;
  maxLevel: number;
  stat: string;
  description: string;
  lore?: string;
  levels: PassiveLevelDefinition[];
};

type EnemyDefinition = {
  id: Id;
  name: string;
  hp: number;
  moveSpeed: number;
  contactDamage: number;
  xpDrop: number;
  tags: string[];
  behavior: string;
  description: string;
  lore?: string;
};
```

---

# 5. 保存データ設計

## SaveData

```ts
type SaveData = {
  version: number;
  currency: number;
  unlockedCharacters: string[];
  unlockedWeapons: string[];
  unlockedPassives: string[];
  unlockedStages: string[];
  powerups: Record<string, number>;
  achievements: Record<string, boolean>;
  codex: {
    enemies: Record<string, boolean>;
    items: Record<string, boolean>;
    weapons: Record<string, boolean>;
    passives: Record<string, boolean>;
  };
  stats: GlobalStats;
  settings: GameSettings;
};
```

## GlobalStats

```ts
type GlobalStats = {
  totalRuns: number;
  totalClears: number;
  totalPlaySec: number;
  totalKills: number;
  totalFragments: number;
  totalCapsulesOpened: number;
  mostUsedCharacterId?: string;
  mostUsedWeaponId?: string;
};
```

## GameSettings

デザインには踏み込まない。

MVP設定は最低限。

```ts
type GameSettings = {
  damageNumbers: boolean;
  screenShake: boolean;
  autoUltimate: boolean;
};
```

初期値:

```json
{
  "damageNumbers": true,
  "screenShake": true,
  "autoUltimate": false
}
```

## localStorage key

```txt
vamp_pon_save_v1
```

## セーブ互換

version を持つ。

破壊的変更が入ったら migration を用意する。

MVPでは以下でよい。

```txt
version が違う場合は初期化前に警告
開発中は reset save ボタンを用意
```

---

# 6. バランス調整ループ

## 調整対象

最初に見るべき数値:

```txt
敵HP
敵速度
敵スポーン量
XP必要量
武器ダメージ
武器クールタイム
欠片吸引範囲
必殺技チャージ時間
```

## 目標体験

### 初回プレイ

```txt
1分以内にレベルアップ
3分で初カプセル
5〜7分で敗北してもよい
```

### 数回プレイ後

```txt
10分クリアできる
1回は進化できる
必殺技を2〜4回使う
```

### うまくいったプレイ

```txt
進化2個に届く可能性がある
リザルトで次の目標が見える
```

## XPカーブ案

```ts
function xpToNext(level: number): number {
  return Math.floor(8 + level * 5 + Math.pow(level, 1.35));
}
```

MVP初期値例:

| Lv | 必要XP |
|---:|---:|
| 1→2 | 14 |
| 2→3 | 20 |
| 3→4 | 26 |
| 4→5 | 32 |
| 5→6 | 39 |
| 10→11 | 61 |
| 20→21 | 101 |

※ 実装後に必ず調整。

## 10分クリア想定

クリア時の目標値:

```txt
到達Lv: 22〜28
倒した影: 700〜1100
開けたカプセル: 2〜3
進化: 1〜2
必殺技使用: 3〜5
```

## 危険な状態

### レベルアップが遅い

症状:

```txt
2分経ってもLv2にならない
```

対策:

```txt
序盤敵数を増やす
XPカーブを下げる
欠片吸引を広げる
```

### 敵が硬すぎる

症状:

```txt
爽快感がない
画面が詰まる
```

対策:

```txt
敵HPを下げる
武器ダメージを上げる
スポーン量を下げる
```

### 簡単すぎる

症状:

```txt
ずっと安全
必殺技を使わない
```

対策:

```txt
5分以降の敵密度を上げる
紙くずの影を増やす
迷子の方角を増やす
```

### 進化できない

症状:

```txt
10分で進化0が多い
```

対策:

```txt
カプセル出現を増やす
Lv5到達を早める
進化対象武器の候補率を上げる
```

---

# 7. デバッグ機能

デザイン前でも必須。

## デバッグキー案

```txt
F1: デバッグ表示ON/OFF
F2: レベルアップ強制
F3: 記憶カプセル生成
F4: 必殺技ゲージMAX
F5: 1分進める
F6: 敵全消去
F7: HP回復
F8: 進化条件を満たす
```

## デバッグ表示

```txt
FPS
経過秒
敵数
欠片数
現在ウェーブID
プレイヤー座標
現在Lv/XP
武器一覧
パッシブ一覧
```

## なぜ必要か

- 10分毎回プレイして調整するのは重い
- 進化/カプセル/終盤確認を早くする
- バランス調整が現実的になる

---

# 8. テスト観点

## 単体テスト候補

ゲームエンジン描画部分ではなく、純粋ロジックをテストする。

### LevelUpSystem

```txt
枠が空いている時に新武器が候補に出る
枠が埋まると新武器が出ない
Lv.MAXの武器は通常候補から外れる
HP35%以下で回復候補率が上がる
```

### EvolutionSystem

```txt
夜の鉛筆Lv5 + 月明かりのしおり + カプセル → 未完成の一行
条件未達なら進化しない
複数進化候補がある場合の優先順が安定している
```

### SaveSystem

```txt
初期セーブが作られる
実績解除が保存される
図鑑登録が保存される
version違いを検出できる
```

### WaveSystem

```txt
指定時間に正しい敵が対象になる
3:00/6:00/9:00にエリートが出る
maxAliveを超えて湧かない
```

## 手動テスト

### 1分テスト

```txt
起動
ユイが動く
敵が出る
夜の鉛筆が撃つ
敵が倒れる
欠片が拾える
レベルアップする
```

### 3分テスト

```txt
紙くずの影が出る
黒ラベルの影が出る
記憶カプセルが出る
カプセル演出が出る
```

### 6分テスト

```txt
迷子の方角/黒いカプセルが出る
進化条件を満たせる
2回目カプセルで進化する
```

### 10分テスト

```txt
夜のもやが増える
終盤の圧がある
クリアできる
リザルトが出る
```

## 合格基準

```txt
初回プレイで操作が分かる
3分までに1回カプセルを見る
10分以内に少なくとも1回は必殺技を使いたくなる
進化すると明確に気持ちいい
リザルトで次の目標が分かる
```

---

# 9. 非デザイン領域の実装優先ロードマップ

## Step 1: 動く核

```txt
プレイヤー移動
敵1種
自動攻撃1種
敵死亡
欠片ドロップ
XP/レベルアップ
```

完了条件:

```txt
1分遊べる
```

## Step 2: ビルドの核

```txt
武器5種
パッシブ5種
3択抽選
枠制限
```

完了条件:

```txt
5分遊んでビルド差が出る
```

## Step 3: 10分構造

```txt
ウェーブ表
敵5種
強敵
10分クリア/失敗
```

完了条件:

```txt
10分の山がある
```

## Step 4: 報酬の核

```txt
記憶カプセル
進化2種
リザルト
```

完了条件:

```txt
進化が気持ちいい
```

## Step 5: 独自性

```txt
必殺技1種
図鑑/実績最小
裏ストーリー断片
```

完了条件:

```txt
Vamp Ponらしさが出る
```

## Step 6: 周回

```txt
永続強化
セーブ
次の目標提示
```

完了条件:

```txt
もう一度遊ぶ理由がある
```

---

# 10. 実装開始前のDoD

デザインを保留したまま実装へ入るなら、以下を守る。

## 仮素材ルール

```txt
キャラ: 円/四角/簡易アイコン
敵: 影色の円/楕円
欠片: 小さな光点
武器: 線/円/簡単な図形
背景: 単色または簡易グリッド
```

ここはデザイン確定ではなく、検証用。

## 仮素材で見ること

```txt
操作感
敵密度
武器の気持ちよさ
XPテンポ
レベルアップテンポ
進化の快感
必殺技の価値
```

## 仮素材で見ないこと

```txt
世界観の完成度
キャラの魅力
画面の最終印象
商品感
```

## 実装開始判断

デザイン保留でも、以下なら実装してよい。

```txt
ゲームロジック検証が目的
仮素材で進めると割り切る
見た目の評価をしない
数値調整を優先する
```

逆に、まだ実装しない方がいい場合:

```txt
見た目を見てテンションが下がる可能性が高い
仮素材を完成品のように評価してしまう
デザイン方向がゲーム仕様に大きく影響する
```

---

# 11. 現時点の結論

デザインは保留で正しい。

ただし、デザイン以外はかなり進められる。

今進めるべきは以下。

```txt
データ定義
状態管理
システム分解
セーブ構造
ウェーブ調整手順
テスト観点
実装ロードマップ
```

これで、デザインが決まった時に、すぐ実装へ入れる状態に近づく。

次に詰めるなら、非デザイン領域では以下。

```txt
1. TypeScript型定義の完全版
2. 実データTSファイル案
3. LevelUpSystemの疑似コード
4. WaveSystemの疑似コード
5. WeaponSystemの疑似コード
6. EvolutionSystemの疑似コード
7. SaveData migration方針
```
