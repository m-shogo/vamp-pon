# A-Z灯紋 — Legacy Compatibility Index

Date: 2026-08-10  
Status: **SUPERSEDED VISUAL DESIGN — A-Z CODES RETAINED FOR IMPLEMENTATION COMPATIBILITY ONLY**

> この文書に以前記載されていた「ランタン型 / 名札型 / 箱型 / 封筒型 / 星座動物を描くcrest」設計は廃止済み。
> **Current灯紋のvisual authorityとして使用しない。**

## Current authority

- `docs/design/toumon-simple-sigil-canon-v2.md`
- `src/game/data/toumonSimpleSigilCanon.ts`
- compatibility adapter: `src/game/data/emblemCanon.ts`

## A-Z codeだけ維持する理由

既存の:

- asset filenames
- data IDs
- generated contract history
- migration / compatibility references

を壊さないため、Current20のshort codeは内部識別子として残す。

```txt
Y-01 A-02 N-03 M-04 T-05
S-06 R-07 K-08 G-09 H-10
U-11 D-12 I-13 B-14 E-15
O-16 V-17 C-18 J-19 Q-20
```

### Player-facing rule

- A-Z codeをCharacter identityの主役にしない。
- 灯紋の中へalphabet / numberを描かない。
- goods表面へcodeを必須表示しない。
- 必要ならcertificate / archive metadata / package裏面へUI textとして置く。

## Current灯紋の造形

```txt
1 dominant stroke
+ 0..2 secondary strokes
+ 0..2 nodes
+ minimum 1 intentional gap
```

Characterの:

- 何を大切にするか
- 迷った時にどう動くか
- 何を開け / 残し / 渡すか

を抽象geometryへ圧縮する。

## Do not restore

旧v1の以下をCurrentへ戻さない。

- literal lantern / tag / box / envelope / book / ruler icon
- shield / ornate frame
- Characterとは別の古い星座動物割当
- 小鹿 / 燕 / 亀 / 狐 / 蛍 / リス / 白蛾 / 蝙蝠 / 黒兎等の旧emblem animal set
- crest外周にanimal silhouetteを置く設計
- dawnで羽・王冠・星を盛る設計
- pairで中央へ共通小物を描く設計

Current Star Beastは `characterThemeColors.ts` のauthorityに従う。

## Current phase rule

| Phase | Current behavior |
| --- | --- |
| 無紋 | 主線の一部だけ |
| 灯紋 | simple base geometry |
| 暁紋 | 1 geometric operationだけ |
| 黒紋 | 既存strength-line 1本だけが過剰化 |
| 双灯紋 | shared node / shared gapを1つだけ共有 |

## Merchandise rule

A-Z short codeは商品シリーズ名を整理する内部情報として使えても、商品価値の本体は**Current Toumon master geometry**。

同じgeometryを:

- pin
- embroidery
- foil
- engraving
- woven tag
- jewelry
- UI

へ展開する。

## One line

> **A-Zは互換コード。Characterの顔になるのは、Current simple灯紋そのもの。**
