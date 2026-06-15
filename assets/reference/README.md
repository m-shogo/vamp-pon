# Reference Assets

このディレクトリは、Vamp Pon のアート reference を保存する場所。

重要:

- reference は完成素材ではない。
- reference は画風・密度・色・シルエットの方向性。
- 実素材は Aseprite source から export する。
- AI生成画像をそのまま縮小して完成素材にしない。

---

## Planned files

```txt
assets/reference/
  player/
    yui_turnaround_soft_pixel_reference.png
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
