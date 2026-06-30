# Unity Responsive Screen Policy

目的: Unity版で 390x844 に固定表示する誤解を防ぎ、各スマホ画面に合わせた表示方針を固定する。

---

## 結論

Unity版は 390x844 固定ではない。

```txt
390x844 = design reference / minimum QA baseline
actual devices = each smartphone screen size, aspect ratio, resolution, and Safe Areaに合わせて可変
```

実機では、iPhone / Android / notch / dynamic island / navigation bar / rounded corner を考慮して、画面いっぱいに表示する。

---

## Why 390x844 still exists

390x844は、以下のための基準値。

- UI設計の共通ものさし
- 縦スマホで最低限読めるかのQA baseline
- Canvas ScalerのReference Resolution
- screenshot comparison / design review の基準
- 小さいスマホ寄りでも破綻しないかの確認

つまり、390x844は「固定サイズ」ではなく「設計基準」。

---

## Runtime rule

Unity実行時は、各端末の画面に合わせる。

- gameplay backgroundは画面全体を覆う
- world cameraは縦画面のaspect差に応じて表示範囲を調整する
- HUD / buttons / LevelUp / Result / dialogs are placed inside Safe Area
- decorative background can extend outside Safe Area
- gameplay objects may use full screen, but important readable UI must stay inside Safe Area

---

## UI policy

Canvas:

```txt
Canvas Scaler: Scale With Screen Size
Reference Resolution: 390 x 844
Screen Match Mode: Match Width Or Height
Match: initial 0.5, tune after device checks
```

This does not mean the app renders only 390x844.
It means UI positions and sizes are designed against a reference and scaled to the actual device.

---

## Camera policy

MainCamera:

```txt
Projection: Orthographic
Orientation: Portrait
World view: aspect-aware
```

U1はカメラの完成設計ではない。
ただし、次を避ける。

- 390x844以外でUIが欠ける
- wide/tall devicesでplayerが見切れる
- notch / home indicatorにbuttonが被る
- backgroundが黒帯になる
- LevelUp cardがSafe Area外にはみ出る

---

## QA device profiles

U1/U2で最低限見る画面プロファイル:

```txt
390x844 reference
375x812 iPhone small notch-like
393x852 Android common portrait
430x932 iPhone large portrait
360x800 Android narrow portrait
412x915 Android tall portrait
```

Editor Game Viewでは、Free Aspectだけで判断しない。
複数の固定解像度を作って確認する。

---

## Wording rule

今後のdocsでは次の表現を使う。

OK:

```txt
390x844 reference
390x844 baseline
390x844基準
各スマホ画面にresponsive対応
Safe Area内に重要UIを配置
```

Avoid:

```txt
390x844固定
390x844だけで確認
390x844で表示する
```

---

## U1 acceptance wording

U1の合格条件は以下。

```txt
- 390x844 referenceで破綻しない
- 複数スマホ縦解像度で重要UIがSafe Area内に収まる
- gameplay backgroundが各端末画面を自然に覆う
- Boot -> Stage1が実機サイズ想定で崩れない
```

---

## Final rule

Unity版は、各スマホにぴったり合わせる。

390x844は固定サイズではなく、設計・QA・比較のための基準値として使う。
