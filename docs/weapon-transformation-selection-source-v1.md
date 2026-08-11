# ヨルノシルベ1 Weapon Transformation Selection Source v1

## Status / Authority

- Existing authority: **Transformation38**
- Fusion 18
- Synthesis 12
- Awakening 8
- Selection source: `src/game/data/weaponTransformationSelectionSource.ts`
- Authority boundary: **CONTENT_SOURCE_ONLY**
- 新しいTransformationを追加しない。
- Base Weapon SelectionのCurrent8 + Selected16 = Base24を上流Authorityとして使う。
- Base Hold4に依存するTransformationは削除せずHoldへ連鎖する。

## 結論

Base24で実際に入力Weaponを揃えられるものだけをTitle1 selected graphへ残す。

結果:

- **Selected29**
- **Hold9**

内訳:

- **Fusion 11 / 7** — selected / held
- **Synthesis 11 / 1**
- **Awakening 7 / 1**

38候補自体は全件candidate reservoirへ残る。

## Base Hold4

上流で保留しているBase Weapon:

- `frost_window`
- `repair_spanner`
- `name_reel`
- `morning_dew_dropper`

保留理由はTransformation側で上書きしない。

- `frost_window` — temporary terrain / mobile line density
- `repair_spanner` — return-family overlap
- `name_reel` — target-link readability
- `morning_dew_dropper` — trail performance / floor readability

BaseがTitle1 Selectedではないのに、その武器を材料にする進化だけ先に使える状態を禁止する。

## Hold9

### Fusion Hold7

- `fusion_frost_foundation` — `frost_window`
- `fusion_living_archive` — `morning_dew_dropper`
- `fusion_lucid_record` — `name_reel`
- `fusion_overclock_tool` — `repair_spanner`
- `fusion_thermal_window` — `frost_window`
- `fusion_street_foundation` — `repair_spanner`
- `fusion_posted_memory` — `name_reel`

### Synthesis Hold1

- `synth_spanner_magnet` — `repair_spanner`

### Awakening Hold1

- `awake_noa_divergent_tool` — `repair_spanner`

これらは削除しない。Base Weaponのreadability / differentiation / performance検証後に上流Baseが再選定された場合だけ、Transformation側も再評価する。

## Selected29

### Fusion Selected11

Hold4を含まないFusionだけを残す。

主なもの:

- 火送りの夜扇 — FIRE + WIND / `ember_spread`
- 雨鳴りの音叉 — WATER + THUNDER / `arc_chain`
- 薄明の黒扇 — LIGHT + DARK / `eclipse_break`
- 書き直された一行 — MEMORY + BLANK / `rewrite`
- 帰星の鏡 — STAR + LIGHT / `beacon`
- 悪夢の帳 — DARK + DREAM / `nightmare`
- 星路の紙ひこうき
- 焼き継ぎの糸車
- 余白のビー玉
- 月眠りの環
- 灯る境界線

ReactionそのものとFusionは同義ではない。
Base Holdにより対応FusionがHoldでも、Reaction学習や別Buildを削除しない。

### Synthesis Selected11

Synthesisは同じBase Weaponの役割を曲げる分岐。

Selected例:

- 夜鉛筆 → やわらか芯
- ビー玉 → ひび景
- 火種箱 → 長芯
- 送り扇 → 重骨
- 銅の音叉 → 絶縁布
- 押花札 → 綴じ紐
- 夢時計 → 無音針
- 鏡 → 煤け鏡
- 消しゴム → 青面
- 境界チョーク → 赤印
- 眠り紐 → 鈴端

`repair_spanner`だけはBase Holdのため、そのSynthesisもHoldする。

### Awakening Selected7

Awakeningは通常の素材合成ではなくCharacter/story条件を伴う個別到達候補。

Selected:

- `awake_nagi_closed_moon`
- `awake_michiru_home_star`
- `awake_tomori_repair_fire`
- `awake_hana_kept_flower`
- `awake_kuroori_open_fold`
- `awake_gen_old_needle`
- `awake_lum_private_scratch`

Hold:

- `awake_noa_divergent_tool`

Noaの設定を削除するわけではない。入力の`repair_spanner`がTitle1 Base Holdなので、Transformationだけ先行させない。

## Current21 Kit boundary

`currentCharacterCombatKitSource.ts` で既にAwakening candidateへ接続されているCurrent21 Characterについては、リンク先がBase Hold4で塞がれていないことをCIで保証する。

Current Characterの個別Kitを作った後に、そのAwakeningをTransformation選別で偶然消す事故を防ぐ。

ただし:

- linked candidate = runtime implemented
- linked candidate = unlocked
- linked candidate = Canon final form

ではない。

## Why upstream dependency matters

Transformationを単独で選定すると、例えば:

- Base `frost_window` はmobile線密度でHold
- なのに `fusion_thermal_window` だけTitle1採用

という矛盾が起きる。

Selection Sourceは各Transformationの`inputWeaponIds`をBase24 / Hold4へ機械接続する。

未知のBase Weapon IDが出た場合はfail closedする。

## Hold is not deletion

Hold9は:

- Candidate reservoirに残る
- storyMeaningを残す
- VFX案を残す
- 後のTitle / DLC / 再選定候補になれる

一方でTitle1 selected graphからは外す。

`heldTransformationsDeleted = false`

を固定する。

## Runtime boundary

Selected29もlive runtimeではない。

必要な別工程:

1. Transformation unlock schema
2. Fusion/Synthesis/Awakeningそれぞれのruntime trigger
3. weapon replacement / inventory mutation
4. save migration
5. duplicate / rollback handling
6. VFX and audio assets
7. mobile readability
8. numerical balance
9. playtest
10. Character story trigger QA

`runtimeAutoPromotionAllowed = false`。
