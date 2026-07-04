# Unity U41 Rank Reward Hardening

U41 rankはRC candidate tableであり、本番経済確定ではない。初回Stage1はA/Bでも嬉しく、Sは狙い要素にする。

| rank | criteria | rank reason | reward band |
|---|---|---|---|
| S | clear, <=420s, kills>=125, level>=6, collected>=24 | chase rank | clear + rank 6 |
| A | clear, kills>=105, level>=5, collected>=16 | strong first clear target | clear + rank 4 |
| B | clear or near-clear, kills>=70, level>=4 | good run | clear + rank 2 |
| C | defeat with level>=3 or clear below B | progress kept | participation + small band |
| D | early defeat | try again safely | minimum reward |

Defeat時はLv3以上ならC、早期defeatはD。first clear時はrankよりもfirst clear bonusとnew unlockを上に見せ、best rank updateはstampとして表示する。

Generated JSON: `docs/design-targets/generated/unity-u41/rank-reward-table.json`
