# FINAL Screen Comparison Review 2026-06-29

目的: `docs/design-targets/final/` のFINAL画像を基準に、390x844実画面のbefore / afterを比較し、コード差分ではなく目視変化で評価する。

## 参照画像

FINAL:

- TOP: `docs/design-targets/final/top-final.png`
- TOP implementation: `docs/design-targets/implementation/top-implementation.png`
- Stage Select: `docs/design-targets/final/stage-select-final.png`
- Result Clear: `docs/design-targets/final/result-clear-final.png`
- Collection: `docs/design-targets/final/collection-final.png`
- Level Up: `docs/design-targets/final/level-up-final.png`
- 黒曜化Cutin: `docs/design-targets/final/kokuyou-cutin-final.png`
- Battle HUD: `docs/design-targets/final/battle-final.png`

生成参照:

- `docs/design-targets/generated/top-final-rebuild-helper-2026-06-29.png`
- `docs/design-targets/generated/non-battle-ui-helper-2026-06-28.png`
- `docs/design-targets/generated/result-pro-layout-helper-390x844.png`
- `docs/design-targets/generated/collection-pro-layout-helper-390x844.png`
- `docs/design-targets/generated/non-battle-final-polish-ui-kit-2026-06-28.png`

`top-final-rebuild-helper-2026-06-29.png` は構図、紙の厚み、中央ノート、CTA、3カード配置の参照として使った。runtimeへは貼っていない。

## スクショ

before:

- `docs/design-targets/review-screenshots/2026-06-29-before/top-before.png`
- `docs/design-targets/review-screenshots/2026-06-29-before/stage-select-before.png`
- `docs/design-targets/review-screenshots/2026-06-29-before/result-clear-before.png`
- `docs/design-targets/review-screenshots/2026-06-29-before/result-fail-before.png`
- `docs/design-targets/review-screenshots/2026-06-29-before/collection-before.png`
- `docs/design-targets/review-screenshots/2026-06-29-before/collection-items-before.png`
- `docs/design-targets/review-screenshots/2026-06-29-before/level-up-before.png`
- `docs/design-targets/review-screenshots/2026-06-29-before/normal-cutin-before.png`
- `docs/design-targets/review-screenshots/2026-06-29-before/kokuyou-cutin-before.png`
- `docs/design-targets/review-screenshots/2026-06-29-before/battle-before.png`

after:

- `docs/design-targets/review-screenshots/2026-06-29-after/top-after.png`
- `docs/design-targets/review-screenshots/2026-06-29-after/stage-select-after.png`
- `docs/design-targets/review-screenshots/2026-06-29-after/result-clear-after.png`
- `docs/design-targets/review-screenshots/2026-06-29-after/result-fail-after.png`
- `docs/design-targets/review-screenshots/2026-06-29-after/collection-after.png`
- `docs/design-targets/review-screenshots/2026-06-29-after/collection-items-after.png`
- `docs/design-targets/review-screenshots/2026-06-29-after/level-up-after.png`
- `docs/design-targets/review-screenshots/2026-06-29-after/normal-cutin-after.png`
- `docs/design-targets/review-screenshots/2026-06-29-after/kokuyou-cutin-after.png`
- `docs/design-targets/review-screenshots/2026-06-29-after/battle-after.png`

FINAL比較用コピー:

- `docs/design-targets/review-screenshots/2026-06-29-final/`

## 目視評価

| Screen | 目視変化量 | FINAL達成度 | 判定 | Notes |
| --- | ---: | ---: | --- | --- |
| TOP | 4 | 4 | pass | 大きな紙札タイトル、明るい中央ノート、リング綴じ、大型CTA、3カード、月/星図/ランタン背景を追加。beforeとは明確に別物。 |
| Result Clear | 4 | 4 | pass | 記憶ページ、ランク封蝋、Rewards、New Records、下部CTAが成立。上部通知はやや強いが本文を壊していない。 |
| Result Fail | 4 | 4 | pass | Clearとの差、Cランク封蝋、リトライ導線が読める。 |
| Collection | 3 | 3 | keep | 紙index/進捗/紙パネルは成立。ただしFINALの2列カード/クリップ付き図鑑感にはまだ弱い。 |
| Stage Select | 3 | 3 | keep | 地図カード、難易度カード、Start CTAは読める。FINALほど紙の厚みはない。 |
| Level Up | 4 | 4 | pass | 3カード、Normal/Good/Rare、Rare glow、Owned rowが読める。 |
| Normal Cutin | 3 | 3 | keep | 構図とCTAは読める。FINAL参照は主に黒曜化向け。 |
| Kokuyou Cutin | 3 | 3 | keep | 斜め構図、黒インク、ランタンラインは成立。さらに強くする余地あり。 |
| Battle HUD | 3 | 3 | compare only | 比較記録まで。battle gameplayは触っていない。 |

3未満の画面: なし。

## 追加修正内容

- TOP:
  - タイトルを紙札/看板として大きく再構成。
  - 中央を暗い板ではなく、明るいノート/地図ページへ変更。
  - ノート左端にリング綴じを追加。
  - 主CTAを大型紙ボタンへ移動し、封蝋と星図線を追加。
  - 成長 / 忘れ物帳 / 設定を3カード化し、各カードへ簡易アイコンを追加。
  - 月、星図線、紙片、右側ランタンを背景に追加。
  - `hideQa=1` でlocalhost専用QAランチャーを非表示にできるようにし、実画面比較を邪魔しないようにした。

## 生成画像の反映

`top-final-rebuild-helper-2026-06-29.png` から採用した実装要素:

- 上部の大きな紙札の厚み。
- 中央ノートのリング綴じと地図線。
- CTAを画面で最も強い紙ボタンにする階層。
- 3カードの下部整列とアイコン主導の読みやすさ。
- 夜空、月、星図、ランタン光の背景密度。

採用していない要素:

- 生成画像そのもののruntime貼り付け。
- 生成画像内の文字。
- 生成画像の細かい紙テクスチャ。

## Scope確認

- Battle gameplay: 未変更。
- `src/game/systems/levelup.ts`: 未変更。
- `src/game/systems/pickups.ts`: 未変更。
- `src/game/systems/enemies.ts`: 未変更。
- `src/game/systems/weapons.ts`: 未変更。
- dawn_ticket通常混入なし: `pnpm test` の `levelup.test.ts` / `dataIntegrity.test.ts` で確認。
- dawn_ticket QA復帰: `pnpm test` の `survivalRevival.test.ts` / `playerDamageSurvivalRevival.test.ts` で確認。
- `public/assets/sprites/`: 未変更。

## Unityへ持っていくUI方針

- TOPは今回のWeb afterをUnityの最小目標にする。特に紙札タイトル、中央ノート、主CTA、3カードの階層は維持する。
- CollectionはUnity側で2列カード型へ再評価する。Web版は最低3以上の見本として止める。
- Battle HUDはUnityでSafe Area、実機タッチ、視認性を再設計する。Web側では深追いしない。
