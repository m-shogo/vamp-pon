# ヨルノシルベ Lorebook Visual / Motion / Theme System v1

Date: 2026-08-09  
Status: **IMPLEMENTED V1 / LOREBOOK + CHARACTER THEME DATA**

## 1. Goal

Lorebookを一般的な設定WikiやSaaS dashboardにしない。

目標:

```txt
夜へ入る
↓
人物を見つける
↓
色と星獣で誰かを思い出す
↓
関係の線を追う
↓
物と時間の継承を読む
↓
作者だけ未確定設定を比較する
```

「ワクワクする導入」と「大量設定を迷わず引ける実用性」を両立する。

---

## 2. Scroll Prologue

`/lorebook/` の先頭は通常のHeroをいきなり出さず、4幕のscroll prologueを置く。

1. 同じ夜に違う時代の人がいる
2. 物と記憶が時代を渡る
3. 21人の答えが関係という線になる
4. 朝は忘れることではなく選び直せること

実装:

- sticky 100svh
- scroll progressから4幕を切替
- 星 / 楕円軌道 / 灯りのparallax
- 常時 `SKIP INTRO`
- 最終幕に `世界設定をひらく`
- prefers-reduced-motion時は長いscroll演出を廃止し1画面へ短縮

外部animation libraryを必須にしない。

理由:

- static hostingで壊れにくい
- bundle/runtime dependencyを増やさない
- `requestAnimationFrame` / `IntersectionObserver` / CSS transformで十分高品質にできる
- CDN障害でLorebookが壊れない

ライブラリ導入余地は残すが、motionはprogressive enhancementであることを優先する。

---

## 3. Interaction motion

### Reading progress

画面最上部に2pxのreading progressを表示。

### Section reveal

- chapter
- character card
- relation item
- timeline
- mystery
- author question

をviewportへ入った時だけ軽くrevealする。

### Pointer light

Fine pointer時のみ:

- page全体へ非常に薄い灯り
- card上でpointer位置へ局所光

を出す。

Mobile/touchでは不要なhover依存を持たない。

### Relationship lines

相関図の線は初期描画時に短いdraw animation。
Candidateは既存の破線意味を壊さない。

---

## 4. Enhancement bootstrap

以前は:

```txt
index.html
→ profile-enhancement.js
  → relationship
  → combat
  → history
  → decision lab
```

という隠れた依存だった。

Current:

```txt
index.html
├ app.js
└ enhancements.js
   ├ profile
   ├ relationship
   ├ combat
   ├ history
   ├ decision lab
   ├ theme
   └ motion
```

1機能の失敗で他機能のboot chainが切れにくくする。

---

## 5. Character color database

Production-facing source:

```txt
src/game/data/characterThemeColors.ts
```

Lorebook read model:

```txt
public/lorebook/data/character-themes.v1.json
```

各Current21が持つ:

```txt
runtimeId
displayName
primary theme HEX
accent HEX
favorite constellation
star beast
constellation/star-beast HEX
paletteFamilyKey
sharedColorReason
```

### Rule A — primary theme

**Current21のprimary HEXは全員unique。**

兄妹でも人物そのものの主色は同じにしない。
「同じ家族 = 同じ人」に見せないため。

### Rule B — constellation/star-beast color

同一色の重複は原則禁止。

許可:

- sibling
- family
- lineage
- shared memory
- succession
- hidden relationship

等、物語上の明示理由がある時のみ。

Current intentional duplicates:

```txt
ユイ × トモリ
Leo
#D6A541
paletteFamilyKey=leo-lantern-lineage
```

理由の種類は未LOCK。獅子座共有 / ランタン / 火の系譜までを先に見せる。

```txt
リツ × コヨリ
Canes Venatici
#B78552
paletteFamilyKey=canes-venatici-siblings
```

兄妹関係はCurrent Canon。

### Rule C — birthday zodiac is not visual authority

`character-personal-profile-canon-v1.md` の旧birthday-derived `zodiac` はsuperseded。

Lorebook表示では:

```txt
birthday
age impression
favorite constellation
star beast
```

を分離する。

誕生日から星獣を決めない。

---

## 6. Color usage hierarchy

同じ色を画面全体へ塗らない。

```txt
primary
  card border / faint field / node identity

accent
  small marks / item light / highlight

star-beast color
  constellation marker / star orb / shared-relation clue
```

背景はLorebookの夜・紙色を維持する。
人物色はUI framework色ではなく、人物を見分ける識別signalとして使う。

---

## 7. CI invariants

Lorebook CIで次を拒否する。

- Current21 palette欠落
- runtime ID drift
- invalid HEX
- primary HEX duplicate
- 理由なしconstellation duplicate
- 理由なしstar-beast color duplicate
- duplicate familyの不一致
- Leo / Canes Venatici以外の意図しないCurrent duplicate
- deprecated birthday zodiacのprofile UI再表示
- enhancement bootstrap未接続
- prologue / skip control欠落
- build後artifact欠落

---

## 8. Next visual depth

まだV1で意図的に入れていないもの:

- production portrait / silhouette assetの実画像接続
- character-specific star-line SVG / constellation mini-diagram
- stage / object / enemy側テーマ色とのcross-domain palette
- shared lineageを相関図上で色で追えるmode
- spoiler level別のmotion restraint
- browser screenshot visual regression

これらは「色を増やす」より、Current asset authorityとspoiler boundaryを確認してから追加する。
