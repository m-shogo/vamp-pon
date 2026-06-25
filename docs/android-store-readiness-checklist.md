# Android Store Readiness Checklist

Android beta / closed test / store準備に必要なものを、Unity移行前から逆算するためのチェックリスト。

今すぐ全部やらない。Stage1が遊べる状態になった後、ストア提出で詰まらないように準備項目だけ固定する。

## Release Strategy

1. Web版Stage1で面白さ確認。
2. Unity 30秒デモで移行判断。
3. Unity Stage1 beta build。
4. Android closed test。
5. Store listing polish。
6. Public release。

## Do Not Start Yet

以下はStage1完成前にやりすぎない。

- 広告SDK。
- IAP。
- サブスク。
- 大量ストア画像制作。
- 複数言語対応。
- Online leaderboard。

## App Identity

| Item | Status | Notes |
|---|---|---|
| App name | 未確定 | Vamp Ponは開発コード名扱い。正式名は後で決める |
| Package name | 未確定 | Unity移行後に固定 |
| Icon | 未作成 | 小さい光 / 紙 / 黒インクが伝わるもの |
| Short description | 未作成 | 80文字以内想定 |
| Full description | 未作成 | 世界観 + 遊び + 成長ループ |
| Contact email | 未設定 | ストア用 |
| Website | 任意 | Privacy Policy置き場にも使える |

## Store Assets

| Asset | Required | Notes |
|---|---|---|
| App icon | 必須 | 512x512 |
| Feature graphic | 必須 | 1024x500 |
| Phone screenshots | 必須 | TOP / Battle / LevelUp / Result / Growth |
| Tablet screenshots | 任意 | 最初は不要でもよい |
| Promo video | 任意 | SNS用にも使える |
| Privacy Policy | 必須寄り | データ収集の有無で内容調整 |
| Terms | 推奨 | 個人開発でも用意する |

## Screenshot Targets

最初のストア画像は以下の5枚でよい。

1. TOP: 夜とランタンの世界観。
2. Battle: 敵撃破とEXP吸引。
3. LevelUp: 3択カード。
4. Kokuyou / Ultimate: 一番映える瞬間。
5. Result / Growth: 報酬と成長。

## Build Requirements

| Item | Notes |
|---|---|
| Android target API | Google Play要件に合わせてリリース時に確認 |
| Version code | 自動増加ルールを決める |
| Version name | 0.1.0 betaなど |
| Keystore | 紛失厳禁 |
| Orientation | Portrait |
| Min device | 実機テスト結果で決める |
| Crash reporting | Firebase Crashlytics候補 |
| Analytics | Firebase or Unity Analytics候補 |

## Privacy / Policy

記載が必要になりやすい項目。

- 収集するデータ。
- 広告SDKの有無。
- 課金の有無。
- クラッシュログの有無。
- Analyticsの有無。
- 問い合わせ先。
- データ削除方法。

## Age Rating Notes

Vamp Pon系は以下を意識する。

- 怖すぎない黒インク表現。
- 流血なし。
- 過度なホラーなし。
- 課金 / 広告を入れる場合は説明。
- 子ども向けを名乗るかは慎重に判断。

## Closed Test Checklist

| Check | Done |
|---|---|
| Android build作成 |  |
| 実機で起動 |  |
| 390x844相当で表示確認 |  |
| 複数端末でSafeArea確認 |  |
| Stage1を最後までプレイ |  |
| 中断 / 復帰確認 |  |
| 音量確認 |  |
| Result保存確認 |  |
| Growth保存確認 |  |
| クラッシュログ確認 |  |

## First Beta Acceptance

最初のbetaは以下を満たせばよい。

- 1キャラ。
- 1ステージ。
- 1難易度以上。
- TOP / StageSelect / Battle / LevelUp / Result / Growth。
- 保存あり。
- ストア用スクショを撮れる見た目。
- 重大クラッシュなし。

## Store Copy Draft

### Short Description Draft

```txt
小さな灯りで、忘れられた夜を進む縦持ちアクション。
```

### Full Description Structure

```txt
1. 世界観: 夜、記憶、黒インク、小さな灯り。
2. 遊び: 敵を避け、光で切り開き、欠片を集める。
3. 成長: 負けても記憶を集めて強くなる。
4. 見どころ: カットイン、黒曜化、記憶帳。
5. 今後: ステージ・キャラ追加予定。
```

正式タイトルが決まるまで、ストア文言は仮扱いにする。

## Monetization Later

Stage1が面白くなるまで入れない。

候補だけ残す。

- 買い切り。
- 広告なしプレミアム。
- スキン。
- サポート課金。
- リワード広告は慎重に判断。

## Priority

```txt
1. Stage1が楽しい
2. Androidで重くない
3. スクショ映えする
4. 説明文で遊びが伝わる
5. 審査に必要な情報が揃う
```