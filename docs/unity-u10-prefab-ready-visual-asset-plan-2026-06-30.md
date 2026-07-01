# Unity U10 Prefab-ready Visual Asset Plan

作成日: 2026-06-30

## Scope

U10はResult / StageSelect / 黒耀化 / rare / cut-inを正式実装直前のPrefab-ready proofへ近づけるためのcandidate passである。

正式Result実装、正式StageSelect実装、報酬ロジック、セーブ処理、Stage解放処理、黒耀化runtime、黒耀化ゲージ / ボタン、必殺cut-in runtime、Addressables導入、production approved昇格は行わない。

## Candidate List

| id | 用途 | runtime / design target | atlas group案 | owner予定 | greenback対象 | full-screen art扱い |
| --- | --- | --- | --- | --- | --- | --- |
| `result_continue_paper_button` | Result CTAの紙ボタン候補。TMPで「次へ」を重ねる | runtime proof-only | UI | `ResultContinueButton` / `PaperButton` | yes | no |
| `result_stats_ink_strip` | Result stats行の黒インク紙片背景候補。TMPで数値を重ねる | runtime proof-only | UI | `ResultStatsLine` | yes | no |
| `stageselect_route_active_node` | StageSelect route node active状態候補 | runtime proof-only | UI | `StageRouteNode` | yes | no |
| `stageselect_route_locked_node` | StageSelect route node locked / inactive状態候補 | runtime proof-only | UI | `StageRouteNode` | yes | no |
| `kokuyou_fullscreen_final_candidate_a` | 黒耀化full-screen / Collection候補A | runtime proof-only | FullscreenArt | `FullscreenArtAssetSet` future candidate | yes | yes |
| `kokuyou_fullscreen_final_candidate_b` | 黒耀化full-screen / Collection候補B | runtime proof-only | FullscreenArt | `FullscreenArtAssetSet` future candidate | yes | yes |
| `levelup_rare_memory_tear_burst` | LevelUp rare演出候補。通常VFXより特別、黒耀化より弱い | runtime proof-only | VFX | `LevelUpRareEffect` future candidate | yes | no |
| `cutin_black_ink_band_final_candidate` | 必殺 / 黒耀化cut-in用の横長band候補。TMPで文字を重ねる | runtime proof-only | Cutin | `CutinBand` future candidate | yes | no |

## Checks Before Use

- すべてsolid chroma key green背景で生成し、greenback to alphaを通す。
- すべてcandidateでありapprovedではない。
- `productionApprovedCount=0`を維持する。
- `textBakedRuntimeImage=false`を維持し、タイトル、説明文、数字、UIラベルを画像に焼き込まない。
- 画像内に文字、数字、ロゴ、透かしを入れない。
- `Resources/U10Candidates`へ入れる場合はproof-onlyとして扱い、本番Providerや正式画面から参照しない。
- 390x844 / 360x800 / 430x932でResult / StageSelect proofを確認する。
- 黒耀化 / rare / cut-in比較は390x844で確認する。
- Result / StageSelect正式実装ではないことをreview docで明記する。
- Route Aを基本方針として維持し、Route Bのglowは将来Animation候補として扱う。
