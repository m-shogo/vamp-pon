# Unity U21.1 Design Severity Ranking

Severity: S = 直さないと商品に見えない、A = U22〜U23で直すべき、B = polish時に直す、C = 後回しでよい。

| Rank | Severity | 対象画面 | 問題 | 原因 | 修正方針 | 修正フェーズ候補 | 直すと何が良くなるか | 直さない場合のリスク |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S | Battle / Stage1 | 仕様説明リストに見える | プレイヤー/敵/HUD/EXPが実画面として存在しない | Battle HUD、敵、pickup、hit feedbackを画面として配置 | U22 | 一番長く見る画面が商品に見える | 縦切りの印象がprototype止まり |
| 2 | A | LevelUp | 選ぶ嬉しさが弱い | 無地カード、seal、icon、motion不足 | LevelUpCard prefab、紙厚、封蝋、rare pulse | U23 | 強化選択が報酬になる | ループのご褒美が薄い |
| 3 | A | 黒耀化 | ゲームの顔になりきれていない | cut-in、黒インク粒、余韻、SE/haptic不足 | Ready予兆、Active cut-in、ending余韻 | U24 | 記憶に残る必殺になる | 差別化の核が弱い |
| 4 | A | Result | もう一度遊びたくなる感が弱い | rank seal、報酬pop、朝焼け、New badge不足 | Result ledger / seal / reward card polish | U23 | 周回意欲が上がる | clear後の満足感が低い |
| 5 | A | StageSelect | 次へ進みたくなる地図感が弱い | ルート線、地図紙面、node誘導不足 | active node glow、route paper、last result印 | U23 | 出発したくなる | menu感が残る |
| 6 | B | Rare | レアの高揚が弱い | flareとsealの差分不足 | low alpha pulse、rare seal、短いhitstop | U24 | 運の良さが伝わる | レアが通常カードに埋もれる |
| 7 | B | Evolution | 合体のワクワクが弱い | 素材変化、光の収束、結果の見え方不足 | recipe icon、merge flash、result silhouette | U24 | 成長の山場になる | システム説明に見える |
| 8 | B | Drop / 回復drop | pickupの手触りが弱い | 実物scaleとmagnet curveが未提示 | EXP/Heart/Memoryのscale、trail、collect pulse | U22 | 集める気持ちよさが出る | 戦闘の快感が伸びない |

## Ranking note

最優先はBattle / Stage1。画面の滞在時間が最長で、ここが仕様説明に見えると全体が商品に見えない。次に、ループの報酬であるLevelUp / Result / StageSelectをU23へまとめ、黒耀化 / Rare / EvolutionはU24でclimax polishとして扱う。
