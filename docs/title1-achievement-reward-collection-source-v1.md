# ヨルノシルベ1 Achievement / Reward / Collection Source v1

## Authority

- Scope: Title1 Stage1-20
- Source: `src/game/data/title1AchievementRewardCollectionSource.ts`
- Authority: `CONTENT_SOURCE_ONLY`
- 既存 `ACHIEVEMENT_DEFS` 14件を削除・置換しない。
- 既存「忘れ物通り 夜明け星図」25セルを削除・置換しない。
- Runtime reward claim / Save / migration / UI接続は別工程。

## Core loop

`Stage → 達成 → 報酬 → 図鑑/星図 → 次runの別回答`

をTitle1全体の循環にする。

報酬は永久火力の購入圧ではなく、次のrunで別Character・別Weapon shape・別Reaction・別counterを試したくなる方向へ使う。

## Reward lanes

- `RECORD_ONLY`: 記録だけ。通貨を増やさない休息点。
- `LIGHT_COIN`: 小〜中規模。repeatable farm不可。
- `TRAVEL_PREP`: comfort / run準備側。
- `MEMORY_TEXT`: 読み物。未読でもpower/Stage進行/Happy Endに影響しない。
- `COSMETIC`: mastery/終盤の非power報酬。
- `SOUND`: 世界観報酬。powerを持たせない。

## Anti-grind

禁止:

- 初clearをrepeatable currency farmにする
- Reaction発動100回/1000体撃破など量だけのノルマ
- 特定Weapon/Character/Reactionを唯一のclear条件にする
- 全14属性 / 全12Reaction / 全Record / Challenge100%をHappy End条件にする
- Night Recordを読むまでpowerを渡さない
- DARK不利Stageでクロオリを出禁にする

## Existing compatibility

既存Stage1には以下が既にある。

- Runtime Achievement: 14件
- 忘れ物通り 夜明け星図: 25セル
- Collection sections: 6

Stage1の新しいTitle1 milestoneはこれらの**上位設計**であり、同じclearに通貨を二重付与しない。

## Stage pacing

- Stage1-4: natural clear中心。Reward UIを覚える。
- Stage5-9: Break / Status / attack shapeを軽いtargeted milestoneへ。
- Stage10-14: Reactionを使っても使わなくても抜けられるcounterplay milestone。
- Stage15-18: Character/思想/Build再構成をmasteryへ。
- Stage19: comfortと「選ばない」価値。
- Stage20: Happy End。新しい基礎ルールは追加せず、cosmetic + optional challengeへ。

## Collection reveal

6 sectionをStage20全体で使う。

- `dawn_atlas`: Stage/Build/mastery
- `bestiary`: Enemy/pressure/counter
- `lost_item_cards`: 世界とItemの接点
- `keeper_records`: Character/黒耀化/暁開き/関係
- `word_records`: optional lore / choice / memory
- `achievements`: Title1完結後も任意Challengeを確認

全Sectionを埋めなくてもHappy Endへ到達できる。

## Upstream integration

このSourceは現在のTitle1 content scopeを監視する。

- Combat Item 18 placement
- Transformation Selected29 / Hold9
- Stage20 campaign
- existing Achievement14
- existing Stage1 board25

上流countが変わったらcheckerを失敗させ、無言のdriftを防ぐ。

## Runtime boundary

実runtimeへ接続する際は別途:

1. achievement id migration / compatibility
2. one-shot claim ledger
3. duplicate reward guard
4. Result UI
5. Collection reveal persistence
6. cosmetic/sound access state
7. save migration
8. playtest / reward economy tuning

が必要。

`runtimeAutoPromotionAllowed = false`
