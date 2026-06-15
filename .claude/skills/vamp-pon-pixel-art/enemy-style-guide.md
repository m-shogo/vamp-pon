# Enemy Style Guide

Vamp Pon の敵素材は black ink family として統一する。
ただし、黒いだけの仮素材で終わらせない。

## Enemy families

| id | silhouette | gameplay role | visual key |
| --- | --- | --- | --- |
| `ink_blob` | low round blob | early crowd | glossy ink + glowing eyes |
| `torn_paper_wisp` | ragged paper shape | floating type | beige paper + ink edge |
| `hooded_ink_specter` | small hooded shadow | medium type | hood + small light |
| `ink_hound` | low beast shape | fast type | crouched shape + ink wisps |

## Must keep

- black ink family feel
- glowing eyes or readable light point
- silhouette difference
- darker than player
- readable over background
- scary-lite, not too dark for the game tone

## Avoid

- 黒い丸だけ
- 種類差が目だけ
- backgroundに沈む
- playerのフード形と混ざる
- pickupやhitCoreと誤認する明部

## Quality target

敵は1xで種類が読めること。
4xで雰囲気が良くても、1xでただの黒い塊なら不採用。
