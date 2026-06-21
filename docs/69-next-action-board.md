# Next Action Board

## 目的

資料フェーズ後に、次に何をするか迷わないようにする。

このボードは、Vamp Pon の次アクション管理に使う。

---

# 現在の状態

```txt
Production Readiness Score: 92 / 100
Prototype 1: GO
Prototype 2: NO-GO
Prototype 3: NO-GO
Design Full Production: NO-GO
App Packaging: NO-GO
```

## 現在やってよいこと

```txt
Prototype 1 実装準備
Prototype 1 Issue作成
Prototype 1実装
Prototype 1検証ログ作成
```

## 現在やってはいけないこと

```txt
武器5種を一気に作る
進化を作る
必殺技を作る
ミチルを作る
本格デザインを作る
PWA/Capacitorを作る
```

---

# 1. 最優先タスク

## A1: Prototype 1 Issue化

参照:

```txt
docs/63-prototype-1-issue-template.md
```

作るIssue:

```txt
[P1-00] プロジェクト起動確認
[P1-01] 縦持ちキャンバス
[P1-02] ユイ仮表示
[P1-03] 仮想スティック移動
[P1-04] インクの影スポーン
[P1-05] 夜の鉛筆 自動攻撃
[P1-06] 敵死亡と欠片ドロップ
[P1-07] 欠片取得/吸引
[P1-08] XP/レベルアップ
[P1-09] 簡易HUD
[P1-10] 被弾/ゲームオーバー最小
[P1-11] デバッグ表示
[P1-12] Prototype 1 検証ログ
```

## A2: First PR作成

参照:

```txt
docs/66-first-pr-plan.md
```

PR目的:

```txt
Prototype 1 の土台を作り、スマホ縦持ちで1分操作感を検証できる状態へ進める。
```

## A3: Prototype 1 検証

参照:

```txt
docs/56-balance-log-template.md
docs/60-qa-checklist.md
docs/65-go-no-go-checklist.md
```

検証すること:

```txt
移動
自動攻撃
欠片回収
初レベルアップ
スマホ縦持ち
```

---

# 2. 実装前の確認タスク

## B1: docs正本確認

読む資料:

```txt
README.md
docs/61-gdd-executive-summary.md
docs/47-mvp-freeze-list.md
docs/55-prototype-1-task-breakdown.md
docs/66-first-pr-plan.md
```

完了条件:

```txt
Prototype 1で何を入れないか理解している
```

## B2: 既存実装の棚卸し

確認するもの:

```txt
package.json
src/main.ts
src/styles.css
src/game/domain/types.ts
src/game/data/*.ts
```

注意:

```txt
資料作成中に一部実装土台が入っているため、実装前に状態を確認する。
```

## B3: 不要実装の扱い確認

資料作成前に入った実装土台が、Prototype 1と矛盾していないか確認する。

判断:

```txt
Prototype 1に使える → 残す
Prototype 1に不要だが害がない → 保留
Prototype 1を邪魔する → 削除/隔離
```

---

# 3. Prototype 1 実装順

```txt
1. 起動確認
2. 縦持ちキャンバス
3. ユイ仮表示
4. 移動
5. インクの影
6. 夜の鉛筆
7. 欠片
8. XP/Lv2
9. HUD
10. 被弾
11. debug
12. 検証ログ
```

絶対に順番を飛ばさない。

---

# 4. Prototype 1 完了後の判断

## Go条件

```txt
スマホで動かせる
移動が不快ではない
自動攻撃で敵を倒せる
欠片を拾える
60秒以内に初レベルアップする
もう少し武器を試したいと思える
```

## No-Go条件

```txt
移動が不快
敵を倒すのが気持ちよくない
欠片回収が面倒
1分以内に何が楽しいか分からない
スマホで重い
```

No-GoならPrototype 2へ進まない。

---

# 5. Prototype 1後にやること

## Goなら

```txt
Prototype 2 Issue化
Prototype 2 PR計画
武器5種/パッシブ5種へ進む
```

## No-Goなら

```txt
移動調整
敵HP/速度調整
夜の鉛筆CT/ダメージ調整
欠片吸引範囲調整
```

---

# 6. 資料側の残タスク

優先度低めだが、後で有効。

```txt
Prototype 2 Issue Template
Prototype 3 Issue Template
Design Full Brief
UI Wireframe Notes
Audio Asset Candidate List
```

ただし、Prototype 1前に増やしすぎない。

---

# 7. 最終判断

今やるべきことは明確。

```txt
Prototype 1へ進む。
```

ただし、これは「実装全開」ではない。

```txt
1分の核だけ作る。
```

この制限を守る。
