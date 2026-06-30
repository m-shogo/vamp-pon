# Unity U8 Visual Candidate Expansion Plan

作成日: 2026-06-30

## Scope

U8では、Result、StageSelect、LevelUp rare、黒耀化 / cut-in 向けの候補素材を最大12点追加する。すべて候補扱いで、production approved にはしない。Unity runtime への配置は proof-only の `Resources/U8Candidates/` に限定し、Addressables、正式Provider登録、正式画面実装、TMP以外のテキスト焼き込みは行わない。

## Source Rules

- タイトル表記は `ヨルノシルベ`、用語は `黒耀化` を維持する。
- 生成は solid chroma key green 背景で行い、`pnpm greenback:alpha` で透明化する。
- 画像内に文字、ロゴ、透かし、UI完成画面、説明文を焼き込まない。
- 夜、記憶、黒いインク、温かい灯り、紙の手触りを基調にする。
- cyber、glossy、rainbow、強すぎるネオン、旧 `public/assets/sprites/` は使わない。
- Unity配置後も `productionStatus: "candidate"` として扱う。

## Candidate List

| id | category | screen | runtime path | atlas group |
| --- | --- | --- | --- | --- |
| result_paper_ledger_panel | Result | Result proof | `unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/UI/result_paper_ledger_panel.png` | UI |
| result_rank_wax_seal | Result | Result proof | `unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/UI/result_rank_wax_seal.png` | UI |
| result_reward_memory_card | Result | Result proof | `unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/UI/result_reward_memory_card.png` | UI |
| result_new_badge | Result | Result proof | `unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/UI/result_new_badge.png` | UI |
| stageselect_paper_map_base | StageSelect | StageSelect proof | `unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/UI/stageselect_paper_map_base.png` | UI |
| stageselect_route_node | StageSelect | StageSelect proof | `unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/UI/stageselect_route_node.png` | UI |
| stageselect_route_line_ink | StageSelect | StageSelect proof | `unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/UI/stageselect_route_line_ink.png` | UI |
| stageselect_start_marker_lantern | StageSelect | StageSelect proof | `unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/UI/stageselect_start_marker_lantern.png` | UI |
| levelup_rare_ink_flare | LevelUp rare | LevelUp proof | `unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/VFX/levelup_rare_ink_flare.png` | VFX |
| levelup_rare_lantern_pulse_ring | LevelUp rare | LevelUp proof | `unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/VFX/levelup_rare_lantern_pulse_ring.png` | VFX |
| kokuyou_fullscreen_ink_shadow_source | 黒耀化 / cut-in | Fullscreen proof | `unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/FullscreenArt/kokuyou_fullscreen_ink_shadow_source.png` | FullscreenArt |
| cutin_black_ink_band | 黒耀化 / cut-in | Cut-in proof | `unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/FullscreenArt/cutin_black_ink_band.png` | FullscreenArt |

## Verification Plan

1. Generate greenback PNGs under `docs/design-targets/generated/unity-u8/greenback/`.
2. Convert them to transparent PNGs under `docs/design-targets/generated/unity-u8/alpha/`.
3. Store alpha QA output in `docs/design-targets/generated/unity-u8/reports/`.
4. Copy transparent PNGs into proof-only `Resources/U8Candidates/`.
5. Write `u8-visual-candidate-manifest.json` and add `pnpm unity:u8-asset-intake:check`.
6. Apply Unity import settings, capture proof screenshots at 390x844, 360x800, and 430x932, and run existing U7.1 / U5 / U4 verification.
7. Write the U8 review document with adoption, fix, and reject recommendations for human review.
