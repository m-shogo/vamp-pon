# 朔夜座 × Current21 Relationship Matrix migration reservoir v2

Date: 2026-08-13  
Status: **S1 CURRENT RELATIONSHIP RESERVOIR / LEGACY 八影 LABEL SUPERSEDED / RUNTIME NOT PROMOTED**

> Current formal Season 1 antagonist team is **朔夜座**.
> This file preserves the authored 21 × 8 reaction matrix that was created under the legacy `八影` label. The relationship content is retained as a migration reservoir; the legacy group name is not Current naming authority.

## Purpose

朔夜座を「設定資料で過去が深い敵」で終わらせず、Current21の誰を3人編成しても、その人物なりの怖さ・怒り・共感・拒否・好奇心が出るようにする。

## Core rule

味方同士の関係値と、朔夜座memberへの感情は別物。

```txt
Current21同士:
Pair Bond + directed Affinity

Current21 → 朔夜座member:
Threat / Empathy / Curiosity / Anger / Rescue impulse / Ideological rivalry 等
```

朔夜座memberを何回倒しても「敵好感度」が自動上昇する設計にはしない。

- sympathy != forgiveness
- sympathy != recruitment
- recurring enemy != future party member
- enemy relation != romance route
- one image or one battle reaction != Canon relationship promotion

## Coverage

```txt
Current21 = 21
朔夜座 S1 roster = 8
21 x 8 = 168 character-enemy relation lanes
```

全168 laneに最低限保持できる項目:

- primary emotional lane
- personal question
- first reaction
- enemy fixation on that character
- battle dynamic
- late reinterpretation
- post-battle action

これは168個の独立画像を作る指示ではない。攻略/Lorebookではdata/read-modelを優先し、必要なFeatured pairだけを既存Masterから派生させる。

## Featured 32 reservoir

既存 `spotlightEnemyCharacterSource.ts` が各memberへ指定済みの mirrorCharacterIds 4人をFeatured Arc reservoirとして保持する。

```txt
8 enemies x 4 mirrors = 32 Featured Arc
remaining = 136 Baseline Reaction
```

Featured Arcは敵の過去説明を増やすだけでなく、**味方側の弱点・価値観も同時に揺らす**ための候補。

Examples:

- ナシロ × ユイ: 拾うことと名付けることの境界
- ナシロ × アサ: 早く訂正することと本人を待つこと
- アサトジ × ナギ: 閉じる守りに期限を持たせられるか
- ミチグレ × ミチル: 正しい一本道ではなく帰れる選択肢
- オリネ × クロオリ: 見せない責任と永続封印の差
- ハクマ × シロ: 未分類と空白化の差
- ツグリ × トモリ: 直せることと直してよいことの差
- ユラネ × ネム: 夢を大切にしたまま起きること
- ペタ × コヨリ: 大人の間違いを子どもから訂正してよいか

これらを画像生成の都合だけでromance / blood relation / recruitmentへ昇格しない。

## Three-person battle

朔夜座戦でも3人Partyは3人全員の個人反応を読む。

```txt
Party A / B / C vs Sakuyaza X

A → X relation
B → X relation
C → X relation
```

敵に対する「Party感情値」は作らない。

Dialogue presentation policy:

1. Featured Arc人物がいればopening candidateになれる
2. tactical replyは可能なら別人物へ渡す
3. afterimage / resultでは3人目も使える
4. high Bond pairだけが敵会話を独占しない
5. enemy relationを味方Pair Bondへ自動転送しない

## Emotional variety

使う主レーン:

- FEAR
- ANGER
- EMPATHY
- CURIOSITY
- PROTECTIVE_REJECTION
- IDEOLOGICAL_RIVALRY
- RESCUE_IMPULSE
- GRUDGING_RESPECT

全員を「敵だけど本当は可哀想」で揃えない。

同じ敵でも、

- 許せない人
- 技術だけ認める人
- 自分に似ていて嫌う人
- 助けたい人
- 怖いが観察する人
- 分かるからこそ止める人

が同時に存在できる。

## Visual / Guide production rule

- 168 laneを168枚のbaked relationship cardへしない。
- Relationship graph / labels / status / long copyはHTML/CSS/SVG/dataを優先する。
- Featured visualが必要な場合は両人物のapproved Character Masterをparentにする。
- 朔夜座memberがEnemy48 reference masterと同一人物なら、別portrait binaryをコピーしてMaster化しない。
- legacy `八影`名義の画像をCurrent formal group artとして再利用しない。
- pose / distance / touchから未定義の恋愛・家族・上下関係を発明しない。

## Runtime boundary

まだContent / relationship reservoir。

Open runtime work:

- encounter history / seen-line ledger
- party dialogue speaker arbitration
- stage/result callout presentation
- bestiary relation snippets
- save migration
- voice/subtitle variants

Content追加だけでruntime実装済みとは扱わない。

## Migration source

Legacy file path and data IDs are retained for compatibility.
Current naming / S1 organization authority:

- `docs/00-current-story-world-master.md`
- `docs/sakuyaza-current-identity-v1.md`
- `src/game/data/sakumeiCandidateSource.ts`
