# Unity U13 Stage / Result Flow Design

作成日: 2026-07-01

## Ideal Flow

```txt
StageSelect
  -> Battle
  -> Result
  -> StageSelect
```

U13時点では実flow接続しない。静的なflow map proofと設計だけを作る。

## U14 Temporary Flow

U14では本番完成ではなく、仮flowとして以下をつなぐ。

1. StageSelect proof screenで選択stageを決める。
2. Battleへ `selectedStageId` と `selectedDifficulty` を渡す。
3. Battle終了相当の仮Result dataを作る。
4. Result screenへ仮Result dataを渡す。
5. Result「次へ」でStageSelectへ戻る。

## Data To Battle

- `selectedStageId`
- `selectedDifficulty`
- `startTime`

## Data To Result

- `clear/fail`
- `elapsed`
- `defeatedEnemies`
- `fragments`
- `memories`
- `blessing`
- `rank`
- `rewardCards`

## Data Back To StageSelect

- `lastPlayedStageId`
- `resultSummary`
- `unlockCandidate`

## Save / Reward / Unlock Timing

- U13: まだ入れない。
- U14: 仮flowで遷移と表示だけ確認する。
- U15以降: save / reward反映 / Stage unlock / difficulty本番計算を分離して入れる。

## SE / Haptic Hook

- StageSelect「出発」: paper press, small lantern pulse, optional haptic.
- Result「次へ」: paper press, page close, optional haptic.
- U13ではinterfaceとproof handlerの計画のみ。実Audio / Haptic runtimeには接続しない。

## Back / Home / Retry

- Result: `次へ` のほかに、将来 `Retry` / `Home` を検討する。
- StageSelect: BackはTOPへ戻る候補、HomeはTOP直行候補。
- Battle: Pause menuからRetry / StageSelect / Homeを検討する。
- U13では導線設計のみ。

## Safe Area Review Points

- StageSelect下部InfoPanelとStart buttonがhome indicator / navigation barに被らないこと。
- Result下部StatsLineとContinue buttonが小型端末で読めること。
- 390x844 / 360x800 / 430x932だけでなく、notch / dynamic island / Android navigation barで確認すること。
- 実機確認はU13ではnot executed。
