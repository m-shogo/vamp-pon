# ヨルノシルベ — Historical Incident Ledger v1

Date: 2026-08-11  
Status: **P0 HISTORY FRAME / CANDIDATE INCIDENTS / EXACT DATES UNLOCKED**

> 目的: 世界の歴史を「昔こういう雰囲気だった」で済ませず、制度・場所・物・人物がなぜ今の形になったのかを事件単位で追えるようにする。

---

# 1. Incident entry contract

各事件は最低:

- incidentId
- publicName
- eraConfidence
- realityLayer / nightLayer
- affectedPlace
- affectedInstitution
- knownFacts
- officialExplanation
- witnessVersions
- rumorVersions
- physicalEvidence
- objectLineage
- characterLinks
- whatChangedAfter
- unresolvedGap
- payoffClass: C / B / A
- status

を持つ。

「真相」を最初から一列に書かない。

---

# 2. Era principle

既存History AtlasのRelative Eraを維持する。

- OLD
- TRANSIT
- RECENT
- UNKNOWN

Exact yearはHuman decision前に不要。

人物が高齢だからOLD、若いからRECENTとは判断しない。

---

# 3. Candidate Incident 01 — 無番線案内

`incidentId: INC-ROUTE-001`

Status: `HIGH_VALUE_CANDIDATE`
Payoff: `C/B`
Era: `TRANSIT or UNKNOWN`

## Public name
**無番線案内**（むばんせんあんない）

## Known facts
- 駅の営業終了後、一時的に通常番号ではない方向案内が出た記録がある。
- それを見て移動した複数人の証言で「階段の数」「ホームの幅」が一致しない。
- 翌日、設備上はその番線が存在しない。

## Official explanation Candidate
- 表示機器 / 臨時案内の誤作動。

## Witness versions
- 「使われなくなった旧ホームへ出た」
- 「階段を下りたのに外へ出た」
- 「誰かが帰り道を教えてくれた」

## Objects
- 古い切符
- 改札ばさみ
- 駅前コンパス

## Character hooks
- トバリ / ゲン / ミチルへ接続可能。
- 三人を同時代にしない。

## Guard
朔盟が起こした事件と自動確定しない。

---

# 4. Candidate Incident 02 — 未配達保管延長

`incidentId: INC-POST-001`

Status: `HIGH_VALUE_CANDIDATE`
Payoff: `C/B`
Era: `TRANSIT`

## Known facts
ある郵便取扱所 / 郵便局で、本来返送 / 処分されるはずの持ち主不明封筒を、職員判断で長期間保管していた時期がある。

## Why it matters
悪い秘密組織ではなく、

> 「捨てるのが忍びなかった」

という普通の人の判断が後の物語へ残る。

## Evidence
- 手書きの保留札
- 複数様式の消印
- 宛名が剥がれた封筒

## Character hooks
- ユウビ
- アサ
- カスミ

## Reinterpretation
初見: 届かなかった郵便。
後: 誰かが「まだ捨てない」を選び続けた記録。

---

# 5. Candidate Incident 03 — 地図改訂連鎖

`incidentId: INC-ROUTE-002`

Status: `HIGH_VALUE_CANDIDATE`
Payoff: `B/A`
Era: `MULTI_ERA`

## Known facts
同じ一帯の地図が何度も改訂され、
- 道の廃止
- 呼称変更
- 迂回路
- 一時的な通行止め

が重なった。

後世の版だけ見ると「昔の地図が間違い」に見えるが、当時は正しかった版もある。

## Theme
> 正解は時点によって変わる。

## Character hooks
- ゲン: 古い道が当時は正しかった
- ミチル: 今歩ける道を選ぶ
- トキ: 測定と記録
- ミチグレ: 間違う可能性を消すため道を減らす

## Strong payoff
朔盟思想の反証を説明台詞でなく地図そのもので見せられる。

---

# 6. Candidate Incident 04 — 白紙台帳保存

`incidentId: INC-ARCHIVE-001`

Status: `CANDIDATE`
Payoff: `C/B`
Era: `UNKNOWN`

## Known facts
記録所で、内容不明 / 読めない資料を捨てずに「未分類」として別棚へ残した運用記録がある。

## Conflict
後任者は:
- 整理不足
- 不要資料

と評価。

別の人物は:
- 分からないから残した

と評価。

## Character hooks
- シロ
- ハナ
- セン
- ハクマ

## Theme
空白 = 無価値ではない。

---

# 7. Candidate Incident 05 — 継火修理記録

`incidentId: INC-LAMP-001`

Status: `HIGH_VALUE_CANDIDATE / OBJECT LINEAGE DEPENDENT`
Payoff: `B/A`
Era: `OLD → later unknown`

## Known facts
- あるランタン / 同系統灯具に、異なる年代の修理痕が複数ある。
- 少なくとも一箇所はトモリの修理languageと整合する候補。
- 後にユイの中心vesselとなるランタンとの同一性は要evidence。

## Guard
「トモリがユイへ直接渡した」をまだCanon化しない。

## Emotional payoff
> 会ったことのない時代の誰かの手仕事を、主人公が毎晩握っている。

血縁に頼らない継承。

---

# 8. Candidate Incident 06 — 押花避難帳

`incidentId: INC-CIVIC-001`

Status: `CANDIDATE`
Payoff: `C`
Era: `UNKNOWN`

## Known facts
災害 / 避難時の名簿Candidateに、名前だけでなく小さな押花が挟まれていた記録。

## Important
大災害を作ること自体が目的ではない。

押花は:
- 誰が無事だったか
- 何月頃だったか
- 誰かが名簿を生活物として扱った

というevidenceになる。

## Character hooks
- ハナ
- コヨリ
- アサ

## Human gate
災害種別 / 犠牲者数 / Current人物への直接被害は未LOCK。

---

# 9. Candidate Incident 07 — 名前訂正騒動

`incidentId: INC-NAME-001`

Status: `CANDIDATE`
Payoff: `C/B`
Era: `RECENT or TRANSIT`

## Known facts
掲示 / 名簿 / 荷札などで、誤った名前が訂正された。

問題は訂正そのものではなく:
- 本人確認前に別の「正しい名前」へ置換された例
- 古い誤記が長く残った例

が混在すること。

## Character hooks
- アサ
- カスミ
- ナシロ
- ペタ

## Theme
名前を正すことと、本人より先に決めることは違う。

---

# 10. Candidate Incident 08 — 夜明け前の閉鎖区画

`incidentId: INC-GATE-001`

Status: `CANDIDATE`
Payoff: `B`
Era: `UNKNOWN`

## Known facts
安全確保のため閉鎖された区画が、解除条件 / 解除期限だけ失われた記録Candidate。

## Institutional reading
当初は合理的な保護措置。

## Later problem
「今は入れない」が「永遠に開けない」へ変わる。

## Character hooks
- ナギ
- トバリ
- アサトジ
- カナメ

## Theme
守ることの期限。

---

# 11. Incident cross-link rules

一つの事件へ全キャラを接続しない。

目安:
- direct witness: 0–3
- indirect evidence: 1–5
- later reader: 制限なし

「実は全員あの日あの場所にいた」を禁止。

---

# 12. Official record ≠ truth

各Incidentは少なくとも:

```txt
official record
witness memory
physical evidence
later interpretation
```

を分離可能にする。

どれか一つを作者の神視点としない。

---

# 13. Happy-End compatibility

Historical tragedyは存在してよい。

ただし:
- 今作の救いを「過去改変で全部なかったこと」にしない。
- 犠牲者の存在を伏線の鍵だけにしない。
- 過去に起きたことの意味を一つへ固定しない。

ヨルノシルベの救いは:

> 過去を消すことではなく、現在の人がその過去に対して新しい行動を選べること。

---

# 14. Incident escalation plan

Title1で最初から8件全部をMain Storyへ出さない。

### Main-facing
- 2〜3件

### Optional report
- 3〜4件

### Series seed
- 1〜2件

程度を目安にする。

具体配分はMystery Payoff Ledgerで管理。

---

# 15. Next evidence work

今後:
- Stage20とのexact placement
- Named Object lineageとのID接続
- Current21 Knowledge Matrixとの接続
- Institution official records
- Reality/Night visual evidence

を追加する。

Exact西暦・死者数・Current人物の家族被害はHuman decisionまで保留する。