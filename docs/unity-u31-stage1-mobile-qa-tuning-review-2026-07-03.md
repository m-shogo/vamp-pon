# Unity U31 Stage1 Mobile QA Tuning Review

## 変更概要

U31ではStage1 mobile QA向けのscenario、QA session model、Editor 390x844 evidence、measurement JSON、U30 gate addendum、first-pass tuningを追加した。production approvalではない。

## QA環境

Unity Editor 390x844 batchmode evidence。実機確認は未実施で、mobile metricsは`NOT_MEASURED`。

## QA Scenario結果

20 scenarioを定義し、Editorで確認できるものはPASSまたはCAUTION、実機やrestartが必要なものはNOT_MEASUREDとして記録した。

## First 30 Seconds Tuning

pickup radiusを1.65から1.75、basic weapon cooldownを950msから900ms、opening wave intervalを2.8から2.6、opening max enemiesを6から7、first pressure intervalを2.2から2.1、first pressure max enemiesを11から12にした。Stage clear、first LevelUp target、Kokuyou timing、Evolution timingは変更していない。

## Mid Wave / Climax Tuning

Mid wave以降のcap、Kokuyou ready、Evolution到達、Rare chance、effect cap、audio polyphonyは変更していない。U29 performance guardを維持した。

## UI Readability Tuning

UI redesignは行っていない。U31 screenshotsで390x844のQA evidenceを追加した。

## Audio / Haptic Tuning

U28 / U29のroutingとcooldown / capを維持した。final SE、AudioMixer、audio latency、haptic device behaviorは未承認。

## Save / Retry / Persistence QA

U27 save / reward / unlock / retry proofを維持した。restart後のpersistenceはU31 Editor batchmodeではNOT_MEASURED。

## QA Findings

- Mobile performance metrics: NOT_MEASURED.
- Haptic device behavior: NOT_MEASURED.
- Save restart persistence: NOT_MEASURED.
- Sprite Atlas production packing: BLOCKER.
- Reward economy: CAUTION.
- Final SE: CAUTION.

## Blocker一覧

- Production Sprite Atlas packing evidence incomplete.
- Mobile performance evidence not measured.

## Caution一覧

- Reward economy not final.
- Final SE not approved.
- Device haptic not measured.
- Save restart persistence not measured.
- First-pass tuning requires measured play data.

## Not Measured一覧

FPS, memory, thermal, GC allocation, draw calls, audio latency, haptic device behavior, restart persistence.

## U30 Gate Addendum

U31 does not reduce U30 blockers. `productionApproved` remains false, while internal preview and mobile QA preparation remain ready.

## Boundary

Generated QA evidence remains under `docs/design-targets/generated/unity-u31/`. Generated final images are not pasted into runtime. Addressables and Cloud Save are not introduced. Production SE and production balance are not finalized.

## 実行したcheck一覧

- Unity U31 screenshot capture.
- Unity U31 verification.
- `pnpm unity:u31-stage1-mobile-qa:check`.
- U22-U30 regression checks.
- `pnpm unity:meta:check`.
- `git diff --check`.

## 残リスク

実機FPS、memory、thermal、draw call、GC、audio latency、haptic、restart persistence、Sprite Atlas production packing、final asset replacement、balance hardening。

## 次に残る作業

- U32 production asset replacement / final polish pass.
- U33 Stage1 balance hardening.
- U34 release candidate checklist.
