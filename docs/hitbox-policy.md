# プレイヤー判定ポリシー

このプロジェクトの「東方方式」は、見た目の大きさと被弾判定を一致させない方針を指す。
スマホ縦画面でキャラクターの存在感を保ちつつ、プレイヤーが避ける中心点を直感的に読めることを優先する。

## 固定する仕様

- `PLAYER_DEFAULTS.radius` は `6`。
- `PLAYER_DEFAULTS.visualSize` は `36`。
- 通常時は中心に 2〜3px の小さい暖色の `hitCore` を常時表示する。
- `?debug=true` の時だけ、半径6の `debugHitCircle` を追加表示する。
- `hitCore` と `debugHitCircle` は別物として扱う。
- キャラの見た目サイズを被弾判定に合わせて縮めない。

## 触らないもの

- hp / moveSpeed / invulnSec。
- pickup の collectRadius / magnetRange。
- ユイのキャラ素材更新と player collision の同時変更。

## 監査観点

- 通常プレイで `hitCore` が背景とユイに埋もれない。
- `debugHitCircle` は確認用であり、通常プレイの画面情報量を増やさない。
- ユイのランタンと `hitCore` が誤認されすぎない。
