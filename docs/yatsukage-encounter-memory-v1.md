# 朔夜座 — Encounter Memory migration reservoir v2

Date: 2026-08-13  
Status: **S1 CURRENT ENCOUNTER-MEMORY RESERVOIR / LEGACY 八影 LABEL COMPATIBILITY / RUNTIME NOT IMPLEMENTED**

> Current formal Season 1 antagonist team is **朔夜座**。
> 旧path / type / event名に `Yatsukage` が残る場合はstable compatibilityのためであり、`八影` をCurrent formal team名へ戻すAuthorityではない。
> `八影` は明示的なearly-observer / historical presentationでのみ使える。

## Goal

朔夜座memberを何度か見るほど「知っている敵」に変える。

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

正式team名をPlayerがまだ知らないsceneなら、ここで朔夜座badgeを先出ししない。

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

という作中call nameが会話で自然に使える。

Call nameは真名ではない。

### PAST_CONTEXT_KNOWN

過去断片を知る。

重要:

> 過去を知った = 許した

ではない。

Current21各人物のlateShiftを表示へ使い、「理解したが止める」「技術だけ認める」「余計に許せなくなる」も成立させる。

このphaseで旧 `八影` という観測呼称そのものを資料として見せる場合は、**旧観測呼称であることを明示**する。Current formal nameとしてbadge化しない。

### REINTERPRETED

後半Stageの出来事を通して、最初の戦闘の意味が変わる。

Current formal group labelが必要な表示では **朔夜座** を使う。

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

朔夜座戦では3人それぞれにpersonal presentationを持つ。

Speaker候補:

- opening
- tactical reply
- afterimage/result

を分離する。

Featured Arc人物がopening候補になりやすくても、同じ1人に3slot全部を渡さない。

最終speaker arbitrationにはruntimeのseen-line historyが必要。

## No power reward

朔夜座memberの過去を読むこと、呼び名を知ること、REINTERPRETEDまで見ることをcombat power条件へしない。

- 読む人は深く楽しめる
- 読まない人もTitle1を攻略できる
- 100% collectionとは接続できる
- Story Complete必須条件にはしない

## Visual / Guide rule

- Encounter Memory phaseごとに同じ人物画像を複製しない。
- approved individual Character / Enemy reference Masterを共通parentとして使う。
- phase badge、履歴、テキスト、relation statusはHTML/CSS/SVG/dataを優先する。
- `PAST_CONTEXT_KNOWN`の旧八影資料表示だけを理由に、旧八影集合Masterを新規生成しない。
- `REINTERPRETED`のCurrent formal labelは朔夜座。
- phase変化から衣装・身体・真名を画像モデルに発明させない。

## Runtime open work

- append-only seen-event ledger
- save schema / migration
- per relation phase cache
- seen-line / speaker history
- battle/result/bestiary presentation
- subtitle/voice variant selection

Content contractだけでruntime実装済みとは扱わない。

## Compatibility

Legacy stable source/API names:

- `src/game/data/yatsukageEncounterMemorySource.ts`
- `Yatsukage*` types/functions

Current-facing facade:

- `src/game/data/sakuyazaLegacyMigrationSource.ts`

Current authority:

- `docs/00-current-story-world-master.md`
- `docs/sakuyaza-current-identity-v1.md`
- `src/game/data/sakumeiCandidateSource.ts`
