# 灯紋 Canon — Current Entry Point

Date: 2026-08-10  
Status: **CURRENT ENTRYPOINT — SIMPLE SIGIL v2 IS AUTHORITATIVE**

> 旧A-Z Emblem v1の「ランタン型 / 名札型 / 箱型 / 動物を外周へ入れる豪華crest」方向は**superseded**。
>
> Character灯紋は今後、数本の線・点・gapだけで成立する**simple abstract sigil**として扱う。

## Current authority

### Visual / meaning

- `docs/design/toumon-simple-sigil-canon-v2.md`

### Machine-readable Current21

- `src/game/data/toumonSimpleSigilCanon.ts`

### Existing runtime / Asset Factory compatibility

- `src/game/data/emblemCanon.ts`

`emblemCanon.ts` は既存interface互換のため `crestShape` / `constellationAnimal` 等の旧property名を残すが、値はsimple灯紋v2 / Current Star Beast authorityからderiveする。

---

# 採用名

| 用途 | 採用名 |
| --- | --- |
| 共通デバイス | 灯紋具 |
| Character抽象記号 | 灯紋 |
| 未解放 | 無紋 |
| 暁状態 | 暁紋 |
| 黒耀化状態 | 黒紋 |
| 2人の灯合わせ | 双灯紋 |
| Object履歴の小刻印 | 履歴刻 |
| Station / Route共通記号 | 夜路印 |
| A-Z short code | implementation / asset compatibility only |

---

# v2で変わったこと

## 旧

```txt
ランタン型
名札型
箱型
封筒型
本型
+ 星座動物
+ 外枠
+ 装飾
```

## Current

```txt
1 dominant stroke
+ 0〜2 secondary strokes
+ 0〜2 nodes
+ minimum 1 intentional gap
```

灯紋は**物の絵ではない**。

人物の:

- 戻す
- 結ぶ
- 守る
- 測る
- 預かる
- 継ぐ

等の「選び方」を抽象geometryへ圧縮する。

---

# 絶対禁止

Current灯紋本体へ以下を戻さない。

- shield
- crown
- wreath
- decorative wings
- literal animal
- literal Named Object
- zodiac glyph
- alphabet initial
- Japanese letter
- number
- tiny stars used as filler decoration
- Premium版だけの豪華geometry

---

# Current Star Beast boundary

旧v1にあった:

- 小鹿
- 燕
- 亀
- 狐
- 蛍
- 鶴
- リス
- うさぎ
- ふくろう
- はりねずみ
- 白蛾
- 蝙蝠
- 黒兎

等をCurrentへ戻さない。

Star Beastは `characterThemeColors.ts` とCurrent star-beast authorityを参照する。

灯紋にはStar Beastを**描かない**。

---

# Phase

| phase | Current rule |
| --- | --- |
| 無紋 | 主線の一部だけ |
| 灯紋 | simple base geometry |
| 暁紋 | 1 geometric operationだけ |
| 黒紋 | 既存線1本だけが過剰になる |
| 双灯紋 | shared node / gapを1つだけ共有 |

暁紋へ羽・星・王冠を追加しない。
黒紋へ角・棘・悪魔decorを追加しない。

---

# Goods

灯紋は同じMaster geometryを:

- UI
- pin
- foil
- embroidery
- engraving
- woven tag
- jewelry
- Character card
- Star Beast tag
- Named Object履歴刻

へ使う。

高級感はmaterial / finish / packagingで出し、形を盛らない。

---

# IP全体

Character灯紋だけでなくStation / Ticket / Star Beast / Named Object / Collectionまで含む商業記号設計:

- `docs/design/ip-symbol-merch-system-v1.md`

---

# One-line rule

> **灯紋は「キャラクターの絵を描かなくても、その人を思い出せる最小の線」。**
