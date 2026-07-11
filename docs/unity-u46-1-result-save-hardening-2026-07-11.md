# U46.1 Result / Save Hardening

通常HUDからverification用「結果」buttonを削除した。Clear/Fail検証は`VAMPPON_AI_SIMULATOR_SMOKE`内のbridgeから`CompleteVerificationRun`へ送るため、通常buildには人工Result導線が存在しない。

Result Viewはread modelにある報酬・新記録だけを表示する。空の場合は「持ち帰った記憶はありません」「新しい記録はありません」を独立labelで表示し、報酬cardや新記録rowを偽装しない。

`GameSaveSnapshot.DeepCopy()`で全List、upgrade、settingsを複製し、Result unlockはcopy-on-writeで保存する。成功時だけ`SaveService.Current`を更新し、失敗時は元のCurrentを保持したまま「記録を保存できませんでした」を表示する。RetryとStageSelect returnは継続可能。

`U46RuntimeShell`はLevelUp、PauseChanged、StateChangedの購読を再Initialize前とOnDestroyで解除する。UI importはBilinear固定へ単純化した。画像は再生成しておらず、Candidate 02のoutput hashと22部品は変更していない。

U46.1 hardeningは完了。実機、final art、AudioMixer、haptic、性能、RC、production承認は未確認のままfalse。
