# UI Implementation Contract

Phaser UI実装を崩さないための契約。

この文書は、見た目改善・画面差し替え・画像整理・Unity移行前のPhaser polishで必ず守る。

## Primary Goal

画面品質を上げる。ただし、ゲームロジック・保存・抽選・戦闘バランスを壊さない。

実装の優先順位:

1. 既存挙動を壊さない
2. 390x844で読める
3. UI階層が明確
4. 再利用可能な部品にする
5. 世界観を守る
6. 装飾を追加する

## Hard Rules

### Do Not Change Gameplay Logic During Visual PRs

Visual PRで変更してはいけないもの:

- damage calculation
- enemy spawn logic
- wave timing
- experience amount
- reward amount
- stage unlock logic
- achievement unlock condition
- collection seen/localStorage logic
- permanent growth values
- weapon evolution rules
- item drop rates

必要になった場合は、別PRに分ける。

### Do Not Use Full-Screen AI Image As UI

Generated images are design targets.

禁止:

- 画面全体にAI画像を貼るだけ
- AI画像内の文字を本番UIとして使う
- 画像内のボタンを押せるように見せるだけ
- フォント不明の文字焼き込み

許可:

- design referenceとしてdocsに保存
- background textureとして薄く使う
- textなし切り出し素材として使う
- icon/effect参考として再作成する

### Keep Text Game-Rendered

すべてのUI文字はPhaser側Textで描画する。

理由:

- localization可能
- title変更可能
- readability調整可能
- 画像差し替えに強い

### Prefer Helpers Over One-Off Drawing

同じ見た目を複数画面で使う場合はhelper化する。

候補:

- paper panel
- paper card
- paper button
- paper tab
- wax seal
- lantern badge
- inventory slot
- reward tile
- ink divider
- dawn glow
- star-map backdrop

## Large File Safety

以下は壊しやすいので注意。

- `src/game/ui/overlays.ts`
- `src/game/ui/hud.ts`
- `src/game/scenes/CollectionScene.ts`
- `src/game/scenes/StageSelectScene.ts`
- `src/game/scenes/TopScene.ts`

Rules:

1. 全体置換しない。
2. 関数単位で小さく編集する。
3. 既存ロジックの前後にvisual helperを足す。
4. state/update/input処理を触る場合は理由を書く。
5. visual helperは別ファイルに切り出す。

Recommended new helper files:

```txt
src/game/ui/resultMemoryPage.ts
src/game/ui/paperButtonParts.ts
src/game/ui/battleHudParts.ts
src/game/ui/collectionLedgerParts.ts
src/game/ui/levelUpCardParts.ts
```

既存の `premiumPaperUi.ts` に入りきらない場合は、無理に巨大化させず、画面別helperを作る。

## Component Contract

### Paper Panel

Input should include:

- x
- y
- width
- height
- depth or z
- variant
- alpha
- accentColor optional

Must not include:

- gameplay state
- scene transition logic
- save logic

### Paper Button

Must support:

- primary / secondary / ghost variants
- enabled / disabled state
- pressed feedback
- clear text area

Must not:

- own navigation decisions
- hardcode screen transition unless existing pattern already does

### LevelUp Card

Must preserve:

- existing choice selection callback
- existing item/weapon/passive data
- existing rarity/weighting logic

Can change:

- card frame
- spacing
- icon area
- rarity label presentation
- selected/dim animation

### Result Page

Must preserve:

- reward calculation
- clear/defeat branch
- unlocked achievements
- save/progression behavior

Can change:

- layout
- paper panel
- rank seal presentation
- reward row appearance
- CTA hierarchy

### Battle HUD

Must preserve:

- current HP/time/level/shard data
- update cadence
- ultimate charge logic
- black mode charge logic
- inventory content

Can change:

- paper tag frame
- icon badge
- button frame
- gauge frame
- particle decoration, if not too noisy

### Collection

Must preserve:

- section IDs
- seen/new state
- localStorage handling
- filter logic
- item unlock state

Can change:

- tab look
- card frame
- locked presentation
- NEW lantern dot
- ledger background

## Visual Token Contract

Visual code may introduce shared tokens, but must avoid global breakage.

Safe:

```txt
const VISUAL_COLORS = {
  night: 0x0f1320,
  ink: 0x151020,
  paper: 0xd8c49a,
  paperDark: 0x6e5a3b,
  amber: 0xf4c46a,
  lantern: 0xffe7ae,
  teal: 0x6fae9b,
  rose: 0xb96a76,
  dawn: 0xdfa07a,
};
```

Risky:

- replacing all existing colors at once
- changing global text style for every screen
- moving constants without updating tests

## Layout Contract for 390x844

Minimum safe areas:

- top HUD must not exceed about 12-14% during battle
- bottom controls must not cover core gameplay
- primary CTA should be reachable in lower third
- small labels should not be below readable size
- cards must have breathing room

Battle priority:

1. player
2. enemy
3. projectile/weapon
4. EXP
5. HUD
6. decorative effects

Result priority:

1. clear/defeat state
2. rank/reward
3. growth CTA
4. retry/stage/top
5. decorative dawn/paper

LevelUp priority:

1. choice title
2. 3 cards
3. selected/rarity state
4. owned/context row
5. background dim

## Motion Contract

Motion should make actions feel better, not hide information.

Allowed:

- subtle stagger
- short scale pop
- lantern pulse
- small shake on hit/clear
- card press feedback
- reward row reveal

Avoid:

- long blocking animations
- constant pulsing everywhere
- camera shake during normal readability-critical moments
- flashes that obscure enemy/projectile

## Text Contract

Japanese text must be short.

Preferred short labels:

- `探索開始`
- `成長へ`
- `もう一度`
- `夜路へ`
- `記録`
- `黒曜化`
- `新しい記憶`
- `報酬`
- `未発見`

Avoid:

- full sentences inside small cards
- long lore in battle
- inconsistent `黒耀化` / `黒曜化` display
- `KOKUYOU` display

## PR Scope Contract

### Good PR Scope

- image organization + docs only
- Result visual only
- LevelUp card visual only
- StageSelect surface only
- Battle HUD frame only
- Collection tabs only

### Risky PR Scope

- Result + Battle + Collection + data changes in one PR
- refactor + visual polish + balance changes in one PR
- rename terms globally while touching UI
- image movement + code integration + save migration in one PR

## Verification Contract

Every visual implementation PR should report:

1. changed files
2. whether gameplay logic changed
3. 390x844 checked or not
4. build result
5. test result
6. remaining visual risks
7. screenshots or clear visual description

Recommended commands:

```bash
pnpm build
pnpm test
pnpm stage1:fun-pass:verify
pnpm character-assets:verify
pnpm runtime-assets:verify
```

Docs-only PRs may skip build/test, but must state docs-only.

## Review Red Flags

Reject or rework if:

- AI image is used as one-piece UI
- text is baked into image
- `overlays.ts` or `hud.ts` is rewritten wholesale
- battle readability worsens
- reward/progression logic changes silently
- 390x844 is not considered
- generic fantasy/gacha/SF visual direction appears
- black ink hides important information
- all CTAs look equally important

## Final Rule

If a change makes the screen prettier but less readable, it is not an improvement.

If a change makes implementation faster now but creates one-off UI that cannot be reused, it is not a foundation.
