# Chrome QA report 2026-06-19

## 確認環境

- URL: `http://localhost:5173/`
- 画面サイズ: 390×844相当
- リソース読み込み失敗: なし
- console: ページ遷移ごとに `EXCEPTION Object` が2件ずつ発生。ゲームプレイ中の追加発生なし。

## 良かった点

- QAランチャーの折りたたみが機能し、通常操作を邪魔しにくい。
- Main gameはクラッシュ、停止、真っ黒なし。
- ユイ、敵、ドロップ、HPバー、必殺ゲージは正常に表示、更新される。
- アイテム選択UIは読みやすく、ゲーム停止も自然。
- Yui 96 cellsは4ページ分割、frame名、R行C列番号がありQAしやすい。
- Yui rage cycleは1〜19ステップがラベル付きで、25/50/75%差もわかる。
- 追加48セルの遅延読み込みは正常。
- Weapon FX QAは武器種ごとのhit/trail/反射/範囲/オービットが整理されている。

## 修正対象

1. 全QA画面共通: QAランチャーとタイトルの重なり。
2. Main game: アイテム選択UIの説明テキスト右端切れ。
3. Yui rage cycle: 背景の大判ユイ画像と76px表示・ラベルのコントラスト不足。
4. Cutin QA: fallback時に通常必殺と黒耀化の差が見えない。
5. Elite beat QA / Weapon FX QA: FX発火領域が暗く、発火したか判断しにくい。
6. 全QA画面共通: `EXCEPTION Object` のスタック取得不能。
7. Yui 96 cells: R1C5 idle_backのバッグ識別性が弱い。これは画像セル微修正として別作業扱い。

## 次回の修正優先度

- 高: アイテム選択UIの説明折り返し。
- 高: console例外のスタックトレース化。
- 中: QAランチャー位置調整。
- 中: Elite beat / Weapon FX QAの発火カウンター、枠線追加。
- 低: Cutin fallbackの色分け。
- 低: Rage cycle QAのオーバーレイ追加。
- 別作業: Yui 96 cells R1C5の画像セル微修正。
