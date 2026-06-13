# Prototype 1 Visual Guardrail

## 目的

採用ビジュアル方向を、Prototype 1で使える実装ルールに落とす。

Prototype 1では本格素材を作らない。

ただし、以下がズレないようにする。

```txt
画面が見える
自キャラ/敵/欠片が判別できる
採用した紙片・絵本風ドットの方向から外れない
後で本格デザインへ移行できる
```

---

# 1. Prototype 1のビジュアル目標

Prototype 1の目的は、以下の手触り確認。

```txt
移動
自動攻撃
欠片回収
初レベルアップ
```

そのため、ビジュアルは完成度より視認性を優先する。

```txt
美麗さ: 後回し
視認性: 最優先
世界観の方向: 最小限入れる
```

---

# 2. 画面ワイヤー

## 論理解像度

```txt
390 x 844
```

## レイアウト

```txt
┌─────────────────────────┐
│ Time / HP / Lv           │  上部HUD
├─────────────────────────┤
│                         │
│        Play Area         │  中央プレイ領域
│                         │
│     player / enemies     │
│     fragments / shots    │
│                         │
├─────────────────────────┤
│ Stick         SkillSlot  │  左下スティック / 右下余白
└─────────────────────────┘
```

## Prototype 1では

```txt
右下SkillSlotは空でもよい
将来の必殺技ボタン用に空ける
```

---

# 3. UI安全領域

## 上部HUD

```txt
height: 72px目安
HP
Time
Lv
```

## 左下スティック

```txt
center: x=72, y=744 目安
radius: 56px
```

## 右下SkillSlot

```txt
center: x=318, y=744 目安
radius: 48px
Prototype 1では薄い枠だけ
```

## プレイ不可領域

UI上に敵/欠片/弾が重なってもよいが、重要な敵スポーンは避ける。

```txt
上部HUD直下 80px以内に初期スポーンしない
左下スティック上に重要欠片を置かない
```

---

# 4. Prototype 1仮素材一覧

## Player

```txt
id: yui_placeholder
shape: 小さなランタン持ちの丸いシルエット
size: 28〜34px
color: 明るい紙色 + 紺フード
light: 小さな暖色円
```

最低限、以下を満たす。

```txt
背景より明るい
敵より小さいが見失わない
ランタンの光で位置が分かる
```

## Enemy

```txt
id: ink_shadow
shape: 黒インクの丸い影
size: 28〜36px
color: 黒〜濃紺
eye: 白い小さな目
```

Prototype 1では1種類のみ。

## Fragment

```txt
id: memory_fragment
shape: 光る星型/紙片
size: 10〜14px
color: 金色/淡い黄色
light: 小さな発光
```

## Projectile

```txt
id: night_pencil_shot
shape: 小さな光る線/鉛筆弾
size: 6〜10px
color: 淡い金色/白
```

## Background

```txt
id: paper_night_floor
shape: 暗い紙風タイル
color: 深い夜紺 + くすんだ青紫
noise: 控えめ
paper scraps: 少なめ
```

---

# 5. 最小カラーロール

```txt
backgroundBase: #181B2E
backgroundSub: #2E3358
playerLight: #FFD78A
fragmentLight: #FFE38A
enemyBody: #08090F
enemyEye: #F6F2DD
cardBase: #E9D6B3
uiLine: #A08A6A
hp: #D95B6A
```

## 注意

色は固定値ではなく、初期基準。

Prototype 1では、以下だけ守る。

```txt
背景は暗い
ユイは暖色で見える
敵は黒いが目で見える
欠片は一番光る
```

---

# 6. 表示優先度

```txt
1. ユイ
2. 敵
3. 欠片
4. 弾
5. HUD
6. 背景
```

背景が上位要素を邪魔するなら、背景を薄くする。

---

# 7. Prototype 1でやらないこと

```txt
完成ドットアニメ
完成背景
完成カードUI
敵3種類
ボス
カプセル
進化演出
必殺技演出
```

---

# 8. 画像生成が必要なもの

Prototype 1前に必要なら以下のみ。

```txt
1. Prototype 1 gameplay mock
2. Minimal sprite reference sheet
3. UI card / HUD reference
4. Background tile reference
5. Memory fragment / pickup reference
```

これらは完成素材ではなく、実装の見た目方向を合わせるための参照画像。

---

# 9. 最重要

Prototype 1では、採用コンセプトを守りつつ、実装は軽くする。

```txt
コンセプトは濃く。
実装は見やすく軽く。
```
