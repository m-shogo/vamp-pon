# 夜綴りの八影 — Encounter Memory v1

Date: 2026-08-11  
Status: **CONTENT LEDGER CONTRACT / RUNTIME NOT IMPLEMENTED**

## Goal

八影を何度か見るほど「知っている敵」に変える。

ただし、撃破回数だけで好感度や関係レベルが上がる方式にはしない。

## Four presentation phases

```txt
FIRST_ENCOUNTER
→ CALL_NAME_RECOGNIZED
→ PAST_CONTEXT_KNOWN
→ REINTERPRETED
```

### FIRST_ENCOUNTER

まだ敵の行動しか知らない。

- 怖い
- 腹が立つ
- 変な癖に気づく
- 自分と似ている気がして嫌だ

など、Current21それぞれのfirstReactionを使う。

### CALL_NAME_RECOGNIZED

「またあいつだ」が成立する段階。

- ナシロ
- アサトジ
- ミチグレ
- オリネ
- ハクマ
- ツグリ
- ユラネ
- ペタ

という作中呼称が会話で自然に使える。

### PAST_CONTEXT_KNOWN

過去断片を知る。

重要:

> 過去を知った = 許した

ではない。

Current21各人物のlateShiftを表示へ使い、「理解したが止める」「技術だけ認める」「余計に許せなくなる」も成立させる。

### REINTERPRETED

後半Stageの出来事を通して、最初の戦闘の意味が変わる。

勝利台詞を派手にするより、postBattleActionの小さな差分を使う。

例:

- 最初は札を破った人物が、後半では訂正線を残す
- 最初は箱を壊そうとした人物が、後半では開封条件を残す
- 最初は夢を否定した人物が、後半では夢頁を保存したまま起きる

## Events that may deepen presentation

Only semantic observations:

1. `FIRST_ENCOUNTER_SEEN`
2. `CALL_NAME_OBSERVED`
3. `PAST_FRAGMENT_OBSERVED`
4. `REINTERPRETATION_BEAT_SEEN`

`COMBAT_CLEAR`は観測してよいが、relationship phaseへの価値は0。

```txt
100回撃破
!=
REINTERPRETED
```

## Duplicate / out-of-order safety

- eventId重複は一度として扱う
- past fragmentを先に拾っても、必要情報が揃うまで表示phaseは飛ばさない
- semantic flagsが全部揃った時点で後からREINTERPRETEDへ解決できる

## Three-person party

八影戦では3人それぞれにpersonal presentationを持つ。

Speaker候補:

- opening
- tactical reply
- afterimage/result

を分離する。

Featured Arc人物がopening候補になりやすくても、同じ1人に3slot全部を渡さない。

最終speaker arbitrationにはruntimeのseen-line historyが必要。

## No power reward

八影の過去を読むこと、呼び名を知ること、REINTERPRETEDまで見ることをcombat power条件へしない。

- 読む人は深く楽しめる
- 読まない人もTitle1を攻略できる
- 100% collectionとは接続できる
- Story Complete必須条件にはしない

## Runtime open work

- append-only seen-event ledger
- save schema / migration
- per relation phase cache
- seen-line / speaker history
- battle/result/bestiary presentation
- subtitle/voice variant selection

Content contractだけでruntime実装済みとは扱わない。
