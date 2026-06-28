# black_ink_bottle Prototype QA

`black_ink_bottle` はトモリの初期武器であり、`streetlamp_ring` と組み合わせる `dawn_ink_lamp_fusion` の素材武器。
この文書は、既存の実画像候補を Asset Factory candidate として評価し、390x844最終確認後に runtime参照中prototypeへ昇格した記録。

## Runtime確認

- Weapon: `src/game/data/weapons.ts` の `black_ink_bottle`
- Character: `src/game/data/characters.ts` の `tomori.initialWeaponId`
- Evolution: `src/game/data/evolutions.ts` の `dawn_ink_lamp_fusion`
- Fusion素材: `black_ink_bottle` + `streetlamp_ring`
- Fusion結果: `dawn_ink_lamp`

weapon/evolution/character の挙動は変更しない。

## Candidate候補

| 用途 | パス |
| --- | --- |
| 1024px master | `public/assets/prototypes/sprite-sheets/weapon/asset-factory-test-pack/weapon-black-ink-bottle-icon-v1-clean-1024-rgba.png` |
| 180px review | `public/assets/prototypes/sprite-sheets/weapon/asset-factory-test-pack/weapon-black-ink-bottle-icon-v1-clean-180.png` |
| 64px review | `public/assets/prototypes/sprite-sheets/weapon/asset-factory-test-pack/weapon-black-ink-bottle-icon-v1-clean-64.png` |
| 32px review | `public/assets/prototypes/sprite-sheets/weapon/asset-factory-test-pack/weapon-black-ink-bottle-icon-v1-clean-32.png` |
| baseline比較 | `public/assets/prototypes/sprite-sheets/weapon/asset-factory-test-pack/weapon-black-ink-bottle-icon-v1-clean-display-review.png` |
| runtime参照中prototype | `public/assets/prototypes/sprite-sheets/weapon/black_ink_bottle.png` |

`public/assets/prototypes/sprite-sheets/weapon/black_ink_bottle.png` はruntime側から参照されるprototype。
runtime用には1024px masterを直接使わず、既存運用に合わせた180px軽量PNGを使う。
`black_ink_bottle.png` は `weapon-black-ink-bottle-icon-v1-clean-180.png` と同一ハッシュ。

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
- Review Status: `approved`
- Quality Score: `4`
- Manual Issues: なし
- Review Notes:

```txt
black_ink_bottle prototype icon. 1024x1024 PNG RGBA master retained in test-pack. Runtime-referenced prototype uses the 180px lightweight derivative. Transparent background. No baked rarity frame, no text, no logo. Readable on Level Up Card and acceptable in HUD inventory. Promoted to current runtime-referenced prototype after 390x844 final wiring check.
```

## 採用境界

今回の昇格は `public/assets/prototypes/sprite-sheets/weapon/black_ink_bottle.png` の差し替え判断であり、正式な `public/assets` runtime asset 領域への移動ではない。
このrepoの現状では prototypes 配下の inventory original がruntime参照元なので、「runtime参照中prototypeをcandidate由来画像へ昇格」として扱う。

昇格後も注意すること:

- HUD 30px相当では下半分が暗めなので、将来HUD背景を暗くする場合は再確認する。
- 光沢と立体感はやや強い。Core5全体のアイコン方向をより紙/記憶/小さな灯りへ寄せる場合は、次世代版で再生成を検討する。
- 1024px masterは test-pack に残し、runtime参照中prototypeは180px運用を維持する。

## 390x844 UI Visibility QA

実施範囲:

- runtime参照中prototypeは `v1-clean-180` と同一状態で確認
- approved化は Asset Factory登録案の状態更新として扱う
- ゲームバランス/weapon/evolution挙動変更なし
- 1024px masterは test-pack に残す

確認方法:

- `pnpm dev --host 127.0.0.1` でVisual Galleryを390x844 viewport表示
- `?scene=visual-gallery` の拾得物/UI、通常武器、進化・合体・覚醒ページを確認
- `weapon-black-ink-bottle-icon-v1-clean-display-review.png` で current / candidate の 180px / 64px / 32px を比較
- runtime参照中prototypeとcandidate 180pxのhash一致を確認
- 一時QA previewとして、runtime参照中prototypeを390x844キャンバス上のカード/HUD相当サイズへ配置して確認

確認したUIサイズ:

| UI | 実装上の表示サイズ | 判定 |
| --- | --- | --- |
| Level Up Card 横カード | `storybookChoiceCard.ts` の `addHorizontalContent` で 74px | candidateは瓶・コルク・黒インク面が読める |
| Level Up Card 縦カード | `addVerticalContent` で最大60px | candidateは黒い小瓶として読める |
| HUD / inventory slot | `INVENTORY_ICON_SIZE = 34`、アイコン表示は約30px | candidateは小瓶外形が残る。黒い塊寄りになるが許容 |
| Replace / list icon | `LIST_ICON_SIZE = 46` | candidateは64px確認より少し小さいが、瓶モチーフは維持できる見込み |
| Fusion reward | reward iconは合体後の `dawn_ink_lamp` を表示 | 素材候補としての比較は docs/display-review で評価 |

### Level Up Card

判定: pass / approved-ready

- 64pxから74px相当では、瓶の輪郭、コルク、黒いインク面が明確。
- カード背景の淡い紙色には沈まない。
- UI枠、レアリティ枠、文字焼き込みがないため、カード側のカテゴリ/レア演出と混同しない。
- 現runtime参照中の180px prototypeより、候補の方が「黒インクの小瓶」として情報量が多い。

注意:

- 光沢がやや強く、紙/記憶/小さな灯り方向へさらに寄せる余地はある。
- ただしカード上ではこの光沢が瓶の外形認識を助けており、現時点で再生成必須ではない。

### HUD / Inventory Slot

判定: pass with caution / approved-ready

- 30px相当でも、小瓶の外形とコルクは残る。
- 黒いインク面は潰れやすいが、単なる黒丸や毒瓶には見えにくい。
- 暗いHUDスロット上では下半分がやや沈むため、runtime昇格前に実HUDへ一時接続して最終確認したい。
- 余白は十分で、端接触やslot枠との干渉はない。

Manual Issues案:

- 既存Manual Issuesに該当する必須問題はなし。
- 型追加は不要。気になる点は review notes に `slightly glossy; recheck final HUD contrast if HUD background changes` として残す。

### Fusion素材としての判定

判定: pass / approved-ready

- `black_ink_bottle`: 黒い瓶、コルク、インク面。
- `streetlamp_ring`: 暖色ランプと足元の輪。
- `dawn_ink_lamp`: 菱形の朝灯り/灯紋。

3つの役割は分かれている。
`streetlamp_ring` と並べた時に「インク」と「灯り」は混ざらず、`dawn_ink_lamp` ともシルエットが似すぎない。
合体素材としては、candidateの黒い瓶が十分に素材側の記号を持っている。

### 暫定判断

判定: approved / score 4

runtime昇格判断: runtime参照中prototypeをcandidate由来画像へ昇格済み。

理由:

- Level Up Cardでは十分に読みやすい。
- HUD 30px相当でも許容範囲。暗いslot上で下半分は沈むが、瓶の輪郭とコルクが残る。
- `streetlamp_ring` / `dawn_ink_lamp` との役割差は明確。
- 1024px masterをruntimeへ直接使わず、既存の180px inventory original運用に合わせたため、描画負荷・容量面でも安全。

Asset Factory登録案の最終状態:

- Review Status: `approved`
- Quality Score: `4`
- Manual Issues: なし
- Review Notes追記:

```txt
390x844 final wiring QA: readable on Level Up Card at 60-74px. HUD/inventory 30px is acceptable, with lower ink area slightly dark but still recognizable. Distinct from streetlamp_ring and dawn_ink_lamp. Promoted to current runtime-referenced prototype as 180px lightweight PNG; 1024px master remains in test-pack.
```

## Runtime Promotion Final Check

実施結果:

- `public/assets/prototypes/sprite-sheets/weapon/black_ink_bottle.png` は `weapon-black-ink-bottle-icon-v1-clean-180.png` と同一ハッシュ。
- 使用サイズは180x180 PNG RGBA。
- 1024x1024 masterはruntime参照へ直接使わず、test-packに保持。
- `INVENTORY_ORIGINAL_SOURCE_SIZE = 180` の既存運用に一致。
- `inventory-original-icons:check` で total=28 / ok。

390x844確認:

- Visual Galleryの通常武器ページ: console errorなし。黒インク武器は暗背景上では控えめだが、これは武器効果サンプル表示でありinventory iconの問題ではない。
- 進化・合体・覚醒ページ: `black_ink_bottle` + `streetlamp_ring` -> `dawn_ink_lamp` の役割表示に破綻なし。
- Level Up Card相当: 60px/74pxで瓶、コルク、黒インク面が読める。
- HUD / inventory slot相当: 約30pxで小瓶外形とコルクが残る。下半分は暗いが許容。
- Replace/list icon相当: 46pxでは瓶モチーフが維持される見込み。

最終判断:

- Runtime promotion: done
- Scope: runtime参照中prototypeの昇格。正式runtime asset領域への移動ではない。
- Review Status: approved
- Quality Score: 4
- Manual Issues: なし
