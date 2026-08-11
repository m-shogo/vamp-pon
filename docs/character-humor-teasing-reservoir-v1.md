# ヨルノシルベ — Character Humor / Teasing Reservoir v1

Date: 2026-08-12  
Status: **AUTHOR RESERVOIR / NON-CANON / NO PROTECTED-TRAIT PUNCHLINE DEFAULT**

Machine source:
- `src/game/data/characterHumorTeasingReservoir.ts`

## Purpose

笑い方そのものはBehavior Identityにある。本Reservoirは別軸で、全36人に**どこから冗談へ入るか、誰をどうからかうか、自虐、冗談を止める場面、滑った後の修復**を持たせる。

Target:

```txt
36 characters × 5 axes = 180 humor/teasing anchors
```

Axes:
1. `JOKE_ENTRY`
2. `TEASING_BOUNDARY`
3. `SELF_DEPRECATION`
4. `WHEN_NOT_TO_JOKE`
5. `MISFIRE_REPAIR`

## Hard boundaries

Default punchlineにしない:
- body size / weight / appetite
- age / wrinkles / memory decline
- dialect / origin / nationality
- skin tone
- disability / wheelchair / pain / access
- gender / sexuality / gender presentation
- species / artificial-person status
- child vulnerability
- trauma / bereavement / abuse
- poverty / class

`teasing != affection score`
`humor != intelligence`

「仲が良いから何を言ってもOK」にはしない。相手・時期・contextで境界は変わる。

## Current21 highlights

- ユイ: shared absurdityや自分のmisread。相手が笑っていない時は意図を弁護せず修復。
- アサ: literal/system expectationの反転はできるが、Human/personhood/name choiceをネタにしない。
- ナギ: dry humor。privacyやsecretをsocial currencyにしない。
- ミチル: route/de-tour joke。遅い・違う・accessible routeを笑わない。
- トモリ: object failureのdry joke。scarcity/work marksは笑いにしない。
- セン: explanationの過剰さを自虐できる。学力差を笑わない。
- リツ: overhelpingを自虐。コヨリや小さい人をcontrol positionからいじらない。
- コヨリ: silly naming。大人がprotected trait mockeryを教えない。
- ゲン: generation gapは自分もpunchlineになる。ageismはしない。
- ハナ: saving/wrapping joke。body/appetite/older-woman stereotype禁止。
- ユウビ: route/handoff callback。delay/mobility/safetyを笑わない。
- マドカ: late observation。人が「見られている」と感じるvulnerabilityを使わない。
- シロ: category/footnote joke。unknown/read levelを笑わない。
- トバリ: threshold/return deadpan。abandonment/trackingをネタにしない。
- ネム: tensionを下げるsoft absurdity。sleep/fatigue/mental-health codingは笑わない。
- クロオリ: fold/layer metaphor。privacy disclosureは笑いの材料にしない。
- カナメ: space-plan joke。weight/appetite/strength/body shapeは禁止。
- カスミ: draft/version joke。quietness/dialectをidentity gagにしない。
- トキ: overprecision joke。routine/diagnosisを笑わない。
- ツムギ: unfinished/shared metaphor。clothing/body/craft shameを笑わない。
- レン: pattern jokeで自分の仮説を落とす。人をdata pointにしない。

## Future15 highlights

- ヒヨリ: fast social callback。skin/gyaru/body/sexuality/popularityをpunchlineにしない。
- セリカ: overformal line。class/family expectation/queer identityを笑わない。
- クロエ: old/new callback。long life / lost peopleをdefault jokeにしない。
- レンジ: apprentice mistake。mentor power gapをhumiliationにしない。
- トウマ: authorship/material joke。skin/gay identity/partner privacy禁止。
- クウ: Humanがdog timingを面白がることはあっても、dogをintentional comedianにしない。
- ヨモ: cat timingも同様。hiss/avoidance/painをsassy gagにしない。
- ノア: literal expectation reversalは本人のhumorとして可。artificial-personhoodを笑わない。
- ルム: instance-specific mismatch。replaceability / small bodyを笑わない。
- マキ: fast callback。bisexuality/body/Osaka stereotypeを笑わない。
- スズ: playful presentationも可能だがfeminine presentation/manhood/sexualityはdefault targetにしない。
- イオ: label/pattern joke。gender/voice/category speculation禁止。
- カイ: start-too-soon自虐。ナオをslow/second twinとしていじらない。
- ナオ: late timing自虐。カイをreckless/first twinとして固定しない。
- アマネ: route/access infoの自虐は本人発でも、wheelchair/body/access/help/painをdefault punchlineにしない。

## Misfire repair

Jokeが滑った時のCharacter差は重要。

Good repair:
- intentよりimpactを先に認める
- audienceを狭める
- fact / access / ownershipを直す
- jokeを重ねて逃げない
- 「冗談通じない人」扱いしない
- targetへ笑って許すperformを要求しない
- body/access mistakeなら環境や行動も変える

> **面白いCharacterは、冗談が上手いだけでなく、滑った時の戻り方も本人らしい。**

## Production boundary

No automatic connection to:
- affection points
- dialogue randomizer
- comedy stat
- voice casting
- protected-trait ban beyond story context review
- runtime banter engine

`runtimeAutoPromotionAllowed = false`

Future Author DB candidate dimension:
`humorTeasing`

Guiding principle:

> **仲が良いから雑にいじるのではなく、仲が良いほど「ここまでは笑える」を知っている。**
