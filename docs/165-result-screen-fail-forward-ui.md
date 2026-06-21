# 165. Result Screen Fail-Forward UI

This document defines how the result screen should show progress even when the player did not clear.

## Core goal

The player should leave a failed run thinking:

```txt
I did not clear, but I learned something and became a little stronger.
```

## Result screen sections

Recommended order:

1. night result line
2. what was read
3. what remained
4. permanent reward
5. new hint
6. next recommended goal
7. retry button

## Section details

### 1. Night result line

Avoid harsh failure text.

Examples:

- The morning did not arrive.
- This reading could not reach dawn.
- The page closed before the last line.
- The lantern went out, but one warmth remained.

### 2. What was read

Show meaningful run stats.

- fragments collected
- enemy families seen
- vessel traces touched
- item clues found
- longest survival time
- new wrong readings found

### 3. What remained

Convert run stats into progression.

- memory dust gained
- map crease gained
- bestiary progress
- item album progress
- lantern care progress
- relation thread progress

### 4. Permanent reward

Show at least one progress bar when possible.

Examples:

- Polished Glass 2/5
- Ink Sample Card 4/8
- Folded Corner 1/3
- Object Album 12/40

### 5. New hint

Give a small nudge.

Examples:

- A shadow near the old ticket reacts to fire.
- The box glowed when the lantern dimmed.
- A name mark appeared for a moment.
- The same enemy changed shape after 3 minutes.

### 6. Next recommended goal

Simple, not overwhelming.

Examples:

- survive 3 minutes
- collect 30 fragments
- read one new enemy
- try the lantern upgrade
- follow the ticket trace

## UI tone

Use paper, stamp, and bookmark language.

Suggested labels:

- Read Lines
- Remaining Warmth
- Page Crease
- New Trace
- Next Reading
- Lantern Care
- Ink Notes

## Failure reward copy examples

Short lines:

- A little warmth stayed in the glass.
- The shadow returned, but its outline is clearer.
- The page closed, but the crease stayed.
- One wrong reading loosened.
- The mapbook remembered this route.

## MVP result screen

MVP only needs:

- survival time
- fragments collected
- memory dust earned
- one permanent progress bar
- one next-goal hint

Do not build a giant menu first.

## Do not

- Do not show only score and retry.
- Do not say the player gained nothing.
- Do not overwhelm with 20 progress bars.
- Do not make permanent rewards feel like mobile daily chores.
- Do not imply clear is the only valid progress.
