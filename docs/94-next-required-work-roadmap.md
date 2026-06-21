# Next Required Work Roadmap

## 目的

Vamp Ponでこれから必要になる作業を、順番つきで整理する。

この資料は、今後の実装・検証・素材作成・デザイン本格化の道筋を示す。

---

# 1. 現在地

```txt
Documentation: Complete for Prototype 1
Gameplay Spec: Complete for Prototype 1
Visual Direction: Adopted
Minimum Asset Spec: Ready
Current Phase: Prototype 1 implementation preparation
```

---

# 2. Phase 0: 実装前準備

## 目的

Prototype 1実装に入る前にrepo状態を確認する。

## 必須

```txt
[ ] repo棚卸し
[ ] package.json確認
[ ] src確認
[ ] docs正本確認
[ ] 不要/過剰な実装が混ざっていないか確認
```

## 参照

```txt
docs/74-pre-implementation-repo-inventory.md
docs/77-prototype-1-documentation-signoff.md
docs/83-spec-signoff.md
```

---

# 3. Phase 1: Prototype 1 実装

## 目的

1分の核を作る。

```txt
移動
自動攻撃
欠片回収
初レベルアップ
```

## 作業順

```txt
P1-00 起動確認
P1-01 縦持ちキャンバス
P1-02 ユイ仮表示
P1-03 仮想スティック移動
P1-04 インクの影スポーン
P1-05 夜の鉛筆 自動攻撃
P1-06 敵死亡と欠片ドロップ
P1-07 欠片取得/吸引
P1-08 XP/レベルアップ
P1-09 簡易HUD
P1-10 被弾/ゲームオーバー最小
P1-11 debug表示
P1-12 検証ログ
```

## 完了条件

```txt
3秒以内に移動できる
最初の敵を10秒以内に倒せる
30秒以内に欠片回収の意味が分かる
60秒以内にLv2になる
スマホで操作が不快ではない
```

---

# 4. Phase 2: Prototype 1 検証/調整

## 目的

Prototype 2へ進めるか判断する。

## 作業

```txt
[ ] iPhone Safariで確認
[ ] Android Chromeで確認できれば確認
[ ] Playtest Report作成
[ ] Balance Log更新
[ ] Go/No-Go判定
[ ] 改善Issue作成
```

## No-Goなら

```txt
移動調整
敵速度/HP調整
欠片吸引範囲調整
XP to Lv2調整
背景密度調整
```

Prototype 2へ進まない。

---

# 5. Phase 3: Prototype 2 実装

## 開始条件

```txt
Prototype 1 Go
Playtest Reportあり
移動/自動攻撃/欠片回収が不快ではない
```

## 目的

```txt
3択レベルアップ、武器/パッシブ選択、ビルド差が楽しいか確認する。
```

## 主要作業

```txt
武器5種
パッシブ5種
3択カード
敵3種
5分ウェーブ
簡易リザルト
```

---

# 6. Phase 4: Prototype 2 検証/調整

## 見ること

```txt
武器差があるか
3択が読めるか
5分遊べるか
3分時点で退屈ではないか
パッシブが意味を持つか
```

## No-Goなら

```txt
武器挙動を変える
カード文言を短くする
敵変化を強める
XPテンポを直す
```

Prototype 3へ進まない。

---

# 7. Phase 5: Prototype 3 / MVP Stage 1

## 開始条件

```txt
Prototype 2 Go
武器差/3択/5分成長感が確認済み
```

## 目的

```txt
8分MVPとして、カプセル・進化・必殺技・リザルトまで成立するか確認する。
```

## 主要作業

```txt
8分ウェーブ
敵5種 + 黒ラベルの影
記憶カプセル
進化1〜2種
必殺技「消えない名前」
正式寄りリザルト
最小実績/図鑑通知
```

---

# 8. Phase 6: MVP Stage 1 判定

## 最重要問い

```txt
仮素材でも、ユイで8分遊んで、もう一度遊びたいか？
```

## Goなら

```txt
本格デザイン検討
Stage 2検討
メタ要素検討
```

## No-Goなら

```txt
Stage 2へ進まない
本格デザインへ進まない
8分体験を直す
```

---

# 9. Phase 7: 本格デザイン

## 開始条件

```txt
MVP Stage 1 Go
8分が退屈ではない
欠片回収が気持ちいい
進化/必殺技が機能している
```

## 作るもの

```txt
ユイ本番素材
敵5種本番素材
背景本番
UI本番
カード本番
進化/必殺技演出
```

---

# 10. Phase 8: Stage Expansion

## 開始条件

```txt
Stage 1 MVPが成立
スマホで重くない
本格デザインの方向が固まった
```

## 作る順

```txt
Stage 2
Stage 2 Boss
Stage 3
Stage 3 Boss
Stage 4
Stage 4 Boss
Stage 5
Stage 5 Boss
```

Stage 5から作らない。

---

# 11. Phase 9: Productization

## 開始条件

```txt
Webプロトタイプが面白い
継続プレイ価値がある
素材ライセンスが整理されている
```

## 作業

```txt
PWA
Capacitor
ストア検討
正式タイトル
アイコン
スクショ
プライバシーポリシー
利用規約
クラッシュログ
分析イベント
```

---

# 12. 最重要

順番を飛ばさない。

```txt
Prototype 1 → Prototype 2 → Prototype 3 → MVP判定 → 本格デザイン → Stage拡張 → Productization
```

途中でFuture Layerを混ぜると破綻する。
