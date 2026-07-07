# Unity U44 New Design and Asset Request List

Date: 2026-07-06

## Unity UI recreation only

- Top layout shell: title plaque, CTA hierarchy, 3 navigation cards.
- StageSelect layout shell: map panel, route list, stage card, start button.
- Battle HUD layout shell: top HUD plate, bottom inventory rail, right-side action buttons.
- Result layout shell: ledger page, stats rows, reward rows, Retry/StageSelect buttons.
- Collection layout shell: book page, tabs, card grid, detail panel.

## Asset required

- UI paper panel kit, title plaque, wax seal, lantern marker, route node, locked node.
- Virtual stick visual, Battle HUD frame, weapon/passive/rare slot frames.
- LevelUp normal/good/rare card frames and rarity flare.
- Result ledger panel, rank seal, reward memory card.
- Collection book page, index tabs, character portrait frame, enemy album frame.
- Weapon, passive, rare, evolution, pickup, damage/hit, black ink, lantern glow, morning clear VFX.
- Kokuyou cutin full-screen art and black ink band.

## Existing generated reference available

- TOP: `docs/design-targets/generated/top-final.png`
- StageSelect: `docs/design-targets/final/stage-select-final.png`
- Battle HUD: `docs/design-targets/final/battle-final.png`
- LevelUp: `docs/design-targets/final/level-up-final.png`
- Result: `docs/design-targets/final/result-clear-final.png`
- Collection: `docs/design-targets/final/collection-final.png`
- Kokuyou: `docs/design-targets/generated/kokuyou-cutin-final.png`

## Existing runtime asset available

- U5/U8/U10 candidate paper UI, route, result, cutin, VFX assets under `unity/VampPonUnity/Assets/_Project/Resources/`.
- StageSelect/Result/Common prefabs under `unity/VampPonUnity/Assets/_Project/Prefabs/UI/`.
- U28/U39 SE candidate folders, still not final AudioMixer evidence.

## Later phase

- Full character/enemy/background replacement.
- Final audio/haptic.
- Mobile metrics and RC work.
- Stage2, Addressables, Cloud Save.

## requests

| assetId | Screen | Purpose | Size | Format | Transparent | Style | Color constraints | Runtime usage | Replacement path suggestion | Prompt if needed | Fallback placeholder | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| u44_top_title_plaque | TOP | title and app identity | 640x180 | PNG sliced | yes | paper plaque, black ink, lantern edge | paper/ink/warm only | title frame | `Assets/_Project/Resources/U44Candidates/UI/` | paper title plaque for ヨルノシルベ, no baked text | uGUI panel + TMP title | P1 |
| u44_stage_map_panel | StageSelect | map body | 720x900 | PNG sliced | yes | notebook map | quiet paper, ink route | StageSelect panel | `Assets/_Project/Resources/U44Candidates/UI/` | paper map panel with route lines, no text | PaperPanel + lines | P0 |
| u44_battle_hud_frame | Battle HUD | readable HUD | 760x160 | PNG sliced | yes | thin paper HUD | low opacity paper | HUD top/bottom | `Assets/_Project/Resources/U44Candidates/UI/` | mobile battle HUD paper strips, no text | current HUD plates | P0 |
| u44_virtual_stick | Battle | movement affordance | 256x256 | PNG | yes | soft ink circle + lantern dot | low contrast | left-bottom stick | `Assets/_Project/Resources/U44Candidates/UI/` | transparent virtual stick, subtle ink | procedural circles | P0 |
| u44_levelup_card_rare | LevelUp | rare card | 360x560 | PNG sliced | yes | paper card, lantern flare | rare warm accent only | card frame | `Assets/_Project/Resources/U44Candidates/UI/` | rare paper card frame no text | uGUI card | P0 |
| u44_result_ledger | Result | memory page | 720x980 | PNG sliced | yes | ledger, ring binding | quiet paper | Result root | `Assets/_Project/Resources/U44Candidates/UI/` | memory ledger panel no text | PaperPanel | P0 |
| u44_collection_book | Collection | album page | 780x1120 | PNG sliced | yes | illustrated book page | paper/ink tabs | Collection root | `Assets/_Project/Resources/U44Candidates/UI/` | memory album book page no text | uGUI tabs/cards | P1 |
| u44_weapon_slot | Inventory | weapon slot | 160x160 | PNG sliced | yes | small paper frame | amber focus | weapon slots | `Assets/_Project/Resources/U44Candidates/UI/` | weapon slot paper frame no icon | bordered Image | P1 |
| u44_pickup_icons | Battle | EXP/rare/heal pickup readability | 180x180 cells | PNG sprite sheet | yes | readable small item icons | cyan/amber sparingly | pickups | `Assets/_Project/Resources/U44Candidates/Pickups/` | pickup icons on greenback, no text | diamond/radial sprites | P1 |
| u44_kokuyou_cutin | Kokuyou | full-screen cutin | 1440x2560 | PNG | no baked text | black ink, lantern, character art | mostly black/amber | cutin/art collection | `Assets/_Project/Resources/U44Candidates/FullscreenArt/` | full-screen 黒耀化 cutin art no text | existing proof band | P1 |
