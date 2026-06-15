# 177. Character Crests Canon

This document adopts `shirushi crests` as the visual sign system for important playable characters.

## Core rule

Every important playable character has one `shirushi crest` (`しるし紋`).

A crest is not just a mark.
It expresses:

1. the character's true reading nature
2. the direction of correct evolution
3. the way the sign distorts under misreading

## Name layers

Crest-related skill names use three layers:

| Layer | Use | Example |
| --- | --- | --- |
| Crest name | setting / UI / relation map | 灯火紋 |
| Combat name | normal battle skill name | 残り火 |
| Release name | special cut-in / true release | 朝をほどく灯 |

This keeps a Fate-like true-name weight and a simple action-game name at the same time.
Do not copy specific naming systems or terms from other works.

## Crest construction

Each crest has three visual layers:

| Layer | Meaning |
| --- | --- |
| outer frame | light lineage / family tendency |
| core sign | personal shirushi |
| missing part / crack | unresolved blank |

## Design rules

A good crest must:

- read at 16px
- work in one color
- still feel charming at 4x scale
- be engravable on vessels and items
- work in UI cards and result screens
- be easy to distort into a wrong-evolution version

## NG

Do not make crests:

- too detailed
- only an attribute icon
- too similar between characters
- direct kanji pasted as-is
- overdecorated
- unreadable when small

## System flow

```txt
character
-> light vessel
-> shirushi
-> shirushi crest
-> correct evolution
-> distorted crest
-> wrong evolution / black evolution
-> special cut-in
```

## P1 scope

Required for P1 planning:

- Core 5 crest names
- Core 5 release names
- Yui normal cut-in text
- Yui wrong-evolution cut-in text
- story-map fields for Core 5

Not required for P1:

- every Future character crest finalized
- animated cut-ins for all characters
- full evolution-tree UI
