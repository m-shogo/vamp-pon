# ヨルノシルベ — Scenario Scene Design Contract v1

Date: 2026-08-12  
Status: **CURRENT SCENARIO AUTHORING CONTRACT / CROSS-DISCIPLINE**

## Purpose

シナリオを「設定説明」「重要イベント」「それっぽい日常会話」に分離しない。

全sceneは、人物がその世界で何かをしている時間として設計する。

## Required scene layers

重要度に応じて短くてもよいが、scene authoring時は以下を確認する。

1. `ordinaryTask` — 表面上、今何をしているか
2. `immediateWant` — 今この数分で何が欲しいか
3. `hiddenPressure` — 言葉にしない不安 / 期待 / 疲労
4. `eraAssumption` — その人物のReality Era由来の小さな常識
5. `worldEvidence` — 説明せず見える世界の法則 / 生活物
6. `carriedObjectUse` — 持ち物がsceneで何をするか
7. `bodyActing` — 姿勢 / 視線 / 手 / 座り方 / 距離
8. `relationshipMovement` — 二人以上なら関係が何ミリ動くか
9. `choice` — 小さくても本人が選ぶこと
10. `afterState` — scene後、次のsceneへ何が残るか

## Dialogue rules

- 全員に情報を説明させない
- 相手が知っていることを説明しない
- character voiceを語尾だけで作らない
- silence / interruption / actionを台詞と同格に扱う
- jokeは設定から逃げるためではなく、人物の距離感を見せる
- 深刻な人物にもしょうもない会話を許す
- comedy sceneでもbody / era / taste / relationshipを壊さない

## Everyday scene categories

最低限ローテーションする:

- 食べる / 飲む
- 座る / 待つ
- 移動する / 道を選ぶ
- 片付ける / 掃除する
- 直す / 手入れする
- 買う / 分ける / 借りる
- 誰かを待つ
- 眠い / 暑い / 寒い / 疲れた
- くだらない言い争い
- 誰も悪くないすれ違い
- 一緒に無言で作業する
- 何かを失くす / 見つける

同じ「食事scene」でも人物によってfirst actionを変える。

## Core5 Era assumption examples

### トモリ

- repair / reuseを先に考える
- container / wrappingを捨てる前に見る
- tool扱いへ目が行く

### ミチル

- route / access / 移動順を先に考える
- new road / old pathの違いへ気づく

### ナギ

- permission / privacy / storage boundaryを先に見る
- 勝手に開けない / 覗かない

### ユイ

- search / record / contact / verifyが自然な選択肢
- 保存と共有を同じ行為として扱わない

### アサ

- identity / body / ownershipが1:1とは限らない前提を持つ
- system上の本人確認を人間関係上の本人確認と同一視しない

## Serious scene rule

重大sceneほど、人物をgeneric dramatic modeへ切り替えない。

- 普段触る物をどう扱うか変わる
- 普段の姿勢が崩れる / 固まる
- 普段なら言う冗談を言わない
- 普段なら確認することを飛ばす
- 普段なら断る頼みを引き受ける

など、**平常との差分**で深刻さを出す。

## Kokuyou scene rule

黒耀化直前sceneでは、突然新しい人格を作らない。

```txt
ordinary strength
+ repeated daily coping habit
+ era pressure
+ relationship fear
→ overextension
```

Visual / dialogueとも「いつもの本人」の延長で壊れる。

## Growth proof scene

Arc解決後、必ず小さい日常sceneで変化を一度証明する。

- Tomori: 直さず手放す選択を尊重する
- Michiru: routeより先に目的地を聞く
- Nagi: 守るためでも本人へ確認する
- Yui: 保存前に本人へ聞く / 消す選択を尊重する
- Asa: system上同一でも現在の別人格を別人として扱う

「成長した」と言わせない。

## Scene rejection tests

Reject / rewrite if:

- character namesを入れ替えても成立する
- Eraを変えてもほぼ成立する重要scene
- 世界設定を説明するためだけの会話
- 日常sceneなのに何も持たず何も触らず空間で喋るだけ
- comedyのためだけに知能 / 性格 /身体設定が崩れる
- serious sceneだけ急に全員詩人になる
- conflictのために普段しない無礼や無知を突然する
- growthがclimax speechだけで完了する

## Scene QA one-line

> **このsceneで、誰が・どの時代を生きた人として・何をしながら・誰との距離をどう変えたかが、説明抜きで残るか。**
