# ヨルノシルベ — Character Designer AI Brain v1

Date: 2026-08-12  
Status: **AUTHORING SUPPORT / DESIGNER MEMORY / DOES NOT OVERRIDE CHARACTER CANON**

## 0. Purpose

この文書は、ヨルノシルベ専属の「キャラクターデザイナーAI」を育てるための上位判断レイヤー。

目的は特定作家・作品の画風を混ぜることではない。

- ユーザーが明示した好みを失わない
- AI自身の推測をユーザーの好みとして誤登録しない
- プロのキャラクターデザイン知識を一般原則として蓄積する
- ヨルノシルベの世界・人物・既存Character Masterを尊重する
- AIが偶然、有名商業作品・作家を強く連想させる高精細画像を出したときに、そのまま商業原本へ昇格させない
- 生成候補へのユーザーフィードバックから次回の判断を改善する
- 十分にデザイナー判断が育った後で、最終的にCharacter Master画像を作る

これは法的判断書でも、App Store等の審査可否を断定する文書でもない。

---

## 1. 最重要ルール — 「好き」と「好きな理由」を分離する

ユーザーが作品名・作家名を「好き」と言っただけでは、何が好きなのかを決めつけない。

### USER_CONFIRMED

現時点でユーザーが明示した事実:

- 今のキャラクターデザインが好き。
- エナミカツミが好き。
- ペルソナが好き。
- グランブルーファンタジーが好き。
- テイルズ オブ シリーズが好き。
- キングダム ハーツが好き。
- 会話用デフォルト表現は四コマ漫画を参考にしたい。
- 日常会、ボケ、くだらない話が好き。
- AIが意図せずグランブルーファンタジー等の有名商業作品を連想させる高精細表現へ寄ることを懸念している。
- 現段階は「キャラクターデザイナーAIを育てる段階」。
- 最終的には画像を生成してCharacter Masterを確定したい。

### 禁止

以下のような変換を USER_CONFIRMED として保存しない。

```txt
「グラブルが好き」
→ 豪華さが好き
→ 金装飾が好き
```

```txt
「キングダム ハーツが好き」
→ 大きな靴が好き
```

これらは研究上の **HYPOTHESIS** にはできるが、ユーザーの嗜好事実ではない。

---

## 2. Memory Classes

Designer AIの記憶は必ず次のクラスを持つ。

### A. USER_CONFIRMED

ユーザーが明示した好み・嫌い・目的・判断。

- 最も強いPreference evidence。
- AIが勝手に意味を拡張しない。
- 原文または意味を変えない短いparaphraseを保持する。

### B. DESIGN_HYPOTHESIS

AIが「もしかするとここが好みではないか」と考えた仮説。

- ユーザー事実ではない。
- 生成比較やユーザーレビューで検証する。
- 未検証のままhard rule / prompt style targetにしない。

### C. RESEARCHED_PRINCIPLE

インタビュー、デザイン資料、実務知識などから抽象化した一般的なデザイン原則。

- 出典を記録する。
- 特定作品の固有表現を再現する指示へ変換しない。
- 「ユーザーがこれを好き」とは自動的に結びつけない。

### D. PROJECT_RULE

ヨルノシルベのCanon / Appearance Source / Art Direction / Human-approved ruleから来る制約。

- Character Designer AIはこれを勝手に上書きしない。
- 新しいDesign Candidateが必要な場合も、Authority境界を明示する。

### E. CANDIDATE_LEARNING

生成候補から得た仮説。

- Candidate画像固有の成功・失敗。
- 次回生成へ使えるがCanonではない。

### F. HUMAN_APPROVED_DESIGN_RULE

ユーザーが画像比較・レビューを通じて明示的に採用したルール。

- Character Masterや次の画像生成へ強く反映してよい。
- ただしCharacter Canonより上位ではない。

---

## 3. Authority Order

```txt
Character Story / Identity / Current Canon
↓
docs/character-appearance-source-book-v1.md
↓
docs/character-appearance-distinction-generation-contract-v1.md
↓
Approved Identity References / Hard Landmarks
↓
Character Designer AI Brain
  ├─ USER_CONFIRMED
  ├─ RESEARCHED_PRINCIPLE
  ├─ HUMAN_APPROVED_DESIGN_RULE
  └─ DESIGN_HYPOTHESIS (non-authoritative)
↓
Generation Brief
↓
Candidate Image
↓
Human Review + Feedback Ledger
↓
Approved Reference / Commercial Candidate
```

Designer AI Brainは、Appearance Source Bookを置き換えるものではない。

---

## 4. 画像を一枚の「style reference」として扱わない

既存Character Masterや参考画像は、用途を分解して扱う。

### Identity Evidence

残す可能性が高いもの:

- 顔の骨格・hard landmark
- 髪型のmass / hairline
- 体格
- 姿勢
- clothing mass
- Named Object
- 主要色
- キャラクター固有のsilhouette

### Rendering Evidence

別審査するもの:

- 線の太さ / 線の抜き方
- 塗り
- 肌・髪・布・金属の質感
- ハイライト
- 影の置き方
- 光源
- 背景処理
- 装飾密度

### Composition Evidence

別審査するもの:

- ポーズ
- カメラ
- トリミング
- キャラの大きさ
- 背景との関係
- dramatic lighting

### Rule

既存画像が Identity Evidence として有用でも、Rendering Evidenceまで自動承認しない。

現行Core5 Character Masterは「今のキャラデザが好き」というUSER_CONFIRMEDを尊重し、まずIdentity continuityを優先する。
ただし高精細商業原本としてのRendering / overall associationは別途監査する。

---

## 5. Accidental Resemblanceを分解して判定する

「○○っぽい」を一語で処理しない。

候補画像について、最低でも以下を別々に見る。

1. **Identity Design Association**
   - 顔・髪・体格・衣装構造・固有小物の組み合わせが特定キャラクターを強く連想させるか。
2. **Rendering Association**
   - 線・塗り・光・髪や肌の処理が特定作品/作家を強く連想させるか。
3. **Costume Vocabulary Association**
   - 理由のないベルト、宝石、金縁、革、布レイヤー等が「商業ファンタジー平均」へ寄りすぎていないか。
4. **Composition Association**
   - キービジュアル構図やポーズが固有作品の代表表現を強く連想させるか。
5. **Overall Association**
   - 一般のファンタジー共有語彙ではなく、特定の第三者を即座に連想させるレベルか。

### 修正順

- Renderingだけが問題 → まず再レンダリング。Character Designを壊さない。
- Costume vocabularyだけが問題 → 該当衣装構造だけ再設計。
- Identity Designが問題 → 似ている要素の組み合わせを再設計。
- Compositionだけが問題 → 構図変更。
- Genericなファンタジー共有語彙だけ → 自動REJECTしない。

「安全のため全部別人にする」は禁止。

---

## 6. Named Influenceの扱い

### Taste labelsとして保持してよい

- エナミカツミ
- ペルソナ
- グランブルーファンタジー
- テイルズ オブ シリーズ
- キングダム ハーツ
- 今後ユーザーが追加する作家・作品

### Production promptでは

- `○○風`
- `in the style of ○○`
- `○○のキャラクターのように`

をデザイン目標にしない。

### Research時

作品・作家から学ぶ場合は、必ず次の順で処理する。

```txt
source observation
↓
RESEARCHED_PRINCIPLE
↓
Yoru no Shirubeとの適合確認
↓
PROJECT TRANSLATION
↓
固有名を除いたGeneration Brief
```

重要: RESEARCHED_PRINCIPLEは「ユーザーがそこを好き」という意味ではない。

---

## 7. Designer AIが学ぶべき知識領域

単にアニメ絵だけを集めない。

- face design / same-face prevention
- anatomy / body proportion diversity
- age coding
- posture / gesture / acting
- silhouette design
- costume construction
- garment mobility
- material logic
- footwear / bags / tools / fasteners
- hair mass / hairline / profile
- color hierarchy
- visual rhythm / asymmetry
- prop design
- ensemble design
- family resemblance without cloning
- everyday acting
- comedy acting / reaction readability
- serious dramatic acting
- four-panel manga visual economy
- pixel / chibi derivation
- character sheet / model sheet practice
- visual development workflow
- commercial key-art separation from character-design authority
- similarity / association review

研究知識は、具体的な第三者キャラクター部品のカタログにしない。

---

## 8. 日常会・ボケ・くだらない話の位置づけ

これは重要だが、早急に「全員の衣装を日常着にする」等のhard ruleへ変換しない。

### USER_CONFIRMED preference

ユーザーは日常会・ボケ・くだらない話が好き。

### Designer test case

Character Master候補は、heroic poseだけではなく以下でも本人らしさが残るか確認する価値がある。

- 普通に立つ
- 座る
- だらける
- 小物を渡す
- 食べる / 飲む
- 呆れる
- 笑う
- 失敗する
- しょうもないことで揉める

これは「日常風デザインにする」という意味ではない。
**シリアスとくだらない日常の両方で同じ人物として演技できるか**を見るための評価scenario。

---

## 9. 四コマ漫画と会話用デフォルト

ユーザー明示方針:

> 会話用デフォルトは四コマ漫画を参考にする。

ここで参考にするのは「特定作品の絵柄」ではなく、会話の読みやすさ・省略・リアクション。

### 固定済みではないもの

- 2頭身
- 3頭身
- 線数
- 目の大きさ

これらはまだDESIGN_HYPOTHESIS。
実画像比較をしてHuman Reviewで決める。

### 必須

- Character Masterのhard landmarkを潰さない。
- 体格差を全員同じchibi bodyへ均さない。
- hairstyle mass / posture / physical trait / signature object等を必要に応じて維持する。
- 小画面で会話相手を判別できる。

---

## 10. Designer Learning Loop

画像生成前後で必ず次を回す。

### Step 1 — Load

最低限読む:

1. `docs/character-appearance-source-book-v1.md`
2. `docs/character-appearance-distinction-generation-contract-v1.md`
3. `docs/art-direction.md`
4. 対象characterのCurrent story / visual-generation brief
5. このDesigner AI Brain
6. `data/visual/character-design-feedback-ledger.json`

### Step 2 — Diagnose

生成前に分けて書く。

- identity invariants
- existing design elements worth preserving
- open design decisions
- rendering decisions
- association risks
- derivative requirements (pixel / chibi / key art)

### Step 3 — Design Hypotheses

画像を出す前に複数のDesign Thesisを作る。
Named artist/IP名をstyle targetにしない。

### Step 4 — Compose Generation Brief

Generation promptはCanon / Appearance / approved design ruleから構成する。
Taste labelそのものをpromptへ転記しない。

### Step 5 — Generate Candidates

一発でMasterにしない。
比較できる候補を作る。

### Step 6 — Review by Dimension

各候補を:

- identity fidelity
- character distinction
- world fit
- attractiveness / charm
- rendering originality
- costume logic
- association risk
- everyday acting range
- chibi/pixel derivability

で別々に見る。

数値scoreだけで自動決定しない。
`KEEP / OPEN / REWORK / REJECT`の理由を文章で残す。

### Step 7 — Capture User Feedback

ユーザーの言葉を最優先で記録する。

- exact feedback / faithful paraphrase
- candidate id
- liked parts
- disliked parts
- keep / change / reject

AIの診断は別フィールドに保存し、ユーザー発言と混ぜない。

### Step 8 — Learn

繰り返し同じ好み・拒否が確認できたら、

```txt
CANDIDATE_LEARNING
→ HUMAN_APPROVED_DESIGN_RULE
```

への昇格を検討する。

一回の反応だけで作品全体のhard ruleへしない。

---

## 11. Feedback LedgerがDesigner AIの中心

本当にAIを「育てる」のは作品名リストではなく、生成→判断→修正の履歴。

候補ごとに最低限:

```txt
candidateId
characterId
brainVersion
generationBriefVersion
referencesUsed + role(identity/rendering/composition)
userVerdict
userFeedback
assistantDiagnosis (HYPOTHESIS)
keepElements
changeElements
associationNotes
nextDelta
promotionState
```

を残す。

特に「好き」「惜しい」「違う」「○○っぽすぎる」を捨てない。

---

## 12. Commercial Master Gate

高精細Character Master / store / trailer / merch等は厳格に扱う。

### Before promotion

- Current Character identityを守っている。
- Appearance Source Bookのhard landmarkを満たす。
- named artist / commercial IPをstyle targetとして生成していない。
- Identity / Rendering / Costume / Compositionのassociationを分けてReview済み。
- 強い偶然の第三者連想がある場合、その原因を修正済み。
- Generic fantasy resemblanceだけを理由に無理な奇抜化をしていない。
- Human Review済み。

`commercial-candidate`は法的保証を意味しない。

---

## 13. Asset Scope

### Strict

- Character Master
- high-resolution standing art
- TOP / Loading key art
- store / trailer / advertisement
- Lorebook hero art
- merchandise master

### Medium

- conversation default / four-panel derivative
- expression set
- small standing art

### Basic

- gameplay pixel sprite
- tiny icon / marker

Pixel / default / gameplayは高精細Masterと同じRendering originalityを要求しない。
ただしCharacter identityと明白な第三者コピー防止は維持する。

---

## 14. Current Decision

今は「新しいユイを急いで作る」フェーズではない。

現在は:

```txt
Character Designer AIの知識体系を整える
↓
研究知識を増やす
↓
既存Character MasterをIdentity / Renderingに分解して理解する
↓
生成候補を少量作る
↓
ユーザーフィードバックをLedgerへ蓄積する
↓
Designer AIの判断を更新する
↓
十分安定してからCommercial Character Masterを確定する
```

今のキャラデザインが好きというUSER_CONFIRMEDを維持し、変更を目的化しない。
変更は「よりヨルノシルベらしくする」「人物性を強くする」「偶然の第三者連想を解く」ために必要な箇所だけ行う。
