# ヨルノシルベ — Character Competence / Learning Reservoir v1

Date: 2026-08-12  
Status: **AUTHOR RESERVOIR / NON-CANON / NO INTELLIGENCE RANKING / NO RUNTIME STAT**

Machine source:

- `src/game/data/characterCompetenceLearningReservoir.ts`

Related:

- `docs/character-behavior-identity-reservoir-v1.md`
- `docs/character-lived-artifact-reservoir-v1.md`
- `docs/character-environment-sensory-reservoir-v1.md`
- `docs/character-author-db-schema-and-coverage-v1.md`

## Purpose

「得意です」「不器用です」だけでは人物のsceneが作りにくい。

このReservoirでは全36人に、**どう覚え、どう試し、どう間違い、誰に頼り、どう人へ渡すか**を持たせる。

用途:

- 日常scene
- Party / former-enemy scene
- Character Book
- relationship event
- mentor / apprentice / sibling / peer scene
- failure comedy
- low-stakes conflict
- Era差の学び方
- gameplay animationのauthor reference

ただし直接gameplay statにはしない。

---

# 1. Eight axes

1. `PRACTICAL_COMPETENCE` — 日常で自然に任せられること
2. `LEARNING_ENTRY` — 新しいことへ入る最初の取っ掛かり
3. `PRACTICE_PATTERN` — 身につくまで何を繰り返すか
4. `ASKING_HELP` — いつ / 誰に / どう助けを求めるか
5. `TEACHING_OTHERS` — 人へ渡す時にどう教えるか
6. `LOW_STAKES_FAILURE` — 人生崩壊ではない普通の失敗
7. `RECOVERY_AFTER_MISTAKE` — 間違えた後に何をするか
8. `BLIND_SPOT_OVERREACH` — 得意さが過剰になる場所

Target:

```txt
36 characters × 8 axes = 288 competence/learning anchors
```

---

# 2. Hard boundaries

このReservoirは以下を決めない:

- IQ / intelligence rank
- school grade
- final education
- exact profession
- salary / class
- runtime STR / INT / skill stat
- weapon mastery
- diagnosis
- neurotype
- permanent incompetence
- expert certification

禁止shortcut:

- 年長 = 何でも知っている
- 若者 = technologyに強い
- 子ども = 純粋だから本質を理解する
- 大柄 = 力仕事が得意
- plus-size = 運動が苦手
- wheelchair user = 人に頼るのが苦手 / 何でも一人で克服
- Robot / Android = 一度見れば完璧
- dog / cat = 人間並みの論理理解
- feminine presentation = beauty / fashionが得意と自動決定
- gender undisclosed = analytical / mysterious genius
- brown skin / 地方出身 = 特定craft / sport / culture skill
- long-lived = omniscient

> **competence != intelligence != morality != gameplay power**

---

# 3. Current21 highlights

| Character | Learning / competence highlight |
|---|---|
| ユイ | 人と情報を結び直すのが速い。検索やmanualより先に「誰が困るか」を見る。 |
| アサ | 分類・配布が速いが、本人の希望を先に聞かず整理しすぎる失敗がある。Humanの学習として扱う。 |
| ナギ | boundary / storageは強いが、曖昧さを理由に共有しなさすぎることがある。 |
| ミチル | 動いて覚える。自分に分かりやすいrouteを他人にも分かりやすいと思う盲点。 |
| トモリ | repairは強いが「直せる = 直したい」をownerへ押し付けないことを学ぶ。 |
| セン | 説明は上手いが、simple answerをlectureにしすぎる。 |
| リツ | shared workを拾えるが、拾いすぎて助けを求める機会を消す。 |
| コヨリ | count / name /小物に強い。背伸びの失敗もchild sceneとして普通に持つ。 |
| ゲン | 経験が豊富でも新systemは若い人へ聞ける。昔の方法をfinal answerにしない。 |
| ハナ | 保存・seasonal careが強いが「後で使う」を他人へ押し付ける時がある。 |
| ユウビ | route / handoff / pending taskに強い。自分の用事を後回しにしがち。 |
| マドカ | subtle changeを見つけるが、言うtimingを逃す失敗がある。 |
| シロ | 分類とsource search。metadataを増やせば理解が増えるとは限らない。 |
| トバリ | exit / return / thresholdに強い。誰かの帰還を自分の duty にしすぎる。 |
| ネム | tensionを下げて人へ渡すのが上手い。休憩がdecision delayへ変わる盲点。 |
| クロオリ | privacy / reversible handling。守りすぎてcollaborationを止める失敗を持つ。 |
| カナメ | load / space / physical care。体格由来の万能strengthにはしない。better toolや追加の手を普通に頼む。 |
| カスミ | revision / draft。直し続けることで自分の希望を言わない逃げにもなり得る。 |
| トキ | measurement / repeatability。consistencyとfairnessを同一視する盲点。 |
| ツムギ | material / unfinished work。process historyを残したい本人とclean finalを欲しい相手が衝突できる。 |
| レン | comparison / hypothesis。patternをcausal answerへ早上げしない。 |

---

# 4. Future15 highlights

Future15は情報が増えてもCurrent21へ自動昇格しない。

| Character | Learning / competence highlight |
|---|---|
| ヒヨリ | 人を巻き込んで試すのが上手いが、本人のpaceを他人にもeasyだと思う失敗がある。 |
| セリカ | formal planningは強いが、頼まれていないsolutionを先に作りすぎる。 |
| クロエ | 長寿でもomniscientではない。「前と何が変わった？」と新しい世代へ聞ける。 |
| レンジ | apprentice由来の手学習。ただし永遠の弟子roleにはしない。 |
| トウマ | craft authorshipが強いが、何にでも自分の痕跡を残したくなるoverreach候補。 |
| クウ | dogとしてcue / route / repetitionで学ぶ。Human reasoningへ昇格させない。 |
| ヨモ | catとして環境cue / routineを学ぶ。複数home行動へHuman moralを投影しない。 |
| ノア | reference dataを速く扱えてもpersonal understandingはexperience / choiceが必要。 |
| ルム | shared memoryとinstance experienceを区別して学ぶ。collective access = same identityではない。 |
| マキ | incomplete infoから決めるのが強いが、閉じなくてよい問いを閉じる失敗がある。 |
| スズ | presentation experimentを人へ渡す時、「自由に試せる = 試したい」ではないと理解する。 |
| イオ | label前にrelationを捉えるが、teamにworking termが必要な時まで無名にしない。 |
| カイ | まず動いて修正する。速いstartをconfidence / consentだと思わない。 |
| ナオ | transitionを見てから入る。慎重なら結果が良いとは限らない。 |
| アマネ | real accessibilityを含むurban route adaptation。help requestをhelplessnessにも克服美談にもしない。 |

---

# 5. Failure should be ordinary too

Characterを深くするために毎回trauma級の失敗は不要。

Good low-stakes examples:

- wrong turn
- overexplaining
- misplacing an object
- overpacking
- assuming a route is accessible
- saving something nobody wanted
- starting before instruction ends
- waiting too long
- scheduling too tightly
- revising too much
- using outdated shortcut
- trusting published information that changed
- helping before asking

これらは後でrelationship memoryにも使える。

> **人気Characterは「失敗しない人」ではなく、失敗の仕方と立て直し方がその人らしい。**

---

# 6. Asking for help is character material

`ASKING_HELP`は弱さrankではない。

- 早く聞ける人
- 一回試してから聞く人
- owner permissionが必要な時だけ聞く人
- 専門外を明確にして聞く人
- 身体的なhelpを普通に具体的taskとして頼む人
- Human value判断をsystemから導けない時に聞くartificial person
- Human言語ではなくbehaviorでhelpを求めるanimal

等がある。

「助けを求めないCharacter = 強い」にはしない。

---

# 7. Teaching is relationship material

`TEACHING_OTHERS`はteacher職を意味しない。

Sceneとして:

- toolを渡す
- routeを一緒に歩く
- exampleを二つ見せる
- learnerへ最初の答えを言わせる
- safe failureを作る
- private boundaryを先に教える
-自分が昔つまずいたstepだけ先に教える
- methodではなくchoiceを渡す

等に使える。

師弟 / sibling / rival / former enemy / robot-human / adult-childでも同じ軸を使えるが、関係の上下は別field。

---

# 8. Physical / representation guards

## カナメ

188cm / 112kg plus-size broad body。

- body size = strength statではない
- tool / leverage / extra handを使う
- 自分が通れる = 全員通れる、というspace blind spotは成立可能

## ハナ / ゲン

older adultだから万能でも無能でもない。

- old methodを知る
- new methodを人へ聞く
- body comfortとknowledgeを別軸にする

## アマネ

wheelchair useとcompetenceを分離。

- access infoを具体的に聞く
- bad route infoをreportする
- 自分のroute experienceを他のdisabled personへ普遍化しない

## スズ / イオ / ヒヨリ / トウマ

presentation / gender / skin toneは competence sourceではない。

## ノア / ルム

fast data access / precise repetitionは可能でも:

```txt
data access != wisdom
precision != perfect interpretation
shared memory != shared identity
system knowledge != personal value judgment
```

## クウ / ヨモ

species-appropriate learning。

```txt
cue association != human language comprehension
route memory != moral judgment
human projection != animal intention fact
```

---

# 9. Production boundary

このReservoirは:

- runtime stats
- battle balance
- base weapon
- job class
- education record
- unlock requirement

へ自動接続しない。

`runtimeAutoPromotionAllowed = false`

将来Author DBへ入れる場合は、新dimension `competenceLearning` として**status込み**で追加する。

---

# 10. QA

- [ ] 36 characters
- [ ] 8 axes each
- [ ] 288 anchors
- [ ] no intelligence ranking
- [ ] no runtime stat promotion
- [ ] no exact job/education freeze
- [ ] age does not determine competence
- [ ] body does not determine competence
- [ ] disability does not determine helplessness
- [ ] Future technology does not imply competence
- [ ] artificial person does not become perfect
- [ ] animal does not become Human thinker
- [ ] Future15 no promotion

Guiding principle:

> **何ができるかより、「できるようになる途中」と「間違えた後」にCharacterが出る。**
