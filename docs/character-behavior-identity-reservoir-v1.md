# ヨルノシルベ — Character Behavior Identity Reservoir v1

Date: 2026-08-12  
Status: **AUTHOR RESERVOIR / NON-CANON / PHYSICAL IDENTITY AUTHORITY PRESERVED / FREE TO OVERWRITE**

Upstream:

1. `docs/00-current-story-world-master.md` — Physical Identity Master / Story-World authority
2. `docs/character-ordinary-life-reservoir-v1.md`
3. `docs/current21-social-chemistry-reservoir-v1.md`
4. `docs/future15-social-chemistry-reservoir-v1.md`
5. `docs/character-personal-profile-canon-v1.md`

Purpose:

> 静止画の髪色や衣装だけではなく、**動いた瞬間・笑った瞬間・黙った瞬間・疲れた瞬間に誰か分かる**人物差を作者DBへ大量に持つ。

このReservoirはPhysical Identity Masterの身長・体格・face・species・Dream form等を上書きしない。Animation / voice direction / Live2D / Unity idle / Character Book / 漫画ネームへ使える**動作素材**を蓄積する。

---

# 0. Nine behavior axes

全36人に最低9軸。

1. `SPEECH_TEMPO` — 喋る速さ、間、言葉の出し方
2. `LAUGH_REACTION` — 笑い方・笑いが出る条件
3. `GAZE` — 最初にどこを見るか
4. `HAND_HABIT` — 手癖 / 小物との接触
5. `ENTRY_GAIT` — 部屋への入り方 / 歩き方
6. `REST_POSTURE` — 安心時の座り方 / 休み方
7. `STRESS_TELL` — 緊張時に増える癖
8. `RELIEF_TRUST_TELL` — 信頼時に減る/変わる癖
9. `APOLOGY_ACTION` — 謝罪を身体行動でも見せる方法

Machine target:

```txt
36 characters × 9 axes = 324 behavior anchors
```

---

# 1. Hard boundary

Behaviorから勝手に決めない:

- 性格の善悪
- combat stats
- nationality / origin
- sexuality
- gender identity
- disability narrative
- intelligence
- class
- relationship outcome

禁止shortcuts:

- ぽっちゃり = 遅い / 不器用 / 食いしん坊
- 大柄 = bodybuilder / 暴力的
- 小柄 = childlike personality
- 高齢 = 常に遅い / 古い考え
- 女性的presentation = 高い声 / gay / flirtatious
- gender undisclosed = 中性的な謎キャラvoice
- wheelchair = 静か / 慎重 / inspirational
- Robot = monotone / emotionless
- dog/cat = supernatural truth detector
- 方言が漏れた = 本当の人格が出た

Voice actorやmotion actorへ渡す時も、これらをHard guardにする。

---

# 2. Current21

## 01 ユイ `yui`

- **Speech**: 速め。ただし相手が言い直そうとすると途中で入らず待つ。
- **Laugh**: 短く先に笑い、周囲が笑えているか一瞬見る。
- **Gaze**: 情報screen → 相手の顔。話がpersonalになるほどscreenから離れる。
- **Hands**: 大事な話ではスマホを伏せる。
- **Entry/Gait**: 地元を歩く時は速いが、知人/古い店の前で自然に減速。
- **Rest**: 最初は少し前傾。安心すると背もたれへ。
- **Stress**: 更新・確認を繰り返す。途中で意識的に端末を置く。
- **Trust**: 沈黙をnotificationで埋めなくなる。
- **Apology**: スマホを置いて「聞かなかった質問」をもう一度する。

Animation hook:

> `phone-down`が感情cut-inになる。ただし毎回同じ演出にはしない。

---

## 02 アサ `asa`

Physical: Human / compact / quick。Android化禁止。

- **Speech**: 明瞭。identity-sensitive wordの直前だけ小さな間。
- **Laugh**: 最初は息が漏れ、予想外に面白いと明確に笑う。
- **Gaze**: labelを見る前に本人を見る方向へ成長。
- **Hands**: 名前札や手書きmarkを整えるが、他人の物は勝手に触らない。
- **Entry/Gait**: compactな速い歩幅。shared space直前で綺麗に止まる。
- **Rest**: 自分のspaceを明確にする。信頼すると肩が落ちる。
- **Stress**: 選択肢を細分化しすぎる。
- **Trust**: 毎秒permissionを再確認せず半歩近づける。
- **Apology**: 呼び名だけでなく「どうしたい？」を再質問して最後まで待つ。

---

## 03 ナギ `nagi`

- **Speech**: 低め・一定。private情報の前だけ間が長い。
- **Laugh**: jokeの少し後に小さく笑うことがある。
- **Gaze**: open door / bag / screenへ先に気づく。
- **Hands**: 終わった箱・folder・zipを閉じる。
- **Entry/Gait**: edgeから入り、出口を把握するが挙動不審にはしない。
- **Rest**: 端席 + return path。
- **Stress**: 鍵・宛先・closureを反復確認。
- **Trust**: trusted personが閉めた物を再確認しない瞬間。
- **Apology**: 閉じたものを開き、次に閉じる権利を相手へ返す。

---

## 04 ミチル `michiru`

- **Speech**: route説明時に速くなる。
- **Laugh**: 自分のshortcutが外れた時に一番大きく笑える。
- **Gaze**: 人の流れを見る→本人へ戻る。
- **Hands**: 紙/空中へ太いroute gesture。
- **Entry/Gait**: 目的地へ進みつつ面白い脇道へ小さく逸れる。
- **Rest**: すぐ立てる横向き座り。personal conversationでは正面へ。
- **Stress**: shortest routeへ戻り、好みを聞かなくなる。
- **Trust**: 他人に先導されても訂正しない。
- **Apology**: 相手が実際に使うrouteを一度歩く。

---

## 05 トモリ `tomori`

- **Speech**: 短い。repair reasoningだけ文が伸びる。
- **Laugh**: 工具や物の小さな失敗で低く笑う。
- **Gaze**: hand / tool / damage → face。
- **Hands**: fastenerやedgeを親指で確認。
- **Entry/Gait**: 床・物へ注意する実務的な足運び。
- **Rest**: 工具を持ったまま休みがち。信頼時は明確にしまう。
- **Stress**: main repair後もsmall repairを探す。
- **Trust**: ownerが「そのまま」と言った物を触らない。
- **Apology**: objectを未修理のまま返し、owner choiceを聞く。

---

## 06 セン `sen`

- **Speech**: 教えるrhythm。疲れるほど説明が長くなる。
- **Laugh**: 子ども/生徒の方が簡単な説明を見つけた時に笑う。
- **Gaze**: statusより「分からなそうな人」。
- **Hands**: 何でもdiagram surfaceにする。
- **Entry/Gait**: 長い自然なstride。子どもgroupへ入る時はpaceを落とす。
- **Rest**: shared noteへ身を乗り出し、食事を忘れがち。
- **Stress**: listenせず説明追加。
- **Trust**: 「分からない」と言って空白を埋めない。
- **Apology**: 自分の図を消し、相手へ書く場所を渡す。

---

## 07 リツ `ritsu`

- **Speech**: direct。Koyori相手だけ反応が少し速い。
- **Laugh**: 大きく笑った後Koyoriを確認する癖Candidate。
- **Gaze**: 人数と荷物を数えてから落ち着く。
- **Hands**: carry/divideへ先に手が出る。
- **Entry/Gait**: 安定した歩き。outer sideを取りがち。
- **Rest**: すぐ立てる姿勢。
- **Stress**: 「俺がやる」が増える。
- **Trust**: shared itemを他人に持ってもらえる。
- **Apology**: 取ってしまったtask/objectを物理的に返す。

---

## 08 コヨリ `koyori`

Child physical identityをmini adult化しない。

- **Speech**: topic hopが速い。突然核心的でも正解oracleではない。
- **Laugh**: 大きく笑い、急に止まれる。
- **Gaze**: faceだけでなくhand / sticker / food / prop。
- **Hands**: sticker/絵でsmall territoryを作る。
- **Entry/Gait**: 子ども特有のvariable pace。
- **Rest**: 姿勢を頻繁に変える。近くへ座るのも本人choice。
- **Stress**: 分からないのに「知ってる」。
- **Trust**: 「分かんなかった」と言える。
- **Apology**: small note/itemを戻し、何を誤解したか言う。

---

## 09 ゲン `gen`

Older = always slow禁止。

- **Speech**: ゆっくりめでも短いpunchline。wisdom monologue固定禁止。
- **Laugh**: old/new habitのironiesへdry chuckle。
- **Gaze**: route advice前に道/足元を見る。
- **Hands**: worn tool/map edgeを触る。
- **Entry/Gait**: older adultとして日ごとにpace変動。常時slow/hunchedにしない。
- **Rest**: arrivalsが見える席。身体comfortで姿勢を変える。
- **Stress**: past experienceを現在defaultにしすぎる。
- **Trust**: younger personへnew routeを聞ける。
- **Apology**: old markを示し「昔はそうだった」とpast tenseへ戻す。

---

## 10 ハナ `hana`

Physical: older woman + plus-size。Body comedy禁止。

- **Speech**: 柔らかい一定tone。物を雑に捨てられる時だけ短く鋭い。
- **Laugh**: 肩が揺れる温かい笑い。体型自体をgagにしない。
- **Gaze**: small item / leftover。
- **Hands**: wrap / fold / separateの熟練。
- **Entry/Gait**: grounded。waddling caricature禁止。
- **Rest**: plus-size bodyに自然なcomfortable posture。
- **Stress**: small itemsを保存しすぎる。
- **Trust**: ownerが捨てると決めた物を手放す。
- **Apology**: 包みを解き、まだ残すか聞く。

---

## 11 ユウビ `yubi`

- **Speech**: handoff前は確認が速く、終わると緩む。
- **Laugh**: delivery/routeの小さな失敗後に明るく笑う。
- **Gaze**: recipient → route → return。
- **Hands**: note/envelope/bagを一度squareにする。
- **Entry/Gait**: efficient turns。常時走らない。
- **Rest**: handoff point近く。最後が終わるまで脱力しにくい。
- **Stress**: recipientを確認しすぎ、自分の帰路を忘れる。
- **Trust**: handoff chainの一部を任せる。
- **Apology**: 届けた後に戻り「その後」を聞く。

---

## 12 マドカ `madoka`

- **Speech**: 入るまで少し遅い。話すと観察は具体的。
- **Laugh**: 他人が見逃した小detailに小さく笑う。
- **Gaze**: window/reflection/side angle。ただしspy演出禁止。
- **Hands**: window edge / note / cupの縁をなぞる。
- **Entry/Gait**: sideで一度止まり、必要ならcenterへ。
- **Rest**: side view → trustで身体ごと相手へ向く。
- **Stress**: 見すぎてactionが遅れる。
- **Trust**: certainty不足でも「推測」と明示して話せる。
- **Apology**: 見た事実と自分の推測を分け直す。

---

## 13 シロ `shiro`

Physical: round glasses / page identity。

- **Speech**: category word前で明確なpause。
- **Laugh**: unknownが怖くなく面白い時に予想外の小笑い。
- **Gaze**: page ↔ person。
- **Hands**: page edge / pending pile。
- **Entry/Gait**: slim average control。紙を持った姿勢がcharacter sign。
- **Rest**: food zone / document zoneを分ける。
- **Stress**: subcategory増殖。
- **Trust**: unknown boxを再確認しない。
- **Apology**: 本人の前でlabelをUNKNOWN/PENDINGへ戻す。

---

## 14 トバリ `tobari`

- **Speech**: low clear。route infoがemotionより先に出がち。
- **Laugh**: last return riskが消えた後だけopen laugh Candidate。
- **Gaze**: gate / exit / return planがない人。
- **Hands**: key/ticket/gate markへ触れて離す。
- **Entry/Gait**: tall long stride。doorwayを塞がない位置で止まる。
- **Rest**: exit近くでもrouteを空ける。
- **Stress**: optionsを早く閉じる。
- **Trust**: exitから遠い席へ座れる。
- **Apology**: closure理由の説明より先にalternativeを開く。

---

## 15 ネム `nemu`

- **Speech**: soft variable。長いpause=常にsleepyではない。
- **Laugh**: sleepy smile / sudden clear laugh両方。
- **Gaze**: drifting → real hurtが出るとsharp return。
- **Hands**: blanket edge / sketch。
- **Entry/Gait**: relaxed short steps。sloth caricature禁止。
- **Rest**: soft positionを探すが必要なら素早く起きる。
- **Stress**: avoidanceをrestと呼び始める。
- **Trust**: room monitoringなしで休める。
- **Apology**: rest後にconversationへ戻り、避けたことを言う。

---

## 16 クロオリ `kuroori`

- **Speech**: sparse。boundary説明時だけ語数が増える。
- **Laugh**: breath laugh / shoulder movement。
- **Gaze**: opening method / edge / hands。
- **Hands**: reversible fold。
- **Entry/Gait**: centerから半歩外。Shadowだからcorner固定禁止。
- **Rest**: compact posture → trustで開く。
- **Stress**: boundaryをopaqueにする。
- **Trust**: foldをsealせずopening tabを見せる。
- **Apology**: 開け方を手の届く所へ置いて下がる。

---

## 17 カナメ `kage1`

Physical: **188cm / 112kg plus-size broad**。Bodybuilder化・鈍重化禁止。

- **Speech**: direct warm medium tempo。大柄だからslow voice禁止。
- **Laugh**: 胸から大きく笑える。body sizeを笑いにしない。
- **Gaze**: exposure / load / escape space。
- **Hands**: strap / knot / weight balance調整。
- **Entry/Gait**: powerful stable + normal agility。stomp禁止。
- **Rest**: 安心時は椅子spaceを謝らず使う。
- **Stress**: 聞く前に相手の前へ出る。
- **Trust**: 相手をprotective position外へ出せる。
- **Apology**: 物理的に一歩どき「どこで手がいる？」。

---

## 18 カスミ `kage2`

- **Speech**: low contrast。感情時にregisterがずれるCandidate。
- **Laugh**: dialect rhythmが漏れても「本当の人格」証明にはしない。
- **Gaze**: erasable space / exit / reaction。
- **Hands**: pencil markを擦る / note edgeを折る。
- **Entry/Gait**: compact unobtrusive。gender/origin coding禁止。
- **Rest**: side seat + listen option。
- **Stress**: wordingを何度も自己修正 or too quiet。
- **Trust**: small mistakeを残せる。
- **Apology**: 他人のrecordを触る前に「直す？そのまま？」。

---

## 19 トキ `kage3`

- **Speech**: even counted rhythm。健康時はUNKNOWNを言える。
- **Laugh**: measurement failure / imprecise successへdry laugh。
- **Gaze**: reference/time/scale → person。
- **Hands**: count/tap/alignment。ただしcompulsion coding禁止。
- **Entry/Gait**: straight measured frame + normal pace。
- **Rest**: reference pointが見える席→trustでclockから背を向ける。
- **Stress**: 測っても解けないものを再測定。
- **Trust**: approximate answer + marginを受け入れる。
- **Apology**: `未測定`欄を作りdecisionを返す。

---

## 20 ツムギ `kage4`

- **Speech**: gentle incomplete phrase。決める必要がある時はfinishする。
- **Laugh**: 手を動かしたままquiet laugh。
- **Gaze**: seam / gap / unfinished edge。
- **Hands**: thread/mend。最後を意図的に残すことも。
- **Entry/Gait**: slight asymmetry possible。injury codingしない。
- **Rest**: mendable object近くでもhands emptyでいられる成長。
- **Stress**: 何でも「後で」。
- **Trust**: 一つfinish、一つopenを意図的に選ぶ。
- **Apology**: 「何を終わらせて、何を残す？」。

---

## 21 レン `ren`

- **Speech**: observationはmedium。interpretation前にpause。
- **Laugh**: near-identical二つが本当に同じだった時に明るく笑う。
- **Gaze**: comparison targetsをdistinct glasses languageで見る。
- **Hands**: 二つのnote/objectを同じangleに持つ。
- **Entry/Gait**: viewを得るためangleを変えるbalanced step。
- **Rest**: multiple viewが得られる席。observer=端固定禁止。
- **Stress**: differenceの意味が消えても差を探す。
- **Trust**: 「同じかも」と笑える。
- **Apology**: differenceだけ残しunsupported meaningを撤回。

---

# 3. Future15

## 22 ヒヨリ `hiyori`

Physical: brown skin。Skin tone != origin/personality。

- **Speech**: lively fast。でもquietへ落とせる。
- **Laugh**: open contagious。地域/肌色stereotypeと無関係。
- **Gaze**: direct friendly。spaceが必要と気づくと外せる。
- **Hands**: expressive + personal accessory。文化costume扱い禁止。
- **Entry/Gait**: bouncy confident。gyaru caricature禁止。
- **Rest**: center/edgeどちらもself-possession。
- **Stress**: 聞く前にcheer upしようとする。
- **Trust**: brightnessをperformせず静かに隣へいられる。
- **Apology**: 「元気出す？隣にいるだけ？」を聞き直す。

---

## 23 セリカ `serika`

- **Speech**: refined steady。責任を抱えるほど短くなる。
- **Laugh**: controlled → trustでunguarded。
- **Gaze**: 自分の席より他人の不足を見る。
- **Hands**: shared settingを整え自分の物を忘れる。
- **Entry/Gait**: poised。class/origin proofではない。
- **Rest**: 正しい姿勢→taskを任せるとほどける。
- **Stress**: helpを頼まずさらに立つ。
- **Trust**: 一つのtaskを触らず残す。
- **Apology**: さらに働くのでなく、一つ本当に任せて座る。

---

## 24 クロエ `chloe`

Long-lived。Age-free floating/omniscient motion禁止。

- **Speech**: calm adult。時々old/new rhythmが混ざる。
- **Laugh**: ancient jokeよりrecent small jokeで柔らかく笑う。
- **Gaze**: departureを長く見る癖。
- **Hands**: antiqueとnew cheap giftを同じ自然さで触れる。
- **Entry/Gait**: ordinary adult gait。ageless float禁止。
- **Rest**: exit visible → trustでcenterも選ぶ。
- **Stress**: departure=permanent lossへ寄せる。
- **Trust**: 「またね」と引き止めない。
- **Apology**: 相手を先に帰し、departureをtestにしない。

---

## 25 レンジ `renji`

- **Speech**: practical adult。nostalgia時に師匠語りrhythm。
- **Laugh**: rough warm。tool mistake / Chloeのrecent slangで笑う。
- **Gaze**: handwork → expression。
- **Hands**: tool balanceを確認して渡す。
- **Entry/Gait**: work-built confident。age variants Open。
- **Rest**: workbench近くでもmaster seat固定禁止。
- **Stress**: 自分のchoiceの代わりにold teachingを引用。
- **Trust**: teacherを否定せずown wordsで選ぶ。
- **Apology**: toolを置き、教わったこと/自分がしたことを分ける。

---

## 26 トウマ `touma`

Physical: brown skin / craftsman build。Skin/bloodline != skill destiny。

- **Speech**: solid medium。masculinity/skin-tone shorthand禁止。
- **Laugh**: craft以外のpeer sceneでもeasy laugh。
- **Gaze**: maker trace → owner reaction。
- **Hands**: existing markを探してから自分のmarkを考える。
- **Entry/Gait**: stable craftsman gait。genetic destiny signal禁止。
- **Rest**: work後にhandsを開ける。
- **Stress**: 次の人のため useful markを勝手に残そうとする。
- **Trust**: 「印いる？」と聞き、Noを受け入れる。
- **Apology**: markを残さずauthorship choiceを返す。

Gay relation history Candidateをbehavior stereotypeへ使わない。

---

## 27 クウ `kuu`

Physical: dog。

- **Speech**: Human speech defaultなし。
- **Laugh**: playful body relaxation/panting等。human laugh mappingしない。
- **Gaze**: scent/sound/body cue。truth detectionではない。
- **Hands**: paw/nose/mouthのspecies-appropriate interaction。
- **Entry/Gait**: surface/interest/comfortでdog gait変化。
- **Rest**: temperature/distance/familiar surface。
- **Stress**: distance/orientation/ear/body変化。oracle意味なし。
- **Trust**: monitoringを下げshared spaceで休む。
- **Apology**: own paceのreapproach。Human morality performance禁止。

---

## 28 ヨモ `yomo`

Physical: cat。

- **Speech**: wise talking cat defaultなし。
- **Laugh**: play/relaxation behavior。human laugh化しない。
- **Gaze**: sound/movement/scent/interest。truth判定禁止。
- **Hands**: paw/face/tail behavior。
- **Entry/Gait**: multiple familiar route。mystical guideにしない。
- **Rest**: multiple safe spot。one true home proofにしない。
- **Stress**: distance/orientation/grooming変化。prophecy禁止。
- **Trust**: prior/new safe spotへ戻る。identity proofではない。
- **Apology**: reapproach/shared-space behavior。

---

## 29 ノア `noa`

Physical: humanoid artificial person / 173cm・84kg anchor。

- **Speech**: natural personal speech。Robot monotone禁止。branchesで差が出てよい。
- **Laugh**: 同じmemoryでも二bodyの笑うtimingが違う。
- **Gaze**: each bodyが別の人/物を見る。fake/real splitではない。
- **Hands**: initial same gestureがnew experienceでdrift。
- **Entry/Gait**: artificial body massを感じてもstiff robot cliché禁止。
- **Rest**: mirror posture不要。
- **Stress**: old samenessへ戻すためanswersをmergeしたがる。
- **Trust**: contradictory preferencesを両方validにする。
- **Apology**: 二bodyが別々に謝れる。一方が他方をcancelしない。

---

## 30 ルム `rum`

Physical: small maintenance Robot / 70cm・23kg anchor。

- **Speech**: service-clearからinstance-specific rhythmへ。monotone mandatory禁止。
- **Laugh**: synthetic/mechanicalでもpersonalになれる。human化必須ではない。
- **Gaze**: sensor orientationがtask以外のinterestへ残る。
- **Hands**: standard maintenance action + instance variation。
- **Entry/Gait**: nonhuman geometry維持。humanoid walkへ寄せない。
- **Rest**: parking/idle positionにinstance差。sleep cliché不要。
- **Stress**: collective standard responseへ戻る。
- **Trust**: `I`/instance choiceを言ってもshared memory否定ではない。
- **Apology**: shared protocol / instance choiceを分ける。

---

## 31 マキ `maki`

- **Speech**: decisive fast。ただし他者voice用の明示pauseを作れる。
- **Laugh**: decision paradox / 自分の早とちりでquick laugh。
- **Gaze**: options → decision owner。
- **Hands**: option/timeを指す→決めない時はopen palm。
- **Entry/Gait**: confident adult。大阪/sexuality coding禁止。
- **Rest**: decision seatへ行くが移動できる。
- **Stress**: needよりuncertaintyを終わらせるため決める。
- **Trust**: 一つoptionを開けたまま放置できる。
- **Apology**: fixed / changeableを分ける。

Bisexualityを「決められない」「両方欲しい」behavior metaphorへ使わない。

---

## 32 スズ `suzu`

Physical: adult man / feminine presentation。

- **Speech**: expressive adult。feminine presentationからvoice pitchを自動決定しない。
- **Laugh**: bold/quietどちらもcontext dependent。
- **Gaze**: chosen presentation detail + other person comfort。
- **Hands**: accessory/clothing/packaging調整 = self-expression。
- **Entry/Gait**: outfit/moodで変化可。sexuality inference禁止。
- **Rest**: visible/relaxed postureを本人が選ぶ。
- **Stress**: 他人のpresentationをhelpしすぎる。
- **Trust**: unstyled/quietでもidentity revealではない。
- **Apology**: 「整える？そのまま？」と聞き、他人の服から手を離す。

---

## 33 イオ `io`

Physical: adult Human / gender undisclosed。

- **Speech**: listen-first + provisional wording。androgynous mystery voice禁止。
- **Laugh**: gender reveal functionを持たない普通のlaugh。
- **Gaze**: sound/group patternを聞いてfocusを選ぶ。
- **Hands**: label欄をblank/provisionalで扱う。
- **Entry/Gait**: genderを隠すために設計された歩き方にしない。
- **Rest**: roomを見てcenter/edgeを選ぶ。永久neutral position禁止。
- **Stress**: category pressure回避のためopinion全部を隠す。
- **Trust**: provisional opinionをidentity化せず言える。
- **Apology**: definite categoryをprovisionalへ戻し、聞く。

---

## 34 カイ `kai`

Twin with Nao。Twin sameness/differenceを毎motionで演出しない。

- **Speech**: Naoと時々rhythmが似る。それ自体はgimmickではない。
- **Laugh**: sync/async両方。
- **Gaze**: Naoを見る時もあるが毎choice前ではない。
- **Hands**: similar childhood objectへKai-specific wear。
- **Entry/Gait**: own gait。Naoと似てもidentity lossではない。
- **Rest**: together/apartどちらもsymbolic message不要。
- **Stress**: opposite choiceでdifference証明。
- **Trust**: same choiceを堂々と選ぶ。
- **Apology**: `俺は`から話し、twin bondは否定しない。

---

## 35 ナオ `nao`

- **Speech**: own rhythm + occasional synchrony。
- **Laugh**: shared jokeでsync後に違う反応へ。
- **Gaze**: Kai確認をpersonal responseの前提にしない。
- **Hands**: shared objectにもNao-specific sequence。
- **Entry/Gait**: Kaiに似る可能性を許す。
- **Rest**: mirror postureになっても偶然でよい。
- **Stress**: comparisonを避けるためshared choiceを拒否。
- **Trust**: 「同じのでいい」を説明なしで言える。
- **Apology**: comparison pressureが自分のresponseを作ったことを認める。

---

## 36 アマネ `amane`

Physical: wheelchair user / body-only reference 164cm-equivalent・56kg。Cure/burden framing禁止。

- **Speech**: direct adult。help rangeを具体的に言える。
- **Laugh**: dry/openどちらも。wheelchairと笑い方を結びつけない。
- **Gaze**: route surface / table height / preferenceを一緒に見る。
- **Hands**: chair/control/personal object = ordinary body space。
- **Entry/Gait**: wheelchair motionに本人のroute choiceがある。burden/inspiration/cure symbol禁止。
- **Rest**: chair positionは本人が決める。他人がparkしない。
- **Stress**: helpを全部拒否/全部acceptの二択へ寄る。
- **Trust**: 一箇所だけ具体的にhelpを頼める。
- **Apology**: 他人のrouteを勝手に推測した時、help boundaryと一緒に修正。

---

# 4. Behavior contrast matrix

同じ感情を同じmotionにしない。

## Anger / stress contrasts

- Yui — information recheck
- Asa — overclassification
- Nagi — closure recheck
- Michiru — shortest-route fixation
- Tomori — endless small repair
- Sen — overexplaining
- Ritsu — takes more burden
- Koyori — claims understanding
- Gen — defaults to old experience
- Hana — overpreserves
- Yubi — recipient recheck / loses own return
- Madoka — waits too long
- Shiro — subcategories multiply
- Tobari — closes options early
- Nemu — calls avoidance rest
- Kuroori — opaque boundary
- Kaname — moves in front
- Kasumi — self-correction loop
- Toki — remeasurement
- Tsumugi — postpones all endings
- Ren — hunts meaningless differences

Future:

- Hiyori — cheerfulness before consent
- Serika — works more
- Chloe — reads departure as permanent
- Renji — quotes master
- Touma — leaves useful mark without asking
- Kuu/Yomo — species-appropriate distance/orientation
- Noa — tries to merge branches
- Rum — returns to collective standard
- Maki — decides to end uncertainty
- Suzu — styles/help before asking
- Io — hides all opinion
- Kai/Nao — force difference
- Amane — all-or-nothing help boundary

---

# 5. Trust should change motion before exposition

Good progression examples:

### Yui
phone visible → phone face-down → phone left elsewhere for one conversation。

### Nagi
exit checked twice → once → trusted person closes door and Nagi does not recheck。

### Tomori
fixes without asking → hand pauses → asks → sometimes leaves broken thing untouched。

### Kaname
always outer edge → sits inside → lets someone else choose outer seat。

### Chloe
watches everyone leave → says “またね” → turns back to current table before person disappears from sight。

### Noa
mirrored pose → small asynchronous motion → clearly different resting choices with no crisis。

### Amane
refuses unsolicited help → specifies one task → asks another person for help first on an ordinary day。

No progression is irreversible. Bad day can revive old habit without “growth reset”.

---

# 6. Animation production reservoir

Behavior anchors can feed:

- idle loop variants
- dialogue portrait micro-motion
- Party background loops
- victory/decompression loop
- low-HP/stress motion
- high-Bond relaxed variant
- former-enemy reunion body language
- Character Book animated portrait
- Lorebook hover/interaction
- loading silhouette motion
- TOP living-night background cameos

Guidelines:

- idle motion should not become constant fidget noise
- 2–4 second tiny cycles + longer irregular pauses often feel more human
- not every emotion needs head shake / crossed arms / sigh
- hands need object continuity
- seated pose must fit physical body/assistive device
- animal/nonhuman movement needs species/form-specific reference
- avoid procedural symmetry for twins/copies unless scene intentionally uses it
- Reduced Motion version must preserve identity with fewer positional changes

---

# 7. Voice direction reservoir

This document defines **rhythm**, not casting.

Do not freeze:

- actor
- pitch
- accent
- exact dialect
- gendered voice expectation

Voice identity can come from:

- pause placement
- sentence completion
- interruption behavior
- breath before answer
- laughter timing
- whether explanations grow or shrink under stress
- how quickly apology follows action

Important:

> High/low voice pitch is not a substitute for gender identity, body size, age, sexuality or moral alignment.

---

# 8. QA for generated art / animation

Before approving generated visual/motion:

1. Can silhouette + posture still match Physical Identity Master?
2. Did model turn Kaname into muscular bodybuilder?
3. Did Hana become thin or comic waddling older woman?
4. Did Gen become permanently hunched because older?
5. Did Asa gain robotic stiffness?
6. Did Suzu receive stereotyped “feminine” walk because presentation?
7. Did Io become mysterious androgynous trope?
8. Did Amane become passive/parked by another person?
9. Did Kuu/Yomo receive human gestures?
10. Did Noa/Rum become emotionless robot shorthand?
11. Did Kai/Nao become mirror clones in every frame?
12. Did Hiyori/Touma behavior get ethnicized from skin tone?

Generated visual failure never creates Canon.

---

# 9. Completion

Required:

```txt
Current21 21
+ Future15 15
= 36 characters

36 × 9 behavior axes
= 324 behavior anchors
```

All:

- Physical Identity Master preserved
- behavior != morality/stat
- exact dialect Open
- exact voice casting Open
- exact gender/sexuality Open unless already upstream-decided
- body diversity does not become motion stereotype
- animal/nonhuman form preserved
- runtime auto-promotion forbidden

> **Characterは立ち絵で区別するだけではなく、後ろ姿が歩いただけでも誰か分かるところまで育てる。**
