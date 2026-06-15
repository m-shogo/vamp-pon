# Asset Quality Audit

この文書は、現状素材を `keep / temporary / remake / final-candidate` に分類するための監査表。

現時点の前提:
- 既存素材は gameplay 実装用としては有用。
- ただしアート品質としては reference へ届いていないものが多い。
- 微妙な素材を `hand-final candidate` と呼ばない。

---

## 1. 分類定義

| status | 意味 |
| --- | --- |
| `keep` | そのまま継続使用してよい |
| `temporary` | 仮素材。実装確認には使えるが品質は弱い |
| `remake` | 作り直し対象 |
| `remake-first` | 優先的に作り直す |
| `final-candidate` | 品質ゲートを通した本命候補 |

---

## 2. Player

| asset | status | 理由 | 次の一手 |
| --- | --- | --- | --- |
| `yui_idle_42` | `remake-first` | 42px化は済みだが、referenceのsoft painterly pixel artには届いていない。顔・服・フードの厚みがまだ記号的。 | idleだけに絞って再調整 |
| `yui_move_42` | `temporary` | idle基準が弱いまま展開されている。 | idle確定後に再展開 |
| `yui_hurt_42` | `temporary` | 同一人物性はあるが、基準idleが弱い。 | idle確定後に再展開 |
| `yui_ultimate_42` | `temporary` | 派手差分より先に基準品質を上げる必要がある。 | idle / move / hurt後に再調整 |

---

## 3. Enemies

現状の敵は gameplay fallback / 仮素材として扱う。
黒インク敵の方向は良いが、魅力と種類差が弱い。

| family | status | 問題 | 次の一手 |
| --- | --- | --- | --- |
| ink blob 系 | `remake-first` | 黒いだけになりやすい。目と縁の魅力が必要。 | `ink_blob` reference基準で再設計 |
| paper / scrap 系 | `remake` | 紙片と敵の関係が弱い。 | `torn_paper_wisp` として再定義 |
| specter 系 | `remake` | フード影としてのキャラ性が必要。 | `hooded_ink_specter` を作る |
| beast 系 | `remake` | 横方向の高速敵としてのシルエットが欲しい。 | `ink_hound` を作る |

---

## 4. Background / Tiles

| asset | status | 問題 | 次の一手 |
| --- | --- | --- | --- |
| `bg_stage1_paper_night` | `temporary` | 世界観の方向は良いが、referenceの密度・空気感とは差がある。背景は主張しすぎてもダメ。 | 32x32 or 64x64 tileとして再設計 |
| background fallback | `temporary` | 実装確認用。最終画ではない。 | tile化後に置換 |

背景の監査観点:

- キャラが埋もれないか
- 敵が読めるか
- 弾が読めるか
- 欠片や回復が背景に混ざらないか
- repeating が自然か
- 目立つ明部が多すぎないか

---

## 5. Pickups

| asset | status | 問題 | 次の一手 |
| --- | --- | --- | --- |
| memory shard | `temporary` | ランタン / hitCore / 金色UIと競合しやすい。 | 形と色で「記憶の欠片」に寄せる |
| heal | `temporary` | gameplay上は読めるが画風統一が必要。 | 紙片 / 小瓶 / 光の整理 |
| capsule | `temporary` | UI記号感が強い可能性。 | 世界観に寄せる |

---

## 6. UI

| area | status | 問題 | 次の一手 |
| --- | --- | --- | --- |
| card UI | `temporary` | 紙の世界観は使えるが、最終品質監査が必要。 | 読みやすさ優先で再評価 |
| HUD | `keep` | まず gameplay 優先。装飾は後。 | 最小変更 |
| asset-status / gallery | `keep` | 品質確認導線として重要。 | pixel-art品質ゲート表示を検討 |

---

## 7. 作り直し優先順位

1. `yui_idle_42`
2. `yui_move_42`
3. `yui_hurt_42`
4. `yui_ultimate_42`
5. `enemy_ink_blob`
6. `enemy_torn_paper_wisp`
7. `enemy_hooded_ink_specter`
8. `enemy_ink_hound`
9. `bg_stage1_paper_night` tile
10. memory shard / heal / capsule

---

## 8. 注意

この監査は、素材を否定するためではなく、**仮素材を仮素材として扱い、品質名を盛らないため**のもの。

`final-candidate` と呼ぶには `docs/pixel-art-quality-gate.md` を通すこと。
