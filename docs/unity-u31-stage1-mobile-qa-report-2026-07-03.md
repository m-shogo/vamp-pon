# Unity U31 Stage1 Mobile QA Report

## QA Environment

- Environment: Unity Editor 390x844 batchmode evidence.
- Device: Unity Editor.
- Platform: Editor.
- Build type: Editor batchmode.
- Mobile device QA: NOT_MEASURED.

## Scenario Result Summary

U31 defines 20 QA scenarios. Editor evidence covers StageSelect, opening, first 30 seconds, LevelUp, mid wave, Rare, Evolution, Kokuyou, Result, Reward / Unlock, StageSelect progress, Retry, and 390x844 readability. Device-only measurements remain `NOT_MEASURED`.

## First 30 Seconds

Opening density was lightly tuned. The opening wave interval changed from 2.8 to 2.6, opening max enemies changed from 6 to 7, first pressure interval changed from 2.2 to 2.1, and first pressure max enemies changed from 11 to 12. The first LevelUp target remains 30 seconds.

## Mid Wave / Climax

Mid wave, Kokuyou timing, Evolution timing, Rare chance, caps, and clear push are not retuned in U31. U31 keeps U29 performance caps and records device measurements as `NOT_MEASURED`.

## LevelUp

LevelUp target and choice count remain unchanged. Choice readability is covered by Editor 390x844 screenshots, not mobile touch QA.

## Rare / Evolution / Kokuyou

Rare, Evolution, and Kokuyou remain QA-observable moments. Final art, final effects, final audio, and device haptic behavior are not approved.

## Result / Reward / Unlock

U27 reward / unlock proof remains intact. Reward economy and unlock pacing remain draft and are not production balanced.

## StageSelect / Retry

StageSelect before/after clear and retry flow have U31 Editor evidence. Mobile touch and app restart behavior remain follow-up items.

## Save Persistence

U27 local save proof exists, but U31 does not measure restart persistence on a mobile device. Cloud Save is not introduced.

## Audio / Haptic

U28 routing and U29 performance guards remain intact. U31 does not approve final SE, AudioMixer behavior, audio latency, or device haptic intensity.

## FPS / Memory / Thermal / GC / Draw Call

Real device FPS, memory, thermal, GC allocation, and draw calls are `NOT_MEASURED`.

## Blockers

- Production Sprite Atlas packing evidence remains incomplete.
- Mobile performance evidence is not measured.

## Cautions

- Reward economy is draft.
- Final SE is not approved.
- Haptic device behavior is not measured.
- Save restart persistence is not measured.

## Tuning Actions

- Pickup radius: 1.65 to 1.75.
- Basic weapon cooldown: 950ms to 900ms.
- Opening wave: interval 2.8 to 2.6, max enemies 6 to 7.
- First pressure wave: interval 2.2 to 2.1, max enemies 11 to 12.

## U30 Approval Gate Impact

U31 does not clear U30 critical blockers. `productionApproved` remains false.

## U32 / U33 Handoff

U32 should handle production asset replacement and Sprite Atlas production packing. U33 should harden Stage1 balance with measured play data.
