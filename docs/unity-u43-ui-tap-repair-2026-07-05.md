# Unity U43 UI Tap Repair

## 症状

実機でクリック / tapできない。

## 原因

Stage1 runtime sceneにEventSystemがなく、UGUIの `PaperButton` / `PaperCard` がPointer eventを受け取れない可能性が高かった。StageSelect / Result / Retryもruntime sceneにtap可能UIとして接続されていなかった。

## 修正内容

- Stage1 bootstrapで `EventSystem` + `InputSystemUIInputModule` を生成。
- `GraphicRaycaster` 付きCanvasのStageSelect runtime overlayを追加。
- HUDにResult buttonを追加。
- Result overlayにRetry / StageSelect buttonを追加。
- `PaperButton` / `PaperCard` tapでU43 feedback bridgeへbutton tap hookを送る。

## 未確認

実機tapは未再確認。LevelUp card、Result、Retry、StageSelect buttonは実機で再確認する。
