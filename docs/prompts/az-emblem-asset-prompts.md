# A-Z灯紋 Asset Handoff — Simple Sigil v2

Date: 2026-08-10  
Status: **RASTER / IMAGE GENERATION HOLD — FINAL VECTOR MASTERS NOT YET APPROVED**

> 旧prompt集の `round lantern crest` / `name tag crest` / `animal constellation hint` / `badge frame` 等は**superseded**。
>
> Current灯紋は画像生成で形を探さない。
> 先に `toumon-simple-sigil-canon-v2.md` の意味・stroke grammarから**human-reviewed vector master**を作る。

## Current sources

- `docs/design/toumon-simple-sigil-canon-v2.md`
- `src/game/data/toumonSimpleSigilCanon.ts`
- `docs/design/emblem-canon.md`
- compatibility adapter: `src/game/data/emblemCanon.ts`

---

# Production order

```txt
1. semantic / stroke grammar — CURRENT
2. rough vector exploration — NOT YET
3. 16px collision review — NOT YET
4. Human master approval — NOT YET
5. master SVG — NOT YET
6. micro / reverse / engraving / embroidery variants — NOT YET
7. raster export / generated presentation — AFTER MASTER ONLY
```

**AI image generation must not decide the canonical Toumon shape.**

---

# Future vector brief

When the project explicitly opens the vector-design phase, every Character brief should be derived from:

```txt
Character ID
Sigil name
Core verbs
Dominant family
Stroke formula
Node count
Primary gap
Signature asymmetry
Dawn one-operation change
Kokuyou one-line scar
Forbidden literalization
```

Do not derive from old A-Z image prompts.

---

# Universal vector constraints

```txt
simple original abstract sigil
single color
2–4 visually meaningful stroke groups
0–2 detached nodes
minimum one intentional open gap
no literal animal
no literal Named Object illustration
no shield
no crown
no wreath
no decorative wings
no zodiac glyph
no alphabet
no kanji
no number
no filler stars
no ornamental frame
no badge silhouette required
readable at 16px
works as pin / foil / embroidery / engraving / UI
```

## Stroke consistency

- Character body type does not change line width.
- Premium tier does not change geometry.
- Dawn does not add decorative motifs.
- Kokuyou does not redraw the emblem into a villain crest.

---

# Current21 routing

Canonical semantic names:

1. Yui — 帰火の灯紋
2. Asa — 結名の灯紋
3. Nagi — 守間の灯紋
4. Michiru — 帰針の灯紋
5. Tomori — 継火の灯紋
6. Sen — 問枝の灯紋
7. Ritsu — 半灯の灯紋
8. Koyori — 細縒の灯紋
9. Gen — 古針の灯紋
10. Hana — 留花の灯紋
11. Yuubi — 待封の灯紋
12. Madoka — 遠点の灯紋
13. Shiro — 余頁の灯紋
14. Tobari — 往還の灯紋
15. Nemu — 夢波の灯紋
16. Kuroori — 留折の灯紋
17. Kaname — 受線の灯紋
18. Kasumi — 残霞の灯紋
19. Toki — 星尺の灯紋
20. Tsumugi — 継間の灯紋
21. Ren — 片焦の灯紋 — **official reserve; no Current20 production auto-open**

Exact formulas live in machine-readable source; do not duplicate them here and let them drift.

---

# Required Human review before master approval

- [ ] 1色で成立
- [ ] 16pxで全21人を識別可能
- [ ] literal iconに見えない
- [ ] other IPの具体紋章shapeに似すぎない
- [ ] Character Core verbを説明できる
- [ ] gapが意味を持つ
- [ ] node数が0〜2
- [ ] Dawn changeが1操作
- [ ] Kokuyou scarが1箇所
- [ ] pin / embroidery / foil / engravingで同形使用可能
- [ ] Hana/Kanameの身体性を太線・丸線等へ記号化していない
- [ ] Ritsu/Koyoriは兄妹の共通性があっても別geometry
- [ ] Yui/TomoriはLeo family echoがあっても別geometry

---

# Raster/export naming — future only

After approved SVG exists:

```txt
toumon-<character-id>-normal-v1.svg
toumon-<character-id>-dawn-v1.svg
toumon-<character-id>-kokuyou-v1.svg
```

Raster exports are derivatives:

```txt
toumon-<character-id>-normal-64.png
toumon-<character-id>-normal-128.png
```

The SVG master remains authority.

---

# One-line rule

> **画像に「それっぽい紋章」を発明させない。意味を決め、線を設計し、vector masterを承認してから展開する。**
