# Vamp Pon GDD インデックス

## 目的

Vamp Pon のGDD（Game Design Document）の入口。

現在は **Prototype 1 実装準備完了** の状態。

このファイルは、どの資料を読めば何が分かるかを整理する。

---

# 1. 最初に読む資料

## 現在地

```txt
README.md
```

読む目的:

```txt
今作るもの/作らないものを理解する
```

## GDD概要

```txt
docs/61-gdd-executive-summary.md
```

読む目的:

```txt
ゲーム全体のコンセプト、MVP、最重要問いを理解する
```

## MVP凍結リスト

```txt
docs/47-mvp-freeze-list.md
```

読む目的:

```txt
MVPで作るもの/作らないものを確認する
```

---

# 2. Prototype 1へ進む前に必ず読む資料

## Documentation Sign-off

```txt
docs/77-prototype-1-documentation-signoff.md
```

読む目的:

```txt
資料フェーズが完了していることを確認する
```

## Gameplay Spec Sign-off

```txt
docs/83-spec-signoff.md
```

読む目的:

```txt
Prototype 1仕様が完了していることを確認する
```

## Implementation Brief

```txt
docs/95-prototype-1-implementation-brief.md
```

読む目的:

```txt
Codex/Claude/Fable/Cursorへ渡せる実装指示を確認する
```

## Final Preflight Checklist

```txt
docs/96-final-preflight-checklist.md
```

読む目的:

```txt
実装直前に破綻要因がないか確認する
```

---

# 3. Prototype 1仕様

## Prototype Spec Lock

```txt
docs/79-prototype-spec-lock.md
```

読む目的:

```txt
Prototype 1/2/3で何を入れるか固定する
```

## Runtime Rules / Collision Spec

```txt
docs/80-runtime-rules-and-collision-spec.md
```

読む目的:

```txt
時間、入力、スポーン、衝突、被弾、欠片取得のルールを確認する
```

## Data Contract

```txt
docs/81-data-contract.md
```

読む目的:

```txt
武器/敵/パッシブ/ウェーブ/進化/セーブデータのデータ契約を確認する
```

## Balance Target Matrix

```txt
docs/82-balance-target-matrix-and-acceptance.md
```

読む目的:

```txt
Prototypeごとの合格数値を確認する
```

---

# 4. ビジュアル/アセット

## 採用ビジュアル方向

```txt
docs/88-adopted-visual-direction.md
```

読む目的:

```txt
紙片・絵本風ドットの採用方向を確認する
```

## Prototype 1 Visual Guardrail

```txt
docs/89-prototype-1-visual-guardrail.md
```

読む目的:

```txt
Prototype 1で見える/軽い/ズレない見た目ルールを確認する
```

## Visual Reference Prompts

```txt
docs/90-visual-reference-image-prompts.md
```

読む目的:

```txt
参照画像生成プロンプトを確認する
```

## Minimum Asset Spec

```txt
docs/91-minimum-asset-spec.md
```

読む目的:

```txt
Prototype 1の最小アセット、サイズ、密度、表示優先度を確認する
```

## Prototype 1 Asset Checklist

```txt
docs/92-prototype-1-asset-checklist.md
```

読む目的:

```txt
仮素材が実装可能な状態か確認する
```

---

# 5. 実装運用

## Prototype 1 Task Breakdown

```txt
docs/55-prototype-1-task-breakdown.md
```

読む目的:

```txt
Prototype 1を小さいタスクへ分解する
```

## Prototype 1 Issue Template

```txt
docs/63-prototype-1-issue-template.md
```

読む目的:

```txt
GitHub Issue化する
```

## First PR Plan

```txt
docs/66-first-pr-plan.md
```

読む目的:

```txt
最初のPRで入れる範囲を確認する
```

## Branch / PR / Issue Workflow

```txt
docs/75-branch-pr-issue-workflow.md
```

読む目的:

```txt
PRを小さく保ち、Prototypeの目的を守る
```

## Implementation PR Review Checklist

```txt
docs/72-implementation-pr-review-checklist.md
```

読む目的:

```txt
実装PRをレビューする
```

---

# 6. 検証/調整/ログ

## QA Checklist

```txt
docs/60-qa-checklist.md
```

## Playtest Report Template

```txt
docs/70-prototype-playtest-report-template.md
```

## Prototype Improvement Issue Template

```txt
docs/73-prototype-improvement-issue-template.md
```

## Balance Log

```txt
docs/balance-log.md
```

## Asset License Log

```txt
docs/asset-license-log.md
```

---

# 7. 破綻防止/Future管理

## Future Layer Governance

```txt
docs/86-future-layer-governance.md
```

読む目的:

```txt
Stage 2〜5、ボス、追加キャラがMVPへ流れ込まないようにする
```

## Deferred Detail Backlog

```txt
docs/93-deferred-detail-backlog.md
```

読む目的:

```txt
今決めない細部、後で必要なものを保管する
```

## Next Required Work Roadmap

```txt
docs/94-next-required-work-roadmap.md
```

読む目的:

```txt
Prototype 1からProductizationまでの順番を確認する
```

---

# 8. Stage/Boss Future Layer

## Stage and Boss Roadmap

```txt
docs/84-stage-and-boss-roadmap.md
```

## Boss Design Spec

```txt
docs/85-boss-design-spec.md
```

扱い:

```txt
Future Layer。Prototype 1〜3/MVP Stage 1には入れない。
```

---

# 9. 過去検討/参考資料

以下は判断経緯として残す。

```txt
docs/23-format-theme-expansion-strategy.md
docs/24-personal-theme-fit-filter.md
docs/25-more-theme-candidates.md
docs/26-constellation-theme-review.md
docs/27-history-country-civilization-themes.md
docs/28-sangokushi-theme-review.md
docs/29-sangokushi-real-name-policy.md
```

注意:

```txt
妖怪/三国志は現在のMVPでは不採用。
星座は主軸ではない。
```

---

# 10. 現在の制作判断

## 今作るもの

```txt
Prototype 1
移動
自動攻撃
欠片回収
初レベルアップ
```

## 今作らないもの

```txt
武器5種
パッシブ5種
カプセル
進化
必殺技
ミチル
Stage 2〜5
ボス
本格デザイン
アプリ化
```

## 最重要

```txt
資料追加で安心しない。
実装して触る。
```

Prototype 1は、文書の正しさではなく手触りを確認するためにある。
