# Design System Foundation

Vamp Pon / Lantern Ledger の画面品質を崩さないためのデザイン土台。

この文書は、Phaser実装・画像再生成・Unity移行のすべてで参照する。目的は、画面ごとの気分でデザインがブレることを防ぎ、390x844のスマホ画面で読みやすく、押したく、世界観が残るUIを安定して作ること。

## Core Direction

このゲームは、汎用ファンタジーでも、ソシャゲ風UIでも、ネオンSFでもない。

方向性:

- dark storybook action roguelite
- night / memory / forgotten objects / black ink / small lantern light / dawn
- paper scraps / star-map motifs / ink bleed / subtle pixel flavor
- 暗いが怖すぎない
- 温かいが甘すぎない
- 手作り感があるが安っぽくない
- 390x844で読める
- スマホアプリとして押したく見える

## Product Name Handling

- repo名やpackage名は変更しない。
- `Vamp Pon` は開発コード名として扱う。
- 画面上の仮タイトルは `Lantern Ledger` を使ってよい。
- 和名候補として `夜灯録` を保持する。
- タイトル文字は画像に焼き込まず、ゲーム側Textで描画する。
- 本正式タイトルは後で差し替え可能にする。

## Core Motifs

### Night

夜は舞台。暗さは必要だが、恐怖ではなく余白を作る。

Use:

- deep navy background
- soft vignette
- faint street / map / notebook silhouette

Avoid:

- 真っ黒で何も見えない背景
- ホラー血色
- 過度な霧

### Memory

記憶は報酬・EXP・図鑑・Resultに使う。

Use:

- amber fragments
- muted teal fragments
- small paper pieces
- star-like dots
- curved pickup trails

Avoid:

- 宝石ガチャ演出
- neon particles
- 大量のキラキラ

### Forgotten Objects

忘れ物は武器・パッシブ・図鑑カードの基礎。

Use:

- pencil
- paper airplane
- lantern
- ink bottle
- streetlight ring
- old ticket
- key
- torn map

Avoid:

- 汎用剣盾魔法杖だけ
- メタリック宝具
- SF銃器

### Black Ink

黒インクは危険・忘却・未発見・黒曜化を表す。

Use:

- enemy death
- locked card
- hard difficulty
- screen edge during 黒曜化
- defeat result

Avoid:

- 全画面を常に汚す
- UIの可読性を潰す
- 赤黒ホラー化

### Lantern Light

ランタン光は主人公性・希望・CTA・回収の意味を持つ。

Use:

- primary button
- player radius
- result reward
- rare highlight
- ultimate ready
- 黒曜化のcore

Avoid:

- 画面全体を金色にする
- どのボタンも同じ強さで光らせる
- 白飛び

### Dawn

朝は勝利・回復・到達の表現。

Use:

- Result Clear
- stage clear transition
- memory restored moment

Avoid:

- 常時昼間化
- 世界観から夜を消す

## Color Tokens

| Token | Hex | Purpose |
|---|---:|---|
| deep night navy | `#0F1320` | base background |
| black ink violet | `#151020` | ink shadow / danger base |
| ink black | `#07060B` | edge ink / strongest dark |
| paper beige | `#D8C49A` | main paper UI |
| paper dark | `#6E5A3B` | paper border / shadow |
| warm amber | `#F4C46A` | lantern / primary CTA / reward |
| lantern core | `#FFE7AE` | center light / important glow |
| muted teal | `#6FAE9B` | memory accent / easy / collection |
| dusty rose | `#B96A76` | danger accent / hard / rare secondary |
| dawn peach | `#DFA07A` | clear / morning / result |

## Color Rules

### Background

- base: deep night navy
- edges: black ink violet or ink black
- paper objects must stand apart from background

### Primary CTA

- warm amber / lantern core
- glow only around CTA, not full screen
- should be the most clickable object

### Secondary CTA

- paper beige base
- weak amber or teal edge
- no strong glow unless active

### Rare

- warm amber + subtle dusty rose
- seal or paper edge highlight
- no rainbow
- no neon purple
- no gacha explosion

### Hard / Danger

- dusty rose + ink violet
- paper more damaged
- black ink edge stronger
- not pure red

### Easy / Calm

- muted teal + warm paper
- less ink stain
- softer glow

## Typography Rules

- All production UI text must be game-rendered Text.
- Do not rely on AI-generated image text.
- Small labels must remain readable at 390x844.
- Avoid long lines on cards.
- Japanese labels should be short where possible.
- English decorative title is allowed only if it remains replaceable.

Recommended short labels:

- TOP CTA: `旅をはじめる` / `探索開始`
- Growth: `成長`
- Collection: `記録`
- Stage: `夜路`
- Result: `記憶ページ`
- Black mode: `黒曜化`

Avoid:

- unreadable handwriting
- excessive ruby text
- AI-rendered pseudo-Japanese
- long lore paragraphs inside battle UI

## UI Shape Language

### Paper Panel

Purpose:

- large page
- modal body
- result page
- collection ledger

Rules:

- paper beige base
- dark paper border
- slightly uneven edges
- subtle ink stains
- sparse texture
- avoid generic rounded rectangle

### Paper Card

Purpose:

- level up choice
- reward item
- collection card
- difficulty card

Rules:

- consistent padding
- icon slot + title slot + description slot
- active/selected state must be clear
- rare state uses warm frame, not neon

### Paper Button

Purpose:

- main CTA
- secondary CTA
- navigation

Rules:

- pressed state required
- hover/touch feedback required where supported
- primary/secondary hierarchy must be obvious
- text must be centered and readable

### Wax Seal / Rank Seal

Purpose:

- Rank
- stage clear mark
- rare tag
- unlock mark

Rules:

- circle or slightly irregular seal shape
- amber/dawn/dusty rose variants
- not metal coin
- text rendered separately

### Paper Index Tab

Purpose:

- collection tabs
- section switching

Rules:

- short labels only
- active tab visually raised
- NEW as small lantern dot
- no red notification badge

### Lantern Badge

Purpose:

- NEW
- ready state
- small achievement glow

Rules:

- small amber light
- not exclamation-heavy
- do not spam more than necessary

### Inventory Paper Slot

Purpose:

- battle inventory
- owned row

Rules:

- must not block battle readability
- icon first, label optional
- empty state should still feel like paper storage

## Screen Rules

### TOP

Must feel:

- quiet invitation
- dark notebook / night street
- one strong journey CTA

Use:

- title paper banner
- subtle star-map background
- large primary button
- small secondary paper buttons
- NEW lantern dots

Avoid:

- giant character art dependency
- generic mobile menu
- too many buttons

### Stage Select

Must feel:

- choosing a route from a night map

Use:

- large map card
- route line
- difficulty cards
- best record seal
- start CTA

Avoid:

- stage thumbnails that are too painterly
- difficulty only by text
- cluttered maps

### Battle

Must feel:

- readable first, beautiful second

Use:

- compact paper HUD tags
- player lantern radius
- enemy silhouettes
- exp fragments
- right-bottom lantern seal button
- left-bottom 黒曜化 gauge

Avoid:

- heavy painted background
- UI covering enemies
- excessive particles
- large cut-in during normal play

### LevelUp

Must feel:

- choosing a memory/forgotten object card

Use:

- 3 paper cards
- icon/title/description/rarity structure
- rare warm seal
- darkened battle background

Avoid:

- text overflow
- neon rarity effects
- card designs that differ too much

### Result Clear

Must feel:

- a memory page was added after surviving the night

Use:

- dawn glow
- large notebook page
- rank seal
- reward row
- new records row
- growth CTA strongest

Avoid:

- spreadsheet result
- reward list clutter
- tiny unreadable stats

### Collection

Must feel:

- personal archive / notebook / atlas

Use:

- paper tabs
- ledger page
- two-column cards or rows
- black ink locked states
- small lantern NEW

Avoid:

- database table feeling
- too many card variants
- red notification badges

### 黒曜化 / Ultimate

Must feel:

- dangerous but heroic

Use:

- black ink edge
- diagonal ink slash
- warm lantern core
- text `黒曜化`
- short dramatic line if needed

Avoid:

- `KOKUYOU` display
- red-eye demon mode
- generic edgy anime effect
- unreadable full-screen chaos

## Component Hierarchy

Always preserve hierarchy.

1. Primary action
2. Current state / progress
3. Reward / consequence
4. Secondary navigation
5. Decorative story layer

If decoration competes with primary action, remove decoration.

## Image Generation Rules

Generated images are references, not final UI.

Must say in prompts:

- implementation-oriented
- separable layers
- readable 390x844
- no final rendered text
- reusable UI components
- reduce decorative density
- no poster composition

If image is used as actual asset:

- no text
- no UI labels baked in
- stable naming
- transparent when possible
- decomposable into background/effect/icon layers

## Final Rule

When in doubt:

1. readability
2. tap clarity
3. reusable component
4. world consistency
5. decoration

Decoration is always last.
