# 181. Current Production Canon

最新のキャラ量産・アイテム・A-Z灯紋・UI用語の入口。
古い検討メモと矛盾した場合は、この文書と下記の runtime data を優先する。

## Source of truth

| Layer | Runtime / doc |
| --- | --- |
| UI/world terms | `src/game/data/worldTerms.ts` / `docs/design/world-labels.md` |
| 20-character canon | `src/game/data/characterCanon.ts` / `docs/180-unified-character-canon.md` |
| Character Database v1 | `src/game/data/characterDatabase.ts` / `docs/183-character-database-v1.md` |
| Character Asset Factory prompts | `src/game/data/assetFactoryCharacterPrompts.ts` / `docs/prompts/character-asset-factory-prompts.md` |
| Core5 art names | `src/game/data/characterArts.ts` |
| Kokuyou forms | `src/game/data/kokuyouForms.ts` |
| Pair light arts | `src/game/data/pairLightArts.ts` |
| Item production canon | `src/game/data/itemProductionCanon.ts` / `docs/design/item-and-character-production-canon.md` |
| Character production plans | `src/game/data/characterProductionPlans.ts` / `docs/design/character-production-plans.md` |
| A-Z emblems | `src/game/data/emblemCanon.ts` / `docs/design/emblem-canon.md` / `docs/design/az-emblem-canon.md` |
| A-Z emblem prompts | `docs/prompts/az-emblem-asset-prompts.md` |

## Current rule

キャラ量産は、キャラだけ増やさない。
1人につき必ず次を同時に持たせる。

1. 初期灯具
2. 持ち物
3. 忘れ物
4. 灯技
5. 継灯
6. 暁灯
7. 灯継ぎ
8. 暁開き
9. 黒耀化副題
10. 黒耀化の歪み
11. 灯合わせ候補
12. A-Z灯紋
13. 通常/黒耀化/暁の素材キーワード
14. グッズ展開フック
15. Unity Handoff 用 prefabId / addressableGroup / sceneEligibility
16. Asset Factory 用の素材別プロンプトとreview checklist

## Current naming lock

| Target | Label |
| --- | --- |
| Base character art | 灯技 |
| Evolved character art | 継灯 |
| Decisive character art | 暁灯 |
| Kokuyou form | 黒耀化 |
| Kokuyou backlash | 煤返り |
| Kokuyou gauge | 黒耀瓶 |
| Weapon / active item | 灯具 |
| Passive | 持ち物 |
| Rare item | 忘れ物 |
| Field drop | 落とし物 |
| Currency / fragment | 記憶片 |
| Upgrade | 灯継ぎ |
| Awakening | 暁開き |
| Fusion / pair art | 灯合わせ |
| Collection | 灯録 |
| Achievement | 記憶のしるし |
| Result | 旅の記録 |
| Stage clear | 夜明け |
| Emblem device | 灯紋具 |
| Character emblem | 灯紋 |
| A-Z series | A-Z灯紋 |

## Core5 production set

| Character | 初期灯具 | 持ち物 | 忘れ物 | 灯技 | 継灯 | 暁灯 | A-Z灯紋 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ユイ | 夜の鉛筆 | 金のコンパス | 誰かの名前札 | 夜解きの灯 | 忘れ火の道標 | 消えない名前 | Y-01 消えない名の灯紋 |
| アサ | 絵はがきカッター | 旅のバッジ | 封のされた手紙 | 名札灯し | 暁綴り | 暁に結ぶ名 | A-02 名札結びの灯紋 |
| ナギ | 月のしおり | 月明かりのしおり | 小さな銀の鍵 | 月箱の鍵 | 封月の守り | 夜をしまう箱 | N-03 月箱守りの灯紋 |
| ミチル | 街灯の輪 | 外れた地図ピン | 折れたコンパス針 | 帰針 | 星図の道糸 | 帰り道の星 | M-04 帰星の灯紋 |
| トモリ | 黒インクの小瓶 | 白い余白 | 切れた灯芯 | 継火 | ほころび灯し | 夜を直す灯 | T-05 ほころび継火の灯紋 |

## Character Database v1

`src/game/data/characterDatabase.ts` は、20キャラの正本データを実装用に束ねる統合レイヤー。
手入力で重複管理せず、既存の正本から導出する。

| Included | Source |
| --- | --- |
| 名前・関係・戦闘方向・技名 | `characterCanon.ts` |
| 初期灯具・持ち物・忘れ物・進化・素材キーワード | `characterProductionPlans.ts` |
| 黒耀化副題・歪み | `kokuyouForms.ts` |
| Core5灯合わせ | `pairLightArts.ts` |
| A-Z灯紋・グッズ展開 | `emblemCanon.ts` |
| Unity Handoff fields | `characterDatabase.ts` |
| Asset Factory prompt seed | `assetFactoryCharacterPrompts.ts` |

## Asset Factory prompt set

各キャラは `src/game/data/assetFactoryCharacterPrompts.ts` で、次の9種類の素材プロンプトを持つ。

1. `sprite_sheet_180`
2. `character_reference`
3. `normal_cutin`
4. `dawn_cutin`
5. `kokuyou_cutin`
6. `emblem_blank`
7. `emblem_normal`
8. `emblem_dawn`
9. `emblem_kokuyou`

出力ルールは `docs/prompts/character-asset-factory-prompts.md` を参照する。

## Kokuyou rule

黒耀化は共通システム名。
ただし、表示ではキャラ別副題を持たせる。

| Character | 黒耀化副題 |
| --- | --- |
| ユイ | 呼びすぎた名前 |
| アサ | 黒い名札 |
| ナギ | 開いた月箱 |
| ミチル | 迷い星図 |
| トモリ | ほころぶ継火 |

20人分の副題は `src/game/data/kokuyouForms.ts` を参照する。

## A-Z emblem rule

A-Z灯紋はキャラ量産の必須要素。
1キャラにつき最低4相を作る。

| Phase | Display | Rule |
| --- | --- | --- |
| blank | 無紋 | 未解放。薄い線だけで持ち物シルエットは読めない。 |
| normal | 灯紋 | 通常解放。持ち物、動詞、光の形が紋になる。 |
| dawn | 暁紋 | 暁灯/暁開き後。外周に朝の線が入る。 |
| kokuyou | 黒紋 | 黒耀化中。長所が歪んだ黒い傷を1つだけ入れる。 |
| pair | 双灯紋 | 灯合わせ。2人の灯紋が半分ずつ重なる。 |

## Asset rule

- カットイン画像・灯紋画像に文字を焼かない。
- キャラ名、AZコード、技名、ラベルはUI textで出す。
- 1画像1アセット。
- UI素材生成時は純緑 `#00FF00` 背景を使う。
- 透過化後の白フリンジ・市松模様・ロゴ・文字は禁止。
- 390x844のスマホ縦画面で読めることを優先する。

## Implementation status

| Area | Status |
| --- | --- |
| World terms | 正本データあり。UI全体への参照置換は未完了。 |
| 20 characters | 正本データあり。playable runtime はCore5から段階適用。 |
| Character Database v1 | 20人分の統合データあり。ID/必須項目/integrity test あり。 |
| Character Asset Factory prompts | 20人 x 9種類の素材プロンプトあり。integrity test あり。 |
| Core5 arts | 正本データあり。 |
| Kokuyou subtitles | 20人分あり。カットインの表示連動あり。 |
| Pair arts | Core5 10組あり。 |
| Item production plans | 20人分あり。既存 weapons/passives/rareItems/evolutions への全反映は未完了。 |
| A-Z emblems | 20人分あり。画像生成/実UI反映は未完了。 |

## Next implementation order

1. `weapons.ts` / `passives.ts` / `rareItems.ts` / `evolutions.ts` に Core5 分を先に反映する。
2. HUD / level-up / result / collection UI の旧用語を `WORLD_TERMS` 参照へ寄せる。
3. `characterDatabase.ts` と `assetFactoryCharacterPrompts.ts` を Asset Factory export / Unity handoff export / キャラ選択 / 灯録から参照する。
4. キャラ選択は Core5 のみ表示する。
5. A-Z灯紋は灯録・キャラ詳細・キャラ選択に normal 相から表示する。
6. season_seed / future_seed / shadow5 は、設計データとして保持し、選択画面には出さない。
