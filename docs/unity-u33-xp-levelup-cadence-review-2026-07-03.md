# Unity U33 XP / LevelUp Cadence Review

## 変更

- XP curve: `0/8/20/38/62/92/130/176` から `0/7/18/34/56/84/120/162`。
- XP drop chance: `0.88` から `0.9`。
- opening XP valueは2、after openingは3のまま。

## 目標への対応

- 30〜45秒以内にLv2へ到達しやすくする。
- 2分前後でLv3〜Lv4が見える。
- 3〜4分でweapon / passiveの方向性が見え、Lv5まで虚無になりにくい。
- LevelUp UIを複数回確認できる。

## 候補設計

ChoiceCount 3、weapon/passive構成、evolution guardは維持。進化後に旧武器が自然に再出現し続ける矛盾はU33では増やしていない。候補の偏り、owned upgrade weight、rare candidate chanceはU35で実プレイ分布を見る。

## 残リスク

Editor推定であり、実機操作と回収率はNOT_MEASURED。文字被りは既存U23/U31 evidenceを維持し、U34でRC画面として再確認する。
