# ヨルノシルベ Game Design Coverage Hub

Date: 2026-07-29  
Status: **CURRENT DESIGN COVERAGE / GAP MAP**  
Purpose: 「設計がある」と「設計が完成している」を混同しないための一覧。数値や内容を早く固定するためのルールブックではない。

> `docs/game-core-book-v1.md` は「このゲームは何を面白くするか」の最上位設計書。  
> このファイルは、そのCoreを実際のゲームへ落とすために必要な設計領域が揃っているかを確認するCoverage Map。

---

# 1. 判定ラベル

| Status | 意味 |
| --- | --- |
| **CURRENT** | Current masterがあり、通常設計で参照できる |
| **PARTIAL** | 有効な設計 / Current masterはあるが、対象scope全体には重要な穴が残る |
| **PROPOSED** | 良い設計案はあるが、まだCurrent方針として扱わない |
| **IMPLEMENTED-NOT-DESIGN-MASTER** | runtime実装/証跡はあるが、プレイヤー体験の設計正本としては不足 |
| **OPEN** | まだ設計が必要。未決定であること自体を明示する |
| **LATER** | 現在のCore完成には不要。後工程でよい |

「OPEN = 悪い」ではない。Playtest前に数値を固定しない方がよい領域もある。

---

# 2. 現在のCoverage

| Domain | Status | Current / existing source | 監査結果 |
| --- | --- | --- | --- |
| Game identity / core promise | **CURRENT** | `game-core-book-v1.md` | Run / Meta / Attachmentの3 loop、Gameplay-firstが明確 |
| Character | **CURRENT** | `CHARACTERS.md`, `character-book-v4.md`, `character-deep-core-book-v1.md`, `CHARACTER-STORY-INTEGRATION.md` | Current21は人物像・声・関係・黒耀化・Gameplay payoff・Dawn proofまで21/21 routing済み。Future15は別reservoirで15/15、Currentへ未昇格 |
| Story / Mystery | **CURRENT** | `STORY.md`, `story-book-v1.md`, `story-main-beat-sheet-v1.md`, `STORY-ENGINE.md` | Main / Character Mystery分離、Happy End、C/B/A mystery debt、Stage1〜5 beat directionあり。Main Mystery最終回答は未LOCK |
| Bond / Support | **CURRENT** | `BOND.md`, `RELATIONSHIPS.md`, `character-relationship-arc-book-v1.md` | Gameplay一次報酬、呼び方等二次報酬、stable/unstable関係あり。Current21はdistinctive relation lane >=2を21/21確保 |
| 黒耀化 | **CURRENT** | `BLACK-YOUKA.md`, `character-black-youka-rescue-book-v1.md` | Core上のrisk/rewardと人物側の歪みを接続。21/21で「仲間が別の選択肢を作り本人が戻る」rescue directionあり |
| Clear Getter / achievements | **CURRENT-DIRECTION** | `GAMEPLAY-META-PROGRESSION.md`, `PROGRESSION-ARCHIVE.md`, `character-story-gameplay-payoff-matrix-v1.md` | 次runを生むMeta Gameplayとして成立。Character growthを別play条件へ返せる。盤面数値は未LOCKでよい |
| Lore / Collection | **CURRENT** | `PROGRESSION-ARCHIVE.md`, `kagemono-collection-entry-book-v1.md` | 読む/読まない両立、情報は副作用。Current48は攻略→手掛かり→re-readingのwriting layerあり |
| Fail-forward | **CURRENT-DIRECTION** | `GAMEPLAY-META-PROGRESSION.md`, `PROGRESSION-ARCHIVE.md` | 失敗を無意味にしないがfailure farmingはさせない |
| Save / AppFlow / ownership | **CURRENT-PRODUCTION** | `unity-runtime-ownership-contract-v1.md`, U46 evidence | 実装境界は強い。ユーザー向けreset/respec体験は別途検討余地 |
| Current Stage1 gameplay implementation | **IMPLEMENTED-NOT-DESIGN-MASTER** | `unity-u47-gameplay-data-runtime-2026-07-13.md` | weapon/passive/rare枠、replacement、evolution、revival等はruntime実証済み |
| Game feel / juice | **PARTIAL** | `unity-game-feel-cookbook.md` | hit stop、death、pickup、LevelUp、Resultまで強いがCoreから孤立していた |
| Enemy / item / stage content database | **CURRENT-PRODUCTION-DATA** | `184-production-content-databases.md`, `src/game/data/*`, `ENEMIES.md` | Current48 identityとlegacy吸収ルールは一本化済み。ただし全production stageのencounter pacingとは別 |
| Stage / Encounter design | **PARTIAL — Stage1〜5 CURRENT DIRECTION** | `STAGE-ENCOUNTER-DESIGN.md`, `story-stage-character-relationship-placement-v1.md`, Enemy masters | Stage1〜5はpressure arc / enemy grammar / alternate build / Clear Getter seedまでCurrent direction化。Stage6〜20、exact wave、boss assignment、difficulty tuningは未完 |
| Visual / UI production | **CURRENT-SEPARATE-TRACK** | Heavy Design docs | 詳細は充実。Game DesignとVisual approvalは分離維持 |
| Accessibility / component states | **PROPOSED** | `design-component-state-accessibility-matrix-v1.md` | tap、reduced motion、VoiceOver、first-time flow案あり。Current化は未完 |
| Performance / release | **CURRENT-ENGINEERING** | U50/U51 roadmap / budgets | Game designではなくengineering trackとして別管理でよい |
| Audio / haptic implementation | **CURRENT-ENGINEERING / U49** | U49 contracts/evidence | technical routing/evidenceは強いが、creative audio identity masterは不足 |

---

# 3. 本当に残っている設計ギャップ

## P0-A. Combat / Run Pacing Master — **OPEN / 最重要**

Coreには「1run中にどんどん強くなる」があるが、Currentな一冊として以下がまだ揃っていない。

- 移動の気持ちよさ / one-thumb前提
- 通常移動速度レンジ
- 敵との接触 / 被弾 / invulnerabilityの考え方
- 何秒ごとにLevel Upしたいかという体感目標
- 序盤 / 中盤 / 終盤の敵密度カーブ
- 進化が成立し始める時間帯
- 黒耀化を使いたくなるpressure point
- elite / bossの出すタイミング
- 1runの「寂しい時間」を何秒以上作らないか
- kill speed / pickup / build完成のテンポ
- Clear時とGame Over時の満足差

`mvp-data-tables.md`にはStage1 8分wave draftとbalance notesがあり、`unity-game-feel-cookbook.md`にはfeedback timingもあるが、旧MVP/implementation資料に分散している。

**必要:** 数値を最終LOCKする本ではなく、Playtestで調整するための `COMBAT-RUN-DESIGN.md`。

---

## P0-B. Stage / Encounter Design Master — **PARTIAL — Stage1〜5 CURRENT DIRECTION / 全20Stageは未完**

2026-07-29時点で `STAGE-ENCOUNTER-DESIGN.md` を追加し、Narrative SpineのStage1〜5についてはCurrentなEncounter directionを作った。

現在Stage1〜5で揃ったもの:

- Character question → Gameplay verbへの接続
- `Read → Mix → Tempt → Punish excess → Alternate answer → Climax → Release` のpressure arc
- movement pressure / controller / modifierの基本recipe
- 敵family / motifの投入方向
- Characterの得意playを最初に気持ちよく使わせる方針
- 同じ一択の過剰だけを崩すEncounter
- 別build / 別Support / 別routeを回答にする方針
- special Clear Getter seed
- Boss46〜48とのaffinity候補
- Story / Enemy / Relationとのcross-domain routing

ただしproduction scope全体はまだPARTIAL。

未完:

- Stage6〜20の個別Encounter identity
- exact wave / encounter timing
- enemy familyの最終投入順
- safe / pressure / climax区間の実時間
- elite / bossの正式配置
- Stageごとのstrong / weak buildのbalance実証
- environmental hazard最終選定
- Easy / Normal / Hard差分
- clear / special conditionの全Stage設計
- playtest / tuning / evidence

20-stage production DBにname / lead characters / core question / story seed / enemy affinity / `stageMechanicSeed` があっても、それだけでは全Stage Encounter完成とは扱わない。

**次に必要:** `STAGE-ENCOUNTER-DESIGN.md` をStage6〜20へ拡張し、Combat/Run Pacing masterと接続してplaytestする。

---

## P0-C. First 10 Minutes / Onboarding — **PARTIAL → CURRENT化が必要**

`design-component-state-accessibility-matrix-v1.md`には:

- TOPのPrimary action
- StageSelectのcurrent stage表示
- Battleで初回だけ移動を簡潔に提示
- HUDを一度に全部説明しない
- LevelUp初回説明

がある。

ただしStatusはPROPOSEDで、**初回起動 → 初Stage → 初LevelUp → 初敗北/初Clear → 初永続強化 → 次run** の一本の体験設計がまだない。

欲しい方針:

- 説明を読むtutorialではなく、触れば分かる
- 自動攻撃を最初の数秒で理解できる
- 初LevelUpを早く見せる
- 初回の達成盤は複数自然点灯
- lore閲覧を強制しない
- 初敗北でも「もう一回」が見える

**必要:** `FIRST-RUN-EXPERIENCE.md`。

---

## P0-D. Player Input / Mobile Control Contract — **OPEN**

Runtime上の操作は存在しても、Game Designとして:

- 片手縦持ちをどこまで優先するか
- virtual stick / drag movementの正式方針
- dead zone / follow behaviorの思想
- 指でcharacterやenemyを隠さない設計
- Pauseの到達性
- accidental touch対策
- left/right-handed accommodation
- controller / keyboardをどの位置づけにするか

がCurrent masterになっていない。

**必要:** `MOBILE-CONTROL-EXPERIENCE.md`。

---

## P1-A. Difficulty / Player Aid Philosophy — **PARTIAL**

旧MVPにはEasy / Normal / Hardや「敵を硬くするより数・速度・出現方向で難しくする」がある。
Accessibility案もある。
`STAGE-ENCOUNTER-DESIGN.md` では、telegraph duration / pressure overlap / spawn direction / recovery window / controller enemy頻度などを候補とし、HP spongeへ寄せない方向まで整理した。

しかしCurrentとして:

- difficultyを何のために分けるか
- Story accessを難易度で塞ぐか
- Assist mode / reduced intensityの扱い
- reward差をどこまで付けるか
- Clear Getterの高難度条件と通常クリアをどう分離するか
- exact difficulty変数の組合せ

が未整理。

**必要:** `DIFFICULTY-AND-PLAYER-AIDS.md`。

---

## P1-B. Meta Economy / Unlock Economy — **PARTIAL**

思想は強い:

- 小さい永続成長
- raw damageだけにしない
- build幅 / comfort / route variationを増やす
- daily obligationを作らない

一方、まだ意図的に未LOCK:

- reward quantities
- permanent stat caps
- unlock costs
- currency source / sink
- respec / refund
- late-game overflow currency
- unlock順

これは数値まで今決める必要はない。

ただし将来「通貨を追加し続ける事故」を防ぐため、**通貨family数 / source-sinkの原則 / respec方針だけはPlaytest前にmaster化**した方がよい。

**必要:** `META-ECONOMY-DESIGN.md`。

---

## P1-C. Postgame / 100% / Endgame — **OPEN**

StoryのHappy Endとsequel余地はある。
Clear Getterもある。

しかし本編クリア後に:

- 何を目標にrunするか
- 高難度 / challenge stage
- hidden evolution
- Character / Support mastery
- 星図complete時の扱い
- 100%でGameplay powerを必須にしない方針
- sequel stingerをどこまで出すか
- New Game+が必要か

は未設計。

ヴァンサバ系の長期リプレイ性に関わるので、発売前には必要。

**必要:** `POSTGAME-ENDGAME-DESIGN.md`。

---

## P1-D. Creative Audio / Haptic Identity — **PARTIAL**

U49はactual-device routing / latency / haptic executionなど技術品質を扱う。
`unity-game-feel-cookbook.md`にもSEの方向はある。

不足:

- TOP / Battle / LevelUp / 黒耀化 / Boss / Dawnの音楽dramaturgy
- Character motifを持つか
- Star Beastの音
- memory fragment collect音のpitch design
- 黒耀化と煤返りの音の差
- Dawnでどこまで音数を増やすか
- BGMを静かにする場面
- haptic hierarchyを感情とGameplayでどう使い分けるか

**必要:** engineering U49とは別の `AUDIO-HAPTIC-DIRECTION.md`。

---

## P1-E. Fun / Balance Playtest Metrics — **OPEN**

U50はperformance/touch metricsであり、**fun balanceのmetricsではない**。

今後必要な観測例:

- 初LevelUpまでの時間
- LevelUp間隔
- 1分あたり撃破数
- player death time分布
- Stage clear rate
- build完成率
- weapon / passive pick率
- reroll率
- Support採用率
- 黒耀化使用率 / 使用タイミング
- 黒耀化なしclear率
- Character別clear率
- 「同じbuildしか使われない」兆候
- first-session 2nd run率（ローカルtestでも観測可）

数字の合格ラインはPlaytestして決める。

**必要:** `FUN-BALANCE-PLAYTEST.md`。

---

# 4. P2 / Laterでよい領域

Core完成前に固定しなくてよい。

- localization / 英語版
- business model / price / ads / IAP policy
- achievements platform連携
- cloud save
- controller正式対応
- live ops / seasonal events
- analytics backend
- social / leaderboard
- merchとの連動

これらを今Coreへ混ぜない。

---

# 5. 今「完璧」と言えるか

**No.**

ただし、問題は「ゲームのアイディアが足りない」ことではない。

現在は:

```txt
GAME IDENTITY          strong
CHARACTER              strong / 21 Current + 15 Future separated
STORY                   strong direction / Main Mystery answer open
BOND                    strong
CLEAR GETTER / META     strong direction
BLACK-YOUKA             strong direction + 21 rescue paths
CONTENT DATABASE        large
ENEMY SEMANTICS         48/48 integrated
RUNTIME FOUNDATION      strong

COMBAT PACING           needs current master
STAGE ENCOUNTER         Stage1-5 current direction / full 20-stage PARTIAL
FIRST RUN               needs current master
MOBILE CONTROL          needs current master
DIFFICULTY              needs consolidation
META ECONOMY            needs shape before numbers
POSTGAME                needs design
CREATIVE AUDIO          needs master
FUN METRICS             needs design
```

という状態。

**Character / Story / Enemyの魂はかなり一本化したが、ゲーム全体を「遊びとして仕上げる設計層」はまだ未完。**

---

# 6. 推奨作業順

設計だけを今詰める場合の順序:

```txt
1. COMBAT-RUN-DESIGN
2. STAGE-ENCOUNTER-DESIGN — Stage6〜20 expansion / playtest
3. FIRST-RUN-EXPERIENCE
4. MOBILE-CONTROL-EXPERIENCE
5. DIFFICULTY-AND-PLAYER-AIDS
6. META-ECONOMY-DESIGN
7. FUN-BALANCE-PLAYTEST
8. POSTGAME-ENDGAME-DESIGN
9. AUDIO-HAPTIC-DIRECTION
```

ただし、数値を早くLOCKしない。

- まずPrinciple / desired feeling / test questionsを定義
- prototype / actual-device playtest
- 数値調整
- evidence
- 必要なものだけCanon化

の順を守る。

Character / Story領域については、新設定の追加より:

- scene repetition / payoff精度
- Main Storyへ何を出さないか
- C級Mysteryを本当に1で払えるか
- Character verbがGameplayとして楽しいか

を優先する。

---

# 7. Completeness gate

Game Designを「大枠完成」と呼べる最低条件:

- Game Core BookがCurrent
- Character / Story / Bond / 黒耀化 / Clear GetterのCurrent masterがある
- Combat / Run pacingのCurrent masterがある
- **launch scopeのStage / EncounterがCurrentで、必要Stageの差別化とplaytestが済んでいる**
- First-run flowがCurrent
- Mobile controlsがCurrent
- Difficulty philosophyがCurrent
- Meta economyのshapeがCurrent
- Postgameの方向がCurrent
- Fun/balance playtest項目がCurrent
- Accessibility baselineがCurrentまたは実装契約へ接続済み
- Audio/Haptic creative directionがU49 engineeringと矛盾しない
- 数値未LOCK項目は「未決定」と明示されている

現時点ではStage1〜5 directionがCurrentになっただけで、このgate全体はまだ通っていない。

このgateを通るまでは「設計完璧」と表現しない。
