# Effects Tech Research

## 結論

今は追加ライブラリなし。Phaser 標準の Tweens、簡易粒、BlendMode、Camera effects だけで十分に強化する。実SE/BGM追加後、まだ弱い場合に Glow/Bloom/Howler などを検討する。

## 今すぐ使う

| 技術 | 判断 | 用途 |
| --- | --- | --- |
| Phaser Tweens | 採用 | 敵死亡のscale punch、EXP吸引カーブ、カードpop、UIゲージTween。 |
| Phaser Particles / 軽量粒 | 採用 | hit、death、paper scrap、EXP trail。現状はObject生成を粒capで制御する。 |
| `BlendMode.ADD` | 採用 | 小さな光、LvUp ring、EXP吸収pop。使いすぎると画面が白むので短時間に限定。 |
| Camera shake/flash | 採用 | 強hit、elite死亡、LvUp、進化だけ控えめに使う。通常hitでは基本使わない。 |
| Web Audio API | 採用 | 素材なしfallback SE、pitch/rate ladder、将来の音加工。 |

## 将来候補

| 技術 | 判断 | 検討タイミング |
| --- | --- | --- |
| BitmapFont | 候補 | damage number を大量表示する段階。通常Textより描画負荷と見た目を安定させる。 |
| Object pool | 必須候補 | death/EXP粒が増え、モバイルでGCが見えたら優先して導入する。 |
| GSAP | 保留 | UI演出が複雑になり、Phaser Tweensだけで同期が読みにくくなった時。 |
| PixiJS Filters | 保留 | Glow/Bloomの見栄えがPhaser標準で足りない時。 |
| Rive | 保留 | UIゲージや報酬演出をデザイナー主導で作る時。 |
| Spine | 保留 | キャラ/敵を骨アニメで運用する時。現ドット絵方針では過剰。 |
| Lottie | 保留 | 報酬UI専用の軽いベクター演出が必要な時。 |
| Howler.js | 保留 | 音素材が増え、BGM duck、sprite、フェード、モバイル差分制御が複雑化した時。 |
| WebGL shader | 保留 | bloom、歪み、黒インク波紋が必要な時。 |
| WebGPU | 将来候補 | 今の規模では不要。対応端末と実装コストを見て判断。 |

## Performance Notes

- 390 x 844 のスマホ縦画面を基準に、プレイヤーとカード説明を隠さない。
- particle cap を維持し、lowSpecではtrail、粒数、shakeを削る。
- death/EXPは多発するため、1イベント1粒ではなく「短命の小レイヤー」を粒cap内で組む。
- debugでは fps、particle count、enemy count、EXP gem count、combo count、Lv2/Lv3到達秒、xp/min を見る。
