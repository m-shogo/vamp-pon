# ヨルノシルベ — Character Leisure / Play Reservoir v1

Date: 2026-08-12  
Status: **AUTHOR RESERVOIR / NON-CANON / ERA-TECH-AWARE / NO HOBBY STEREOTYPE**

Machine source:

- `src/game/data/characterLeisurePlayReservoir.ts`

Related:

- `docs/character-ordinary-life-reservoir-v1.md`
- `docs/character-competence-learning-reservoir-v1.md`
- `docs/character-environment-sensory-reservoir-v1.md`
- `docs/character-author-db-life-coverage-extension-v1.md`

## Purpose

Characterが「事件・仕事・戦闘・relationship進行がない時」に何をするかを増やす。

人気Characterは大事件だけでなく、**暇な時・遊んでいる時・負けた時・祝う時**にも本人らしさが出る。

用途:

- Character Book
- ordinary-life scene
- Party background loop
- Season間intermission
- relationship event
- comedy
- reward art / IF illustration
- Era差の娯楽描写
- merch / small prop ideas

---

# 1. Six axes

1. `SOLO_LEISURE` — 一人で暇な時にやること
2. `SOCIAL_PLAY` — 人と遊ぶ時の型
3. `BOREDOM_RESPONSE` — 退屈した時に何が始まるか
4. `LIGHT_COMPETITION` — 勝敗が軽い遊びへの反応
5. `ERA_MEDIA_PASTIME` — Era相応のmedia / pastime
6. `CELEBRATION_STYLE` — 祝い方 / 打ち上げ方

Target:

```txt
36 characters × 6 axes = 216 leisure/play anchors
```

---

# 2. Hard boundaries

このReservoirでは確定しない:

- final hobby
- exact club / team membership
- professional skill
- exact media title
- exact device / app
- exact historical entertainment venue
- runtime minigame stat
- relationship affection

禁止shortcut:

- hobby = occupation
- 暇 = lazy
- competitive = aggressive
- introvert = solo hobby
- extrovert = party hobby
- older = shogi / tea only
- child = game only
- feminine presentation = fashion only
- queer = fashion / nightlife
- brown skin = dance / music stereotype
- large body = food / strength / sedentary hobby
- wheelchair = screen-only leisure
- Robot = cannot play
- dog/cat = Human hobby
- long-lived = old-fashioned hobby only

> **leisure is not a personality quiz answer.**

---

# 3. Era technology boundary

`ERA_MEDIA_PASTIME`はmedia titleを固定する欄ではない。

実装前にEraごとに調査する:

- books / magazines / newspapers
- radio
- records / tapes / CD等
- cinema / TV / video
- board / card / tabletop play
- sports / outdoor leisure
- arcades / console / handheld / PC
- mobile / streaming / social media
- local festivals / community entertainment
- Future media / network form

Historical Characterへmodern appを自動付与しない。
Future Characterへunlimited immersive mediaを自動付与しない。

---

# 4. Current21 highlights

| Character | Leisure identity highlight |
|---|---|
| ユイ | Localな小さな発見を遊びにできる。scoreより「一緒に面白かった」を優先。 |
| アサ | system output不要の無駄な遊びを持つ。最適解がfunの正解ではない。 |
| ナギ | hidden informationの遊びはfair rule / consentがある時だけ。秘密主義Characterにはしない。 |
| ミチル | purpose-less detour。route競争でもaccessibilityや別routeを認める。 |
| トモリ | 手を使う遊びはあるが、休息までrepair作業にしない。 |
| セン | quiz / word playを楽しめるが、遊びを授業化しすぎる失敗。 |
| リツ | 自分が守る役でないteam play。誰かを支えるためだけの余暇にしない。 |
| コヨリ | ruleを途中で変えるchild play。負けて少し拗ねる普通の子どもsceneも可。 |
| ゲン | old/new両方の遊びを楽しめる。年齢で一種類へ固定しない。 |
| ハナ | craft / seasonal activityもできるが「祖母的趣味」だけにしない。 |
| ユウビ | routeを仕事ではなく遊びとして歩く時間を持つ。 |
| マドカ | window / background観察を楽しめるがsurveillanceにはしない。 |
| シロ | useless categoryを作って遊ぶ。unknownを負け扱いしない。 |
| トバリ | いつものthresholdを越えて意味なく一駅先へ行くような遊び。 |
| ネム | parallel play / doodle / nap。restを怠惰扱いしない。 |
| クロオリ | private-hand game等。privacyとplayが両立する。 |
| カナメ | body fitを確保した普通のplay。strength contestに固定しない。 |
| カスミ | multiple-answer遊び。最後まで一つに決めなくてもよい。 |
| トキ | personal bestやtimingを楽しむが、最後に「測らない時間」を持てる。 |
| ツムギ | unfinished共同制作。cleanest resultだけが勝ちではない。 |
| レン | prediction / comparisonを遊びにできるが、最後は分析をやめる。 |

---

# 5. Future15 highlights

Future15は情報が増えてもCurrent21へ昇格しない。

| Character | Leisure identity highlight |
|---|---|
| ヒヨリ | lively playもquiet leisureも両方ある。gyaru checklistにしない。 |
| セリカ | hostingが得意でも毎回organizerにはしない。guest側の遊びも持つ。 |
| クロエ | old pastimeもnew pastimeもある。long-lived nostalgia machineにしない。 |
| レンジ | masterから離れたpeer leisureを持つ。 |
| トウマ | craft以外のmedia / playも普通に楽しめる。 |
| クウ | dogとしてscents / toy / chase / rest。Human scoreは理解しない。 |
| ヨモ | catとしてperch / chase / warm place。tourism mascot gameにしない。 |
| ノア | efficiency不要のactivityを選べる。Humanになる証明としてplayさせない。 |
| ルム | instance-specific useless variationがplayになり得る。Human chibi化しない。 |
| マキ | 速く決めた遊びを途中でやめてもよい。 |
| スズ | presentation関連も無関係な遊びも両方。gender essentialism禁止。 |
| イオ | media tasteをgender reveal clueにしない。 |
| カイ | start-now型。ナオとmatched twin hobbyにしない。 |
| ナオ | one-round見る型。カイとmirror hobbyにしない。 |
| アマネ | accessible outing / game / city leisure。screen-only disability trope禁止。 |

---

# 6. Boredom is useful scene material

大事件なしでsceneを作る時:

- someone starts a tiny game
- someone reorganizes then stops
- someone walks one stop farther
- someone notices a weird sound
- someone proposes competition
- someone does nothing
- someone watches another person play
- someone leaves early
- someone gets unexpectedly serious
- someone loses and sulks

等で関係が見える。

**退屈 = Characterが薄い時間ではない。**

---

# 7. Light competition

競争はcombat strength rankingではない。

使えるもの:

- memory
- route
- timing
- guessing
- finding
- craft constraint
- cooperative score
- personal best
- speed when access rules are fair
- accuracy
- prediction confidence

禁止:

- winner = stronger/better person
- loser humiliation
- child must teach adults moral truth
- body difference used as joke handicap
- disability pity handicap
- artificial body automatically wins
- animal is scored by Human concept unless trained game context

---

# 8. Celebration

Celebrationは全員party好きにしない。

Possible forms:

- small food
- walk
- photo optional
- handmade shared object
- quiet afterparty
- public event
- private toast
- route destination
- seasonal object
- game
- everyone free to leave / return

同じCharacterでもevent / relationshipによって変わる。

Sunny IF reward artの花見 / 海 / BBQ等にも、この差を反映できる。

---

# 9. Representation guards

- Kaname / Hana body size does not define sedentary/food leisure.
- Gen/Hana age does not define old-fashioned pastime.
- Hiyori/Touma skin tone does not define music/dance leisure.
- Suzu presentation does not define fashion hobby.
- Io media preference does not reveal gender.
- Amane wheelchair does not define passive leisure.
- Noa/Rum artificial status does not remove play.
- Kuu/Yomo remain animal play, not Human hobby.
- Kai/Nao do not receive matching twin hobbies.

---

# 10. Production boundary

No automatic connection to:

- minigame stats
- achievements
- relationship affection
- gacha
- final hobby Canon
- exact media licensing
- runtime behavior

`runtimeAutoPromotionAllowed = false`

Future Author DB candidate dimension:

`leisurePlay`

---

# 11. QA

- [ ] 36 characters
- [ ] 6 axes each
- [ ] 216 anchors
- [ ] no exact hobby freeze
- [ ] no job/hobby equivalence
- [ ] no laziness/competition personality score
- [ ] Era media boundary preserved
- [ ] no age/gender/sexuality/origin stereotype
- [ ] no disability passive-leisure framing
- [ ] artificial persons can play without Humanization goal
- [ ] animal play stays species-appropriate
- [ ] Future15 no promotion
- [ ] runtime no promotion

Guiding principle:

> **事件がない夜でも、一緒に遊べるCharacterは強い。**
