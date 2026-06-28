# 非Battle画面 final design 実装計画

作成日: 2026-06-28

## 目的

Unity移行前に、Battle以外の画面を `docs/design-targets/final/` の完成目標へ寄せる。
Battle gameplay、Battle HUD、敵、XP、武器、スポーン、候補生成、dawn_ticket通常出現条件は触らない。

## 対象画面

- TOP: `docs/design-targets/final/top-final.png`
- Stage Select: `docs/design-targets/final/stage-select-final.png`
- Result Clear/Fail: `docs/design-targets/final/result-clear-final.png`
- Collection: `docs/design-targets/final/collection-final.png`
- Level Up: `docs/design-targets/final/level-up-final.png`
- 黒曜化カットイン: `docs/design-targets/final/kokuyou-cutin-final.png`

除外: `docs/design-targets/final/battle-final.png`

## 生成補助画像

- `docs/design-targets/generated/non-battle-ui-helper-2026-06-28.png`
- 用途: 紙パネル、紙ボタン、封蝋、ランタン、星図、紙タグ、インク飛沫の実装参照。
- 注意: 画面へ1枚絵として貼らない。AI画像内に文字を持たせず、文字はゲーム側Textで描画する。
- 実装では基本的に Phaser Graphics と既存UI helperを優先し、必要な場合だけ部品抽出候補として扱う。

### 2026-06-28 pro polish 追加参照

- `docs/design-targets/generated/result-pro-layout-helper-390x844.png`
  - 用途: Resultの記憶ページ、封蝋ランク、Rewardsカード行、New Records行、下部CTA階層の実装参照。
  - 注意: runtimeへ直接貼らない。文字はゲーム側Textで描画し、画像内の空バーは余白/階層の参考に留める。
- `docs/design-targets/generated/collection-pro-layout-helper-390x844.png`
  - 用途: Collectionの紙index、2列カード、クリップ、進捗バー、下部ナビ、ランタン/コンパス装飾の実装参照。
  - 注意: runtimeへ直接貼らない。既存データ構造を保ったままPhaser Graphicsで分解して寄せる。
- `docs/design-targets/generated/non-battle-final-polish-ui-kit-2026-06-28.png`
  - 用途: Result / Collection / 黒曜化CTA周辺で使う紙部品、ランタン、封蝋、黒インク、キャッチ帯の参照。
  - 注意: runtimeへ直接貼らない。ランタンは形が崩れない部品参考として扱い、必殺/黒曜化のキャッチはゲーム側Textで描画する。

## 採用要素

- 紙札タイトルバナー、ノートページ、紙カード、紙タグ。
- 暗い夜背景、星図線、月/ランタンの暖色光。
- 封蝋シール、ランクシール、紙クリップ風アクセント。
- TOP/StageSelect/Result/Collectionで共通する紙UIの厚みと温度感。
- Level Upでは3枚カード、Normal/Good/Rareラベル、Rareの暖色glow。
- 黒曜化では斜めインクslash、暖色ランタンライン、黒曜化タイトル帯。

## 採用しない要素

- final画像を画面に1枚絵として貼ること。
- AI画像内の文字、ロゴ、細かい手書き文字。
- 大きなユイ立ち絵に依存するTOP構成。
- Battle HUDや戦闘フィールドの再設計。
- 文字が読めなくなる装飾密度。

## 現状ギャップ

- TOP: 既に紙UIとランタン演出はあるが、finalより中央紙パネル/主CTA/3小ボタンの階層が弱い。
- Stage Select: 機能は揃っているが、大きな地図カード、難易度3カード、Start Journey主CTAの強弱をさらに出せる。
- Result: 情報表示はあるが、記憶ページ、封蝋ランク、REWARDS/NEW RECORDSの達成感を強める余地がある。
- Collection: タブと情報量は揃っているが、finalの2列カード/クリップ/進捗バー/ノート感に寄せる余地がある。
- Level Up: 3カード構造は成立。Rare glow、上部バナー、Owned rowの紙UI統一を慎重に調整する。
- 黒曜化: 既存カットインは動く。finalの斜め構図と黒インクslash/ランタンラインを足す余地がある。

## 実装順

1. TOP
2. Stage Select
3. Result Clear/Fail
4. Collection
5. Level Up
6. 黒曜化カットイン

## 触るファイル

- `src/game/scenes/TopScene.ts`
- `src/game/scenes/StageSelectScene.ts`
- `src/game/scenes/CollectionScene.ts`
- `src/game/ui/overlays.ts`
- `src/game/ui/storybookChoiceCard.ts`
- `src/game/ui/characterCutin.ts`
- `src/game/ui/berserkFeedback.ts`
- 必要なら `src/game/ui/paperUi.ts` などの小さな非Battle用helper

## 原則触らないファイル

- `src/game/ui/hud.ts`
- `src/game/ui/inventorySlot.ts`
- `src/game/effects/EffectManager.ts`
- `src/game/systems/levelup.ts`
- `src/game/systems/enemies.ts`
- `src/game/systems/pickups.ts`
- `public/assets/sprites/`

## 390 x 844 確認観点

- 文字が読める。
- ボタンのタップ領域が足りる。
- 下部導線がSafe Areaに埋まらない。
- TOP/StageSelect/Resultの主要CTAが一目で分かる。
- Level Upカード本文がはみ出さない。
- dawn_ticketが通常候補に出ない。
- dawn_ticket QA復帰が壊れていない。

## commit分割方針

- 計画doc/生成補助画像。
- 共通UI helperを追加した場合は単独commit。
- 画面ごとに小さくcommit/push。
- build/test/checkが壊れた場合は次画面へ進まない。
