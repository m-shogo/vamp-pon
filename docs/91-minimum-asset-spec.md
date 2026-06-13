# Minimum Asset Spec

## 目的

採用した参照画像を、Prototype 1で実装できる最小アセット仕様に落とす。

この資料は、完成素材の仕様ではない。

目的は以下。

```txt
仮素材でも見える
世界観がズレない
実装が軽い
後で本素材へ差し替えやすい
```

---

# 1. Prototype 1 必須アセット

Prototype 1で必要な最小アセットはこれだけ。

```txt
player_yui_placeholder
enemy_ink_shadow_basic
pickup_memory_fragment
projectile_night_pencil
background_paper_night_floor
ui_hud_minimal
ui_virtual_stick
ui_skill_slot_empty
```

## 作らない

```txt
敵3種
カプセル
進化演出
必殺技演出
本番カードUI
本番背景
本番アニメーション
```

---

# 2. 画面基準

```txt
logicalWidth: 390
logicalHeight: 844
```

## 表示優先度

```txt
1. Player
2. Enemy
3. Pickup
4. Projectile
5. HUD
6. Background
```

背景が上位要素を邪魔する場合、背景を削る。

---

# 3. Player: yui_placeholder

## 役割

Prototype 1でユイの位置を認識させる。

## サイズ

```txt
visualSize: 34〜40px
collisionRadius: 14〜16px
```

## 見た目

```txt
小さな忘れ物係
紺色のフード/帽子
淡い紙色の服
小さなランタン
暖色の足元光
```

## 必須条件

```txt
暗い背景で見失わない
敵より少し情報量が多い
欠片より大きい
ランタンの暖色で位置が分かる
```

## Prototype 1実装方法

初期は画像でなくてもよい。

```txt
小さな丸/身体
フード色
ランタン光の円
```

で代用可能。

---

# 4. Enemy: enemy_ink_shadow_basic

## 役割

Prototype 1唯一の敵。

## サイズ

```txt
visualSize: 30〜36px
collisionRadius: 14〜17px
```

## 見た目

```txt
黒インクの丸い影
白い小さな目
周囲にインク粒
少しぷにっとしたシルエット
```

## 必須条件

```txt
背景の黒インク汚れと同化しない
白目で位置が分かる
怖すぎないが敵だと分かる
```

## HPバー

Prototype 1では通常敵にHPバーを出さない。

理由:

```txt
画面が汚れる
敵数が増えた時に読みにくい
```

Debug時のみ表示は可。

---

# 5. Pickup: pickup_memory_fragment

## 役割

欠片回収の気持ちよさを作る。

## サイズ

```txt
visualSize: 10〜14px
collectRadius: 18px
magnetRange: 70px
```

## 見た目

```txt
星型に近い光る紙片
淡い金色
白い中心光
小さな粒子
```

## 必須条件

```txt
背景で一番見つけやすい小物
敵撃破後に拾いたくなる
小さくても見える
```

## 注意

光らせすぎて弾や敵を邪魔しない。

---

# 6. Projectile: projectile_night_pencil

## 役割

夜の鉛筆の自動攻撃を表現する。

## サイズ

```txt
visualLength: 8〜14px
visualWidth: 3〜5px
collisionRadius: 5px
```

## 見た目

```txt
小さな光る線
淡い金色/白
鉛筆のニュアンスは最小限
```

## 必須条件

```txt
弾だと分かる
欠片と混同しない
敵に向かって飛んでいると分かる
```

---

# 7. Background: background_paper_night_floor

## 役割

世界観を出しつつ、ゲーム要素を邪魔しない。

## 見た目

```txt
暗い紙風タイル
深い夜紺
くすんだ青紫
少量の紙片
薄い黒インク汚れ
画面端に街灯/標識/紙片
```

## 密度

参照画像の75〜85%に落とす。

```txt
中央プレイ領域は薄く
装飾は端に寄せる
紙片は少なめ
黒インク汚れは敵と混同しない濃さ
```

## 禁止

```txt
中央に強い装飾
敵と同じ黒丸汚れを多用
明るすぎる床
細かすぎる文字/紙片の乱用
```

---

# 8. HUD: ui_hud_minimal

## 役割

必要情報を読ませる。

## 表示

```txt
HP
Time
Lv
```

## サイズ

```txt
hudHeight: 64〜72px
```

## 見た目

```txt
紙片風でもよい
Prototype 1では簡易でよい
```

## 必須条件

```txt
時間が読める
HPが読める
Lvが読める
プレイ領域を圧迫しすぎない
```

---

# 9. Virtual Stick

## 位置

```txt
centerX: 72
centerY: 744
outerRadius: 56
innerRadius: 24
```

## 見た目

```txt
半透明
背景を邪魔しない
指を置く場所が分かる
```

---

# 10. Skill Slot Empty

Prototype 1では必殺技はない。

ただし将来の位置を空ける。

```txt
centerX: 318
centerY: 744
radius: 48
opacity: 20〜35%
```

---

# 11. Prototype 1 Asset Acceptance

```txt
[ ] プレイヤーを3秒以内に見つけられる
[ ] 敵を背景と区別できる
[ ] 欠片が小さくても見える
[ ] 弾と欠片を混同しない
[ ] UIが読める
[ ] 背景が一番目立たない
[ ] スマホ縦画面で破綻しない
```

---

# 12. 本素材化の前に

Prototype 1で以下を確認してから本素材を作る。

```txt
移動が気持ちいい
敵が見える
欠片が拾いたい
背景が邪魔しない
```

本素材化はPrototype 3後でよい。

---

# 最重要

参照画像をそのまま実装しない。

```txt
見た目の方向は採用。
実装は最小・軽量・判別優先。
```
