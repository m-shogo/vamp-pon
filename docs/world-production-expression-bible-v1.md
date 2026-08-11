# ヨルノシルベ — World Production Expression Bible v1

Date: 2026-08-11  
Status: **P2 PRODUCTION EXPRESSION / WORLD FOUNDATION DERIVED / FINAL ART HUMAN REVIEW REQUIRED**

> Coverage: Environment Visual Bible, Prop Master Book, Audio / Leitmotif Bible, Localization Guide, Merch Scene Matrix.
> 目的: 設定資料では良いのに、画像・音・グッズにするとgeneric fantasy / generic animeへ戻る事故を防ぐ。

---

# PART A — Environment Visual Bible

# 1. World visual promise

> **暗い夜 + 紙 / インク / 生活道具 + 人が本当に使った痕跡 + 小さな暖色光。**

「闇 = 真っ黒」「Fantasy = 青い魔法粒子」だけにしない。

既存Visual direction:
- 紙UI / 黒インク / ランタン光
- 通常画面は静か
- レア演出だけ派手
- 可読性優先
- 生成画像の質感をバラバラにしない

を維持する。

---

# 2. Environment layer tags

背景masterごとに:

- `REALITY`
- `THRESHOLD`
- `NIGHT`
- `RECORD`

を持つ。

## REALITY
生活の具体物を最優先。

## THRESHOLD
現実として成立するが、一点だけ違和感。

## NIGHT
複数Era / route / meaningが重なる。

## RECORD
紙・写真・地図・記録物として世界を見せる。

---

# 3. Material vocabulary

ヨルノシルベの素材:

### Warm
- paper
- wood
- cloth
- old paint
- brass
- warm glass

### Cold
- iron
- wet asphalt
- tile
- station metal
- moonlit glass

### Uncanny
- black ink
- blank paper surface
- wrong label adhesive
- folded black paper

全部を石造りFantasy dungeonへしない。

---

# 4. Architecture rule

場所ごとに「誰が使うか」を先に決める。

例:
- 教室 → 子どもの高さの傷 / 机 / 掲示
- 郵便局 → 仕分け / 人が立って作業する高さ
- 修理工房 → 手の届く範囲へ工具
- 駅 → 流れ / 待つ / 戻る

背景をbeautiful concept artとしてだけ作らない。

---

# 5. Signage grammar

看板 / 注意書きは世界密度を上げる。

必要:
- handwriting / print / stencil差
- era差
- institution差
- correction跡
- removed-name跡

Avoid:
- 全看板に意味深ポエム
- 全部同じ綺麗なfont
- AI生成文字をそのまま採用

最終文字はnative text / authored textureへ置換する。

---

# 6. Weather vocabulary

- light rain
- after rain
- mist
- cold clear sky
- first snow Candidate
- humid summer night
- dry autumn wind

天気はmood filterだけでなく:
- 路面
- 服
- 食事
- route
- light reflection

へ影響させる。

---

# 7. Plant / season rule

植物をdecorative petal generatorにしない。

- ハナの押花と一致するseason
- 道端雑草
- 駅植栽
- 校庭
- 商店鉢植え

など生活用途を持つ。

---

# 8. Night transformation grammar

普通の場所がNight化する時:

Bad:
> 紫にしてparticleを足す。

Good:
- 看板の一文字だけ違う
- 以前のroute lineが浮く
- 雨跡だけ別Era
- 忘れ物が同じ場所に集まる
- 壁の修理跡が光る
- 影だけ昔の家具形

---

# PART B — Prop Master Book

# 9. Prop tiers

## Tier S — IP core props
- ユイのランタン
- 朔盟の欠円symbol
- 夜明け星図

## Tier A — Character identity props
- アサの名札 / label tools
- ナギの月箱 / 鍵
- ミチルの地図 / compass
- トモリの修理灯 / tool
- Current21 luminous possessions

## Tier B — recurring world props
- old ticket
- unposted envelope
- white bookmark
- pressed flower
- map revision
- repair tag

---

# 10. Prop master required fields

各Tier S/A:

```txt
stableId
owner / keeper
originalFunction
currentFunction
material
size
weight impression
front/back/profile
open/closed if applicable
wear
repair history
hand interaction
storage position
sound
night change
black-youka change
dawn state
what must never change
```

---

# 11. Yui lantern production contract

Existing source / visual masterを上流にする。

追加で固定したい:
- 片手 / 両手時のscale
- tableに置いた時の高さ
- flame / light source位置
- repair seam visible area
- grip wear
- silhouette at 32–64px

ランタンを場面ごとに巨大化 / 小型化しない。

---

# 12. Sakumei broken-circle mark

Working symbol: **欠円 / incomplete circle**
Status: `CANDIDATE VISUAL SYSTEM`

Rules:
- 完全な円ではない。
- 各memberで欠け方 / material integrationが違う。
- symbolなしでもmember識別可能。
- pair時に二つの欠けが「完全な同じ円」になる必要はない。

むしろ:
> 二人の正解を合わせても少し欠けが残る

方がThemeに合うCandidate。

Member placement candidates:
- ナシロ: name tag negative-space
- アサトジ: box clasp
- ミチグレ: erased map ring
- オリネ: fold crease
- ハクマ: blank card cutout
- ツグリ: repair seam
- ユラネ: ripple
- ペタ: overlapping sticker edge

---

# 13. Prop wear rule

新品状態だけをmasterにしない。

3 state:
- `EARLY_USE`
- `CURRENT_WORN`
- `DAWN_AFTER`

修理 / 汚れ / 書き込みをCharacter historyとして扱う。

---

# PART C — Audio / Leitmotif Bible

# 14. Audio identity

ヨルノシルベの音は:
- 夜の静けさ
- 小さい生活音
- 紙 / pen / lock / ticket / tool
- 遠い駅 / 風
- rare combat peak

のcontrastで作る。

常時壮大orchestralにしない。

---

# 15. Core5 sound signatures Candidate

## ユイ
- small lantern glass
- pencil / paper touch
- warm two-note rise

## アサ
- tag snap / pen stroke
- quick bright attack
- short upward interval

## ナギ
- lid close
- key rotation
- muted low bell

## ミチル
- compass click
- footstep / map unfold
- moving interval that does not fully resolve

## トモリ
- tool tap
- wick spark
- repaired chord with audible seam / slight detune Candidate

音楽理論のexact keyはcomposer reviewで確定。

---

# 16. Relationship leitmotif rule

Pair theme = A theme + B themeを重ねるだけにしない。

関係が育つと:
- timingが合う
- missing noteが補完
- rhythmが共有

など**関係の変化**を音へ出す。

---

# 17. Sakumei audio system Candidate

共通:
- 音の終わりが完全resolveしない
- short silence / missing beat

個別:
- ナシロ: name-like syllable fragment, not actual voice
- アサトジ: lid / latch
- ミチグレ: distant route rumble
- オリネ: paper fold
- ハクマ: sound suddenly thins
- ツグリ: stitch / metal repair scrape
- ユラネ: low wave / breath-like pad
- ペタ: sticker peel / slap, slightly annoying but recognizable

ペタだけcomic SEに落としすぎない。

---

# 18. Silence is authored

重要sceneではBGMを足すだけでなく:
- station ambienceだけ
- pen soundだけ
- chair repairだけ

にできる。

Quiet episodeの価値を音でも守る。

---

# PART D — Localization Guide

# 19. Translation priority

翻訳時の優先:

1. Character identity
2. emotional function
3. recurring motif
4. readability
5. literal wording

日本語の字面を無理に直訳しない。

---

# 20. Proper noun registry rule

各固有語:

```txt
jpDisplay
jpReading
romanization
englishWorkingName
literalMeaning
storyFunction
translateOrTransliterate
forbiddenAlternatives
spoilerTier
```

を持つ。

---

# 21. Key term working treatment

## ヨルノシルベ
Brand title。ローマ字 / English titleはmarketing reviewで最終決定。

## 黒耀化
単純に`Dark Mode`などへしない。
意味:
- 長所の過剰化
- 外部人格ではない

を訳語noteに含める。

## 星獣
`Star Beast` working labelは既存使用を維持可能。

## 朔盟
Literal components:
- 朔 = new moon / dark moon beginning
- 盟 = pact / covenant / alliance

Englishは`Sakumei` transliteration firstを推奨Candidate。
安易な`Dark Alliance`は禁止。

## 八影
Early observer label。
正式組織名と誤訳しない。

---

# 22. Honorific / relationship localization

日本語の:
- さん
- ちゃん
- 呼び捨て
- 敬語解除

はAffinity signal。

英語で全てfirst-nameにして情報を消さない。

代替:
- sentence formality
- nickname
- shortened name
- directness

で関係変化を再構成する。

---

# 23. Gender / identity localization guard

- イオのgenderを翻訳文法の都合で勝手に確定しない。
- スズのfeminine presentationを英語圏の別identity labelへ自動置換しない。
- Sexual orientationは必要な場面だけ明示。
- Japanese sourceで未LOCKの代名詞をtranslatorが固定しない。

---

# 24. Era language localization

古い人物 = Shakespeare English、のような極端な置換をしない。

差は:
- word choice
- politeness
- object vocabulary
- sentence length

で出す。

---

# PART E — Merch Scene Matrix

# 25. Merch is identity QA

商品化しやすさは商売だけでなくCharacter認識テストになる。

同じpose / same-faceで髪色だけ違う商品は禁止。

---

# 26. Scene classes

各主要Character:

- `SOLO_ICON`
- `DAILY_LIFE`
- `COMBAT`
- `STAR_BEAST`
- `NAMED_OBJECT`
- `PAIR_RELATION`
- `QUIET_EMOTION`
- `SEASONAL`
- `CHIBI`

を持てる。

全部を一度に作る必要はない。

---

# 27. Core5 initial merch scenes Candidate

## ユイ
- lantern + 「これ誰の？」table
- Star Beast sleeping by lantern

## アサ
- label-writing desk
- name-tag strip acrylic motif

## ナギ
- moon box closed / open pair goods

## ミチル
- map napkin / compass travel set

## トモリ
- repair workbench / before-after prop

Character portraitだけでなく**その人の行動**を商品へする。

---

# 28. Relationship merch rule

Pair goodsは恋愛pairだけではない。

- buddy
- sibling
- ideological rival
- mentor / successor
- enemy mirror
- comedy pair

を同格に扱う。

Existing high-value:
- ユイ×アサ
- リツ×コヨリ
- ユイ×クロオリ
- ナギ×カナメ
- ミチル×トキ
- トモリ×ツムギ

---

# 29. Sakumei merch potential

朔盟8人は「集合黒コート」ではなく:
- 8 unique silhouette pins
- broken-circle fragments
- pair mission goods
- enemy record cards
- Petta sticker-sheet gag goods

が可能。

ただしfinal visual master前に大量商品designへ進まない。

---

# 30. Seasonal rule

季節衣装でCharacter hard landmarkを失わない。

- body shape
- face signature
- posture
- key object

の最低2つを保持。

全員浴衣 / 全員サンタのようなevent costumeだけで個性を作らない。

---

# 31. Chibi rule

Chibi化しても:
- eyebrow
- eye shape
- face mark
- body proportion cue
- object

から最低2–3識別点を残す。

Hana / Kanameをchibiでgeneric thin bodyへ戻さない。

---

# 32. Production acceptance

P2完成の条件:

- BackgroundがどのLayer / Era / culture zoneか分かる。
- Tier S/A propsに寸法 / wear / hand interactionがある。
- Core5 / Sakumeiに音だけのrecognition laneがある。
- Localizationでmystery / relationship signalを失わない。
- MerchがportraitだけでなくCharacter action / object / relationを使う。
- final artはHuman Review前にapproved扱いしない。