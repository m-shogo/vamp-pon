# Unity U41 Result Reward Display Hardening

390x844 Resultで報酬が読めるよう、表示順とカード数を整理した。実装の大規模UI変更ではなく、RC candidate表示方針のhardening。

- rank seal: ledger冒頭に置く。
- best updated stamp: rank直下で短く表示。
- reward cards: max 4、overflowは`+N more`相当の行にする。
- bonus breakdown: fragment / memoryを分け、理由labelを短くする。
- new unlocks: rewardとは別groupでpriority順。
- retry button / stage select button: 下部で混ぜない。

First clearはfirst clear bonusとknowledge placeholderを優先表示。Defeatでもparticipation rewardとnext rank hintで少し進んだ感を出す。Glowで文字を潰さず、ledger感を維持する。

Generated JSON: `docs/design-targets/generated/unity-u41/result-reward-display-map.json`
