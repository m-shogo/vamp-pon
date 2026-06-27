# 168. Return-to-Design Launch Pack

This is the one document to read when returning to visual design work.

Goal: start design production without re-deciding the world every time.

## Read order

Read these first:

1. `docs/181-current-production-canon.md`
2. `docs/180-unified-character-canon.md`
3. `docs/design/world-labels.md`
4. `docs/design/item-and-character-production-canon.md`
5. `docs/design/character-production-plans.md`
6. `docs/design/emblem-canon.md`
7. `docs/design/az-emblem-canon.md`
8. `docs/prompts/az-emblem-asset-prompts.md`
9. `docs/design-team/README.md`
10. `docs/design-team/pro-app-quality-rubric.md`
11. `docs/147-light-lineage-and-memory-vessels.md`
12. `docs/148-protagonist-relationship-web.md`
13. `docs/153-character-roster-light-vessel-map.md`
14. `docs/159-black-ink-reading-release-rules.md`
15. `docs/163-fail-forward-permanent-growth-system.md`
16. `docs/story-map/vamp-pon-story-street-map.html`

## Current canon lock

- Yui is the current P1 baseline character.
- Core5 has draft playable data and production plans, but full UI/sprite/balance rollout is staged.
- Yui's lantern is fixed.
- The lantern fire is a spirit and a reading light.
- Black ink shadows are wrong readings fixed into enemy form.
- Fighting loosens wrong readings and releases fragments.
- Every important character has a unique light vessel.
- Every important character now needs an A-Z灯紋.
- Similar light vessels imply relationship.
- Everyone important has met Yui at least once.
- Yui is central, but not the answer to every mystery.
- Failure still leaves progress.
- Happy ending means enough meaning returns for morning to arrive, not every blank is solved.

## Latest production lock

| Area | Current rule |
| --- | --- |
| Character art ranks | 灯技 / 継灯 / 暁灯 |
| Kokuyou | 黒耀化 / 煤返り / 黒耀瓶 |
| Items | 灯具 / 持ち物 / 忘れ物 / 落とし物 / 記憶片 |
| Evolution | 灯継ぎ / 暁開き / 灯合わせ |
| Records | 灯録 / 記憶のしるし / 旅の記録 / 夜明け |
| Emblem system | 灯紋具 / 灯紋 / 無紋 / 暁紋 / 黒紋 / 双灯紋 / A-Z灯紋 |
| Asset text | Cutins and emblems stay textless. All labels are UI text. |
| Character production | 1 character must include gear, passive, rare item, evolutions, Kokuyou, pair candidates, A-Z emblem, and asset keywords. |

## Design session order

When starting design, do this:

1. Pick one target: character, enemy, item, A-Z灯紋, UI, background, or story-map section.
2. Read `docs/181-current-production-canon.md`.
3. Read the target-specific design doc.
4. Write the asset brief.
5. Make A/B/C plans.
6. Produce prototype only.
7. Review against 80-point rubric.
8. Keep best parts.
9. Make v2.
10. Do not promote to production below 80.

## Best next targets

### Target A: Core5 implementation-data fill

Reason:

- Character production plans now exist for all 20 characters.
- Core5 should become the first safe implementation slice.
- The missing bridge is `weapons.ts`, `passives.ts`, `rareItems.ts`, and `evolutions.ts`.

Deliverable:

- Core5 missing gear/passive/rare/evolution list
- safe data-only additions
- no balance-heavy mechanics beyond existing systems

### Target B: A-Z灯紋 Core5 prototype pack

Reason:

- A-Z灯紋 is now required for character production.
- It gives character select, 灯録, cutins, and merch one shared identity.

Deliverable:

- 5 characters x 4 phases: 無紋 / 灯紋 / 暁紋 / 黒紋
- no baked text
- pure #00FF00 source background for UI processing
- 64px readability check

### Target C: black ink enemy family set

Reason:

- Combat readability depends on enemies.
- Enemy design now has story logic.
- Need families, not black blobs.

Deliverable:

- 4 enemy family silhouettes
- one wrong reading per family
- one released clue per family
- 1x and 4x check

### Target D: memory item collection

Reason:

- Items now carry story and fail-forward rewards.
- Pickups must not share character vessel glow.
- Field drops are now 記憶片 / 朝露 / 迷子の鈴 / 夜明けマッチ / 白い切符.

Deliverable:

- 12 item icons
- item meaning chains
- glow hierarchy rules
- UI icon preview

### Target E: result screen fail-forward UI

Reason:

- Failure must feel meaningful.
- The loop needs visible progress.

Deliverable:

- paper-card result mock
- memory dust display
- next-goal hint
- one progress bar

## Absolute no

- Do not change production sprites casually.
- Do not call prototype final.
- Do not add multi-character mechanics to P1 until Core5 UI/sprite/balance are staged.
- Do not add high-order lineage mechanics to P1.
- Do not create rainbow multi-lineage designs.
- Do not make all glowing things visually identical.
- Do not bake labels, AZ codes, or skill names into cutin/emblem images.

## Good first command to give an agent

```txt
Read docs/181-current-production-canon.md first.
Then read docs/168-return-to-design-launch-pack.md.
Create only prototype visual plans for Core5 A-Z灯紋 or Core5 missing item/evolution data.
Do not touch production sprites or gameplay constants.
Use design-team and pixel-art review rules.
End with a design-iteration review and next exact edit list.
```
