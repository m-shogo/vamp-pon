# streetlamp_ring Prototype QA

`streetlamp_ring` はミチルの初期武器であり、`black_ink_bottle` と組み合わせる `dawn_ink_lamp_fusion` の素材武器。
この文書は、現runtime参照中prototypeの実素材・UI視認性・runtime昇格可否を確認した記録。

## Runtime確認

- Weapon: `src/game/data/weapons.ts` の `streetlamp_ring`
- Character: `src/game/data/characters.ts` の `michiru.initialWeaponId`
- Evolution: `src/game/data/evolutions.ts` の `dawn_ink_lamp_fusion`
- Fusion素材: `black_ink_bottle` + `streetlamp_ring`
- Fusion結果: `dawn_ink_lamp`
- inventory original: `src/game/assets/inventoryOriginalIcons.ts` が `weapons` から `public/assets/prototypes/sprite-sheets/weapon/streetlamp_ring.png` を生成参照する

weapon/evolution/character の効果・数値・ゲームバランスは変更しない。

## 候補画像一覧

| 用途 | パス | 状態 |
| --- | --- | --- |
| runtime参照中prototype | `public/assets/prototypes/sprite-sheets/weapon/streetlamp_ring.png` | 180x180 PNG RGBA |
| 1024px master | なし | 作成・保存が必要 |
| 180px review derivative | なし | 現runtime prototypeのみ |
| 64px review | なし | 作成が必要 |
| 32px review | なし | 作成が必要 |
| display-review | なし | 作成が必要 |

test-pack内に `streetlamp_ring` 専用candidateは見つからない。
今回は画像生成せず、現runtime参照中prototypeを候補としてQAした。

## 画像検査

`public/assets/prototypes/sprite-sheets/weapon/streetlamp_ring.png`:

- 180x180 PNG RGBA
- true alpha transparency
- transparent corners
- edge alpha pixels: 0
- bbox: `(20, 40, 159, 152)`
- alpha pixels: 7760
- semi-alpha pixels: 4183
- UI枠、レアリティ枠、文字、ロゴなし
- 白背景、checkerboard焼き込みなし
- 目視で白/緑フリンジなし

目視:

- 灯部、ポール、足元リング、周囲の小さな光が読める。
- `black_ink_bottle` の黒瓶とは色・シルエットが明確に違う。
- `dawn_ink_lamp` の菱形/朝灯りシルエットとも違う。
- ただし小サイズではポールと灯部が弱くなり、リングだけが先に残る。

## 390x844 UI Visibility QA

確認方法:

- `pnpm dev --host 127.0.0.1`
- in-app browser viewport: 390x844
- `?scene=visual-gallery` で以下を撮影
  - `docs/asset-qa-screenshots/streetlamp-ring-2026-06-29/visual-gallery-pickups-hud-390x844.png`
  - `docs/asset-qa-screenshots/streetlamp-ring-2026-06-29/visual-gallery-weapons-390x844.png`
  - `docs/asset-qa-screenshots/streetlamp-ring-2026-06-29/visual-gallery-evolution-390x844.png`
- console error/warn: なし

### Level Up Card

判定: candidate keep / unverified final card

- `storybookChoiceCard.ts` の横カードでは 74px、縦カードでは最大60px相当で表示される。
- 現物の180pxでは灯部とリングが読めるため、カードサイズでは成立する見込み。
- ただし今回のブラウザQAではLevel Up Card上の直接撮影ができなかったため、approved判定にはしない。

### HUD / Inventory

判定: pass with caution

- Visual GalleryのHUD showcaseで下部inventory slotに表示される。
- 約30px相当では暖色のリングが残る。
- 小さくなると街灯本体より輪が強く見えるため、「灯りの輪」としては読めるが「街灯」要素は弱い。
- 黒系背景には沈まない。

### 通常武器ページ

判定: pass with caution

- 390x844通常武器ページでは、`streetlamp_ring` は明るい輪として見える。
- `black_ink_bottle` の黒瓶とは明確に違う。
- 小サイズでは黄色い丸/輪へ寄るため、1024 masterを作るなら灯部とポールをもう少し太くしたい。

### Fusion素材

判定: pass / candidate keep

- `black_ink_bottle`: 黒い瓶、コルク、インク面。
- `streetlamp_ring`: 暖色の街灯＋足元リング。
- `dawn_ink_lamp`: 菱形の朝灯り/灯紋。

3つの役割は分かれている。
素材側の `streetlamp_ring` は「灯りの輪」、完成形の `dawn_ink_lamp` は「朝色の灯紋」として見分けられる。

## Manual Issues案

必須Manual Issuesはなし。
review notesに残す注意:

```txt
Current runtime prototype is readable as a warm lamp ring, but no 1024px master, 64px/32px review derivatives, or display-review image exist. At HUD size the ring remains readable, while the lamp body becomes secondary. Keep as candidate; create a proper master before approved/runtime promotion.
```

## Review Status案

- Review Status: `candidate`
- Quality Score: `3`
- Manual Issues: なし
- Notes: 現runtime prototypeは使用継続可能。ただしblack_ink_bottleと同格のapprovedには、1024px master、64px/32px review、display-review、Level Up Card直接確認が不足している。

## Runtime昇格判断

判断: **B. candidate keep / score 3**

runtime参照画像の差し替え: なし。
approved化: なし。

理由:

- 現runtime prototypeは180x180 RGBAで、透明・edge touchなし・UI枠焼き込みなし。
- HUD / Inventory / Visual Galleryでは破綻しない。
- `black_ink_bottle` / `dawn_ink_lamp` と混同しない。
- ただしtest-pack masterと32/64/display-reviewが存在せず、Level Up Card直接撮影も未完了。
- black_ink_bottle と同じ安全基準でapprovedにするには、素材候補一式が不足している。

## 次に必要な作業

1. `streetlamp_ring` の1024x1024 masterを生成または制作する。
2. `public/assets/prototypes/sprite-sheets/weapon/asset-factory-test-pack/` にmaster、180px、64px、32px、display-reviewを保存する。
3. 64px/32pxで灯部・ポール・足元リングが読めるか確認する。
4. Level Up Card、HUD / Inventory、Evolution/Fusion表示で390x844再確認する。
5. 問題なければ `approved` / score 4 として、runtime参照中prototypeへの昇格を別タスクで判断する。
