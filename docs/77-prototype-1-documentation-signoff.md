# Prototype 1 Documentation Sign-off

## 目的

Prototype 1へ進む前に、資料フェーズを完了扱いにする。

この資料は、以下を宣言する。

```txt
Prototype 1の資料は揃った
これ以上の資料追加は原則しない
次は実装/検証へ進む
```

---

# 1. Sign-off対象

対象はPrototype 1。

```txt
スマホ縦持ちで、移動・自動攻撃・欠片回収・初レベルアップが気持ちいいか確認する。
```

対象外。

```txt
Prototype 2
Prototype 3
本格デザイン
アプリ化
商用リリース
```

---

# 2. Prototype 1で作るもの

```txt
Vite + TypeScript + Phaser起動
390x844縦持ちキャンバス
ユイ仮表示
仮想スティック移動
インクの影スポーン
夜の鉛筆自動攻撃
敵死亡
記憶の欠片ドロップ
欠片取得/吸引
XP
Lv2
簡易HUD
被弾/HP減少最小
debug表示
検証ログ
```

---

# 3. Prototype 1で作らないもの

```txt
武器5種
パッシブ5種
3択正式版
記憶カプセル
進化
必殺技
ミチル
本格デザイン
図鑑
実績
永続強化
PWA
Capacitor
アプリストア対応
```

---

# 4. 完了済み資料

## 入口

```txt
README.md
docs/52-gdd-index.md
docs/61-gdd-executive-summary.md
```

## スコープ/判断

```txt
docs/47-mvp-freeze-list.md
docs/65-go-no-go-checklist.md
docs/68-production-readiness-score.md
docs/76-preproduction-gap-closure.md
```

## Prototype 1実装

```txt
docs/55-prototype-1-task-breakdown.md
docs/63-prototype-1-issue-template.md
docs/66-first-pr-plan.md
docs/74-pre-implementation-repo-inventory.md
docs/75-branch-pr-issue-workflow.md
```

## QA/ログ/運用

```txt
docs/60-qa-checklist.md
docs/70-prototype-playtest-report-template.md
docs/72-implementation-pr-review-checklist.md
docs/73-prototype-improvement-issue-template.md
docs/balance-log.md
docs/asset-license-log.md
```

---

# 5. 最終Go判定

```txt
Prototype 1: GO
Prototype 2: NO-GO
Prototype 3: NO-GO
Design Full Production: NO-GO
App Packaging: NO-GO
Commercial Release: NO-GO
```

---

# 6. 実装開始前に必ず行うこと

```txt
1. repo棚卸し
2. package.json/src/docsの状態確認
3. Prototype 1 Issue作成
4. First PRブランチ作成
5. P1-00/P1-01から順番に実装
```

---

# 7. 以後の資料追加ルール

Prototype 1開始前に、原則として新規資料を追加しない。

追加してよい例外:

```txt
既存資料の矛盾修正
Issue作成に必要な短い補足
実装中に判明した仕様抜け
```

追加してはいけないもの:

```txt
新キャラ案
新武器案
新ステージ案
本格ストーリー案
商用リリース案
```

---

# 8. 実装中の判断原則

```txt
迷ったらMVP凍結リストへ戻る
大きく作らず小さく検証する
仮素材で完成度評価しない
スマホで確認する
数値変更はbalance-logへ残す
外部素材はasset-license-logへ残す
```

---

# 9. Sign-off

```txt
Prototype 1 Documentation: COMPLETE
Readiness: 100 / 100
Next Phase: Prototype 1 Implementation
```

## 最重要

```txt
資料は完了。
次は手触りを作る。
```

Vamp Pon はここから、文書ではなくプレイ感で判断する。
