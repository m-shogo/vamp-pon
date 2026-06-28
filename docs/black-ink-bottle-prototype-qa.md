# black_ink_bottle Prototype QA

`black_ink_bottle` はトモリの初期武器であり、`streetlamp_ring` と組み合わせる `dawn_ink_lamp_fusion` の素材武器。
この文書は、既存の実画像候補をruntimeへ昇格せず、Asset Factory の candidate 登録準備として評価した記録。

## Runtime確認

- Weapon: `src/game/data/weapons.ts` の `black_ink_bottle`
- Character: `src/game/data/characters.ts` の `tomori.initialWeaponId`
- Evolution: `src/game/data/evolutions.ts` の `dawn_ink_lamp_fusion`
- Fusion素材: `black_ink_bottle` + `streetlamp_ring`
- Fusion結果: `dawn_ink_lamp`

今回、weapon/evolution/character の挙動は変更しない。

## Candidate候補

| 用途 | パス |
| --- | --- |
| 1024px master | `public/assets/prototypes/sprite-sheets/weapon/asset-factory-test-pack/weapon-black-ink-bottle-icon-v1-clean-1024-rgba.png` |
| 180px review | `public/assets/prototypes/sprite-sheets/weapon/asset-factory-test-pack/weapon-black-ink-bottle-icon-v1-clean-180.png` |
| 64px review | `public/assets/prototypes/sprite-sheets/weapon/asset-factory-test-pack/weapon-black-ink-bottle-icon-v1-clean-64.png` |
| 32px review | `public/assets/prototypes/sprite-sheets/weapon/asset-factory-test-pack/weapon-black-ink-bottle-icon-v1-clean-32.png` |
| baseline比較 | `public/assets/prototypes/sprite-sheets/weapon/asset-factory-test-pack/weapon-black-ink-bottle-icon-v1-clean-display-review.png` |
| 現runtime参照中prototype | `public/assets/prototypes/sprite-sheets/weapon/black_ink_bottle.png` |

`public/assets/prototypes/sprite-sheets/weapon/black_ink_bottle.png` は既にruntime側から参照されるprototypeであり、今回は差し替えない。
候補評価は test-pack の `v1-clean` 一式に限定する。

## 検査結果

`v1-clean-1024-rgba`:

- 1024x1024 PNG RGBA
- true alpha transparency
- transparent corners
- edge touchなし
- bbox: `(267, 159, 749, 834)`
- UI枠、レア枠、文字、ロゴなし
- 白背景、checkerboard焼き込みなし
- 緑フリンジなし

縮小確認:

- 64px: 黒インクの小瓶として読める。コルク、瓶、黒いインク面が識別できる。
- 32px: 小瓶シルエットとして許容。インク溜まりは潰れるが、毒瓶・薬瓶よりも黒インク瓶として読める。

目視上の注意:

- 光沢と立体感がやや強く、Vamp Pon の紙/記憶/小さな灯り方向へさらに寄せる余地がある。
- ただし、現行180px baselineより64px/32pxの「黒い小瓶」認識は改善している。

## Asset Factory登録案

- Asset Type: `weapon`
- Preset: `black-ink-bottle`
- Review Status: `candidate`
- Quality Score: `4`
- Manual Issues: なし
- Review Notes:

```txt
black_ink_bottle prototype icon. 1024x1024 PNG RGBA. Transparent background. No baked rarity frame, no text, no logo. Readable at 64px and acceptable at 32px. Candidate only; do not move to runtime assets until approved.
```

## 採用境界

今回の `candidate` は「runtime昇格候補」であり、`approved` ではない。
approved後の別タスクでのみ、runtime参照中の `public/assets/prototypes/sprite-sheets/weapon/black_ink_bottle.png` 差し替えを検討する。

approved前に確認すること:

- レベルアップカード/HUDで390x844確認
- `streetlamp_ring` と並んだ時に fusion素材として役割が混ざらない
- `dawn_ink_lamp` と似すぎない
- 32pxで黒い塊に見えすぎない
- 光沢が強すぎる場合は、紙/インク/小さな灯りへ寄せる再生成を検討する

## 390x844 UI Visibility QA

実施範囲:

- runtime asset差し替えなし
- approved化なし
- ゲームバランス/weapon/evolution挙動変更なし
- `public/assets/prototypes/sprite-sheets/weapon/black_ink_bottle.png` 未変更

確認方法:

- `pnpm dev --host 127.0.0.1` でVisual Galleryを390x844 viewport表示
- `?scene=visual-gallery` の拾得物/UI、通常武器、進化・合体・覚醒ページを確認
- `weapon-black-ink-bottle-icon-v1-clean-display-review.png` で current / candidate の 180px / 64px / 32px を比較
- runtime差し替えなしの一時QA previewとして、candidateを390x844キャンバス上のカード/HUD相当サイズへ配置して確認

確認したUIサイズ:

| UI | 実装上の表示サイズ | 判定 |
| --- | --- | --- |
| Level Up Card 横カード | `storybookChoiceCard.ts` の `addHorizontalContent` で 74px | candidateは瓶・コルク・黒インク面が読める |
| Level Up Card 縦カード | `addVerticalContent` で最大60px | candidateは黒い小瓶として読める |
| HUD / inventory slot | `INVENTORY_ICON_SIZE = 34`、アイコン表示は約30px | candidateは小瓶外形が残る。黒い塊寄りになるが許容 |
| Replace / list icon | `LIST_ICON_SIZE = 46` | candidateは64px確認より少し小さいが、瓶モチーフは維持できる見込み |
| Fusion reward | reward iconは合体後の `dawn_ink_lamp` を表示 | 素材候補としての比較は docs/display-review で評価 |

### Level Up Card

判定: pass / candidate keep

- 64pxから74px相当では、瓶の輪郭、コルク、黒いインク面が明確。
- カード背景の淡い紙色には沈まない。
- UI枠、レアリティ枠、文字焼き込みがないため、カード側のカテゴリ/レア演出と混同しない。
- 現runtime参照中の180px prototypeより、候補の方が「黒インクの小瓶」として情報量が多い。

注意:

- 光沢がやや強く、紙/記憶/小さな灯り方向へさらに寄せる余地はある。
- ただしカード上ではこの光沢が瓶の外形認識を助けており、現時点で再生成必須ではない。

### HUD / Inventory Slot

判定: pass with caution / candidate keep

- 30px相当でも、小瓶の外形とコルクは残る。
- 黒いインク面は潰れやすいが、単なる黒丸や毒瓶には見えにくい。
- 暗いHUDスロット上では下半分がやや沈むため、runtime昇格前に実HUDへ一時接続して最終確認したい。
- 余白は十分で、端接触やslot枠との干渉はない。

Manual Issues案:

- 既存Manual Issuesに該当する必須問題はなし。
- 型追加は不要。気になる点は review notes に `slightly glossy; check final HUD contrast before runtime promotion` として残す。

### Fusion素材としての判定

判定: pass / candidate keep

- `black_ink_bottle`: 黒い瓶、コルク、インク面。
- `streetlamp_ring`: 暖色ランプと足元の輪。
- `dawn_ink_lamp`: 菱形の朝灯り/灯紋。

3つの役割は分かれている。
`streetlamp_ring` と並べた時に「インク」と「灯り」は混ざらず、`dawn_ink_lamp` ともシルエットが似すぎない。
合体素材としては、candidateの黒い瓶が十分に素材側の記号を持っている。

### 暫定判断

判定: candidate keep / score 4

runtime昇格判断: B. approved-ready寄りだが、別タスクで昇格する。

理由:

- Level Up Cardでは十分に読みやすい。
- HUD 30px相当でも許容範囲だが、暗いslot上で下半分が沈むため、昇格前にruntimeへ一時接続した390x844確認を別タスクで行うのが安全。
- `streetlamp_ring` / `dawn_ink_lamp` との役割差は明確。
- runtime参照中prototypeを今回差し替える理由はまだない。

Asset Factory登録案の更新:

- Review Status: `candidate`
- Quality Score: `4`
- Manual Issues: なし
- Review Notes追記:

```txt
390x844 UI visibility QA: readable on Level Up Card at 60-74px. HUD/inventory 30px is acceptable but slightly dark in the lower ink area. Distinct from streetlamp_ring and dawn_ink_lamp. Candidate keep; do not promote to runtime until a separate runtime wiring check.
```
