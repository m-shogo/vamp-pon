# Unity U30 Production Approval Gate Plan

## Scope

U30 adds a production approval gate for the Stage1 vertical slice. This gate judges the current U25-U29 state without forcing approval.

## Non-goals

- Do not set `productionApproved=1` unless all critical gate conditions are satisfied.
- Do not introduce Addressables.
- Do not introduce Cloud Save.
- Do not paste generated final PNGs, screenshots, or completed screen images into Unity runtime.
- Do not claim mobile FPS, memory, thermal, draw call, audio latency, or haptic behavior without real device evidence.

## Inputs

- U25 Stage1 production battle loop runtime and proof.
- U26 first playable balance draft.
- U27 save / reward / unlock integration.
- U28 SE / haptic feel integration.
- U29 Sprite Atlas policy, performance budget, runtime caps, and mobile checklist.

## Gate Outputs

- Approval state model and policy under `unity/VampPonUnity/Assets/_Project/Scripts/U30/ApprovalGate/`.
- Editor verification and generated evidence under `docs/design-targets/generated/unity-u30/`.
- Human-readable approval, verdict, regression, handoff, and review documents.
- `pnpm unity:u30-production-approval-gate:check`.

## Production Approval Rule

The gate keeps production approval false when any critical production dependency is missing. Current known critical blockers are mobile device verification and production Sprite Atlas packing evidence.

## Current Expected Verdict

- `productionApproved`: false
- internal preview readiness: true
- mobile QA readiness: true
- asset replacement readiness: false
- production performance approval: false

## Verification Plan

- Generate U30 screenshots and JSON evidence.
- Run U30 Editor verification.
- Run U30 quality checker.
- Re-run U22-U29 quality checkers and Unity meta checker.
- Run `git diff --check`.
