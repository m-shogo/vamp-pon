# デザインターゲット画像

commit `2bc809a` で追加されたデザイン参照画像の整理。
画像は **完成目標 / 実装参照** であり、1枚絵として画面に貼ることは禁止。
Phaser Graphics / 既存UI helper / 再利用可能なUI部品で再現する。

## final/ — 完成目標イメージ

### result-clear-final.png
- **画面**: Result Clear
- **採用する要素**: 大きな記憶ページ背景、封蝋ランクシール(A/B/C/S)、REWARDS横並びカード行、NEW RECORDS達成行(チェックマーク付き)、朝焼けglow(上部)、下部CTA階層(3段)、紙タグ装飾
- **採用しない要素**: AI画像内の文字(CLEAR, REWARDS等はゲーム側Textで描画)、背景の街並みシルエット(密度高すぎ)、細かい紙の質感テクスチャ(Graphicsで簡略化)
- **実装対象**: `src/game/ui/overlays.ts`, 新規 `src/game/ui/resultMemoryPage.ts`
- **再生成**: 不要

### battle-final.png
- **画面**: Battle HUD
- **採用する要素**: 紙札HUDステータスタグ(LV/HP/EXP/Down in/Shard)、右下ランタン封蝋必殺ボタン、左下黒曜化ゲージ(瓶+インク)、下部紙カードインベントリスロット、EXP曲線軌跡、黒インク敵シルエット、Memory Street進行バー
- **採用しない要素**: 背景の詳細な建物描写(戦闘視認性優先で大幅簡略化)、敵名のフォント装飾、中央の描き込み密度
- **実装対象**: `src/game/ui/hud.ts`, `src/game/ui/inventorySlot.ts`, `src/game/ui/berserkFeedback.ts`
- **再生成**: 望ましい

### collection-final.png
- **画面**: Collection
- **採用する要素**: 紙index 6タブ(ALL/ITEMS/SHADOWS/KEEPERS/WORDS/MARKS)、2列カードレイアウト(クリップ付き)、進捗バー(数値付き)、ノートページ背景、コンパス/seal装飾、下部ナビ(MAP/JOURNEY/LANTERN/RECORDS/SHOP/SETTINGS)
- **採用しない要素**: AI画像内の文字(LANTERN LEDGER等)、カード内の詳細イラスト(ゲーム側アセットで差し替え)、6カテゴリの英語名(日本語タブに寄せる: 星図/影/絵札/灯/言葉/実績)
- **実装対象**: `src/game/scenes/CollectionScene.ts`, `src/game/ui/collectionAtlasAtmosphere.ts`
- **再生成**: 不要

### kokuyou-cutin-final.png
- **画面**: 黒曜化カットイン
- **採用する要素**: 斜め構図、黒インクslash、暖色ランタンライン、タイトル帯「黒曜化」、「記憶の灯火が、力に変わる」テキスト構成、下部「タップで発動」CTA配置
- **採用しない要素**: AI生成のユイ立ち絵(実装では既存カットイン素材または帯構成で代替)、画像内の日本語テキスト(ゲーム側Textで描画)、細かい星エフェクト
- **実装対象**: `src/game/ui/characterCutin.ts`, `src/game/ui/berserkFeedback.ts`
- **再生成**: 不要(テキストなし素材が必要になる場合あり)

### level-up-final.png
- **画面**: Level Up
- **採用する要素**: 3枚紙カード(Normal/Good/Rare)、カード内構造(icon area / title / description / stat)、Rareの暖色glow + 封蝋シール、「Find the lost page...」風の紙タグ、下部Owned row(所持数表示)、上部「Level Up / Choose a memory to strengthen」バナー
- **採用しない要素**: AI画像内の文字、カード内の詳細イラスト(ゲーム側アイコンで代替)、背景の紙質テクスチャ密度
- **実装対象**: `src/game/ui/storybookChoiceCard.ts`, `src/game/ui/overlays.ts`
- **再生成**: 不要

### stage-select-final.png
- **画面**: Stage Select
- **採用する要素**: 大きな地図カード(ルートライン/ノード/ターゲットマーク)、LV表示、封蝋ランクシール、Best Record、Easy/Normal/Hard 3枚紙カード(ランタンアイコン差分)、Start Journey大型紙CTA、Back/Records下部導線
- **採用しない要素**: AI画像内の文字(STAGE SELECT, STAGE NAME等)、地図カード内の詳細背景描写、細かいインク飛沫装飾
- **実装対象**: `src/game/scenes/StageSelectScene.ts`
- **再生成**: 不要

### top-final.png
- **画面**: TOP / タイトル
- **採用する要素**: 紙札タイトルバナー、「夜へ出る」主CTA紙ボタン、成長/忘れ物帳/設定の3小ボタン、NEW灯り表示、夜+月+星+ランタン光の世界観、インク飛沫装飾
- **採用しない要素**: 大きなユイ立ち絵(キャラ絵に依存しない構成)、AI画像内のVamp Ponロゴテキスト、背景の建物シルエット密度
- **実装対象**: `src/game/scenes/TopScene.ts`
- **再生成**: 不要

## implementation/ — 実装参照イメージ

### top-implementation.png
- **画面**: TOP / タイトル (実装向け簡略版)
- **採用する要素**: 2段構成(上部タイトルエリア+中央紙パネル+下部ボタン群)、紙パネルの余白配置、ランタンアイコンのアクセント位置、3小ボタンの紙カード形状、星+夜空の簡略背景
- **採用しない要素**: なし(実装向けに簡略化済み)
- **実装対象**: `src/game/scenes/TopScene.ts`
- **再生成**: 不要

## デザイン修正が必要な画像

- **image path**: `docs/design-targets/final/battle-final.png`
- **issue**: 背景の描き込みが多く、敵/EXP/弾の視認性が落ちる。右下ランタン封蝋Ultimateと左下黒曜化ゲージの方向性は良いが、中央フィールドが完成イラスト寄りで実装分解しにくい。
- **regenerate prompt**: Create a simplified Phaser implementation target for the battle screen. Character: tiny gameplay marker only. Reduce background detail by 60%. Keep paper HUD tags (LV/HP/EXP/timer/shards), ultimate lantern seal button (bottom-right), kokuyou ink gauge (bottom-left bottle), paper card inventory slots (bottom), black ink enemy silhouettes, EXP curve trails. Use clean separable layers: background, enemies, player marker, exp trails, HUD tags, bottom inventory, ultimate button, kokuyou gauge. No poster composition. No tiny handwriting. No final rendered text. Mobile 390x844 safe. Palette: deep navy #0F1320, paper beige #D8C49A, warm amber #F4C46A, lantern core #FFE7AE, ink black #07060B.
