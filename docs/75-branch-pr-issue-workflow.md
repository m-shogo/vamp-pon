# Branch / PR / Issue Workflow

## 目的

Vamp Pon の実装を進める時に、作業単位が大きくなりすぎないようにする。

特に Prototype 1 では、1PRに詰め込みすぎると検証しづらくなる。

---

# 1. 基本方針

```txt
Issueで目的を固定
小さいPRで実装
PRごとに検証
Go/No-Goで次へ進む
```

## 禁止

```txt
Issueなしで大きく実装する
Prototype 1と2の内容を混ぜる
1PRで進化/必殺技まで入れる
```

---

# 2. ブランチ命名

## Prototype 1

```txt
feat/p1-00-bootstrap
feat/p1-01-portrait-canvas
feat/p1-02-player-placeholder
feat/p1-03-virtual-stick
feat/p1-04-ink-shadow-spawn
feat/p1-05-night-pencil
feat/p1-06-fragment-drop
feat/p1-07-fragment-pickup
feat/p1-08-xp-level-up
feat/p1-09-hud
feat/p1-10-damage-gameover
feat/p1-11-debug-overlay
```

## 改善系

```txt
fix/p1-movement-feel
balance/p1-fragment-magnet
balance/p1-first-level-up
```

## docs

```txt
docs/<topic>
```

---

# 3. PRサイズ

## 理想

```txt
1 Issue = 1 PR
```

## 許容

近いタスクならまとめてよい。

例:

```txt
P1-00 + P1-01
```

## 避ける

```txt
P1-03 + P1-05 + P1-08
```

理由:

```txt
移動/攻撃/成長が一気に入ると、問題の原因が分からない
```

---

# 4. PR本文テンプレ

```md
## 目的


## 対象Issue

- close #

## やったこと

- 

## やらないこと

- 

## 確認方法

- [ ] pnpm install
- [ ] pnpm dev
- [ ] pnpm build
- [ ] スマホブラウザ確認

## Prototype観点

- [ ] Prototype 1の目的から外れていない
- [ ] スマホ縦持ち前提
- [ ] 本格デザインを入れていない

## スクショ/動画

必要なら添付。

## メモ


```

---

# 5. Issue作成順

Prototype 1では、以下の順でIssue化する。

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
P1-11 デバッグ表示
P1-12 検証ログ
```

---

# 6. Merge条件

## Prototype 1 PR

```txt
[ ] 起動/動作確認済み
[ ] スコープ逸脱なし
[ ] スマホ前提を壊していない
[ ] TypeScriptエラーなし
[ ] README/GDDと矛盾なし
```

## できれば

```txt
[ ] pnpm build 通過
[ ] スマホブラウザ確認
```

Prototype初期ではCI未整備でもよい。

ただし、buildが壊れるPRはmergeしない。

---

# 7. PRレビュー担当の観点

レビューでは以下を優先する。

```txt
目的に合っているか
余計なものが入っていないか
次の検証がしやすいか
スマホで使えるか
コードが後で増やせるか
```

見た目の完成度は見ない。

---

# 8. Issueクローズ条件

Issueを閉じる条件。

```txt
受け入れ条件を満たす
確認方法が実施済み
必要ならログが残っている
スコープ外の問題は別Issue化済み
```

---

# 9. Prototype完了時

Prototype 1が終わったら、以下を必ず作る。

```txt
Playtest Report
Balance Log
Go/No-Go判定
改善Issue
```

Prototype 2へ進むのはその後。

---

# 10. 最重要

PRは作業量の単位ではなく、判断の単位。

```txt
このPRを見れば、次に進めるか分かる。
```

そういう粒度にする。
