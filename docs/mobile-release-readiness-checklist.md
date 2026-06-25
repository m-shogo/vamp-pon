# Mobile Release Readiness Checklist

Vamp Pon / Lantern Ledger をスマホアプリとして出す時に詰まりやすい項目の先回りチェック。

これは今すぐ全部やるものではない。UnityまたはPhaserでMVPが見えてきた時に、何が必要になるかを早めに把握するためのリスト。

## Core Principle

ゲームが面白くなる前に、ストア対応やSDKを入れすぎない。

ただし、後で必要になるものは最初から知っておく。

## Release Stages

### Stage 1: Internal Demo

Purpose:

- 自分で動かす
- 30秒〜数分の体験確認
- Phaser vs Unity比較

Need:

- playable build or web preview
- no store assets
- no ads
- no analytics required
- no cloud required

### Stage 2: Closed Test

Purpose:

- 少人数で触ってもらう
- crash / usability / difficulty確認

Need:

- version number
- crash reporting recommended
- simple feedback form
- basic device list
- known issues list

### Stage 3: Beta / TestFlight / Internal Track

Purpose:

- 継続率や初回体験を見る

Need:

- app icon candidate
- app name candidate
- privacy policy draft if analytics/crash SDK exists
- basic analytics events
- crash reporting
- onboarding/check tutorial
- store screenshots draft

### Stage 4: Production Release

Purpose:

- 一般公開

Need:

- final app name
- app icon
- store screenshots
- short description
- long description
- privacy policy
- support contact
- age rating answers
- data safety/privacy labels
- crash-free quality
- monetization policy if ads/IAP

## App Identity Checklist

Need before beta:

- [ ] final or beta app name
- [ ] app icon direction
- [ ] subtitle/short tagline
- [ ] store short description
- [ ] title screen display name
- [ ] package/bundle identifier decision

Current note:

- `Vamp Pon` is development code name.
- `Lantern Ledger` / `夜灯録` are candidate directions.
- Do not rename repo/package casually until final decision.

## Store Asset Checklist

Eventually needed:

- [ ] app icon
- [ ] feature graphic / promo image if needed
- [ ] phone screenshots
- [ ] tablet screenshots if supporting tablet
- [ ] preview video optional
- [ ] short description
- [ ] long description
- [ ] keywords / tags

Screenshot priority:

1. Battle with readable action
2. LevelUp card choice
3. Result Clear memory page
4. StageSelect night map
5. Collection ledger
6. 黒曜化 cutin moment

Rules:

- screenshots must match real game UI
- no fake UI that does not exist
- no unreadable tiny text
- no misleading gacha/loot claims

## Privacy / Data Checklist

Before adding analytics/ads/cloud:

- [ ] list collected data
- [ ] list SDKs
- [ ] privacy policy draft
- [ ] consent requirements checked
- [ ] app store data disclosure prepared
- [ ] opt-out or settings considered if needed

Data categories to track carefully:

- device identifiers
- crash logs
- analytics events
- ad identifiers
- purchase data
- cloud save data

Beginner rule:

If you do not know why you collect it, do not collect it.

## Analytics Checklist

Add only after playable prototype.

Early events:

```txt
app_start
run_start
run_end
stage_select
level_up_open
level_up_pick
ultimate_used
kokuyou_activated
result_growth_tap
collection_open
```

Do not track:

- excessive personal data
- every tap without reason
- unneeded identifiers

## Crash Quality Checklist

Before external beta:

- [ ] crash reporting SDK selected
- [ ] build version included
- [ ] scene/stage custom keys
- [ ] device/os visible
- [ ] known crash list tracked

Useful keys:

```txt
scene
stageId
characterId
elapsedSec
enemyCount
weaponCount
kokuyouState
buildChannel
```

## Save / Progress Checklist

Before beta:

- [ ] local save exists
- [ ] save schema versioned
- [ ] reset/debug option exists for test
- [ ] broken save handling exists
- [ ] migration plan exists if schema changes

Do not add Cloud Save until:

- core retention is proven
- account policy is clear
- restore value is worth support cost

## Monetization Checklist

Do not add before loop is fun.

Possible later:

- rewarded ad for optional bonus memory shards
- rewarded ad for reroll
- remove ads purchase
- cosmetic supporter pack

Avoid:

- banner during battle
- forced ad every run
- monetization before first retention check
- pay-to-win growth pressure

## Performance Checklist

Before beta:

- [ ] phone test, not only Editor
- [ ] no obvious hitch during enemy death
- [ ] no hitch during EXP pickup
- [ ] no hitch during LevelUp
- [ ] no hitch during Result
- [ ] no runaway particle counts
- [ ] no excessive memory growth

## Accessibility / Usability Checklist

Important for mobile:

- [ ] text readable on 390x844
- [ ] buttons large enough
- [ ] important UI not under safe area
- [ ] no critical red/green-only distinction
- [ ] screen shake can be reduced if needed later
- [ ] flashes are not excessive
- [ ] tutorial/onboarding is short

## Audio Checklist

Before beta:

- [ ] BGM volume setting
- [ ] SE volume setting
- [ ] mute option
- [ ] no harsh repeated collect sound
- [ ] hit/death/collect/levelup/result cues exist

## Localization Checklist

Not required day one, but avoid blocking it.

Prepare by:

- no baked text in images
- short labels
- text constants separated where possible
- title change possible

## Build Checklist

Eventually:

- [ ] bundle identifier
- [ ] version/build number
- [ ] signing setup
- [ ] release/debug build distinction
- [ ] crash symbol upload if needed
- [ ] store-ready icon sizes
- [ ] permission list checked

## Support Checklist

Before production:

- [ ] support email or form
- [ ] known issues page
- [ ] save reset guidance
- [ ] feedback channel

## Release Readiness Gates

### Internal Demo Ready

- 30秒 playable
- no major crash
- readable UI
- clear next action

### Beta Ready

- several minutes playable
- local save
- crash reporting
- basic analytics
- app icon candidate
- privacy draft if SDKs collect data

### Production Ready

- stable build
- clear store page
- privacy/data disclosure complete
- crash rate acceptable
- retention loop validated
- monetization only if respectful

## Final Rule

Do not optimize for store release before the game is fun.

But do not ignore release requirements until the final week.
