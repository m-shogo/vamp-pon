# Vamp Pon GDD インデックス

## 目的

Vamp Pon の制作前資料が増えてきたため、どの資料を見れば何が分かるかを整理する。

このファイルは、GDD（Game Design Document）の入口として使う。

---

# 1. まず読む資料

## ワンシート企画書

```txt
docs/43-one-sheet-pitch.md
```

読む目的:

```txt
このゲームが何かを1枚で理解する
```

内容:

```txt
コンセプト
ジャンル
ターゲット
MVP範囲
独自性
成功条件
```

## コアループ/体験タイムライン

```txt
docs/44-core-loop-and-player-timeline.md
```

読む目的:

```txt
8分プレイで何が起きるべきか理解する
```

内容:

```txt
短期ループ
中期ループ
長期ループ
8分体験
初回感情
失敗パターン
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

# 2. 制作思想/判断基準

## 桜井さん参考チェックリスト

```txt
docs/42-sakurai-inspired-preproduction-checklist.md
```

読む目的:

```txt
遊びやすさ、分かりやすさ、情報整理を確認する
```

## 制作前仕様の到達度レビュー

```txt
docs/41-production-readiness-gap-review.md
```

読む目的:

```txt
今の資料で足りないものを把握する
```

## リスク管理表

```txt
docs/50-risk-management.md
```

読む目的:

```txt
破綻しやすいポイントを事前に確認する
```

---

# 3. ゲーム仕様

## Vampire Survivors参照仕様とVamp Pon仕様

```txt
docs/34-vampire-survivors-reference-and-vamp-pon-spec.md
```

読む目的:

```txt
ヴァンサバ型のどこを採用/変更するか把握する
```

## MVP詳細仕様

```txt
docs/35-mvp-v0-1-detailed-spec.md
```

読む目的:

```txt
キャラ、武器、パッシブ、敵、進化、リザルトの詳細を確認する
```

## MVP実装前仕様パッケージ

```txt
docs/36-mvp-implementation-ready-spec.md
```

読む目的:

```txt
データ化/画面/レベルアップ/カプセル/実装タスクを確認する
```

---

# 4. スマホ/アプリ前提

## アプリゲーム前提への仕様補正

```txt
docs/38-mobile-app-game-adjustment.md
```

読む目的:

```txt
PCヴァンサバではなく、スマホ向けにどう補正するか理解する
```

## スマホ入力仕様と画面遷移

```txt
docs/45-mobile-input-and-screen-flow.md
```

読む目的:

```txt
縦持ち操作、仮想スティック、必殺技ボタン、画面遷移を確認する
```

## アクセシビリティ/スマホユーザビリティ

```txt
docs/49-accessibility-and-mobile-usability.md
```

読む目的:

```txt
読める/押せる/分かる/疲れにくい基準を確認する
```

---

# 5. 裏ストーリー/世界観

## ストーリー/裏ストーリー方針

```txt
docs/30-story-and-hidden-lore-policy.md
```

読む目的:

```txt
表に出しすぎないストーリー方針を確認する
```

## 裏ストーリー実装パック

```txt
docs/31-hidden-lore-content-pack.md
```

読む目的:

```txt
アイテム説明、実績、図鑑文、秘宝説明の方向を見る
```

## キャラ別必殺技方針

```txt
docs/32-character-ultimate-skill-policy.md
```

読む目的:

```txt
必殺技をどう扱うか確認する
```

## キャラ/必殺技追加アイディア

```txt
docs/33-more-character-ultimate-ideas.md
```

読む目的:

```txt
MVP後のキャラ/必殺技候補を見る
```

---

# 6. 技術/実装方針

## 技術選定

```txt
docs/39-technology-choice.md
```

読む目的:

```txt
なぜWeb + TypeScript + Phaserで始めるのか理解する
```

## 破綻しないための開発計画

```txt
docs/40-anti-collapse-development-plan.md
```

読む目的:

```txt
フォルダ構成、型、システム、テスト、実装順を確認する
```

## デザイン保留・非デザイン領域プリ実装パック

```txt
docs/37-non-design-preimplementation-pack.md
```

読む目的:

```txt
デザインを保留したまま進めるロジック/状態/保存/テスト方針を見る
```

---

# 7. プロトタイプ/マイルストーン

## プロトタイプ検証計画

```txt
docs/46-prototype-validation-plan.md
```

読む目的:

```txt
何を検証するために段階的に作るか確認する
```

## 制作マイルストーン

```txt
docs/51-production-milestones.md
```

読む目的:

```txt
いつ何を作り、どこで次へ進むかを確認する
```

---

# 8. サウンド/フィードバック

## サウンド/フィードバック方針

```txt
docs/48-sound-and-feedback-policy.md
```

読む目的:

```txt
MVPで必要なSE、反応、音なし対応を確認する
```

---

# 9. 過去の題材検討

## 題材展開戦略

```txt
docs/23-format-theme-expansion-strategy.md
```

## 個人テーマ適性フィルター

```txt
docs/24-personal-theme-fit-filter.md
```

## 題材候補追加

```txt
docs/25-more-theme-candidates.md
```

## 星座テーマレビュー

```txt
docs/26-constellation-theme-review.md
```

## 歴史/国/文明テーマ

```txt
docs/27-history-country-civilization-themes.md
```

注意:

```txt
三国志は検討したが、現在は不採用。
```

---

# 10. 現在の制作判断

## 今作るべきもの

```txt
ユイで8分遊べる核
```

## 今作らないもの

```txt
本格デザイン
2人目キャラ
複数ステージ
オンライン
課金
PWA/Capacitor
```

## 最重要問い

```txt
仮素材でも、ユイで8分遊んで、もう一度遊びたいか？
```

この問いにYESを出すための資料群が、このGDDの目的。

---

# 11. 次に不足している資料

まだ作る価値があるもの。

```txt
1. デザインブリーフ
2. 画面別機能要件詳細
3. バランスログ雛形
4. アセットライセンスログ雛形
5. 実装開始チェックリスト
6. Prototype 1 タスクチケット分解
```

デザインブリーフは、デザインを別途詰める時に作る。

今すぐなら、実装開始チェックリストとPrototype 1タスク分解が有効。
