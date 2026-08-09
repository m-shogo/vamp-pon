# ヨルノシルベ TOP「生きている夜」候補 v1

Status: `HISTORICAL_CANDIDATE_BATCH / SUPERSEDED_BY_V2_V3`  
Current authority: `docs/design-targets/generated/top-living-night-v3/`  
Do not promote any v1 candidate directly to final/runtime approval.

Date: 2026-08-01  
Base: `main@9af0418418eece712a5ea6f170630c4ee8770086`  
Unity: `6000.5.1f1` / URP `17.5.0`

## 結論

AI動画を使わず、静止キービジュアルを複数の2Dレイヤーへ分解し、Unity側のShader Graph、Particle System、Animation Clip、Unity 6.5のSprite Renderer Shader User Valueで動かす。

狙いは「動くタイトル画面」ではなく、焚き火のように長く眺められる**生きている夜の居場所**。

## 4候補

| Candidate | Strong point | Risk | AI recommendation |
| --- | --- | --- | --- |
| A | 火→仲間→駅→月の視線、上下UI余白、レイヤー境界の総合バランス | 人物の個別identityは正式master比較が必要 | **1位** |
| B | 火の存在感と人物の一体感 | 火の密度がやや高く、常時動かすと騒がしくなりやすい | 3位 |
| C | 下部操作域が最も広い | 実寸では人物と火が少し小さく、下部が空きすぎる | 4位 |
| D | 煙・火・ロボットの動きが最も想像しやすい | 煙の縦軸が強く、ロゴと競合しやすい | 2位 |

推奨は`candidate-a`。これはAI推奨であり、人間承認ではない。

> Historical note: Candidate A later informed the V2 layer-kit composition and the V3 visual-recovery bridge. Its generic human identities are **not** approved Core5 final identities.

## Files

```txt
candidates/top-living-night-candidate-a.png
candidates/top-living-night-candidate-b.png
candidates/top-living-night-candidate-c.png
candidates/top-living-night-candidate-d.png
previews/top-living-night-candidate-*-390x844.png
previews/top-living-night-recommended-360x800.png
previews/top-living-night-recommended-390x844.png
previews/top-living-night-recommended-430x932.png
top-living-night-comparison.png
top-living-night-comparison-390x844.png
prompt.txt
manifest.json
motion-layer-plan.md
```

## Historical approval boundary

```txt
assetStatus=candidate
candidateCount=4
aiRecommendedCandidate=candidate-a
humanReviewStatus=pending
approvedAsFinal=false
runtimeApproved=false
runtimeConnected=false
finalApprovalBlocked=true
videoGenerationUsed=false
```

These flags describe the original v1 candidate batch only. Current approval is governed by V3 structured evidence and cannot be inherited from this directory.

このbatchは既存`top-final.png`を上書きしない。PR #76、U49 readiness、audio/haptic evidence、gameplay定数、runtime providerには触れない。

## Static QA

- 4/4 PNG、破損なし。
- 4/4 portrait、スマホ縦比率。
- 4/4 text / logo / UI焼き込みなしを目視確認。
- 4/4を390x844へsafe cropし比較。
- 推奨Aを360x800 / 390x844 / 430x932へsafe cropし、上部ロゴ域、下部操作域、主要人物、動物、ロボット、火が残ることを確認。
- Generator seedはbuilt-in toolから公開されないため記録なし。final承認はidentity master比較、layer再制作、Unity import、Simulator、実機、性能確認までblockする。

## Historical next production unit

当時の方針として、推奨Aをそのまま動画化せず`motion-layer-plan.md`に従って背景clean plate、人物群、火、煙、灯りmask、前景をstill-image editとdeterministic image processingで作ることを定義した。この工程はV2で実施済み。
