# ヨルノシルベ1 Unlock / Learning Progression Source v1

## Status / Authority

- Scope: **Stage1-20**
- Learning source: `src/game/data/title1UnlockLearningProgressionSource.ts`
- Unlock resolution: `src/game/data/title1UnlockResolutionSource.ts`
- Authority: **CONTENT_SOURCE_ONLY**
- Existing Unity Save / Reward / Unlock runtimeをこの資料だけで置換しない。
- Candidate revealは「runtimeで所持済み」を意味しない。
- 文章を読まないPlayerにもGameplay powerを与える。
- Future15 / Title2をTitle1 clear条件へしない。

## 目的

14属性、16Status、12Reaction、24 Base Weapon family計画を最初から一覧で渡さない。

PlayerがStageを進むほど、

1. 新しい言葉を一つ覚える
2. 既に知っている属性と接続する
3. 新しいattack shapeで同じ知識を使い直す
4. Status counter / Item / Reactionで好きなCharacterを救う
5. 最後は自分で2Reaction前後を選ぶ

という学習曲線にする。

Metaの目的は「毎日ログインさせる」ではなく、**次のrunで違う遊び方を試したくすること**。
Night Recordや文章の未読をpower条件にしない。

## Learning phases

### FOUNDATION — Stage1-4

Stage1:
- MEMORY / LIGHT
- MARKED / ECLIPSED
- Reactionという概念だけ
- recipe暗記なし

Stage2:
- WIND
- DISORIENTED
- route / push
- Selected Candidate `bellows_fan` を次run候補へ

Stage3:
- ICE / BLANK
- CHILL / SEALED
- 最初の具体Reaction `rewrite`

Stage4:
- STAR
- ILLUMINATED
- `beacon`
- Selected Candidate `star_map_pin`

最初の4StageでReactionは2つまで。
14属性表を初回Resultへ出さない。

### EXPANSION — Stage5-9

Stage5:
- FIRE / METAL
- BURN
- `ember_spread`
- `wick_needle`

Stage6:
- EARTH
- EXPOSED
- `foundation_break`
- `boundary_chalk`

Stage7:
- BLOOM
- status distribution
- `ember_matchcase`

Stage8:
- ROOTED
- trap/supportの価値
- `pressed_flower_cards`

Stage9:
- 新属性なし
- EARTH/STARを別attack shapeで復習
- `pavement_hammer`
- `return_compass_needle`

毎Stageに新属性を足さず、復習Stageを意図的に置く。

### COUNTERPLAY — Stage10-14

Stage10:
- WATER
- SOAK / FREEZE
- `regrowth`
- `frost_bind`
- `rain_thread`

Stage11:
- THUNDER
- SHOCK / CONDUCTIVE / DROWSY
- `arc_chain`
- `copper_tuning_fork`

Stage12:
- 新語彙なし
- LIGHT/STARをreflect/観察へ変換
- `pocket_mirror`

Stage13:
- ERASED
- utility枠と短cycle build
- `white_eraser`

Stage14:
- `metal_overload`
- Stage11で保留したTHUNDERの第二用途を解禁

新属性を出した直後に複数recipeへ分岐させず、一度使ってから用途を増やす。

### SHADOW MASTERY — Stage15-18

Stage15:
- DREAM
- SLEEP
- `lucid_recall`
- `dream_alarm`
- `sleep_ribbon`

Stage16:
- DARK
- `eclipse_break`
- `nightmare`
- `black_folding_fan`

**14属性はStage16で出揃う。**

ここで初めて全属性Vocabularyは揃うが、相性表の閲覧は任意。
DARKを悪として紹介せず、LIGHT+DARKの協力Reactionを同じStageで見せる。

Stage17:
- 新規Systemなし
- MEMORY / BLANK / ERASEDの意味を再検証

Stage18:
- `thermal_crack`
- FIRE / ICEの対立属性でもReactionでは協力できる

**12ReactionはStage18で出揃う。**

未発見recipeのシルエットを大量に並べ、作業回収を煽らない。

### DAWN MASTERY — Stage19-20

Stage19:
- 新属性/新Reactionなし
- `repair_thread_spool`
- build候補を「保留する」comfortを学ぶ

Stage20:
- 新しい基礎ルールを出さない
- Attribute matchup
- Status counter
- Weapon shape
- Item rescue
- Reaction

を組み合わせる総合面。

Title1のHappy Endに:
- 14属性全使用
- 12Reaction全発動
- 全Candidate取得
- 全Night Record読了
- Challenge 100%

を要求しない。

## Selected16 Candidate reveal

Title1 Base Weapon選定の**Selected16**はStage2-19へ分散して「次runで試す候補」として全て一度は提示する。

ただしCandidate revealは:

- runtime実装済み
- inventory所持済み
- Production Ready

を意味しない。

`candidateRevealMeansRuntimeOwned = false`

を固定する。

## Hold4 resolution

Base Weapon SelectionでHoldした4本:

- `frost_window`
- `repair_spanner`
- `name_reel`
- `morning_dew_dropper`

はCandidate reservoirに残す。

一方、Stage Campaign原本を先に作った時点では:

- Stage2 → `name_reel`
- Stage3 → `frost_window`
- Stage5 → `repair_spanner`

がcampaign unlock候補として書かれていた。

この履歴を無言で消さず、`title1UnlockResolutionSource.ts` で

`DEFERRED_HELD_CANDIDATE`

として明示的に解決する。

つまり:

- Candidate設定自体は残る
- Title1 Selected16には入らない
- Gameplay accessとして解禁しない
- 後のmobile readability / pathing / return-family検証後に再評価可能

とする。

`morning_dew_dropper` は元からStage unlockに入っていないため、同じHold reservoirに留まる。

このResolution SourceをTitle1のunlock access判断でStage Campaign seedより後段のAuthorityとして扱う。

## Fail-forward hint

失敗時に:

> 属性が間違いです

だけを表示しない。

各Stageは一つの具体的な改善候補を返す。

例:
- ECLIPSED → 回復/認識支援が落ちた
- ROOTED + charger → Status短縮 / push / Break
- long stack + ERASED → short-cycle Reaction
- projectile pressure → reflect
- Stage16 DARK friction → Item / Fusion / WIND route

Character変更だけを唯一解にしない。

## Cognitive overload guard

禁止:
- Stage1で14属性一覧
- 初回Resultで16Status一覧
- 未学習Reactionの大量シルエット
- Weapon Candidateを一度に10本提示
- frame dataをtutorial本文へ表示
- 読むまで次Stageへ行けないNight Record
- tutorial知識をcurrencyで購入

`currencyRequiredForKnowledgeUnlock = false`

を固定する。

currencyはBuild access / comfortへ使えるが、基本ルールの説明を買わせない。

## Night Record / reading boundary

Night Recordは豊富でよい。

しかし:

- 未読でもpower取得
- 未読でもStage進行
- 未読でもHappy End

を守る。

読むPlayerは世界・人物・黒耀化・観測不一致を深掘りできる。
読まないPlayerはResultの短いGameplay lessonだけで次runへ進める。

## Runtime boundary

このSourceは学習順序とunlock resolutionのContent Authority。

実runtimeへ入れる時は別途:

1. actual unlock state schema
2. save migration
3. duplicate reward guard
4. Result UI copy
5. first-run / returning-player migration
6. Candidate runtime implementation readiness
7. playtest

が必要。

CONTENT_SOURCE_ONLYから自動promotionしない。
