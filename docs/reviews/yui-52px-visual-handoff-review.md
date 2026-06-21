# ユイ 52px Visual Handoff Review

この視覚ハンドオフ（pixel layout / expression / lantern & costume）が、
c10e6c0 の失敗をどう構造的に避けるかの記録。

対象ドキュメント:
- [../player/yui-52px-pixel-layout-guide.md](../player/yui-52px-pixel-layout-guide.md)
- [../player/yui-52px-expression-guide.md](../player/yui-52px-expression-guide.md)
- [../player/yui-52px-lantern-and-costume-guide.md](../player/yui-52px-lantern-and-costume-guide.md)

前提:
- [yui-idle-production-revert-note.md](yui-idle-production-revert-note.md)（c10e6c0 失敗の記録）
- [yui-next-production-readiness-plan.md](yui-next-production-readiness-plan.md)（production ゲート）

---

## 1. c10e6c0 の失敗（再掲）

- 「Aseprite手仕上げ」と言いつつ実態は Lua bootstrap だった。
- temporary candidate / GUI未実施なのに production を更新した。
- charm/appeal が低いまま production に入った。
- 結果として「青いキノコ」化（フードが顔と体を潰した）。

---

## 2. この視覚ハンドオフがどう失敗を避けるか

| c10e6c0 の失敗 | 今回の防ぎ方 | 該当ガイド |
| --- | --- | --- |
| 青いキノコ化 | フード縦 ≤ y23(≤45%)・最大幅~33px の上限を数値で固定。顔開口 y9〜22/幅~20px(≥20%) を死守。違反は「先に進まない」判定 | layout §2,§3 |
| フードが顔を潰す | 顔の最小幅16px、顔中心 ~(25,17) を明示。フード優先で顔を削らない | layout §3 |
| ランタンが浮く | 肩→袖→手→取っ手→ケージの連続を必須化。「1pxでも隙間があると浮く」と明記 | lantern A-2 |
| 服が三角形 | dress 台形＋脚・靴を必ず見せるをシルエット条件に。三角錐を NG 化 | layout §4 / costume B-4 |
| 目が点で終わる | 目 縦6〜7px・キャッチライト位置・眉/口で表情を作る具体指示 | expression §1,§2 |
| script の楕円に見える | 前髪の束/折り/陰影を1px調整箇所として列挙。べた塗り禁止 | layout §6 / costume B-1,B-3 |
| 1xは読めるが拡大で可愛くない | 1xで省略してよい物 / 4x-6xで残す物 を分離 | layout §5,§6 |
| temporary を production 化 | 本ハンドオフは sprite を作らない。production 反映は readiness ゲート（全>=4・GUI手仕上げ済み）必須 | readiness-plan |
| 萌え/記号に倒れる | 「静かで放っておけない可愛さ」を基準に、萌え顔 NG を列挙 | expression §6,§7 |

---

## 3. 今回作ったもの / 作っていないもの

作ったもの:
- 52px の具体ピクセル座標・占有範囲・比率の上限下限
- 「少し不安だけど優しい」表情の具体手順と萌え NG
- ランタン接続・ケージ・記憶の光・hitCore 誤認回避・服・しおり紐・靴・cloak の具体指示

作っていないもの（今回の絶対禁止）:
- sprite / prototype PNG（生成していない）
- Lua/script による sprite（作っていない）
- Aseprite source（作っていない）
- production source / production PNG への変更（なし）

> 本書群は「描く前の指示」。これ自体は完成素材ではなく、final-candidate でもない。

---

## 4. 次工程の条件

1. [../player/yui-aseprite-gui-handoff.md](../player/yui-aseprite-gui-handoff.md) の作業順（シルエット→顔→ランタン→服）で、本ハンドオフの座標を使って GUI 手仕上げ。
2. 各段階で 1x / 4x / 暗背景を確認。シルエット段階で §4 の4条件を満たすまで先に進まない。
3. [../player/yui-merchandise-character-checklist.md](../player/yui-merchandise-character-checklist.md) と [../pixel-art-quality-gate.md](../pixel-art-quality-gate.md) で採点。
4. [yui-next-production-readiness-plan.md](yui-next-production-readiness-plan.md) のゲート（全項目>=4・GUI手仕上げ済み・before/after・combat mock）を全て満たすまで production を更新しない。

---

## 5. 注意（制作者/エージェントへ）

- headless / CLI 環境では GUI 1px 手仕上げはできない。その場合は「できない」と明記し、draft 据え置きにする。script bootstrap を手仕上げと偽らない（c10e6c0 の直接原因）。
- commit message と実態を一致させる。
