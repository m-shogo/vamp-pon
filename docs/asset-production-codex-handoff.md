# Codex Asset Production Handoff

次チャットで、Codex が画像生成から配置まで担当する前提の引き継ぎメモ。

## 前提

- 対象repo: `/Users/m-shogo/Developer/personal/vamp-pon`
- GitHub repo: `https://github.com/m-shogo/vamp-pon.git`
- このrepo以外は触らない。
- ゲーム本体の挙動は、素材制作タスクでは変更しない。
- 生成素材はまず `public/assets/prototypes/` 配下に置く。
- runtime昇格や既存差し替えは、別途明示されるまで行わない。

## 画像生成フロー

1. Codex の組み込み `image_gen` で生成する。
2. 透明PNGが必要な素材は、まず単色クロマキー背景で生成する。
3. 生成画像をrepo内にコピーする。
4. 必要なら 1440x1080 / 1024x1024 / 1440x360 / 390x844 などに整える。
5. クロマキー除去でRGBA化する。
6. Python/Pillowでセル単位の後処理をする。
7. 検査する。
8. baseline画像と比較する。
9. prototype候補として保存する。
10. build/test後にcommit/pushする。

## 検査基準

Enemy spritesheet:

- 1440x1080
- 8 columns x 6 rows
- 180x180 cell
- 48 filled cells
- empty cells = 0
- edge touch = 0
- bbox center jitter は原則0、または意図的な小モーション範囲
- 64pxで読める
- true alpha transparency
- 行ごとのアニメーション目的が読める

Weapon / Item icon:

- 1024x1024 master
- true alpha transparency
- 32px / 64pxで読める
- UI枠・レア枠・文字を焼き込まない

Cutin:

- 1440x360
- true alpha transparency
- 横長構図
- UI・文字を焼き込まない
- ユイの場合、ランタン右手、バッグ左腰を守る

Background:

- 390x844 または既存背景運用に沿う大きめmaster
- UI・文字・キャラを焼き込まない
- 390x844の戦闘視認性を優先する

## 現在できている実画像候補

Enemy:

- `public/assets/prototypes/sprite-sheets/enemies-original/enemy-ombu-small-sheet-v2-1440x1080.png`
- 同じ画像のテストパック保存:
  `public/assets/prototypes/sprite-sheets/enemies-original/asset-factory-test-pack/enemy-ombu-small-sheet-v2-1440x1080.png`

`ombu-small` v2 の検査結果:

- 1440x1080 PNG RGBA
- 48 filled cells
- empty cells: 0
- edge touch: 0
- bbox center jitter: 0
- Row 6 終盤3セルは dissolve 演出のため `too-small` 相当の警告候補あり
- v1より行ごとの用途差が明確

## Asset Factory の位置づけ

Asset Factory は「画像を作るツール」ではなく、AI生成素材の検査・レビュー・採用管理台帳として使う。

- candidate / approved / rejected
- quality score
- review notes
- manual issues
- regeneration queue
- Unity/Web handoff

少数素材はCodexだけでも作れるが、量産・採用判断・handoffにはAsset Factoryが必要。

## 今後の作り方

Stage1実画像テストパックの残りを優先する。

Enemy:

- `ombu-umbrella-shield`

Weapon:

- `night-pencil`
- `black-ink-bottle`

Item:

- `warm-shoes`
- `dawn-ticket`

Cutin:

- `yui-normal-cutin-1440x360`

Background:

- `stage1-forgotten-street-390x844`

## Battle の状態

`pnpm build` と `pnpm test` は直近の素材追加後に通っている。
Battle は素材を当て込んで検証していける段階にあるが、最終品質は素材投入後の実機/ブラウザ確認で判断する。

