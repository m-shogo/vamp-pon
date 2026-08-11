# TOP Living Night V3 — Runtime Capture Human Review

Runtime look/motion captures from the real Unity `TopLivingNightView` (final-core5 composite + 6 semantic layers + 10 effect companions). **This pack is a human review aid, not approval.**

## Runtime evidence summary

- source commit: `c5eca594d5028cd7ab83cfe126b53c69e9d733a9`
- Unity: `6000.5.1f1`
- candidate SHA256: `f551047e635ff3860c6488a5be6a949252911fa8791d9ab241e2fca90ab8a71e`
- semantic layer pack SHA256: `3b8b92d531e8d83f7a38f79afbff028d82e592f8ef50f64c6984590cdf0eaa12`
- effect companion pack SHA256: `b95fccc24dbbd38891b486e34d7ca58993eed125cbfa5c3e2bee63ff6631a301`
- captures: 39/39 — result PASSED
- generated: `2026-08-11T06:50:59.694Z`

## Automated visual diagnostics

- total checks: 87, failed: 0
- all automated checks passed (no full-black frames, dimensions correct, Normal shows inter-frame motion, Reduced ≤ Normal motion).
- thresholds are intentionally loose; pixel diffs never grant aesthetic approval.

## Contact sheets

- `review/resolution-compare-normal.png`
- `review/resolution-compare-reduced.png`
- `review/normal-vs-reduced-360x800.png`
- `review/normal-vs-reduced-390x844.png`
- `review/normal-vs-reduced-430x932.png`
- `review/timeseries-360x800-normal.png`
- `review/timeseries-360x800-reduced.png`
- `review/timeseries-360x800-transition.png`
- `review/timeseries-390x844-normal.png`
- `review/timeseries-390x844-reduced.png`
- `review/timeseries-390x844-transition.png`
- `review/timeseries-430x932-normal.png`
- `review/timeseries-430x932-reduced.png`
- `review/timeseries-430x932-transition.png`
- `review/contact-sheet.png`

## Fire-effect before / after review aids

- `review/before-after-430x932-normal.png`
- `review/before-after-390x844-normal.png`
- `review/before-after-360x800-normal.png`
- `review/before-after-430x932-reduced.png`
- `review/before-after-390x844-reduced.png`
- `review/before-after-360x800-reduced.png`
- `review/before-after-fire-closeup.png`
- `review/before-after-smoke.png`
- `review/before-after-embers.png`
- `review/before-after-glow.png` (alpha x3 visualization; runtime asset is unchanged)

These comparisons use the pre-change `origin/main` runtime capture and the refreshed runtime capture at the same nominal frame. They are review aids only and do not promote human or runtime approval.

## Core5 human review checklist (PENDING human)

Foreground humans must be **exactly five**: Yui / Asa / Nagi / Michiru / Tomori.

- [ ] no sixth human
- [ ] no generic substitute
- [ ] no duplicate identity
- [ ] no identity merge
- [ ] all five individually identifiable
- [ ] face directions are not all identical
- [ ] expressions/postures are not monotonous
- [ ] white small animal present
- [ ] small round robot present
- [ ] fire position matches runtime effect
- [ ] smoke / embers follow the fire
- [ ] night sky is quiet but not monotonous
- [ ] stars / clouds do not move excessively
- [ ] title safe area preserved
- [ ] bottom button safe area preserved
- [ ] reads as a night place you want to come home to
- [ ] does NOT read as a loading screen / event poster

## Reduced Motion contract (PENDING human)

- [ ] geometry drift suppressed vs Normal
- [ ] smoke suppressed
- [ ] embers suppressed
- [ ] robot eye suppressed
- [ ] cloud / character parallax suppressed
- [ ] fire honours its Reduced Motion contract
- [ ] same-view Normal → Reduced → Normal transition looks correct (see transition time-series)

## Approval boundary

- `approvedAsFinal=false`, `runtimeApproved=false`, `finalApprovalBlocked=true` — unchanged.
- Capturing runtime look/motion is NOT approval. Human visual review and device evidence remain required.
