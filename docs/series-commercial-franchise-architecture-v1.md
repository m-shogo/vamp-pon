# ヨルノシルベ Series / Commercial Franchise Architecture v1

Date: 2026-08-10  
Status: **CURRENT COMMERCIAL / SERIES DIRECTION — DOES NOT PROMOTE STORY CANDIDATES**

> ヨルノシルベを1作だけのゲームではなく、続編・本・音楽・イベント・グッズへ育ててもCurrent Canonを壊さないためのIP設計。
>
> この文書は商業・シリーズ構造の方針であり、`CANON.md` / `STORY.md` / `RELATIONSHIPS.md` / Current read modelsの未確定設定を正史へ昇格しない。

## 1. 絶対ルール

1. 作品1のHappy Endを作品2・3で無効化しない。
2. 各titleの中心感情は各titleで決着させる。
3. Character growthを続編都合でresetしない。
4. 不在Characterを自動的に死亡・消失扱いしない。
5. 人気投票でromance / blood relation / death / villain化 / Main Mystery truthを決めない。
6. 人気の低いCharacterのCurrent事実を消さない。露出量・商品量は調整可能。
7. 恋愛だけを最上位relationにせず、buddy / siblings / ideological mirror / mentor / night-born trust / generation handoffも同格の入口にする。
8. Star Beast / Named Objectは商品化しやすさだけを理由に新規Canon化しない。
9. CandidateのNamed Object lineage等を商品企画の都合で事実扱いしない。
10. 商業データは「何をもっと見たいか」を測るもので、過去の設定を書き換える投票ではない。
11. **体型・年齢・障害・gender presentation等のCurrent visual factsを、売れ筋へ合わせて均一化しない。**

## 2. IPの5本柱

- **Character** — silhouette / Theme HEX / 口調 / 持ち物 / 成長。
- **Star Beast** — Characterへ戻れるmascot入口。星座重複理由はauthorityに従う。
- **Named Object** — ランタン / 手紙 / 鍵 / 地図など。所有・継承はCurrent/Candidate状態を保持する。
- **Relationship** — friendship / family / ideological mirror / night-born trustを含む。
- **Scene / Place / Time** — 夜の駅、湖畔、四季、夜→朝など人物単体に依存しない世界観入口。

## 3. Popularity dimensions

同じ「人気」を一票へ潰さない。

- favoriteCharacter
- favoriteStarBeast
- favoriteRelationship
- wantToCollect
- wantMoreStory
- favoriteScene

Popularityで変えてよい:

- goods SKU比率
- restock
- optional side storyの優先度
- seasonal art
- event出演
- optional Bond量
- Lorebook特集順

Popularityで変えない:

- personality
- relationship type
- forced romance
- family / blood relation
- death / resurrection
- Main Mystery truth
- birth era
- Named Object owner / lineage truth
- Star Beast重複理由
- **body shape / age impression / disability / presentation等のCurrent visual identity**

## 4. Silhouette / body-diversity commercial lane

体型の多様性はCSR欄ではなく、Character recognitionとIP資産の一部。

Current anchor:

- **ハナ** — ぽっちゃり女性 / 年長女性
- **カナメ** — ぽっちゃり男性 / 若い成人

Source:

- `src/game/data/characterSilhouetteCanon.ts`
- `docs/character-silhouette-diversity-current-canon-v1.md`
- `docs/chubby-character-production-pass-v1.md`

### Hana commercial entry

```txt
Character
+ 押し花 / 保存 / 布
+ 丸いショールsilhouette
+ 蘇芳 #B5495B
+ ふっくらした白鳥Star Beast
```

Goods direction:

- 押し花しおり / paper goods
- ショールpattern cloth goods
- 花脈 / 保管箱 motif
- Star Beast
- daily-life ensemble art

ハナの商品を食べ物だけへ寄せない。

### Kaname commercial entry

```txt
Character
+ 守る / intercept / 外周
+ 広い柔らかなsilhouette
+ 受け灯の腕帯
+ 蝋色 #2B2B2B
+ 大きな灰狼Star Beast
```

Goods direction:

- 受け灯の腕帯 / wearable motif
- 影の折り目emblem
- protection motif cloth goods
- Star Beast
- 守り方の違いが見えるrelationship goods

カナメの商品を重量 / 大食い / XXL jokeへ寄せない。

### Commercial guardrail

- 人気が低い → 細身へ変更、を禁止。
- 人気が高い → fetish方向へ体型誇張、を禁止。
- 体型を体重数字・サイズ笑いの商品コピーにしない。
- apparelはハナ / カナメだけ特殊扱いせず、IP全体としてinclusive size rangeを検討する。
- body shapeはCharacterの一部だが、Character Coreの全部にはしない。

## 5. Relationship commercial lanes

### Broad entry

- ユイ × アサ — buddy / non-romance
- ユイ × クロオリ — ideological mirror

### Family / everyday

- リツ × コヨリ — siblings / non-romance

### Core / Shadow mirror

- ナギ × カナメ
- ミチル × トキ
- トモリ × ツムギ
- アサ × カスミ

### Quiet night-born

- ユウビ × トバリ
- マドカ × レン
- シロ × ツムギ
- ネム × トキ
- ゲン × ミチル

### Candidate object-lineage lane

- ユイ × トモリ

同一ランタン等の具体的lineageは**既存Decision LabのCANDIDATE**。Human authorityで採用された場合のみ、物の履歴をSeries bridgeへ使う。採用前は商品・UI側から事実化しない。

## 6. Series 1 / 2 / 3 direction

これはproduction greenlightでもstory canon lockでもない。各titleの問いを重複させないための構造案。

### 1 — 戻す / 開く / 選び直す

Question: **記憶や意味は、誰のために開くのか？**

- Current21の中心growthとHappy Endを作品1で支払う。
- 世界法則は、その時点でhuman-approvedなCurrent authorityだけを使用する。
- 続編前提でC-gradeの感情決着を未回収にしない。

### 2 — 継ぐ / 渡す / 受け取る

Question: **自分が始めていないものを、どう受け継ぐか？**

- human-approvedなNamed Object / record / route lineageがある場合、別時代から再読する余地を使える。
- 作品1の朝を偽物にしない。
- 旧Character growthをresetしない。
- 全員集合を義務化しない。

### 3 — 残す / 手放す / 夜を選ぶ

Question: **残すための仕組みは、いつ手放してよいのか？**

- Series Mysteryは、それまでにhuman-approvedされたauthority chainと矛盾せず回収する。
- Nightを完全破壊して過去作の価値を消さない。
- 宇宙設定の説明だけで中心感情を置換しない。

## 7. Return rule

旧Character / relationを再登場させる場合:

1. 過去作で得たgrowthを保持する。
2. 同じfailureを初期状態から再演しない。
3. 新主人公の答えを旧castが奪わない。
4. Current authorityに存在する物・記録・route・Star Beast traceだけを橋に使う。
5. Candidateを続編都合でretroactive Canonにしない。
6. **再登場時にbody / age / disability等のCurrent visual identityをmarketability理由でretconしない。**

## 8. 一文

> **人気は「もっと見たい」を知るために使い、人物・関係・世界の真実を書き換えるためには使わない。作品1の朝と人物の身体性を守ったまま、別の入口から好きになれるIPを増やす。**
