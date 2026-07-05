# Unity U43 Build Scene Audit

## 確認結果

- iOS build対象Sceneは `Assets/_Project/Scenes/Boot/Boot.unity` と `Assets/_Project/Scenes/Stage1/Stage1.unity`。
- 起動時はBoot sceneの `U1BootSceneBootstrap` が `SceneManager.LoadScene("Stage1")` でStage1へ遷移する。
- Stage1実装Sceneは `Assets/_Project/Scenes/Stage1/Stage1.unity`。
- Proof sceneはBuild Settingsに含まれていない。
- Editor verificationはBoot/Stage1を開いて確認しており、iOS build対象Sceneと同じSceneを見ている。

## 原因

Build scene自体は大きく間違っていなかったが、Stage1 scene内のbootstrapがplayable runtimeとして未接続だった。StageSelect tap可能UI、EventSystem、mobile touch input、AudioListener、Audio/Haptic runtime hookが不足していた。

## 修正内容

Stage1 bootstrapにEventSystem、AudioListener、StageSelect runtime overlay、Result/Retry runtime overlay、U43 runtime feedback bridgeを作る処理を追加した。Boot/Stage1以外のplaceholder/proof sceneはBuild対象にしない。

## 未確認

iOS実機で再インストール後、起動SceneがStageSelect overlayを表示することはまだ再確認が必要。`devicePlayableReady=false`を維持する。
