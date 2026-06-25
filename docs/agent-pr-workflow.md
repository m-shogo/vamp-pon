# Agent PR Workflow Guide

Claude Code / Codex / ChatGPT / other coding agents に作業を投げる時のPR運用ルール。

目的は、スピードを落とさず、壊れにくいPRに分割すること。

## Core Rule

Agentには大きい目的を渡してもよい。  
ただし、PRは小さくする。

Good:

```txt
目的: 画面品質を上げる
PR1: 画像整理
PR2: design docs
PR3: Result visual
PR4: LevelUp visual
PR5: StageSelect visual
```

Bad:

```txt
1PRで画像整理、全画面実装、HUD改造、Result改造、Collection改造、バランス変更
```

## Default PR Size

Target:

- docs-only: up to several files OK
- visual helper: 1〜3 files
- screen implementation: 1 screen per PR
- gameplay logic: 1 system per PR
- asset move: naming/folders only unless trivial

Avoid:

- unrelated formatting
- broad rename
- silent logic changes
- multiple risky files in one PR

## Preferred PR Order for Visual Upgrade

1. Asset organization
2. Design system / QA docs
3. Shared UI helper
4. Result Clear
5. LevelUp
6. StageSelect
7. Collection
8. Battle HUD
9. Ultimate / 黒曜化
10. TOP final pass

Reason:

- Result is low-risk and high-impact.
- LevelUp is contained.
- StageSelect is scene UI but not combat-critical.
- Battle HUD is high-risk because readability matters.
- Cutin/黒曜化 can easily become noisy, so it comes after rules are fixed.

## Prompt Structure for Agents

Every prompt should include:

```txt
Target repo:
/Users/m-shogo/Developer/personal/vamp-pon only

Goal:
One clear goal

Scope:
Files or screens allowed

Do not touch:
Explicit forbidden files/systems

Must preserve:
Existing gameplay/save/test behavior

Design references:
Docs/images to use

Verification:
Commands to run

Report:
Required output format
```

## Required Opening Instruction

Use this at the top of heavy prompts:

```txt
あなたは `/Users/m-shogo/Developer/personal/vamp-pon` のみを対象に作業してください。
GitHub repo は `https://github.com/m-shogo/vamp-pon.git` です。
このrepo以外、他ディレクトリ、他プロジェクトは絶対に触らないでください。
```

## Visual PR Prompt Template

```txt
目的:
<screen> の見た目を design-system に沿って改善してください。

参照:
- docs/design-system.md
- docs/ui-implementation-contract.md
- docs/visual-qa-gates.md
- docs/asset-pipeline.md
- docs/design-targets/README.md

対象:
- <file path>

やる:
- <specific visual tasks>

やらない:
- gameplay logic変更
- reward/balance変更
- save/localStorage変更
- AI画像の一枚貼り
- 画像内文字の使用

実装方針:
- 既存ロジックは維持
- UIはPhaser Graphics/Text/helperで分解して再現
- 390x844可読性を最優先
- 大きいファイルは関数単位で最小編集

検証:
pnpm build
pnpm test
pnpm stage1:fun-pass:verify
pnpm character-assets:verify
pnpm runtime-assets:verify

完了レポート:
1. 変更ファイル
2. gameplay logic変更有無
3. 390x844確認
4. 実行コマンド結果
5. 残リスク
6. 次PR候補
```

## Asset Organization Prompt Template

```txt
目的:
assets直下や生成画像を整理し、docs/design-targetsとruntime assetsを分離してください。

参照:
- docs/asset-pipeline.md
- docs/design-system.md

やる:
- UUID画像を分類
- design targetはdocs/design-targetsへ移動
- runtime assetはpublic/assets配下へ安定命名
- docs/design-targets/README.mdを更新

やらない:
- 画像を本番UIとして貼る
- コードの大改造
- gameplay変更

完了レポート:
1. 移動前→移動後一覧
2. final/implementation/unknown分類
3. runtime採用候補
4. 再生成が必要な画像とprompt
5. 実行コマンド
```

## Review Prompt Template

Agentが完了報告を出したら、次のレビューをかける。

```txt
レビューしてください。

参照:
- docs/design-system.md
- docs/ui-implementation-contract.md
- docs/visual-qa-gates.md
- docs/asset-pipeline.md

確認:
1. PR scopeが広すぎないか
2. gameplay logicが変わっていないか
3. AI画像を一枚貼りしていないか
4. 文字を画像に依存していないか
5. 390x844で読めるか
6. high-risk filesを丸ごと書き換えていないか
7. Result/LevelUp/Battleなど画面別gateを満たしているか
8. build/test/verify結果はあるか

出力:
- merge OK / hold / rework
- 理由
- 必須修正
- 任意改善
```

## Merge Decision Rules

### Merge OK

- docs-only and scoped
- visual-only and tests pass
- no logic drift
- 390x844 considered
- code diff understandable
- high-risk files not rewritten wholesale

### Hold

- direction is good but verification missing
- screenshots missing
- 390x844 not confirmed
- minor label mismatch
- docs references incomplete

### Rework

- gameplay logic changed silently
- AI image used as full UI
- text baked into production image
- battle readability worsened
- result/growth flow broken
- save/localStorage touched without need
- large files rewritten wholesale

## File Risk Tiers

### Low Risk

- docs
- isolated UI helper
- design target README
- test docs

### Medium Risk

- `premiumPaperUi.ts`
- `storybookChoiceCard.ts`
- `inventorySlot.ts`
- `pressFeedback.ts`
- `collectionAtlasAtmosphere.ts`

### High Risk

- `overlays.ts`
- `hud.ts`
- `TopScene.ts`
- `StageSelectScene.ts`
- `CollectionScene.ts`
- main battle scene files
- save/localStorage files
- data definitions used by tests

Rules:

- Low risk can be larger.
- Medium risk should be focused.
- High risk must be tiny and reviewed carefully.

## Agent Report Requirements

Every agent completion should include:

```md
## Summary

## Changed files

## What changed visually

## Gameplay logic changes
None / explain

## Asset moves
None / list

## Verification
- pnpm build:
- pnpm test:
- pnpm stage1:fun-pass:verify:
- pnpm character-assets:verify:
- pnpm runtime-assets:verify:

## 390x844 check
Checked / not checked

## Risks

## Next suggested PR
```

## Do Not Ask Agents To

Avoid prompts like:

- `全部いい感じにして`
- `全画面プロっぽくして`
- `好きに直して`
- `Unityみたいにして`
- `一気に全部やって`

Replace with:

- `Result Clearだけ`
- `LevelUpカードだけ`
- `StageSelectの地図カードだけ`
- `Battle HUDのframeだけ`
- `画像整理だけ`

## Safe Parallel Work

When one agent is implementing UI, another can safely work on:

- docs
- Unity prep
- design prompts
- QA checklists
- naming conventions
- asset inventory

Avoid parallel edits to:

- same scene file
- same UI helper
- same asset paths
- same data file

## Conflict Prevention

Before starting a new branch:

1. base from latest `main`
2. avoid branches already being worked on
3. keep docs-only work separate from implementation
4. do not rename files another PR is editing

## Good Commit Messages

Examples:

```txt
Add design system foundation
Add asset pipeline guide
Polish result memory page UI
Polish level up paper cards
Organize design target images
Add battle HUD paper frame helpers
```

Avoid:

```txt
fix
update
色々
全部修正
デザイン
```

## Final Rule

Velocity is good only when the next PR is easier.

A PR that looks impressive but makes the next change harder is not progress.
