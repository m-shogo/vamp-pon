# ヨルノシルベ — Master Authoring Professional Standard v1

Date: 2026-08-12  
Status: **TOP-LEVEL AUTHORING GOVERNANCE / REQUIRED FOR NEW OR UPDATED DESIGN MASTERS**

## 0. Purpose

ヨルノシルベのMasterを、チャット中の思いつきメモやAIのもっともらしい補完ではなく、**商業作品で長期運用できる制作Authority**として保つための上位規約。

この規約はCharacter / World / Scenario / Relationship / Visual / Generation Masterの内容そのものを決めない。

代わりに:

- 何をMasterへ入れてよいか
- 何をCandidateのまま残すか
- 何をユーザー確定と呼べるか
- 推測をどう扱うか
- 例外をどう記録するか
- 生成AIへ何を強制するか
- 後から設定を変えた時どう追跡するか

を定義する。

---

# 1. Master is authority, not brainstorming

Masterへ入る文章は、最低でも次のいずれかでなければならない。

- `USER_DECIDED` — ユーザーが明確に決定した
- `EXISTING_CANON` — 既存Current Authorityから直接引ける
- `RESEARCH_BACKED_CURRENT` — Source付き研究から現在採用している設計
- `AUTHOR_CANDIDATE` — 制作上必要な仮設定だが未確定であることを明示
- `OPEN` — 意図的に未決定

**AI推測を無印の本文へ混ぜない。**

「たぶんこの人はこうする」は `AUTHOR_CANDIDATE`。
「ユーザーがこう言った」は `USER_DECIDED`。

---

# 2. Required fields for a professional Master rule

重要なルールは可能な限り次を持つ。

1. **statement** — 何が決まっているか
2. **authority** — USER_DECIDED / EXISTING_CANON / RESEARCH_BACKED_CURRENT / AUTHOR_CANDIDATE / OPEN
3. **scope** — 誰・どのEra・どのasset・どのsceneへ適用するか
4. **rationale** — なぜ必要か
5. **positive target** — 何を目指すか
6. **forbidden shortcut** — AIがやりがちな雑な代替
7. **exception rule** — 例外が成立する条件
8. **conflict rule** — 他Masterと衝突した時の優先順位
9. **review evidence** — 何を見れば守れていると判定できるか
10. **downstream effect** — Character Master / prompt / scene / runtime等へどう効くか

禁止事項だけでMasterを構成しない。

---

# 3. Canon certainty must remain visible

## 3.1 USER_DECIDED

ユーザーが明確に決めた事実。
AIは勝手に弱めたりCandidateへ戻さない。

## 3.2 EXISTING_CANON

既存Master / database / Current sourceから直接確認できる事実。
Source pathを保持する。

## 3.3 RESEARCH_BACKED_CURRENT

史実・生活史・技術・制作研究から得たCurrent設計。
Research sourceとfiction translationを分離する。

## 3.4 AUTHOR_CANDIDATE

AI/作者側が整合のため提案した仮値。
**画像に一度出たからCanonへ昇格しない。**

## 3.5 OPEN

未決定を意味する。
OPENはimage model freedomではない。
生成に必要なOPENはauthoringへ戻すか、明示的なtemporary candidateを作る。

---

# 4. Character Master quality bar

Characterの重要設定は見た目のnounだけでなく、**behavioral consequence**を持つ。

悪い:
- ピアスなし
- 露出少なめ
- 修理好き

良い:
- ピアスを開けない。装飾目的のbody modificationを本人が選ばない。ceremony等の例外も現在なし。
- 胸元/腹/背中の露出を本人は日常服で避ける。暑さ対策は袖・素材・通気で解決する。
- 壊れた物は交換前に修理可否を見る。服にも補修履歴が残り得るが、汚れ放置とは別。

つまり**選択 → 行動 → visual consequence**まで書く。

---

# 5. World Master quality bar

固有名詞だけで世界を作らない。

場所・制度・時代設定は最低でも:

- 誰が使う
- 普段何をする
- 何を持つ
- 何に困る
- 何を直す
- どう古びる
- どう移動する
- どう待つ
- どう連絡する
- 何が普通だと思われている

へ落とす。

Visual motifは機能・素材・構造へ翻訳する。

---

# 6. Scenario Master quality bar

Characterの設定を説明台詞に変換しただけのsceneを完成扱いしない。

重要sceneは:

- ordinary task
- immediate want
- hidden pressure
- relation movement
- world/era evidence
- physical acting
- choice
- consequence
- after-state

を持つ。

成長はclimax宣言だけでなく、後の日常行動に残す。

---

# 7. Relationship Master quality bar

関係は一つの親密度scoreへ圧縮しない。

呼称・距離・接触・貸し借り・沈黙・頼み方・断りやすさ・冗談・怒り・修復・appearance interventionを分離する。

既存Relationship Authorityにない:
- romance
- gift
- matching accessory
- touch permission
- borrowed object
- appearance change

を画像生成AIへ発明させない。

---

# 8. Image-generation readiness gate

Character Master生成へ進む前に最低限:

1. identity authority resolved
2. body / age / posture resolved
3. Living Visual Profile loaded
4. exposure policy resolved
5. piercing / tattoo / body modification policy resolved
6. clothing preference / refusal resolved
7. material / maintenance logic resolved
8. Era Life loaded when applicable
9. relationship visual history is either source-backed or explicitly absent
10. World/Council/Designer authorities loaded
11. OPEN required fields are zero, or generation is explicitly marked exploratory-only

生成AIは**design decision maker of last resortではない**。

不足設定を見つけた場合、綺麗に補完するよりauthoringへ戻す。

---

# 9. Visual review is evidence, not canon creation

生成画像を見て:

- 好き
- 嫌い
- この顔は残す
- この服は違う
- この露出は本人じゃない
- この姿勢は合う

というfeedbackを得たら、Feedback Ledgerへ記録する。

一回の画像採用から:
- 新しいピアス
- 新しい刺青
- 新しい傷
- 新しい恋愛小物
- 新しい身体特徴

を自動Canon化しない。

昇格にはhuman reviewを要求する。

---

# 10. Change management

Masterを変更する時:

- 何を変更したか
- 以前は何だったか
- なぜ変えたか
- 影響するCharacter / scene / asset
- 再生成が必要か
- 既存画像をlegacyにするか

を追跡可能にする。

設定変更でstable character IDやrelation IDを不用意に変えない。

---

# 11. Contradiction policy

衝突時の原則:

```txt
USER_DECIDED
> CURRENT WORLD / CHARACTER / RELATION CANON
> source-backed Living / Appearance / Era Master
> cross-discipline design masters
> AUTHOR_CANDIDATE
> generation prompt
> generated image
```

生成画像は上位Authorityではない。

**画像にそう描かれたから設定を合わせる、を原則禁止する。**

ただしユーザーが画像を見て明示的に採用した場合は別途Masterへ昇格する。

---

# 12. Professional review questions

Masterへ新項目を入れる前に問う。

1. これは事実か、推測か、候補か？
2. 誰の視点の設定か？本人・社会・Designerを混同していないか？
3. 日常でどう現れる？
4. 異常時にどう歪む？
5. 見た目に必要なら、なぜその形なのか？
6. 他キャラへ入れ替えても成立するgeneric設定ではないか？
7. 世界・人物・関係・物語のうち最低2層と接続しているか？
8. AIが誤解しやすいshortcutは何か？
9. 例外条件はあるか？
10. 生成後に何を見て合否判定するか？

答えられない重要項目はMaster確定を急がない。

---

# 13. Positive target

ヨルノシルベのMaster群は、設定量の多さを目標にしない。

**別のAI・別のsession・別の制作担当が読んでも、同じ世界で同じ人物を同じ判断基準で扱えること。**

そのために:
- certaintyを偽らない
- blankをAIへ丸投げしない
- visualだけで人物を決めない
- loreだけで世界を決めない
- dialogueだけで成長を決めない
- generated imageをCanon sourceにしない

を守る。
