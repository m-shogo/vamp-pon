# 夜綴りの八影 × Current21 Relationship Matrix v1

Date: 2026-08-11  
Status: **CURRENT CONTENT SOURCE / RUNTIME NOT PROMOTED**

## Purpose

八影を「設定資料で過去が深い敵」で終わらせず、Current21の誰を3人編成しても、その人物なりの怖さ・怒り・共感・拒否・好奇心が出るようにする。

## Core rule

味方同士の関係値と、八影への感情は別物。

```txt
Current21同士:
Pair Bond + directed Affinity

Current21 → 八影:
Threat / Empathy / Curiosity / Anger / Rescue impulse / Ideological rivalry 等
```

八影を何回倒しても「敵好感度」が自動上昇する設計にはしない。

- sympathy != forgiveness
- sympathy != recruitment
- recurring enemy != future party member
- enemy relation != romance route

## Coverage

```txt
Current21 = 21
八影 = 8
21 x 8 = 168 character-enemy relations
```

全168関係に最低限:

- primary emotional lane
- personal question
- first reaction
- enemy fixation on that character
- battle dynamic
- late reinterpretation
- post-battle action

を持つ。

## Featured 32

既存 `spotlightEnemyCharacterSource.ts` が各八影へ指定済みの mirrorCharacterIds 4人を、その敵のFeatured Arcとする。

```txt
8 enemies x 4 mirrors = 32 Featured Arc
remaining = 136 Baseline Reaction
```

Featured Arcは敵の過去説明を増やすためではなく、**味方側の弱点・価値観も同時に揺らす**。

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

## Three-person battle

八影戦でも3人Partyは3人全員の個人反応を読む。

```txt
Party A / B / C vs 八影X

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

が同時に存在する。

## Runtime boundary

まだContent Source。

Open runtime work:

- encounter history / seen-line ledger
- party dialogue speaker arbitration
- stage/result callout presentation
- bestiary relation snippets
- save migration
- voice/subtitle variants

Content追加だけでruntime実装済みとは扱わない。
