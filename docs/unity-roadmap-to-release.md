# Unity Roadmap to Release

目的: Unity移行開始から完成・配信準備までの全体ロードマップを固定する。

この文書は、U1開始後にCodex / Claude Code / Unity作業者が迷わないための長期進行表。

---

## Core Philosophy

Unity移行は、Web版を捨てる作業ではない。

```txt
Web/Phaser = 仕様・画面・体験の参照元
Unity = mobile app quality / game feel / VFX / production target
```

最初から全移植しない。

```txt
U1〜U3 = Unityが勝てるか検証
U4〜U6 = 縦スライスとして成立させる
U7 = 本格移行判断
U8以降 = production移行
```

---

## Global Rules

- repoは `/Users/m-shogo/Developer/personal/vamp-pon` のみ
- Unity projectは `unity/VampPonUnity/`
- Web/Phaser側srcはU1では原則触らない
- Unity本番素材はUnity用に作り直す
- AI素材はcandidateとして作り、QA後approvedだけimportする
- 390x844 mobile portraitを常に優先する
- `public/assets/sprites/` は使わない
- 文字入り画像をruntime UIに使わない
- 生成参照画像をそのままruntime画面に貼らない
- U1で全移植しない

---

## Phase U0: Pre-Migration Freeze

Status: Done.

Purpose:

- Web版の最新baselineを固定
- Unity移行docsを整理
- Git / repo / asset import方針を固定
- U1開始前の事故防止チェックを作る

Done when:

- `docs/unity-current-doc-index-2026-06-30.md` exists
- `docs/unity-pre-migration-hardening-checklist.md` exists
- `docs/unity-u1-agent-prompt.md` exists
- `.gitignore` / `.gitattributes` are ready

---

## Phase U1: Unity Project Skeleton

Purpose:

Unity projectが安全にrepo内で動き、390x844 mobile verticalで最低限表示できるか確認する。

Build:

- `unity/VampPonUnity/`
- Unity 6 LTS 2D URP
- `Boot.unity`
- `Stage1.unity`
- `Assets/_Project/` minimum structure
- MainCamera orthographic
- SafeAreaCanvas
- dark paper / night background
- Yui placeholder
- Ombu placeholder
- lantern glow
- EXP fragment pickup curve placeholder

Do not build:

- full battle
- full LevelUp
- Result
- StageSelect
- Collection
- Save
- all characters
- all enemies
- all items
- Addressables
- store build

Acceptance:

- Unity Editor can play
- Boot -> Stage1 works
- Game View 390x844 is readable
- SafeAreaCanvas works
- Yui / Ombu / lantern / EXP pickup are visible
- `git status --short` does not include generated Unity junk

---

## Phase U2: Minimum Battle Feel

Purpose:

Unityで戦闘の基本感触がWebより伸びそうか確認する。

Build:

- Yui movement
- keyboard fallback
- touch/virtual stick placeholder
- enemy spawn placeholder
- enemy chase
- auto attack placeholder
- damage / death
- EXP drop
- EXP pickup attraction
- minimal HUD
- simple object root separation

Acceptance:

- 30〜60秒動かして気持ち悪くない
- player / enemy / EXPのサイズ感が見える
- EXP吸引がWebより良くなる余地がある
- 敵と背景が同化しない
- basic pooling設計に進める

---

## Phase U3: Juice / VFX Proof

Purpose:

Unityへ行く最大理由である、光・黒インク・撃破・吸引・揺れの気持ちよさを確認する。

Build:

- hit stop
- camera impulse
- ink burst particle
- enemy death dissolve-ish effect placeholder
- EXP collect burst
- lantern glow tuning
- low HP edge pulse placeholder
- particle cap
- pooling for enemy / projectile / pickup / particles

Asset rule:

- VFX素材はUnity用にAI生成してよい
- approved textureだけUnityへimport
- 生成参照画像をそのまま貼らない

Acceptance:

- WebよりUnityの方が気持ちよくできる見込みがある
- 黒インクとランタン光が世界観を強めている
- 大量enemy/EXPでも破綻しない方向性が見える

---

## Phase U4: LevelUp UI Demo

Purpose:

Unity UIで紙カードUI・選択体験が安っぽくならないか検証する。

Build:

- TextMeshPro Japanese test
- PaperCard prefab
- PaperButton prefab
- IconFrame prefab
- LevelUpPanel
- 3-choice card UI
- owned row placeholder
- selected card feedback
- rare / awakening material gate placeholder

Do not build:

- all items
- all evolutions
- full save
- collection integration

Acceptance:

- 390x844で読める
- Safe Area内に収まる
- generic Unity UIに見えない
- 文字入り画像を使っていない
- paper UI部品化の方向性が見える

---

## Phase U5: Kokuyou / Ultimate Demo

Purpose:

黒耀化・必殺・カットインがUnityで売りになるか確認する。

Build:

- right bottom Kokuyou / ultimate button placeholder
- charge gauge
- activation overlay
- cutin band placeholder
- ink slash VFX
- lantern line / glow burst
- temporary power-up state
- end lag / after effect

Acceptance:

- 発動したくなる
- 黒インクが強いが読みにくくない
- 画面が派手でもplayer/enemy/EXPが読める
- 右下buttonがSafe Areaで押しやすい

---

## Phase U6: 30〜60 sec Vertical Slice

Purpose:

Unity版の短い1プレイ体験を作る。

Build:

- Boot -> Stage1
- 30〜60 sec battle
- at least 1 LevelUp
- at least 1 Kokuyou activation
- mini Result Clear
- restart loop
- minimal tuning config

Acceptance:

- 1 loopとして遊べる
- Web版よりアプリ感が出ている
- mobile portraitで破綻しない
- Unity移行判断に必要な材料が揃う

---

## Phase U7: Migration Decision Gate

Purpose:

Unity本格移行するか、Web継続するかを判断する。

Go Unity if:

- battle feel is clearly better than Web
- lantern / ink / EXP吸引がUnityで強くなっている
- 390x844で視認性が維持できる
- UIがgeneric Unity UIに見えない
- repoが汚れない
- asset workflowが成立する
- implementation speed is acceptable

Stop or pause Unity if:

- Webより気持ちよくならない
- UIが安っぽい
- mobile vertical readabilityが悪い
- asset importが重すぎる
- repoが壊れやすい
- Web作業を邪魔する

Stopping is not failure.
It becomes a valid Web/Phaser continuation decision.

---

## Phase U8: Production Architecture

Purpose:

Unity本格化する場合、production用の構造へ移す。

Build:

- proper assembly definitions
- ScriptableObject data structure
- GameFeelConfig
- StageDefinition
- EnemyDefinition
- WeaponDefinition
- PassiveDefinition
- RareItemDefinition
- EvolutionDefinition
- CharacterDefinition
- SaveData model
- runtime state separation
- basic tests

Asset:

- approved Unity runtime assets only
- candidate assets remain outside Unity runtime folder
- consider LFS before large binary import

Acceptance:

- data-driven battle tuning starts
- no hardcoded item/enemy sprawl
- editor workflow is manageable

---

## Phase U9: Stage1 Full Vertical Slice

Purpose:

Stage1をUnityでMVP品質にする。

Build:

- 8-minute or shortened equivalent run mode
- enemy waves
- weapons
- passives
- rare items
- evolution/fusion gate
- LevelUp UI
- Kokuyou
- Result Clear/Fail
- basic meta reward
- QA/debug panel

Acceptance:

- Stage1 can be played start to finish
- performance is acceptable
- LevelUp candidate rules work
- `dawn_ticket` is not normal candidate
- `awakening_material` gate works
- Result feels rewarding

---

## Phase U10: Meta Progression MVP

Purpose:

遊び続ける理由を作る。

Build:

- permanent upgrade screen
- memory fragments currency
- character level or affinity placeholder
- resettable stat upgrades
- local save
- run history minimal
- reward balancing

Acceptance:

- losing still feels useful
- repeated play strengthens player
- hard mode path can be imagined

---

## Phase U11: Collection / Archive MVP

Purpose:

世界観と収集要素をUnityへ移す。

Build:

- Collection / memory archive UI
- item/enemy/stage unlock display
- new unlock glow
- simple filter
- safe Japanese text layout

Acceptance:

- archive feels like memory/world expansion
- text readable on 390x844
- no giant static screenshots

---

## Phase U12: Stage Select / Difficulty

Purpose:

stage progressionを成立させる。

Build:

- Stage Select
- Easy / Normal / Hard
- unlock rules
- reward multiplier
- stage detail panel
- difficulty warning

Acceptance:

- player knows what to do next
- hard mode is aspirational
- UI stays readable

---

## Phase U13: Content Expansion Pack 1

Purpose:

MVPに必要な量を増やす。

Build target:

- 1〜2 playable characters
- 5 weapons
- 5 passives
- 2 rare items
- 5 enemies
- 1 boss
- 1 stage
- 1〜2 cutins
- 1 result loop

Asset:

- Unity-specific approved assets only
- AI generation allowed through candidate -> QA -> approved

Acceptance:

- content is enough for first private test
- no placeholder that blocks fun judgment

---

## Phase U14: Mobile Device Test

Purpose:

iOS/Android実機相当で成立するか確認する。

Build:

- mobile build settings
- orientation lock
- safe area tests
- touch input
- performance profiling
- memory/texture budget pass
- battery/thermal rough check

Acceptance:

- real-device vertical play is acceptable
- FPS is stable enough
- touch input feels fine
- UI is readable

---

## Phase U15: Polish Pass

Purpose:

売り物っぽくする。

Build:

- transitions
- audio hooks
- collect SE
- hit SE
- result fanfare
- better VFX timing
- UI animation polish
- title/stage/result polish
- haptics if needed

Acceptance:

- first 60 seconds feel fun
- LevelUp feels good
- Result feels rewarding
- screenshots look acceptable

---

## Phase U16: Private Test Build

Purpose:

身内テストできる状態にする。

Build:

- debug off mode
- basic tutorial hints
- crash/log check
- known issue list
- feedback form or checklist
- build archive

Acceptance:

- someone else can play without explanation
- feedback can be collected
- must-fix issues are visible

---

## Phase U17: Store Readiness Prep

Purpose:

配信準備へ向かう。

Build:

- app name decision
- icon direction
- screenshots
- short description
- privacy policy path
- analytics decision
- monetization decision
- platform target decision

Acceptance:

- app identity is clear
- store blockers are listed
- release risks are known

---

## Phase U18: Release Candidate

Purpose:

初回公開候補。

Build:

- no critical bugs
- save migration safe enough
- performance acceptable
- content minimum met
- tutorial/onboarding acceptable
- legal/store assets prepared

Acceptance:

- RC build can be submitted or shared externally

---

## Immediate Next Step

Start U1.

Use:

```txt
docs/unity-u1-agent-prompt.md
```

But first, confirm Unity Hub editor patch.

---

## Do not skip

Do not skip U1〜U3.

If U1〜U3 are weak, full migration will only make a weaker Unity version.

The real decision is not whether Unity is famous.
The decision is whether Unity makes this game feel better.
