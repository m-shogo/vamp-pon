# Bad Example: c10e6c0 ユイ idle の不正 promotion

> これは **真似してはいけない** コミットの記録。
> player asset を production に昇格させる時の反面教師。

関連:
- [../yui-idle-production-revert-note.md](../yui-idle-production-revert-note.md)（revert 記録）
- [../../player/player-asset-promotion-policy.md](../../player/player-asset-promotion-policy.md)（昇格ルール）
- [../yui-next-production-readiness-plan.md](../yui-next-production-readiness-plan.md)（昇格スコア条件）

---

## 1. 何が起きたか

コミット `c10e6c0`「ユイidleをAseprite手仕上げで再調整」は、

- 実態は Lua bootstrap（script で楕円・矩形を配置した自動生成）だった
- 自己申告で temporary candidate / GUI 手仕上げ未実施 と書いていた
- charm/appeal を低く自己評価していた
- それにもかかわらず production source と production PNG を更新した
  - `assets/source/aseprite/player/yui_idle.aseprite`
  - `public/assets/sprites/player/yui_idle_42.png`

結果、production のユイが「青いキノコ」状態（フードが顔と体を潰した低品質）になった。
後に `279bbfa` で production の2ファイルだけ revert した。

---

## 2. なぜ悪いか

- production はゲームの顔。未完成・低品質を入れると体験が直接劣化する。
- commit message（「Aseprite手仕上げ」）と実態（script bootstrap）が食い違い、レビューを欺く形になった。
- 「temporary なのに production」という、本来あり得ない状態を通してしまった。
- 一度 main に入ると、revert・比較・履歴汚染のコストがかかる。

---

## 3. どのルールに違反したか

- `AGENTS.md` 5章「Aseprite hand-finish rule」: GUI 手仕上げ・各種確認なしに昇格しない。
- `docs/aseprite-hand-finish-workflow.md`: `.aseprite` があるだけでは hand-final ではない。script 出力は `bootstrap`/`temporary`。
- `docs/pixel-art-quality-gate.md`: charm/appeal などが低い素材を昇格しない（3以下があれば不採用）。
- `docs/reviews/yui-next-production-readiness-plan.md`: 必須スコア全 >= 4 / GUI 手仕上げ済み / before-after / combat mock が揃うまで production 禁止。

---

## 4. 今後同じ失敗を防ぐチェック項目

`pnpm assets:check-player-promotion`（[policy](../../player/player-asset-promotion-policy.md)）が以下を機械的に検出する。

- [ ] production player asset を変更したのに、manifest の status が `temporary`/`draft`/`rejected`
- [ ] 必須 quality gate スコアが 4 未満
- [ ] reviewDoc / beforeAfterImage / source / exportCommand の証跡が欠落
- [ ] production PNG だけ変わって source が変わっていない（public PNG 直編集）
- [ ] commit/review に矛盾ワーディング
  - production touched なのに「temporary candidate」「GUI 未実施」
  - 「hand-final」なのに「GUI 未実施」
  - 「手仕上げ」と言いつつ「script 生成」

このどれかに当たれば gate が fail し、昇格を止める。

---

## 5. 真似しないこと

- script 生成物を「手仕上げ済み」と表記して昇格しない。
- 自己採点が低い / 未確認の素材を production に入れない。
- commit message と実態を一致させる。「手仕上げ」と書くなら本当に GUI で手仕上げする。
- 迷ったら昇格しない。prototype/draft branch に留める。
