# 184. Production Content Databases

キャラ以外の、エネミー・ステージ・アイテムを文字DBとAsset Factory用プロンプトへ落とした正本。
実装参照データ:

- `src/game/data/enemyProductionDatabase.ts`
- `src/game/data/stageProductionDatabase.ts`
- `src/game/data/itemAssetProductionDatabase.ts`
- `src/game/data/productionContentDatabases.test.ts`

## 目的

これまでキャラDBとAsset Factory用キャラプロンプトは固まった。
次に必要なのは、敵・ステージ・アイテムも同じ粒度で、文字情報とアセット生成情報を持つこと。

この文書以降は、次のルールで進める。

```txt
キャラだけ作らない。
敵だけ作らない。
ステージだけ作らない。
アイテムだけ作らない。
すべて、意味・ゲーム役割・見た目・生成プロンプト・レビュー条件を持たせる。
```

## Enemy Production Database

`enemyProductionDatabase.ts` は48体分の敵DB。

| Group | Count | Meaning |
| --- | ---: | --- |
| small | 35 | 雑魚。オンブ系中心。小さいシルエットで読ませる。 |
| medium / elite | 10 | 中型・エリート。オンブロ系中心。攻撃予兆と役割を読ませる。 |
| boss | 3 | 大ボス。名前・箱・帰路の大テーマを担当。 |

各敵が持つ情報:

```txt
id
no
name
rank
family
readableRole
wrongReading
releasedClue
movement
attackCue
silhouette
palette
stageAffinity
dropHint
assetKeywords
```

### Enemy asset prompts

1敵につき4種類。

| Kind | Spec |
| --- | --- |
| sprite_sheet_180 | 1440x1080 / 8x6 / 48 cells / 180x180 / transparent |
| reference | 1024x1024 / reference / transparent |
| attack_sheet | 1440x1080 / 8x6 / attack frames / transparent |
| collection_icon | 512x512 / pure #00FF00 chroma key source |

## Item Asset Production Database

`itemAssetProductionDatabase.ts` は、キャラ量産計画から自動的にアイテム情報を束ねるDB。

各キャラから以下を作る。

1. 初期灯具
2. 持ち物
3. 忘れ物
4. 灯継ぎ
5. 暁開き

さらに、戦闘中ドロップとして以下も含める。

```txt
記憶片
朝露
迷子の鈴
夜明けマッチ
白い切符
```

各アイテムが持つ情報:

```txt
id
characterId
kind
name
role
gameplayUse
loreHook
visualAnchor
motifLaneIds
paletteHint
assetKeywords
```

### Item asset prompts

1アイテムにつき5種類。

| Kind | Spec |
| --- | --- |
| icon_64 | 64x64 / transparent / readable at 32px |
| card_512 | 512x512 / textless card art / transparent |
| pickup_32 | 32x32 / pickup silhouette / transparent |
| evolution_burst | 768x768 / textless evolution effect / transparent |
| ui_slot | 128x128 / item slot icon / transparent |

## Stage Production Database

`stageProductionDatabase.ts` は20ステージ分のDB。
まずCore5の5ステージを実装候補にし、残りはseedとして保持する。

| Phase | Role |
| --- | --- |
| core5 | Core5に紐づく初期ステージ候補。 |
| season_seed | Season内で広げる候補。 |
| future_seed | 将来の総合ステージ候補。 |
| shadow_seed | 黒耀化・後半・高難度導線候補。 |

各ステージが持つ情報:

```txt
id
no
name
phase
leadCharacterIds
coreQuestion
storySeed
backgroundMotifs
enemyAffinity
itemSeeds
stageMechanicSeed
colorScript
assetKeywords
```

### Stage asset prompts

1ステージにつき4種類。

| Kind | Spec |
| --- | --- |
| background_390x844 | 390x844 vertical mobile background |
| parallax_layer_pack | foreground / midground / background layer plan |
| stage_thumbnail | 512x512 stage thumbnail source |
| battle_tile_patch | 1024x1024 paper/night tile patch source |

## Review rules

共通レビュー条件:

- 画像に文字、数字、ロゴ、UIラベルを焼かない。
- 白フリンジ、市松模様、余計な背景を残さない。
- 390x844でゲームプレイの邪魔をしない。
- 小さいアイコンでも意味が読める。
- 黒インクと小さな光の階層を守る。
- 汎用RPG素材や汎用ホラー素材に寄せすぎない。

## Implementation status

| Area | Status |
| --- | --- |
| Character DB | 20人分あり。 |
| Character Asset Factory prompts | 20人 x 9種類あり。 |
| Enemy DB | 48体分あり。 |
| Enemy Asset prompts | 48体 x 4種類あり。 |
| Item Asset DB | キャラ由来100件 + field drop 5件あり。 |
| Item Asset prompts | 全アイテム x 5種類あり。 |
| Stage DB | 20ステージ分あり。 |
| Stage Asset prompts | 20ステージ x 4種類あり。 |

## Next work

1. `pnpm test` でDB integrityを確認する。
2. Asset Factoryの画面/CLIから、character/enemy/item/stage の prompt DB を選べるようにする。
3. まずCore5範囲だけで画像生成する。
4. 生成後はManual IssuesとreviewChecklistを通して再生成する。
5. 実ゲームへの反映は、Core5・Stage1・オンブ系から順に行う。
