# ドキュメント運用ルール

## 目的

Vamp Pon は資料が増えてきた。

このまま資料を増やすだけだと、どれが最新か分からなくなり、逆に破綻する。

このドキュメントでは、GDD/仕様書の運用ルールを決める。

---

# 1. 資料の階層

## Level 1: 入口

最初に読む資料。

```txt
README.md
docs/52-gdd-index.md
docs/61-gdd-executive-summary.md
```

役割:

```txt
プロジェクト全体を短時間で理解する
```

## Level 2: 制作判断

作る/作らない/進む/止めるを判断する資料。

```txt
docs/43-one-sheet-pitch.md
docs/47-mvp-freeze-list.md
docs/46-prototype-validation-plan.md
docs/50-risk-management.md
docs/51-production-milestones.md
```

## Level 3: 実装仕様

実装時に見る資料。

```txt
docs/35-mvp-v0-1-detailed-spec.md
docs/36-mvp-implementation-ready-spec.md
docs/45-mobile-input-and-screen-flow.md
docs/53-screen-functional-requirements.md
docs/55-prototype-1-task-breakdown.md
docs/59-prototype-2-3-task-breakdown.md
```

## Level 4: 補助資料

必要に応じて見る資料。

```txt
docs/48-sound-and-feedback-policy.md
docs/49-accessibility-and-mobile-usability.md
docs/56-balance-log-template.md
docs/57-asset-license-log-template.md
docs/58-glossary.md
docs/60-qa-checklist.md
```

## Level 5: 過去検討

経緯確認用。

```txt
docs/23-*.md〜docs/33-*.md
```

---

# 2. 最新情報の優先順位

仕様が矛盾した場合の優先順位。

```txt
1. docs/47-mvp-freeze-list.md
2. docs/61-gdd-executive-summary.md
3. docs/52-gdd-index.md
4. docs/35-mvp-v0-1-detailed-spec.md
5. 古いテーマ検討資料
```

## 例

過去資料に「10分MVP」とあり、最新資料に「8分MVP」とある場合。

```txt
8分MVPを採用
```

理由:

```txt
スマホアプリ前提へ補正済みの方が新しい
```

---

# 3. 仕様変更ルール

仕様を変える時は、以下を更新する。

## MVP範囲が変わる場合

必ず更新:

```txt
docs/47-mvp-freeze-list.md
docs/61-gdd-executive-summary.md
```

必要に応じて更新:

```txt
docs/51-production-milestones.md
docs/46-prototype-validation-plan.md
```

## キャラ/武器/敵が変わる場合

必ず更新:

```txt
docs/35-mvp-v0-1-detailed-spec.md
docs/58-glossary.md
```

必要に応じて更新:

```txt
docs/36-mvp-implementation-ready-spec.md
```

## 操作/UIが変わる場合

必ず更新:

```txt
docs/45-mobile-input-and-screen-flow.md
docs/53-screen-functional-requirements.md
```

## 技術方針が変わる場合

必ず更新:

```txt
docs/39-technology-choice.md
docs/40-anti-collapse-development-plan.md
README.md
```

---

# 4. 新規資料を追加する条件

新しい資料を増やす前に確認する。

```txt
既存資料に追記で済まないか？
同じ内容を重複していないか？
この資料の読者は誰か？
制作判断に使うか？
実装に使うか？
```

## 新規作成してよい場合

```txt
新しい判断軸が必要
既存資料が長くなりすぎる
実装チケットとして独立させたい
レビュー用チェックリストが必要
```

## 追記でよい場合

```txt
既存仕様の微修正
数値の調整
文言の追加
表の更新
```

---

# 5. 古い資料の扱い

古い検討資料は消さない。

理由:

```txt
なぜ捨てたか分かる
後で戻る時の参考になる
判断経緯が残る
```

ただし、最新方針と矛盾する場合は、最新資料を優先する。

## 例

```txt
三国志テーマは過去検討として残すが、現在は不採用。
```

---

# 6. docs番号ルール

現状は番号付きで管理。

```txt
23-...
24-...
...
62-...
```

## ルール

```txt
新規資料は次の番号を使う
番号を飛ばさない
既存番号を使い回さない
```

## 注意

将来的に資料が多すぎる場合、カテゴリディレクトリへ再編する。

例:

```txt
docs/gdd/
docs/spec/
docs/prototype/
docs/archive/
```

ただし、MVP前は無理に再編しない。

---

# 7. コミットルール

資料追加:

```txt
docs: add <topic>
```

資料更新:

```txt
docs: update <topic>
```

実装:

```txt
feat: add <feature>
```

調整:

```txt
balance: tune <target>
```

修正:

```txt
fix: <issue>
```

---

# 8. 資料レビュー時の観点

```txt
最新方針と矛盾していないか
MVPスコープを増やしていないか
スマホ前提を忘れていないか
デザイン未確定を前提にしているか
読者が迷わないか
実装者が次に何をすればいいか分かるか
```

---

# 9. 現時点の正本

現時点で最も重要な正本は以下。

```txt
docs/47-mvp-freeze-list.md
docs/61-gdd-executive-summary.md
docs/44-core-loop-and-player-timeline.md
docs/46-prototype-validation-plan.md
docs/55-prototype-1-task-breakdown.md
```

この5つに反する実装はしない。

---

# 10. 最重要

資料は増やすことが目的ではない。

目的はこれ。

```txt
ユイで8分遊んで、もう一度遊びたい核を作るために迷わないこと。
```

資料がこの目的を邪魔するなら、資料を削る・統合する・更新する。
