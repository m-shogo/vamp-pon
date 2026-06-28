# Core5 Runtime Loadout Map

Character Database v1 は20キャラの正本データ、`src/game/data/characters.ts` は現在のruntimeへ出すCore5軽量データ。
この文書は、Core5の初期武器・関連アイテム・進化導線がruntimeでどこまで実装済みかを確認するための対応表。

## Core5対応表

| Character | runtime initialWeaponId | 初期武器 | 関連パッシブ | 関連レア | 灯継ぎ | 暁開き | runtime状態 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `yui` ユイ | `night_pencil` | 夜の鉛筆 | `gold_compass` / 金のコンパス | `name_tag` / 誰かの名前札 | 未完成の一行 | 消えない名前 | 初期武器・パッシブ・レア・進化実装済み |
| `asa` アサ | `postcard_blade` | 絵はがきカッター | `travel_badge` / 旅のバッジ | `sealed_letter` / 封のされた手紙 | 暁綴りの紙片 | 暁に結ぶ名 | 初期武器・パッシブ・レアは実装済み。正本上の技名と現runtime進化名はまだ完全一致ではない |
| `nagi` ナギ | `moon_bookmark` | 月のしおり | `moonlight_bookmark` / 月明かりのしおり | 小さな銀の鍵 | 封月のしおり | 夜をしまう箱 | 初期武器・パッシブ実装済み。専用レア/進化はfuture seed |
| `michiru` ミチル | `streetlamp_ring` | 街灯の輪 | `loose_map_pin` / 外れた地図ピン | 折れたコンパス針 | 星図の道糸 | 帰り道の星 | 初期武器・パッシブ実装済み。専用レア/進化はfuture seed |
| `tomori` トモリ | `black_ink_bottle` | 黒インクの小瓶 | `white_margin` / 白い余白 | 切れた灯芯 | ほころび灯し | 夜を直す灯 | 初期武器・パッシブ実装済み。専用レア/進化はfuture seed |

## Runtime実装済みの進化

| Evolution | Kind | 条件 | 結果 | Core5との関係 |
| --- | --- | --- | --- | --- |
| `unfinished_line_upgrade` | upgrade | `night_pencil` + `moonlight_bookmark` | `unfinished_line` | ユイの灯継ぎ候補。現runtimeではナギ系パッシブとも組む |
| `unforgotten_name_awakening` | awakening | `night_pencil` + `name_tag` | `unforgotten_name` | ユイの暁開き |
| `sealed_postcard_awakening` | awakening | `postcard_blade` + `sealed_letter` | `addressless_blade` | アサ初期武器の覚醒。正本名とは後で整理余地あり |
| `dawn_ink_lamp_fusion` | fusion | `black_ink_bottle` + `streetlamp_ring` | `dawn_ink_lamp` | トモリ/ミチル初期武器の合体 |
| `memory_marble_awakening` | awakening | `marble` + `cracked_lens` | `memory_marble` | Core5初期武器ではないがruntime導線あり |
| `tailwind_plane_awakening` | awakening | `paper_airplane` + `wind_mark` | `tailwind_plane` | Core5初期武器ではないがruntime導線あり |
| `north_star_lantern_upgrade` | upgrade | `stardust_shot` + `gold_compass` | `north_star_lantern` | Core5初期武器ではないがruntime導線あり |

## Known Risks

- レア無し合体: 現在の `fusion` は `black_ink_bottle` + `streetlamp_ring` の武器同士合体で、rare item は要求しない。これは仕様上許容しているが、UI文言では覚醒レアと混同しないこと。
- 合体後素材武器再出現: `retiredWeaponIds()` と `consumedWeaponIds` により、素材武器は新規抽選へ戻らない前提。既存テストで退役扱いを確認している。
- rare slot 2枠: 覚醒素材レアと `dawn_ticket` の復帰レアが同じrare枠を使う。通常抽選に復帰レアを出す前に出現重みと再取得可否を別タスクで決める。
- 初期武器がキャラごとに違う時の抽選バランス: Core5は初期武器が異なるため、序盤候補の偏りや進化到達速度が変わる。P1では大きなバランス変更をせず、smokeと整合性確認を優先する。
- 未実装Core5専用アイテム: ナギ/ミチル/トモリの専用レアはfuture seedとして保持し、画像・効果・進化仕様が固まるまでruntime追加しない。

## Unity Handoff

Unity移行時は、以下をScriptableObjectへ分けて移す。

- Character: `characterId`, display name, baseStats, initialWeaponId, ultimate id/name/effect
- Weapon: runtime weapon definition, maxLevel, levels, effect payload
- Passive: passive id, stat, levels
- Rare Item: role, description, lore, runtime availability
- Evolution: kind, required ids, consumed ids, evolvedWeaponId
- Asset refs: sprite sheet, cutin, icon, emblem, approved状態

## Asset Factory Needed Assets

- Core5 character reference / sprite sheet / normal cutin / kokuyou cutin
- Core5 initial weapon icons where prototype quality is still weak
- Core5 passive icons and future rare icons
- A-Z灯紋 `emblem_normal`, `emblem_dawn`, `emblem_kokuyou`
- Stage-specific backgrounds and enemy sheets for Stage1/2

## Scope Split

P1でやること:

- Core5だけをruntime候補として保持する
- 初期武器が存在し、run開始時に武器なしにならないことを守る
- 既存進化/覚醒/合体の参照整合を守る
- 未実装専用レアはfuture seedとしてdocsに残す

P1後でやること:

- ナギ/ミチル/トモリ専用レアと専用進化の実装判断
- 正本技名とruntime進化名の統一
- Core5ごとの初期武器バランス調整
- CharacterSelect本実装とCore5切替UI
