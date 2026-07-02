# Unity U22 Library / Package Evaluation

## 現在manifestに入っているpackage

`unity/VampPonUnity/Packages/manifest.json` の直接dependencyは以下。

- `com.unity.2d.sprite` 1.0.0
- `com.unity.inputsystem` 1.19.0
- `com.unity.render-pipelines.universal` 17.5.0
- `com.unity.timeline` 1.8.12
- `com.unity.ugui` 2.5.0
- `com.unity.modules.physicscore2d` 1.0.0

## package-lockの状態

`unity/VampPonUnity/Packages/packages-lock.json` はURP、Input System、UGUI、Timelineとそれらの依存を記録している。U22ではmanifest / package-lockを変更しない。

## U22で新規導入したpackage

なし。

## 評価結果

### Existing URP / 2D URP

既存の2D URP設定を維持する。U22では新規packageを増やさず、暗い紙、ランタン光、黒インクburst、pulse表現を軽量なUI proofとして構成する。2D lighting / glow / material表現はU23以降の候補として残す。

### Existing TMP

既存のZenMaruGothic SDFとTMPを使用する。UI文字は画像に焼き込まず、短いHUDと小さいproof labelに限定する。

### Existing TimeScaleService

既存のTimeScaleServiceを維持する。U22 verificationでTimeScale final=1を確認する。

### Existing U19 feedback hooks

U19のhit / pickup / drop / feedback proofを参照し、U22では視覚状態に反映する。U19の本番化はしない。

### Cinemachine

未導入。U22では導入しない。理由は、既存のlightweight impulse proofと静的なBattle Visual Polish proofで目的を満たせるため。Cinemachine ImpulseはU24の黒耀化climaxや実機酔い確認とセットで再評価する。

### Input System

すでに導入済み。U22では新しいaction mapやtouch本格実装には使わない。実機touch / action mapはU20.1で検討する。

### Sprite Atlas

U22では本格導入しない。今回はasset batchingではなくBattle画面の見え方を優先する。将来mobile performanceとruntime asset整理の候補としてU23以降に残す。

### Third-party tween / VFX packages

導入しない。DOTween、Asset Store UI kit、paid package、ライセンス不明のeffect packは使わない。U22の範囲は既存URP / TMP / proof controller / lightweight VFXで足りる。

## U23 / U24 / U20.1へ残すpackage候補

- Cinemachine: U24の黒耀化 / Rare / Evolution climaxでcamera impulseが必要になった場合に再評価。
- Sprite Atlas: U23以降のmobile performance / batchingで再評価。
- Input System: U20.1のReal Device Build Passでtouchとsafe areaを実機確認しながら再評価。

## 結論

U22では新規package導入なし。manifest / package-lock差分なし。Battle Visual Polish Proofは既存URP、TMP、U19 hooks、U20 budget、U21 vertical slice stateの範囲で実装する。
