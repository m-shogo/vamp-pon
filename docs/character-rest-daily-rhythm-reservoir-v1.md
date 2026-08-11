# ヨルノシルベ — Character Rest / Daily Rhythm Reservoir v1

Date: 2026-08-12  
Status: **AUTHOR RESERVOIR / NON-CANON / NO DIAGNOSIS / NO PRODUCTIVITY-WORTH SCORE**

Machine source:
- `src/game/data/characterRestDailyRhythmReservoir.ts`

## Purpose

Characterの生活を「起きる / 働く / 寝る」だけにせず、**どう一日へ入り、どこで休み、疲れがどう漏れ、どう回復し、役割を切り替え、どう一日を閉じるか**を持たせる。

Target:

```txt
36 characters × 6 axes = 216 rest/daily-rhythm anchors
```

Axes:
1. `START_OF_DAY`
2. `MIDTASK_PAUSE`
3. `FATIGUE_SIGNAL`
4. `RECOVERY_RITUAL`
5. `CONTEXT_TRANSITION`
6. `END_OF_DAY`

## Hard boundaries

このReservoirから確定しない:
- exact bedtime / wake time
- chronotype
- sleep disorder / diagnosis
- medical fatigue cause
- work shift
- school schedule
- exact daily calendar
- runtime stamina

禁止shortcut:
- rest need = weak
- less sleep = strong
- productive = valuable
- older = sleepy / slow
- child = endless energy
- plus-size = low stamina
- wheelchair = fatigue identity
- feminine presentation = long grooming routine
- Robot / Android = no rest needed
- dog / cat = Human schedule
- region / Era = one fixed daily rhythm

> **rest need != weakness; productivity != worth.**

## Current21 highlights

- ユイ: context handoff後に小さくreset。疲れると他人のtaskまで拾い始める。
- アサ: system roleとpersonal roleを切り替える。Humanの休息として扱う。
- ナギ: 疲れるとprivacy boundaryを締めすぎる。
- ミチル: 動き続けてorientationが崩れる前にroute-less pauseを持つ。
- トモリ: toolを完全に置く休憩。休息までrepairにしない。
- セン: explanationが長くなるのがfatigue tell。
- リツ: break中にも他人を手伝い始める癖を止める。
- コヨリ: child-scale routine。adult scheduling burdenは持たせない。
- ゲン: body comfortは普通に見るが、年齢で一日を遅く固定しない。
- ハナ: 「誰かのための準備」を休憩へ持ち込まない。
- ユウビ: bagを降ろす本当のpause。walking breakで済ませない。
- マドカ: 疲れるほど観察して話さなくなる。
- シロ: metadataを増やし始めたらstop rule。
- トバリ: threshold roleから物理的に離れて休む。
- ネム: pauseにはresume marker。sleepinessだけが人格ではない。
- クロオリ: privacyを締めすぎるのがfatigue tell。
- カナメ: body fit / fatigueを普通のplan inputにする。大柄=高/低staminaではない。
- カスミ: 疲れるとversionを増やしすぎる。
- トキ: timerを見ない休憩も持つ。
- ツムギ: safe partial stateで作業を止められる。
- レン: verificationが価値を失ったらanalysisを止める。

## Future15 highlights

- ヒヨリ: lively personaを常時維持しない。quiet timeも本人。
- セリカ: host/planner roleを降りる時間を持つ。
- クロエ: long lifeでも「今の一日」に戻る休息を持つ。
- レンジ: apprentice roleを脱いでpeer / self timeへ移る。
- トウマ: making / authorship以外の休みを持つ。
- クウ: dogのrest / panting / avoidanceはwelfare context。Human productivity化しない。
- ヨモ: cat rhythmをHuman scheduleへ変換しない。
- ノア: system load / body limit / personal overextensionを別に扱う。Human化テストにしない。
- ルム: fleet service stateとinstance休息/idleを別に扱う。
- マキ: decisionをしない時間を持つ。
- スズ: presentationを毎日のperformance dutyにしない。
- イオ: daily patternをgender clueにしない。
- カイ: 新しいことを始め続ける前にstop point。
- ナオ: perfect transition待ちを一日中続けない。
- アマネ: access friction / body load / pain等はplan inputであってinspiration storyではない。

## Context transition

人は一日の中で役割を切り替える:
- work → friend
- school → home
- host → guest
- helper → resting person
- mentor → peer
- route worker → off duty
- system role → personal role
- fleet/shared state → instance state

Characterの深みは、この**切替に少し時間がかかる / きれいに切れる / 前の役割を引きずる**にも出せる。

## Fatigue signal is not diagnosis

Fatigue tellはstory/animation用の兆候であり、診断ではない。

Examples:
- same thingを確認し直す
- boundaryが強くなる
- helpを引き受けすぎる
-説明が長くなる
- timingがずれる
- revisionが増える
- silenceが増える
- more decisions / fewer decisions

`fatigue signal != medical diagnosis`

## Nonhuman / artificial boundary

### Kuu / Yomo

species-appropriate:
- rest
- sleep
- shade / warmth
- grooming
- hiding
- scent exploration
- water / care

Human productivity or moral lazinessを付けない。

### Noa / Rum

```txt
maintenance != sleep by default
idle != uselessness
processing speed != no recovery need
system cycle != personal day
resource limit != worth
```

## Production boundary

No automatic connection to:
- stamina bar
- sleep mechanic
- debuff
- medical status
- exact calendar
- animation runtime
- relationship affection

`runtimeAutoPromotionAllowed = false`

Future Author DB candidate dimension:
`restDailyRhythm`

Guiding principle:

> **Characterは忙しい時だけでなく、止まった時にもその人らしい。**
