# Design Target Review Template

AI生成画像や実装向けターゲット画像をレビューするためのテンプレート。

目的は、画像を増やすだけでなく、Phaser実装・Unity移行に使える判断材料へ変換すること。

## Review Rule

画像レビューでは、良い/悪いだけで終わらせない。

必ず以下へ分解する。

1. 採用する要素
2. 採用しない要素
3. Phaserで再現する部品
4. Unityで活きる部品
5. 再生成が必要か
6. 再生成prompt

## One Image Review Format

```md
## <image filename>

- screen:
- type: final concept / implementation target / unknown
- state: reference-only / implementation-target / needs-regeneration / rejected
- runtime use: no / candidate / yes

### First impression

### Adopt

- 

### Reject

- 

### Phaser implementation decomposition

- background:
- panel:
- cards:
- buttons:
- icons:
- effects:
- text:

### Unity relevance

- useful for:
- not useful for:

### Risks

- readability:
- one-off design:
- text baked in:
- too decorative:
- not world-consistent:

### Verdict

merge as reference / use for implementation / regenerate / reject

### Regeneration prompt

```txt

```
```

## Screen-Specific Review Points

### TOP

Adopt if:

- main CTA is clear
- title block is replaceable
- atmosphere works without character art
- secondary buttons are reusable

Reject if:

- title text is baked in and required
- large character art is required for layout
- too poster-like
- generic fantasy menu

### Battle

Adopt if:

- HUD is modular
- player/enemy/EXP are readable
- ultimate button is clear
- black mode gauge is clear
- background is subdued

Reject if:

- background is too detailed
- player is a large illustration
- enemy silhouettes are unclear
- effects hide gameplay
- UI is baked into image

### Result

Adopt if:

- central memory page is strong
- rank seal is clear
- rewards row is structured
- Growth CTA is primary
- dawn glow supports clear state

Reject if:

- result looks like spreadsheet
- rewards are scattered
- CTA hierarchy is unclear
- tiny text zones dominate

### LevelUp

Adopt if:

- 3 cards are clearly reusable
- rarity treatment is tasteful
- icon/title/description areas are clear
- background dim is not too busy

Reject if:

- cards are too decorated
- text areas are too small
- neon/gacha effects dominate
- card designs are inconsistent

### StageSelect

Adopt if:

- stage map card is strong
- difficulty cards are modular
- Start CTA is clear
- route/map motif is readable

Reject if:

- too many map scraps
- stage preview is too painterly
- difficulty only differs by text
- bottom actions are cramped

### Collection

Adopt if:

- tabs are short and readable
- ledger page is structured
- cards/rows are reusable
- locked/new states are clear

Reject if:

- database feeling
- tabs too small
- too many card variants
- unreadable handwriting

### 黒曜化 Cutin

Adopt if:

- dangerous but heroic
- warm lantern core remains
- diagonal band is reusable
- ink slash/light streak can be separated
- title area exists without baked text

Reject if:

- red-eye demon look
- `KOKUYOU` text is baked in
- too poster-like
- too many particles
- character does not match Yui rules

## Regeneration Prompt Template

Use this when a target image needs improvement.

```txt
Create a simplified implementation-oriented 390x844 vertical mobile game UI target for Phaser.

Screen:
<screen name>

Purpose:
<what this screen does>

Use previous image as visual direction, but improve implementation-readiness.

Must keep:
- dark storybook world
- night / memory / forgotten objects / black ink / lantern light / dawn where appropriate
- paper texture
- star-map motifs
- tasteful controlled palette
- premium mobile app feeling

Must improve:
- 390x844 readability
- clean UI hierarchy
- separable layers
- reusable UI components
- no final rendered text
- no baked button labels
- reduced decorative density
- less one-off detail

Layer thinking:
- background
- main panel
- cards
- buttons
- icons
- effects
- optional decorative layer

Do not:
- use glossy generic fantasy UI
- use gacha/neon/metallic sci-fi UI
- rely on character art unless screen requires it
- make it poster-like
- include tiny unreadable handwriting

Specific layout:
<screen-specific layout>

Color:
Deep navy, ink violet, paper beige, warm amber, lantern core, muted teal, dusty rose, dawn peach.
```

## Battle Regeneration Prompt

```txt
Create a simplified implementation-oriented 390x844 vertical mobile battle screen target for Phaser.

Purpose:
Gameplay readability first.

Keep:
- compact paper HUD tags at top
- small player marker with lantern radius
- simple Ombu/Omburo shadow enemy silhouettes
- memory fragment EXP pickups
- right-bottom lantern seal ultimate button
- left-bottom 黒曜化 ink gauge
- bottom paper inventory slots

Reduce:
- background detail by 60%
- excessive particles
- painterly character presence
- tiny decorative scraps

Use separable layers:
background, enemy silhouettes, player marker, EXP fragments, HUD, inventory, ultimate button, 黒曜化 gauge, light/ink effects.

No final rendered text.
No baked UI labels.
No poster composition.
```

## Result Regeneration Prompt

```txt
Create a simplified implementation-oriented 390x844 vertical result clear screen target for Phaser.

Purpose:
A memory page added after surviving the night.

Keep:
- dawn glow
- large central notebook page
- rank seal
- rewards row
- new records row
- strongest Growth CTA
- smaller retry/stage/top buttons

Reduce:
- decorative scraps
- tiny stats
- character presence
- one-off ornate frames

Use separable layers:
background dawn glow, page panel, rank seal, reward cards, record rows, CTA buttons, small light effects.

No final rendered text.
No baked reward numbers.
No poster composition.
```

## LevelUp Regeneration Prompt

```txt
Create a simplified implementation-oriented 390x844 vertical level-up choice overlay target for Phaser.

Purpose:
Readable 3-card choice overlay during battle.

Keep:
- darkened battle background
- 3 reusable paper cards
- icon/title/description/rarity structure
- normal/good/rare states
- rare warm lantern glow, not neon
- small owned/context row at bottom

Reduce:
- decorative paper noise
- excessive rarity effects
- tiny unreadable text zones
- inconsistent card shapes

Use separable layers:
background dim, title prompt, card frames, icons, rarity tags, bottom context row, subtle light effects.

No final rendered text.
No baked labels.
No poster composition.
```

## Collection Regeneration Prompt

```txt
Create a simplified implementation-oriented 390x844 vertical collection screen target for Phaser.

Purpose:
A personal archive / notebook / atlas, not a database.

Keep:
- 6 short paper index tabs
- clean ledger page
- 2-column cards or structured record rows
- locked black ink states
- small lantern NEW dots

Reduce:
- tiny decorative detail
- too many card variants
- handwriting clutter
- database table feeling

Use separable layers:
background paper texture, tab row, ledger panel, cards/rows, lock ink overlay, NEW lantern dots, bottom navigation.

No final rendered text.
No baked labels.
No poster composition.
```

## StageSelect Regeneration Prompt

```txt
Create a simplified implementation-oriented 390x844 vertical stage select screen target for Phaser.

Purpose:
Selecting a route from a night notebook / memory map.

Keep:
- large stage map card
- simple route line and nodes
- best record / seal area
- three difficulty paper cards
- strong start journey CTA

Reduce:
- character art
- detailed preview illustration
- excessive map scraps
- one-off decoration

Use separable layers:
background notebook texture, stage map card, route lines, difficulty cards, record seal, CTA buttons, small light accents.

No final rendered text.
No baked labels.
No poster composition.
```

## Cutin Regeneration Prompt

```txt
Create a simplified implementation-oriented 390x844 special cut-in target for Phaser.

Purpose:
Ultimate / 黒曜化 activation.

Keep:
- dangerous but heroic Yui
- right-hand warm lantern as the core
- diagonal composition
- black ink slash layer
- warm lantern light streak
- title/banner area for game-rendered text

Reduce:
- over-painted splash art feeling
- excessive particles
- tiny decorative paper details
- baked typography

Use separable layers:
dark background band, character layer, ink slash, lantern streak, banner area, small particles.

Text must be game-rendered: 黒曜化.
No baked KOKUYOU.
No red-eye demon mode.
No poster composition.
```

## Final Rule

A good target image is not the most beautiful image.

A good target image is the one that makes implementation obvious.
