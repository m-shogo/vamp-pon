# ヨルノシルベ — Character Communication Habit Reservoir v1

Date: 2026-08-12  
Status: **AUTHOR RESERVOIR / NON-CANON / ERA-TECH-AWARE / NO AFFECTION SCORING**

Machine source:

- `src/game/data/characterCommunicationHabitReservoir.ts`

Related:

- `docs/character-behavior-identity-reservoir-v1.md`
- Current21 directed speech / all-pair speech sources
- `docs/character-competence-learning-reservoir-v1.md`
- `docs/character-author-db-schema-and-coverage-v1.md`

## Purpose

既存のdirected speechは「相手ごとの話し方」が中心。
このReservoirは別軸で、全36人について**どう連絡を始め、どれくらいの間で返し、どの媒体を選び、誤りを直し、何を記録に残すか**を持たせる。

使い道:

- ordinary-life scene
- family / home scene
- relationship event
- Era gap comedy
- group scene
- missed-call / delayed-reply / letter / note / terminal / voice scene
- Character Book
- Lorebook / author DB

---

# 1. Eight axes

1. `INITIATION` — 何から話を始めるか
2. `RESPONSE_RHYTHM` — ack / full reply / pause / returnの癖
3. `CHANNEL_CHOICE` — そのEraで使える媒体の選び方
4. `CORRECTION_STYLE` — 間違いをどう訂正するか
5. `GROUP_CONVERSATION` — 複数人でどう振る舞うか
6. `HOME_REGISTER` — family / chosen family / trusted peopleで変わるregister
7. `CONFLICT_CHANNEL` — 揉めた時にどこで話すか
8. `ARCHIVE_TRACE` — 何を記録として残す / 消すか

Target:

```txt
36 characters × 8 axes = 288 communication anchors
```

---

# 2. Era technology boundary

**communication habitとcommunication deviceは別。**

禁止:

- historical Characterへsmartphone / group chat / DMを自動付与
- Future Characterは全員brain-network
- Present Characterは全員即レス
- handwritten letter = old-fashioned personality
- phone call = extrovert
- text = introvert
- delayed reply = affectionが低い
- fast reply = affectionが高い

Eraごとに実装する時は、その時代で成立する:

- face-to-face
- messenger / runner
- note / letter / postcard
- household telephone
- public / workplace phone
- pager / early mobile
- SMS / email
- modern messaging / voice / video
- future network / terminal / local signal

等から調査して選ぶ。

`exactDeviceOrAppFrozenHere = false`

---

# 3. Current21 highlights

| Character | Communication identity highlight |
|---|---|
| ユイ | まず短いcontextを返し、調べた後でfull reply。大事な会話はnotificationより人へ戻す。 |
| アサ | structured messageは得意だが、人をsystem fieldへ押し込まない。Personal replyは即答しないこともある。 |
| ナギ | audience / permissionを先に見る。Private errorはprivateに、public record errorはpublicに直す。 |
| ミチル | route / location / changeから話し始める。移動中はshort update、停止後にdetails。 |
| トモリ | toolを安全に止めてから重要会話。repair noiseを会話回避に使わない。 |
| セン | 一文で始めても説明が膨らみやすい。group conversationを授業化しすぎない。 |
| リツ | taskには即答、own limitには遅れがち。コヨリの代弁者にはしない。 |
| コヨリ | 直接whyを聞く。childだからmodern deviceを自動所持させない。 |
| ゲン | 新channelも人に教わって使える。old methodをstatus identityにしない。 |
| ハナ | practical handoffから会話へ入る。older woman = tech嫌いにはしない。 |
| ユウビ | arrival / handoff / delayを短く伝える。route中とsafe stop後でreply densityが変わる。 |
| マドカ | 先に観察して返事が遅れやすい。無言を好感度値にしない。 |
| シロ | Factはsource / versionを残す。Personal conversationはarchive化しすぎない。 |
| トバリ | 出る / 戻る / route changeの確認は得意だが、人を追跡するCharacterにはしない。 |
| ネム | pause可能なchannelを好むCandidate。休憩にはreturn pointを持たせる。 |
| クロオリ | audience boundaryを先に確認。privacyをaccountability回避に使わない。 |
| カナメ | 「手伝う？」ではなく何をしてほしいか聞く。Body sizeとcommunication styleは別。 |
| カスミ | provisional draftからhard topicへ入れるが、最後は自分のchoiceを言う。 |
| トキ | timing / pendingを整理するが、casual chatをschedule化しない。 |
| ツムギ | partial state / sampleを共有する。説明も全部作り直さず必要箇所だけ解く。 |
| レン | inferenceとactual quoteを分ける。confidenceも訂正対象にする。 |

---

# 4. Future15 highlights

Future15は情報が増えてもCurrent21へ昇格しない。

| Character | Communication identity highlight |
|---|---|
| ヒヨリ | lively inviteでもdecline optionを残す。即レス・social activityをskin/presentationと結びつけない。 |
| セリカ | formal/casualを関係とstakesで切り替える。自動chairpersonにしない。 |
| クロエ | そのEraのchannel conventionを学ぶ。長寿 = 全媒体に精通ではない。 |
| レンジ | masterへのdeferenceを減らし、own viewを言えるようになる。 |
| トウマ | authorship / briefは直接話す。skin tone / sexualityからcommunicationを逆算しない。 |
| クウ | Human messageを送らない。species-appropriate cue / approach / vocalization。 |
| ヨモ | Human chatをしない。複数homeでcall name / routineが違ってよい。 |
| ノア | processing speedが速くてもpersonal replyは即レス義務ではない。 |
| ルム | fleet channelとinstance personal communicationを分ける。 |
| マキ | decision neededかどうか自体を確認する成長余地。 |
| スズ | visual / voice / text choiceをfeminine presentationから固定しない。 |
| イオ | labelを急がないが、必要なworking termまで拒否しない。 |
| カイ | first replyが速い。ナオの代弁はしない。 |
| ナオ | entry timingを待つ。カイのtranslatorにはしない。 |
| アマネ | access infoを具体的に伝える。disabled people全体のspokespersonにはしない。 |

---

# 5. Reply timing is not relationship score

同じCharacterでも:

- route中
- work中
- family time
- emergency
- low battery / network unavailable
- historical mail delay
- Future network congestion
- emotional pause

等で返答時間は変わる。

> **返信速度 = 好感度** にしない。

恋愛 / friendship sceneでreply delayを使う場合も、必ずcontextと本人の通常habitを分ける。

---

# 6. Correction is Character material

誤送信 / 誤解 / 古い情報 / 誤ったroute / 名前 / category / audienceを間違えることは普通にある。

Character差は:

- silently editしない
- erratumを残す
- private correction
- public correction
- source update
- ownerへ聞き直す
- revised draftを出す
- old versionを保管する / 消す

などに出す。

「間違えない人」を賢さ表現にしない。

---

# 7. Home register and dialect

`HOME_REGISTER`はbloodline証明ではない。

- family
- childhood friend
- chosen family
- old coworker
- long-term mentor
- sibling
- same-region friend

などで語彙・速度・敬語・省略・方言残留が変わってよい。

ただし:

- 方言 = comedy
- 方言 = emotional truth detector
- 共通語 = fake self

にはしない。

既存dialect authorityを上書きしない。

---

# 8. Archive / privacy

CommunicationがDBへ残る世界でも、**保存できる = 保存すべき**ではない。

Characterごとに:

- practical noteだけ残す
- decision reasonを残す
- source versionを残す
- personal contentは消す
- access logとcontentを分ける
- animal care logはHuman側が持つ
- collective memoryとpersonal memoryを分ける

等を持てる。

Noa / Rumは特に:

```txt
storage capability != consent to store
shared network != shared personal memory
complete log != complete understanding
```

---

# 9. Representation guards

- Kaname body size does not define loudness / bluntness.
- Hana/Gen age does not define slow reply or technology avoidance.
- Hiyori/Touma skin tone does not define communication culture.
- Suzu presentation does not define emoji/visual/voice preference.
- Io gender undisclosed does not define mysterious minimal speech.
- Amane wheelchair use does not make communication passive or caregiver-mediated.
- Noa/Rum processing/network ability does not force instant replies.
- Kuu/Yomo do not become Human-language communicators.
- Kai/Nao do not share identical reply timing or wording.

---

# 10. Production boundary

This Reservoir does not directly configure:

- dialogue runtime
- messenger UI
- actual phone/app assets
- relationship affection points
- NPC AI
- save logs
- privacy policy

`runtimeAutoPromotionAllowed = false`

Future Author DB dimension candidate:

`communicationHabit`

---

# 11. QA

- [ ] 36 characters
- [ ] 8 axes each
- [ ] 288 anchors
- [ ] no exact device/app freeze
- [ ] Era tech boundaries preserved
- [ ] reply timing != affection
- [ ] channel choice != morality/personality diagnosis
- [ ] family register != bloodline proof
- [ ] no gender/sexuality communication stereotype
- [ ] no disability passivity framing
- [ ] artificial body != instant response
- [ ] animals remain non-Human communication
- [ ] Future15 no promotion
- [ ] runtime no promotion

Guiding principle:

> **Characterは「何を言うか」だけでなく、いつ返すか、どこで話すか、間違えた時どう直すかでも覚えられる。**
