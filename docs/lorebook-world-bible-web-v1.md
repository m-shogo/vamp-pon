# ヨルノシルベ World Bible Web v1

Date: 2026-08-09  
Status: **IMPLEMENTED V1.1 / READ MODEL CONNECTED / GAME RUNTIME SEPARATE / DEPLOYABLE BUILD GATED**

## 1. Purpose

ヨルノシルベの設定量が増えても、作者・実装担当・将来の自分が短時間で次を取り戻せるWebを持つ。

- 誰が誰か
- その人物の核 / 成長 / モチーフ / 星獣
- 誕生日 / 年齢感 / 好物 / 趣味 / 癖 / 好き嫌い / 日常
- 誰とどういう関係か
- その関係は CANON か CANDIDATE か
- 現実時間 / 夜 / 朝の時間構造
- Main Mystery / Character Mystery / Series Mystery の区別
- 世界用語
- まだ決めていない設定
- どのCurrent sourceから来た情報か

これはゲーム本体UIではない。

```txt
Game runtime
  Phaser / Unity

World Bible Web
  作者・設計・攻略資料・参照用
```

互いの画面責務を混ぜない。

---

## 2. Current URL / build boundary

Static entrypoint:

```txt
public/lorebook/index.html
```

Viteの`public`配下なので、既存Web buildではそのまま:

```txt
/lorebook/
```

へコピーされる。

ゲーム本体の`src/main.ts`、Phaser Scene、Unity runtimeへ依存しない。

---

## 3. Information architecture

```txt
一冊でわかる
↓
人物図鑑
↓
人間関係
↓
時間と歴史
↓
物語と謎
↓
用語帳
↓
作者の机
```

### 一冊でわかる

30秒で世界の前提へ戻る。

- 夜
- 記憶
- 黒耀化
- 朝

### 人物図鑑

Current21をカード化。

1カードで最低限:

- name
- group
- character core
- star beast
- growth
- birthday
- favorite food
- hobby hint
- tags
- canon status

詳細dialog:

- 大きな問い
- その人物の現在の答え
- growth
- motif
- priority relationships
- 誕生日 / zodiac flavor / age impression
- favorite food + reason
- hobby / small habit
- likes / dislikes
- daily-life scene
- name design rationale
- stable runtime ID
- source

### 人間関係

相関図の目的を「線の本数」ではなく「その二人だから出る面の理解」とする。

UX:

- 全21人を表示
- 人物focusで関連線だけ強調
- CANONは実線
- CANDIDATEは破線
- relation detailにstatusを常時表示
- relationship reservoirを一覧でも読める

### 時間と歴史

Exact yearを未LOCKのまま扱う。

```txt
現実の複数時代
↓
物 / 言葉 / 記録の継承
↓
夜での邂逅
↓
それぞれの朝
↓
Seriesの小さな違和感
```

将来人物ごとのEraを追加する時も、西暦を最初から必須にしない。

### 物語と謎

謎を3レーンへ分離する。

```txt
Character Mystery
Main Mystery
Series Mystery
```

1作のHappy EndとSeries Mysteryを競合させない。

### 用語帳

Current naming lockを検索できる。

`黒曜化`をCurrent表示へ戻さない。

### 作者の机

通常閲覧では隠す。

作者ノートON時だけ:

- High-value candidate
- Open questions
- Source authority
- setting impact

を見せる。

未確定設定を「空欄」ではなく「価値のある問い」として管理する。

---

## 4. Data model

Current read models:

```txt
public/lorebook/data/world-bible.v1.json
public/lorebook/data/personal-profiles.v1.json
```

V1 entities:

```txt
groups
characters
personalProfiles
relationships
timeline
story
openQuestions
glossary
authority
```

### Stable ID mapping

表示名とruntime IDを同一視しない。

例:

```txt
ユウビ: lorebookId=yuubi / runtimeId=yubi
カナメ: lorebookId=kaname / runtimeId=kage1
カスミ: lorebookId=kasumi / runtimeId=kage2
トキ:   lorebookId=toki   / runtimeId=kage3
ツムギ: lorebookId=tsumugi / runtimeId=kage4
```

CIで21人すべてのmapping completenessとruntime ID重複を検査する。

### Status invariant

許可する状態:

```txt
CANON
USER_DIRECTION
CANDIDATE
OPEN_QUESTION
```

禁止:

- Candidateを見た目だけCanon相当にする
- Open questionを本文の断定文へ変える
- Future候補をCurrent21へ無言で追加
- old Shadow planning labelをvisible nameへ戻す
- `黒曜化`をCurrent termへ戻す

---

## 5. Source authority

V1.1は次のCurrent masterを要約する。

```txt
docs/CANON.md
docs/CHARACTERS.md
docs/character-book-v4.md
docs/character-personal-profile-canon-v1.md
docs/RELATIONSHIPS.md
docs/STORY.md
docs/181-current-production-canon.md
src/game/data/characterCanon.ts  # stable runtime ID cross-check
```

Character workは引き続き`docs/CHARACTERS.md`を入口にする。
Web read modelはauthorityそのものを勝手に置換しない。

---

## 6. Current V1.1 content coverage

```txt
Current characters: 21
Personal profiles: 21/21
Priority relationships: 24
Open questions surfaced: 8
Timeline conceptual layers: 5
Glossary entries: 21
Stable runtime ID mapping: 21/21
```

Current21:

```txt
Core5: 5
Circle10: 10
Shadow5: 5
Reserve: 1
```

---

## 7. UX principles

### 7.1 3秒 / 30秒 / 5分

```txt
3秒  = 名前・人物の核・groupが分かる
30秒 = growth / star beast / daily-life hint / relationが戻る
5分  = personal profile / Mystery / source / open questionまで深掘れる
```

### 7.2 Mobile first but not mobile-only

- mobile: 1 column
- tablet: 2 columns
- desktop: 3-column character cards + relationship canvas
- sticky navigation
- touch target確保
- Reduced Motion対応

### 7.3 Visual identity

一般的なSaaS dashboardにしない。

採用:

- 夜
- 紙
- 星図
- ランタンの灯り
- 罫線
- 章番号
- field guide / 攻略本 / 資料本の中間

避ける:

- 均一な白カード
- 強いdrop shadowだらけ
- dashboard KPI感
- AI生成LP風gradientの過剰使用
- 角丸カードの量産

---

## 8. Database direction

V1.1はGit管理のnormalized JSON read modelをUIへ実接続している。

理由:

- Current master変更とdiffを同じPRでreviewできる
- auth / secret / external serviceなしで確実にdeployできる
- Game runtimeから独立できる
- CANON/CANDIDATEの変更履歴をGitで残せる
- display IDとruntime stable IDのmappingを明示できる

これはremote DBそのものではない。
作者編集・大量追加・複数人運用が必要になった時にremote DBへ移す。

V2でremote DBを入れる場合の推奨:

```txt
Author Editor
  ↓ write
D1 / SQLite-compatible DB
  ↓ read API
World Bible read model
  ↓
/lorebook/
```

推奨table:

```txt
characters
character_aliases
character_profiles
relationships
relationship_beats
story_mysteries
timeline_nodes
glossary_terms
sources
content_source_links
decisions
open_questions
```

重要:

DB化しても`status`と`source`は落とさない。
「値」だけでなく「どこまで確定しているか」が最重要データ。

### V2 author editing requirement

- draft保存
- CANON promotionは別action
- change preview
- source必須
- relation両端のreferential integrity
- duplicate ID拒否
- Future / Current scope明示
- audit history

---

## 9. History deepening strategy

今後「歴史」を詰める時、いきなり全人物へ西暦を振らない。

先にRelative Eraを作る。

例:

```txt
ERA-A: 手仕事 / 紙 / 古い街灯が生活の中心
ERA-B: 交通・郵便・観測技術が広がる
ERA-C: 現代寄り
ERA-X: exact placement unknown
```

各人物へ:

```txt
eraConfidence
languageMarker
technologyMarker
dailyLifeMarker
objectLineageLinks
```

を付ける。

これで後から年代を確定しても破綻しにくい。

---

## 10. Highest-value setting questions surfaced by V1

Current masterから、次に詰める価値が高い問いをUIへ出した。

1. 夜の正体
2. 黒インクStory Engineを最終真相にするか
3. 誰が夜を作り、なぜ必要だったか
4. 星獣の完全な仕組み
5. ユイ×トモリの獅子 / ランタン真相
6. Current21のRelative Era
7. クロオリが具体的に何を預かっているか
8. sequelへ残す最小の違和感

V1では答えを勝手に決めない。

---

## 11. CI / deployability gate

Workflow:

```txt
.github/workflows/lorebook.yml
```

Checks:

- `app.js` / `profile-enhancement.js` JavaScript syntax
- world / personal JSON parse
- schemaVersion
- Current21 count
- personal profile 21/21
- character / relationship / profile ID duplicate
- orphan / self relationship
- allowed status
- stable runtime ID mapping 21/21
- Current authority source presence
- static entrypoint assets
- `pnpm install --frozen-lockfile`
- `pnpm build`
- `dist/lorebook/` deploy artifact existence

---

## 12. Deployment

既存Vite buildへ含まれるため、通常build成果物に`lorebook/`が含まれる。

CIで次を実行する。

```sh
pnpm build
```

output側で:

```txt
dist/lorebook/index.html
dist/lorebook/styles.css
dist/lorebook/profile.css
dist/lorebook/app.js
dist/lorebook/profile-enhancement.js
dist/lorebook/data/world-bible.v1.json
dist/lorebook/data/personal-profiles.v1.json
```

を要求する。

GitHub connectorだけで編集した時は、ローカルbuildを実行済みと記録しない。
CIで既存buildとLorebook workflowがgreenになってからmergeする。

---

## 13. Next implementation order

### V1.2 — relationship readability

- relation filter: family / ideological / night-born / temporal / mystery
- relation arc: First read → Conflict → Chosen trust → Dawn proof
- Pair Gameplay / Bond view

### V1.3 — character攻略 layer

- 黒耀化固有情報
- combat role / starter / strength / weakness
- 灯技 / 継灯 / 暁灯
- 灯具 / 持ち物 / 忘れ物 / 灯紋
- Named Object lineage

### V1.4 — history

- Relative Era board
- Named Object lineage timeline
- 「誰が同時代か」を断定せずconfidence表示

### V1.5 — story atlas

- stage / enemy / item / character cross-links
- foreshadowing → payoff map
- spoiler level

### V2 — author DB/editor

- remote DB
- author-only authentication
- draft editor
- validation
- change review
- promotion flow

---

## 14. Definition of done for V1.1

- `/lorebook/`がゲーム本体から独立して開ける
- 21人を検索・group filterできる
- 人物detailが開く
- personal profile 21/21を表示できる
- stable runtime ID mappingを保持できる
- 24 relationを相関図と一覧で読める
- focusでrelation clutterを減らせる
- CANON / CANDIDATEが視覚的に混ざらない
- timelineを読める
- mystery 3 lanesを読める
- glossaryを検索できる
- author modeでopen questionsを見られる
- mobileで破綻しない
- Reduced Motion対応
- dedicated CI validationがある
- deploy artifactをCIで検証する
- existing game runtimeを変更しない
