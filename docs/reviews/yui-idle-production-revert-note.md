# Yui Idle Production Revert Note

## 対象

main の commit `c10e6c0`「ユイidleをAseprite手仕上げで再調整」による production 反映を戻す。

## なぜ戻すか

`c10e6c0` は production commit として不適切だった。

- commit message は「Aseprite手仕上げ」だが、実態は Lua bootstrap（script生成）だった
- commit 本文でも `STATUS: temporary candidate` / GUI手仕上げ未実施 / GUI確認要 と自己申告していた
- それにもかかわらず production source と production PNG を更新していた
- これは以下のルール違反:
  - `AGENTS.md` 5章「Aseprite hand-finish rule」(GUI手仕上げ・各種確認なしに final 扱いしない)
  - `docs/aseprite-hand-finish-workflow.md`（`.aseprite` があるだけでは hand-final ではない / scriptそのままは `bootstrap`/`temporary`）
  - `docs/pixel-art-quality-gate.md`（charm/appeal が低い素材を production に入れない）

実物も「青いキノコ」状態で charm/appeal が弱く、production 品質に達していなかった。

## 対応

production の2ファイルだけを `c10e6c0` の親 `3059df2` の状態へ戻した。

戻したファイル:

- `assets/source/aseprite/player/yui_idle.aseprite`
- `public/assets/sprites/player/yui_idle_42.png`

戻していない（保持する）ファイル:

- `assets/source/aseprite/player/prototypes/yui_idle_pre_v5_backup.aseprite`
- `assets/source/aseprite/player/prototypes/yui_idle_v5_candidate.aseprite`
- `scripts/aseprite/build-yui-idle-v5-candidate.lua`

## v5 candidate の扱い

上記 v5 candidate 系ファイルは **rejected / temporary prototype** として残す。

- status: rejected prototype（production不採用）
- 理由: charm/appeal が弱く（自己採点 2）、「青いキノコ」状態。GUI手仕上げ未実施。
- 残す目的: 失敗例 / 経緯の記録、および 42px の構造参考のため。
- これを production へ再反映しないこと。

後続の改善 draft は別 branch にある:

- `art/yui-idle-v6-draft`（42px 改善 draft）
- `art/yui-idle-52-draft`（52px master draft）

## 触っていないもの

- gameplay定数（radius / visualSize / hp / moveSpeed / invulnSec / pickup magnet / hitCore / debugHitCircle）
- `yui_move_42` / `yui_hurt_42` / `yui_ultimate_42`
- v6 draft branch / 52px draft branch

## 確認

- `git diff --stat`: production 2ファイルのみ復元（下記 commit 参照）
- `pnpm assets:verify`
- `pnpm test`
- `pnpm build`

## 現在の production 状態

`yui_idle_42.png` は v5（青いキノコ）反映前の状態に戻っている。
これは「完成品」ではなく、あくまで v5 反映前の素材。
本命改善は v6 draft / 52px master draft のレビュー後に GUI手仕上げを経て反映する。
