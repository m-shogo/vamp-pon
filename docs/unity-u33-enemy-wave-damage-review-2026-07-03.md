# Unity U33 Enemy Wave / Damage Review

## 変更

- opening: `2.6s/max7` から `2.45s/max8`。
- first pressure: `2.1s/max12` から `2.0s/max13`。
- multi choice: `1.85s/max18` から `1.75s/max20`。
- mid wave: `1.45s/max26/contact8.5` から `1.4s/max27/contact8`。
- climax prep: `1.2s/max32/contact10` から `1.15s/max34/contact9.5`。
- clear push: `0.95s/max38/contact12` を維持。
- BasicWeaponDamage: `12` から `13`。

## 体験意図

敵を硬くして時間稼ぎせず、序盤の攻撃感と2〜6分の密度を少し増やす。中盤以降は接触ダメージをわずかに丸め、初心者の理不尽な敗北を避ける。

## U29 cap整合

max active enemies 38、projectiles 24、pickups 48を維持。実機未測定なので過剰密度にはしない。

## U35確認

FPS、draw call、敵の画面占有率、contact damageによるdefeat率、hit/defeat audio polyphony。
