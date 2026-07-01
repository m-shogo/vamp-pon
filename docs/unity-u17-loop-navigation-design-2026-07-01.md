# Unity U17 Loop Navigation Design

作成日: 2026-07-01

## Resultから

- 次へ: StageSelectへ戻る。
- もう一度: 同じ `StageStartRequest` でBattleへ戻る予定。U17ではproof labelのみ。
- ホーム: 将来Topへ戻る予定。U17ではproof labelのみ。

## Battle中

- Pause: 将来Pause menuでResume / Retry / Homeを扱う。
- Retry: 現在のrunを破棄して同じStageStartRequestで再開始する予定。
- Home: 将来Topへ戻る予定。
- Resume: Pause解除予定。

## StageSelect

- Back / Home: 将来Topまたは前画面へ戻す。
- U17では正式Top Scene、正式Pause Menu、正式Retry flow、正式Home flow、Save接続は作らない。
