# Unity U12 Result / StageSelect Functional Proof Plan

作成日: 2026-07-01

## Scope

U12は正式実装ではなくfunctional proofである。

U11のPrefab-like component構成を保ったまま、Result / StageSelectへ仮データを注入し、button押下のproof hookを確認する。正式Result Scene、正式StageSelect Scene、save、reward反映、Stage解放、難易度本番計算、黒耀化runtime、cut-in runtime、Addressables、production approved昇格は行わない。

## Result Functional Proof Data

`ResultProofData` に表示用の仮データを集約する。

- Rank: `A`
- MemoryCount: `3`
- FragmentCount: `12`
- BlessingCount: `3`
- ElapsedTime: `08:00`
- DefeatedEnemies: `128`
- RewardCards: `記憶 / 墨 / 灯`

U12ではこの値をResult component proofへ流し込む。報酬計算、クリア/失敗判定、保存処理は作らない。

## StageSelect Functional Proof Data

`StageProofData` に表示用の仮ステージデータを集約する。

- `stage_01`: `はじまりの路地` / `やさしい` / selected / unlocked
- `stage_02`: `灯りの曲がり角` / `ふつう` / locked / not unlocked
- `stage_03`: `黒い橋` / `ふつう` / locked / not unlocked

active / locked nodeの表示差は仮データから反映する。Stage解放ロジック、難易度計算、正式StageSelect Scene化は行わない。

## Button Proof Hooks

Result buttonは `result_continue`、StageSelect buttonは `stage_start` のproof logを出す。

このhookはEditor proofで検証するためだけのもので、Scene遷移、save、reward反映、Stage開始、Stage解放APIへは接続しない。

## Data Binding Plan

U12ではU12 data modelからU11 proof componentへ値を渡す。

正式実装時は、Result clear data、reward summary、stage catalog、unlock state、button actionをproduction data sourceへ置き換える。今回の`ResultProofData` / `StageProofData`はその前の表示・構成確認用である。

## Candidate Asset Treatment

使用素材はU5 / U8 / U8.1 / U10 candidateのまま扱う。U12で新規画像生成は行わず、`Resources/U12Proof` も作らない。

## Proof-only Boundary

- `Resources/U5Candidates`, `Resources/U8Candidates`, `Resources/U8Refined`, `Resources/U10Candidates` はproof-only維持。
- UI文字はTMPで重ねる。text-baked runtime imageは使わない。
- Route Aを通常表示の方針として維持する。
- Route B glowは将来Animation候補のままにする。

## Approval State

`productionApproved=0` を維持する。U12ではcandidate素材をapprovedへ昇格しない。

## U13以降へ残すこと

- Result / StageSelectの正式Prefab asset化。
- 正式Scene化と遷移設計。
- save / reward反映 / Stage解放 / difficulty計算。
- SE / haptic hook。
- Safe Areaと実機輝度での可読性確認。
- 黒耀化Bの粒表現の人間レビュー継続。
- 黒耀化runtime、黒耀化ゲージ / ボタン、必殺cut-in runtime。
