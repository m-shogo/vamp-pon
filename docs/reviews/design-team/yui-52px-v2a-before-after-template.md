# Template: Yui 52px V2a GUI Hand-finish — Before / After Review

このファイルは **記入用テンプレート**。GUI手仕上げを1回まわすごとに複製して使う
（例: `yui-52px-v2a-hf-pass1-review.md`）。複製先で `__` を埋める。

iteration history: A/B/C → v2（V2a採用）→ GUI手仕上げ pass __

handoff: [yui-52px-v2a-gui-handfinish-handoff.md](./yui-52px-v2a-gui-handfinish-handoff.md)

---

## Asset

- before（V2a 素のLua bootstrap）: `public/assets/prototypes/yui_idle_52_v2a.png`
- after（GUI手仕上げ）: `public/assets/prototypes/yui_idle_52_v2a_hf.png`（記入時に差し替え）
- after source: `assets/source/prototypes/yui_idle_52_v2a_hf.aseprite`
- 確認シート: `public/assets/prototypes/yui_idle_52_v2a_hf_review_sheet.png`

> before/after は必ず**同一スケール・同一背景**で並べること（1x と 6x の両方）。

## Target score

80 / 100（master合格ライン。production 昇格判断はこれ以上が前提）

## Current score（before → after）

| 項目 | before(V2a) | after(手仕上げ) | メモ |
| --- | ---: | ---: | --- |
| 1x readability        | 4 | __ |  |
| reference match       | 4 | __ |  |
| charm appeal          | 4 | __ |  |
| mascot silhouette     | 3 | __ | masterは作品の顔。4以上必須 |
| merchandise potential | 3 | __ | グッズ化に耐えるか。4以上必須 |
| gameplay visibility   | 4 | __ |  |
| background separation | 4 | __ |  |
| final confidence      | 3 | __ | 手仕上げ後 4 以上で昇格検討可 |
| **合成（/100）**       | 80 | __ |  |

## Missing points for 80（after で埋め残した差分）

- __（埋まっていない手仕上げ指示 #__ を記載）

## GUI手仕上げ証跡（Asepriteで実際に手作業した修正一覧）

> 「Lua再生成しただけ」は証跡にならない。GUIで彫った差分を列挙する。

- [ ] #1 hood幅 左右各1px内へ / top sheen 3pxクラスタ化 — __
- [ ] #2 hand 指3本 + 握り影1px — __
- [ ] #3 arm 袖上面 DRESS_HI / 下面 DRESS_SH 各1px — __
- [ ] #4 lantern 暖色リム1px / glow最外周1px落とし — __
- [ ] #5 eyes 白1px clean dot / 下まぶた SKIN_SH 1px — __
- [ ] #6 hair 前髪3クラスタ化 — __
- [ ] #7 neck 顎下 SKIN_SH 1px 首影 — __
- [ ] #8 rim 左肩エッジ1px（控えめ）— __
- 使用ツール / 操作（鉛筆・選択・色 index 等）: __

## 確認画面チェック（1x / 6x / 夜背景 / 欠片 / hitCore）

- [ ] 1x readability: ユイと一目で分かる / 目が潰れない
- [ ] 6x: 指・首影・前髪クラスタ・袖陰影が破綻しない
- [ ] 夜背景: リム＋1pxアウトラインで輪郭が立つ
- [ ] インク斑背景: 黒だまりに溶けない
- [ ] 欠片近接: 暖色ランタンとクール生成り欠片が混同しない / glow非干渉
- [ ] hitCore中心: 中心点にglowが届かない / 中心読みクリーン

## Keep（afterで維持できているか）

- 右腕＋手でランタン把持 / 首・襟・肩 / charmの核 / tight glow / 中心離し / 1pxアウトライン

## Discard（afterで持ち込んでいないか）

- きのこフード / 浮くランタン / 2pxアウトライン / 過剰な目 / glow誤魔化し

## Production touched

yes / no（__ を残す）。**no が原則**。
production sprite（`public/assets/sprites/player/`）/ production source（`assets/source/aseprite/player/`）/
gameplay定数（`src/game/domain/constants.ts` の PLAYER_DEFAULTS / visualSize / radius / hitCore 等）に
**変更がないこと**を必ず確認:

```sh
pnpm prototype:verify
pnpm player:protected:verify
pnpm design:review:verify
```

> この段階は review / handoff。production / preview へは接続しない。

## Final decision

次のいずれかを記入:

- `iterate` … after が 80未満、または final confidence ≤ 3、または NG残存
- `prototype-pass` … 改善はしたが昇格条件未達（GUI証跡はあるが基準に届かない）
- `production-candidate に昇格可` … [handoff §6](./yui-52px-v2a-gui-handfinish-handoff.md) の昇格条件を**全て**満たした時のみ
  （GUI手作業証跡あり / 80点以上 / final confidence ≥ 4 / mascot silhouette・merchandise ≥ 4 /
   全確認パス / production touched=no）

決定: __
理由: __
