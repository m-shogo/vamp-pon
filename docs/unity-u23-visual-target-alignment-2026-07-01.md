# Unity U23 Visual Target Alignment

## 比較対象

- `docs/design-targets/generated/top-final.png`
- `docs/design-targets/generated/`
- `docs/design-targets/generated/unity-u22/screenshots/`
- `docs/design-targets/generated/unity-u21-1/screenshots/`

## generated visual target側の良い点

- 紙の厚みと破れた輪郭があり、UIが物として見える。
- 黒インクのにじみ、汚れ、乾いた影が画面の外周と要所にある。
- ランタン光が主導線になり、暗い画面でも希望の焦点がある。
- 余白が暗いだけでなく、地図線、紙片、街灯で密度を持つ。
- 世界観が夜、記憶、忘れ物、紙の台帳にまとまっている。
- CTAや報酬に紙片 / stamp / sealの手触りがある。

## Unity proof screenshot側の弱い点

- U21.1のLevelUp / Result / StageSelectは無地panelと説明文字に寄っている。
- U22はBattle field化したが、UIはまだ矩形と単色barが多い。
- 紙の厚み、黒インク縁、封蝋、記録帳感、旅支度感が薄い。
- Resultの報酬が手帳に貼られる感じになっていない。
- StageSelectが地図よりnode説明に見える。

## そのまま使わない理由

visual targetは方向性確認の画像であり、runtime素材ではない。画像内の文字や完成画面をそのまま貼るとtext-baked runtime imageになり、レスポンシブUI、TMP、Prefab化、production approvalの流れを壊す。

## Unity側へ分解して取り込む要素

- 紙の厚み: nestedではない薄いpaper panel、edge strip、shadow band。
- 黒インクのにじみ: border blot、route line、rank seal shadow。
- ランタン光: active node、selected card、reward card、CTAの小さいglow。
- 余白: 暗いだけでなく地図線、紙片、stampを配置。
- 文字量: title / short effect / levelへ階層化し、説明文を減らす。
- 報酬感: Rank seal、reward cards、ledgerへ貼る構図。
- StageSelectの地図感: route line、active / locked node、出発印CTA。

## U23で取り込む要素

LevelUp card、Result ledger / reward cards、StageSelect map / route / previous result stampをproof化する。final画像は貼らず、色、余白、紙UI、黒インク、ランタン光をUI primitiveへ分解する。

## U24へ送る要素

黒耀化の赤黒/紫黒レイヤー、cut-in band、強い斜め光、黒インク粒、Rare seal pulse、Evolution convergenceはU24へ送る。

## U25以降へ送る要素

Sprite Atlas、9-slice production prefab、実機輝度、real device touch、motion timing、SE / haptic実装、production approvalはU25以降またはU20.1へ送る。
