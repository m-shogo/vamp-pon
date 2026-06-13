# MVP v0.1 実装前仕様パッケージ

## 目的

このドキュメントは、MVP v0.1 を実装に渡せる粒度へ変換する。

対象:

```txt
1. 武器/敵/パッシブをJSON化できる形にする
2. 10分ウェーブをデータ表に変換する
3. 画面レイアウトを決める
4. レベルアップUIの文言を作る
5. 記憶カプセル演出を決める
6. MVP実装タスクに分解する
```

## 設計方針

ゲーム本体の数値は、できるだけコードに直書きしない。

以下のようなデータファイルへ分離できる形を前提にする。

```txt
data/characters.json
data/weapons.json
data/passives.json
data/enemies.json
data/waves.json
data/evolutions.json
data/achievements.json
```

MVPでは実際にJSONファイルを作る前に、仕様としてJSON化しやすい構造を定義する。

---

# 1. 武器/敵/パッシブをJSON化できる形

## 1-1. 共通命名ルール

IDは英小文字スネークケース。

```txt
night_pencil
moon_bookmark
ink_shadow
```

表示名は日本語。

```txt
夜の鉛筆
月明かりのしおり
インクの影
```

裏ストーリー文は `lore` に分ける。

実装上の効果説明は `description` に分ける。

## 1-2. Character JSON 形

```json
{
  "id": "yui",
  "name": "ユイ",
  "title": "忘れ物係",
  "role": "初心者向け / 回収型 / 安定型",
  "initialWeaponId": "night_pencil",
  "baseStats": {
    "hp": 100,
    "moveSpeed": 100,
    "might": 1.0,
    "cooldownMultiplier": 1.0,
    "magnetMultiplier": 1.15,
    "xpMultiplier": 1.0
  },
  "ultimate": {
    "id": "unforgotten_name",
    "name": "消えない名前",
    "chargeSeconds": 90,
    "trigger": "manual",
    "effect": {
      "type": "pull_and_convert",
      "radius": 260,
      "duration": 2.2,
      "damage": 20,
      "smallEnemyOnly": true,
      "dropBonus": 1
    }
  },
  "description": "夜のあいだ、忘れられた物を集めてまわる子。",
  "lore": "名前を失った物を、もう一度呼び戻している。"
}
```

### MVP characters

```json
[
  {
    "id": "yui",
    "name": "ユイ",
    "title": "忘れ物係",
    "role": "初心者向け / 回収型 / 安定型",
    "initialWeaponId": "night_pencil",
    "baseStats": {
      "hp": 100,
      "moveSpeed": 100,
      "might": 1.0,
      "cooldownMultiplier": 1.0,
      "magnetMultiplier": 1.15,
      "xpMultiplier": 1.0
    },
    "ultimate": {
      "id": "unforgotten_name",
      "name": "消えない名前",
      "chargeSeconds": 90,
      "trigger": "manual",
      "effect": {
        "type": "pull_and_convert",
        "radius": 260,
        "duration": 2.2,
        "damage": 20,
        "smallEnemyOnly": true,
        "dropBonus": 1
      },
      "description": "周囲の欠片を吸い寄せ、小さな影を記憶の欠片に戻す。",
      "lore": "名前を呼ばれた影は、少しだけ元の形を思い出す。"
    },
    "description": "夜のあいだ、忘れられた物を集めてまわる子。",
    "lore": "名前を失った物を、もう一度呼び戻している。"
  },
  {
    "id": "michiru",
    "name": "ミチル",
    "title": "地図読み",
    "role": "中級者向け / 画面整理 / 攻撃型",
    "initialWeaponId": "black_ink_bottle",
    "baseStats": {
      "hp": 95,
      "moveSpeed": 97,
      "might": 1.0,
      "cooldownMultiplier": 1.0,
      "areaMultiplier": 1.08,
      "magnetMultiplier": 1.0,
      "xpMultiplier": 1.0
    },
    "ultimate": {
      "id": "ink_clear",
      "name": "黒インク払い",
      "chargeSeconds": 110,
      "trigger": "manual",
      "effect": {
        "type": "screen_damage_and_clear_hazard",
        "smallEnemyDamage": 45,
        "largeEnemyDamage": 20,
        "hazardClearSeconds": 4
      },
      "description": "画面内の弱い影を払い、黒インクを短時間消す。",
      "lore": "消えかけた道に、もう一度だけ線を引く。"
    },
    "description": "黒いインクで消えた道を、もう一度たどる子。",
    "lore": "誰かの旅が終わった場所を探している。"
  }
]
```

## 1-3. Weapon JSON 形

```json
{
  "id": "night_pencil",
  "name": "夜の鉛筆",
  "category": "weapon",
  "maxLevel": 5,
  "tags": ["projectile", "target_nearest"],
  "description": "近い影へ鉛筆弾を飛ばす。",
  "lore": "芯は短いのに、まだ書きたいことがあるらしい。",
  "levels": [
    {
      "level": 1,
      "effect": {
        "type": "projectile",
        "damage": 12,
        "projectiles": 1,
        "cooldown": 1.25,
        "pierce": 0,
        "targeting": "nearest"
      },
      "label": "近い影へ鉛筆弾を飛ばす。"
    }
  ]
}
```

### MVP weapons

```json
[
  {
    "id": "night_pencil",
    "name": "夜の鉛筆",
    "category": "weapon",
    "maxLevel": 5,
    "tags": ["projectile", "target_nearest", "starter"],
    "description": "近い影へ鉛筆弾を飛ばす。",
    "lore": "芯は短いのに、まだ書きたいことがあるらしい。",
    "levels": [
      { "level": 1, "effect": { "type": "projectile", "damage": 12, "projectiles": 1, "cooldown": 1.25, "pierce": 0, "targeting": "nearest" }, "label": "近い影へ鉛筆弾を飛ばす。" },
      { "level": 2, "effect": { "damageAdd": 4 }, "label": "ダメージ +4" },
      { "level": 3, "effect": { "projectilesAdd": 1 }, "label": "弾数 +1" },
      { "level": 4, "effect": { "pierceAdd": 1 }, "label": "貫通 +1" },
      { "level": 5, "effect": { "cooldownMultiplier": 0.8 }, "label": "クールタイム -20%" }
    ]
  },
  {
    "id": "marble",
    "name": "ビー玉",
    "category": "weapon",
    "maxLevel": 5,
    "tags": ["projectile", "bounce", "random_direction"],
    "description": "ランダム方向へ反射するビー玉を飛ばす。",
    "lore": "転がすと、一瞬だけ遠い空が映る。",
    "levels": [
      { "level": 1, "effect": { "type": "bouncing_projectile", "damage": 10, "projectiles": 1, "cooldown": 1.6, "bounces": 1, "speed": 1.0, "duration": 2.5 }, "label": "反射するビー玉を1個飛ばす。" },
      { "level": 2, "effect": { "speedMultiplier": 1.25 }, "label": "弾速 +25%" },
      { "level": 3, "effect": { "projectilesAdd": 1 }, "label": "弾数 +1" },
      { "level": 4, "effect": { "bouncesAdd": 1 }, "label": "反射 +1" },
      { "level": 5, "effect": { "damageAdd": 6, "durationMultiplier": 1.2 }, "label": "ダメージ +6 / 持続 +20%" }
    ]
  },
  {
    "id": "moon_bookmark",
    "name": "月のしおり",
    "category": "weapon",
    "maxLevel": 5,
    "tags": ["orbit", "defense", "close_range"],
    "description": "周囲を回るしおりで近くの影を払う。",
    "lore": "挟まれていたページは、いつも同じ場所で止まっている。",
    "levels": [
      { "level": 1, "effect": { "type": "orbit", "damage": 8, "orbiters": 1, "radius": 60, "hitInterval": 0.6 }, "label": "しおりが周囲を回る。" },
      { "level": 2, "effect": { "damageAdd": 3 }, "label": "ダメージ +3" },
      { "level": 3, "effect": { "orbitersAdd": 1 }, "label": "しおり +1" },
      { "level": 4, "effect": { "radiusAdd": 20 }, "label": "回転半径 +20" },
      { "level": 5, "effect": { "hitIntervalMultiplier": 0.8 }, "label": "ヒット間隔 -20%" }
    ]
  },
  {
    "id": "black_ink_bottle",
    "name": "黒インクの小瓶",
    "category": "weapon",
    "maxLevel": 5,
    "tags": ["area", "damage_over_time", "target_nearest"],
    "description": "近くの影の足元にインクだまりを作る。",
    "lore": "中身は乾いている。けれど夜になると、少しだけ増える。",
    "levels": [
      { "level": 1, "effect": { "type": "ground_area", "damagePerSecond": 5, "duration": 2.0, "radius": 45, "cooldown": 2.2, "maxAreas": 1, "targeting": "nearest" }, "label": "影の足元にインクだまりを作る。" },
      { "level": 2, "effect": { "radiusAdd": 15 }, "label": "範囲 +15" },
      { "level": 3, "effect": { "durationAdd": 1.0 }, "label": "持続 +1秒" },
      { "level": 4, "effect": { "damagePerSecondAdd": 3 }, "label": "継続ダメージ +3/秒" },
      { "level": 5, "effect": { "maxAreasAdd": 1 }, "label": "同時インク数 +1" }
    ]
  },
  {
    "id": "stardust_shot",
    "name": "星くず弾",
    "category": "weapon",
    "maxLevel": 5,
    "tags": ["projectile", "random_direction", "multi_shot"],
    "description": "ランダム方向へ小さな星弾を放つ。",
    "lore": "小さな光が残っている。誰かが見上げた夜のかけら。",
    "levels": [
      { "level": 1, "effect": { "type": "radial_random_projectile", "damage": 7, "projectiles": 3, "cooldown": 1.8, "speed": 1.0 }, "label": "ランダム方向へ星弾を3発放つ。" },
      { "level": 2, "effect": { "projectilesAdd": 1 }, "label": "弾数 +1" },
      { "level": 3, "effect": { "damageAdd": 3 }, "label": "ダメージ +3" },
      { "level": 4, "effect": { "speedMultiplier": 1.25 }, "label": "弾速 +25%" },
      { "level": 5, "effect": { "projectilesAdd": 2 }, "label": "弾数 +2" }
    ]
  }
]
```

## 1-4. Passive JSON 形

```json
{
  "id": "gold_compass",
  "name": "金のコンパス",
  "category": "passive",
  "maxLevel": 5,
  "stat": "magnetMultiplier",
  "description": "記憶の欠片を拾いやすくなる。",
  "lore": "北を指さない。なくしたものの方角だけを指す。",
  "levels": [
    { "level": 1, "value": 1.1, "label": "吸引範囲 +10%" }
  ]
}
```

### MVP passives

```json
[
  {
    "id": "gold_compass",
    "name": "金のコンパス",
    "category": "passive",
    "maxLevel": 5,
    "stat": "magnetMultiplier",
    "description": "記憶の欠片を拾いやすくなる。",
    "lore": "北を指さない。なくしたものの方角だけを指す。",
    "levels": [
      { "level": 1, "value": 1.1, "label": "吸引範囲 +10%" },
      { "level": 2, "value": 1.2, "label": "吸引範囲 +20%" },
      { "level": 3, "value": 1.3, "label": "吸引範囲 +30%" },
      { "level": 4, "value": 1.4, "label": "吸引範囲 +40%" },
      { "level": 5, "value": 1.5, "label": "吸引範囲 +50%" }
    ]
  },
  {
    "id": "travel_badge",
    "name": "旅のバッジ",
    "category": "passive",
    "maxLevel": 5,
    "stat": "mightMultiplier",
    "description": "武器のダメージが上がる。",
    "lore": "誰かが胸につけていた。小さな傷が、長い道のりを知っている。",
    "levels": [
      { "level": 1, "value": 1.05, "label": "攻撃力 +5%" },
      { "level": 2, "value": 1.10, "label": "攻撃力 +10%" },
      { "level": 3, "value": 1.15, "label": "攻撃力 +15%" },
      { "level": 4, "value": 1.20, "label": "攻撃力 +20%" },
      { "level": 5, "value": 1.25, "label": "攻撃力 +25%" }
    ]
  },
  {
    "id": "moonlight_bookmark",
    "name": "月明かりのしおり",
    "category": "passive",
    "maxLevel": 5,
    "stat": "xpMultiplier",
    "description": "経験値の獲得量が上がる。",
    "lore": "挟まれていたページは、いつも同じ場所で止まっている。",
    "levels": [
      { "level": 1, "value": 1.05, "label": "経験値 +5%" },
      { "level": 2, "value": 1.10, "label": "経験値 +10%" },
      { "level": 3, "value": 1.15, "label": "経験値 +15%" },
      { "level": 4, "value": 1.20, "label": "経験値 +20%" },
      { "level": 5, "value": 1.25, "label": "経験値 +25%" }
    ]
  },
  {
    "id": "old_ticket",
    "name": "古い切符",
    "category": "passive",
    "maxLevel": 5,
    "stat": "moveSpeedMultiplier",
    "description": "移動速度が上がる。",
    "lore": "行き先の文字はにじんでいる。帰りの切符ではなかったようだ。",
    "levels": [
      { "level": 1, "value": 1.04, "label": "移動速度 +4%" },
      { "level": 2, "value": 1.08, "label": "移動速度 +8%" },
      { "level": 3, "value": 1.12, "label": "移動速度 +12%" },
      { "level": 4, "value": 1.16, "label": "移動速度 +16%" },
      { "level": 5, "value": 1.20, "label": "移動速度 +20%" }
    ]
  },
  {
    "id": "white_margin",
    "name": "白い余白",
    "category": "passive",
    "maxLevel": 5,
    "stat": "cooldownMultiplier",
    "description": "武器の待ち時間が短くなる。",
    "lore": "消すための場所ではない。もう一度書くために残されている。",
    "levels": [
      { "level": 1, "value": 0.96, "label": "クールタイム -4%" },
      { "level": 2, "value": 0.92, "label": "クールタイム -8%" },
      { "level": 3, "value": 0.88, "label": "クールタイム -12%" },
      { "level": 4, "value": 0.84, "label": "クールタイム -16%" },
      { "level": 5, "value": 0.80, "label": "クールタイム -20%" }
    ]
  }
]
```

## 1-5. Enemy JSON 形

```json
{
  "id": "ink_shadow",
  "name": "インクの影",
  "hp": 18,
  "moveSpeed": 55,
  "contactDamage": 8,
  "xpDrop": 1,
  "tags": ["small", "basic"],
  "behavior": "chase",
  "description": "基本敵。",
  "lore": "地図帳の上を這う黒い影。道を消しているように見えるが、本当は道を探している。"
}
```

### MVP enemies

```json
[
  {
    "id": "ink_shadow",
    "name": "インクの影",
    "hp": 18,
    "moveSpeed": 55,
    "contactDamage": 8,
    "xpDrop": 1,
    "tags": ["small", "basic"],
    "behavior": "chase",
    "description": "最初から出る基本の影。",
    "lore": "地図帳の上を這う黒い影。道を消しているように見えるが、本当は道を探している。"
  },
  {
    "id": "paper_scrap_shadow",
    "name": "紙くずの影",
    "hp": 12,
    "moveSpeed": 85,
    "contactDamage": 6,
    "xpDrop": 1,
    "tags": ["small", "fast"],
    "behavior": "chase",
    "description": "弱いが速い小型影。",
    "lore": "丸められた紙から生まれる。捨てられた言葉ほど、夜にはよく転がる。"
  },
  {
    "id": "lost_direction",
    "name": "迷子の方角",
    "hp": 28,
    "moveSpeed": 65,
    "contactDamage": 10,
    "xpDrop": 2,
    "tags": ["medium", "flank"],
    "behavior": "offset_chase",
    "description": "少し横方向にずれながら近づく影。",
    "lore": "コンパスからこぼれた小さな影。北ではなく、帰れなかった場所を指している。"
  },
  {
    "id": "black_capsule",
    "name": "黒いカプセル",
    "hp": 75,
    "moveSpeed": 38,
    "contactDamage": 14,
    "xpDrop": 5,
    "tags": ["medium", "tank", "reward"],
    "behavior": "slow_chase",
    "description": "硬いが遅い。倒すと欠片が多い。",
    "lore": "中身を忘れたカプセル。開けられることより、覚えられることを待っている。"
  },
  {
    "id": "night_haze",
    "name": "夜のもや",
    "hp": 35,
    "moveSpeed": 45,
    "contactDamage": 9,
    "xpDrop": 2,
    "tags": ["medium", "swarm"],
    "behavior": "swarm_chase",
    "description": "群れで出る低速の影。",
    "lore": "忘れたことを楽にしてくれるもや。だからこそ、長く触れてはいけない。"
  },
  {
    "id": "black_label_shadow",
    "name": "黒ラベルの影",
    "hp": 280,
    "moveSpeed": 45,
    "contactDamage": 18,
    "xpDrop": 20,
    "tags": ["elite", "capsule_drop"],
    "behavior": "elite_chase",
    "drops": [{ "type": "memory_capsule", "chance": 1.0 }],
    "description": "記憶カプセルを落とす強敵。",
    "lore": "名前の書かれたラベルが黒く塗りつぶされている。"
  }
]
```

---

# 2. 10分ウェーブをデータ表に変換

## Wave JSON 形

```json
{
  "start": 0,
  "end": 30,
  "spawns": [
    {
      "enemyId": "ink_shadow",
      "spawnRatePerSecond": 0.8,
      "maxAlive": 25,
      "directionWeights": { "bottom": 70, "top": 10, "left": 10, "right": 10 }
    }
  ]
}
```

## directionWeights

方向指定は、MVPの「基本は下」を守りつつ単調さを避ける。

```txt
bottom: 下
 top: 上
left: 左
right: 右
around: 完全周囲ランダム
center: 画面内/近距離湧き ※MVPでは基本使わない
```

## MVP waves

```json
[
  {
    "start": 0,
    "end": 30,
    "note": "操作確認。最初の気持ちよさ。",
    "spawns": [
      { "enemyId": "ink_shadow", "spawnRatePerSecond": 0.6, "maxAlive": 18, "directionWeights": { "bottom": 70, "top": 10, "left": 10, "right": 10 } }
    ]
  },
  {
    "start": 30,
    "end": 60,
    "note": "最初のレベルアップを目指す。",
    "spawns": [
      { "enemyId": "ink_shadow", "spawnRatePerSecond": 0.9, "maxAlive": 28, "directionWeights": { "bottom": 70, "top": 10, "left": 10, "right": 10 } }
    ]
  },
  {
    "start": 60,
    "end": 90,
    "note": "基本敵の密度を上げる。",
    "spawns": [
      { "enemyId": "ink_shadow", "spawnRatePerSecond": 1.1, "maxAlive": 36, "directionWeights": { "bottom": 65, "top": 15, "left": 10, "right": 10 } }
    ]
  },
  {
    "start": 90,
    "end": 120,
    "note": "速い敵の導入。",
    "spawns": [
      { "enemyId": "ink_shadow", "spawnRatePerSecond": 0.9, "maxAlive": 34, "directionWeights": { "bottom": 60, "top": 15, "left": 12, "right": 13 } },
      { "enemyId": "paper_scrap_shadow", "spawnRatePerSecond": 0.35, "maxAlive": 12, "directionWeights": { "bottom": 60, "top": 20, "left": 10, "right": 10 } }
    ]
  },
  {
    "start": 120,
    "end": 150,
    "note": "少し忙しくする。",
    "spawns": [
      { "enemyId": "ink_shadow", "spawnRatePerSecond": 1.1, "maxAlive": 42, "directionWeights": { "bottom": 60, "top": 15, "left": 12, "right": 13 } },
      { "enemyId": "paper_scrap_shadow", "spawnRatePerSecond": 0.55, "maxAlive": 18, "directionWeights": { "bottom": 55, "top": 20, "left": 12, "right": 13 } }
    ]
  },
  {
    "start": 150,
    "end": 180,
    "note": "初ピンチ。紙くず多め。",
    "spawns": [
      { "enemyId": "paper_scrap_shadow", "spawnRatePerSecond": 0.9, "maxAlive": 28, "directionWeights": { "bottom": 55, "top": 20, "left": 12, "right": 13 } },
      { "enemyId": "ink_shadow", "spawnRatePerSecond": 0.7, "maxAlive": 34, "directionWeights": { "bottom": 55, "top": 15, "left": 15, "right": 15 } }
    ]
  },
  {
    "start": 180,
    "end": 181,
    "note": "エリート1。初カプセル機会。",
    "spawns": [
      { "enemyId": "black_label_shadow", "spawnCount": 1, "directionWeights": { "bottom": 100 } }
    ]
  },
  {
    "start": 181,
    "end": 240,
    "note": "迷子の方角導入。回り込みで単調さを崩す。",
    "spawns": [
      { "enemyId": "ink_shadow", "spawnRatePerSecond": 0.9, "maxAlive": 40, "directionWeights": { "bottom": 55, "top": 20, "left": 12, "right": 13 } },
      { "enemyId": "lost_direction", "spawnRatePerSecond": 0.25, "maxAlive": 12, "directionWeights": { "bottom": 50, "top": 20, "left": 15, "right": 15 } }
    ]
  },
  {
    "start": 240,
    "end": 300,
    "note": "黒いカプセル導入。火力チェック。",
    "spawns": [
      { "enemyId": "ink_shadow", "spawnRatePerSecond": 0.9, "maxAlive": 44, "directionWeights": { "bottom": 50, "top": 20, "left": 15, "right": 15 } },
      { "enemyId": "paper_scrap_shadow", "spawnRatePerSecond": 0.4, "maxAlive": 18, "directionWeights": { "bottom": 50, "top": 20, "left": 15, "right": 15 } },
      { "enemyId": "black_capsule", "spawnRatePerSecond": 0.12, "maxAlive": 5, "directionWeights": { "bottom": 60, "top": 20, "left": 10, "right": 10 } }
    ]
  },
  {
    "start": 300,
    "end": 360,
    "note": "ビルド差が見え始める時間。",
    "spawns": [
      { "enemyId": "ink_shadow", "spawnRatePerSecond": 1.0, "maxAlive": 52, "directionWeights": { "bottom": 50, "top": 20, "left": 15, "right": 15 } },
      { "enemyId": "lost_direction", "spawnRatePerSecond": 0.35, "maxAlive": 18, "directionWeights": { "bottom": 45, "top": 20, "left": 18, "right": 17 } },
      { "enemyId": "black_capsule", "spawnRatePerSecond": 0.18, "maxAlive": 8, "directionWeights": { "bottom": 50, "top": 20, "left": 15, "right": 15 } }
    ]
  },
  {
    "start": 360,
    "end": 361,
    "note": "エリート2。進化チャンス。",
    "spawns": [
      { "enemyId": "black_label_shadow", "spawnCount": 1, "directionWeights": { "bottom": 80, "top": 20 } }
    ]
  },
  {
    "start": 361,
    "end": 420,
    "note": "夜のもや導入。群れ圧力。",
    "spawns": [
      { "enemyId": "night_haze", "spawnRatePerSecond": 0.7, "maxAlive": 36, "directionWeights": { "bottom": 45, "top": 20, "left": 18, "right": 17 } },
      { "enemyId": "ink_shadow", "spawnRatePerSecond": 0.8, "maxAlive": 48, "directionWeights": { "bottom": 45, "top": 20, "left": 18, "right": 17 } }
    ]
  },
  {
    "start": 420,
    "end": 480,
    "note": "全敵混合。必殺技を使わせる。",
    "spawns": [
      { "enemyId": "ink_shadow", "spawnRatePerSecond": 0.8, "maxAlive": 48, "directionWeights": { "bottom": 45, "top": 20, "left": 18, "right": 17 } },
      { "enemyId": "paper_scrap_shadow", "spawnRatePerSecond": 0.5, "maxAlive": 26, "directionWeights": { "bottom": 40, "top": 20, "left": 20, "right": 20 } },
      { "enemyId": "lost_direction", "spawnRatePerSecond": 0.35, "maxAlive": 20, "directionWeights": { "bottom": 40, "top": 20, "left": 20, "right": 20 } },
      { "enemyId": "night_haze", "spawnRatePerSecond": 0.8, "maxAlive": 44, "directionWeights": { "bottom": 40, "top": 20, "left": 20, "right": 20 } }
    ]
  },
  {
    "start": 480,
    "end": 540,
    "note": "終盤前半。速度と硬さの混合。",
    "spawns": [
      { "enemyId": "paper_scrap_shadow", "spawnRatePerSecond": 0.75, "maxAlive": 34, "directionWeights": { "bottom": 40, "top": 20, "left": 20, "right": 20 } },
      { "enemyId": "black_capsule", "spawnRatePerSecond": 0.22, "maxAlive": 12, "directionWeights": { "bottom": 45, "top": 20, "left": 18, "right": 17 } },
      { "enemyId": "night_haze", "spawnRatePerSecond": 0.9, "maxAlive": 52, "directionWeights": { "bottom": 40, "top": 20, "left": 20, "right": 20 } }
    ]
  },
  {
    "start": 540,
    "end": 541,
    "note": "エリート3。最後のカプセル機会。",
    "spawns": [
      { "enemyId": "black_label_shadow", "spawnCount": 1, "directionWeights": { "bottom": 70, "top": 10, "left": 10, "right": 10 } }
    ]
  },
  {
    "start": 541,
    "end": 580,
    "note": "クライマックス。全敵混合。",
    "spawns": [
      { "enemyId": "ink_shadow", "spawnRatePerSecond": 1.0, "maxAlive": 60, "directionWeights": { "bottom": 40, "top": 20, "left": 20, "right": 20 } },
      { "enemyId": "paper_scrap_shadow", "spawnRatePerSecond": 0.65, "maxAlive": 36, "directionWeights": { "bottom": 35, "top": 20, "left": 22, "right": 23 } },
      { "enemyId": "lost_direction", "spawnRatePerSecond": 0.45, "maxAlive": 26, "directionWeights": { "bottom": 35, "top": 20, "left": 22, "right": 23 } },
      { "enemyId": "black_capsule", "spawnRatePerSecond": 0.22, "maxAlive": 14, "directionWeights": { "bottom": 40, "top": 20, "left": 20, "right": 20 } },
      { "enemyId": "night_haze", "spawnRatePerSecond": 1.0, "maxAlive": 60, "directionWeights": { "bottom": 35, "top": 20, "left": 22, "right": 23 } }
    ]
  },
  {
    "start": 580,
    "end": 600,
    "note": "最後の20秒。押し込み。",
    "spawns": [
      { "enemyId": "night_haze", "spawnRatePerSecond": 1.4, "maxAlive": 78, "directionWeights": { "bottom": 35, "top": 20, "left": 22, "right": 23 } },
      { "enemyId": "ink_shadow", "spawnRatePerSecond": 1.2, "maxAlive": 70, "directionWeights": { "bottom": 35, "top": 20, "left": 22, "right": 23 } }
    ]
  }
]
```

## ウェーブ調整時の注意

- `spawnRatePerSecond` は仮値。
- 実装の敵数・画面サイズ・武器火力で必ず調整する。
- 最初は敵を少なめにし、気持ちよく倒せるかを優先する。
- 後半だけ難しくする。

---

# 3. 画面レイアウト

## 基本画面

Vamp Pon は、画面内情報を少なくする。

プレイヤーが見たいもの:

```txt
自キャラ
敵の群れ
経験値/欠片
HP
レベル
時間
必殺技ゲージ
武器/パッシブ状況
```

## ゲーム中レイアウト

```txt
┌──────────────────────────────┐
│  09:42              Lv. 12    │
│  朝まで 00:18                │
│                              │
│                              │
│          敵・欠片・自キャラ     │
│                              │
│                              │
│ HP ███████░░  必殺技 ◯◯◯●   │
│ 武器: ✏️ 🟠 🔖 🧪 ☆          │
└──────────────────────────────┘
```

## 配置仕様

### 上中央

```txt
残り時間 / 経過時間
```

表示例:

```txt
朝まで 07:32
```

またはデバッグでは:

```txt
02:28 / 10:00
```

MVPでは分かりやすく `朝まで 07:32` を採用。

### 右上

```txt
Lv. 12
```

### 左下

```txt
HPバー
```

HPが35%以下になったらバーを点滅。

### 右下

```txt
必殺技ゲージ
```

表示例:

```txt
消えない名前  82%
```

満タン時:

```txt
消えない名前  発動OK
```

### 下中央

```txt
所持武器アイコン 4枠
所持パッシブアイコン 4枠
```

MVPでは小アイコン + レベルだけで良い。

```txt
✏️5  🟠3  🔖2  ☆1
🧭2  🎫1  🌙3
```

## 画面内演出ルール

### ダメージ数字

MVPでは入れても良いが、小さく。

多すぎると見づらい。

設定でOFFにできるのは後回し。

### 経験値/欠片

記憶の欠片は、薄い光粒。

視認性を優先して背景より明るくする。

### 影

敵は黒〜濃紺系でも、輪郭を分かりやすくする。

完全な黒ベタは背景と混ざるので避ける。

### 黒インク

黒インク床を入れる場合、敵や影と区別できるようにする。

MVPでは地形ギミックとしては後回しでも良い。

## レベルアップ画面レイアウト

```txt
┌──────────────────────────────┐
│        記憶が少し戻った        │
│                              │
│  ┌────────┐ ┌────────┐ ┌────────┐ │
│  │ 夜の鉛筆 │ │ 金のコンパス │ │ 回復 │ │
│  │ Lv.2    │ │ 新規       │ │ HP+20 │ │
│  │ ダメージ+4 │ │ 吸引範囲+10% │ │     │ │
│  └────────┘ └────────┘ └────────┘ │
│                              │
│    ひとつ選ぶ                 │
└──────────────────────────────┘
```

## 記憶カプセル画面レイアウト

```txt
┌──────────────────────────────┐
│        記憶カプセル           │
│                              │
│           ◯  →  ✨            │
│                              │
│       未完成の一行             │
│  書きかけのページほど、続きを急いでいる。 │
└──────────────────────────────┘
```

表示は1秒以内。

長い演出は不要。

## リザルト画面レイアウト

```txt
┌──────────────────────────────┐
│        朝まで残った           │
│                              │
│ 生存時間       10:00          │
│ 倒した影       842            │
│ 集めた欠片     516            │
│ 到達Lv         24             │
│                              │
│ 武器 ✏️5 🟠4 🔖3 🧪5 ☆5      │
│ 進化 未完成の一行 / 北極星のランタン │
│                              │
│ 新発見 図鑑+2 / 実績+1        │
│                              │
│ 黒いインクの下に、まだ道が残っている。 │
│                              │
│ [もう一度] [強化へ] [図鑑へ]  │
└──────────────────────────────┘
```

## UIで避けること

- 画面上に文字を出しすぎない
- 裏ストーリーを戦闘中に長文表示しない
- レベルアップでカード説明を長くしすぎない
- 武器効果に専門用語を使いすぎない

---

# 4. レベルアップUIの文言

## タイトル文言

候補:

```txt
記憶が少し戻った
忘れ物が光った
欠片が集まった
夜が少し薄くなった
```

MVP採用:

```txt
記憶が少し戻った
```

理由:

- 裏ストーリーと合う
- レベルアップ感がある
- 説明しすぎない

## 下部案内

```txt
ひとつ選ぶ
```

または

```txt
戻すものを選ぶ
```

MVP採用:

```txt
ひとつ選ぶ
```

理由:

- 分かりやすさ優先

## カード文言ルール

### 武器新規

```txt
新しい道具
```

例:

```txt
夜の鉛筆
新しい道具
近い影へ鉛筆弾を飛ばす。
```

### 武器強化

```txt
Lv.2
ダメージ +4
```

### パッシブ新規

```txt
忘れ物
```

例:

```txt
金のコンパス
忘れ物
欠片を拾いやすくなる。
```

### パッシブ強化

```txt
Lv.2
吸引範囲 +20%
```

### 回復

```txt
少し休む
HP +20
```

## レベルアップカード例

### 夜の鉛筆 新規

```txt
夜の鉛筆
新しい道具
近い影へ鉛筆弾を飛ばす。

芯は短いのに、まだ書きたいことがあるらしい。
```

### 夜の鉛筆 強化

```txt
夜の鉛筆 Lv.2
ダメージ +4

書き残した線が、少し濃くなる。
```

### ビー玉 新規

```txt
ビー玉
新しい道具
反射するビー玉を飛ばす。

転がすと、一瞬だけ遠い空が映る。
```

### 月のしおり 新規

```txt
月のしおり
新しい道具
周囲を回って近くの影を払う。

同じページに、まだ戻ってくる。
```

### 黒インクの小瓶 新規

```txt
黒インクの小瓶
新しい道具
影の足元にインクだまりを作る。

夜になると、少しだけ増える。
```

### 星くず弾 新規

```txt
星くず弾
新しい道具
小さな星弾をばらまく。

誰かが見上げた夜のかけら。
```

### 金のコンパス 新規

```txt
金のコンパス
忘れ物
欠片を拾いやすくなる。

北を指さない。なくしたものの方角だけを指す。
```

### 旅のバッジ 新規

```txt
旅のバッジ
忘れ物
武器のダメージが上がる。

小さな傷が、長い道のりを知っている。
```

### 月明かりのしおり 新規

```txt
月明かりのしおり
忘れ物
経験値の獲得量が上がる。

挟まれていたページは、いつも同じ場所で止まっている。
```

### 古い切符 新規

```txt
古い切符
忘れ物
移動速度が上がる。

帰りの切符ではなかったようだ。
```

### 白い余白 新規

```txt
白い余白
忘れ物
武器の待ち時間が短くなる。

もう一度書くために残されている。
```

### 回復

```txt
少し休む
HP +20

まだ、戻せる名前がある。
```

## UI文言で避けること

NG:

```txt
攻撃力倍率を1.25倍にします
DPS期待値が上昇します
この影は記憶なので救っています
```

OK:

```txt
攻撃力 +5%
欠片を拾いやすくなる
近い影へ鉛筆弾を飛ばす
```

---

# 5. 記憶カプセル演出

## 目的

記憶カプセルは、Vamp Pon版の宝箱。

役割:

```txt
報酬の快感
武器進化
裏ストーリー断片
強敵撃破の達成感
```

## 演出時間

MVPでは短い。

```txt
全体: 0.8〜1.2秒
```

長い宝箱演出は後回し。

## 演出フロー

### 1. ドロップ

黒ラベルの影を倒す。

```txt
カプセルが落ちる
小さく跳ねる
薄く光る
```

### 2. 接触/取得

プレイヤーが拾う。

```txt
画面を0.2秒だけ止める
周囲の音を少し引く
カプセルが中央に拡大
```

### 3. 開封

```txt
カプセルが左右に割れる
中から光/道具アイコン/武器名
```

### 4. 報酬表示

進化時:

```txt
記憶がつながった
未完成の一行
書きかけのページほど、続きを急いでいる。
```

通常強化時:

```txt
道具が少し戻った
夜の鉛筆 Lv.4
貫通 +1
```

### 5. 復帰

```txt
表示が上へ消える
ゲーム再開
欠片が少し吸い寄せられる
```

## カプセル種別

### 通常カプセル

```txt
色: くすんだ透明 + 淡い光
用途: 通常強化
```

### 進化カプセル

```txt
色: 金色の割れ目 + 白い光
用途: 武器進化
```

### 初発見カプセル

```txt
色: 青白い光
用途: 図鑑/実績初解放
```

MVPでは内部種別だけ持ち、見た目差は最低限でよい。

## カプセル文言

### 取得時

```txt
記憶カプセル
```

### 通常強化

```txt
道具が少し戻った
```

### 進化

```txt
記憶がつながった
```

### 図鑑初登録

```txt
名前が戻った
```

## 進化演出文

### 未完成の一行

```txt
記憶がつながった
未完成の一行
書きかけのページほど、続きを急いでいる。
```

### 北極星のランタン

```txt
記憶がつながった
北極星のランタン
迷わないためではなく、迷ったことを忘れないための灯り。
```

## リスク

### 演出が長い

テンポが死ぬ。

対策:

```txt
1.2秒以内
スキップ不要な短さ
```

### 何が起きたか分からない

進化/強化/図鑑の違いが曖昧だと不満。

対策:

```txt
進化時だけタイトルを「記憶がつながった」にする
通常強化は「道具が少し戻った」
```

### 裏ストーリーが説明的

対策:

```txt
1行だけ
直接真相を言わない
```

---

# 6. MVP実装タスク分解

## 実装前提

まだ本格実装に入るかは別判断。

ここでは、実装開始時に迷わないようタスクを分解する。

## Phase 0: セットアップ

### 0-1. 技術選定の最終確認

候補:

```txt
Vite + TypeScript + Phaser
```

作業:

```txt
package.json作成
Viteセットアップ
Phaser導入
src構成作成
```

完了条件:

```txt
空のゲーム画面が起動する
```

### 0-2. ディレクトリ構成

案:

```txt
src/
  main.ts
  game/
    scenes/
      BootScene.ts
      MainScene.ts
      LevelUpScene.ts
      ResultScene.ts
    systems/
      MovementSystem.ts
      WeaponSystem.ts
      EnemySpawnSystem.ts
      XpSystem.ts
      LevelUpSystem.ts
      UltimateSystem.ts
      CollisionSystem.ts
      WaveSystem.ts
    data/
      characters.ts
      weapons.ts
      passives.ts
      enemies.ts
      waves.ts
      evolutions.ts
    domain/
      types.ts
      balance.ts
```

MVPではJSONではなくTSオブジェクトでも良い。

ただしJSON化可能な形にする。

## Phase 1: 最小プレイアブル

### 1-1. プレイヤー移動

実装:

```txt
キーボード/WASD/矢印
ゲームパッドは後回し
スマホ操作は後回し
```

完了条件:

```txt
ユイを画面内で動かせる
```

### 1-2. カメラ/ワールド

MVPは固定画面でも良い。

推奨:

```txt
最初は固定画面
後で広いマップ+カメラ追従
```

理由:

```txt
敵湧きとUI検証が楽
```

### 1-3. 基本敵スポーン

実装:

```txt
インクの影を下中心に湧かせる
プレイヤーへ近づく
接触ダメージ
```

完了条件:

```txt
敵が湧いて追ってくる
接触するとHPが減る
```

### 1-4. 初期武器 夜の鉛筆

実装:

```txt
一定間隔で近い敵に弾を撃つ
敵に当たるとダメージ
敵が倒れる
```

完了条件:

```txt
何も押さなくても敵を倒せる
```

## Phase 2: ヴァンサバ中核

### 2-1. 記憶の欠片

実装:

```txt
敵死亡時に欠片ドロップ
拾うとXP増加
吸引範囲あり
```

完了条件:

```txt
欠片を拾って経験値バーが増える
```

### 2-2. レベルアップ

実装:

```txt
XP満タンで一時停止
3択表示
選択で武器/パッシブ獲得または強化
```

完了条件:

```txt
夜の鉛筆をLv.2にできる
```

### 2-3. 武器5種

順番:

```txt
夜の鉛筆
月のしおり
ビー玉
星くず弾
黒インクの小瓶
```

完了条件:

```txt
5武器がそれぞれ違う挙動をする
```

### 2-4. パッシブ5種

実装:

```txt
金のコンパス
旅のバッジ
月明かりのしおり
古い切符
白い余白
```

完了条件:

```txt
各ステータスに反映される
```

## Phase 3: ウェーブ/10分構造

### 3-1. WaveSystem

実装:

```txt
wavesデータに従って敵を出す
時間ごとに敵種類と密度変更
```

完了条件:

```txt
10分間の敵構成が変化する
```

### 3-2. 敵5種

順番:

```txt
インクの影
紙くずの影
迷子の方角
黒いカプセル
夜のもや
```

完了条件:

```txt
各敵にHP/速度/挙動差がある
```

### 3-3. 強敵 黒ラベルの影

実装:

```txt
3:00 / 6:00 / 9:00 出現
倒すと記憶カプセル
```

完了条件:

```txt
強敵を倒す報酬体験がある
```

## Phase 4: 記憶カプセル/進化

### 4-1. 記憶カプセル取得

実装:

```txt
拾うと短い演出
武器/パッシブ強化
```

完了条件:

```txt
カプセルで報酬が得られる
```

### 4-2. 進化条件

実装:

```txt
夜の鉛筆 Lv.5 + 月明かりのしおり
星くず弾 Lv.5 + 金のコンパス
```

完了条件:

```txt
条件達成後のカプセルで進化する
```

### 4-3. 進化武器2種

実装:

```txt
未完成の一行
北極星のランタン
```

完了条件:

```txt
進化時に明確に強くなったと感じる
```

## Phase 5: 必殺技

### 5-1. ゲージ

実装:

```txt
時間経過で溜まる
満タンで発動可能
```

MVPは時間経過だけで良い。

### 5-2. 消えない名前

実装:

```txt
欠片吸引
小型敵にダメージ
```

完了条件:

```txt
ピンチ/回収時に気持ちいい
```

### 5-3. 黒インク払い

2キャラ目を入れる場合。

実装:

```txt
画面内小型敵ダメージ
```

黒インク床消去は後回しでも良い。

## Phase 6: UI

### 6-1. ゲーム中UI

実装:

```txt
朝まで時間
Lv
HP
必殺技ゲージ
武器/パッシブアイコン
```

### 6-2. レベルアップUI

実装:

```txt
記憶が少し戻った
3択カード
ひとつ選ぶ
```

### 6-3. 記憶カプセルUI

実装:

```txt
記憶カプセル
道具が少し戻った / 記憶がつながった
報酬名
1行説明
```

### 6-4. リザルトUI

実装:

```txt
朝まで残った / 夜に飲まれた
数値結果
武器/進化
新発見
裏ストーリー1行
```

## Phase 7: 図鑑/実績/永続強化

### 7-1. 実績

MVP実績10個を実装。

完了条件:

```txt
条件達成で実績解除表示
```

### 7-2. 図鑑

MVPでは簡易一覧で良い。

```txt
敵図鑑
アイテム図鑑
```

### 7-3. 永続強化

最初は5種類。

```txt
攻撃力
吸引範囲
移動速度
最大HP
経験値取得
```

MVPの最初の遊び検証では後回しでもよい。

## Phase 8: 調整/品質

### 8-1. 10分クリア調整

目標:

```txt
初見: 5〜7分
数回プレイ: 10分クリア
```

### 8-2. 爽快感チェック

見る項目:

```txt
敵が溶けるか
欠片吸引が気持ちいいか
レベルアップ間隔が長すぎないか
進化が気持ちいいか
必殺技が使いたくなるか
```

### 8-3. 視認性チェック

見る項目:

```txt
影と背景が混ざらないか
欠片が見えるか
弾が見えるか
HPが読めるか
レベルアップカードが読めるか
```

### 8-4. 裏ストーリー過多チェック

見る項目:

```txt
戦闘中に文字が多すぎないか
説明しすぎていないか
知らなくても遊べるか
```

## MVP実装タスク優先順位

### 必須

```txt
プレイヤー移動
敵スポーン
自動攻撃
敵死亡
記憶の欠片
レベルアップ3択
武器5種
パッシブ5種
10分ウェーブ
リザルト
```

### 強く推奨

```txt
記憶カプセル
進化2種
必殺技1種
強敵 黒ラベルの影
図鑑/実績の最小表示
```

### 後回し可能

```txt
2キャラ目
永続強化
黒インク床
演出分岐
詳細図鑑
ゲームパッド/スマホ対応
```

## 実装しないこと

MVP v0.1ではやらない。

```txt
オンライン要素
ランキング
課金
ガチャ課金
長編ストーリー
大量キャラ
大量ステージ
高品質アニメーション
複雑な地形ギミック
```

## 完了条件

MVP v0.1 完了条件:

```txt
ユイで10分プレイできる
敵が時間で変化する
武器を選んで強化できる
少なくとも1つ進化できる
記憶カプセルが出る
必殺技が1つ使える
リザルトが出る
もう一度遊びたくなる小目標が出る
```

## 最終判断

この仕様で、Vamp Pon は以下の形になる。

```txt
ヴァンサバの中核
+
記憶の欠片
+
記憶カプセル
+
キャラ別必殺技
+
裏ストーリー断片
+
10分の短い爽快サバイバル
```

ここまで来たら、次は「実装してよいか」を判断する段階。

ただし、まだデザイン・画面モック・素材方針が不足している。

実装に入る前に最低限ほしいもの:

```txt
1. プレイヤー/敵/欠片の見た目方向
2. UIの色・フォント方針
3. 背景の最小方向
4. 仮素材で進めるか、本素材を先に作るか
```
