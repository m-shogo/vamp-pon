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
