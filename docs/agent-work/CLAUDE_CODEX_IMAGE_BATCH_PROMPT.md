# Claude → Codex Image Batch — Ready-to-run prompt

Use this prompt from the local Mac. Repository scope is strictly `m-shogo/vamp-pon` only.

```text
あなたは /Users/m-shogo/Developer/personal/vamp-pon の画像制作ディレクターです。
他repo・他projectには絶対に触れないでください。

目的:
現在のUnity visual runtime/UI実装は画像生成前の区切りまで進んでいる。
ここからは、ダサさの原因になっている仮素材/候補素材を、Codexの画像生成機能を使ってproduction candidateへ順番に置き換える。
画像案だけ出して終わらず、生成ファイルをrepoへ保存し、既に用意済みのruntime受け口へ安全に接続し、検査・commitまで進める。

最重要:
- Claude自身が全実装を抱え込まない。Claudeはdirector/reviewer、Codexをproduction workerとして使う。
- 巨大な過去履歴をCodexへ渡さない。Gitの正本を読ませる。
- 1 queue itemずつ完結させる。生成→保存→検査→安全ならruntime接続→commit→次項目。
- 画像を単なるフルスクリーン1枚に焼いて終わらせない。独立motion/light/depthが必要な画面はsemantic layer/maskを作る。
- native text、数値、ボタン、ゲーム状態を画像へ焼き込まない。
- AIっぽい過装飾、generic fantasy、素材ごとの画風ブレを避ける。
- current final/runtime/device evidenceを実行せずPASSへ変更しない。
- PR #78はDraft維持。merge/Ready化禁止。
- PR #76、U49 readiness、physical-device flags、gameplay、balance、save schema、unrelated canonは変更禁止。

最初に現在のgit status / branch / HEADを確認する。
並列AIの変更がある前提で、古いSHAを信用しない。

最小読込:
1. AGENTS.md
2. docs/agent-work/CURRENT_VISUAL_GOAL.md
3. docs/visual-production-system.md
4. docs/agent-work/visual-asset-generation-queue.json
5. docs/agent-work/claude-to-codex-image-batch-handoff.md

各queue itemでは、そのitemが参照するcontract/referenceだけ追加で読む。
全docsを一括投入しない。

実行順:
1. ART-P0-TOP-CORE5-V3
2. ART-P1-STAGESELECT-MAP
3. ART-P1-RESULT-MEMORY-REWARD
4. ART-P1-COLLECTION-MATERIAL
5. ART-P2-LEVELUP-CARDS
6. ART-P2-BATTLE-HUD-MATERIAL
7. ART-P2-RARE-STATE-VFX
8. ART-P2-BATTLE-ENVIRONMENT-BANDS は既存Battle readabilityを確認して、必要なstageだけ

Loadingは四季4枚が既にあるため、今回の一括再生成対象にしない。
Settings/FirstRunも画像よりlayout/clarity優先なので生成しない。

TOPは特別扱い:
- exactly 5 foreground humans: Yui / Asa / Nagi / Michiru / Tomori
- sixth human / generic human / duplicate / identity mergeは禁止
- white small animal + small round robotを残す
- deep indigo/navy/black ink + restrained amber
- quiet night station / rail / distant town / campfire / long journey / memory
- 明るい集合写真、festival、swimsuit、fireworksは禁止
- 430x932 canonical master
- top 18–22%はlogo-safe sky
- bottom 20–22%はdark UI-safe ground
- Yui/Asaはスマホでも顔が即読める
- current V2 bridge humansをidentity referenceに使わない
- locked Core5 referencesを使う

TOPでは必ず追加で読む:
- docs/design-targets/generated/top-living-night-v3/layered-final-production-contract.md
- docs/design-targets/generated/top-living-night-v3/final-effect-companion-brief.md
- docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json

TOP deliverables:
canonical:
- top-living-night-core5-candidate-430x932.png

structural layers:
- 00-environment-base.png
- 04-distant-town.png
- 06-core5.png
- 07-animal-robot.png
- 09-fire-base.png
- 15-foreground-accents.png

effect companions:
- 01-stars.png
- 02-clouds-far.png
- 03-clouds-near.png
- 05-distant-lights-mask.png
- 08-robot-eye-mask.png
- 10-fire-flipbook-atlas.png
- 11-fire-glow-mask.png
- 12-smoke-atlas.png
- 13-embers-atlas.png
- 14-lantern-glow-mask.png

全TOP素材は同じlocked composition/material languageから作る。
360x800 / 390x844は430x932 masterから派生させ、別々に再生成しない。

Codexへは毎回、次程度の短い指示で渡す:
「AGENTS.md、CURRENT_VISUAL_GOAL.md、visual-production-system.md、visual-asset-generation-queue.json を読み、current HEADで最優先の READY_FOR_BATCH_GENERATION itemを1つ処理。item固有contract/referenceだけ追加読込。image generationで必要assetを生成し指定incoming pathへ保存、寸法/alpha/整合性を検証。既存runtime landing pathが定義済みなら安全に接続。関連checkを実行してcommit。未実行evidenceを昇格しない。他repo禁止。」

Claude review基準:
- phone-sizeで第一印象が読めるか
- AI生成特有の余計な装飾や意味不明ディテールがないか
- 同一asset familyの素材感/線/光が統一されているか
- TOP Core5 identityが正しいか
- transparent edgeにhalo/汚れがないか
- baked textがないか
- gameplay UIでは視認性を邪魔していないか
- semantic layerを再合成した時にcanonical compositeへ自然に戻るか

候補が弱ければ、最初の出力を無理に採用しない。
同じtask内で原因を具体化して再生成/編集する。
「それっぽい」ではなく、現在のruntime/UIへ入れた時にプロ品質になるまで詰める。

各item完了時:
- visual-asset-generation-queue.json のstatus/pathを更新
- 生成物pathを記録
- 実行したcheckだけ結果を記録
- coherent commitを作る
- CIが走るなら確認し、失敗は修正
- 次itemへ進む

最終報告は短く:
- 完了したqueue item
- 生成/接続したasset path
- commit SHA
- 実行済みchecks
- 未完了item / visual blocker

長いプロジェクト史の再説明は不要。
```

The machine-readable queue remains the authority. If this prompt and the queue differ, follow the current queue and task-specific production contract.
