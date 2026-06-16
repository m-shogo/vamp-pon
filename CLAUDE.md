# CLAUDE.md

このファイルは`vamp-pon`におけるClaude Code / Fable / AIエージェント向け恒久指示。

対象repo:

- `/Users/m-shogo/Developer/personal/vamp-pon`
- `https://github.com/m-shogo/vamp-pon.git`

このrepo以外を変更しない。

## 1. Core rules

- 1x実寸の可読性を最優先する。
- player / enemy / pickup / UI / backgroundをsoft painterly pixel artで統一する。
- AI生成画像はreferenceのみ。直接productionにしない。
- Aseprite sourceを正本とし、public PNGを直接編集しない。
- script / Luaはcanvas、palette、layer、bootstrap、export補助まで。
- Asepriteの1px手仕上げ、1x / 4x / dark background / combat mock確認なしにhand-final-candidateと呼ばない。
- 品質評価が1項目でも3以下ならfinal-candidateにしない。
- 見た目作業でgameplay定数を巻き込まない。

必ず読む:

- `AGENTS.md`
- `docs/pixel-art/README.md`
- `docs/pixel-art/human-character-craft-guide.md`
- `docs/pixel-art/ng-patterns.md`
- `docs/pixel-art/agent-quality-brief.md`
- `docs/art-direction.md`
- `docs/reference-art-map.md`
- `docs/pixel-art-quality-gate.md`
- `docs/pixel-art-production-workflow.md`
- `docs/aseprite-hand-finish-workflow.md`

## 2. Art target

目標:

- soft painterly pixel art
- high-density but not muddy
- cute but gameplay-readable
- silhouetteで役割が読める
- soft shading
- selective outline
- dark backgroundでも埋もれない

禁止:

- 記号的な黒ベタ素材
- 1px noiseの乱用
- AI画像の直接縮小
- script図形だけの完成扱い
- 4xでは良いが1xで読めない素材
- before/afterが弱いのに完了扱いすること

## 3. Yui

固定identity:

- 丸く大きい青フード
- 茶赤の前髪
- 大きめで可愛い顔
- 生成り〜古紙色の厚みある服
- 右手側ランタン
- lanternと`hitCore`を分離
- front / side / back / posesで同一人物

順番:

1. `yui_idle_42`または明示された`yui_master_52`
2. `yui_move_42`
3. `yui_hurt_42`
4. `yui_ultimate_42`

idle/masterが弱いまま展開しない。

## 4. Enemy canonical rules

敵作業前に読む:

- `docs/enemies/enemy-48-sprite-sheet-plan.md`
- `docs/enemies/omb-ombro-selected-direction.md`
- `docs/enemies/enemy-48-production-readiness.md`
- `data/enemy-assets/enemy-48-sprite-sheet-cells.json`
- `data/enemy-assets/enemy-design-catalog.json`
- catalogの`designFiles`に列挙された全JSON

構成:

```txt
48 total
25 grunts = Omb 5 + Ombro 5 + Stage-unique 15
10 midbosses
3 boss base forms
10 boss alternate forms
```

各Stage:

```txt
Omb 1
Ombro 1
Stage-unique grunt 3
midboss 2
```

共通family:

- `omb`: 柔らかい小型影。頭のインク芽、古紙色の四角目、全身の発光しない影炎。
- `ombro`: オンブより低く横長。全身の影炎から地面へ垂れる擬手が伸びる。

オンブロ擬手:

- 本体と同じ影炎から形成
- idleでは地面へ垂れる
- attack時だけ先端が最大3つの鈍い房へ分かれる
- shoulder、elbow、palm、人間の指、爪、骨、筋肉なし

敵共通:

- black / dark navy / violet-black / blue-grayの段階陰影
- warm accentはplayer lantern、pickup、hit coreより小さく弱い
- silhouette、body ratio、eyes/light、signature parts、postureを差別化
- damaging actionにはtelegraphを持たせる
- catalogのattack / telegraph / counter / animation / nativePxに従う
- boss formは同一個体性を維持し、palette-only swapにしない

禁止:

- `pon_shadow`
- `grown_pon_shadow`
- ポン影
- ふくらみポン影
- hard black circle + eyesだけ
- Omb/Ombroの明るい通常炎
- player風の服・髪・フード
- 人間の手に見える擬手
- generated 180px referenceの直接production利用

敵検査:

```sh
pnpm enemy48:design:check
pnpm enemy48:manifest:check
pnpm enemy48:sprites:verify  # complete sheetが存在する場合
```

## 5. Background

- gameplay tileとして作る
- low contrast
- subtle decoration
- player / enemy / projectile / pickupを邪魔しない
- night / paper / map / forgotten-object motif
- 32x32または64x64 tile
- repeating seamや強い明部を避ける

## 6. Protected gameplay values

visual taskでは原則変更しない:

- `PLAYER_DEFAULTS.radius`
- hp / moveSpeed / invulnSec
- pickup collectRadius / magnetRange / magnetSpeed
- `hitCore`
- `debugHitCircle`

`visualSize`は明示タスク時のみ変更する。

## 7. Standard workflow

1. current filesとreferenceを確認
2. problemとNGを具体化
3. referenceとの差分を記述
4. short directionを決める
5. draft / prototype
6. Aseprite sourceを修正
7. sourceからexport
8. 1x / 4x / dark / combat mock確認
9. quality gate
10. docs / status更新
11. tests
12. unresolvedを明記
13. commit / push

迷った場合は、1x可読性、role clarity、silhouette、reference consistency、gameplay visibilityの順で優先する。
