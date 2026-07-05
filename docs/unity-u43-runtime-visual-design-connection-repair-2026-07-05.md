# Unity U43 Runtime Visual Design Connection Repair

## 症状

実機でデザインが全部できていない。

## 原因

U22〜U42の多くはproof / generated evidence / model verificationであり、Stage1 actual runtime sceneにはStageSelect、Result、tap可能UI、runtime feedback hookが不足していた。

## 修正内容

- StageSelect overlayをStage1 runtimeへ追加。
- Battle HUD、player、enemy、XP/pickupは既存Stage1 bootstrapの接続を維持。
- LevelUp overlayはEventSystem追加でtap可能化。
- Result / Retry / StageSelect return overlayを追加。
- paper / black ink / lantern toneの最低限のruntime UIを追加。

## 未確認

実機スクショ未提供。U43 screenshot evidenceはEditor evidenceであり、DEVICE_SCREENSHOT_NOT_PROVIDEDを明記する。
