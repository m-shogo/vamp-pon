# 176. Shirushi vs Misreading Design Map

This document maps ally-side signs against enemy-side misreadings.

## Core contrast

| Ally side | Enemy side |
| --- | --- |
| shirushi | black reading |
| correct reading | wrong fixed reading |
| evolution | wrong evolution |
| fusion | owner replacement / forced fusion |
| blank that can remain | blank used as trap |

## Core five contrast

| Character | Shirushi | Main enemy temptation | Correct route | Wrong route |
| --- | --- | --- | --- | --- |
| Yui | 灯す | 集めすぎ / 焼き潰し | light and return fragments | burn or hoard fragments |
| Asa | 名づける | 決めつけ / すり替え | protect a name | force a name |
| Nagi | しまう | 閉じ込め | keep safely | never open |
| Michiru | 導く | すり替え / 決めつけ | show a return path | force a false route |
| Tomori | 直す | 執着 / 焼き潰し | repair without owning | overwrite or overheat |

## Gameplay use

When designing upgrades, ask:

1. Which shirushi is being used?
2. Which misreading can corrupt it?
3. What is the correct evolution?
4. What is the wrong evolution?
5. What item proves the difference?

## Item use

Each important item should be able to answer:

- which shirushi can read it correctly?
- which misreading is trying to fix it wrongly?
- what clue appears when the misreading loosens?

## Enemy design use

Enemy family design should not start from monster shape.
Start from misreading behavior.

Example:

```txt
misreading: 決めつけ
object language: label, stamp, fixed frame
combat role: locks pickups or card choices
released clue: maybe mark / alternative owner hint
```

## Evolution design use

Evolution is a visible answer to a reading problem.

Wrong evolution is a visible failure to read gently.

Therefore every evolution visual must show:

- what changed in the vessel
- which sign is brighter
- which danger was avoided or not avoided
- what blank remains

## P1 rule

P1 can hint at this system.
It should not fully explain it.

Allowed:

- Yui's lantern reacts differently to hoarding vs returning
- one enemy family uses collect-too-much behavior
- one result line says the light was strong but the reading failed
- one item implies a different owner than expected

Forbidden:

- full seven-boss chart in-game
- full evolution tree UI
- multi-character fusion mechanic in P1
- explaining every shirushi in tutorials
