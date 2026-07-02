# Unity U29 Sprite Atlas / Performance / Mobile FPS Review

## 変更概要

U29では、Stage1 playable vertical slice向けにSprite Atlas方針、texture import方針、runtime cap / pooling方針、UI performance方針、audio / haptic performance guard、390x844 verification artifactを追加した。productionApproved=0のまま。

## performance budget

390x844縦、60fps目標 / 30fps下限のdraft budgetを定義した。max active enemiesはU26 clear_pushに合わせて38、pickups 48、projectiles 24、hit effects 16、particles 64、audio voices 8、texture memory 32 MB draft、draw call 45 draft。

## Sprite Atlas方針

U29ではpolicyと`sprite-atlas-map.json`を作成し、`.spriteatlas`本packingはU30へ送った。対象はcharacters、enemies、items/icons、UI paper、effects。generated screenshots、design targets、fullscreen review artは対象外。Addressablesは未導入。

## texture import方針

pixel art、paper UI、64px icons、VFX、fullscreen art、generated referenceを分けた。filter mode、compression、max texture size、alpha、mipmap、readable flag、PPU方針を定義した。既存candidateの一括import変更はしていない。

## runtime cap / pooling方針

`U29RuntimeCapPolicy`、`U29Stage1PoolBudget`、`U29EffectCapGate`を追加した。cap到達時は画面外cleanup、spawn throttle、effect skipを優先し、敵を急に消すようなgameplay破壊は避ける。

## UI performance方針

HUD、LevelUp、Result、StageSelect、reward cards、unlock reveal、previous result stamp、Kokuyou gaugeについて、静的UIと動的UIの分離、text update頻度、layout rebuild guardを定義した。390x844可読性は維持する方針。

## audio / haptic performance guard

U28 routingを壊さず、`U29AudioPerformanceBudget`、`U29HapticPerformanceBudget`、`U29FeelPerformanceGuard`を追加した。audio polyphony、low priority voice cap、Kokuyou active loop optional、damage / Kokuyou haptic cooldown、unlock repeat suppressionを扱う。

## 390x844確認結果

`docs/design-targets/generated/unity-u29/screenshots/`にopening、early wave、mid wave、Kokuyou、Evolution、Result、StageSelectのperformance proof画像を生成した。`performance-budget.json`、`runtime-cap-map.json`、`sprite-atlas-map.json`、`texture-import-policy-map.json`、`audio-haptic-budget-map.json`も生成した。

## mobile実機確認の状態

mobile実機確認は未確認。U29はEditor proofとbudget整備であり、実機FPS / memory / thermal / draw call / audio latency / haptic behaviorはU30 / U31で測る。

## Editor確認と実機確認の違い

Editor screenshot / verificationは構造確認のみ。mobile performanceの合否判定には実機Profiler、Frame Debugger、device thermal、actual FPSが必要。

## productionApproved=0の理由

Sprite Atlas本packing、platform texture compression、実機FPS、memory、thermal、draw call、AudioMixer、haptic実機確認、production approval gateが未完了のため。

## generated final画像 / Addressables / 本番保証

generated final画像や参照PNGをruntimeへ貼っていない。Addressables未導入。本番performance保証ではない。

## 実行したcheck一覧

- Unity U29 screenshot capture
- Unity U29 verification
- 既存Unity verification一式
- `pnpm unity:u29-performance-mobile-fps:check`
- `pnpm unity:u28-se-haptic-feel:check`
- `pnpm unity:u27-save-reward-unlock:check`
- `pnpm unity:u26-stage1-first-playable-balance:check`
- `pnpm unity:u25-stage1-production-battle-loop:check`
- `pnpm unity:u24-climax-polish:check`
- `pnpm unity:u23-ui-visual-polish:check`
- `pnpm unity:u22-battle-visual-polish:check`
- `pnpm unity:meta:check`
- `git diff --check`

## 残リスク

実機FPS、memory、thermal、draw call、Canvas rebuild、GC allocation、audio latency、haptic intensityは未測定。Sprite Atlas本作成時に見た目劣化がないか追加QAが必要。

## U30 production approval gateへ渡す項目

実機Profiler evidence、Sprite Atlas packing evidence、texture compression QA、mobile FPS / memory / thermal、Canvas rebuild、GC allocation、audio polyphony、haptic cooldown、Stage1 vertical slice判定。
