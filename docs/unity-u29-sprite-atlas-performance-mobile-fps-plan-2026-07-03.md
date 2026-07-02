# Unity U29 Sprite Atlas / Performance / Mobile FPS Plan

## U29でやること

- Stage1 playable vertical slice向けにperformance budget、Sprite Atlas方針、texture import方針、runtime cap / pooling方針、UI performance方針、audio / haptic performance guardを定義する。
- U25 / U26 runtime loop、U27 save / reward / unlock、U28 audio / haptic routingを壊さず、最適化準備とverification基盤を追加する。
- 390x844 Editor確認artifactと、U30 production approval gateに渡すperformance checklistを作る。

## U29でやらないこと

- production approvalへの昇格。
- 本番performance保証。
- Addressables本導入。
- 実機FPS計測の完了扱い。
- generated final画像や参照PNGのruntime直貼り。
- 見た目や文字可読性を落とす雑な一括import変更。

## 本番保証と確認範囲

U29はEditor上の構造確認とbudget整備であり、本番performance保証ではない。mobile実機確認は未確認として扱い、U30 / U31で実測する。

## Sprite Atlas方針

Atlas対象はplayer / enemies / weapon・passive icons / pickups / UI paper parts / stamp・seal parts / climax effect sprites。generated screenshots、design target画像、fullscreen review artは対象外。U29ではpolicyとmapを作り、Unity `.spriteatlas` の本適用はU30以降のasset replacement / approval gateで行う。

## texture import方針

pixel art、paper UI、VFX、fullscreen art、generated referenceを分ける。runtime spriteだけを対象にfilter、compression、max size、alpha、mipmap、readable、PPUを定義し、既存candidateを一括変更しない。

## mobile FPS target

390x844縦で60fps目標、30fps下限のdraft。Editor確認と実機確認は分ける。

## draw call / memory / effect cap方針

U26 wave capを超えない範囲で敵、pickup、projectile、hit effect、particle、audio voice、hapticをcap化する。cap到達時は画面外cleanup、spawn throttle、effect skipを優先し、敵を急に消すようなgameplay破壊は避ける。

## U30 production approval gateへ渡す項目

- Sprite Atlas本作成とatlas packing結果。
- platform別texture compression確認。
- 実機FPS / memory / thermal / draw call / audio latency計測。
- Canvas rebuild / GC allocation / pooling実測。
- U28 audio polyphonyとhaptic cooldownの実機調整。
