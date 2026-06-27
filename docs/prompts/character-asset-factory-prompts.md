# Character Asset Factory Prompts

20キャラそれぞれの Asset Factory 用プロンプト正本。
実装参照データは `src/game/data/assetFactoryCharacterPrompts.ts`。

## 目的

キャラを量産するときに、毎回プロンプトをゼロから作らない。
`characterDatabase.ts` の正本情報を使い、各キャラごとに以下の素材プロンプトを生成できるようにする。

1. 180セルスプライトシート
2. キャラ基準立ち絵
3. 通常暁灯カットイン
4. 暁開きカットイン
5. 黒耀化カットイン
6. 無紋
7. 通常灯紋
8. 暁紋
9. 黒紋

## Shared no-text rule

すべてのキャラ素材で共通。

```txt
no text, no letters, no numbers, no logo, no watermark,
no UI frame labels, no checkerboard, no white background,
no white fringe, no glossy plastic, no realistic human, no gore
```

キャラ名、AZコード、技名、黒耀化副題、ラベルは必ず UI text で出す。
画像には焼き込まない。

## Output specs

| Asset | Spec |
| --- | --- |
| sprite_sheet_180 | 1440x1080 PNG RGBA / 8x6 / 48 cells / 180x180 per cell / transparent |
| character_reference | 1024x1024 PNG RGBA / full body / transparent |
| normal_cutin | 1440x360 PNG RGBA / transparent / horizontal wide |
| dawn_cutin | 1440x360 PNG RGBA / transparent / horizontal wide |
| kokuyou_cutin | 1440x360 PNG RGBA / transparent / horizontal wide |
| emblem_* | 512x512 PNG source / one emblem / pure #00FF00 chroma key source |

## Per-character prompt seeds

この表は、各キャラのプロンプトで必ず入る核。
詳細プロンプトは `characterAssetPromptPacks` から生成する。

| Character | Asset seed |
| --- | --- |
| ユイ | vessel: ランタン / starter: 夜の鉛筆 / arts: 夜解きの灯, 忘れ火の道標, 消えない名前 / kokuyou: 呼びすぎた名前 / emblem: Y-01 消えない名の灯紋 |
| アサ | vessel: 小さな名札と紙片 / starter: 絵はがきカッター / arts: 名札灯し, 暁綴り, 暁に結ぶ名 / kokuyou: 黒い名札 / emblem: A-02 名札結びの灯紋 |
| ナギ | vessel: 月箱と鍵 / starter: 月のしおり / arts: 月箱の鍵, 封月の守り, 夜をしまう箱 / kokuyou: 開いた月箱 / emblem: N-03 月箱守りの灯紋 |
| ミチル | vessel: コンパスと地図線 / starter: 街灯の輪 / arts: 帰針, 星図の道糸, 帰り道の星 / kokuyou: 迷い星図 / emblem: M-04 帰星の灯紋 |
| トモリ | vessel: 修理ランプと道具袋 / starter: 黒インクの小瓶 / arts: 継火, ほころび灯し, 夜を直す灯 / kokuyou: ほころぶ継火 / emblem: T-05 ほころび継火の灯紋 |
| セン | vessel: チョークランプ / starter: チョークの線 / arts: 白線灯し, 教室の道筋, 消えない一文 / kokuyou: 消えた一文 / emblem: S-06 白線教えの灯紋 |
| リツ | vessel: 半分の飴の包み紙 / starter: 半分の飴 / arts: 半灯分け, 包み紙の火, 残した半分 / kokuyou: 焦げた半分 / emblem: R-07 半灯分けの灯紋 |
| コヨリ | vessel: 小さな名札 / starter: 小さな名札 / arts: 小名灯し, 呼び名の紙縒り, 一番消えない名 / kokuyou: ほどけた呼び名 / emblem: K-08 小名紙縒りの灯紋 |
| ゲン | vessel: 古いコンパス / starter: 古いコンパス / arts: 古針, 駅前の道火, 古い道の朝 / kokuyou: 錆びた帰針 / emblem: G-09 古針駅灯の灯紋 |
| ハナ | vessel: 押し花のしおり / starter: 押し花のしおり / arts: 押花灯, 箱底の花, 枯れない頁 / kokuyou: 黒い花脈 / emblem: H-10 押花箱底の灯紋 |
| ユウビ | vessel: 未配達の封筒 / starter: 未配達の封筒 / arts: 封灯, 遅れて届く火, 届かなかった返事 / kokuyou: つぶれた消印 / emblem: U-11 未配達封灯の灯紋 |
| マドカ | vessel: 窓際の紙飛行機 / starter: 窓際の紙飛行機 / arts: 窓灯, 見ていた紙翼, 気づいていた朝 / kokuyou: 黒い窓 / emblem: D-12 窓紙翼の灯紋 |
| シロ | vessel: 白いしおり / starter: 白いしおり / arts: 白栞, 未分類の頁, 読めない頁の灯 / kokuyou: 抜け落ちた頁 / emblem: I-13 白栞頁灯の灯紋 |
| トバリ | vessel: 改札ばさみと古い切符 / starter: 改札ばさみ / arts: 改札灯, 改札のひかり, 片道ではない切符 / kokuyou: 閉じた改札 / emblem: B-14 改札境目の灯紋 |
| ネム | vessel: 夢日記 / starter: 夢日記 / arts: 夢写し, 眠り頁, 夢で見た朝 / kokuyou: 黒い夢波 / emblem: E-15 夢頁水面の灯紋 |
| クロオリ | vessel: 黒い折り紙 / starter: 黒い折り紙 / arts: 黒折, 四つ折りの影, 開かれる黒紙 / kokuyou: 開かない折り目 / emblem: O-16 黒折り紙の灯紋 |
| カゲール1 | vessel: 影の折り目 / starter: 影の折り目 / arts: 隠し火, 隠し火, 朝まで残った影 / kokuyou: 守りすぎた影 / emblem: V-17 影守り火の灯紋 |
| カゲール2 | vessel: 消しゴムのかけら / starter: 消しゴムのかけら / arts: 薄れ灯, 薄れ名, 残された一文字 / kokuyou: 消せない一文字 / emblem: C-18 消せない一文字の灯紋 |
| カゲール3 | vessel: 夜読みの定規 / starter: 夜読みの定規 / arts: 角灯, 角度の火, 測れない夜明け / kokuyou: 割れた角度 / emblem: J-19 夜測り角度の灯紋 |
| カゲール4 | vessel: 空白のカード / starter: 空白のカード / arts: 余白灯, 余白の継ぎ目, 続きを描く朝 / kokuyou: 黒い余白 / emblem: Q-20 余白継ぎ目の灯紋 |

## How to use in Asset Factory

1. Pick `characterId`.
2. Pick prompt kind.
3. Read from `getCharacterAssetPrompt(characterId, kind)`.
4. Generate the asset.
5. Review with `reviewChecklist`.
6. If there are manual issues, feed them into regeneration prompt.
7. Do not promote to approved if baked text, white fringe, wrong background, or character identity loss remains.

## Recommended first batch

Core5 only:

```txt
yui, asa, nagi, michiru, tomori
```

For each Core5 character, generate in this order:

```txt
character_reference
sprite_sheet_180
normal_cutin
kokuyou_cutin
emblem_normal
emblem_dawn
emblem_kokuyou
```

`emblem_blank` can be generated once the normal phase silhouette is stable.
