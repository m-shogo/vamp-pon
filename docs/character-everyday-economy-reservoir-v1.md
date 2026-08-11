# ヨルノシルベ — Character Everyday Economy Reservoir v1

Date: 2026-08-12  
Status: **AUTHOR RESERVOIR / NON-CANON / NO INCOME-CLASS FREEZE / NO MORAL MONEY SCORE**

Machine source:

- `src/game/data/characterEverydayEconomyReservoir.ts`

Related:

- `docs/character-lived-artifact-reservoir-v1.md`
- `docs/character-competence-learning-reservoir-v1.md`
- `docs/character-environment-sensory-reservoir-v1.md`

## Purpose

日常の人物差は「何を持っているか」だけでなく、**買うか迷う・値段を見る・借りる・割る・貯める・贈る・揉めた後に直す**にも出る。

このReservoirは全36人へmoney / resourceの生活感を追加するが、収入・階級・貧困・資産・職業をCanon化しない。

---

# 1. Seven axes

1. `PURCHASE_DECISION`
2. `PRICE_ATTENTION`
3. `BORROW_LEND`
4. `SHARED_EXPENSE`
5. `SAVE_SPEND_TENSION`
6. `GIFT_VALUE`
7. `MONEY_CONFLICT_REPAIR`

Target:

```txt
36 characters × 7 axes = 252 everyday-economy anchors
```

---

# 2. Hard boundaries

This Reservoir does not freeze:

- exact income
- family wealth
- social class
- debt
- bank balance
- salary
- exact historic prices
- exact payment method
- exact Future economy system
- exact job
- runtime currency behavior

Forbidden shortcuts:

- generous = good person
- frugal = poor
- expensive taste = rich
- old Era = everyone poor
- postwar = personality defined by scarcity
- rural origin = frugal
- city origin = spendthrift
- woman / feminine presentation = shopping好き
- man = toolに金を使う
- queer Character = fashion spending
- wheelchair user = dependent expense
- Robot / Android = resource cost means ownership by creator
- dog / cat = Human money concept

> **money habit != morality != class != intelligence**

---

# 3. Current21 highlights

| Character | Economy identity highlight |
|---|---|
| ユイ | duplicateを避け、shared useを先に確認。小さな recurring costをよく見る。 |
| アサ | ownership / use / return ruleを整理するが、最適化を本人のchoiceより上に置かない。 |
| ナギ | privacy / lock-in / hidden recurring costも価格の一部として見る。 |
| ミチル | priceだけでなくroute / time / replacement costも含めて判断。 |
| トモリ | repairabilityだけでなくowner preference / safety / laborを含めてrepair-or-replace。 |
| セン | cost structureを説明できるが「最も綺麗なsplit formula」を押し付けない。 |
| リツ | shared needを先に払いすぎる癖Candidate。自分の負担もshareする成長余地。 |
| コヨリ | age-appropriateな小さい選択でprice scaleを学ぶ。adult financial dutyは背負わせない。 |
| ゲン | old priceを覚えていてもcurrent price否定の証拠にはしない。 |
| ハナ | unit priceだけでなくstorage / spoilage / duplicateをコストとして見る。 |
| ユウビ | route / transit / handoff時間も実コスト。自分のreimbursementを後回しにしがち。 |
| マドカ | actual useを観察してから買う。待ちすぎてuseful timingを逃す失敗もある。 |
| シロ | source / edition / access / retentionを比較。personal relationshipまでreceipt化しない。 |
| トバリ | flexibility / return optionに価値を見る。人の帰還を金で管理しない。 |
| ネム | comfortをfunctionの一部として支出できる。休息をluxury shameにしない。 |
| クロオリ | privacy / reversibility / lock-inもcost。個別amountをpublicにしすぎない。 |
| カナメ | 正しいfit / clearance / safe toolに普通にお金がかかる。body shameへしない。 |
| カスミ | option比較がdecision avoidanceへ変わることがある。 |
| トキ | ruleは作れるがconsistency = fairnessではない。giftもbalance ledger化しすぎない。 |
| ツムギ | materialだけでなくrepair labor / process historyも価値として見る。 |
| レン | price-quality correlationを仮説として扱い、因果と決めない。 |

---

# 4. Future15 highlights

Future15は情報量が増えてもCurrent21へ昇格しない。

| Character | Economy identity highlight |
|---|---|
| ヒヨリ | fun / styleへの支出をimpulsive gyaru stereotypeにしない。先に他人のbudgetを聞く成長余地。 |
| セリカ | polished / formal expenseを扱えるが、頼まれていない費用をcoverしてcontrolしない。 |
| クロエ | Eraごとに価値・通貨・慣習が違う。long-lived = timeless financial wisdomではない。 |
| レンジ | craft material / tool / laborを学ぶ。師弟 = 永久の恩義 / unpaid laborにしない。 |
| トウマ | craft laborとauthorshipにpriceを持たせる。skin / sexualityとは無関係。 |
| クウ | dogはHuman priceを理解しない。care costはHuman household側の責任。 |
| ヨモ | multiple-home care costを「誰の猫か」を決める材料にしない。 |
| ノア | Future resource systemはOpen。creator cost = ownership debtにしない。 |
| ルム | fleet maintenance cost = instanceの存在価値ではない。 |
| マキ | decision speedとspending speedを同一化しない。big gestureのpressureも見る。 |
| スズ | style costをfeminine / queer stereotypeにしない。 |
| イオ | object choice / priceからgenderを匂わせない。 |
| カイ | quick low-stakes purchase。ナオのbudgetを代弁しない。 |
| ナオ | hidden follow-up costを見る。慎重すぎてtimingを逃すこともある。 |
| アマネ | accessibility surchargeを「本人だけの追加費用」に自動化しない。 |

---

# 5. Shared expense is relationship material

Examples:

- who suggests split first
- equal split vs actual use
- someone opts out
- accessibility cost
- household shared item
- replacement after accidental damage
- volunteer labor
- food / travel / ticket / tool
- someone paid first

重要:

> **平等なsplitと公平なsplitは同じとは限らない。**

Characterの価値観差を出してよいが、善人/悪人判定へしない。

---

# 6. Borrowing is not trust score

借りる / 貸すは:

- owner preference
- due / return timing
- condition
- privacy
- safety
- shared use
- hygiene
- animal welfare

等のcontextで変わる。

「貸してくれた = 好感度高」「貸さない = 冷たい」にはしない。

---

# 7. Gift value

Giftは値段より:

- shared memory
- recipient choice
- usability
- no-obligation
- repair / handmade consent
- body fit
- place memory
- personal observation

等にCharacter差を出す。

高額giftは好意の強さmeterではない。

---

# 8. Era research boundary

実装 / Canon化前に調査する:

- historical wages / prices
- payment methods
- rationing / scarcity if actually relevant
- transport cost
- household accounting practice
- gift custom
- local market / store history
- Future economic system

過去Eraだからscarcity personalityにしない。

特にトモリ等のpostwar laneでも:

`repair culture != poverty personality`

を維持する。

---

# 9. Nonhuman / Future

## Kuu / Yomo

Human household manages currency.

```txt
animal preference != price knowledge
care cost != ownership right
care expense != animal moral debt
```

## Noa / Rum

Future economic institution is Open。

```txt
resource allocation != ownership of person
maintenance cost != worth of existence
creator cost != debt of identity
network efficiency != personal value
```

---

# 10. Accessibility / body fit

Kaname / Hana / Amane等で:

- correct fit
- chair / body space
- route access
- material quantity
- durability
- specialized or nonstandard product when actually needed

は現実のcostになり得る。

ただし:

- larger body = wasteful
- wheelchair = expensive burden
- older body = care cost

というCharacter judgmentへしない。

---

# 11. Production boundary

No automatic connection to:

- runtime coin
- shop prices
- character upgrade cost
- weapon economy
- gacha
- player wallet
- relationship affection

`runtimeCurrencyBehaviorAutoPromoted = false`

Future Author DB candidate dimension:

`everydayEconomy`

---

# 12. QA

- [ ] 36 characters
- [ ] 7 axes each
- [ ] 252 anchors
- [ ] no exact income/class freeze
- [ ] no morality from generosity/frugality
- [ ] no Era/origin stereotype
- [ ] no gender/sexuality shopping stereotype
- [ ] no disability dependency framing
- [ ] animals do not own Human currency by default
- [ ] Future economy remains Open
- [ ] no runtime currency promotion

Guiding principle:

> **何を買うかより、「何を価値だと思い、誰とどう分け、間違えた時どう払い直すか」にCharacterが出る。**
