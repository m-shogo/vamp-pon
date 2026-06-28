# Asset Factory Real Asset Test Pack

Asset Factory で実画像制作フローを1周だけ検証するための最小テストパック。
目的は量産前に「Prompt Packで指示を作る → 画像を投入する → 自動検査と手動レビューを記録する → 再生成/Unity handoffへ渡せるか」を確認すること。

ゲーム本体の挙動、runtime asset 登録、既存画像の移動はこのテストパックでは行わない。

## 固定対象

| Type | ID | 目的 | Prompt Pack / Preset | 期待サイズ | 期待ファイル名 |
|---|---|---|---|---|---|
| Enemy | `ombu-small` | Stage1の基本敵。最小オンブの読みやすさと48セル検査を確認する | Enemy / オンブ（小型基本） | 1440x1080 / 8x6 / 180px | `enemy-ombu-small-sheet-1440x1080.png` |
| Enemy | `ombu-umbrella-shield` | 傘の非対称モチーフとshield行動が小画面で読めるか確認する | Enemy / オンブ傘（シールド） | 1440x1080 / 8x6 / 180px | `enemy-ombu-umbrella-shield-sheet-1440x1080.png` |
| Weapon | `night-pencil` | 直線武器アイコンの32px可読性と白フリンジ確認 | Weapon / 夜鉛筆 | 1024x1024 | `weapon-night-pencil-icon-1024.png` |
| Weapon | `black-ink-bottle` | 範囲武器アイコンの黒インク表現と毒瓶誤読の確認 | Weapon / 黒インク瓶 | 1024x1024 | `weapon-black-ink-bottle-icon-1024.png` |
| Item | `warm-shoes` | パッシブアイテムの小物感、ペア靴シルエット、枠なし確認 | Item / あったか靴 | 1024x1024 | `item-warm-shoes-icon-1024.png` |
| Item | `dawn-ticket` | レア/復帰アイテムの紙片表現と文字焼込みなし確認 | Item / 夜明けチケット | 1024x1024 | `item-dawn-ticket-icon-1024.png` |
| Cutin | `yui-normal-cutin-1440x360` | ユイ通常カットインの横長構図、透過、ランタン固定確認 | Cutin | 1440x360 | `cutin-yui-normal-1440x360.png` |
| Background | `stage1-forgotten-street-390x844` | Stage1戦闘背景としてHUD/敵/EXPが沈まないか確認 | Background | 390x844 | `background-stage1-forgotten-street-390x844.png` |

## Approved 基準

- PNGとして読み込める。
- 期待サイズに一致する。背景だけは候補原本が大きい場合、390x844にクロップ安全であることをメモする。
- Enemy は 8x6 / 180px、全48セル、edge touch = 0、意図しない empty cell = 0。
- Enemy は bbox center jitter が許容範囲で、64pxで同じ敵として読める。
- Weapon / Item は真の透過背景、中央配置、32pxでモチーフが読める。
- Cutin は 1440x360、横長演出、真の透過背景、ユイのランタンとカバンの固定ルールを崩さない。
- Background は 390x844の戦闘画面で、中央がうるさすぎず、UI/テキスト/キャラクターが焼き込まれていない。
- Manual Issues が0、または残っていても採用判断として明確な review notes がある。
- quality score は本採用なら4以上。score 3は仮素材、score 1-2はapprovedにしない。

## Rejected 基準

- サイズが違い、クロップ/再出力の方針も立たない。
- 白背景、チェッカーボード背景、白フリンジが目立つ。
- テキスト、ロゴ、透かし、UI、レアリティ枠が焼き込まれている。
- Enemy で3セル以上のedge touch、意図しないempty cell、激しいidentity driftがある。
- Weapon / Item が32pxで何か分からない、または世界観から外れる。
- Cutin が縦長ポスター構図、ユイに見えない、ランタンが消える。
- Background が戦闘要素を沈ませる、エンドレスランナー風、UIやキャラクター入り。

## Manual Issues で見る項目

| Type | 重点項目 |
|---|---|
| Enemy | `white-background`, `checkerboard-background`, `white-fringe`, `identity-drift`, `wrong-size`, `wrong-direction`, `baked-text` |
| Weapon | `white-background`, `checkerboard-background`, `white-fringe`, `rarity-frame-baked`, `baked-text`, `wrong-size` |
| Item | `white-background`, `checkerboard-background`, `white-fringe`, `rarity-frame-baked`, `baked-text`, `wrong-size` |
| Cutin | `white-background`, `checkerboard-background`, `white-fringe`, `poster-composition`, `lantern-missing`, `bag-position-wrong`, `baked-text`, `ui-baked-in`, `wrong-size` |
| Background | `too-noisy`, `baked-text`, `ui-baked-in`, `wrong-size` |

## Asset Factory チェック手順

1. `pnpm asset-factory:dev` を起動し、ブラウザで `http://localhost:5174` を開く。
2. 読込タブにPNGをドロップする。
3. Asset Type を対象に合わせて `enemy` / `weapon` / `item` / `cutin` / `background` にする。
4. Enemy は 8x6 / 180px を確認し、検査タブで edge touch / empty / jitter / too-small / too-large を確認する。
5. Weapon / Item / Cutin は checkerboard表示で真の透過を確認し、枠・文字・白フリンジを目視する。
6. Background は 390x844の戦闘画面として、上部HUD安全領域、中央戦闘領域、敵/EXP視認性を目視する。
7. マニフェストタブで対象Presetを適用する。Cutin/BackgroundはID、displayName、targetSize、notesを手入力する。
8. Manual Issues をチェックし、review status、quality score、review notes を設定する。
9. 問題ありなら `needs-regeneration` にし、検査結果タブの再生成プロンプトを作る。
10. 問題なしなら `candidate` または `approved` にしてライブラリ保存する。
11. Library タブで filter/sort、Approved Export、Unity Handoff JSON、Regeneration Queue JSON を確認する。

## 生成後の保存先候補

このテストでは候補を記録するだけで、runtimeへ勝手に移動しない。

| Type | 候補保存先 |
|---|---|
| Enemy | `public/assets/prototypes/sprite-sheets/enemies-original/` |
| Weapon | `public/assets/prototypes/sprite-sheets/weapon/` |
| Item | `public/assets/prototypes/sprite-sheets/passive/` または `public/assets/prototypes/sprite-sheets/rare/` |
| Cutin | `public/assets/prototypes/cutins/yui/` |
| Background | `public/assets/prototypes/backgrounds/stage-01/` |

採用時は、原本、縮小/スライス後、manifest、handoff JSONを分けて管理する。

## Unity / Web Handoff 注意

- Unity Handoff JSON は画像本体を含まない。`sourceFileName` とmanifestから実ファイルを別途対応させる。
- `approved` は「完全無欠」ではなく「採用判断済み」。Manual Issues が残る場合は Unity 側にも引き継ぐ。
- Enemy は pivot、scale hint、frame layout、Prefab hint を後工程で明記する。
- Weapon / Item は1024px masterから256/128/64/32pxを書き出す前提。UI枠は画像に焼き込まない。
- Background は390x844のWeb実表示とUnityカメラ表示で見え方が変わるため、中央戦闘領域と上部HUD領域を別途確認する。
- Cutin は透明PNGのままオーバーレイする。文字やUI演出は実装側で重ねる。

## 実画像候補

既存候補は検査対象として扱えるが、このテストでは移動・削除・runtime登録しない。

| Target | 候補 | 現状メモ |
|---|---|---|
| Enemy | `public/assets/prototypes/sprite-sheets/enemies-original/enemy-48-right-1440x1080-rgba.png` / `enemy-48-left-1440x1080-rgba.png` | 1440x1080 RGBA。特定ID別ではないため、`ombu-small`/`ombu-umbrella-shield`の採用候補ではなく検査候補。 |
| Weapon `night-pencil` | `public/assets/prototypes/sprite-sheets/weapon/night_pencil.png` | 180x180 RGBA。既存プロトタイプ候補。Asset Factoryの現行アイコン期待は1024x1024なので、本採用にはmaster再生成または手順の明確化が必要。 |
| Weapon `black-ink-bottle` | `public/assets/prototypes/sprite-sheets/weapon/black_ink_bottle.png` | 180x180 RGBA。現runtime参照中の既存プロトタイプ。今回のcandidate評価では差し替えない。 |
| Weapon `black-ink-bottle` | `public/assets/prototypes/sprite-sheets/weapon/asset-factory-test-pack/weapon-black-ink-bottle-icon-v1-clean-1024-rgba.png` | 1024x1024 RGBA。test-pack内の実画像candidate候補。64px/32px縮小とdisplay-reviewあり。approved後の別タスクまでruntime昇格しない。 |
| Item `dawn-ticket` | `public/assets/prototypes/sprite-sheets/passive/old_ticket.png` | 180x180 RGBA。夜明けチケットの近縁候補だが、ID/意味は未確定。 |
| Cutin | `public/assets/prototypes/cutins/yui/yui-cutin-ultimate-normal-1440x360-rgba.png` | 1440x360 RGBA。通常カットイン候補として投入検査できる。 |
| Cutin | `public/assets/prototypes/cutins/yui/yui-cutin-ultimate-black-v2-1440x360-rgba.png` | 1440x360 RGBA。黒曜カットイン候補として投入検査できる。 |
| Background | `public/assets/prototypes/backgrounds/stage-01/environment-master.png` | 941x1672 RGB。既存Stage1背景候補。390x844ではないため、Asset Factoryではwrong-size相当としてクロップ/書き出し候補扱い。 |

## Fixture 投入シミュレーション

実画像がない場合、以下を構造検証用に使う。fixture は商用品質の見た目判定には使わない。

| Simulation | Fixture | Asset Type | Preset / ID | 想定レビュー |
|---|---|---|---|---|
| Enemy sheet | `tools/asset-factory/fixtures/valid-enemy-sheet-1440x1080.png` | `enemy` | `ombu-small` | 自動検査が通る想定。review status `candidate`, score `3`, notes「構造検証用fixture。実画像ではないためapproved不可」。 |
| Enemy edge failure | `tools/asset-factory/fixtures/edge-touch-enemy-sheet-1440x1080.png` | `enemy` | `ombu-umbrella-shield` | edge touch警告を確認。status `needs-regeneration`, score `2`, manual issuesなし、自動警告から再生成プロンプト作成。 |
| Weapon icon | `tools/asset-factory/fixtures/weapon-icon-1024x1024.png` | `weapon` | `night-pencil` | 1024x1024読込確認。status `candidate`, score `3`, notes「構造検証用。夜鉛筆の見た目ではない」。 |
| Cutin | `tools/asset-factory/fixtures/cutin-1440x360.png` | `cutin` | `yui-normal-cutin-1440x360` | サイズ/透過確認。status `candidate`, score `3`, manual issue `identity-drift`相当をメモで扱う。 |
| Background | `tools/asset-factory/fixtures/background-390x844.png` | `background` | `stage1-forgotten-street-390x844` | 390x844読込確認。status `candidate`, score `3`, notes「構造検証用。Stage1アートではない」。 |

### review status / score / manual issues 設定手順

1. マニフェストタブの採用状態で `candidate` / `needs-regeneration` / `approved` / `rejected` を選ぶ。
2. fixture は構造確認用なので `approved` にしない。問題再現fixtureは `needs-regeneration` にする。
3. quality score は、構造が通るfixtureは `3`、edge touchやサイズ不一致は `2` 以下にする。
4. Manual Issues は自動検査で出ない目視問題だけに使う。fixtureでは「実画像ではない」ことを review notes に書く。
5. `needs-regeneration` にした素材は、Library の再生成待ちフィルタと Regeneration Queue JSON に含まれることを確認する。

## 作成プロンプト

固定プロンプトは `tools/asset-factory/real-asset-prompts/` に保存する。

- `enemy-ombu-small.md`
- `enemy-ombu-umbrella-shield.md`
- `weapon-night-pencil.md`
- `weapon-black-ink-bottle.md`
- `item-warm-shoes.md`
- `item-dawn-ticket.md`
- `cutin-yui-normal.md`
- `background-stage1-forgotten-street.md`
