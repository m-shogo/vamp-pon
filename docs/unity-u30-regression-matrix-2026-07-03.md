# Unity U30 Regression Matrix

## Required Checks

| Area | Command | Purpose |
| --- | --- | --- |
| U30 approval gate | `pnpm unity:u30-production-approval-gate:check` | Verify U30 docs, models, artifacts, and approval false state. |
| U29 performance / mobile FPS | `pnpm unity:u29-performance-mobile-fps:check` | Keep performance budget and mobile unknowns intact. |
| U28 SE / haptic | `pnpm unity:u28-se-haptic-feel:check` | Keep feel routing proof intact. |
| U27 save / reward / unlock | `pnpm unity:u27-save-reward-unlock:check` | Keep save and reward proof intact. |
| U26 first playable balance | `pnpm unity:u26-stage1-first-playable-balance:check` | Keep balance draft proof intact. |
| U25 battle loop | `pnpm unity:u25-stage1-production-battle-loop:check` | Keep Stage1 loop proof intact. |
| U24 climax polish | `pnpm unity:u24-climax-polish:check` | Keep rare / evolution / Kokuyou proof intact. |
| U23 UI polish | `pnpm unity:u23-ui-visual-polish:check` | Keep non-battle UI proof intact. |
| U22 battle visual polish | `pnpm unity:u22-battle-visual-polish:check` | Keep battle visual proof intact. |
| Unity meta | `pnpm unity:meta:check` | Verify meta GUID health. |

## Unity Editor Verification

The U30 suite should be paired with U22-U30 Editor verification methods when Unity is available. U30 adds:

- `VampPon.UnitySpike.Editor.U30ProductionApprovalGateScreenshotCapture.Run`
- `VampPon.UnitySpike.Editor.U30ProductionApprovalGateVerification.Run`

## Regression Rule

U30 must not convert U29 unknowns into a pass. The regression suite is valid only when production approval remains false until critical blockers are resolved.
