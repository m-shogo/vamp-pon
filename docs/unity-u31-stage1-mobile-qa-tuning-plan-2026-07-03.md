# Unity U31 Stage1 Mobile QA Tuning Plan

## Scope

U31 records Stage1 QA readiness, Editor 390x844 QA evidence, measurement gaps, and a small first tuning pass. This is not production approval.

## Non-goals

- Do not set `productionApproved=1`.
- Do not treat unmeasured mobile values as measured.
- Do not introduce Addressables.
- Do not introduce Cloud Save.
- Do not paste generated final images, screenshots, or reference PNGs into Unity runtime.
- Do not finalize production SE.
- Do not finalize production economy or 8 minute balance.
- Do not redesign U23/U27 UI.

## Device Handling

If mobile device QA is available, record device name, OS, build type, FPS, memory, thermal, GC, draw calls, audio latency, and haptic behavior. If it is not available, record `NOT_MEASURED` and keep the QA environment as Unity Editor 390x844.

## Editor QA vs Mobile QA

Editor QA can verify scenario coverage, readability, generated evidence, save flow shape, and fallback safety. It cannot approve mobile FPS, memory, thermal state, draw calls, audio latency, or haptic intensity.

## Tuning Targets

- First 30 seconds spawn cadence and readability.
- Basic weapon response.
- Pickup reach and pickup feedback visibility.
- Opening and first pressure wave density.
- Audio repeated-event safety as QA record, not final SE approval.

## Not Tuned In U31

- Stage clear time.
- Kokuyou timing.
- Evolution timing.
- Reward economy final values.
- Sprite Atlas production packing.
- Addressables and Cloud Save.
- Production AudioMixer and final clips.

## U32 Handoff

U32 should handle production asset replacement, Sprite Atlas production packing, final visual polish, and comparison against current in-repo baselines.

## U33 Handoff

U33 should harden Stage1 balance using measured runs, including clear rate, first LevelUp timing distribution, reward pacing, defeat recovery, and rare / evolution / Kokuyou reachability.

## Expected U31 Verdict

- `productionApproved`: false
- QA environment: Unity Editor 390x844 unless real device data is added later.
- Mobile performance: `NOT_MEASURED`
- Haptic device behavior: `NOT_MEASURED`
