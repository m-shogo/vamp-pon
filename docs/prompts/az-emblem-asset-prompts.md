# A-Z Emblem Asset Prompts

A-Z灯紋の画像生成・手仕上げ用プロンプト集。
最新の入口は `docs/181-current-production-canon.md`。
灯紋の正本は `src/game/data/emblemCanon.ts` と `docs/design/emblem-canon.md`。
画像は文字なし。AZコード、キャラ名、技名はUI textで出す。

## Common prompt block

```txt
Vamp Pon A-Z emblem icon for mobile game UI.
Single emblem only, centered front view, readable silhouette, small charming object-symbol crest, paper storybook pixel-art flavor, tasteful handmade toy feeling, warm night memory mood.
No text, no letters, no logo, no numbers, no watermark, no frame label, no checkerboard.
One asset per image. Pure #00FF00 chroma key background. No white fringe.
Designed as an in-game emblem/crest badge and merch pin.
```

## Phase variants

```txt
blank phase: unopened emblem, faint outline only, object silhouette barely readable, quiet grey paper line.
normal phase: character's core object and verb are readable, small warm or cool glow.
dawn phase: dawn line repairs the outer rim, missing black chip becomes soft morning light.
kokuyou phase: one black soot scar only, the character's strength is distorted, dark but not horror.
```

## Output naming rule

```txt
emblem-<character-id>-<az-code>-blank-v1.png
emblem-<character-id>-<az-code>-normal-v1.png
emblem-<character-id>-<az-code>-dawn-v1.png
emblem-<character-id>-<az-code>-kokuyou-v1.png
```

Example:

```txt
emblem-yui-y01-normal-v1.png
```

## Core5 prompts

### Y-01 ユイ / 消えない名の灯紋
```txt
round lantern crest, small name line, paper fragment, fawn constellation hint, warm small flame, deep navy and paper cream, cozy amber glow, simple readable circular emblem.
```

### A-02 アサ / 名札結びの灯紋
```txt
rounded name tag crest, paper knot, paper fragment, swallow constellation hint, thin dawn pink line along paper edge, soft tag plate silhouette.
```

### N-03 ナギ / 月箱守りの灯紋
```txt
moon box crest, small box and crescent moon double frame, keyhole, turtle constellation hint, pale moonlight leaking from box gap, protective calm silhouette.
```

### M-04 ミチル / 帰星の灯紋
```txt
compass crest, star map line, road thread, fox constellation hint, thin gold path returning to center, ring-shaped compass emblem, clear UI silhouette.
```

### T-05 トモリ / ほころび継火の灯紋
```txt
repair lamp crest, wick and stitched seam, tool brass rim, firefly constellation hint, small sparks from seam, handmade stitched emblem.
```

## Circle10 prompts

### S-06 セン / 白線教えの灯紋
```txt
chalk line crest, blackboard frame, chalk dust, small arrow path, crane constellation hint, powdery white guide line, school object charm.
```

### R-07 リツ / 半灯分けの灯紋
```txt
half candy crest, split wrapper circle, two small flames divided left and right, squirrel constellation hint, paired charm feeling, warm candy orange.
```

### K-08 コヨリ / 小名紙縒りの灯紋
```txt
small name tag crest, thin paper cord spiral, tiny helper light, rabbit constellation hint, soft charm, small silhouette, gentle lilac and amber.
```

### G-09 ゲン / 古針駅灯の灯紋
```txt
old compass crest, station lamp, rusted needle, owl constellation hint, antique brass rim, low steady amber light, vintage tool badge.
```

### H-10 ハナ / 押花箱底の灯紋
```txt
pressed flower crest, bookmark and box-bottom square frame, flower veins glowing faintly, hedgehog constellation hint, pale aqua and pressed flower pink, transparent acrylic feeling.
```

### U-11 ユウビ / 未配達封灯の灯紋
```txt
sealed envelope crest, postmark circle, delivery route line, dove constellation hint, unopened letter flap, delayed amber glow, postcard merch feeling.
```

### D-12 マドカ / 窓紙翼の灯紋
```txt
window crest, paper airplane crossing window frame, watched light, cat constellation hint, soft blue window glow, clean horizontal silhouette.
```

### I-13 シロ / 白栞頁灯の灯紋
```txt
white bookmark crest, blank page margin, book index tab, white moth constellation hint, pale page glow, quiet library mood, vertical bookmark silhouette.
```

### B-14 トバリ / 改札境目の灯紋
```txt
ticket gate crest, ticket punch holes, border line, dog constellation hint, station amber line, small gate shape, readable ticket badge.
```

### E-15 ネム / 夢頁水面の灯紋
```txt
dream diary crest, water reflection ripple, sleepy page, sheep constellation hint, soft violet blue glow, diary and water surface merged.
```

## Shadow5 prompts

### O-16 クロオリ / 黒折り紙の灯紋
```txt
black origami crest, fold lines, hidden page, crow constellation hint, deep purple black glow leaking from fold valley, sharp paper diamond.
```

### V-17 カゲール1 / 影守り火の灯紋
```txt
shadow fold crest, hidden flame, close combat black fire, wolf constellation hint, triangular shadow guard, dark ember inside, sharp but not horror.
```

### C-18 カゲール2 / 消せない一文字の灯紋
```txt
eraser mark crest, single letter blank space but no actual letter, white dust, gecko constellation hint, monochrome black white dust, erased-name feeling.
```

### J-19 カゲール3 / 夜測り角度の灯紋
```txt
ruler crest, angle lines, diagonal cold light, bat constellation hint, geometric technical badge, measured night angle, clear angular silhouette.
```

### Q-20 カゲール4 / 余白継ぎ目の灯紋
```txt
blank card crest, negative space center, black margin, stitched blank edge, black rabbit constellation hint, empty center glowing around rim, secret card feeling.
```

## Batch generation note

For each character, generate 4 images with the same base silhouette:

1. blank
2. normal
3. dawn
4. kokuyou

Keep the silhouette consistent across phases. Only change glow, rim repair, and black scar.
