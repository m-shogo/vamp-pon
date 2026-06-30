# Unity U1.2 Screenshot Review

Date: 2026-06-30

## Summary

U1.1でEditor検証済みのUnity skeletonについて、Stage1 PlayMode相当の画面証跡を6種類のスマホ縦解像度で取得した。U1.2では新機能を追加せず、スクリーンショット取得と目視レビューに必要な最小修正のみ行った。

判定: U2 Battle Feelへ進んでよい。

## Environment

- Unity Editor: 6000.5.1f1
- ProjectVersion.txt:
  - `m_EditorVersion: 6000.5.1f1`
  - `m_EditorVersionWithRevision: 6000.5.1f1 (0d9463e84828)`
- Render Pipeline: 2D URP
- URP Asset: `Assets/_Project/Settings/U1UniversalRenderPipelineAsset.asset`
- 2D Renderer Data: `Assets/_Project/Settings/U1Renderer2DData.asset`
- Capture method: Unity Editor batchmode PlayMode + profile-sized RenderTexture capture

## Screenshots

保存先: `docs/design-targets/generated/unity-u1-2/`

| Resolution | File | Result |
| --- | --- | --- |
| 390x844 | `unity-u1-stage1-390x844.png` | OK |
| 375x812 | `unity-u1-stage1-375x812.png` | OK |
| 393x852 | `unity-u1-stage1-393x852.png` | OK |
| 430x932 | `unity-u1-stage1-430x932.png` | OK |
| 360x800 | `unity-u1-stage1-360x800.png` | OK |
| 412x915 | `unity-u1-stage1-412x915.png` | OK |

## Per-Resolution Review

| Resolution | Safe Area / HUD | Background Cover | Placeholder Visibility |
| --- | --- | --- | --- |
| 390x844 | Top HUD and bottom HUD stay inside the captured portrait frame. | No black bars; dark paper/night background covers the frame. | Yui, Ombu, lantern glow, and EXP fragment are visible. |
| 375x812 | Important HUD remains inside the visible area. | No black bars. | All U1 placeholders are visible. |
| 393x852 | Important HUD remains inside the visible area. | No black bars. | All U1 placeholders are visible. |
| 430x932 | Wider/taller portrait still keeps HUD readable. | No black bars. | All U1 placeholders are visible; spacing has enough room for U2 battle feel. |
| 360x800 | Narrow portrait keeps HUD readable. | No black bars. | All U1 placeholders are visible, though the bottom HUD feels close to the lower edge. |
| 412x915 | Important HUD remains inside the visible area. | No black bars. | All U1 placeholders are visible. |

## Safe Area Notes

- `SafeAreaCanvas` is present and used for the HUD.
- The current batch capture environment reports a plain rectangular screen, so physical notch/gesture inset behavior still needs a hands-on Editor Game View or device pass.
- Top and bottom HUDs are within the portrait frame across all six U1.2 baseline resolutions.

## Background Cover Notes

- The dark paper/night placeholder covers all six portrait captures without black bars.
- Lantern glow remains visible near the upper-right area.
- U2 should keep validating cover behavior after gameplay camera movement or screen shake is added.

## Placeholder Notes

- Yui placeholder is readable at all six resolutions.
- Ombu placeholder is now visually separated from Yui. The U1.1 setup attached its wobble component before final position assignment, which made Ombu drift around the origin and overlap Yui in screenshots; U1.2 fixes that initialization order.
- EXP fragment pickup curve is visible in the captured frames.
- Bottom HUD text was changed to ASCII `weapon placeholder` because default TMP Essentials / LiberationSans does not cover Japanese glyphs. Production UI still needs a Japanese-capable TMP font asset.

## Fixes Before U2

No blocker before U2 Battle Feel.

Recommended before or during U2:

- Add a Japanese-capable TMP font asset before production UI copy is restored.
- Replace procedural placeholders with approved Unity-targeted assets after the candidate -> QA -> approved -> Unity import flow.
- Re-check Safe Area with actual device presets or device builds once battle UI density increases.
- Re-check background cover after camera movement, hit stop, shake, and enemy count changes are introduced.

## U2 Go / No-Go

Go.

U1.2 evidence shows that the Unity skeleton can display the Stage1 proof surface across the required portrait baselines, with SafeAreaCanvas HUD, covering background, Yui/Ombu placeholders, lantern glow, and EXP pickup placeholder visible.
