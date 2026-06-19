# Reference Assets

このディレクトリは、Vamp Pon のアート reference を保存する場所。

重要:

- reference は完成素材ではない。
- reference は画風・密度・色・シルエットの方向性。
- 実素材は Aseprite source から export する。
- AI生成画像をそのまま縮小して完成素材にしない。

---

## フォルダ構成

```txt
assets/reference/
  player/yui/
    yui-turnaround-softpixel-v1.png
    yui-turnaround-4dir-reference-v1.jpeg
    yui-fullbody-standing-reference-v1.png
    yui-sprite-sheet-48poses-reference-v1.jpeg
    yui-rage-overdrive-48cells-reference-v1.png
  character-master/core5/
    yui-character-master-v1.png
    asa-character-master-v1.png
    nagi-character-master-v1.png
    michiru-character-master-v1.png
    tomori-character-master-v1.png
  enemies/
    ink_enemy_family_reference.png
  backgrounds/
    stage1_night_tile_reference.png
```

---

## How to use

1. referenceを見る
2. 現状素材との差分を書く
3. Asepriteでゲーム用サイズに落とす
4. `docs/pixel-art-quality-gate.md` を通す
5. 通ったものだけ `final-candidate` にする
