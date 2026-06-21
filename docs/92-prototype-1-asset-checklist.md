# Prototype 1 Asset Checklist

## 目的

Prototype 1で必要な仮素材を、実装前に確認するためのチェックリスト。

このチェックリストは、本番素材制作ではなく、実装に必要な最小素材の確認に使う。

---

# 1. 必須仮素材

## Player

```txt
assetId: player_yui_placeholder
```

```txt
[ ] 34〜40px相当で表示できる
[ ] 暗い背景で見える
[ ] ランタンの暖色がある
[ ] 敵と混同しない
[ ] 当たり判定より見た目が少し大きい
```

---

## Enemy

```txt
assetId: enemy_ink_shadow_basic
```

```txt
[ ] 30〜36px相当で表示できる
[ ] 黒インクの影に見える
[ ] 白目で位置が分かる
[ ] 背景の黒汚れと混同しない
[ ] Prototype 1ではHPバーなしでも敵と分かる
```

---

## Pickup

```txt
assetId: pickup_memory_fragment
```

```txt
[ ] 10〜14px相当で表示できる
[ ] 暗い背景で一番目立つ小物
[ ] 星型/紙片型に見える
[ ] 拾いたくなる
[ ] 弾と混同しない
```

---

## Projectile

```txt
assetId: projectile_night_pencil
```

```txt
[ ] 8〜14px程度の光る線
[ ] 敵へ飛んでいると分かる
[ ] 欠片より細い/速い印象
[ ] 画面に増えてもうるさすぎない
```

---

## Background

```txt
assetId: background_paper_night_floor
```

```txt
[ ] 深い夜紺/青紫
[ ] 紙風タイル
[ ] 中央プレイ領域が薄い
[ ] 装飾は端寄せ
[ ] 敵/欠片/プレイヤーを邪魔しない
```

---

## HUD

```txt
assetId: ui_hud_minimal
```

```txt
[ ] HPが読める
[ ] 時間が読める
[ ] Lvが読める
[ ] 高さ64〜72px程度
[ ] 装飾しすぎない
```

---

## Virtual Stick

```txt
assetId: ui_virtual_stick
```

```txt
[ ] 左下に置く
[ ] 半透明
[ ] 指を置く位置が分かる
[ ] 背景を邪魔しない
```

---

## Empty Skill Slot

```txt
assetId: ui_skill_slot_empty
```

```txt
[ ] 右下に置く
[ ] Prototype 1では機能なし
[ ] 将来の必殺技用余白として見える
[ ] 主張しすぎない
```

---

# 2. 初期は画像なしでもよいもの

以下はPhaserの図形描画で代用可能。

```txt
player_yui_placeholder
enemy_ink_shadow_basic
pickup_memory_fragment
projectile_night_pencil
ui_virtual_stick
ui_skill_slot_empty
```

背景も、最初は単色+薄いノイズでよい。

---

# 3. 画像が必要になったら作るもの

Prototype 1後に、必要なら以下を作る。

```txt
player_yui_placeholder.png
enemy_ink_shadow_basic.png
pickup_memory_fragment.png
projectile_night_pencil.png
background_paper_night_floor.png
```

ただし、生成画像をそのまま使う場合はライセンス/出所を記録する。

```txt
docs/asset-license-log.md
```

---

# 4. NGチェック

```txt
[ ] 背景が一番目立っている
[ ] 敵が背景の黒汚れに埋もれる
[ ] 欠片が見えない
[ ] UIが大きすぎる
[ ] 主人公が敵より見つけにくい
[ ] 仮素材なのに作り込みすぎている
```

1つでも当てはまるなら調整する。

---

# 5. 完了条件

Prototype 1開始前のアセット完了条件。

```txt
[ ] 画像なしでも実装できる
[ ] 参照画像がある
[ ] 最小サイズが決まっている
[ ] 表示優先度が決まっている
[ ] 背景密度ルールがある
[ ] ライセンス管理ルールがある
```

---

# 最重要

Prototype 1はアート完成度を測る場ではない。

```txt
仮素材で、遊びの核が見えるかを測る。
```
