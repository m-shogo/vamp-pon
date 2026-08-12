# ヨルノシルベ — Character Living Visual Master v1

Date: 2026-08-12  
Status: **ALL-CHARACTER VISUAL AUTHORITY EXTENSION / GENERATION MUST NOT FILL UNKNOWN LIFE PREFERENCES**

## 0. Purpose

このMasterは、画像生成AIがキャラクター設定の空白を `generic fantasy / generic gacha / premium mobile RPG` の平均値で補完し、既存商業作品を連想させる方向へ勝手に寄ることを防ぐ。

キャラクターの見た目は「絵として似合うもの」から決めない。

```txt
人物の人生 / 性格 / 時代 / 関係 / 身体感覚
↓
本人の服・装飾・露出・手入れに対する価値観
↓
Appearance Source
↓
Generation Contract
↓
Candidate Art
```

この文書は `docs/character-appearance-source-book-v1.md` を置き換えない。Appearance Source Bookの**生活・身体感覚・服飾嗜好レイヤーを補強するMaster**である。

対象は **Current21 + Future15 = 36人、および今後追加される全人物**。

---

# 1. 最重要ルール — 空白をAIにデザインさせない

AIは未設定項目を「それっぽく」埋めてはならない。

特に以下は、本人設定がない限り勝手に追加しない。

- piercing
- tattoo / body art
- 肌露出
- cleavage / 腹 / 背中 / 太腿等の強調
- heels / platform shoes
- corset-like shaping
- jewelry
- gemstone
- gold trim
- belts / straps
- leather harness
- gloves
- stockings
- nail art
- makeup intensity
- hair ornament
- asymmetry
- ceremonial ornament
- scars
- freckles
- beauty marks
- body modification

`未設定 = AIが自由に選んでよい` ではない。

`未設定 = generation blocker / human authoring required` とする。

---

# 2. 1キャラにつき必須の Living Visual Profile

全人物は高精細Character Master生成前に以下を持つ。

## A. BODY RELATIONSHIP — 自分の身体との付き合い方

### bodyComfort
- 自分の身体を普段どの程度意識するか
- 人から見られることを気にするか
- 身体の線が出る服を好むか嫌うか
- loose / fittedのどちらが落ち着くか
- 身体的特徴を隠したい / 隠したくない / 特に意識しない

### exposurePreference
部位ごとに分ける。

- shoulders
- upper arms
- chest / neckline
- midriff
- back
- thighs
- knees
- legs

値:
- `AVOID`
- `LOW`
- `NEUTRAL`
- `LIKES`
- `CONTEXT_ONLY`

「露出多い / 少ない」一語で済ませない。

### temperatureAndComfort
- 暑がり / 寒がり / 中立
- 首元を閉じたいか
- 袖をまくるか
- 重ね着が苦にならないか
- 重い服・硬い服への耐性

### movementNeeds
- 走る
- しゃがむ
- 座る
- 登る
- 工具を使う
- 荷物を運ぶ
- 長時間歩く
- 戦闘時に必要な可動域

服はこの動作を邪魔しない。

---

# 3. BODY MODIFICATION / ACCESSORY POLICY

## piercingPolicy
必ず次から選ぶ。

- `NEVER`
- `NO_CURRENT_INTEREST`
- `WOULD_CONSIDER`
- `HAS_PIERCING`
- `REMOVED_HISTORY`
- `OPEN_AUTHOR_DECISION`

さらに部位を明示する。

- lobe
- helix
- industrial
- conch
- tragus
- eyebrow
- nose
- septum
- lip
- labret
- tongue
- other

**性格タグから自動決定しない。**

禁止例:
- 強気だからpiercing
- 反抗的だからlip ring
- repair characterだからindustrial
- future characterだからbody modification

## tattooPolicy

- `NEVER`
- `NO_CURRENT_INTEREST`
- `WOULD_CONSIDER`
- `HAS_TATTOO`
- `CULTURAL_OR_PERSONAL_HISTORY_REQUIRED`
- `OPEN_AUTHOR_DECISION`

刺青をキャラ付け用の無料装飾にしない。

必要なら以下まで設定する。
- placement
- visibility
- meaning
- who chose it
- when acquired
- whether character hides/shows it

## jewelryPolicy

- none
- sentimental only
- practical only
- minimal
- likes jewelry
- ceremonial only
- varies by situation

## makeupPolicy

- none
- minimal care only
- light
- intentional
- strong
- situational

「女性キャラだからmakeup」は禁止。

## nailPolicy

- natural
- practical short
- cared but unpainted
- painted
- chipped
- work-damaged
- situational

---

# 4. CLOTHING TASTE — 本人が服を選ぶ基準

## silhouettePreference
最低2つ以上設定。

候補軸:
- compact / long / wide / narrow
- fitted / relaxed
- layered / single-layer
- vertical / horizontal / diagonal
- rounded / angular
- symmetrical / asymmetrical
- open / closed

## fitPreference
- tight clothing tolerance
- waist emphasis tolerance
- shoulder fit
- sleeve length
- trouser / skirt preference
- hem length preference

## materialPreference
好き / 苦手 / 許容を分ける。

- cotton-like soft cloth
- linen-like cloth
- wool-like texture
- leather
- metal fittings
- synthetic technical fabric
- sheer fabric
- stiff formal fabric
- knit
- repaired / patched cloth

## colorRelationship
- 自分から選ぶ色
- 似合うが本人は選ばない色
- 苦手な色
- 汚れが気になる色
- ceremonial-only color

テーマカラーと本人の服の趣味を同一視しない。

`theme color = always wears that color` を禁止する。

## patternPreference
- plain
- stripe
- check
- tiny motif
- large motif
- text / label
- embroidery
- star map line
- botanical
- geometric

## footwearPreference
- practical flat
- boots
- sneakers-like
- sandals
- formal shoes
- heels tolerance
- heavy soles tolerance

足元を「画面映え」で決めない。

## bagPocketBehavior
- bagを持つ / 持たない
- pocketを多用するか
- 手ぶらを好むか
- 道具を腰へ付けるか
- 他人に荷物を預けるか

---

# 5. HOW THEY WEAR CLOTHES — 同じ服でも人格が出る層

必須:

- button / zipを全部閉じるか
- collarを整えるか
- sleevesをまくるか
- shirt hemを入れるか出すか
- jacketを開ける癖
- scarf / hoodの扱い
- shoelace / fasteningの丁寧さ
- 左右差が生活上自然に生まれるか
- hairを耳へかけるか
- accessoriesを毎日同じ位置へ付けるか

衣装デザインだけでなく**着方**を固定する。

---

# 6. CLOTHING OWNERSHIP / MAINTENANCE

## acquisitionPreference
- 自分で選ぶ
- もらい物を長く使う
- 必要最低限だけ買う
- 古着 / inherited
- repaired itemを好む
- 機能で選ぶ
- 見た目で選ぶ

## maintenanceBehavior
- こまめに洗う
- 汚れをすぐ落とす
- 多少の汚れを気にしない
- 自分で補修する
- 他人へ修理を頼む
- 壊れたら交換する
- 同じ物を長く使う

## wardrobeBreadth
- 少数を着回す
- variantが多い
- occasionごとに変える
- uniform-like repetition

衣装variantを増やすときもこの値を破らない。

---

# 7. SOCIAL PRESENTATION — 人からどう見られたいか

最低限設定する。

- wantsToStandOut
- wantsToBlendIn
- caresAboutBeingCute
- caresAboutBeingCool
- caresAboutLookingReliable
- caresAboutLookingAdult
- caresAboutLookingYoung
- dislikesBeingSexualized
- comfortableWithAttention
- deliberateSelfExpression

これらは性別・年齢・combat roleから自動推定しない。

---

# 8. PRIVATE / PUBLIC / CEREMONIAL DIFFERENCE

一人につき最低3状況を考える。

## private
一人・仲間内で何を着るか。

## ordinaryPublic
日常の外出・会話劇。

## special / ceremonial
祭り、重要イベント、戦闘準備、formal scene等。

`ceremonial衣装の豪華さ = 本人の日常の趣味` と扱わない。

---

# 9. HAIR / GROOMING AS DAILY BEHAVIOR

髪型を形だけで固定しない。

- 朝どれくらい手入れするか
- 崩れたら直すか
- 長髪を仕事時に結ぶか
- pin / clip / bandを使う理由
- 前髪が目に入るのを気にするか
- dye / natural color policy
- haircut frequency
- wet / rain / sleep aftermath

AIは毎シーン完璧な美容院直後hairへ戻さない。

---

# 10. SKIN / FACE CARE / PHYSICAL HISTORY

- sun exposure
- freckles
- moles
- scars
- acne / acne scar
- age lines
- work abrasion
- soot / ink / grease
- dry skin / weather effect

ただし未設定の傷・ほくろ・そばかすを「個性付け」で足さない。

身体特徴はDecorationではなく本人の身体として扱う。

---

# 11. CHARACTER-SPECIFIC ABSOLUTE NEVER

各人物に最低5件持つ。

例:

```txt
- piercingをしない
- tattooをしない
- 胸元を深く開けない
- high heelsを日常では履かない
- gold jewelryを自分から選ばない
```

この欄はNegative Promptより強い。

Candidate画像が違反した場合、絵が綺麗でもREJECT。

---

# 12. CHARACTER-SPECIFIC POSITIVE PREFERENCE

禁止だけではgenericへ戻るため、本人が**自分から選ぶもの**も最低5件持つ。

例:

```txt
- 手触りの柔らかい布を選ぶ
- 袖をまくりやすい服を選ぶ
- ポケットがある服を選ぶ
- 使い慣れた小物を繰り返し持つ
- 破れを修理して使う
```

「何をしないか」だけでなく「何をするか」でデザインする。

---

# 13. CONTEXT EXCEPTIONS

Hard Lockと例外を区別する。

例:

```txt
piercing: NEVER
→ ceremonialでも開けない
```

```txt
exposure.chest: AVOID
→ medical / bathing / unavoidable sceneは衣装rule外
```

```txt
jewelry: SENTIMENTAL_ONLY
→ gift from a specific personなら着ける
```

例外には**理由**が必要。

AIが「今回はイベントだから」で勝手に解除しない。

---

# 14. GENERATION READINESS GATE

高精細 `character_reference / Character Master / standing art / key art` は、対象人物について以下が埋まっていなければ生成不可。

必須:

1. bodyComfort
2. exposurePreference（主要7部位）
3. piercingPolicy
4. tattooPolicy
5. jewelryPolicy
6. makeupPolicy
7. silhouettePreference
8. fitPreference
9. materialPreference
10. colorRelationship
11. footwearPreference
12. clothingWearHabits
13. acquisitionPreference
14. maintenanceBehavior
15. socialPresentation
16. hairGroomingBehavior
17. absoluteNever >= 5
18. positivePreference >= 5
19. contextExceptions
20. sourceEvidence

未設定は `UNKNOWN_AUTHORING_REQUIRED` と明示する。

**UNKNOWNをAI推論で埋めてgeneration-readyへ昇格することを禁止する。**

---

# 15. SOURCE EVIDENCE

各値はsource classを持つ。

- `USER_CONFIRMED`
- `CURRENT_CANON`
- `APPEARANCE_SOURCE`
- `HUMAN_APPROVED_VISUAL`
- `AUTHOR_CANDIDATE`
- `UNKNOWN_AUTHORING_REQUIRED`

`AI_GUESS` はMaster値として保存不可。

AIが提案する場合はDesigner Brainの `DESIGN_HYPOTHESIS` にのみ置き、Masterへ自動昇格しない。

---

# 16. ALL-CHARACTER COVERAGE RULE

このMasterは一部の人気キャラだけの設定ではない。

- Current21: 21 / 21 required
- Future15: 15 / 15 required
- total: 36 / 36 required
- 新規人物: roster追加時に同時追加required

子ども・高齢者・plus-size・人工身体・動物・Robot等も同じく「本人が生きている身体」として扱い、generic美形へ正規化しない。

年少人物はsexualized exposure / adult body-modificationを禁止する。

---

# 17. RELATION TO FOUR-PANEL / PIXEL / GAMEPLAY ART

このMasterの人格・身体・服飾嗜好は派生表現でも維持する。

ただし情報量はasset classで変える。

## Character Master / high-resolution art
最大限読む。

## 会話用デフォルメ / 四コマ
- piercing有無
- 露出方針
- hair mass
- body proportion identity
- clothes wearing habit
- signature object
を省略で逆転させない。

## pixel / tiny gameplay
細部が描けなくても、設定を逆の記号へ置換しない。

例:
`piercing NEVER` の人物へ、識別記号として大きなearringを付けない。

---

# 18. GENERIC GACHA DRIFT PREVENTION

設定が無い部分に以下を自動投入しない。

```txt
beautiful anime character
premium fantasy outfit
ornate costume
elegant gold trim
luxury jewelry
complex belts
thigh straps
high boots with decorative buckles
sexy but tasteful exposure
asymmetrical fantasy costume
heroine cleavage
mysterious tattoo
cool piercing
```

品質を上げるために人格設定を上書きしない。

**quality is rendering quality, not added costume vocabulary.**

---

# 19. Designer AI Mandatory Question

生成前、Designer AIは内部的に必ず確認する。

> この服・装飾・肌露出・髪型は「AIが格好いいと思ったから」ではなく、この人物本人が選ぶ / 許容する / 状況上必要とする理由があるか？

理由がない要素は削除するか `UNKNOWN_AUTHORING_REQUIRED` に戻す。

---

# 20. Authority Summary

```txt
Story / Character Life
↓
Character Living Visual Master
↓
Character Appearance Source Book
↓
Appearance Distinction / Generation Contract
↓
Designer AI Brain
↓
Generation Brief
↓
Candidate Art
↓
Human Review
```

目的は「他作品に似ないために奇抜にする」ことではない。

**キャラクターが十分に生きているため、AIが第三者作品の平均的なデザイン語彙を借りる必要がない状態を作ること。**
