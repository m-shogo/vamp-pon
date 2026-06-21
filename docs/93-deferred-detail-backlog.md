# Deferred Detail Backlog

## 目的

今すぐ決めきれない細部、今は作らないが将来必要になるものを整理する。

この資料は、Prototype 1中に仕様が膨らむことを防ぐための保管場所。

---

# 1. 分類

## Now

Prototype 1前またはPrototype 1中に必要。

## Next

Prototype 1 Go後、Prototype 2/3で必要。

## Later

MVP後、またはStage拡張で必要。

## Product

公開/運用/商用化で必要。

---

# 2. Now: Prototype 1で必要

## repo棚卸し

```txt
package.json
src/main.ts
src/styles.css
src/game
README/docs正本
```

## 実装Issue

```txt
P1-00 起動確認
P1-01 縦持ちキャンバス
P1-02 ユイ仮表示
P1-03 仮想スティック移動
P1-04 インクの影スポーン
P1-05 夜の鉛筆
P1-06 欠片ドロップ
P1-07 欠片取得
P1-08 XP/Lv2
P1-09 HUD
P1-10 被弾
P1-11 debug
P1-12 検証ログ
```

## 仮素材

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

## 数値ログ

```txt
docs/balance-log.md
```

---

# 3. Next: Prototype 2で必要

## 武器5種の実装詳細

```txt
夜の鉛筆
ビー玉
月のしおり
黒インクの小瓶
星くず弾
```

必要になる細部:

```txt
Lvごとのdamage/cooldown/count/range
画面内最大弾数
重なった時の視認性
SE/ヒット感
```

## パッシブ5種の数値

```txt
金のコンパス
旅のバッジ
月明かりのしおり
古い切符
白い余白
```

必要になる細部:

```txt
倍率の上限
複数効果の計算順
UI表示文
Lv.MAX時の候補除外
```

## 3択レベルアップ

必要になる細部:

```txt
候補抽選比率
候補3つ未満の補充
カード表示文
重複禁止
HP低下時の回復候補
```

---

# 4. Next: Prototype 3で必要

## 記憶カプセル

必要になる細部:

```txt
ドロップ演出
取得範囲
演出秒数
進化判定優先度
通常強化との優先順位
```

## 進化

必要になる細部:

```txt
夜の鉛筆 + 月明かりのしおり
星くず弾 + 金のコンパス
進化演出
進化後の武器枠扱い
進化後のカード表示
```

## 必殺技

必要になる細部:

```txt
ゲージ増加条件
ボタン表示
使用可能演出
発動中の欠片吸引
小型影へのダメージ
クールタイム
```

## リザルト

必要になる細部:

```txt
生存時間
Lv
撃破数
取得欠片
進化数
使用武器
次の目標
```

---

# 5. Later: Stage 2〜5で必要

## Stage別背景

```txt
通学路
図書室
迷子の駅
朝を忘れた地図帳
```

## Stage別敵

```txt
紙くず系強化
黒インク床系
列車/標識系
最終影系
```

## Boss

```txt
名札をなくした影
塗りつぶされた司書
終点のない車掌
朝を忘れた影
```

## 解放条件

```txt
Stageクリア
実績
記憶断片
```

---

# 6. Later: デザイン本格化で必要

## キャラ

```txt
ユイ本番スプライト
ユイ歩行アニメ
被弾/取得/勝利/失敗差分
```

## 敵

```txt
敵5種本番スプライト
強敵
ボス
```

## UI

```txt
HUD本番
カード本番
カプセル演出
リザルト
図鑑/実績
```

## サウンド

```txt
欠片取得SE
被弾SE
レベルアップSE
カプセルSE
進化SE
必殺技SE
```

---

# 7. Product: 公開/運用で必要

```txt
PWA設定
Capacitor検討
プライバシーポリシー
利用規約
問い合わせ導線
クラッシュログ
分析イベント
ストア用スクショ
アイコン
正式タイトル
```

---

# 8. 今決めないもの

以下は今決めない。

```txt
正式タイトル
課金/広告
Stage 5演出詳細
本格ボスHP
複数キャラ解放条件
ストア説明文
```

理由:

```txt
Stage 1の核が未検証だから
```

---

# 9. 最重要

未決定は悪ではない。

悪いのは、未決定をPrototype 1に混ぜること。

```txt
今作るものはNowだけ。
Next/Later/Productは保管する。
```
