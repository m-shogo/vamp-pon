# Unity U43 Device Failure Addendum

## ユーザー実機確認で出た症状

- キャラがドットではない。
- 移動できない。
- クリックできない。
- デザインが全部できていない。
- 音が鳴らない。
- 振動がない。

## 原因

Stage1 build sceneはBootからStage1へ遷移していたが、Stage1 actual runtime sceneがplayable runtimeとして未接続だった。Keyboard入力のみ、EventSystemなし、runtime StageSelect / Result tap UI不足、AudioSource再生なし、haptic device hookなし、sprite filterがBilinearのままだった。

## 修正内容

U43でtouch movement、EventSystem、StageSelect / Result / Retry tap UI、Point filter、AudioListener、AudioSource runtime feedback、haptic runtime hookを追加した。

## まだ未確認のもの

実機再インストール後のtouch movement、tap、音、振動、device screenshot、audio latency、speaker clipping、mobile metricsは未確認。

## U42 known issuesへの影響

U42 known issuesに、internal preview readyでもactual device playable runtimeにP0破綻があり得ることを追加で反映する必要がある。U43では修復したが、実機確認まではdevicePlayableReady=false。

## U37へ進める条件

実機でStageSelect tap、Stage1 movement、LevelUp tap、Result / Retry tap、SE、haptic hook、crash/freezeなしを確認し、その後mobile metricsを取得できる状態にする。
