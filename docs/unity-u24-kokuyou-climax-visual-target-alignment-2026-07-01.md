# Unity U24 Kokuyou Climax Visual Target Alignment

## 比較対象

- `docs/design-targets/generated/kokuyou-cutin-final.png`
- `docs/design-targets/generated/`
- `docs/design-targets/generated/unity-u22/screenshots/`
- `docs/design-targets/generated/unity-u23/screenshots/`

## kokuyou-cutin-final.pngの良い点

- 黒インクのにじみが画面を斜めに切り、不穏さと勢いを作っている。
- 赤黒 / 紫黒の層が通常画面との差を明確にしている。
- ランタン光が強い対比になり、怖すぎず美しさがある。
- cut-in bandと短い言葉で、説明ではなく見せ場として成立している。
- 余韻のための暗い余白と細い線がある。

## Unity proof黒耀化の弱い点

U22の黒耀化はgaugeと色変化が見えるが、まだUI proof寄りで、cut-in感、黒インク粒、赤黒の層、余韻、camera impulseの設計が弱い。文字に頼る割合も残っている。

## そのまま使わない理由

`kokuyou-cutin-final.png` はvisual target referenceであり、runtimeへ貼る素材ではない。画像内の文字や完成構図を貼るとtext-baked runtime imageになり、responsive UI、TMP、演出分解、candidate管理を壊す。

## Unity側へ分解して取り込む要素

- 黒インクのにじみ: layer strip、particle dots、screen edge smear。
- 赤黒の層: low alpha full-screen wash、diagonal band。
- cut-in感: short band、lantern icon slot、TMP title。
- 余韻: Ending release band、particles fading outward。
- 通常画面との差: Active overlay、hit feedback strength、lantern distortion。
- ランタン光との対比: amber streak、warm flare。

## U24で取り込む要素

Ready pulse、Activation cut-in、Active layer、Ending release、Rare seal pulse、Evolution convergence、camera / SE / haptic hook event名。

## U25以降へ送る要素

full-screen illustration production candidate、real motion timeline、SE file implementation、haptic実機確認、Cinemachine再評価、Sprite Atlas、performance profiling。

## 黒耀化Bの緑/黄色粒の人間レビュー結果

U24時点では人間レビュー継続。緑/黄色粒は最終採用前の確認対象であり、U24では赤黒 / 紫黒 / amber lanternを主軸にしたproofへ寄せる。
